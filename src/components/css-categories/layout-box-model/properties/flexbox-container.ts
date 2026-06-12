import { CSSSubCategory } from "../../../../types-css";

export const flexboxContainerGroup: CSSSubCategory = {
  name: "Flexbox Container",
  properties: [
    {
      name: "flex-direction",
      values: "row | row-reverse | column | column-reverse",
    },
    {
      name: "justify-content",
      values:
        "normal | flex-start | flex-end | center | space-between | space-around | space-evenly | start | end | left | right",
    },
    {
      name: "align-items",
      values:
        "normal | stretch | flex-start | flex-end | center | baseline | start | end",
    },
    {
      name: "flex-wrap",
      values: "nowrap | wrap | wrap-reverse",
    },
    {
      name: "gap",
      values: "normal | <length> | <percentage> | calc(...) | clamp(...)",
      note: "e.g., 16px, 1rem, 5%",
    },
  ],
};
