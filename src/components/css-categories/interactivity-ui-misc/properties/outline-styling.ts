import { CSSSubCategory } from "../../../../types-css";

export const outlineStylingGroup: CSSSubCategory = {
  name: "Outline Styling",
  properties: [
    {
      name: "outline",
      values:
        "<outline-color> || <outline-style> || <outline-width> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "outline-width",
      values:
        "thin | medium | thick | <length> | initial | inherit | revert | revert-layer | unset",
      note: "e.g., 2px, 0.2em",
    },
    {
      name: "outline-style",
      values:
        "auto | none | dotted | dashed | solid | double | groove | ridge | inset | outset | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "outline-color",
      values:
        "<color> | invert | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "outline-offset",
      values: "<length> | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
