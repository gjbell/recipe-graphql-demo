MATCH (n:Ingredient)
 WHERE n.name CONTAINS 'coconut'
 RETURN n