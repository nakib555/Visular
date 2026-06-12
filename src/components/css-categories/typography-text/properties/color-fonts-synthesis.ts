import { CSSSubCategory } from "../../../../types-css";

export const colorFontsSynthesisGroup: CSSSubCategory = {
  name: "Color Fonts & Synthesis",
  properties: [
    {
      name: "font-palette",
      values:
        "normal | light | dark | <palette-identifier> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "font-synthesis",
      values:
        "none | [ weight || style || small-caps || position ] | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "font-synthesis-weight",
      values: "auto | none | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "font-synthesis-style",
      values: "auto | none | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "font-synthesis-small-caps",
      values: "auto | none | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "font-synthesis-position",
      values: "auto | none | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
