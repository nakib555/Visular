import { CSSSubCategory } from "../../../../types-css";

export const svgTextPositioningGroup: CSSSubCategory = {
  name: "SVG Text Positioning",
  properties: [
    {
      name: "text-anchor",
      values:
        "start | middle | end | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "dominant-baseline",
      values:
        "auto | text-bottom | alphabetic | ideographic | middle | central | mathematical | hanging | text-top | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "alignment-baseline",
      values:
        "auto | baseline | before-edge | text-before-edge | middle | central | after-edge | text-after-edge | ideographic | alphabetic | hanging | mathematical | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "baseline-shift",
      values:
        "sub | super | <length> | <percentage> | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
