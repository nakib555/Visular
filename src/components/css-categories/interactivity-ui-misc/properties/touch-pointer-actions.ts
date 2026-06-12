import { CSSSubCategory } from "../../../../types-css";

export const touchPointerActionsGroup: CSSSubCategory = {
  name: "Touch & Pointer Actions",
  properties: [
    {
      name: "touch-action",
      values:
        "auto | none | [ [ pan-x | pan-left | pan-right ] || [ pan-y | pan-up | pan-down ] || pinch-zoom ] | manipulation | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "pointer-events",
      values:
        "auto | none | visiblePainted | visibleFill | visibleStroke | visible | painted | fill | stroke | all | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
