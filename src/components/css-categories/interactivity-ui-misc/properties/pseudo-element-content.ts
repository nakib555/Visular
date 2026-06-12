import { CSSSubCategory } from "../../../../types-css";

export const pseudoElementContentGroup: CSSSubCategory = {
  name: "Pseudo-element Content",
  properties: [
    {
      name: "content",
      values:
        "normal | none | [ <string> | <image> | <counter> | attr() | open-quote | close-quote | no-open-quote | no-close-quote ]+ | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
