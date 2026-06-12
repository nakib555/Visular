import { CSSSubCategory } from "../../../../types-css";

export const imageRenderingModificationGroup: CSSSubCategory = {
  name: "Image Rendering & Modification",
  properties: [
    {
      name: "image-rendering",
      values: "auto | crisp-edges | pixelated | smooth | high-quality",
    },
    {
      name: "image-orientation",
      values: "from-image | none | <angle> (e.g. 90deg) | flip | <angle> flip",
    },
    {
      name: "image-resolution",
      values:
        "from-image | <resolution> (e.g. 300dpi) | from-image <resolution> | snap <resolution>",
    },
  ],
};
