import { CSSSubCategory } from "../../../../types-css";

export const textAlignmentJustificationSpacingGroup: CSSSubCategory = {
  name: "Text Alignment, Justification & Spacing",
  properties: [
    {
      name: "text-align",
      values:
        "start | end | left | right | center | justify | justify-all | match-parent",
    },
    {
      name: "text-align-last",
      values: "auto | start | end | left | right | center | justify",
    },
    {
      name: "text-justify",
      values: "auto | none | inter-word | inter-character | distribute",
    },
    {
      name: "line-height",
      values:
        "normal | <number> (e.g. 1.5, 1.2) | <length-absolute> (e.g. 24px) | <length-relative-font> (e.g. 1.8em, 1.6rem) | <length-relative-viewport> (e.g. 3vw) | <percentage> (e.g. 150%)",
    },
    {
      name: "letter-spacing",
      values:
        "normal | <length-absolute> (e.g. 1px) | <length-relative-font> (e.g. 0.05em, 0.1rem)",
    },
    {
      name: "word-spacing",
      values:
        "normal | <length-absolute> (e.g. 4px) | <length-relative-font> (e.g. 0.25em, 0.3rem) | <percentage> (e.g. 50%)",
    },
    {
      name: "text-indent",
      values:
        "<length-absolute> (e.g. 20px) | <length-relative-font> (e.g. 2em, 1.5rem) | <percentage> (e.g. 5%) | each-line | hanging | each-line hanging | hanging each-line",
    },
  ],
};
