import { CSSSubCategory } from "../../../../types-css";

export const mediaFittingCroppingGroup: CSSSubCategory = {
  name: "Media Fitting & Cropping",
  properties: [
    {
      name: "object-fit",
      values: "fill | contain | cover | none | scale-down | initial | inherit",
    },
    {
      name: "object-position",
      values:
        "center | top | bottom | left | right | <length-percentage> <length-percentage>",
    },
    {
      name: "object-view-box",
      values:
        "none | inset(<length-percentage>{1,4} [round <border-radius>]?) | rect(...) | xywh(...)",
    },
  ],
};
