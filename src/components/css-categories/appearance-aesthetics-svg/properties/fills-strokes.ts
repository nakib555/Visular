import { CSSSubCategory } from "../../../../types-css";

export const fillsStrokesGroup: CSSSubCategory = {
  name: "Fills & Strokes",
  properties: [
    {
      name: "fill",
      values:
        "<color> | url(#id) | none | context-fill | context-stroke | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "fill-opacity",
      values:
        "<number> | <percentage> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "fill-rule",
      values:
        "nonzero | evenodd | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "stroke",
      values:
        "<color> | url(#id) | none | context-fill | context-stroke | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "stroke-width",
      values:
        "<length> | <percentage> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "stroke-opacity",
      values:
        "<number> | <percentage> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "stroke-linecap",
      values:
        "butt | round | square | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "stroke-linejoin",
      values:
        "miter | miter-clip | round | bevel | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "stroke-miterlimit",
      values: "<number> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "stroke-dasharray",
      values:
        "none | <length-percentage># | initial | inherit | revert | revert-layer | unset",
      note: "e.g., 5px, 5px 10px, 10% 20%",
    },
    {
      name: "stroke-dashoffset",
      values:
        "<length> | <percentage> | initial | inherit | revert | revert-layer | unset",
      note: "e.g., 5px, 10%",
    },
  ],
};
