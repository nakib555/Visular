import { CSSCategory } from "../../types-css";
import { Palette } from "lucide-react";

export const graphicsStackingIsolationCategory: CSSCategory = {
    name: "GRAPHICS & STACKING ISOLATION",
    icon: Palette,
    subCategories: [
      {
        name: "Compositing and Blending",
        properties: [
          { name: "mix-blend-mode", values: "normal | multiply | screen | overlay | darken | lighten | color-dodge | color-burn | hard-light | soft-light | difference | exclusion | hue | saturation | color | luminosity | plus-lighter | initial | inherit | revert | revert-layer | unset" },
          { name: "isolation", values: "auto | isolate | initial | inherit | revert | revert-layer | unset" }
        ]
      },
      {
        name: "Object Modeling",
        properties: [
          { name: "paint-order", values: "normal | [ fill || stroke || markers ] | initial | inherit | revert | revert-layer | unset" }
        ]
      }
    ]
  };
