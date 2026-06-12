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
        "normal | stretch | center | start | end | flex-start | flex-end | self-start | self-end | anchor-center | baseline | first baseline | last baseline | safe center | safe start | safe end | safe flex-start | safe flex-end | safe self-start | safe self-end | unsafe center | unsafe start | unsafe end | unsafe flex-start | unsafe flex-end | unsafe self-start | unsafe self-end | inherit | initial | revert | revert-layer | unset",
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
