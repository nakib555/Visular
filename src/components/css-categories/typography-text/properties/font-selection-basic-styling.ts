import { CSSSubCategory } from "../../../../types-css";

export const fontSelectionBasicStylingGroup: CSSSubCategory = {
  name: "Font Selection & Basic Styling",
  properties: [
    {
      name: "font-family",
      values:
        'serif | sans-serif | monospace | cursive | fantasy | system-ui | ui-serif | ui-sans-serif | ui-monospace | ui-rounded | emoji | math | fangsong | <string> (e.g. "Helvetica Neue", "SF Pro", "Inter")',
    },
    {
      name: "font-weight",
      values:
        "normal | bold | bolder | lighter | <number-range-1-1000> (e.g. 100, 400, 700, 900, 550)",
    },
    {
      name: "font-style",
      values:
        "normal | italic | oblique | oblique <angle> (e.g. oblique 14deg, oblique -10deg)",
    },
    {
      name: "font-synthesis",
      values:
        "none | weight | style | small-caps | weight style | weight style small-caps",
    },
  ],
};
