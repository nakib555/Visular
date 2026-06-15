import { CSSCategory } from "../../types-css";
import { Layers } from "lucide-react";

export const viewTransitionsCategory: CSSCategory = {
    name: "VIEW TRANSITIONS",
    icon: Layers,
    subCategories: [
      {
        name: "View Transition API",
        properties: [
          {
            name: "view-transition-name",
            values:
              "none | <custom-ident> | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
    ],
  };
