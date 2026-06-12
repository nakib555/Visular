import { CSSSubCategory } from "../../../../types-css";

export const compositingAndBlendingGroup: CSSSubCategory = {
  name: "Compositing and Blending",
  properties: [
    {
      name: "mix-blend-mode",
      values:
        "normal | multiply | screen | overlay | darken | lighten | color-dodge | color-burn | hard-light | soft-light | difference | exclusion | hue | saturation | color | luminosity | plus-lighter | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "isolation",
      values:
        "auto | isolate | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
