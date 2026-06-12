import { CSSSubCategory } from "../../../../types-css";

export const lineBreakingHyphenationGroup: CSSSubCategory = {
  name: "Line Breaking & Hyphenation",
  properties: [
    {
      name: "hyphens",
      values:
        "none | manual | auto | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "hyphenate-character",
      values:
        "auto | <string> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "hyphenate-limit-chars",
      values:
        "auto | <integer>{1,3} | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "line-break",
      values:
        "auto | loose | normal | strict | anywhere | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "word-break",
      values:
        "normal | break-all | keep-all | break-word | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "white-space-collapse",
      values:
        "collapse | discard | preserve | preserve-breaks | preserve-spaces | break-spaces | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "text-wrap",
      values:
        "wrap | nowrap | balance | pretty | stable | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "overflow-wrap",
      values:
        "normal | break-word | anywhere | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
