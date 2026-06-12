import { CSSSubCategory } from "../../../../types-css";

export const textDecorationSystemsGroup: CSSSubCategory = {
  name: "Text Decoration Systems",
  properties: [
    {
      name: "text-decoration-line",
      values:
        "none | underline | overline | line-through | blink | underline overline | underline line-through",
    },
    {
      name: "text-decoration-color",
      values:
        "<color-keyword> (e.g. red) | <color-hex> (e.g. #ff0000) | <color-rgb> | <color-hsl> | <color-oklch> | currentcolor",
    },
    {
      name: "text-decoration-style",
      values: "solid | double | dotted | dashed | wavy",
    },
    {
      name: "text-decoration-thickness",
      values:
        "auto | from-font | <length-absolute> (e.g. 2px) | <length-relative-font> (e.g. 0.1em) | <percentage>",
    },
    {
      name: "text-underline-offset",
      values:
        "auto | <length-absolute> (e.g. 3px) | <length-relative-font> (e.g. 0.25em) | <percentage>",
    },
    {
      name: "text-underline-position",
      values: "auto | under | left | right | under left | under right",
    },
  ],
};
