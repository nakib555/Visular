import { CSSSubCategory } from "../../../../types-css";

export const logicalDocumentFlowPositionWritingModeAgnosticGroup: CSSSubCategory =
  {
    name: "Logical Document Flow Position (Writing-Mode Agnostic)",
    properties: [
      {
        name: "inset-block / inset-block-start / inset-block-end",
        values:
          "auto | <length> (all absolute, relative, viewport, container units e.g. 1rem, 50svh) | <percentage> | <math-function> | <anchor-function>",
      },
      {
        name: "inset-inline / inset-inline-start / inset-inline-end",
        values:
          "auto | <length> (all absolute, relative, viewport, container units e.g. 20px, 100dvw) | <percentage> | <math-function> | <anchor-function>",
      },
    ],
  };
