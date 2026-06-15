import { CSSCategory } from "../../types-css";
import { MousePointer } from "lucide-react";

export const modernFormInteractionStylingCategory: CSSCategory = {
    name: "MODERN FORM & INTERACTION STYLING",
    icon: MousePointer,
    subCategories: [
      {
        name: "Core Form & Input Styling",
        properties: [
          {
            name: "appearance",
            values:
              "none | auto | textfield | menulist-button | searchfield | textarea | push-button | slider-horizontal | checkbox | radio | button | listbox | meter | progress-bar | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "accent-color",
            values:
              "auto | <color> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "color-scheme",
            values:
              "normal | light | dark | light dark | only light | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "field-sizing",
            values:
              "content | fixed | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "caret-color",
            values:
              "auto | <color> | transparent | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "caret-shape",
            values:
              "auto | bar | block | underscore | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
      {
        name: "User Action & Pointer Controls",
        properties: [
          {
            name: "cursor",
            values:
              "auto | default | none | context-menu | help | pointer | progress | wait | cell | crosshair | text | vertical-text | alias | copy | move | no-drop | not-allowed | e-resize | n-resize | ne-resize | nw-resize | s-resize | se-resize | sw-resize | w-resize | ew-resize | ns-resize | nesw-resize | nwse-resize | col-resize | row-resize | all-scroll | zoom-in | zoom-out | grab | grabbing | url(...) | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "pointer-events",
            values:
              "auto | none | visiblePainted | visibleFill | visibleStroke | visible | painted | fill | stroke | all | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "touch-action",
            values:
              "auto | none | pan-x | pan-left | pan-right | pan-y | pan-up | pan-down | pinch-zoom | manipulation | pan-x pan-y | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "user-select",
            values:
              "auto | none | text | all | contain | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "resize",
            values:
              "none | both | horizontal | vertical | block | inline | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
      {
        name: "Focus & Keyboard Navigation",
        properties: [
          {
            name: "outline",
            values:
              "none | <outline-width> || <outline-style> || <outline-color> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "outline-offset",
            values:
              "<length> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "nav-up / nav-down / nav-left / nav-right",
            values:
              "auto | <id> [ current | root | <target-name> ]? | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
    ],
  };
