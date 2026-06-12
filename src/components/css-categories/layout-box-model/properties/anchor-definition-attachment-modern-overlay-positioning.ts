import { CSSSubCategory } from "../../../../types-css";

export const anchorDefinitionAttachmentModernOverlayPositioningGroup: CSSSubCategory =
  {
    name: "Anchor Definition & Attachment (Modern Overlay Positioning)",
    properties: [
      {
        name: "anchor-name",
        values: "none | <dashed-ident> (e.g. --tooltip-trigger, --nav-menu)",
      },
      {
        name: "position-anchor",
        values: "implicit | <dashed-ident> (e.g. --tooltip-trigger)",
      },
    ],
  };
