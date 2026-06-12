import { CSSSubCategory } from "../../../../types-css";

export const markersPathsGroup: CSSSubCategory = {
  name: "Markers & Paths",
  properties: [
    {
      name: "marker",
      values:
        "none | url(#id) | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "marker-start",
      values:
        "none | url(#id) | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "marker-mid",
      values:
        "none | url(#id) | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "marker-end",
      values:
        "none | url(#id) | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "vector-effect",
      values:
        "none | non-scaling-stroke | non-scaling-size | non-rotation | fixed-position | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
