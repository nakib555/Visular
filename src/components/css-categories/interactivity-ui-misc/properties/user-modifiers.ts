import { CSSSubCategory } from "../../../../types-css";

export const userModifiersGroup: CSSSubCategory = {
  name: "User Modifiers",
  properties: [
    {
      name: "user-select",
      values:
        "auto | text | none | contain | all | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "user-drag",
      values:
        "auto | none | element | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
