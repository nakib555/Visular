import { CSSSubCategory } from "../../../../types-css";

export const layoutBreakingGroup: CSSSubCategory = {
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
      values: "<integer> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "widows",
      values: "<integer> | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
