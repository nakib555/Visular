import { CSSSubCategory } from "../../../../types-css";

export const gridItemsGroup: CSSSubCategory = {
  name: "Grid Items",
  properties: [
    {
      name: "grid-column",
      values:
        "auto | <integer> | <custom-ident> | <integer> / <integer> | span <integer> | span <custom-ident>",
    },
    {
      name: "grid-row",
      values:
        "auto | <integer> | <custom-ident> | <integer> / <integer> | span <integer> | span <custom-ident>",
    },
    {
      name: "grid-area",
      values:
        "auto | <custom-name> | <row-start> / <column-start> / <row-end> / <column-end>",
    },
    {
      name: "justify-self",
      values:
        "auto | normal | stretch | center | start | end | flex-start | flex-end | self-start | self-end | left | right | baseline | first baseline | last baseline",
    },
    {
      name: "align-self",
      values:
        "auto | normal | stretch | center | start | end | flex-start | flex-end | self-start | self-end | baseline | first baseline | last baseline",
    },
  ],
};
