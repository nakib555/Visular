import { CSSCategory } from "../../types-css";
import { Settings } from "lucide-react";

export const globalValuesResetsCategory: CSSCategory = {
    name: "GLOBAL VALUES & RESETS",
    icon: Settings,
    subCategories: [
      {
        name: "All Property Reset",
        properties: [
          { name: "all", values: "initial | inherit | revert | revert-layer | unset" }
        ]
      }
    ]
  };
