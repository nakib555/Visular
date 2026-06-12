import { CSSSubCategory } from "../../../../types-css";

export const flowOrientationGroup: CSSSubCategory = {
  name: "Flow & Orientation",
  properties: [
    {
      name: "writing-mode",
      values:
        "horizontal-tb | vertical-rl | vertical-lr | sideways-rl | sideways-lr | initial | inherit",
    },
    {
      name: "direction",
      values: "ltr | rtl | initial | inherit",
    },
    {
      name: "text-orientation",
      values:
        "mixed | upright | sideways | sideways-right | use-glyph-orientation | initial | inherit",
    },
    {
      name: "unicode-bidi",
      values:
        "normal | embed | isolate | bidi-override | isolate-override | plaintext | initial | inherit",
    },
  ],
};
