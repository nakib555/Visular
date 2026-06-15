import { CSSCategory } from "../../types-css";
import { Maximize } from "lucide-react";

export const layoutCategory: CSSCategory = {
    name: "LAYOUT",
    icon: Maximize,
    subCategories: [
      {
        name: "Display Mode",
        properties: [
          {
            name: "display",
            values:
              "block | inline-block | inline | flex | inline-flex | grid | inline-grid | flow-root | contents | none | table | table-row | table-cell | list-item",
          },
        ],
      },
      {
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
          { name: "flex-wrap", values: "nowrap | wrap | wrap-reverse" },
          {
            name: "gap",
            values: "normal | <length> | <percentage> | calc(...) | clamp(...)",
            note: "e.g., 16px, 1rem, 5%",
          },
        ],
      },
      {
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
      },
      {
        name: "Grid Container",
        properties: [
          {
            name: "grid-template-columns",
            values: "none | subgrid | masonry | <track-list>",
          },
          {
            name: "grid-template-rows",
            values: "none | subgrid | masonry | <track-list>",
          },
          {
            name: "justify-items",
            values:
              "normal | stretch | center | start | end | flex-start | flex-end | self-start | self-end | left | right | legacy",
          },
          {
            name: "align-items",
            values:
              "normal | stretch | center | start | end | flex-start | flex-end | self-start | self-end | baseline",
          },
        ],
      },
      {
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
        ],
      },
    ],
  };
