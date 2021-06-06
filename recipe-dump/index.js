const fs = require("fs");
const readline = require("readline");
const recipeScraper = require("recipe-scraper");
const stream = require("stream");
const { once } = require("events");
const { promisify } = require("util");

const finished = promisify(stream.finished);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SCRAPE_DELAY = 500;
const MAX_CONSECUTIVE_ERRORS = 1000;
const PROGRESS_STEP_FREQUENCY = 10;

const output = [];

async function scrapeWebsite(websiteName, inputFilename, outputFilename) {
  const outputStream = fs.createWriteStream(outputFilename, {
    encoding: "utf8",
  });

  const urlStream = readline.createInterface({
    input: fs.createReadStream(inputFilename),
    crlfDelay: Infinity,
  });

  let totalCount = 0;
  let step = 0;
  let consecutiveErrors = 1;

  outputStream.write("[\n");

  for await (const recipeUrl of urlStream) {
    try {
      const recipe = await recipeScraper(recipeUrl);
      recipe.url = recipeUrl;
      const outputJson = JSON.stringify(recipe, null, 4) + ",";

      if (!outputStream.write(outputJson)) {
        await once(outputStream, "drain");
      }
    } catch (e) {
      console.error(`Failed to scrape ${recipeUrl}`, e);
      consecutiveErrors++;

      if (consecutiveErrors > MAX_CONSECUTIVE_ERRORS) {
        console.error("FATAL: Reached max consecutive errors");
        throw e;
      }
    }

    step++;
    totalCount++;
    consecutiveErrors = consecutiveErrors > 1 ? consecutiveErrors - 1 : 0;

    if (step >= PROGRESS_STEP_FREQUENCY) {
      console.log(`${websiteName} - scraped ${totalCount} recipes`);
      step = 0;
    }

    await wait(SCRAPE_DELAY);
  }

  outputStream.write("]\n");
  await finished(outputStream);
}

async function main() {
  const scrapers = [
    // scrapeWebsite(
    //   "BBC Good Food",
    //   "bbcgoodfood.txt",
    //   "output/bbcgoodfood.json"
    // ),
    scrapeWebsite("Epicurious", "epicurious.txt", "output/epicurious.json"),
  ];

  await Promise.all(scrapers);
  console.log("Finished scraping");

  console.log(output);
}

main();
