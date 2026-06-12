import { CSSSubCategory } from "../../../../types-css";

export const transformLegacyShorthandOriginGroup: CSSSubCategory = {
  name: "Transform Legacy Shorthand & Origin",
  properties: [
    {
      name: "transform",
      values:
        "none | <transform-list> (e.g. translate(10px, 20px) rotate(45deg) scale(1.5))",
    },
    {
      name: "transform-origin",
      values:
        "center | top | bottom | left | right | <length> | <percentage> | [left | center | right] [top | center | bottom]",
    },
  ],
};
