import { CSSSubCategory } from "../../../../types-css";

export const scrollSnappingCoordinatesGroup: CSSSubCategory = {
  name: "Scroll Snapping & Coordinates",
  properties: [
    {
      name: "scroll-snap-type",
      values:
        "none | x | y | block | inline | both | x mandatory | y proximity | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "scroll-snap-align",
      values:
        "none | start | end | center | start end | center center | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "scroll-snap-stop",
      values:
        "normal | always | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "scroll-padding",
      values:
        "auto | <length> | <percentage> | <length> <length> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "scroll-margin",
      values:
        "<length> | <length> <length> | <length> <length> <length> <length> | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
