import { CSSSubCategory } from "../../../../types-css";

export const textBoxTrimMetricsGroup: CSSSubCategory = {
  name: "Text Box Trim & Metrics",
  properties: [
    {
      name: "text-box-trim",
      values: "none | trim-over | trim-under | trim-both",
    },
    {
      name: "text-box-edge",
      values: "auto | text | cap | ex | ideographic | ideographic-ink",
    },
    {
      name: "text-box",
      values:
        "none | <text-box-trim> <text-box-edge> (e.g. trim-both cap, trim-over text)",
    },
  ],
};
