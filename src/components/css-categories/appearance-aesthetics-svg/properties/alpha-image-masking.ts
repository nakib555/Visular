import { CSSSubCategory } from "../../../../types-css";

export const alphaImageMaskingGroup: CSSSubCategory = {
  name: "Alpha & Image Masking",
  properties: [
    {
      name: "mask",
      values:
        "<mask-layer># | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "mask-image",
      values:
        "none | <mask-reference># | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "mask-mode",
      values:
        "match-source | luminance | alpha | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "mask-repeat",
      values:
        "repeat-x | repeat-y | [repeat | space | round | no-repeat]# | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "mask-position",
      values: "<position># | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "mask-clip",
      values:
        "[ <geometry-box> | no-clip ]# | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "mask-origin",
      values:
        "<geometry-box># | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "mask-size",
      values: "<bg-size># | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "mask-composite",
      values:
        "add | subtract | intersect | exclude | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "mask-type",
      values:
        "luminance | alpha | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
