import { CSSSubCategory } from "../../../../types-css";

export const anchorPositioningGroup: CSSSubCategory = {
  name: "Anchor Positioning",
  properties: [
    {
      name: "anchor-name",
      values:
        "none | <dashed-ident># | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "anchor-scope",
      values:
        "none | all | <dashed-ident># | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "position-anchor",
      values:
        "<anchor-name> | auto | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
