import React, { MouseEventHandler } from "react";
import "./ingredient-tag.css";

function hashCode(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function pickColor(value: string): string {
  // based on https://stackoverflow.com/a/49562686
  return `hsl(${hashCode(value) % 360}, 80%, 90%)`;
}

const IngredientTag = ({
  ingredientName,
  style,
  onClick
}: {
  ingredientName: string;
  style?: React.CSSProperties;
  onClick?: MouseEventHandler<HTMLElement>;
}): JSX.Element => {
  return (
    <li
      className="ingredient-tag"
      style={{ backgroundColor: pickColor(ingredientName), ...style }}
      onClick={onClick}
      title={ingredientName}
    >
      {ingredientName}
    </li>
  );
};

export default IngredientTag;
