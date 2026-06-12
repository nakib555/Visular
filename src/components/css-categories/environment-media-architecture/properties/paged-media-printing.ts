import { CSSSubCategory } from "../../../../types-css";

export const pagedMediaPrintingGroup: CSSSubCategory = {
  name: "Paged Media & Printing",
  properties: [
    {
      name: "page-break-before",
      values:
        "auto | always | avoid | left | right | recto | verso | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "page-break-after",
      values:
        "auto | always | avoid | left | right | recto | verso | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "page-break-inside",
      values:
        "auto | avoid | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "page",
      values:
        "auto | <custom-ident> | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
