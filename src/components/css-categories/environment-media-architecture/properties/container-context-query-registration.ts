import { CSSSubCategory } from "../../../../types-css";

export const containerContextQueryRegistrationGroup: CSSSubCategory = {
  name: "Container Context & Query Registration",
  properties: [
    {
      name: "container-type",
      values: "normal | size | inline-size | inherit | initial | unset",
    },
    {
      name: "container-name",
      values: "none | <custom-ident> | inherit | initial | unset",
      note: "e.g., --card-item, sidebar-container",
    },
    {
      name: "container",
      values:
        "none | <container-name> / <container-type> | inherit | initial | unset",
      note: "e.g., wrapper-element / inline-size",
    },
  ],
};
