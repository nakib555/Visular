import { CSSCategory } from "../../types-css";
import { Eye } from "lucide-react";

export const accessibilityReadingFlowControlCategory: CSSCategory = {
    name: "ACCESSIBILITY & READING FLOW CONTROL",
    icon: Eye,
    subCategories: [
      {
        name: "Sequential Navigation",
        properties: [
          { name: "reading-flow", values: "normal | flex-visual | flex-flow | grid-rows | grid-columns | grid-order | initial | inherit | revert | revert-layer | unset" }
        ]
      },
      {
        name: "Spatial Navigation Direction",
        properties: [
          { name: "nav-up", values: "auto | <id> [ current | root | <target-name> ]? | initial | inherit | revert | revert-layer | unset" },
          { name: "nav-down", values: "auto | <id> [ current | root | <target-name> ]? | initial | inherit | revert | revert-layer | unset" },
          { name: "nav-left", values: "auto | <id> [ current | root | <target-name> ]? | initial | inherit | revert | revert-layer | unset" },
          { name: "nav-right", values: "auto | <id> [ current | root | <target-name> ]? | initial | inherit | revert | revert-layer | unset" }
        ]
      },
      {
        name: "Spatial Navigation Action",
        properties: [
          { name: "spatial-navigation-action", values: "auto | focus | scroll | initial | inherit | revert | revert-layer | unset" },
          { name: "spatial-navigation-contain", values: "auto | contain | initial | inherit | revert | revert-layer | unset" },
          { name: "spatial-navigation-function", values: "normal | grid | initial | inherit | revert | revert-layer | unset" }
        ]
      }
    ]
  };
