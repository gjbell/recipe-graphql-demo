import React, { MouseEventHandler } from "react";
import "./similar-recipes.css";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Spinner } from "../spinner/spinner";

const RELATED_QUERY = gql`
  query getRelated($recipeId: ID!) {
    Recipe(url: $recipeId) {
      similar {
        url
        name
      }
    }
  }
`;

export const SimilarRecipes = ({
  recipeId,
  onClose,
}: {
  recipeId: string;
  onClose?: MouseEventHandler<HTMLElement>;
}): JSX.Element => {
  const { loading, error, data } = useQuery(RELATED_QUERY, {
    variables: { recipeId: recipeId },
  });

  const related: [
    {
      url: string;
      name: string;
    }
  ] = !loading && data && data.Recipe && data.Recipe[0].similar;

  return (
    <div className="similar-recipes">
      <div className="header">
        <h3>Similar Recipes</h3>
        <button onClick={onClose}>Close</button>
      </div>
      <ol>
        {related &&
          related.map((r) => (
            <li key={r.url}>
              <a href={r.url}>{r.name}</a>
            </li>
          ))}
      </ol>
      {loading && <Spinner />}
      {error && <pre>{error.message}</pre>}
    </div>
  );
};
