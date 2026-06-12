import { CSSSubCategory } from "../../../../types-css";

export const effectsFiltersGroup: CSSSubCategory = {
  name: "Effects & Filters",
  properties: [
    {
      name: "box-shadow",
      values: "none | <offset-x> <offset-y> <blur> <spread> <color>",
      note: "e.g., 2px 4px 10px rgba(0,0,0,0.3)",
    },
    {
      name: "text-shadow",
      values: "none | <offset-x> <offset-y> <blur> <color>",
      note: "e.g., 1px 1px 2px black",
    },
    {
      name: "filter",
      values: "none | blur(px) | brightness(num) | contrast(%) | grayscale(%)",
      note: "e.g., blur(5px)",
    },
    {
      name: "backdrop-filter",
      values: "none | blur(px) | brightness(num) | contrast(%) | grayscale(%)",
    },
    {
      name: "clip-path",
      values: "none | circle(%) | polygon(...) | url(#id)",
    },
  ],
};
