import { CSSSubCategory } from "../../../../types-css";

export const optimizationRenderingGroup: CSSSubCategory = {
  name: "Optimization & Rendering",
  properties: [
    {
      name: "color-interpolation",
      values:
        "auto | sRGB | linearRGB | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "color-interpolation-filters",
      values:
        "auto | sRGB | linearRGB | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "shape-rendering",
      values:
        "auto | optimizeSpeed | crispEdges | geometricPrecision | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "text-rendering",
      values:
        "auto | optimizeSpeed | optimizeLegibility | geometricPrecision | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "image-rendering",
      values:
        "auto | optimizeQuality | optimizeSpeed | crisp-edges | pixelated | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "color-rendering",
      values:
        "auto | optimizeSpeed | optimizeQuality | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
