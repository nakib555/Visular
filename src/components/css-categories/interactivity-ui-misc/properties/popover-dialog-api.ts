import { CSSSubCategory } from "../../../../types-css";

export const popoverDialogApiGroup: CSSSubCategory = {
  name: "Popover & Dialog API",
  properties: [
    {
      name: "popover",
      values:
        "auto | manual | none | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "overlay",
      values: "auto | none | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
