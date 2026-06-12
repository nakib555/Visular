import { CSSSubCategory } from "../../../../types-css";

export const tableLayoutStructureGroup: CSSSubCategory = {
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
      values: "show | hide | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "caption-side",
      values:
        "top | bottom | block-start | block-end | inline-start | inline-end | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
