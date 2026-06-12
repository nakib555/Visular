import { CSSSubCategory } from "../../../../types-css";

export const subgridTemplatesGroup: CSSSubCategory = {
  name: "Subgrid Templates",
  properties: [
    {
      name: "grid-template-columns",
      values:
        "none | <track-list> | <auto-track-list> | subgrid <line-name-list>? | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "grid-template-rows",
      values:
        "none | <track-list> | <auto-track-list> | subgrid <line-name-list>? | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
