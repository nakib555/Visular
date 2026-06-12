import { CSSSubCategory } from "../../../../types-css";

export const directionWritingModeGroup: CSSSubCategory = {
  name: "Direction & Writing Mode",
  properties: [
    {
      name: "writing-mode",
      values: "horizontal-tb | vertical-rl | vertical-lr",
    },
    {
      name: "direction",
      values: "ltr | rtl",
    },
    {
      name: "text-orientation",
      values: "mixed | upright | sideways",
    },
    {
      name: "unicode-bidi",
      values:
        "normal | embed | bidi-override | isolate | isolate-override | plaintext",
    },
  ],
};
