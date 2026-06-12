import { CSSSubCategory } from "../../../../types-css";

export const userActionPointerControlsGroup: CSSSubCategory = {
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
};
