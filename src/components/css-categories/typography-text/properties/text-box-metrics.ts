import { CSSSubCategory } from "../../../../types-css";

export const textBoxMetricsGroup: CSSSubCategory = {
  name: "Text Box Metrics",
  properties: [
    {
      name: "text-box-trim",
      values:
        "none | trim-start | trim-end | trim-both | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "text-box-edge",
      values:
        "auto | text | cap | ex | ideographic | ideographic-ink | leading | [ text | cap | ex | ideographic | ideographic-ink ] [ text | ideographic | ideographic-ink ]? | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "leading-trim",
      values:
        "normal | start | end | both | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
