import { CSSCategory } from "../../types-css";
import { Layers } from "lucide-react";

export const containerQueriesContainmentCategory: CSSCategory = {
    name: "CONTAINER QUERIES & CONTAINMENT",
    icon: Layers,
    subCategories: [
      {
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
      },
      {
        name: "Performance Containment Strategies",
        properties: [
          {
            name: "contain",
            values:
              "none | strict | content | size | inline-size | layout | style | paint | inherit | initial | unset | layout paint | size layout paint",
          },
          {
            name: "content-visibility",
            values: "visible | auto | hidden | inherit | initial | unset",
          },
        ],
      },
      {
        name: "Intrinsic Dimensions & Placeholders",
        properties: [
          {
            name: "contain-intrinsic-size",
            values:
              "none | <length> | auto <length> | none none | auto none | auto <length> auto <length> | inherit | initial | unset",
            note: "e.g. 300px, auto 15rem, auto 250px auto 180px",
          },
          {
            name: "contain-intrinsic-width",
            values:
              "none | <length> | auto <length> | auto none | inherit | initial | unset",
          },
          {
            name: "contain-intrinsic-height",
            values:
              "none | <length> | auto <length> | auto none | inherit | initial | unset",
          },
          {
            name: "contain-intrinsic-block-size",
            values: "none | <length> | auto <length> | auto none",
          },
          {
            name: "contain-intrinsic-inline-size",
            values: "none | <length> | auto <length> | auto none",
          },
        ],
      },
    ],
  };
