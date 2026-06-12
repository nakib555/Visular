import { CSSSubCategory } from "../../../../types-css";

export const contentFlowShapesGroup: CSSSubCategory = {
  name: "Content Flow Shapes",
  properties: [
    {
      name: "shape-outside",
      values:
        "none | margin-box | border-box | padding-box | content-box | circle() | ellipse() | polygon() | inset() | path() | <url>",
    },
    {
      name: "shape-margin",
      values: "<length> | <percentage>",
    },
    {
      name: "shape-image-threshold",
      values: "<number> (e.g. 0.5) | <percentage>",
    },
  ],
};
