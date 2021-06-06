export interface Recipe {
  url: string;
  name: string;
  instructions: string[];
  ingredients: { name: string }[];
}
