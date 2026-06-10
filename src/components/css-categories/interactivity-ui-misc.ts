import { CSSCategory } from "../../types-css";
import { MousePointer } from "lucide-react";

export const interactivityUiMiscCategory: CSSCategory = {
  name: "Interactivity, UI & Miscellaneous",
  icon: MousePointer,
  subCategories: [
  {
    "name": "Core Form & Input Styling",
    "properties": [
      {
        "name": "appearance",
        "values": "none | auto | textfield | menulist-button | searchfield | textarea | push-button | slider-horizontal | checkbox | radio | button | listbox | meter | progress-bar | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "accent-color",
        "values": "auto | <color> | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "color-scheme",
        "values": "normal | light | dark | light dark | only light | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "field-sizing",
        "values": "content | fixed | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "caret-color",
        "values": "auto | <color> | transparent | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "caret-shape",
        "values": "auto | bar | block | underscore | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "User Action & Pointer Controls",
    "properties": [
      {
        "name": "cursor",
        "values": "auto | default | none | context-menu | help | pointer | progress | wait | cell | crosshair | text | vertical-text | alias | copy | move | no-drop | not-allowed | e-resize | n-resize | ne-resize | nw-resize | s-resize | se-resize | sw-resize | w-resize | ew-resize | ns-resize | nesw-resize | nwse-resize | col-resize | row-resize | all-scroll | zoom-in | zoom-out | grab | grabbing | url(...) | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "pointer-events",
        "values": "auto | none | visiblePainted | visibleFill | visibleStroke | visible | painted | fill | stroke | all | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "touch-action",
        "values": "auto | none | pan-x | pan-left | pan-right | pan-y | pan-up | pan-down | pinch-zoom | manipulation | pan-x pan-y | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "user-select",
        "values": "auto | none | text | all | contain | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "resize",
        "values": "none | both | horizontal | vertical | block | inline | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "Focus & Keyboard Navigation",
    "properties": [
      {
        "name": "outline",
        "values": "none | <outline-width> || <outline-style> || <outline-color> | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "outline-offset",
        "values": "<length> | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "nav-up / nav-down / nav-left / nav-right",
        "values": "auto | <id> [ current | root | <target-name> ]? | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "Popover & Dialog API",
    "properties": [
      {
        "name": "popover",
        "values": "auto | manual | none | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "overlay",
        "values": "auto | none | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "Discrete Transition Animations",
    "properties": [
      {
        "name": "transition-behavior",
        "values": "normal | allow-discrete | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "Touch & Pointer Actions",
    "properties": [
      {
        "name": "touch-action",
        "values": "auto | none | [ [ pan-x | pan-left | pan-right ] || [ pan-y | pan-up | pan-down ] || pinch-zoom ] | manipulation | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "pointer-events",
        "values": "auto | none | visiblePainted | visibleFill | visibleStroke | visible | painted | fill | stroke | all | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "User Modifiers",
    "properties": [
      {
        "name": "user-select",
        "values": "auto | text | none | contain | all | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "user-drag",
        "values": "auto | none | element | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "Outline Styling",
    "properties": [
      {
        "name": "outline",
        "values": "<outline-color> || <outline-style> || <outline-width> | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "outline-width",
        "values": "thin | medium | thick | <length> | initial | inherit | revert | revert-layer | unset",
        "note": "e.g., 2px, 0.2em"
      },
      {
        "name": "outline-style",
        "values": "auto | none | dotted | dashed | solid | double | groove | ridge | inset | outset | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "outline-color",
        "values": "<color> | invert | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "outline-offset",
        "values": "<length> | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "Pseudo-element Content",
    "properties": [
      {
        "name": "content",
        "values": "normal | none | [ <string> | <image> | <counter> | attr() | open-quote | close-quote | no-open-quote | no-close-quote ]+ | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "Counter Management",
    "properties": [
      {
        "name": "counter-reset",
        "values": "none | [ <custom-ident> <integer>? ]+ | reversed( <custom-ident> ) <integer>? | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "counter-increment",
        "values": "none | [ <custom-ident> <integer>? ]+ | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "counter-set",
        "values": "none | [ <custom-ident> <integer>? ]+ | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "All Property Reset",
    "properties": [
      {
        "name": "all",
        "values": "initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "Input Sizing & Appearance",
    "properties": [
      {
        "name": "field-sizing",
        "values": "fixed | content | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "appearance",
        "values": "none | auto | textfield | menulist-button | <compat-auto> | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "Decoration",
    "properties": [
      {
        "name": "accent-color",
        "values": "auto | <color> | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "caret-color",
        "values": "auto | <color> | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "caret-shape",
        "values": "auto | bar | block | underscore | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "caret",
        "values": "<caret-color> || <caret-shape> | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "Sequential Navigation",
    "properties": [
      {
        "name": "reading-flow",
        "values": "normal | flex-visual | flex-flow | grid-rows | grid-columns | grid-order | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "Spatial Navigation Direction",
    "properties": [
      {
        "name": "nav-up",
        "values": "auto | <id> [ current | root | <target-name> ]? | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "nav-down",
        "values": "auto | <id> [ current | root | <target-name> ]? | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "nav-left",
        "values": "auto | <id> [ current | root | <target-name> ]? | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "nav-right",
        "values": "auto | <id> [ current | root | <target-name> ]? | initial | inherit | revert | revert-layer | unset"
      }
    ]
  },
  {
    "name": "Spatial Navigation Action",
    "properties": [
      {
        "name": "spatial-navigation-action",
        "values": "auto | focus | scroll | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "spatial-navigation-contain",
        "values": "auto | contain | initial | inherit | revert | revert-layer | unset"
      },
      {
        "name": "spatial-navigation-function",
        "values": "normal | grid | initial | inherit | revert | revert-layer | unset"
      }
    ]
  }
]
};