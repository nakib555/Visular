import { CSSSubCategory } from "../../../../types-css";

export const scrollDrivenAnimationsGroup: CSSSubCategory = {
  name: "Scroll-driven Animations",
  properties: [
    {
      name: "animation-timeline",
      values:
        "auto | none | scroll() | scroll(...) | view() | view(...) | <custom-timeline-name>",
    },
    {
      name: "scroll-timeline",
      values: "none | <scroll-timeline-name> [block | inline | x | y]",
    },
    {
      name: "scroll-timeline-name",
      values: "none | <dashed-ident>",
    },
    {
      name: "scroll-timeline-axis",
      values: "block | inline | x | y",
    },
    {
      name: "view-timeline",
      values: "none | <view-timeline-name> [block | inline | x | y]",
    },
    {
      name: "view-timeline-name",
      values: "none | <dashed-ident>",
    },
    {
      name: "view-timeline-axis",
      values: "block | inline | x | y",
    },
    {
      name: "animation-range",
      values:
        "normal | <animation-range-start> <animation-range-end> (e.g. cover 0% cover 100%)",
    },
    {
      name: "animation-range-start / animation-range-end",
      values:
        "normal | auto | <percentage> | [normal | cover | contain | entry | exit] [<percentage>]",
    },
  ],
};
