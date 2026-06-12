import { CSSSubCategory } from "../../../../types-css";

export const masonryTracksGroup: CSSSubCategory = {
  name: "Masonry & Tracks",
  properties: [
    {
      name: "masonry-auto-flow",
      values:
        "pack | next | definite-first | ordered | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "align-tracks",
      values:
        "[ normal | <baseline-position> | <content-distribution> | <overflow-position>? <content-position> ]# | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "justify-tracks",
      values:
        "[ normal | <content-distribution> | <overflow-position>? <content-position> ]# | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
