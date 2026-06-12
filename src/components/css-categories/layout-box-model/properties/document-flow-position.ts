import { CSSSubCategory } from "../../../../types-css";

export const documentFlowPositionGroup: CSSSubCategory = {
  name: "Document Flow Position",
  properties: [
    {
      name: "position",
      values: "static | relative | absolute | fixed | sticky",
    },
    {
      name: "top / right / bottom / left",
      values:
        "auto | <length: absolute> (e.g. 10px, 2cm, 5mm, 0.25in, 12pt, 1pc, 40Q) | <length: relative-font> (e.g. 1.5em, 2rem, 3ex, 5ch, 2lh, 2rlh) | <length: viewport> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100svh, 100lvh, 100dvh) | <length: container-query> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 50%, 100%) | <math-function> (e.g. calc(100% - 50px), min(10vw, 20px), max(2rem, 30px), clamp(10px, 5vw, 50px)) | <environment-variable> (e.g. env(safe-area-inset-top)) | <anchor-function> (e.g. anchor(top), anchor(--my-anchor bottom), anchor-size(width))",
    },
    {
      name: "inset",
      values:
        "auto | <length> (e.g. 10px, 1rem 2rem, 10px 5px 15px 20px) | <percentage> (e.g. 10% 5%) | <math-function> (e.g. calc(100svh - 20px))",
    },
  ],
};
