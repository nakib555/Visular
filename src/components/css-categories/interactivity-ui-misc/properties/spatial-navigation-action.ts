import { CSSSubCategory } from "../../../../types-css";

export const spatialNavigationActionGroup: CSSSubCategory = {
  name: "Spatial Navigation Action",
  properties: [
    {
      name: "spatial-navigation-action",
      values:
        "auto | focus | scroll | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "spatial-navigation-contain",
      values:
        "auto | contain | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "spatial-navigation-function",
      values:
        "normal | grid | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
