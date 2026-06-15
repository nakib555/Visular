import { CSSCategory } from "../../types-css";
import { ScrollText } from "lucide-react";

export const scrollbarsOverflowBehaviorCategory: CSSCategory = {
    name: "SCROLLBARS & OVERFLOW BEHAVIOR",
    icon: ScrollText,
    subCategories: [
      {
        name: "Scrollbars Styling",
        properties: [
          {
            name: "scrollbar-color",
            values:
              "auto | <color> <color> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "scrollbar-width",
            values:
              "auto | thin | none | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "scrollbar-gutter",
            values:
              "auto | stable | stable both-edges | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
      {
        name: "Overflow Mechanics",
        properties: [
          {
            name: "overflow",
            values:
              "visible | hidden | clip | scroll | auto | <overflow-x> <overflow-y> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "overflow-x",
            values:
              "visible | hidden | clip | scroll | auto | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "overflow-y",
            values:
              "visible | hidden | clip | scroll | auto | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "overflow-inline",
            values:
              "visible | hidden | clip | scroll | auto | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "overflow-block",
            values:
              "visible | hidden | clip | scroll | auto | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "overflow-clip-margin",
            values:
              "<length> | <visual-box> || <length> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "text-overflow",
            values:
              "clip | ellipsis | <string> | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
      {
        name: "Overscroll Behavior",
        properties: [
          {
            name: "scroll-behavior",
            values:
              "auto | smooth | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "overscroll-behavior",
            values:
              "auto | contain | none | <overscroll-behavior-x> <overscroll-behavior-y> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "overscroll-behavior-x",
            values:
              "auto | contain | none | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "overscroll-behavior-y",
            values:
              "auto | contain | none | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "overscroll-behavior-inline",
            values:
              "auto | contain | none | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "overscroll-behavior-block",
            values:
              "auto | contain | none | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
      {
        name: "Scroll Snapping & Coordinates",
        properties: [
          {
            name: "scroll-snap-type",
            values:
              "none | x | y | block | inline | both | x mandatory | y proximity | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "scroll-snap-align",
            values:
              "none | start | end | center | start end | center center | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "scroll-snap-stop",
            values:
              "normal | always | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "scroll-padding",
            values:
              "auto | <length> | <percentage> | <length> <length> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "scroll-margin",
            values:
              "<length> | <length> <length> | <length> <length> <length> <length> | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
    ],
  };
