const fs = require("fs");
const request = require("request-promise-native");
const { parseString: parseXmlString } = require("xml2js");
const { promisify } = require("util");
const stream = require("stream");
const { once } = require("events");

const parseXmlStringAsync = promisify(parseXmlString);
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const finished = promisify(stream.finished);

async function generateUrlMap() {
  const writable = fs.createWriteStream("epicurious.txt", { encoding: "utf8" });

  const rootSitemapXml = await parseXmlStringAsync(
    await request("https://www.epicurious.com/sitemap.xml/editorial-recipes")
  );

  const childSitemapUrls = rootSitemapXml.sitemapindex.sitemap.map(
    s => s.loc[0]
  );

  for (const url of childSitemapUrls) {
    try {
      const childSitemapXml = await parseXmlStringAsync(await request(url));

      if (
        childSitemapXml &&
        childSitemapXml.urlset &&
        childSitemapXml.urlset.url
      ) {
        const recipeUrls = childSitemapXml.urlset.url.map(u => u.loc[0]);

        for await (const url of recipeUrls) {
          if (!writable.write(url + "\n")) {
            await once(writable, "drain");
          }
        }
      } else {
        console.warn(`skipped url ${url}`);
      }

      await wait(1000);
    } catch (e) {
      console.error(`errored at ${url}`);
      throw e;
    }
  }

  writable.end();

  await finished(writable);
}

generateUrlMap();
