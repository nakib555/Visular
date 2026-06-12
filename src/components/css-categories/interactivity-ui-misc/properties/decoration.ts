import { CSSSubCategory } from "../../../../types-css";

export const decorationGroup: CSSSubCategory = {
  name: "Decoration",
  properties: [
    {
      name: "accent-color",
      values:
        "auto | <color> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "caret-color",
      values:
        "auto | <color> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "caret-shape",
      values:
        "auto | bar | block | underscore | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "caret",
      values:
        "<caret-color> || <caret-shape> | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
