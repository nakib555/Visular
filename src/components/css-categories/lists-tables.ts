import { CSSCategory } from "../../types-css";
import { List } from "lucide-react";

export const listsTablesCategory: CSSCategory = {
    name: "LISTS & TABLES",
    icon: List,
    subCategories: [
      {
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
      },
      {
        name: "Counters",
        properties: [
          {
            name: "counter-reset",
            values:
              "none | [<custom-ident> <integer>?]+ | reversed(<custom-ident>) <integer>? | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "counter-increment",
            values:
              "none | [<custom-ident> <integer>?]+ | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "counter-set",
            values:
              "none | [<custom-ident> <integer>?]+ | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
      {
        name: "Table Layout & Structure",
        properties: [
          {
            name: "table-layout",
            values:
              "auto | fixed | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "border-collapse",
            values:
              "collapse | separate | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "border-spacing",
            values:
              "<length> | <length> <length> | initial | inherit | revert | revert-layer | unset",
            note: "e.g., 10px, 1rem 0.5rem",
          },
          {
            name: "empty-cells",
            values:
              "show | hide | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "caption-side",
            values:
              "top | bottom | block-start | block-end | inline-start | inline-end | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
    ],
  };
