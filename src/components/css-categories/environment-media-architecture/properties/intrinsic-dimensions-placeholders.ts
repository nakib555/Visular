import { CSSSubCategory } from "../../../../types-css";

export const intrinsicDimensionsPlaceholdersGroup: CSSSubCategory = {
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
};
