import { CSSSubCategory } from "../../../../types-css";

export const viewTransitionApiGroup: CSSSubCategory = {
  name: "View Transition API",
  properties: [
    {
      name: "view-transition-name",
      values:
        "none | <custom-ident> | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
