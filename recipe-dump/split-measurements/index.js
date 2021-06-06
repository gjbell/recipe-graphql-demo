const { MeasuresMap } = require("./data/measures-map");
const { FractionsMap } = require("./data//fractions-map");

const digits = new Set([
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
  "/",
  " ",
  `"`,
]);

/**
 * @param {string} ingredientString
 */
function getLastConsecutiveNumberIndex(ingredientString) {
  const foundIndex = Array.from(ingredientString).findIndex((c) => {
    return !(digits.has(c) || FractionsMap[c]);
  });

  return foundIndex < 1 ? 0 : foundIndex;
}

/**
 *
 * @param {string} ingredientString
 */
function splitMeasurements(ingredientString) {
  ingredientString = ingredientString.toLowerCase().trim();

  const measureValueIndex = getLastConsecutiveNumberIndex(ingredientString);
  const measureValue = ingredientString.slice(0, measureValueIndex).trim();

  const words = ingredientString
    .slice(measureValueIndex)
    .replace(".", "")
    .replace(",", "")
    .split(" ");

  const measureType = words.find((w) => MeasuresMap[w]);

  const ingredientStartIndex = measureType
    ? ingredientString.indexOf(measureType) + measureType.length
    : measureValueIndex;

  let ingredient = ingredientString.slice(ingredientStartIndex).trim();

  // handle alternate measurements
  // e.g 3/4 cup (1 1/2 sticks) butter
  if (ingredient.indexOf("(") === 0 && ingredient.indexOf(")") > 0) {
    ingredient = ingredient.slice(ingredient.indexOf(")") + 1);
  }

  [",", ".", "(", " or "].forEach((char) => {
    // remove character from beginning
    if (ingredient.indexOf(char) === 0) {
      ingredient = ingredient.slice(1);
    }

    const charIndex = ingredient.indexOf(char);
    // remove characters inside string
    if (charIndex > 0) {
      ingredient = ingredient.slice(0, charIndex);
    }
  });

  ingredient = ingredient.trim();

  return {
    measure: {
      value: FractionsMap[measureValue] || measureValue,
      type: MeasuresMap[measureType] || measureType || "",
    },
    ingredient: ingredient,
    original: ingredientString,
  };
}

console.log(splitMeasurements("1 (14.5-oz.) can coconut milk"));
console.log(splitMeasurements(`1 2" piece ginger, peeled, coarsely chopped`));
console.log(splitMeasurements("1/2 red onion, thinly sliced"));

module.exports = { splitMeasurements };
