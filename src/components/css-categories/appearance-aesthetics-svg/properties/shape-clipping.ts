import { CSSSubCategory } from "../../../../types-css";

export const shapeClippingGroup: CSSSubCategory = {
  name: "Shape Clipping",
  properties: [
    {
      name: "clip-path",
      values:
        "none | <clip-source> | [ <geometry-box> || <basic-shape> ] | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
