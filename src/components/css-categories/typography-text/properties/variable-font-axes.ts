import { CSSSubCategory } from "../../../../types-css";

export const variableFontAxesGroup: CSSSubCategory = {
  name: "Variable Font Axes",
  properties: [
    {
      name: "font-variation-settings",
      values:
        "normal | [ <string> <number> ]# | initial | inherit | revert | revert-layer | unset",
      note: "e.g., 'wght' 700, 'wdth' 120",
    },
    {
      name: "font-optical-sizing",
      values: "auto | none | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "font-stretch",
      values:
        "normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded | <percentage> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "font-style",
      values:
        "normal | italic | oblique <angle>? | initial | inherit | revert | revert-layer | unset",
      note: "e.g., oblique 14deg",
    },
    {
      name: "font-weight",
      values:
        "normal | bold | lighter | bolder | <number> | initial | inherit | revert | revert-layer | unset",
      note: "e.g., 350",
    },
  ],
};
