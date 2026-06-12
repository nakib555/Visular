import { CSSSubCategory } from "../../../../types-css";

export const textEmphasisEffectsGroup: CSSSubCategory = {
  name: "Text Emphasis & Effects",
  properties: [
    {
      name: "text-emphasis-style",
      values:
        'none | filled | open | dot | circle | double-circle | triangle | sesame | <string> (e.g. "x") | filled dot | open circle',
    },
    {
      name: "text-emphasis-color",
      values:
        "<color-keyword> | <color-hex> | <color-rgb> | <color-hsl> | <color-oklch> | currentcolor",
    },
    {
      name: "text-emphasis-position",
      values:
        "over | under | over right | over left | under right | under left",
    },
    {
      name: "text-shadow",
      values:
        "none | <length-offset-x> <length-offset-y> <color> | <length-offset-x> <length-offset-y> <length-blur> <color>",
    },
  ],
};
