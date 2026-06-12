import { CSSSubCategory } from "../../../../types-css";

export const perspectiveSettingGroup: CSSSubCategory = {
  name: "Perspective Setting",
  properties: [
    {
      name: "perspective",
      values:
        "none | <length> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "perspective-origin",
      values: "<position> | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
