import { CSSCategory } from "../../types-css";
import { Layers } from "lucide-react";

export const popupsDialogsDiscreteAnimationsCategory: CSSCategory = {
    name: "POPUPS, DIALOGS & DISCRETE ANIMATIONS",
    icon: Layers,
    subCategories: [
      {
        name: "Popover & Dialog API",
        properties: [
          { name: "popover", values: "auto | manual | none | initial | inherit | revert | revert-layer | unset" },
          { name: "overlay", values: "auto | none | initial | inherit | revert | revert-layer | unset" },
        ]
      },
      {
        name: "Discrete Transition Animations",
        properties: [
          { name: "transition-behavior", values: "normal | allow-discrete | initial | inherit | revert | revert-layer | unset" }
        ]
      }
    ]
  };
