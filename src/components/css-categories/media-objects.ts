import { CSSCategory } from "../../types-css";
import { Image } from "lucide-react";

export const mediaObjectsCategory: CSSCategory = {
    name: "MEDIA & OBJECTS",
    icon: Image,
    subCategories: [
      {
        name: "Media Fitting & Cropping",
        properties: [
          {
            name: "object-fit",
            values:
              "fill | contain | cover | none | scale-down | initial | inherit",
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
      },
      {
        name: "Image Rendering & Modification",
        properties: [
          {
            name: "image-rendering",
            values: "auto | crisp-edges | pixelated | smooth | high-quality",
          },
          {
            name: "image-orientation",
            values:
              "from-image | none | <angle> (e.g. 90deg) | flip | <angle> flip",
          },
          {
            name: "image-resolution",
            values:
              "from-image | <resolution> (e.g. 300dpi) | from-image <resolution> | snap <resolution>",
          },
        ],
      },
      {
        name: "Content Flow Shapes",
        properties: [
          {
            name: "shape-outside",
            values:
              "none | margin-box | border-box | padding-box | content-box | circle() | ellipse() | polygon() | inset() | path() | <url>",
          },
          { name: "shape-margin", values: "<length> | <percentage>" },
          {
            name: "shape-image-threshold",
            values: "<number> (e.g. 0.5) | <percentage>",
          },
        ],
      },
    ],
  };
