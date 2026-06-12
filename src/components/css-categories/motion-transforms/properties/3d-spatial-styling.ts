import { CSSSubCategory } from "../../../../types-css";

export const spatialStyling3dGroup: CSSSubCategory = {
  name: "3D Spatial Styling",
  properties: [
    {
      name: "transform-style",
      values:
        "flat | preserve-3d | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "backface-visibility",
      values:
        "visible | hidden | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
