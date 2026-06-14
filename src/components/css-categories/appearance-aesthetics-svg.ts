import { Palette } from "lucide-react";
import { CSSCategory, CSSSubCategory, CSSProperty } from "../../types-css";

export const alphaImageMaskingGroup: CSSSubCategory = {
  name: "Alpha & Image Masking",
  properties: [
    {
      name: "mask",
      values:
        "<mask-layer># | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "mask-image",
      values:
        "none | <mask-reference># | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "mask-mode",
      values:
        "match-source | luminance | alpha | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "mask-repeat",
      values:
        "repeat-x | repeat-y | [repeat | space | round | no-repeat]# | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "mask-position",
      values: "<position># | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "mask-clip",
      values:
        "[ <geometry-box> | no-clip ]# | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "mask-origin",
      values:
        "<geometry-box># | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "mask-size",
      values: "<bg-size># | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "mask-composite",
      values:
        "add | subtract | intersect | exclude | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "mask-type",
      values:
        "luminance | alpha | initial | inherit | revert | revert-layer | unset",
    },
  ],
};


export const bordersGroup: CSSSubCategory = {
  name: "Borders",
  properties: [
    {
      name: "border",
      values: "none | <thickness> <style> <color>",
      note: "e.g., 1px solid #f5f5f4, 2px dashed red",
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


export const colorsBackgroundsGroup: CSSSubCategory = {
  name: "Colors & Backgrounds",
  properties: [
    {
      name: "color",
      values: "<color-name> | <hex> | <rgb/rgba> | <hsl> | transparent",
      note: "e.g., red, #ff0000, rgba(0,0,0,0.5)",
    },
    {
      name: "background-color",
      values: "<color> | transparent",
    },
    {
      name: "background-image",
      values: 'none | url("...") | linear-gradient(...) | radial-gradient(...)',
    },
    {
      name: "background-size",
      values: "auto | cover | contain | <length/percentage>",
      note: "e.g., 100% 50%",
    },
    {
      name: "background-position",
      values: "center | top left | bottom right | <percentage>",
      note: "e.g., 50% 50%",
    },
    {
      name: "background-repeat",
      values: "repeat | no-repeat | repeat-x | repeat-y",
    },
    {
      name: "opacity",
      values: "<number>",
      note: "0.0 to 1.0 (e.g. 0.5)",
    },
  ],
};


export const compositingAndBlendingGroup: CSSSubCategory = {
  name: "Compositing and Blending",
  properties: [
    {
      name: "mix-blend-mode",
      values:
        "normal | multiply | screen | overlay | darken | lighten | color-dodge | color-burn | hard-light | soft-light | difference | exclusion | hue | saturation | color | luminosity | plus-lighter | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "isolation",
      values:
        "auto | isolate | initial | inherit | revert | revert-layer | unset",
    },
  ],
};


export const effectsFiltersGroup: CSSSubCategory = {
  name: "Effects & Filters",
  properties: [
    {
      name: "box-shadow",
      values: "none | <offset-x> <offset-y> <blur> <spread> <color>",
      note: "e.g., 2px 4px 10px rgba(0,0,0,0.3)",
    },
    {
      name: "text-shadow",
      values: "none | <offset-x> <offset-y> <blur> <color>",
      note: "e.g., 1px 1px 2px black",
    },
    {
      name: "filter",
      values: "none | blur(px) | brightness(num) | contrast(%) | grayscale(%)",
      note: "e.g., blur(5px)",
    },
    {
      name: "backdrop-filter",
      values: "none | blur(px) | brightness(num) | contrast(%) | grayscale(%)",
    },
    {
      name: "clip-path",
      values: "none | circle(%) | polygon(...) | url(#id)",
    },
  ],
};


export const fillsStrokesGroup: CSSSubCategory = {
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
      values: "<number> | initial | inherit | revert | revert-layer | unset",
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
};


export const geometryCoordinatesGroup: CSSSubCategory = {
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
};


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


export const objectModelingGroup: CSSSubCategory = {
  name: "Object Modeling",
  properties: [
    {
      name: "paint-order",
      values:
        "normal | [ fill || stroke || markers ] | initial | inherit | revert | revert-layer | unset",
    },
  ],
};


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


export const shapeClippingGroup: CSSSubCategory = {
  name: "Shape Clipping",
  properties: [
    {
      name: "clip-path",
      values:
        "none | <clip-source> | [ <geometry-box> || <basic-shape> ] | initial | inherit | revert | revert-layer | unset",
    },
  ],
};


export const svgTextPositioningGroup: CSSSubCategory = {
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
};



export const appearanceAestheticsSvgCategory: CSSCategory = {
  name: "Appearance, Aesthetics & SVG",
  icon: Palette,
  subCategories: [
    colorsBackgroundsGroup,
    bordersGroup,
    effectsFiltersGroup,
    fillsStrokesGroup,
    markersPathsGroup,
    geometryCoordinatesGroup,
    svgTextPositioningGroup,
    optimizationRenderingGroup,
    shapeClippingGroup,
    alphaImageMaskingGroup,
    compositingAndBlendingGroup,
    objectModelingGroup,
  ],
};

