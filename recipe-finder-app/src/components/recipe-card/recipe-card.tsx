import React, { useState, MouseEventHandler } from "react";
import "./recipe-card.css";
import IngredientTag from "./ingredient-tag/ingredient-tag";
import { Recipe } from "../../model/recipe";

const DESCRIPTION_CHARACTER_LIMIT = 120;

function getDescription(instructions: string[]): string {
  const description = instructions.join(" ");
  return description.length > DESCRIPTION_CHARACTER_LIMIT
    ? description.slice(0, DESCRIPTION_CHARACTER_LIMIT - 3) + "..."
    : description;
}

function includesTerm(value: string, terms: string[]): boolean {
  return terms.some((t) => value.includes(t));
}

const RecipeCard = ({
  recipe,
  searchTerms,
  onClick,
  selected,
}: {
  recipe: Recipe;
  searchTerms: string[];
  onClick?: MouseEventHandler<HTMLElement>;
  selected?: boolean;
}): JSX.Element => {
  const [ingredientsExpanded, setIngredientsExpanded] = useState(false);

  const ingredients = recipe.ingredients
    .filter((r) => r.name.trim())
    .sort((a, b) => {
      if (
        includesTerm(a.name, searchTerms) &&
        includesTerm(b.name, searchTerms)
      ) {
        return 0;
      } else if (includesTerm(a.name, searchTerms)) {
        return -1;
      } else if (includesTerm(b.name, searchTerms)) {
        return 1;
      } else {
        return 0;
      }
    });
  const ingredientTags = (ingredientsExpanded
    ? ingredients
    : ingredients.slice(0, 5)
  ).map((i, index) => {
    const highlight = includesTerm(i.name, searchTerms);
    return (
      <IngredientTag
        ingredientName={i.name}
        key={index}
        style={highlight ? { backgroundColor: "#00aa00" } : undefined}
      ></IngredientTag>
    );
  });

  if (!ingredientsExpanded && ingredients.length > 5) {
    ingredientTags.push(
      <IngredientTag
        ingredientName={`+${ingredients.length - 5} more`}
        style={{ backgroundColor: "#ddd", cursor: "pointer" }}
        onClick={(): void => setIngredientsExpanded(true)}
        key={-1}
      ></IngredientTag>
    );
  }

  const cardStyle = selected ? { backgroundColor: "#ddd" } : {};

  return (
    <article className="card" onClick={onClick} style={cardStyle}>
      <header>
        <h2>
          <a href={recipe.url}>{recipe.name}</a>
        </h2>
      </header>
      <div className="content">
        <p className="card-description">
          {getDescription(recipe.instructions)}
        </p>
        <ul className="app-tags">{ingredientTags}</ul>
      </div>
    </article>
  );
};

export default RecipeCard;
