import { CSSCategory } from "../../types-css";
import { Pointer } from "lucide-react";

export const touchGestureInteractionsCategory: CSSCategory = {
    name: "TOUCH & GESTURE INTERACTIONS",
    icon: Pointer,
    subCategories: [
      {
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
      },
      {
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
      },
    ],
  };
