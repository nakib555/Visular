import { CSSSubCategory } from "../../../../types-css";

export const spatialNavigationDirectionGroup: CSSSubCategory = {
  name: "Spatial Navigation Direction",
  properties: [
    {
      name: "nav-up",
      values:
        "auto | <id> [ current | root | <target-name> ]? | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "nav-down",
      values:
        "auto | <id> [ current | root | <target-name> ]? | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "nav-left",
      values:
        "auto | <id> [ current | root | <target-name> ]? | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "nav-right",
      values:
        "auto | <id> [ current | root | <target-name> ]? | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
