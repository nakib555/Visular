import { CSSCategory } from "../../types-css";
import { Grid } from "lucide-react";

export const advancedGridSubgridLayoutCategory: CSSCategory = {
    name: "ADVANCED GRID SUBGRID LAYOUT",
    icon: Grid,
    subCategories: [
      {
        name: "Subgrid Templates",
        properties: [
          { name: "grid-template-columns", values: "none | <track-list> | <auto-track-list> | subgrid <line-name-list>? | initial | inherit | revert | revert-layer | unset" },
          { name: "grid-template-rows", values: "none | <track-list> | <auto-track-list> | subgrid <line-name-list>? | initial | inherit | revert | revert-layer | unset" }
        ]
      },
      {
        name: "Masonry & Tracks",
        properties: [
          { name: "masonry-auto-flow", values: "pack | next | definite-first | ordered | initial | inherit | revert | revert-layer | unset" },
          { name: "align-tracks", values: "[ normal | <baseline-position> | <content-distribution> | <overflow-position>? <content-position> ]# | initial | inherit | revert | revert-layer | unset" },
          { name: "justify-tracks", values: "[ normal | <content-distribution> | <overflow-position>? <content-position> ]# | initial | inherit | revert | revert-layer | unset" }
        ]
      }
    ]
  };
