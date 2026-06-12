import { CSSSubCategory } from "../../../../types-css";

export const gridContainerGroup: CSSSubCategory = {
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
};
