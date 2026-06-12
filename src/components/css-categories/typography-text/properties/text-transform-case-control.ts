import { CSSSubCategory } from "../../../../types-css";

export const textTransformCaseControlGroup: CSSSubCategory = {
  name: "Text Transform & Case Control",
  properties: [
    {
      name: "text-transform",
      values:
        "none | capitalize | uppercase | lowercase | full-width | full-size-kana",
    },
    {
      name: "font-variant-caps",
      values:
        "normal | small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps",
    },
  ],
};
