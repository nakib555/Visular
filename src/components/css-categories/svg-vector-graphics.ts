import { CSSCategory } from "../../types-css";
import { PenTool } from "lucide-react";

export const svgVectorGraphicsCategory: CSSCategory = {
    name: "SVG & VECTOR GRAPHICS",
    icon: PenTool,
    subCategories: [
      {
        name: "Fills & Strokes",
        properties: [
          {
            name: "fill",
            values:
              "<color> | url(#id) | none | context-fill | context-stroke | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "fill-opacity",
            values:
              "<number> | <percentage> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "fill-rule",
            values:
              "nonzero | evenodd | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "stroke",
            values:
              "<color> | url(#id) | none | context-fill | context-stroke | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "stroke-width",
            values:
              "<length> | <percentage> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "stroke-opacity",
            values:
              "<number> | <percentage> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "stroke-linecap",
            values:
              "butt | round | square | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "stroke-linejoin",
            values:
              "miter | miter-clip | round | bevel | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "stroke-miterlimit",
            values:
              "<number> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "stroke-dasharray",
            values:
              "none | <length-percentage># | initial | inherit | revert | revert-layer | unset",
            note: "e.g., 5px, 5px 10px, 10% 20%",
          },
          {
            name: "stroke-dashoffset",
            values:
              "<length> | <percentage> | initial | inherit | revert | revert-layer | unset",
            note: "e.g., 5px, 10%",
          },
        ],
      },
      {
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
      },
      {
        name: "Geometry & Coordinates",
        properties: [
          {
            name: "cx",
            values:
              "<length> | <percentage> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "cy",
            values:
              "<length> | <percentage> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "r",
            values:
              "<length> | <percentage> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "rx",
            values:
              "auto | <length> | <percentage> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "ry",
            values:
              "auto | <length> | <percentage> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "x",
            values:
              "<length> | <percentage> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "y",
            values:
              "<length> | <percentage> | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
      {
        name: "SVG Text Positioning",
        properties: [
          {
            name: "text-anchor",
            values:
              "start | middle | end | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "dominant-baseline",
            values:
              "auto | text-bottom | alphabetic | ideographic | middle | central | mathematical | hanging | text-top | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "alignment-baseline",
            values:
              "auto | baseline | before-edge | text-before-edge | middle | central | after-edge | text-after-edge | ideographic | alphabetic | hanging | mathematical | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "baseline-shift",
            values:
              "sub | super | <length> | <percentage> | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
      {
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
      },
    ],
  };
