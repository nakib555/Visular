import { CSSSubCategory } from "../../../../types-css";

export const coreFormInputStylingGroup: CSSSubCategory = {
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
};
