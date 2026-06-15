import { CSSCategory } from "../../types-css";
import { Type } from "lucide-react";

export const advancedTypographyCategory: CSSCategory = {
    name: "ADVANCED TYPOGRAPHY",
    icon: Type,
    subCategories: [
      {
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
      },
      {
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
      },
      {
        name: "Ruby & Quotes",
        properties: [
          {
            name: "ruby-position",
            values:
              "over | under | inter-character | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "ruby-align",
            values:
              "start | center | space-between | space-around | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "quotes",
            values:
              "none | auto | [ <string> <string> ]+ | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
    ],
  };
