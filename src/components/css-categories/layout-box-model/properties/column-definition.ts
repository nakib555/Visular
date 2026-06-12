import { CSSSubCategory } from "../../../../types-css";

export const columnDefinitionGroup: CSSSubCategory = {
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
      values: "none | all | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
