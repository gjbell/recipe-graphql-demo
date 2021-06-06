
WITH "http://localhost/import-test.json" AS url
CALL apoc.load.json(url) YIELD value

MERGE (recipe:Recipe {url:value.url}) ON CREATE
  SET recipe.name = value.name, recipe.instructions = value.instructions, recipe.servings = value.servings

FOREACH (ingredientName IN value.ingredients | MERGE (ingredient:Ingredient {name:ingredientName}) MERGE (recipe)-[:REQUIRES]->(ingredient))