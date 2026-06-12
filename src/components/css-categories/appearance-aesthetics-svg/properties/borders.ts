import { CSSSubCategory } from "../../../../types-css";

export const bordersGroup: CSSSubCategory = {
  name: "Borders",
  properties: [
    {
      name: "border",
      values: "none | <thickness> <style> <color>",
      note: "e.g., 1px solid black, 2px dashed red",
    },
    {
      name: "outline",
      values: "none | <thickness> <style> <color>",
    },
    {
      name: "border-radius",
      values: "<length> | <percentage>",
      note: "e.g., 8px, 50%",
    },
  ],
};
