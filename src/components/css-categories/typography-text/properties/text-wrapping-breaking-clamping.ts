import { CSSSubCategory } from "../../../../types-css";

export const textWrappingBreakingClampingGroup: CSSSubCategory = {
  name: "Text Wrapping, Breaking & Clamping",
  properties: [
    {
      name: "white-space",
      values: "normal | pre | nowrap | pre-wrap | pre-line | break-spaces",
    },
    {
      name: "text-wrap",
      values: "wrap | nowrap | balance | pretty | stable",
    },
    {
      name: "word-break",
      values: "normal | break-all | keep-all | break-word",
    },
    {
      name: "overflow-wrap",
      values: "normal | break-word | anywhere",
    },
    {
      name: "text-overflow",
      values: 'clip | ellipsis | <string> (e.g. "...", " [read more]")',
    },
    {
      name: "line-clamp",
      values:
        'none | <integer> (e.g. 3, 5) | <integer> <string> (e.g. 3 "...")',
    },
    {
      name: "hyphens",
      values: "none | manual | auto",
    },
    {
      name: "hyphenate-character",
      values: 'auto | <string> (e.g. "-")',
    },
  ],
};
