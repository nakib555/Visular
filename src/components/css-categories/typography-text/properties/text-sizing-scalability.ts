import { CSSSubCategory } from "../../../../types-css";

export const textSizingScalabilityGroup: CSSSubCategory = {
  name: "Text Sizing & Scalability",
  properties: [
    {
      name: "font-size",
      values:
        "xx-small | x-small | small | medium | large | x-large | xx-large | xxx-large | smaller | larger | <length-absolute> (e.g. 16px, 12pt) | <length-relative-font> (e.g. 1.5em, 1.2rem, 12ch, 2lh, 2rlh) | <length-relative-viewport> (e.g. 4vw, 3vh, 3svh, 2dvw) | <length-container> (e.g. 5cqw, 4cqh, 3cqmin) | <percentage> (e.g. 120%)",
    },
    {
      name: "font-size-adjust",
      values:
        "none | ex-height | cap-height | ch-width | ic-width | <number> (e.g. 0.5, 0.485) | from-font",
    },
    {
      name: "font-stretch",
      values:
        "normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded | <percentage-range-50-200> (e.g. 75%, 120%)",
    },
  ],
};
