import { CSSCategory } from "../../types-css";
import { Compass } from "lucide-react";

export const positionCategory: CSSCategory = {
    name: "POSITION",
    icon: Compass,
    subCategories: [
      {
        name: "Document Flow Position",
        properties: [
          {
            name: "position",
            values: "static | relative | absolute | fixed | sticky",
          },
          {
            name: "top / right / bottom / left",
            values:
              "auto | <length: absolute> (e.g. 10px, 2cm, 5mm, 0.25in, 12pt, 1pc, 40Q) | <length: relative-font> (e.g. 1.5em, 2rem, 3ex, 5ch, 2lh, 2rlh) | <length: viewport> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100svh, 100lvh, 100dvh) | <length: container-query> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 50%, 100%) | <math-function> (e.g. calc(100% - 50px), min(10vw, 20px), max(2rem, 30px), clamp(10px, 5vw, 50px)) | <environment-variable> (e.g. env(safe-area-inset-top)) | <anchor-function> (e.g. anchor(top), anchor(--my-anchor bottom), anchor-size(width))",
          },
          {
            name: "inset",
            values:
              "auto | <length> (e.g. 10px, 1rem 2rem, 10px 5px 15px 20px) | <percentage> (e.g. 10% 5%) | <math-function> (e.g. calc(100svh - 20px))",
          },
        ],
      },
      {
        name: "Logical Document Flow Position (Writing-Mode Agnostic)",
        properties: [
          {
            name: "inset-block / inset-block-start / inset-block-end",
            values:
              "auto | <length> (all absolute, relative, viewport, container units e.g. 1rem, 50svh) | <percentage> | <math-function> | <anchor-function>",
          },
          {
            name: "inset-inline / inset-inline-start / inset-inline-end",
            values:
              "auto | <length> (all absolute, relative, viewport, container units e.g. 20px, 100dvw) | <percentage> | <math-function> | <anchor-function>",
          },
        ],
      },
      {
        name: "Stack Order",
        properties: [
          {
            name: "z-index",
            values:
              "auto | <integer> (e.g. 1, 999, -10, 999999) | <math-function> (e.g. calc(3 + 2))",
          },
        ],
      },
      {
        name: "Anchor Definition & Attachment (Modern Overlay Positioning)",
        properties: [
          {
            name: "anchor-name",
            values:
              "none | <dashed-ident> (e.g. --tooltip-trigger, --nav-menu)",
          },
          {
            name: "position-anchor",
            values: "implicit | <dashed-ident> (e.g. --tooltip-trigger)",
          },
        ],
      },
      {
        name: "Advanced Anchor Area Placement",
        properties: [
          {
            name: "position-area",
            values:
              "none | top | bottom | left | right | center | span-all | block-start | block-end | inline-start | inline-end | <combinations> (e.g. top left, center right, block-start inline-end)",
          },
        ],
      },
      {
        name: "Position Fallbacks & Visibility",
        properties: [
          {
            name: "position-try-fallbacks",
            values:
              "none | flip-block | flip-inline | flip-start | top | bottom | left | right | <dashed-ident> (e.g. --my-fallback-option) | <combinations> (e.g. flip-block, flip-inline)",
          },
          {
            name: "position-try-order",
            values:
              "normal | most-width | most-height | most-block-size | most-inline-size",
          },
          {
            name: "position-visibility",
            values: "always | anchors-visible | no-overflow",
          },
        ],
      },
    ],
  };
