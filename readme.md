# Recipe Finder GraphQL Demo
Originally written in February 2020 to demo GraphQL & Neo4j capabilities. Users can search and find related recipes based on a list of ingredients.

https://user-images.githubusercontent.com/6509207/120928754-ee1ecc80-c6dd-11eb-9d0d-540e0b85d0bd.mp4



## Projects
#### [`recipe-api`](./recipe-api)
GraphQL API powered by NodeJS and Neo4j. Provides an API for searching recipes via ingredients and finding similiar recipes (based on ingredients). Based on the [GRANDstack starter](https://github.com/grand-stack/grand-stack-starter).

#### [`recipe-finder-app`](./recipe-finder-app) 
Quick and simple react front end for the recipe-api.

#### [`recipe-dump`](./recipe-dump) 
Scrapes and formats recipes from target websites. Supports Epicurious and BBC Goodfood (with a URL list).


## Project Setup
1. Scrape recipes using recipe-dump
    ```
    cd ./recipe-dump
    npm install
    npm run generate
    npm run start
    npm run format
    ```
2. Import scraped recipes in to Neo4j
3. Configure the API environment settings. See `./recipe-api/.env.example` for an example.
4. Run the API
5. Run the front end (recipe-finder-app)
