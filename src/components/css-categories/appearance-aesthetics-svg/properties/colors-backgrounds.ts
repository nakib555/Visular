import { CSSSubCategory } from "../../../../types-css";

export const colorsBackgroundsGroup: CSSSubCategory = {
  name: "Colors & Backgrounds",
  properties: [
    {
      name: "color",
      values: "<color-name> | <hex> | <rgb/rgba> | <hsl> | transparent",
      note: "e.g., red, #ff0000, rgba(0,0,0,0.5)",
    },
    {
      name: "background-color",
      values: "<color> | transparent",
    },
    {
      name: "background-image",
      values: 'none | url("...") | linear-gradient(...) | radial-gradient(...)',
    },
    {
      name: "background-size",
      values: "auto | cover | contain | <length/percentage>",
      note: "e.g., 100% 50%",
    },
    {
      name: "background-position",
      values: "center | top left | bottom right | <percentage>",
      note: "e.g., 50% 50%",
    },
    {
      name: "background-repeat",
      values: "repeat | no-repeat | repeat-x | repeat-y",
    },
    {
      name: "opacity",
      values: "<number>",
      note: "0.0 to 1.0 (e.g. 0.5)",
    },
  ],
};
