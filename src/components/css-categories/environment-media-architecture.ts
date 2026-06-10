import { CSSCategory } from "../../types-css";
import { Compass } from "lucide-react";

export const environmentMediaArchitectureCategory: CSSCategory = {
  name: "Environment, Media & Architecture",
  icon: Compass,
  subCategories: [
  {
    "name": "Media Fitting & Cropping",
    "properties": [
      {
        "name": "object-fit",
        "values": "fill | contain | cover | none | scale-down | initial | inherit"
      },
      {
        "name": "object-position",
        "values": "center | top | bottom | left | right | <length-percentage> <length-percentage>"
      },
      {
        "name": "object-view-box",
        "values": "none | inset(<length-percentage>{1,4} [round <border-radius>]?) | rect(...) | xywh(...)"
      }
    ]
  },
  {
    "name": "Image Rendering & Modification",
    "properties": [
      {
        "name": "image-rendering",
        "values": "auto | crisp-edges | pixelated | smooth | high-quality"
      },
      {
        "name": "image-orientation",
        "values": "from-image | none | <angle> (e.g. 90deg) | flip | <angle> flip"
      },
      {
        "name": "image-resolution",
        "values": "from-image | <resolution> (e.g. 300dpi) | from-image <resolution> | snap <resolution>"
      }
    ]
  },
  {
    "name": "Content Flow Shapes",
    "properties": [
      {
        "name": "shape-outside",
        "values": "none | margin-box | border-box | padding-box | content-box | circle() | ellipse() | polygon() | inset() | path() | <url>"
      },
      {
        "name": "shape-margin",
        "values": "<length> | <percentage>"
      },
      {
        "name": "shape-image-threshold",
        "values": "<number> (e.g. 0.5) | <percentage>"
      }
    ]
  },
  {
    "name": "Container Context & Query Registration",
    "properties": [
      {
        "name": "container-type",
        "values": "normal | size | inline-size | inherit | initial | unset"
      },
      {
        "name": "container-name",
        "values": "none | <custom-ident> | inherit | initial | unset",
        "note": "e.g., --card-item, sidebar-container"
      },
      {
        "name": "container",
        "values": "none | <container-name> / <container-type> | inherit | initial | unset",
        "note": "e.g., wrapper-element / inline-size"
      }
    ]
  },
  {
    "name": "Performance Containment Strategies",
    "properties": [
      {
        "name": "contain",
        "values": "none | strict | content | size | inline-size | layout | style | paint | inherit | initial | unset | layout paint | size layout paint"
      },
      {
        "name": "content-visibility",
        "values": "visible | auto | hidden | inherit | initial | unset"
      }
    ]
  },
  {
    "name": "Intrinsic Dimensions & Placeholders",
    "properties": [
      {
        "name": "contain-intrinsic-size",
        "values": "none | <length> | auto <length> | none none | auto none | auto <length> auto <length> | inherit | initial | unset",
        "note": "e.g. 300px, auto 15rem, auto 250px auto 180px"
      },
      {
        "name": "contain-intrinsic-width",
        "values": "none | <length> | auto <length> | auto none | inherit | initial | unset"
      },
      {
        "name": "contain-intrinsic-height",
        "values": "none | <length> | auto <length> | auto none | inherit | initial | unset"
      },
      {
        "name": "contain-intrinsic-block-size",
        "values": "none | <length> | auto <length> | auto none"
      },
      {
        "name": "contain-intrinsic-inline-size",
        "values": "none | <length> | auto <length> | auto none"
      }
    ]
  },
  {
    "name": "Scrollbars Styling",
    "properties": [
      {
        "name": "scrollbar-color",
        "values": "auto | <color> <color> | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "scrollbar-width",
        "values": "auto | thin | none | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "scrollbar-gutter",
        "values": "auto | stable | stable both-edges | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "Overflow Mechanics",
    "properties": [
      {
        "name": "overflow",
        "values": "visible | hidden | clip | scroll | auto | <overflow-x> <overflow-y> | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "overflow-x",
        "values": "visible | hidden | clip | scroll | auto | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "overflow-y",
        "values": "visible | hidden | clip | scroll | auto | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "overflow-inline",
        "values": "visible | hidden | clip | scroll | auto | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "overflow-block",
        "values": "visible | hidden | clip | scroll | auto | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "overflow-clip-margin",
        "values": "<length> | <visual-box> || <length> | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "text-overflow",
        "values": "clip | ellipsis | <string> | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "Overscroll Behavior",
    "properties": [
      {
        "name": "scroll-behavior",
        "values": "auto | smooth | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "overscroll-behavior",
        "values": "auto | contain | none | <overscroll-behavior-x> <overscroll-behavior-y> | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "overscroll-behavior-x",
        "values": "auto | contain | none | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "overscroll-behavior-y",
        "values": "auto | contain | none | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "overscroll-behavior-inline",
        "values": "auto | contain | none | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "overscroll-behavior-block",
        "values": "auto | contain | none | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "Scroll Snapping & Coordinates",
    "properties": [
      {
        "name": "scroll-snap-type",
        "values": "none | x | y | block | inline | both | x mandatory | y proximity | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "scroll-snap-align",
        "values": "none | start | end | center | start end | center center | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "scroll-snap-stop",
        "values": "normal | always | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "scroll-padding",
        "values": "auto | <length> | <percentage> | <length> <length> | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "scroll-margin",
        "values": "<length> | <length> <length> | <length> <length> <length> <length> | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "Container Query & Name",
    "properties": [
      {
        "name": "container-type",
        "values": "normal | size | inline-size | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "container-name",
        "values": "none | <custom-ident>+ | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "container",
        "values": "<container-name> [ / <container-type> ]? | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "Paged Media & Printing",
    "properties": [
      {
        "name": "page-break-before",
        "values": "auto | always | avoid | left | right | recto | verso | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "page-break-after",
        "values": "auto | always | avoid | left | right | recto | verso | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "page-break-inside",
        "values": "auto | avoid | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "page",
        "values": "auto | <custom-ident> | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "System UI & Core",
    "properties": [
      {
        "name": "zoom",
        "values": "normal | reset | <number> | <percentage> | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "appearance",
        "values": "none | auto | menulist-button | textfield | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "color-scheme",
        "values": "normal | [ light | dark | <custom-ident> ]+ | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "forced-color-adjust",
        "values": "auto | none | preserve-parent-color | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "app-region",
        "values": "none | drag | no-drag | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "-webkit-font-smoothing",
        "values": "auto | none | antialiased | subpixel-antialiased | initial | inherit | revert | revert-layer | unset"
      }
    ]
  }
]
};