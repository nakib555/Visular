import { CSSSubCategory } from "../../../../types-css";

export const overscrollBehaviorGroup: CSSSubCategory = {
  name: "Overscroll Behavior",
  properties: [
    {
      name: "scroll-behavior",
      values:
        "auto | smooth | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "overscroll-behavior",
      values:
        "auto | contain | none | <overscroll-behavior-x> <overscroll-behavior-y> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "overscroll-behavior-x",
      values:
        "auto | contain | none | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "overscroll-behavior-y",
      values:
        "auto | contain | none | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "overscroll-behavior-inline",
      values:
        "auto | contain | none | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "overscroll-behavior-block",
      values:
        "auto | contain | none | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
