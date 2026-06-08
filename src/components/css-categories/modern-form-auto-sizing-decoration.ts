import { CSSCategory } from "../../types-css";
import { Layout } from "lucide-react";

export const modernFormAutoSizingDecorationCategory: CSSCategory = {
    name: "MODERN FORM AUTO-SIZING & DECORATION",
    icon: Layout,
    subCategories: [
      {
        name: "Input Sizing & Appearance",
        properties: [
          { name: "field-sizing", values: "fixed | content | initial | inherit | revert | revert-layer | unset" },
          { name: "appearance", values: "none | auto | textfield | menulist-button | <compat-auto> | initial | inherit | revert | revert-layer | unset" }
        ]
      },
      {
        name: "Decoration",
        properties: [
          { name: "accent-color", values: "auto | <color> | initial | inherit | revert | revert-layer | unset" },
          { name: "caret-color", values: "auto | <color> | initial | inherit | revert | revert-layer | unset" },
          { name: "caret-shape", values: "auto | bar | block | underscore | initial | inherit | revert | revert-layer | unset" },
          { name: "caret", values: "<caret-color> || <caret-shape> | initial | inherit | revert | revert-layer | unset" }
        ]
      }
    ]
  };
