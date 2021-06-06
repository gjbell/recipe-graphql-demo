const { promises: fs } = require("fs");
const { splitMeasurements } = require("./split-measurements");

/**
 *
 * @param {Array<string>} recipeFiles
 */
async function formatData(recipeFiles) {
  for (const file of recipeFiles) {
    const raw = await fs.readFile(file, { encoding: "utf8" });
    const jsonRecipes = JSON.parse(raw);

    const formattedRecipes = jsonRecipes.map(recipe => ({
      ...recipe,
      ingredients: recipe.ingredients
        .map(splitMeasurements)
        .map(i => i.ingredient)
    }));

    console.log(JSON.stringify(formattedRecipes, null, 4));
  }
}

formatData([
  "output/epicurious.json"
  // "output/bbcgoodfood-current.json"
]);
