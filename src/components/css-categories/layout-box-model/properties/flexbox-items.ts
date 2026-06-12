import { CSSSubCategory } from "../../../../types-css";

export const flexboxItemsGroup: CSSSubCategory = {
  name: "Flexbox Items",
  properties: [
    {
      name: "flex-grow",
      values: "<number> | calc(...)",
      note: "e.g., 0, 1, 2.5",
    },
    {
      name: "flex-shrink",
      values: "<number> | calc(...)",
      note: "e.g., 0, 1, 3",
    },
    {
      name: "flex-basis",
      values:
        "auto | content | max-content | min-content | fit-content | <length> | <percentage>",
    },
    {
      name: "align-self",
      values:
        "auto | normal | flex-start | flex-end | center | baseline | stretch | start | end",
    },
    {
      name: "order",
      values: "<integer>",
      note: "e.g., 0, 1, 99, -1, -99",
    },
  ],
};
