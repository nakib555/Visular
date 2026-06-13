import { Play } from "lucide-react";
import { CSSCategory, CSSSubCategory, CSSProperty } from "../../types-css";

export const spatialStyling3dGroup: CSSSubCategory = {
  name: "3D Spatial Styling",
  properties: [
    {
      name: "transform-style",
      values:
        "flat | preserve-3d | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "backface-visibility",
      values:
        "visible | hidden | initial | inherit | revert | revert-layer | unset",
    },
  ],
};


export const keyframeAnimationsGroup: CSSSubCategory = {
  name: "Keyframe Animations",
  properties: [
    {
      name: "animation",
      values:
        "<single-animation> (e.g. slide-in 1s ease-out 0s infinite normal forwards)",
    },
    {
      name: "animation-name",
      values: "none | <custom-name> (e.g. fade-in, bounce-animation)",
    },
    {
      name: "animation-duration",
      values: "<time> (e.g. 1s, 800ms)",
    },
    {
      name: "animation-delay",
      values: "<time>",
    },
    {
      name: "animation-timing-function",
      values:
        "ease | linear | ease-in | ease-out | ease-in-out | step-start | step-end | cubic-bezier(...)",
    },
    {
      name: "animation-iteration-count",
      values: "infinite | <number>",
    },
    {
      name: "animation-direction",
      values: "normal | reverse | alternate | alternate-reverse",
    },
    {
      name: "animation-fill-mode",
      values: "none | forwards | backwards | both",
    },
    {
      name: "animation-play-state",
      values: "running | paused",
    },
    {
      name: "animation-composition",
      values: "replace | add | accumulate",
    },
  ],
};


export const modernIndividualTransformsGroup: CSSSubCategory = {
  name: "Modern Individual Transforms",
  properties: [
    {
      name: "translate",
      values:
        "none | <length> | <percentage> | <length-percentage> <length-percentage> [<length>] (e.g. 10px 20px)",
    },
    {
      name: "rotate",
      values:
        "none | <angle> (e.g. 45deg, 1.5rad) | x <angle> | y <angle> | z <angle> | <number> <number> <number> <angle>",
    },
    {
      name: "scale",
      values:
        "none | <number> | <percentage> | <number-percentage> <number-percentage> [<number>] (e.g. 1.5, 120% 80%)",
    },
  ],
};


export const motionPathDefinitionGroup: CSSSubCategory = {
  name: "Motion Path Definition",
  properties: [
    {
      name: "offset-path",
      values:
        "none | ray() | path() | url() | circle() | ellipse() | polygon() | inset() | rect() | xywh() | coord-box | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "offset-distance",
      values:
        "<length> | <percentage> | initial | inherit | revert | revert-layer | unset",
      note: "e.g., 50%, 100px",
    },
    {
      name: "offset-rotate",
      values:
        "auto | reverse | <angle> | auto <angle> | reverse <angle> | initial | inherit | revert | revert-layer | unset",
      note: "e.g., auto 90deg, 45deg",
    },
    {
      name: "offset-position",
      values:
        "auto | <position> | initial | inherit | revert | revert-layer | unset",
      note: "e.g., center center, 20% 40%",
    },
    {
      name: "offset-anchor",
      values:
        "auto | <position> | initial | inherit | revert | revert-layer | unset",
      note: "e.g., center, top left",
    },
    {
      name: "offset",
      values:
        "<offset-position>? [ <offset-path> [ <offset-distance> || <offset-rotate> ]? ]? [ / <offset-anchor> ]? | initial | inherit | revert | revert-layer | unset",
    },
  ],
};


export const perspectiveSettingGroup: CSSSubCategory = {
  name: "Perspective Setting",
  properties: [
    {
      name: "perspective",
      values:
        "none | <length> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "perspective-origin",
      values: "<position> | initial | inherit | revert | revert-layer | unset",
    },
  ],
};


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


export const transformLegacyShorthandOriginGroup: CSSSubCategory = {
  name: "Transform Legacy Shorthand & Origin",
  properties: [
    {
      name: "transform",
      values:
        "none | <transform-list> (e.g. translate(10px, 20px) rotate(45deg) scale(1.5))",
    },
    {
      name: "transform-origin",
      values:
        "center | top | bottom | left | right | <length> | <percentage> | [left | center | right] [top | center | bottom]",
    },
  ],
};


export const transitionsGroup: CSSSubCategory = {
  name: "Transitions",
  properties: [
    {
      name: "transition",
      values: "none | all | <single-transition> (e.g. all 0.3s ease-in-out 0s)",
    },
    {
      name: "transition-property",
      values: "none | all | <property-name> (e.g. transform, opacity)",
    },
    {
      name: "transition-duration",
      values: "<time> (e.g. 0.3s, 300ms)",
    },
    {
      name: "transition-delay",
      values: "<time> (e.g. 0.1s, 100ms)",
    },
    {
      name: "transition-timing-function",
      values:
        "ease | linear | ease-in | ease-out | ease-in-out | step-start | step-end | steps(...) | cubic-bezier(...)",
    },
    {
      name: "transition-behavior",
      values: "normal | allow-discrete",
    },
  ],
};


export const viewTransitionApiGroup: CSSSubCategory = {
  name: "View Transition API",
  properties: [
    {
      name: "view-transition-name",
      values:
        "none | <custom-ident> | initial | inherit | revert | revert-layer | unset",
    },
  ],
};



export const motionTransformsCategory: CSSCategory = {
  name: "Motion & Transforms",
  icon: Play,
  subCategories: [
    transitionsGroup,
    modernIndividualTransformsGroup,
    transformLegacyShorthandOriginGroup,
    keyframeAnimationsGroup,
    scrollDrivenAnimationsGroup,
    motionPathDefinitionGroup,
    viewTransitionApiGroup,
    perspectiveSettingGroup,
    spatialStyling3dGroup,
  ],
};

