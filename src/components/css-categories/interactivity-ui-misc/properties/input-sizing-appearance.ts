import { CSSSubCategory } from "../../../../types-css";

export const inputSizingAppearanceGroup: CSSSubCategory = {
  name: "Input Sizing & Appearance",
  properties: [
    {
      name: "field-sizing",
      values:
        "fixed | content | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "appearance",
      values:
        "none | auto | textfield | menulist-button | <compat-auto> | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
