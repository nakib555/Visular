import { CSSSubCategory } from "../../../../types-css";

export const stackOrderGroup: CSSSubCategory = {
  name: "Stack Order",
  properties: [
    {
      name: "z-index",
      values:
        "auto | <integer> (e.g. 1, 999, -10, 999999) | <math-function> (e.g. calc(3 + 2))",
    },
  ],
};
