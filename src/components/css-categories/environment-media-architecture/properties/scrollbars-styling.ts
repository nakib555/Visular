import { CSSSubCategory } from "../../../../types-css";

export const scrollbarsStylingGroup: CSSSubCategory = {
  name: "Scrollbars Styling",
  properties: [
    {
      name: "scrollbar-color",
      values:
        "auto | <color> <color> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "scrollbar-width",
      values:
        "auto | thin | none | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "scrollbar-gutter",
      values:
        "auto | stable | stable both-edges | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
