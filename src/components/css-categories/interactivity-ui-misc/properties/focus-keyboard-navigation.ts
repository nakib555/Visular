import { CSSSubCategory } from "../../../../types-css";

export const focusKeyboardNavigationGroup: CSSSubCategory = {
  name: "Focus & Keyboard Navigation",
  properties: [
    {
      name: "outline",
      values:
        "none | <outline-width> || <outline-style> || <outline-color> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "outline-offset",
      values: "<length> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "nav-up / nav-down / nav-left / nav-right",
      values:
        "auto | <id> [ current | root | <target-name> ]? | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
