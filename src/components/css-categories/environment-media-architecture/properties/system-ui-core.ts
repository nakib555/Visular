import { CSSSubCategory } from "../../../../types-css";

export const systemUiCoreGroup: CSSSubCategory = {
  name: "System UI & Core",
  properties: [
    {
      name: "zoom",
      values:
        "normal | reset | <number> | <percentage> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "appearance",
      values:
        "none | auto | menulist-button | textfield | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "color-scheme",
      values:
        "normal | [ light | dark | <custom-ident> ]+ | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "forced-color-adjust",
      values:
        "auto | none | preserve-parent-color | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "app-region",
      values:
        "none | drag | no-drag | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "-webkit-font-smoothing",
      values:
        "auto | none | antialiased | subpixel-antialiased | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
