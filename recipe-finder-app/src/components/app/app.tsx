import { useQuery } from "@apollo/react-hooks";
import { gql, OperationVariables } from "apollo-boost";
import React, { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/use-debounce";
import RecipeCard from "../recipe-card/recipe-card";
import "./app.css";
import { SimilarRecipes } from "../similar-recipes/similar-recipes";
import { Spinner } from "../spinner/spinner";
import { Recipe } from "../../model/recipe";

/*
{
  Recipe(
    filter: {
      AND:
      [
      	{ingredients_some: {name_contains: "egg"}},
      	{ingredients_some: {name_contains: "capers"}}
    	]
    }
  ) {
    name
    ingredients {
      name
    }
  }
}
*/

const RECIPE_QUERY = gql`
  query getRecipes($filter: _RecipeFilter!) {
    Recipe(filter: $filter, first: 10) {
      url
      name
      instructions
      ingredients {
        name
      }
    }
  }
`;

const transformSearchTerms = (terms: string[]): OperationVariables => {
  return {
    AND: terms.map((t) => ({
      // eslint-disable-next-line @typescript-eslint/camelcase
      ingredients_some: { name_contains: t.trim() },
    })),
  };
};
function noTransform<T>(v: T): T {
  return v;
}

const App = (): JSX.Element => {
  const [search, setSearch] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const [searchTerms, setSearchTerms] = useState([""]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    setSelectedRecipe("");

    const searchTerms = search.toLowerCase().split("+");
    setSearchTerms(searchTerms.map((t) => t.trim()));
    setNeedRefresh(true);
  }, [search]);

  const debouncedSeach = useDebounce(searchTerms, 300, transformSearchTerms);

  const { loading, error, data } = useQuery(RECIPE_QUERY, {
    variables: { filter: debouncedSeach },
  });
  useEffect(() => {
    if (!loading) {
      setNeedRefresh(false);
    }
  }, [loading, data]);

  const debouncedLoading = useDebounce(loading, 500, noTransform, true);
  const isLoading = loading || debouncedLoading || needRefresh;

  const searchResults: Recipe[] =
    !isLoading && debouncedSeach && data && data["Recipe"];

  return (
    <div className="app-container">
      <div className="search-container">
        <header className="app-header">
          <h1 className="app-title">FindARecipe</h1>

          <input
            className="app-search-input"
            type="text"
            placeholder="🔎︎ type an ingredient name"
            value={search}
            onChange={(event): void => {
              setSearch(event.target.value);
            }}
          ></input>
        </header>
        <ul className="app-search-result-container">
          {isLoading && <Spinner />}
          {searchTerms[0] &&
            !loading &&
            searchResults &&
            searchResults.map((d) => {
              const selected = selectedRecipe === d.url;
              return (
                <li key={d.url}>
                  <RecipeCard
                    recipe={d}
                    searchTerms={searchTerms}
                    selected={selected}
                  ></RecipeCard>
                  {!selected && (
                    <div
                      className="app-search-result-expand"
                      onClick={(): void => setSelectedRecipe(d.url)}
                    >
                      {"▶"}
                      <br />
                      More like this
                    </div>
                  )}
                </li>
              );
            })}
        </ul>

        <footer>Created by Gareth Bell. Recipes from EpiCurious</footer>
      </div>
      {selectedRecipe && (
        <SimilarRecipes
          recipeId={selectedRecipe}
          onClose={(): void => {
            setSelectedRecipe("");
          }}
        ></SimilarRecipes>
      )}
      {error && <p>{error.message}</p>}
    </div>
  );
};

export default App;
