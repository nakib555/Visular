import { CSSSubCategory } from "../../../../types-css";

export const anchorAlignmentGroup: CSSSubCategory = {
  name: "Anchor Alignment",
  properties: [
    {
      name: "position-area",
      values:
        "none | auto | [ [ left | center | right | span-left | span-right | x-start | x-end | span-x-start | span-x-end | x-self-start | x-self-end | span-x-self-start | span-x-self-end | span-all ] || [ top | center | bottom | span-top | span-bottom | y-start | y-end | span-y-start | span-y-end | y-self-start | y-self-end | span-y-self-start | span-y-self-end | span-all ] ] | [ [ block-start | center | block-end | span-block-start | span-block-end | span-all ] || [ inline-start | center | inline-end | span-inline-start | span-inline-end | span-all ] ] | [ [ self-block-start | center | self-block-end | span-self-block-start | span-self-block-end | span-all ] || [ self-inline-start | center | self-inline-end | span-self-inline-start | span-self-inline-end | span-all ] ] | [ [ start | center | end | span-start | span-end | span-all ]{1,2} ] | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "position-try-fallbacks",
      values:
        "none | [ <dashed-ident> || <try-tactic> ]# | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "position-try-order",
      values:
        "normal | <built-in-fallback-order> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "position-visibility",
      values:
        "always | anchors-visible | no-overflow | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
