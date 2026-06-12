import { CSSSubCategory } from "../../../../types-css";

export const listStylingGroup: CSSSubCategory = {
  name: "List Styling",
  properties: [
    {
      name: "list-style",
      values:
        "<list-style-type> || <list-style-position> || <list-style-image> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "list-style-type",
      values:
        "none | disc | circle | square | decimal | decimal-leading-zero | lower-roman | upper-roman | lower-greek | lower-latin | upper-latin | armenian | georgian | lower-alpha | upper-alpha | <string> | <custom-ident> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "list-style-position",
      values:
        "inside | outside | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "list-style-image",
      values:
        "none | url(...) | <image> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "marker-side",
      values:
        "match-self | match-parent | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
