import { CSSSubCategory } from "../../../../types-css";

export const overflowMechanicsGroup: CSSSubCategory = {
  name: "Overflow Mechanics",
  properties: [
    {
      name: "overflow",
      values:
        "visible | hidden | clip | scroll | auto | <overflow-x> <overflow-y> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "overflow-x",
      values:
        "visible | hidden | clip | scroll | auto | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "overflow-y",
      values:
        "visible | hidden | clip | scroll | auto | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "overflow-inline",
      values:
        "visible | hidden | clip | scroll | auto | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "overflow-block",
      values:
        "visible | hidden | clip | scroll | auto | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "overflow-clip-margin",
      values:
        "<length> | <visual-box> || <length> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "text-overflow",
      values:
        "clip | ellipsis | <string> | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
