import { CSSSubCategory } from "../../../../types-css";

export const advancedAnchorAreaPlacementGroup: CSSSubCategory = {
  name: "Advanced Anchor Area Placement",
  properties: [
    {
      name: "position-area",
      values:
        "none | top | bottom | left | right | center | span-all | block-start | block-end | inline-start | inline-end | <combinations> (e.g. top left, center right, block-start inline-end)",
    },
  ],
};
