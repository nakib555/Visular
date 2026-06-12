import { CSSSubCategory } from "../../../../types-css";

export const displayModeGroup: CSSSubCategory = {
  name: "Display Mode",
  properties: [
    {
      name: "display",
      values:
        "block | inline-block | inline | flex | inline-flex | grid | inline-grid | flow-root | contents | none | table | table-row | table-cell | list-item",
    },
  ],
};
