import { CSSSubCategory } from "../../../../types-css";

export const outerSpacingPhysicalDimensionGroup: CSSSubCategory = {
  name: "Outer Spacing (Physical Dimension)",
  properties: [
    {
      name: "margin",
      values:
        "auto | <absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
    },
  ],
};
