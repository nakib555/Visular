import { CSSCategory } from "../../types-css";
import { Columns } from "lucide-react";

export const multiColumnLayoutBreaksCategory: CSSCategory = {
    name: "MULTI-COLUMN & LAYOUT BREAKS",
    icon: Columns,
    subCategories: [
      {
        name: "Column Definition",
        properties: [
          {
            name: "columns",
            values:
              "<column-width> || <column-count> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "column-count",
            values:
              "auto | <integer> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "column-width",
            values:
              "auto | <length> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "column-fill",
            values:
              "auto | balance | balance-all | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "column-span",
            values:
              "none | all | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
      {
        name: "Column Gaps & Rules",
        properties: [
          {
            name: "column-gap",
            values:
              "normal | <length> | <percentage> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "column-rule",
            values:
              "<column-rule-width> || <column-rule-style> || <column-rule-color> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "column-rule-color",
            values:
              "<color> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "column-rule-style",
            values:
              "none | hidden | dotted | dashed | solid | double | groove | ridge | inset | outset | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "column-rule-width",
            values:
              "thin | medium | thick | <length> | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
      {
        name: "Layout Breaking",
        properties: [
          {
            name: "break-before",
            values:
              "auto | avoid | always | all | avoid-page | page | left | right | recto | verso | avoid-column | column | avoid-region | region | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "break-after",
            values:
              "auto | avoid | always | all | avoid-page | page | left | right | recto | verso | avoid-column | column | avoid-region | region | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "break-inside",
            values:
              "auto | avoid | avoid-page | avoid-column | avoid-region | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "box-decoration-break",
            values:
              "slice | clone | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "orphans",
            values:
              "<integer> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "widows",
            values:
              "<integer> | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
    ],
  };
