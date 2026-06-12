import { CSSSubCategory } from "../../../../types-css";

export const performanceContainmentStrategiesGroup: CSSSubCategory = {
  name: "Performance Containment Strategies",
  properties: [
    {
      name: "contain",
      values:
        "none | strict | content | size | inline-size | layout | style | paint | inherit | initial | unset | layout paint | size layout paint",
    },
    {
      name: "content-visibility",
      values: "visible | auto | hidden | inherit | initial | unset",
    },
  ],
};
