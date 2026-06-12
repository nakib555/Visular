import { CSSSubCategory } from "../../../../types-css";

export const positionFallbacksVisibilityGroup: CSSSubCategory = {
  name: "Position Fallbacks & Visibility",
  properties: [
    {
      name: "position-try-fallbacks",
      values:
        "none | flip-block | flip-inline | flip-start | top | bottom | left | right | <dashed-ident> (e.g. --my-fallback-option) | <combinations> (e.g. flip-block, flip-inline)",
    },
    {
      name: "position-try-order",
      values:
        "normal | most-width | most-height | most-block-size | most-inline-size",
    },
    {
      name: "position-visibility",
      values: "always | anchors-visible | no-overflow",
    },
  ],
};
