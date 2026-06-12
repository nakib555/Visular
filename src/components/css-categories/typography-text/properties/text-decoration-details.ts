import { CSSSubCategory } from "../../../../types-css";

export const textDecorationDetailsGroup: CSSSubCategory = {
  name: "Text Decoration Details",
  properties: [
    {
      name: "text-decoration-thickness",
      values:
        "auto | from-font | <length> | <percentage> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "text-underline-offset",
      values:
        "auto | <length> | <percentage> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "text-underline-position",
      values:
        "auto | from-font | [ under || [ left | right ] ] | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "text-decoration-skip-ink",
      values:
        "auto | all | none | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
