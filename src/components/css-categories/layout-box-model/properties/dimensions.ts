import { CSSSubCategory } from "../../../../types-css";

export const dimensionsGroup: CSSSubCategory = {
  name: "Dimensions",
  properties: [
    {
      name: "width / height",
      values:
        "auto | max-content | min-content | fit-content | stretch | <length-absolute> (e.g. px, cm, mm, in, pc, pt, Q) | <length-font-relative> (e.g. em, rem, ex, ch, cap, ic, lh, rlh) | <length-viewport> (e.g. vw, vh, vmin, vmax, vi, vb) | <length-container-query> (e.g. cqw, cqh, cqi, cqb, cqmin, cqmax) | <percentage> (e.g. 0%, 50%, 100%) | <math-function> (e.g. calc(), min(), max(), clamp())",
    },
    {
      name: "aspect-ratio",
      values:
        "auto | <ratio> (e.g. 1 / 1, 16 / 9, 4 / 3, 1.5) | auto <ratio> (e.g. auto 16 / 9) | <ratio> auto (e.g. 1 / 1 auto)",
    },
  ],
};
