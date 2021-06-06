MATCH (recipe:Recipe)-[:REQUIRES]->(ingredient)
WHERE recipe.url = 'https://www.epicurious.com/recipes/food/views/steamed-winter-veggie-bowls'
WITH collect(recipe) as data
CALL algo.similarity.overlap.stream(data)
YIELD item1, item2, count1, count2, intersection, similarity
RETURN algo.asNode(item1).name AS from, algo.asNode(item2).name AS to,
       count1, count2, intersection, similarity
ORDER BY similarity DESC

MATCH (recipe:Recipe)-[:REQUIRES]->(ingredient)
WITH {item:id(recipe), categories: collect(id(ingredient))} as userData
WITH collect(userData) as data
CALL algo.similarity.jaccard.stream(data)
YIELD item1, item2, similarity
WHERE algo.asNode(item1).url = 'https://www.epicurious.com/recipes/food/views/steamed-winter-veggie-bowls'
return algo.asNode(item1).name AS from, algo.asNode(item2).name AS to, similarity
ORDER BY similarity DESC