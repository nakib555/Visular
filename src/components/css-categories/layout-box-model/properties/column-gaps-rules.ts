import { CSSSubCategory } from "../../../../types-css";

export const columnGapsRulesGroup: CSSSubCategory = {
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
      values: "<color> | initial | inherit | revert | revert-layer | unset",
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
};
