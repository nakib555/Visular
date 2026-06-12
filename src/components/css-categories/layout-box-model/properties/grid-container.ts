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
        "normal | stretch | center | start | end | flex-start | flex-end | self-start | self-end | anchor-center | baseline | first baseline | last baseline | safe center | safe start | safe end | safe flex-start | safe flex-end | safe self-start | safe self-end | unsafe center | unsafe start | unsafe end | unsafe flex-start | unsafe flex-end | unsafe self-start | unsafe self-end | inherit | initial | revert | revert-layer | unset",
    },
  ],
};
