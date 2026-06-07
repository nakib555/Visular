import React, { useState } from "react";
import { 
  Settings, Sparkles, Palette, Maximize, Type, Layers, Play, Code, 
  HelpCircle, AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronDown, Trash2, Copy,
  Grid, Compass, Cpu, Move, Wand2, Search, Check, ChevronRight, Sliders, Anchor,
  MousePointer, Image
} from "lucide-react";
import { PropertyControl } from "./PropertyControl";
import { VisualElement } from "../types";
import { setGroupClass, getActiveGroupClass, setPrefixedClass, getPrefixedClass, setColorClass } from "../styleUtils";

export type InspectorSection = "layout" | "spacing" | "sizing" | "position" | "typography" | "visuals" | "motion" | "animation" | "interactivity" | "media" | "core" | "help";

interface CSSProperty {
  name: string;
  values: string;
  note?: string;
}

interface CSSSubCategory {
  name: string;
  properties: CSSProperty[];
}

interface CSSCategory {
  name: string;
  icon: any;
  subCategories: CSSSubCategory[];
}

const CSS_HIERARCHY_DATA: CSSCategory[] = [
  {
    name: "LAYOUT",
    icon: Maximize,
    subCategories: [
      {
        name: "Display Mode",
        properties: [
          { name: "display", values: "block | inline-block | inline | flex | inline-flex | grid | inline-grid | flow-root | contents | none | table | table-row | table-cell | list-item" }
        ]
      },
      {
        name: "Flexbox Container",
        properties: [
          { name: "flex-direction", values: "row | row-reverse | column | column-reverse" },
          { name: "justify-content", values: "normal | flex-start | flex-end | center | space-between | space-around | space-evenly | start | end | left | right" },
          { name: "align-items", values: "normal | stretch | flex-start | flex-end | center | baseline | start | end" },
          { name: "flex-wrap", values: "nowrap | wrap | wrap-reverse" },
          { name: "gap", values: "normal | <length> | <percentage> | calc(...) | clamp(...)", note: "e.g., 16px, 1rem, 5%" }
        ]
      },
      {
        name: "Flexbox Items",
        properties: [
          { name: "flex-grow", values: "<number> | calc(...)", note: "e.g., 0, 1, 2.5" },
          { name: "flex-shrink", values: "<number> | calc(...)", note: "e.g., 0, 1, 3" },
          { name: "flex-basis", values: "auto | content | max-content | min-content | fit-content | <length> | <percentage>" },
          { name: "align-self", values: "auto | normal | flex-start | flex-end | center | baseline | stretch | start | end" },
          { name: "order", values: "<integer>", note: "e.g., 0, 1, 99, -1, -99" }
        ]
      },
      {
        name: "Grid Container",
        properties: [
          { name: "grid-template-columns", values: "none | subgrid | masonry | <track-list>" },
          { name: "grid-template-rows", values: "none | subgrid | masonry | <track-list>" },
          { name: "justify-items", values: "normal | stretch | center | start | end | flex-start | flex-end | self-start | self-end | left | right | legacy" },
          { name: "align-items", values: "normal | stretch | center | start | end | flex-start | flex-end | self-start | self-end | baseline" }
        ]
      },
      {
        name: "Grid Items",
        properties: [
          { name: "grid-column", values: "auto | <integer> | <custom-ident> | <integer> / <integer> | span <integer> | span <custom-ident>" },
          { name: "grid-row", values: "auto | <integer> | <custom-ident> | <integer> / <integer> | span <integer> | span <custom-ident>" },
          { name: "grid-area", values: "auto | <custom-name> | <row-start> / <column-start> / <row-end> / <column-end>" }
        ]
      }
    ]
  },
  {
    name: "SPACING",
    icon: Move,
    subCategories: [
      {
        name: "Outer Spacing (Physical Dimension)",
        properties: [
          {
            name: "margin",
            values: "auto | <absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)"
          },
          {
            name: "margin-top / margin-right / margin-bottom / margin-left",
            values: "auto | <absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)"
          }
        ]
      },
      {
        name: "Inner Spacing (Physical Dimension)",
        properties: [
          {
            name: "padding",
            values: "<absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)"
          },
          {
            name: "padding-top / padding-right / padding-bottom / padding-left",
            values: "<absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)"
          }
        ]
      },
      {
        name: "Logical Outer Spacing (Writing-System Agnostic)",
        properties: [
          {
            name: "margin-block / margin-inline",
            values: "auto | <absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)"
          },
          {
            name: "margin-block-start / margin-block-end / margin-inline-start / margin-inline-end",
            values: "auto | <absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)"
          }
        ]
      },
      {
        name: "Logical Inner Spacing (Writing-System Agnostic)",
        properties: [
          {
            name: "padding-block / padding-inline",
            values: "<absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)"
          },
          {
            name: "padding-block-start / padding-block-end / padding-inline-start / padding-inline-end",
            values: "<absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-query> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)"
          }
        ]
      },
      {
        name: "Spacing Trim (Next-Gen Container Spacing Controls)",
        properties: [
          {
            name: "margin-trim",
            values: "none | all | block | block-start | block-end | inline | inline-start | inline-end | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)"
          }
        ]
      }
    ]
  },
  {
    name: "SIZING",
    icon: Sliders,
    subCategories: [
      {
        name: "Dimensions",
        properties: [
          { name: "width / height", values: "auto | max-content | min-content | fit-content | stretch | <length-absolute> (e.g. px, cm, mm, in, pc, pt, Q) | <length-font-relative> (e.g. em, rem, ex, ch, cap, ic, lh, rlh) | <length-viewport> (e.g. vw, vh, vmin, vmax, vi, vb) | <length-container-query> (e.g. cqw, cqh, cqi, cqb, cqmin, cqmax) | <percentage> (e.g. 0%, 50%, 100%) | <math-function> (e.g. calc(), min(), max(), clamp())" },
          { name: "min-width / min-height", values: "auto | max-content | min-content | fit-content | stretch | <length-absolute> (e.g. px, cm, mm, in, pc, pt, Q) | <length-font-relative> (e.g. em, rem, ex, ch, cap, ic, lh, rlh) | <length-viewport> (e.g. vw, vh, vmin, vmax, vi, vb) | <length-container-query> (e.g. cqw, cqh, cqi, cqb, cqmin, cqmax) | <percentage> (e.g. 0%, 50%, 100%) | <math-function> (e.g. calc(), min(), max(), clamp())" },
          { name: "max-width / max-height", values: "none | max-content | min-content | fit-content | stretch | <length-absolute> (e.g. px, cm, mm, in, pc, pt, Q) | <length-font-relative> (e.g. em, rem, ex, ch, cap, ic, lh, rlh) | <length-viewport> (e.g. vw, vh, vmin, vmax, vi, vb) | <length-container-query> (e.g. cqw, cqh, cqi, cqb, cqmin, cqmax) | <percentage> (e.g. 0%, 50%, 100%) | <math-function> (e.g. calc(), min(), max(), clamp())" },
          { name: "aspect-ratio", values: "auto | <ratio> (e.g. 1 / 1, 16 / 9, 4 / 3, 1.5) | auto <ratio> (e.g. auto 16 / 9) | <ratio> auto (e.g. 1 / 1 auto)" }
        ]
      },
      {
        name: "Box Sizing System",
        properties: [
          { name: "box-sizing", values: "content-box | border-box" }
        ]
      }
    ]
  },
  {
    name: "POSITION",
    icon: Compass,
    subCategories: [
      {
        name: "Document Flow Position",
        properties: [
          { name: "position", values: "static | relative | absolute | fixed | sticky" },
          { name: "top / right / bottom / left", values: "auto | <length: absolute> (e.g. 10px, 2cm, 5mm, 0.25in, 12pt, 1pc, 40Q) | <length: relative-font> (e.g. 1.5em, 2rem, 3ex, 5ch, 2lh, 2rlh) | <length: viewport> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100svh, 100lvh, 100dvh) | <length: container-query> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 50%, 100%) | <math-function> (e.g. calc(100% - 50px), min(10vw, 20px), max(2rem, 30px), clamp(10px, 5vw, 50px)) | <environment-variable> (e.g. env(safe-area-inset-top)) | <anchor-function> (e.g. anchor(top), anchor(--my-anchor bottom), anchor-size(width))" },
          { name: "inset", values: "auto | <length> (e.g. 10px, 1rem 2rem, 10px 5px 15px 20px) | <percentage> (e.g. 10% 5%) | <math-function> (e.g. calc(100svh - 20px))" }
        ]
      },
      {
        name: "Logical Document Flow Position (Writing-Mode Agnostic)",
        properties: [
          { name: "inset-block / inset-block-start / inset-block-end", values: "auto | <length> (all absolute, relative, viewport, container units e.g. 1rem, 50svh) | <percentage> | <math-function> | <anchor-function>" },
          { name: "inset-inline / inset-inline-start / inset-inline-end", values: "auto | <length> (all absolute, relative, viewport, container units e.g. 20px, 100dvw) | <percentage> | <math-function> | <anchor-function>" }
        ]
      },
      {
        name: "Stack Order",
        properties: [
          { name: "z-index", values: "auto | <integer> (e.g. 1, 999, -10, 999999) | <math-function> (e.g. calc(3 + 2))" }
        ]
      },
      {
        name: "Anchor Definition & Attachment (Modern Overlay Positioning)",
        properties: [
          { name: "anchor-name", values: "none | <dashed-ident> (e.g. --tooltip-trigger, --nav-menu)" },
          { name: "position-anchor", values: "implicit | <dashed-ident> (e.g. --tooltip-trigger)" }
        ]
      },
      {
        name: "Advanced Anchor Area Placement",
        properties: [
          { name: "position-area", values: "none | top | bottom | left | right | center | span-all | block-start | block-end | inline-start | inline-end | <combinations> (e.g. top left, center right, block-start inline-end)" }
        ]
      },
      {
        name: "Position Fallbacks & Visibility",
        properties: [
          { name: "position-try-fallbacks", values: "none | flip-block | flip-inline | flip-start | top | bottom | left | right | <dashed-ident> (e.g. --my-fallback-option) | <combinations> (e.g. flip-block, flip-inline)" },
          { name: "position-try-order", values: "normal | most-width | most-height | most-block-size | most-inline-size" },
          { name: "position-visibility", values: "always | anchors-visible | no-overflow" }
        ]
      }
    ]
  },
  {
    name: "TYPOGRAPHY & TEXT",
    icon: Type,
    subCategories: [
      {
        name: "Font Selection & Basic Styling",
        properties: [
          { name: "font-family", values: "serif | sans-serif | monospace | cursive | fantasy | system-ui | ui-serif | ui-sans-serif | ui-monospace | ui-rounded | emoji | math | fangsong | <string> (e.g. \"Helvetica Neue\", \"SF Pro\", \"Inter\")" },
          { name: "font-weight", values: "normal | bold | bolder | lighter | <number-range-1-1000> (e.g. 100, 400, 700, 900, 550)" },
          { name: "font-style", values: "normal | italic | oblique | oblique <angle> (e.g. oblique 14deg, oblique -10deg)" },
          { name: "font-synthesis", values: "none | weight | style | small-caps | weight style | weight style small-caps" }
        ]
      },
      {
        name: "Text Sizing & Scalability",
        properties: [
          { name: "font-size", values: "xx-small | x-small | small | medium | large | x-large | xx-large | xxx-large | smaller | larger | <length-absolute> (e.g. 16px, 12pt) | <length-relative-font> (e.g. 1.5em, 1.2rem, 12ch, 2lh, 2rlh) | <length-relative-viewport> (e.g. 4vw, 3vh, 3svh, 2dvw) | <length-container> (e.g. 5cqw, 4cqh, 3cqmin) | <percentage> (e.g. 120%)" },
          { name: "font-size-adjust", values: "none | ex-height | cap-height | ch-width | ic-width | <number> (e.g. 0.5, 0.485) | from-font" },
          { name: "font-stretch", values: "normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded | <percentage-range-50-200> (e.g. 75%, 120%)" }
        ]
      },
      {
        name: "Text Alignment, Justification & Spacing",
        properties: [
          { name: "text-align", values: "start | end | left | right | center | justify | justify-all | match-parent" },
          { name: "text-align-last", values: "auto | start | end | left | right | center | justify" },
          { name: "text-justify", values: "auto | none | inter-word | inter-character | distribute" },
          { name: "line-height", values: "normal | <number> (e.g. 1.5, 1.2) | <length-absolute> (e.g. 24px) | <length-relative-font> (e.g. 1.8em, 1.6rem) | <length-relative-viewport> (e.g. 3vw) | <percentage> (e.g. 150%)" },
          { name: "letter-spacing", values: "normal | <length-absolute> (e.g. 1px) | <length-relative-font> (e.g. 0.05em, 0.1rem)" },
          { name: "word-spacing", values: "normal | <length-absolute> (e.g. 4px) | <length-relative-font> (e.g. 0.25em, 0.3rem) | <percentage> (e.g. 50%)" },
          { name: "text-indent", values: "<length-absolute> (e.g. 20px) | <length-relative-font> (e.g. 2em, 1.5rem) | <percentage> (e.g. 5%) | each-line | hanging | each-line hanging | hanging each-line" }
        ]
      },
      {
        name: "Text Wrapping, Breaking & Clamping",
        properties: [
          { name: "white-space", values: "normal | pre | nowrap | pre-wrap | pre-line | break-spaces" },
          { name: "text-wrap", values: "wrap | nowrap | balance | pretty | stable" },
          { name: "word-break", values: "normal | break-all | keep-all | break-word" },
          { name: "overflow-wrap", values: "normal | break-word | anywhere" },
          { name: "text-overflow", values: "clip | ellipsis | <string> (e.g. \"...\", \" [read more]\")" },
          { name: "line-clamp", values: "none | <integer> (e.g. 3, 5) | <integer> <string> (e.g. 3 \"...\")" },
          { name: "hyphens", values: "none | manual | auto" },
          { name: "hyphenate-character", values: "auto | <string> (e.g. \"-\")" }
        ]
      },
      {
        name: "Text Box Trim & Metrics",
        properties: [
          { name: "text-box-trim", values: "none | trim-over | trim-under | trim-both" },
          { name: "text-box-edge", values: "auto | text | cap | ex | ideographic | ideographic-ink" },
          { name: "text-box", values: "none | <text-box-trim> <text-box-edge> (e.g. trim-both cap, trim-over text)" }
        ]
      },
      {
        name: "Text Decoration Systems",
        properties: [
          { name: "text-decoration-line", values: "none | underline | overline | line-through | blink | underline overline | underline line-through" },
          { name: "text-decoration-color", values: "<color-keyword> (e.g. red) | <color-hex> (e.g. #ff0000) | <color-rgb> | <color-hsl> | <color-oklch> | currentcolor" },
          { name: "text-decoration-style", values: "solid | double | dotted | dashed | wavy" },
          { name: "text-decoration-thickness", values: "auto | from-font | <length-absolute> (e.g. 2px) | <length-relative-font> (e.g. 0.1em) | <percentage>" },
          { name: "text-underline-offset", values: "auto | <length-absolute> (e.g. 3px) | <length-relative-font> (e.g. 0.25em) | <percentage>" },
          { name: "text-underline-position", values: "auto | under | left | right | under left | under right" }
        ]
      },
      {
        name: "Text Emphasis & Effects",
        properties: [
          { name: "text-emphasis-style", values: "none | filled | open | dot | circle | double-circle | triangle | sesame | <string> (e.g. \"x\") | filled dot | open circle" },
          { name: "text-emphasis-color", values: "<color-keyword> | <color-hex> | <color-rgb> | <color-hsl> | <color-oklch> | currentcolor" },
          { name: "text-emphasis-position", values: "over | under | over right | over left | under right | under left" },
          { name: "text-shadow", values: "none | <length-offset-x> <length-offset-y> <color> | <length-offset-x> <length-offset-y> <length-blur> <color>" }
        ]
      },
      {
        name: "Text Transform & Case Control",
        properties: [
          { name: "text-transform", values: "none | capitalize | uppercase | lowercase | full-width | full-size-kana" },
          { name: "font-variant-caps", values: "normal | small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps" }
        ]
      },
      {
        name: "OpenType & Variable Font Controls",
        properties: [
          { name: "font-variant-ligatures", values: "normal | none | common-ligatures | no-common-ligatures | discretionary-ligatures | historical-ligatures | contextual" },
          { name: "font-variant-numeric", values: "normal | ordinal | slashed-zero | lining-nums | oldstyle-nums | proportional-nums | tabular-nums | diagonal-fractions | stacked-fractions" },
          { name: "font-variant-east-asian", values: "normal | jis78 | jis83 | jis04 | simplified | traditional | full-width | ruby" },
          { name: "font-variant-emoji", values: "normal | text | emoji | unicode" },
          { name: "font-feature-settings", values: "normal | <string-tag> <on-off-integer> (e.g. \"smcp\" on, \"liga\" 0)" },
          { name: "font-variation-settings", values: "normal | <string-tag> <number> (e.g. \"wght\" 500, \"wdth\" 85)" },
          { name: "font-optical-sizing", values: "auto | none" },
          { name: "font-palette", values: "normal | light | dark | <dashed-ident>" }
        ]
      },
      {
        name: "Direction & Writing Mode",
        properties: [
          { name: "writing-mode", values: "horizontal-tb | vertical-rl | vertical-lr" },
          { name: "direction", values: "ltr | rtl" },
          { name: "text-orientation", values: "mixed | upright | sideways" },
          { name: "unicode-bidi", values: "normal | embed | bidi-override | isolate | isolate-override | plaintext" }
        ]
      }
    ]
  },
  {
    name: "APPEARANCE & VISUALS",
    icon: Palette,
    subCategories: [
      {
        name: "Colors & Backgrounds",
        properties: [
          { name: "color", values: "<color-name> | <hex> | <rgb/rgba> | <hsl> | transparent", note: "e.g., red, #ff0000, rgba(0,0,0,0.5)" },
          { name: "background-color", values: "<color> | transparent" },
          { name: "background-image", values: "none | url(\"...\") | linear-gradient(...) | radial-gradient(...)" },
          { name: "background-size", values: "auto | cover | contain | <length/percentage>", note: "e.g., 100% 50%" },
          { name: "background-position", values: "center | top left | bottom right | <percentage>", note: "e.g., 50% 50%" },
          { name: "background-repeat", values: "repeat | no-repeat | repeat-x | repeat-y" },
          { name: "opacity", values: "<number>", note: "0.0 to 1.0 (e.g. 0.5)" }
        ]
      },
      {
        name: "Borders",
        properties: [
          { name: "border", values: "none | <thickness> <style> <color>", note: "e.g., 1px solid black, 2px dashed red" },
          { name: "outline", values: "none | <thickness> <style> <color>" },
          { name: "border-radius", values: "<length> | <percentage>", note: "e.g., 8px, 50%" }
        ]
      },
      {
        name: "Effects & Filters",
        properties: [
          { name: "box-shadow", values: "none | <offset-x> <offset-y> <blur> <spread> <color>", note: "e.g., 2px 4px 10px rgba(0,0,0,0.3)" },
          { name: "text-shadow", values: "none | <offset-x> <offset-y> <blur> <color>", note: "e.g., 1px 1px 2px black" },
          { name: "filter", values: "none | blur(px) | brightness(num) | contrast(%) | grayscale(%)", note: "e.g., blur(5px)" },
          { name: "backdrop-filter", values: "none | blur(px) | brightness(num) | contrast(%) | grayscale(%)" },
          { name: "clip-path", values: "none | circle(%) | polygon(...) | url(#id)" }
        ]
      }
    ]
  },
  {
    name: "MOVEMENT & ANIMATION",
    icon: Wand2,
    subCategories: [
      {
        name: "Transitions",
        properties: [
          { name: "transition", values: "none | all | <single-transition> (e.g. all 0.3s ease-in-out 0s)" },
          { name: "transition-property", values: "none | all | <property-name> (e.g. transform, opacity)" },
          { name: "transition-duration", values: "<time> (e.g. 0.3s, 300ms)" },
          { name: "transition-delay", values: "<time> (e.g. 0.1s, 100ms)" },
          { name: "transition-timing-function", values: "ease | linear | ease-in | ease-out | ease-in-out | step-start | step-end | steps(...) | cubic-bezier(...)" },
          { name: "transition-behavior", values: "normal | allow-discrete" }
        ]
      },
      {
        name: "Modern Individual Transforms",
        properties: [
          { name: "translate", values: "none | <length> | <percentage> | <length-percentage> <length-percentage> [<length>] (e.g. 10px 20px)" },
          { name: "rotate", values: "none | <angle> (e.g. 45deg, 1.5rad) | x <angle> | y <angle> | z <angle> | <number> <number> <number> <angle>" },
          { name: "scale", values: "none | <number> | <percentage> | <number-percentage> <number-percentage> [<number>] (e.g. 1.5, 120% 80%)" }
        ]
      },
      {
        name: "Transform Legacy Shorthand & Origin",
        properties: [
          { name: "transform", values: "none | <transform-list> (e.g. translate(10px, 20px) rotate(45deg) scale(1.5))" },
          { name: "transform-origin", values: "center | top | bottom | left | right | <length> | <percentage> | [left | center | right] [top | center | bottom]" }
        ]
      },
      {
        name: "Keyframe Animations",
        properties: [
          { name: "animation", values: "<single-animation> (e.g. slide-in 1s ease-out 0s infinite normal forwards)" },
          { name: "animation-name", values: "none | <custom-name> (e.g. fade-in, bounce-animation)" },
          { name: "animation-duration", values: "<time> (e.g. 1s, 800ms)" },
          { name: "animation-delay", values: "<time>" },
          { name: "animation-timing-function", values: "ease | linear | ease-in | ease-out | ease-in-out | step-start | step-end | cubic-bezier(...)" },
          { name: "animation-iteration-count", values: "infinite | <number>" },
          { name: "animation-direction", values: "normal | reverse | alternate | alternate-reverse" },
          { name: "animation-fill-mode", values: "none | forwards | backwards | both" },
          { name: "animation-play-state", values: "running | paused" },
          { name: "animation-composition", values: "replace | add | accumulate" }
        ]
      },
      {
        name: "Scroll-driven Animations",
        properties: [
          { name: "animation-timeline", values: "auto | none | scroll() | scroll(...) | view() | view(...) | <custom-timeline-name>" },
          { name: "scroll-timeline", values: "none | <scroll-timeline-name> [block | inline | x | y]" },
          { name: "scroll-timeline-name", values: "none | <dashed-ident>" },
          { name: "scroll-timeline-axis", values: "block | inline | x | y" },
          { name: "view-timeline", values: "none | <view-timeline-name> [block | inline | x | y]" },
          { name: "view-timeline-name", values: "none | <dashed-ident>" },
          { name: "view-timeline-axis", values: "block | inline | x | y" },
          { name: "animation-range", values: "normal | <animation-range-start> <animation-range-end> (e.g. cover 0% cover 100%)" },
          { name: "animation-range-start / animation-range-end", values: "normal | auto | <percentage> | [normal | cover | contain | entry | exit] [<percentage>]" }
        ]
      }
    ]
  },
  {
    name: "INTERACTIVITY & SCROLLING",
    icon: MousePointer,
    subCategories: [
      {
        name: "Mouse Controls",
        properties: [
          { name: "cursor", values: "auto | default | none | pointer | help | wait | text | move | not-allowed | grab | grabbing | zoom-in | <url>" },
          { name: "pointer-events", values: "auto | none | visiblePainted | visibleFill | visibleStroke | visible | all" }
        ]
      },
      {
        name: "User Actions & Inputs",
        properties: [
          { name: "user-select", values: "none | auto | text | all | contain" },
          { name: "resize", values: "none | both | horizontal | vertical | block | inline" }
        ]
      },
      {
        name: "Document Scroll Control & Overflow",
        properties: [
          { name: "overflow", values: "visible | hidden | scroll | auto | clip | hidden auto" },
          { name: "overflow-x / overflow-y / overflow-inline / overflow-block", values: "visible | hidden | scroll | auto | clip" },
          { name: "scroll-behavior", values: "auto | smooth" },
          { name: "overscroll-behavior", values: "auto | contain | none | contain none" },
          { name: "overscroll-behavior-x / overscroll-behavior-y / overscroll-behavior-inline / overscroll-behavior-block", values: "auto | contain | none" }
        ]
      },
      {
        name: "Scroll Snapping (Container Level)",
        properties: [
          { name: "scroll-snap-type", values: "none | x | y | block | inline | both | x mandatory | y proximity" },
          { name: "scroll-padding", values: "auto | <length> | <percentage> | <length> <length>" },
          { name: "scroll-padding-top / -right / -bottom / -left / -inline-start / -inline-end / -block-start / -block-end", values: "auto | <length> | <percentage>" }
        ]
      },
      {
        name: "Scroll Snapping (Target/Item Level)",
        properties: [
          { name: "scroll-snap-align", values: "none | start | end | center | start end | center center" },
          { name: "scroll-snap-stop", values: "normal | always" },
          { name: "scroll-margin", values: "<length> | <length> <length> | <length> <length> <length> <length>" },
          { name: "scroll-margin-top / -right / -bottom / -left / -inline-start / -inline-end / -block-start / -block-end", values: "<length>" }
        ]
      },
      {
        name: "Touch Actions & Performance",
        properties: [
          { name: "touch-action", values: "auto | none | pan-x | pan-y | pinch-zoom | manipulation | pan-x pan-y" },
          { name: "will-change", values: "auto | scroll-position | contents | <custom-ident> (e.g. transform, opacity)" }
        ]
      }
    ]
  },
  {
    name: "MEDIA & OBJECTS",
    icon: Image,
    subCategories: [
      {
        name: "Media Fitting & Cropping",
        properties: [
          { name: "object-fit", values: "fill | contain | cover | none | scale-down | initial | inherit" },
          { name: "object-position", values: "center | top | bottom | left | right | <length-percentage> <length-percentage>" },
          { name: "object-view-box", values: "none | inset(<length-percentage>{1,4} [round <border-radius>]?) | rect(...) | xywh(...)" }
        ]
      },
      {
        name: "Image Rendering & Modification",
        properties: [
          { name: "image-rendering", values: "auto | crisp-edges | pixelated | smooth | high-quality" },
          { name: "image-orientation", values: "from-image | none | <angle> (e.g. 90deg) | flip | <angle> flip" },
          { name: "image-resolution", values: "from-image | <resolution> (e.g. 300dpi) | from-image <resolution> | snap <resolution>" }
        ]
      },
      {
        name: "Content Flow Shapes",
        properties: [
          { name: "shape-outside", values: "none | margin-box | border-box | padding-box | content-box | circle() | ellipse() | polygon() | inset() | path() | <url>" },
          { name: "shape-margin", values: "<length> | <percentage>" },
          { name: "shape-image-threshold", values: "<number> (e.g. 0.5) | <percentage>" }
        ]
      }
    ]
  }
];


interface SegmentedControlProps<T> {
  label: string;
  value: T;
  onChange: (val: T) => void;
  options: {
    value: T;
    label?: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
  }[];
}

function SegmentedControl<T extends string>({ label, value, onChange, options }: SegmentedControlProps<T>) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          {label}
        </label>
      )}
      <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-1 flex w-full gap-1">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex-1 flex items-center justify-center py-2 px-3 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-rose-50/80 border border-rose-200/60 text-rose-600 shadow-sm"
                  : "bg-transparent border border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-100/40"
              }`}
            >
              {Icon ? <Icon size={14} className="stroke-[2.25]" /> : opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const SEGMENTED_FIELDS: Record<string, { label: string; options: { value: string; label: string }[] }> = {
  "pointer-events": {
    label: "Pointer Interaction Mode",
    options: [{ value: "auto", label: "Auto" }, { value: "none", label: "None" }]
  },
  "user-select": {
    label: "Text Selection Control",
    options: [{ value: "auto", label: "Auto" }, { value: "text", label: "Text" }, { value: "none", label: "None" }]
  },
  "resize": {
    label: "Element Resize Handle",
    options: [
      { value: "none", label: "None" },
      { value: "both", label: "Both" },
      { value: "horizontal", label: "Horiz" },
      { value: "vertical", label: "Vert" }
    ]
  },
  "scroll-behavior": {
    label: "Scrolling Interpolation",
    options: [{ value: "auto", label: "Auto" }, { value: "smooth", label: "Smooth" }]
  },
  "touch-action": {
    label: "Touch Screen Action Mapping",
    options: [{ value: "auto", label: "Auto" }, { value: "manipulation", label: "Interact" }, { value: "none", label: "None" }]
  },
  "object-fit": {
    label: "Object Auto-Fit Scaling",
    options: [
      { value: "cover", label: "Cover" },
      { value: "contain", label: "Contain" },
      { value: "fill", label: "Fill" },
      { value: "none", label: "None" }
    ]
  },
  "image-rendering": {
    label: "Image Rendering Engine",
    options: [{ value: "auto", label: "Auto" }, { value: "crisp-edges", label: "Crisp" }, { value: "pixelated", label: "Pixelated" }]
  }
};

interface InspectorPanelProps {
  selectedElement: VisualElement | null;
  inspectorSection: InspectorSection;
  setInspectorSection: (s: InspectorSection) => void;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
}

export function InspectorPanel({
  selectedElement,
  inspectorSection,
  setInspectorSection,
  updateTree,
  deleteElement,
  duplicateElement
}: InspectorPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "LAYOUT": true,
    "SPACING": true,
    "TYPOGRAPHY & TEXT": true,
    "APPEARANCE & VISUALS": true,
    "MOVEMENT & ANIMATION": true,
    "INTERACTIVITY & UI": true,
  });
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [layoutSubCategory, setLayoutSubCategory] = useState<"display" | "flex" | "grid" | "position" | "overflow">("display");
  const [typographySubCategory, setTypographySubCategory] = useState<string>("basic");
  const [appearanceSubCategory, setAppearanceSubCategory] = useState<"colors" | "backgrounds" | "borders" | "blending">("colors");
  const [effectsSubCategory, setEffectsSubCategory] = useState<"shadows" | "filters" | "masking" | "transparency">("shadows");
  const [animationSubCategory, setAnimationSubCategory] = useState<"transitions" | "transforms" | "legacyTransforms" | "keyframes" | "scrollDriven">("transitions");
  const [interactivitySubCategory, setInteractivitySubCategory] = useState<"mouse" | "user" | "scrollControl" | "containerSnap" | "itemSnap" | "touch">("mouse");
  const [mediaSubCategory, setMediaSubCategory] = useState<"fitting" | "rendering" | "shapes">("fitting");
  const [expandedLayoutSections, setExpandedLayoutSections] = useState<Record<string, boolean>>({
    display: true,
    flex: true,
    grid: true,
    position: true,
    overflow: true,
  });
  const [expandedTypographySections, setExpandedTypographySections] = useState<Record<string, boolean>>({
    basic: true,
    sizing: true,
    spacing: true,
    wrapping: true,
    trim: true,
    decoration: true,
    emphasis: true,
    transform: true,
    fontControls: true,
    direction: true,
  });

  const toggleTypographySection = (section: string) => {
    setExpandedTypographySections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleLayoutSection = (section: string) => {
    setExpandedLayoutSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => {
      setCopiedText((curr) => curr === text ? null : curr);
    }, 1500);
  };

  const filteredHierarchy = CSS_HIERARCHY_DATA.map(category => {
    const matchingSubCategories = category.subCategories.map(subCat => {
      const matchingProperties = subCat.properties.filter(prop => {
        const query = searchQuery.toLowerCase();
        return (
          prop.name.toLowerCase().includes(query) ||
          prop.values.toLowerCase().includes(query) ||
          (prop.note && prop.note.toLowerCase().includes(query))
        );
      });
      return { ...subCat, properties: matchingProperties };
    }).filter(subCat => subCat.properties.length > 0);

    return { ...category, subCategories: matchingSubCategories };
  }).filter(category => category.subCategories.length > 0);

  if (!selectedElement) return (
    <div className="flex flex-col items-center justify-center h-full w-full text-stone-400 p-8 text-center bg-stone-50/30 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-stone-200/60 flex items-center justify-center mb-4 text-stone-300">
        <Settings size={24} />
      </div>
      <p className="text-sm font-semibold text-stone-600">No Element Selected</p>
      <p className="text-xs text-stone-400 mt-1 max-w-[200px]">Click any element on the canvas to inspect and edit its properties.</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-white select-none">
      {/* Horizontally Scrollable Categories Tab List */}
      <div 
        role="tablist" 
        className="px-4 py-3 flex items-center gap-1.5 overflow-x-auto scrollbar-hide border-b border-stone-100 flex-shrink-0"
        onWheel={(e) => {
          if (e.deltaY !== 0 && e.deltaX === 0) {
            e.currentTarget.scrollLeft += e.deltaY;
          }
        }}
      >
        {[
          { id: "layout", label: "Layout", icon: Maximize },
          { id: "spacing", label: "Spacing", icon: Move },
          { id: "sizing", label: "Sizing", icon: Sliders },
          { id: "position", label: "Position", icon: Compass },
          { id: "typography", label: "Typography & Text", icon: Type },
          { id: "visuals", label: "Appearance & Styles", icon: Palette },
          { id: "motion", label: "Effects & Filters", icon: Play },
          { id: "animation", label: "Movement & Animation", icon: Wand2 },
          { id: "interactivity", label: "Interactivity & Scrolling", icon: MousePointer },
          { id: "media", label: "Media & Objects", icon: Image },
          { id: "core", label: "Content & Code", icon: Sparkles },
          { id: "help", label: "CSS Guide", icon: HelpCircle }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={inspectorSection === tab.id}
            onClick={() => setInspectorSection(tab.id as InspectorSection)}
            className={`relative px-3.5 py-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shrink-0 text-xs font-semibold ${
              inspectorSection === tab.id 
                ? "text-rose-700 bg-rose-50/80 shadow-sm border border-rose-100/50" 
                : "text-stone-500 border border-transparent hover:text-stone-800 hover:bg-stone-50"
            }`}
          >
            <tab.icon size={13.5} className={inspectorSection === tab.id ? "text-rose-600" : "text-stone-400"} />
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Properties Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 flex flex-col gap-6 custom-scrollbar">
        
        {/* ==================== 1. SPACING ==================== */}
        {inspectorSection === "spacing" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Move size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">Spacing Settings</span>
            </div>

            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1">
                <Move size={11} />
                <span>Margin & Padding Controls</span>
              </div>

              {/* Spacing Controls: Margin & Padding */}
              <div className="space-y-3 pt-1">
                <div className="p-3 bg-white border border-stone-200/50 rounded-xl space-y-3">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block font-sans">Padding (Inside Spacing)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1 col-span-2">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">All sides padding global</label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(selectedElement.classes, "p-")}
                          onChange={(e) => {
                            let updated = selectedElement.classes
                              .replace(/\b(pt|pr|pb|pl|px|py)-\w+\b/g, "")
                              .replace(/\s+/g, " ")
                              .trim();
                            updateTree(() => ({ 
                              classes: setPrefixedClass(updated, "p-", e.target.value) 
                            }));
                          }}
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">None (p-0)</option>
                          {[0,1,2,3,4,5,6,8,10,12,16,20,24,32,48,64].map((v) => (
                            <option key={v} value={`p-${v}`}>p-{v} ({v * 4}px)</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">Top side</label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(selectedElement.classes, "pt-")}
                          onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "pt-", e.target.value) }))}
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-7 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">Inherited</option>
                          {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                            <option key={v} value={`pt-${v}`}>pt-{v} ({v * 4}px)</option>
                          ))}
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">Right side</label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(selectedElement.classes, "pr-")}
                          onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "pr-", e.target.value) }))}
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-7 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">Inherited</option>
                          {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                            <option key={v} value={`pr-${v}`}>pr-{v} ({v * 4}px)</option>
                          ))}
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">Bottom side</label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(selectedElement.classes, "pb-")}
                          onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "pb-", e.target.value) }))}
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-7 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">Inherited</option>
                          {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                            <option key={v} value={`pb-${v}`}>pb-{v} ({v * 4}px)</option>
                          ))}
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">Left side</label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(selectedElement.classes, "pl-")}
                          onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "pl-", e.target.value) }))}
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-7 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">Inherited</option>
                          {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                            <option key={v} value={`pl-${v}`}>pl-{v} ({v * 4}px)</option>
                          ))}
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white border border-stone-200/50 rounded-xl space-y-3">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block font-sans">Margin (Outside Spacing)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1 col-span-2">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">All sides margin global</label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(selectedElement.classes, "m-")}
                          onChange={(e) => {
                            let updated = selectedElement.classes
                              .replace(/\b(mt|mr|mb|ml|mx|my)-\w+\b/g, "")
                              .replace(/\s+/g, " ")
                              .trim();
                            updateTree(() => ({ 
                              classes: setPrefixedClass(updated, "m-", e.target.value) 
                            }));
                          }}
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">None (m-0)</option>
                          {[0,1,2,3,4,5,6,8,10,12,16,20,24,32,48,64].map((v) => (
                            <option key={v} value={`m-${v}`}>m-{v} ({v * 4}px)</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">Top side</label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(selectedElement.classes, "mt-")}
                          onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "mt-", e.target.value) }))}
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-7 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">Inherited</option>
                          {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                            <option key={v} value={`mt-${v}`}>mt-{v} ({v * 4}px)</option>
                          ))}
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">Right side</label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(selectedElement.classes, "mr-")}
                          onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "mr-", e.target.value) }))}
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-7 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">Inherited</option>
                          {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                            <option key={v} value={`mr-${v}`}>mr-{v} ({v * 4}px)</option>
                          ))}
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">Bottom side</label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(selectedElement.classes, "mb-")}
                          onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "mb-", e.target.value) }))}
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-7 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">Inherited</option>
                          {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                            <option key={v} value={`mb-${v}`}>mb-{v} ({v * 4}px)</option>
                          ))}
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">Left side</label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(selectedElement.classes, "ml-")}
                          onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "ml-", e.target.value) }))}
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-7 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">Inherited</option>
                          {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                            <option key={v} value={`ml-${v}`}>ml-{v} ({v * 4}px)</option>
                          ))}
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 1.5 SIZING ==================== */}
        {inspectorSection === "sizing" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Sliders size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">Sizing Settings</span>
            </div>

            {/* Sub-Category: Dimensions */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1">
                <Grid size={11} />
                <span>Dimensions</span>
              </div>
              
              {/* Properties: Width & Height */}
              <div className="grid grid-cols-2 gap-3">
                <PropertyControl
                  label="Width"
                  type="number"
                  value={getActiveGroupClass(selectedElement.classes, "width")}
                  onChange={(val) => updateTree((n) => ({ classes: setGroupClass(n.classes, "width", val) }))}
                  placeholder="Auto"
                />

                <PropertyControl
                  label="Height"
                  type="number"
                  value={getActiveGroupClass(selectedElement.classes, "height")}
                  onChange={(val) => updateTree((n) => ({ classes: setGroupClass(n.classes, "height", val) }))}
                  placeholder="Auto"
                />
              </div>

              {/* Min/Max Sizing select configurations */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-sans">Min Width</label>
                  <div className="relative">
                    <select
                      value={getPrefixedClass(selectedElement.classes, "min-w-")}
                      onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "min-w-", e.target.value) }))}
                      className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                    >
                      <option value="">None (min-w-0)</option>
                      <option value="min-w-0">min-w-0</option>
                      <option value="min-w-[100px]">100px</option>
                      <option value="min-w-[200px]">200px</option>
                      <option value="min-w-[300px]">300px</option>
                      <option value="min-w-full">100% (min-w-full)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-sans">Max Width</label>
                  <div className="relative">
                    <select
                      value={getPrefixedClass(selectedElement.classes, "max-w-")}
                      onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "max-w-", e.target.value) }))}
                      className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                    >
                      <option value="">None</option>
                      <option value="max-w-xs">X Small (max-w-xs)</option>
                      <option value="max-w-sm">Small (max-w-sm)</option>
                      <option value="max-w-md">Medium (max-w-md)</option>
                      <option value="max-w-lg">Large (max-w-lg)</option>
                      <option value="max-w-xl">X Large (max-w-xl)</option>
                      <option value="max-w-2xl">2X Large (max-w-2xl)</option>
                      <option value="max-w-full">Full (max-w-full)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-sans">Min Height</label>
                  <div className="relative">
                    <select
                      value={getPrefixedClass(selectedElement.classes, "min-h-")}
                      onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "min-h-", e.target.value) }))}
                      className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                    >
                      <option value="">None (min-h-0)</option>
                      <option value="min-h-0">min-h-0</option>
                      <option value="min-h-[50px]">50px</option>
                      <option value="min-h-[100px]">100px</option>
                      <option value="min-h-[200px]">200px</option>
                      <option value="min-h-full">100% (min-h-full)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-sans">Max Height</label>
                  <div className="relative">
                    <select
                      value={getPrefixedClass(selectedElement.classes, "max-h-")}
                      onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "max-h-", e.target.value) }))}
                      className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                    >
                      <option value="">None</option>
                      <option value="max-h-full">100% (max-h-full)</option>
                      <option value="max-h-[300px]">300px</option>
                      <option value="max-h-[500px]">500px</option>
                      <option value="max-h-screen">Screen height</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Box Sizing & Aspect Ratio */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-sans">Box Sizing</label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(selectedElement.classes, "boxSizing")}
                      onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "boxSizing", e.target.value) }))}
                      className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                    >
                      <option value="">Default (Border Box)</option>
                      <option value="box-border">box-border</option>
                      <option value="box-content">box-content</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-sans">Aspect Ratio</label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(selectedElement.classes, "aspectRatio")}
                      onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "aspectRatio", e.target.value) }))}
                      className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                    >
                      <option value="">Default (aspect-auto)</option>
                      <option value="aspect-auto">aspect-auto</option>
                      <option value="aspect-square">Square (1:1 / aspect-square)</option>
                      <option value="aspect-video">Video (16:9 / aspect-video)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 1.25 POSITION ==================== */}
        {inspectorSection === "position" && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Compass size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">CSS Positioning & Anchors</span>
            </div>

            {(() => {
              const parseArbitraryValue = (className: string, prefix: string): string => {
                if (!className) return "";
                const match = className.match(new RegExp(`(?:^|\\s)${prefix.replace(/[-\[\]()]/g, '\\$&')}\\[([^\\]]+)\\](?:$|\\s)`));
                if (match) return match[1].replace(/_/g, " ");
                const active = className.split(/\s+/).find((c) => c.startsWith(prefix) && !c.includes("["));
                return active ? active.substring(prefix.length) : "";
              };

              const encodeArbitraryValue = (prefix: string, value: string): string => {
                if (!value || !value.trim()) return "";
                return `${prefix}[${value.trim().replace(/\s+/g, "_")}]`;
              };

              const updateArbitraryClass = (prefix: string, value: string) => {
                const currentTokens = selectedElement.classes.split(/\s+/).filter(Boolean);
                let filtered = currentTokens.filter((token) => !token.startsWith(prefix));
                if (value && value.trim()) {
                  filtered.push(encodeArbitraryValue(prefix, value));
                }
                updateTree((n) => ({ classes: filtered.join(" ") }));
              };

              const parseArbitraryProperty = (className: string, propName: string): string => {
                if (!className) return "";
                const match = className.match(new RegExp(`(?:^|\\s)\\[${propName.replace(/[-\[\]()]/g, '\\$&')}:([^\\]]+)\\](?:$|\\s)`));
                return match ? match[1] : "";
              };

              const updateArbitraryProperty = (propName: string, value: string) => {
                const currentTokens = selectedElement.classes.split(/\s+/).filter(Boolean);
                let filtered = currentTokens.filter((token) => !token.startsWith(`[${propName}:`));
                if (value && value.trim()) {
                  filtered.push(`[${propName}:${value.trim().replace(/\s+/g, "_")}]`);
                }
                updateTree((n) => ({ classes: filtered.join(" ") }));
              };

              return (
                <div className="space-y-4">
                  {/* Category 1: Document Flow Position */}
                  <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3.5 shadow-sm">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <Move size={12} />
                      <span>Document Flow Position</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-0.5">Scheme (position)</label>
                      <div className="relative">
                        <select
                          value={getActiveGroupClass(selectedElement.classes, "position")}
                          onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "position", e.target.value) }))}
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 font-medium focus:outline-none cursor-pointer"
                        >
                          <option value="">default (static)</option>
                          <option value="relative">relative</option>
                          <option value="absolute">absolute</option>
                          <option value="fixed">fixed (viewport relative)</option>
                          <option value="sticky">sticky (scroll relative)</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Coordinates Grid */}
                    <div className="grid grid-cols-2 gap-3.5 pt-1">
                      {["top", "right", "bottom", "left"].map((dir) => {
                        const prefix = `${dir}-`;
                        const currentVal = getPrefixedClass(selectedElement.classes, prefix);

                        return (
                          <div key={dir} className="flex flex-col gap-1.5 p-2 bg-white border border-stone-100 rounded-xl shadow-xs">
                            <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">{dir}</label>
                            
                            <div className="relative">
                              <select
                                value={currentVal}
                                onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, prefix, e.target.value) }))}
                                className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg pl-2 pr-6 py-1 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                              >
                                <option value="">Auto</option>
                                <option value={`${prefix}0`}>0px</option>
                                <option value={`${prefix}1`}>4px (0.25rem)</option>
                                <option value={`${prefix}2`}>8px (0.5rem)</option>
                                <option value={`${prefix}4`}>16px (1rem)</option>
                                <option value={`${prefix}8`}>32px (2rem)</option>
                                <option value={`${prefix}auto`}>auto</option>
                                <option value={`-${prefix}2`}>-8px (-0.5rem)</option>
                                <option value={`-${prefix}4`}>-16px (-1rem)</option>
                              </select>
                              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                            </div>

                            <input
                              type="text"
                              placeholder="e.g. 50% or 100vh"
                              value={parseArbitraryValue(selectedElement.classes, prefix)}
                              onChange={(e) => updateArbitraryClass(prefix, e.target.value)}
                              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-[11px] text-stone-700 focus:outline-none focus:bg-white placeholder-stone-400 font-mono"
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Shorthand Inset */}
                    <div className="flex flex-col gap-1.5 p-2 bg-white border border-stone-100 rounded-xl shadow-xs">
                      <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">inset (all sides)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <select
                            value={getPrefixedClass(selectedElement.classes, "inset-")}
                            onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "inset-", e.target.value) }))}
                            className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Auto (none)</option>
                            <option value="inset-0">0px (inset-0)</option>
                            <option value="inset-2">8px (inset-2)</option>
                            <option value="inset-4">16px (inset-4)</option>
                            <option value="inset-auto">inset-auto</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. 10px or 5%"
                          value={parseArbitraryValue(selectedElement.classes, "inset-")}
                          onChange={(e) => updateArbitraryClass("inset-", e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white placeholder-stone-400 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category 2: Logical Document Flow Position (Writing-Mode Agnostic) */}
                  <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3.5 shadow-sm">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <Compass size={12} />
                      <span>Logical Direction offsets</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {/* Inset Block */}
                      <div className="p-2.5 bg-white border border-stone-100 rounded-xl space-y-2">
                        <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">inset-block (vertical inline equivalent)</div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="block start/end"
                            value={parseArbitraryValue(selectedElement.classes, "inset-block-")}
                            onChange={(e) => updateArbitraryClass("inset-block-", e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                          <input
                            type="text"
                            placeholder="block-start (top)"
                            value={parseArbitraryValue(selectedElement.classes, "inset-block-start-")}
                            onChange={(e) => updateArbitraryClass("inset-block-start-", e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>

                      {/* Inset Inline */}
                      <div className="p-2.5 bg-white border border-stone-100 rounded-xl space-y-2">
                        <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">inset-inline (horizontal inline equivalent)</div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="inline start/end"
                            value={parseArbitraryValue(selectedElement.classes, "inset-inline-")}
                            onChange={(e) => updateArbitraryClass("inset-inline-", e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                          <input
                            type="text"
                            placeholder="inline-start (left)"
                            value={parseArbitraryValue(selectedElement.classes, "inset-inline-start-")}
                            onChange={(e) => updateArbitraryClass("inset-inline-start-", e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category 3: Stack Order */}
                  <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <Layers size={12} />
                      <span>Stack Order</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <select
                          value={getPrefixedClass(selectedElement.classes, "z-")}
                          onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "z-", e.target.value) }))}
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none cursor-pointer font-medium"
                        >
                          <option value="">auto</option>
                          <option value="z-0">z-0 (base)</option>
                          <option value="z-10">z-10 (header/nav)</option>
                          <option value="z-20">z-20 (dropdown)</option>
                          <option value="z-30">z-30 (sticky)</option>
                          <option value="z-40">z-40 (drawer)</option>
                          <option value="z-50">z-50 (modal/tooltip)</option>
                          <option value="z-auto">z-auto</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                      <input
                        type="text"
                        placeholder="custom index e.g. 9999"
                        value={parseArbitraryValue(selectedElement.classes, "z-")}
                        onChange={(e) => updateArbitraryClass("z-", e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Category 4: Anchor Definition & Attachment */}
                  <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3.5 shadow-sm">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <Anchor size={12} />
                      <span>CSS Anchor Positioning</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-0.5">anchor-name</label>
                        <input
                          type="text"
                          placeholder="e.g. --tooltip-trigger"
                          value={parseArbitraryProperty(selectedElement.classes, "anchor-name")}
                          onChange={(e) => updateArbitraryProperty("anchor-name", e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-0.5">position-anchor</label>
                        <input
                          type="text"
                          placeholder="e.g. --tooltip-trigger"
                          value={parseArbitraryProperty(selectedElement.classes, "position-anchor")}
                          onChange={(e) => updateArbitraryProperty("position-anchor", e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category 5 & 6: Advanced Anchor Area & Try Fallbacks */}
                  <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3.5 shadow-sm">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <HelpCircle size={12} />
                      <span>Fallback & Area Controls</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-0.5">position-area</label>
                        <input
                          type="text"
                          placeholder="e.g. top left, center right"
                          value={parseArbitraryProperty(selectedElement.classes, "position-area")}
                          onChange={(e) => updateArbitraryProperty("position-area", e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-0.5">position-try-fallbacks</label>
                        <input
                          type="text"
                          placeholder="e.g. flip-block, flip-inline"
                          value={parseArbitraryProperty(selectedElement.classes, "position-try-fallbacks")}
                          onChange={(e) => updateArbitraryProperty("position-try-fallbacks", e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10.5px] text-stone-500 font-semibold uppercase tracking-wider pl-0.5">try-order</label>
                          <input
                            type="text"
                            placeholder="most-width"
                            value={parseArbitraryProperty(selectedElement.classes, "position-try-order")}
                            onChange={(e) => updateArbitraryProperty("position-try-order", e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10.5px] text-stone-500 font-semibold uppercase tracking-wider pl-0.5">visibility</label>
                          <input
                            type="text"
                            placeholder="anchors-visible"
                            value={parseArbitraryProperty(selectedElement.classes, "position-visibility")}
                            onChange={(e) => updateArbitraryProperty("position-visibility", e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ==================== 1. LAYOUT ==================== */}
        {inspectorSection === "layout" && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Maximize size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">Layout Settings</span>
            </div>

            {(() => {
              const parseArbitraryValue = (className: string, prefix: string): string => {
                if (!className) return "";
                const match = className.match(new RegExp(`(?:^|\\s)${prefix.replace(/[-\[\]()]/g, '\\$&')}\\[([^\\]]+)\\](?:$|\\s)`));
                if (match) return match[1].replace(/_/g, " ");
                const active = className.split(/\s+/).find((c) => c.startsWith(prefix) && !c.includes("["));
                return active ? active.substring(prefix.length) : "";
              };

              const encodeArbitraryValue = (prefix: string, value: string): string => {
                if (!value || !value.trim()) return "";
                return `${prefix}[${value.trim().replace(/\s+/g, "_")}]`;
              };

              const updateArbitraryClass = (prefix: string, value: string) => {
                const currentTokens = selectedElement.classes.split(/\s+/).filter(Boolean);
                let filtered = currentTokens.filter((token) => !token.startsWith(prefix));
                if (value && value.trim()) {
                  filtered.push(encodeArbitraryValue(prefix, value));
                }
                updateTree((n) => ({ classes: filtered.join(" ") }));
              };

              const displayVal = getActiveGroupClass(selectedElement.classes, "display") || "";
              const isFlexContext = displayVal === "flex" || displayVal === "inline-flex";
              const isGridContext = displayVal === "grid" || displayVal === "inline-grid";

              const sectionHeader = (id: string, label: string, icon: any, badge?: string) => {
                const isExpanded = expandedLayoutSections[id];
                const IconComponent = icon;
                return (
                  <button
                    type="button"
                    onClick={() => toggleLayoutSection(id)}
                    className="w-full flex items-center justify-between pb-1 text-left cursor-pointer select-none font-sans"
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-700 font-mono flex items-center gap-1.5">
                        <IconComponent size={11} className="text-rose-600" />
                        <span>{label}</span>
                      </div>
                      {badge && (
                        <span className="text-[8px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider font-mono select-none animate-pulse">
                          {badge}
                        </span>
                      )}
                    </div>
                    <ChevronDown size={14} className={`text-stone-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                );
              };

              return (
                <div className="space-y-4">
                  {/* --- 1. DISPLAY MODE --- */}
                  <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm select-none">
                    {sectionHeader("display", "Display Mode", Sliders)}
                    {expandedLayoutSections.display && (
                      <div className="flex flex-col gap-2.5 animate-in fade-in duration-200">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono">display type</label>
                        <div className="relative">
                          <select
                            value={displayVal}
                            onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "display", e.target.value) }))}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 cursor-pointer font-medium"
                          >
                            <option value="">default / browser inherits</option>
                            <option value="block">block</option>
                            <option value="inline-block">inline-block</option>
                            <option value="inline">inline</option>
                            <option value="flex">flex</option>
                            <option value="inline-flex">inline-flex</option>
                            <option value="grid">grid</option>
                            <option value="inline-grid">inline-grid</option>
                            <option value="flow-root">flow-root</option>
                            <option value="contents">contents</option>
                            <option value="table">table</option>
                            <option value="table-row">table-row</option>
                            <option value="table-cell">table-cell</option>
                            <option value="list-item">list-item</option>
                            <option value="hidden">none</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>

                        {/* Behavior Details Banner */}
                        <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-100/55 text-[10px] leading-relaxed text-rose-900">
                          <span className="font-bold uppercase tracking-wider text-rose-700 text-[9px] block font-mono">Layout Behavior context</span>
                          <p className="mt-1">
                            {displayVal === "block" && "Behaves as a block container. Takes up full width and starts on a new line."}
                            {displayVal === "inline-block" && "Behaves as an inline-level box. Sizing is respectably editable."}
                            {displayVal === "inline" && "Element renders as inline, wrapping context without custom dimension frames."}
                            {displayVal === "flex" && "Prepares container horizontal or vertical child layouts using standard Flex mechanics."}
                            {displayVal === "inline-flex" && "Enables inline Flexbox container where outer layout is inline, inner contents flex."}
                            {displayVal === "grid" && "Renders children according to column and row structures under CSS Grid parameters."}
                            {displayVal === "inline-grid" && "Enables inline Grid container behavior for precise cell-based layouts."}
                            {displayVal === "contents" && "Container is visually ignored; its child components are layout-linked directly to its parent."}
                            {displayVal === "hidden" && "Element is fully removed from rendering and page layout flow."}
                            {!displayVal && "Inherits standard display properties."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* --- 2. FLEXBOX CONTAINER SUB-CATEGORY --- */}
                  <div className={`border rounded-2xl p-3.5 space-y-1 transition-all duration-300 shadow-sm ${
                    isFlexContext 
                      ? "bg-stone-50/50 border-stone-200/50" 
                      : "bg-stone-100/30 border-stone-200/30 opacity-75"
                  }`}>
                    {sectionHeader("flex", "Flexbox Container", Cpu, !isFlexContext ? "⚠️ Inactive (Display is not Flex)" : undefined)}
                    {expandedLayoutSections.flex && (
                      <div className="space-y-4 pt-3 animate-in fade-in duration-200">
                        {!isFlexContext ? (
                          <div className="bg-rose-50/30 border border-rose-100 rounded-xl p-3.5 text-center space-y-2">
                            <div className="text-rose-700 font-bold text-[11px] font-sans">Convert Layout to Flexbox</div>
                            <p className="text-[10px] text-rose-600 leading-normal font-medium max-w-[210px] mx-auto">
                              To edit direction, align, wrap, and gap features, change layout display type to flex.
                            </p>
                            <button
                              type="button"
                              onClick={() => updateTree((n) => ({ classes: setGroupClass(n.classes, "display", "flex") }))}
                              className="w-full h-8 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5 mr-auto ml-auto"
                            >
                              <Cpu size={12} /> Convert to Flex
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3.5">
                            {/* flex-direction */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-mono">flex-direction</label>
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "flexDirection")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "flexDirection", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
                                >
                                  <option value="">row (default)</option>
                                  <option value="flex-row">row (horizontal left-to-right)</option>
                                  <option value="flex-row-reverse">row-reverse (horizontal right-to-left)</option>
                                  <option value="flex-col">column (vertical top-to-bottom)</option>
                                  <option value="flex-col-reverse">column-reverse (vertical bottom-to-top)</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                            </div>

                            {/* justify-content */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-mono">justify-content</label>
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "justify")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "justify", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
                                >
                                  <option value="">normal (default)</option>
                                  <option value="justify-normal">normal</option>
                                  <option value="justify-start">flex-start / start</option>
                                  <option value="justify-end">flex-end / end</option>
                                  <option value="justify-center">center</option>
                                  <option value="justify-between">space-between</option>
                                  <option value="justify-around">space-around</option>
                                  <option value="justify-evenly">space-evenly</option>
                                  <option value="justify-stretch">stretch</option>
                                  <option value="justify-items-left">left</option>
                                  <option value="justify-items-right">right</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                            </div>

                            {/* align-items */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-mono">align-items</label>
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "alignment")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "alignment", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
                                >
                                  <option value="">normal / stretch (default)</option>
                                  <option value="items-normal">normal</option>
                                  <option value="items-stretch">stretch</option>
                                  <option value="items-start">flex-start / start</option>
                                  <option value="items-end">flex-end / end</option>
                                  <option value="items-center">center</option>
                                  <option value="items-baseline">baseline</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                            </div>

                            {/* flex-wrap */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-mono">flex-wrap</label>
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "flexWrap")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "flexWrap", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
                                >
                                  <option value="">nowrap (default)</option>
                                  <option value="flex-nowrap">nowrap</option>
                                  <option value="flex-wrap">wrap</option>
                                  <option value="flex-wrap-reverse">wrap-reverse</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                            </div>

                            {/* item gap with dual-nature instructions */}
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-mono font-bold">item gap</label>
                                <span className="text-[8px] text-rose-700 bg-rose-50 px-1 py-0.5 rounded font-bold uppercase tracking-wide">Dual-Nature</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="relative">
                                  <select
                                    value={getActiveGroupClass(selectedElement.classes, "gap")}
                                    onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "gap", e.target.value) }))}
                                    className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
                                  >
                                    <option value="">default / custom option</option>
                                    <option value="gap-0">0px</option>
                                    <option value="gap-1">4px</option>
                                    <option value="gap-2">8px</option>
                                    <option value="gap-3">12px</option>
                                    <option value="gap-4">16px</option>
                                    <option value="gap-6">24px</option>
                                    <option value="gap-8">32px</option>
                                  </select>
                                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                                </div>
                                <input
                                  type="text"
                                  placeholder="custom e.g. 15px"
                                  value={parseArbitraryValue(selectedElement.classes, "gap-")}
                                  onChange={(e) => updateArbitraryClass("gap-", e.target.value)}
                                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400"
                                />
                              </div>
                              <p className="text-[9px] text-rose-700 leading-snug bg-rose-50/40 p-2 rounded-xl border border-rose-100/30 font-sans font-medium">
                                💡 **Gap Dual-Nature:** Spacing applies column-wise in standard horizontal rows, and row-wise in vertical columns (`flex-col`) automatically.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* --- 3. FLEXBOX ITEMS SUB-CATEGORY --- */}
                        <div className="border-t border-stone-200/40 pt-4.5 space-y-4 font-sans select-none">
                          <div className="text-[10px] uppercase font-bold tracking-wider text-stone-500 font-mono flex items-center gap-1.5">
                            <Sparkles size={11} className="text-rose-600" />
                            <span>Flexbox Items (Child overrides)</span>
                          </div>

                          {/* flex-grow & shrink */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">flex-grow</label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "flexGrow")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "flexGrow", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">default (0)</option>
                                  <option value="grow-0">0 (grow-0)</option>
                                  <option value="grow">1 (grow)</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                              <input
                                type="text"
                                placeholder="custom e.g. 2.5"
                                value={parseArbitraryValue(selectedElement.classes, "grow-")}
                                onChange={(e) => updateArbitraryClass("grow-", e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
                              />
                            </div>
                          </div>

                          {/* flex-shrink */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">flex-shrink</label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "flexShrink")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "flexShrink", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">default (1)</option>
                                  <option value="shrink">1 (shrink)</option>
                                  <option value="shrink-0">0 (shrink-0)</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                              <input
                                type="text"
                                placeholder="custom e.g. 3"
                                value={parseArbitraryValue(selectedElement.classes, "shrink-")}
                                onChange={(e) => updateArbitraryClass("shrink-", e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
                              />
                            </div>
                          </div>

                          {/* flex-basis */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">flex-basis</label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="relative">
                                <select
                                  value={getPrefixedClass(selectedElement.classes, "basis-")}
                                  onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "basis-", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">default / custom</option>
                                  <option value="basis-auto">auto</option>
                                  <option value="basis-full">100% (full)</option>
                                  <option value="basis-1/2">50% (half)</option>
                                  <option value="basis-1/3">33.33% (third)</option>
                                  <option value="basis-1/4">25% (quarter)</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                              <input
                                type="text"
                                placeholder="e.g. 200px, 15rem"
                                value={parseArbitraryValue(selectedElement.classes, "basis-")}
                                onChange={(e) => updateArbitraryClass("basis-", e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
                              />
                            </div>
                          </div>

                          {/* align-self override */}
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono">align-self</label>
                              <span className="text-[8px] text-rose-700 bg-rose-50 px-1 py-0.5 rounded font-bold uppercase tracking-wide">Override</span>
                            </div>
                            <div className="relative font-sans">
                              <select
                                value={getActiveGroupClass(selectedElement.classes, "alignSelf")}
                                onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "alignSelf", e.target.value) }))}
                                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                              >
                                <option value="">auto (inherits container items-align)</option>
                                <option value="self-auto">auto</option>
                                <option value="self-normal">normal</option>
                                <option value="self-stretch">stretch</option>
                                <option value="self-start">flex-start / start</option>
                                <option value="self-end">flex-end / end</option>
                                <option value="self-center">center</option>
                                <option value="self-baseline">baseline</option>
                              </select>
                              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                            </div>
                            <p className="text-[9px] text-rose-800 leading-relaxed bg-rose-50/40 p-2.5 rounded-xl border border-rose-100/30 font-medium">
                              👉 **Alignment Override:** Parent container's `align-items` sets the default vertical alignment for children; individual items can override it with `align-self` directly.
                            </p>
                          </div>

                          {/* order */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono font-bold">order</label>
                            <div className="grid grid-cols-2 gap-2 font-sans font-mono font-sans">
                              <div className="relative">
                                <select
                                  value={getPrefixedClass(selectedElement.classes, "order-")}
                                  onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "order-", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">default / custom</option>
                                  <option value="order-first">first (order-first)</option>
                                  <option value="order-last">last (order-last)</option>
                                  <option value="order-1">order-1</option>
                                  <option value="order-2">order-2</option>
                                  <option value="order-3">order-3</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                              <input
                                type="text"
                                placeholder="custom order integer"
                                value={parseArbitraryValue(selectedElement.classes, "order-")}
                                onChange={(e) => updateArbitraryClass("order-", e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* --- 3. GRID LAYOUT CATEGORY --- */}
                  <div className={`border rounded-2xl p-3.5 space-y-1 transition-all duration-300 shadow-sm ${
                    isGridContext 
                      ? "bg-stone-50/50 border-stone-200/50" 
                      : "bg-stone-100/30 border-stone-200/30 opacity-75"
                  }`}>
                    {sectionHeader("grid", "Grid Container", Grid, !isGridContext ? "⚠️ Inactive (Display is not Grid)" : undefined)}
                    {expandedLayoutSections.grid && (
                      <div className="space-y-4 pt-3 animate-in fade-in duration-200">
                        {!isGridContext ? (
                          <div className="bg-rose-50/30 border border-rose-100 rounded-xl p-3.5 text-center space-y-2">
                            <div className="text-rose-700 font-bold text-[11px] font-sans">Convert Layout to Grid</div>
                            <p className="text-[10px] text-rose-600 leading-normal font-medium max-w-[210px] mx-auto">
                              To edit template columns, spans, rows, gaps, and placement properties, change layout display type to grid.
                            </p>
                            <button
                              type="button"
                              onClick={() => updateTree((n) => ({ classes: setGroupClass(n.classes, "display", "grid") }))}
                              className="w-full h-8 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5 mr-auto ml-auto"
                            >
                              <Grid size={11} /> Convert to Grid
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3.5">
                            {/* Columns template */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">grid-template-columns</label>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="relative">
                                  <select
                                    value={getPrefixedClass(selectedElement.classes, "grid-cols-")}
                                    onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "grid-cols-", e.target.value) }))}
                                    className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                  >
                                    <option value="">default / custom</option>
                                    <option value="grid-cols-1">1 Col</option>
                                    <option value="grid-cols-2">2 Cols</option>
                                    <option value="grid-cols-3">3 Cols</option>
                                    <option value="grid-cols-4">4 Cols</option>
                                    <option value="grid-cols-6">6 Cols</option>
                                    <option value="grid-cols-12">12 Cols (Standard)</option>
                                  </select>
                                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                                </div>
                                <input
                                  type="text"
                                  placeholder="custom e.g. 1fr 2fr"
                                  value={parseArbitraryValue(selectedElement.classes, "grid-cols-")}
                                  onChange={(e) => updateArbitraryClass("grid-cols-", e.target.value)}
                                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
                                />
                              </div>
                            </div>

                            {/* Rows template */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">grid-template-rows</label>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="relative">
                                  <select
                                    value={getPrefixedClass(selectedElement.classes, "grid-rows-")}
                                    onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "grid-rows-", e.target.value) }))}
                                    className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                  >
                                    <option value="">default / custom</option>
                                    <option value="grid-rows-1">1 Row</option>
                                    <option value="grid-rows-2">2 Rows</option>
                                    <option value="grid-rows-3">3 Rows</option>
                                    <option value="grid-rows-4">4 Rows</option>
                                    <option value="grid-rows-6">6 Rows</option>
                                  </select>
                                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                                </div>
                                <input
                                  type="text"
                                  placeholder="custom e.g. 100px auto"
                                  value={parseArbitraryValue(selectedElement.classes, "grid-rows-")}
                                  onChange={(e) => updateArbitraryClass("grid-rows-", e.target.value)}
                                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
                                />
                              </div>
                            </div>

                            {/* justify-items */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">justify-items</label>
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "justifyItems")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "justifyItems", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">normal / stretch (default)</option>
                                  <option value="justify-items-normal">normal</option>
                                  <option value="justify-items-stretch">stretch</option>
                                  <option value="justify-items-center">center</option>
                                  <option value="justify-items-start">start</option>
                                  <option value="justify-items-end">end</option>
                                  <option value="justify-items-left">left</option>
                                  <option value="justify-items-right">right</option>
                                  <option value="justify-items-legacy">legacy</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                            </div>

                            {/* align-items */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">align-items</label>
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "alignment")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "alignment", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">normal / stretch (default)</option>
                                  <option value="items-normal">normal</option>
                                  <option value="items-stretch">stretch</option>
                                  <option value="items-center">center</option>
                                  <option value="items-start">start</option>
                                  <option value="items-end">end</option>
                                  <option value="items-baseline">baseline</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                            </div>

                            {/* item gap with dual-nature instructions */}
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono font-bold">item gap</label>
                                <span className="text-[8px] text-rose-700 bg-rose-50 px-1 py-0.5 rounded font-bold uppercase tracking-wide">Dual-Nature</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="relative">
                                  <select
                                    value={getActiveGroupClass(selectedElement.classes, "gap")}
                                    onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "gap", e.target.value) }))}
                                    className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                  >
                                    <option value="">default / custom option</option>
                                    <option value="gap-0">0px</option>
                                    <option value="gap-1">4px</option>
                                    <option value="gap-2">8px</option>
                                    <option value="gap-3">12px</option>
                                    <option value="gap-4">16px</option>
                                    <option value="gap-6">24px</option>
                                    <option value="gap-8">32px</option>
                                  </select>
                                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                                </div>
                                <input
                                  type="text"
                                  placeholder="custom e.g. 1.25rem"
                                  value={parseArbitraryValue(selectedElement.classes, "gap-")}
                                  onChange={(e) => updateArbitraryClass("gap-", e.target.value)}
                                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
                                />
                              </div>
                              <p className="text-[9px] text-rose-700 leading-snug bg-rose-50/40 p-2 rounded-xl border border-rose-100/30 font-sans font-medium">
                                💡 **Grid Gap Dual-Nature:** Spacing applies column-wise and row-wise across cellular layouts seamlessly.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* --- 4. GRID ITEMS SUB-CATEGORY --- */}
                        <div className="border-t border-stone-200/40 pt-4.5 space-y-4 font-sans select-none">
                          <div className="text-[10px] uppercase font-bold tracking-wider text-stone-500 font-mono flex items-center gap-1.5">
                            <Sparkles size={11} className="text-rose-600" />
                            <span>Grid Items (Child placement)</span>
                          </div>

                          {/* Column Spanning */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">grid-column (spanning)</label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="relative">
                                <select
                                  value={getPrefixedClass(selectedElement.classes, "col-span-")}
                                  onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "col-span-", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">default / custom span</option>
                                  <option value="col-span-1">col-span-1</option>
                                  <option value="col-span-2">col-span-2</option>
                                  <option value="col-span-3">col-span-3</option>
                                  <option value="col-span-4">col-span-4</option>
                                  <option value="col-span-6">col-span-6</option>
                                  <option value="col-span-full">col-span-full (all cols)</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                              <input
                                type="text"
                                placeholder="custom span / start e.g. 1 / 3"
                                value={parseArbitraryValue(selectedElement.classes, "col-")}
                                onChange={(e) => updateArbitraryClass("col-", e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
                              />
                            </div>
                          </div>

                          {/* Row Spanning */}
                          <div className="flex flex-col gap-1.5 font-mono">
                            <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono font-sans font-bold">grid-row (spanning)</label>
                            <div className="grid grid-cols-2 gap-2 font-sans font-mono font-sans">
                              <div className="relative">
                                <select
                                  value={getPrefixedClass(selectedElement.classes, "row-span-")}
                                  onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "row-span-", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">default / custom span</option>
                                  <option value="row-span-1">row-span-1</option>
                                  <option value="row-span-2">row-span-2</option>
                                  <option value="row-span-3">row-span-3</option>
                                  <option value="row-span-full">row-span-full</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                              <input
                                type="text"
                                placeholder="custom row e.g. span 2"
                                value={parseArbitraryValue(selectedElement.classes, "row-")}
                                onChange={(e) => updateArbitraryClass("row-", e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
                              />
                            </div>
                          </div>

                          {/* justify-self & align-self override */}
                          <div className="grid grid-cols-2 gap-3">
                            {/* justify-self */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">justify-self</label>
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "justifySelf")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "justifySelf", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">auto</option>
                                  <option value="justify-self-auto">auto</option>
                                  <option value="justify-self-normal">normal</option>
                                  <option value="justify-self-stretch">stretch</option>
                                  <option value="justify-self-start">start</option>
                                  <option value="justify-self-end">end</option>
                                  <option value="justify-self-center">center</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                            </div>

                            {/* align-self */}
                            <div className="flex flex-col gap-1.5 font-mono">
                              <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-sans font-bold">align-self</label>
                              <div className="relative font-sans">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "alignSelf")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "alignSelf", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">auto</option>
                                  <option value="self-auto">auto</option>
                                  <option value="self-start">start</option>
                                  <option value="self-end">end</option>
                                  <option value="self-center">center</option>
                                  <option value="self-stretch">stretch</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                            </div>
                          </div>

                          {/* Grid Area Name key-mapping */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">grid-area</label>
                            <input
                              type="text"
                              placeholder="e.g. header, main, sidebar"
                              value={(() => {
                                const cls = selectedElement.classes.split(/\s+/).find((c) => c.startsWith("[grid-area:") && c.endsWith("]"));
                                return cls ? cls.substring("[grid-area:".length, cls.length - 1) : "";
                              })()}
                              onChange={(e) => {
                                const val = e.target.value.trim();
                                const currentTokens = selectedElement.classes.split(/\s+/).filter(Boolean);
                                let filtered = currentTokens.filter((token) => !token.startsWith("[grid-area:"));
                                if (val) {
                                  filtered.push(`[grid-area:${val}]`);
                                }
                                updateTree((n) => ({ classes: filtered.join(" ") }));
                              }}
                              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 shadow-xs focus:outline-none placeholder-stone-400 focus:border-rose-400 font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* --- 5. OVERFLOW --- */}
                  <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-1 shadow-sm">
                    {sectionHeader("overflow", "Overflow & scrolling behavior", Layers)}
                    {expandedLayoutSections.overflow && (
                      <div className="flex flex-col gap-4 animate-in fade-in duration-200 pt-3">
                        {/* Global */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1 font-mono">overflow</label>
                          <div className="relative">
                            <select
                              value={getActiveGroupClass(selectedElement.classes, "overflow")}
                              onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "overflow", e.target.value) }))}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
                            >
                              <option value="">default (visible)</option>
                              <option value="overflow-auto">overflow-auto</option>
                              <option value="overflow-hidden">overflow-hidden</option>
                              <option value="overflow-clip">overflow-clip</option>
                              <option value="overflow-visible">overflow-visible</option>
                              <option value="overflow-scroll">overflow-scroll</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                        </div>

                        {/* X / Y */}
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: "overflowX" as const, label: "overflow-x", options: [{ v: "", l: "auto" }, { v: "overflow-x-auto", l: "auto" }, { v: "overflow-x-hidden", l: "hidden" }, { v: "overflow-x-clip", l: "clip" }, { v: "overflow-x-scroll", l: "scroll" }] },
                            { id: "overflowY" as const, label: "overflow-y", options: [{ v: "", l: "auto" }, { v: "overflow-y-auto", l: "auto" }, { v: "overflow-y-hidden", l: "hidden" }, { v: "overflow-y-clip", l: "clip" }, { v: "overflow-y-scroll", l: "scroll" }] }
                          ].map((sel) => (
                            <div key={sel.id} className="flex flex-col gap-1.5">
                              <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1 font-mono">{sel.label}</label>
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, sel.id)}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, sel.id, e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-2 pr-6 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
                                >
                                  {sel.options.map((opt) => (
                                    <option key={opt.v} value={opt.v}>{opt.l}</option>
                                  ))}
                                </select>
                                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* scroll behavior & snap */}
                        {[
                          { id: "scrollBehavior" as const, label: "scroll-behavior", options: [{ v: "", l: "default" }, { v: "scroll-auto", l: "scroll-auto" }, { v: "scroll-smooth", l: "scroll-smooth" }] },
                          { id: "scrollSnapType" as const, label: "scroll-snap-type", options: [{ v: "", l: "none" }, { v: "snap-none", l: "snap-none" }, { v: "snap-x", l: "snap-x" }, { v: "snap-y", l: "snap-y" }, { v: "snap-both", l: "snap-both" }] }
                        ].map((sel) => (
                          <div key={sel.id} className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1 font-mono">{sel.label}</label>
                            <div className="relative">
                              <select
                                value={getActiveGroupClass(selectedElement.classes, sel.id)}
                                onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, sel.id, e.target.value) }))}
                                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
                              >
                                {sel.options.map((opt) => (
                                  <option key={opt.v} value={opt.v}>{opt.l}</option>
                                ))}
                              </select>
                              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ==================== 2. TYPOGRAPHY & TEXT ==================== */}
        {inspectorSection === "typography" && (
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Type size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">CSS Typography & Text Metrics</span>
            </div>

            {(() => {
              // Helpers to read and write Tailwind mapping vs JIT styles
              const parseArbitraryValue = (className: string, prefix: string): string => {
                if (!className) return "";
                const match = className.match(new RegExp(`(?:^|\\s)${prefix.replace(/[-\[\]()]/g, '\\$&')}\\[([^\\]]+)\\](?:$|\\s)`));
                if (match) return match[1].replace(/_/g, " ");
                const active = className.split(/\s+/).find((c) => c.startsWith(prefix) && !c.includes("["));
                return active ? active.substring(prefix.length) : "";
              };

              const updateArbitraryClass = (prefix: string, value: string) => {
                const currentTokens = selectedElement.classes.split(/\s+/).filter(Boolean);
                let filtered = currentTokens.filter((token) => !token.startsWith(prefix));
                if (value && value.trim()) {
                  filtered.push(`${prefix}[${value.trim().replace(/\s+/g, "_")}]`);
                }
                updateTree((n) => ({ classes: filtered.join(" ") }));
              };

              const parseArbitraryProperty = (className: string, propName: string): string => {
                if (!className) return "";
                const match = className.match(new RegExp(`(?:^|\\s)\\[${propName.replace(/[-\[\]()]/g, '\\$&')}:([^\\]]+)\\](?:$|\\s)`));
                return match ? match[1].replace(/_/g, " ") : "";
              };

              const updateArbitraryProperty = (propName: string, value: string) => {
                const currentTokens = selectedElement.classes.split(/\s+/).filter(Boolean);
                let filtered = currentTokens.filter((token) => !token.startsWith(`[${propName}:`));
                if (value && value.trim()) {
                  filtered.push(`[${propName}:${value.trim().replace(/\s+/g, "_")}]`);
                }
                updateTree((n) => ({ classes: filtered.join(" ") }));
              };

              // Map properties helper
              const getPropValue = (propName: string, tailwindMap?: { [key: string]: string }): string => {
                const arb = parseArbitraryProperty(selectedElement.classes, propName);
                if (arb) return arb;

                if (tailwindMap) {
                  const tokens = selectedElement.classes.split(/\s+/).filter(Boolean);
                  for (const [twClass, realVal] of Object.entries(tailwindMap)) {
                    if (tokens.includes(twClass)) {
                      return realVal;
                    }
                  }
                }
                return "";
              };

              const setPropValue = (propName: string, value: string, tailwindMap?: { [key: string]: string }) => {
                const currentTokens = selectedElement.classes.split(/\s+/).filter(Boolean);
                let filtered = currentTokens.filter((token) => !token.startsWith(`[${propName}:`));

                if (tailwindMap) {
                  const twClasses = Object.keys(tailwindMap);
                  filtered = filtered.filter((token) => !twClasses.includes(token));
                }

                if (value && value.trim()) {
                  let twMatch = "";
                  if (tailwindMap) {
                    for (const [twClass, realVal] of Object.entries(tailwindMap)) {
                      if (realVal === value.trim()) {
                        twMatch = twClass;
                        break;
                      }
                    }
                  }

                  if (twMatch) {
                    filtered.push(twMatch);
                  } else {
                    filtered.push(`[${propName}:${value.trim().replace(/\s+/g, "_")}]`);
                  }
                }
                updateTree((n) => ({ classes: filtered.join(" ") }));
              };

              // Preset mappings for dual Tailwind compatibility and native CSS integration
              const fontFamilyMap = { "font-sans": "sans-serif", "font-serif": "serif", "font-mono": "monospace" };
              const fontWeightMap = { "font-light": "300", "font-normal": "400", "font-medium": "500", "font-semibold": "600", "font-bold": "700" };
              const fontStyleMap = { "italic": "italic", "not-italic": "normal" };
              const fontSizeMap = { "text-xs": "xx-small", "text-sm": "x-small", "text-base": "medium", "text-lg": "large", "text-xl": "x-large", "text-2xl": "xx-large" };
              const textAlignMap = { "text-left": "left", "text-center": "center", "text-right": "right", "text-justify": "justify", "text-start": "start", "text-end": "end" };
              const textTransformMap = { "uppercase": "uppercase", "lowercase": "lowercase", "capitalize": "capitalize" };
              const textDecorationLineMap = { "underline": "underline", "line-through": "line-through" };
              const lineHeightMap = { "leading-none": "1", "leading-tight": "1.25", "leading-snug": "1.375", "leading-normal": "1.5", "leading-relaxed": "1.625", "leading-loose": "2" };
              const letterSpacingMap = { "tracking-tighter": "-0.05em", "tracking-tight": "-0.025em", "tracking-normal": "0em", "tracking-wide": "0.025em", "tracking-wider": "0.05em", "tracking-widest": "0.1em" };
              const textDecorationStyleMap = { "decoration-solid": "solid", "decoration-double": "double", "decoration-dotted": "dotted", "decoration-dashed": "dashed", "decoration-wavy": "wavy" };

              return (
                <div className="space-y-4">
                  {/* Visual Subcategory Pill Selector to easily skip to areas */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide shrink-0 touch-pan-x">
                    {[
                      { id: "basic", label: "Basic Styles" },
                      { id: "sizing", label: "Sizing" },
                      { id: "spacing", label: "Alignment & Spacing" },
                      { id: "wrapping", label: "Wrapping & Clamping" },
                      { id: "trim", label: "Trim" },
                      { id: "decoration", label: "Decorations" },
                      { id: "emphasis", label: "Emphasis" },
                      { id: "transform", label: "Transform" },
                      { id: "fontControls", label: "OpenType" },
                      { id: "direction", label: "Writing Mode" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setTypographySubCategory(tab.id)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 transition-all cursor-pointer ${
                          typographySubCategory === tab.id
                            ? "bg-stone-900 border-stone-900 text-white shadow-xs"
                            : "bg-white border-stone-200 text-stone-500 hover:text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* ==================== SUB-CATEGORY LISTS ==================== */}

                  {/* 1. Font Selection & Basic Styling */}
                  {typographySubCategory === "basic" && (
                    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                        <Type size={12} />
                        <span>Font Selection & Basic Styling</span>
                      </div>

                      {/* font-family */}
                      <div className="space-y-2">
                        <SegmentedControl
                          label="font-family"
                          value={getPropValue("font-family", fontFamilyMap) || "sans-serif"}
                          onChange={(val) => setPropValue("font-family", val, fontFamilyMap)}
                          options={[
                            { value: "sans-serif", label: "Sans" },
                            { value: "serif", label: "Serif" },
                            { value: "monospace", label: "Mono" }
                          ]}
                        />
                        <div className="flex flex-col gap-1.5 w-full text-left">
                          <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider pl-0.5 font-sans">Custom Font Override</span>
                          <input
                            type="text"
                            placeholder='e.g. "Space Grotesk"'
                            value={parseArbitraryProperty(selectedElement.classes, "font-family")}
                            onChange={(e) => updateArbitraryProperty("font-family", e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none placeholder-stone-300 font-mono shadow-sm"
                          />
                        </div>
                      </div>

                      {/* font-weight */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">font-weight</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select
                              value={getPropValue("font-weight", fontWeightMap)}
                              onChange={(e) => setPropValue("font-weight", e.target.value, fontWeightMap)}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                            >
                              <option value="">Default</option>
                              <option value="normal">normal</option>
                              <option value="bold">bold</option>
                              <option value="bolder">bolder</option>
                              <option value="lighter">lighter</option>
                              <option value="300">300 (Light)</option>
                              <option value="400">400 (Regular)</option>
                              <option value="500">500 (Medium)</option>
                              <option value="600">600 (Semi-Bold)</option>
                              <option value="700">700 (Bold)</option>
                              <option value="900">900 (Black)</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. 550"
                            value={parseArbitraryProperty(selectedElement.classes, "font-weight")}
                            onChange={(e) => updateArbitraryProperty("font-weight", e.target.value)}
                            className="w-1/4 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white placeholder-stone-400 font-mono"
                          />
                        </div>
                      </div>

                      {/* font-style */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">font-style</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select
                              value={getPropValue("font-style", fontStyleMap)}
                              onChange={(e) => setPropValue("font-style", e.target.value, fontStyleMap)}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                            >
                              <option value="">Default</option>
                              <option value="normal">normal</option>
                              <option value="italic">italic</option>
                              <option value="oblique">oblique</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. oblique 12deg"
                            value={parseArbitraryProperty(selectedElement.classes, "font-style")}
                            onChange={(e) => updateArbitraryProperty("font-style", e.target.value)}
                            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white placeholder-stone-400 font-mono"
                          />
                        </div>
                      </div>

                      {/* font-synthesis */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">font-synthesis</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select
                              value={parseArbitraryProperty(selectedElement.classes, "font-synthesis")}
                              onChange={(e) => updateArbitraryProperty("font-synthesis", e.target.value)}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                            >
                              <option value="">Default</option>
                              <option value="none">none</option>
                              <option value="weight">weight</option>
                              <option value="style">style</option>
                              <option value="small-caps">small-caps</option>
                              <option value="weight style">weight style</option>
                              <option value="weight style small-caps">all active</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                          <input
                            type="text"
                            placeholder="custom string"
                            value={parseArbitraryProperty(selectedElement.classes, "font-synthesis")}
                            onChange={(e) => updateArbitraryProperty("font-synthesis", e.target.value)}
                            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Text Sizing & Scalability */}
                  {typographySubCategory === "sizing" && (
                    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                        <Maximize size={12} />
                        <span>Text Sizing & Scalability</span>
                      </div>

                      {/* font-size */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">font-size</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select
                              value={getPropValue("font-size", fontSizeMap)}
                              onChange={(e) => setPropValue("font-size", e.target.value, fontSizeMap)}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                            >
                              <option value="">Default</option>
                              <option value="xx-small">xx-small (12px equiv)</option>
                              <option value="x-small">x-small (14px equiv)</option>
                              <option value="medium">medium (16px equiv)</option>
                              <option value="large">large (18px equiv)</option>
                              <option value="x-large">x-large (20px equiv)</option>
                              <option value="xx-large">xx-large (24px equiv)</option>
                              <option value="xxx-large">xxx-large</option>
                              <option value="smaller">smaller</option>
                              <option value="larger">larger</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. 1.5rem, 5vw, 16px"
                            value={parseArbitraryProperty(selectedElement.classes, "font-size")}
                            onChange={(e) => updateArbitraryProperty("font-size", e.target.value)}
                            className="w-1/2 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white placeholder-stone-405 font-mono"
                          />
                        </div>
                      </div>

                      {/* font-size-adjust */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">font-size-adjust</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select
                              value={parseArbitraryProperty(selectedElement.classes, "font-size-adjust")}
                              onChange={(e) => updateArbitraryProperty("font-size-adjust", e.target.value)}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                            >
                              <option value="">Default (none)</option>
                              <option value="none">none</option>
                              <option value="ex-height">ex-height</option>
                              <option value="cap-height">cap-height</option>
                              <option value="ch-width">ch-width</option>
                              <option value="from-font">from-font</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. 0.5"
                            value={parseArbitraryProperty(selectedElement.classes, "font-size-adjust")}
                            onChange={(e) => updateArbitraryProperty("font-size-adjust", e.target.value)}
                            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>

                      {/* font-stretch */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">font-stretch</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select
                              value={parseArbitraryProperty(selectedElement.classes, "font-stretch")}
                              onChange={(e) => updateArbitraryProperty("font-stretch", e.target.value)}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                            >
                              <option value="">Default</option>
                              <option value="normal">normal</option>
                              <option value="ultra-condensed">ultra-condensed</option>
                              <option value="extra-condensed">extra-condensed</option>
                              <option value="condensed">condensed</option>
                              <option value="semi-condensed">semi-condensed</option>
                              <option value="semi-expanded">semi-expanded</option>
                              <option value="expanded">expanded</option>
                              <option value="extra-expanded">extra-expanded</option>
                              <option value="ultra-expanded">ultra-expanded</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. 110%"
                            value={parseArbitraryProperty(selectedElement.classes, "font-stretch")}
                            onChange={(e) => updateArbitraryProperty("font-stretch", e.target.value)}
                            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Text Alignment, Justification & Spacing */}
                  {typographySubCategory === "spacing" && (
                    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                        <Sliders size={12} />
                        <span>Alignment, Justification & Spacing</span>
                      </div>

                      {/* text-align */}
                      <SegmentedControl
                        label="text-align"
                        value={getPropValue("text-align", textAlignMap) || "left"}
                        onChange={(val) => setPropValue("text-align", val, textAlignMap)}
                        options={[
                          { value: "left", icon: AlignLeft },
                          { value: "center", icon: AlignCenter },
                          { value: "right", icon: AlignRight },
                          { value: "justify", icon: AlignJustify }
                        ]}
                      />

                      {/* text-align-last */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-align-last</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "text-align-last")}
                            onChange={(e) => updateArbitraryProperty("text-align-last", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (auto)</option>
                            <option value="auto">auto</option>
                            <option value="start">start</option>
                            <option value="end">end</option>
                            <option value="left">left</option>
                            <option value="right">right</option>
                            <option value="center">center</option>
                            <option value="justify">justify</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* text-justify */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-justify</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "text-justify")}
                            onChange={(e) => updateArbitraryProperty("text-justify", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (auto)</option>
                            <option value="auto">auto</option>
                            <option value="none">none</option>
                            <option value="inter-word">inter-word</option>
                            <option value="inter-character">inter-character</option>
                            <option value="distribute">distribute</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* line-height */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">line-height</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select
                              value={getPropValue("line-height", lineHeightMap)}
                              onChange={(e) => setPropValue("line-height", e.target.value, lineHeightMap)}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                            >
                              <option value="">Default</option>
                              <option value="1">1 (none equiv)</option>
                              <option value="1.25">1.25 (tight)</option>
                              <option value="1.375">1.375 (snug)</option>
                              <option value="1.5">1.5 (normal)</option>
                              <option value="1.625">1.625 (relaxed)</option>
                              <option value="2">2 (loose)</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. 1.8em, 24px, 1.4"
                            value={parseArbitraryProperty(selectedElement.classes, "line-height")}
                            onChange={(e) => updateArbitraryProperty("line-height", e.target.value)}
                            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>

                      {/* letter-spacing */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">letter-spacing (tracking)</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select
                              value={getPropValue("letter-spacing", letterSpacingMap)}
                              onChange={(e) => setPropValue("letter-spacing", e.target.value, letterSpacingMap)}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                            >
                              <option value="">Default</option>
                              <option value="-0.05em">Tighter (-0.05em)</option>
                              <option value="-0.025em">Tight (-0.025em)</option>
                              <option value="0em">Normal (0em)</option>
                              <option value="0.025em">Wide (0.025em)</option>
                              <option value="0.05em">Wider (0.05em)</option>
                              <option value="0.1em">Widest (0.1em)</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. 2px, 0.05em"
                            value={parseArbitraryProperty(selectedElement.classes, "letter-spacing")}
                            onChange={(e) => updateArbitraryProperty("letter-spacing", e.target.value)}
                            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>

                      {/* word-spacing */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">word-spacing</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. normal, 4px, 0.25rem, 10%"
                            value={parseArbitraryProperty(selectedElement.classes, "word-spacing")}
                            onChange={(e) => updateArbitraryProperty("word-spacing", e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>

                      {/* text-indent */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-indent</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. 20px, 2em, hanging, each-line"
                            value={parseArbitraryProperty(selectedElement.classes, "text-indent")}
                            onChange={(e) => updateArbitraryProperty("text-indent", e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. Text Wrapping, Breaking & Clamping */}
                  {typographySubCategory === "wrapping" && (
                    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                        <Layers size={12} />
                        <span>Wrapping, Breaking & Clamping</span>
                      </div>

                      {/* white-space */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">white-space</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "white-space")}
                            onChange={(e) => updateArbitraryProperty("white-space", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (normal)</option>
                            <option value="normal">normal</option>
                            <option value="pre">pre</option>
                            <option value="nowrap">nowrap</option>
                            <option value="pre-wrap">pre-wrap</option>
                            <option value="pre-line">pre-line</option>
                            <option value="break-spaces">break-spaces</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* text-wrap */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-wrap</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "text-wrap")}
                            onChange={(e) => updateArbitraryProperty("text-wrap", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (wrap)</option>
                            <option value="wrap">wrap</option>
                            <option value="nowrap">nowrap</option>
                            <option value="balance">balance (header layout)</option>
                            <option value="pretty">pretty (avoid orphans)</option>
                            <option value="stable">stable</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* word-break */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">word-break</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "word-break")}
                            onChange={(e) => updateArbitraryProperty("word-break", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default</option>
                            <option value="normal">normal</option>
                            <option value="break-all">break-all</option>
                            <option value="keep-all">keep-all</option>
                            <option value="break-word">break-word</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* overflow-wrap */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">overflow-wrap (word-wrap)</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "overflow-wrap")}
                            onChange={(e) => updateArbitraryProperty("overflow-wrap", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default</option>
                            <option value="normal">normal</option>
                            <option value="break-word">break-word</option>
                            <option value="anywhere">anywhere</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* text-overflow */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-overflow</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select
                              value={parseArbitraryProperty(selectedElement.classes, "text-overflow")}
                              onChange={(e) => updateArbitraryProperty("text-overflow", e.target.value)}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                            >
                              <option value="">Default (clip)</option>
                              <option value="clip">clip</option>
                              <option value="ellipsis">ellipsis (...)</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                          <input
                            type="text"
                            placeholder='Custom e.g. "…"'
                            value={parseArbitraryProperty(selectedElement.classes, "text-overflow")}
                            onChange={(e) => updateArbitraryProperty("text-overflow", e.target.value)}
                            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>

                      {/* line-clamp */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">line-clamp</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select
                              value={parseArbitraryProperty(selectedElement.classes, "line-clamp")}
                              onChange={(e) => updateArbitraryProperty("line-clamp", e.target.value)}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                            >
                              <option value="">None (default)</option>
                              <option value="none">none</option>
                              <option value="1">1 line</option>
                              <option value="2">2 lines</option>
                              <option value="3">3 lines</option>
                              <option value="4">4 lines</option>
                              <option value="5">5 lines</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                          <input
                            type="text"
                            placeholder='e.g. 3 "..."'
                            value={parseArbitraryProperty(selectedElement.classes, "line-clamp")}
                            onChange={(e) => updateArbitraryProperty("line-clamp", e.target.value)}
                            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>

                      {/* hyphens */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">hyphens</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "hyphens")}
                            onChange={(e) => updateArbitraryProperty("hyphens", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (manual)</option>
                            <option value="none">none</option>
                            <option value="manual">manual</option>
                            <option value="auto">auto</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* hyphenate-character */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">hyphenate-character</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. auto, or any custom hyphen string"
                            value={parseArbitraryProperty(selectedElement.classes, "hyphenate-character")}
                            onChange={(e) => updateArbitraryProperty("hyphenate-character", e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. Text Box Trim & Metrics */}
                  {typographySubCategory === "trim" && (
                    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                        <Sliders size={12} />
                        <span>Text Box Trim & Metrics</span>
                      </div>

                      {/* text-box-trim */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-box-trim</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "text-box-trim")}
                            onChange={(e) => updateArbitraryProperty("text-box-trim", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (none)</option>
                            <option value="none">none</option>
                            <option value="trim-over">trim-over (top)</option>
                            <option value="trim-under">trim-under (bottom)</option>
                            <option value="trim-both">trim-both</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* text-box-edge */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-box-edge</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "text-box-edge")}
                            onChange={(e) => updateArbitraryProperty("text-box-edge", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (auto)</option>
                            <option value="auto">auto</option>
                            <option value="text">text</option>
                            <option value="cap">cap</option>
                            <option value="ex">ex</option>
                            <option value="ideographic">ideographic</option>
                            <option value="ideographic-ink">ideographic-ink</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* text-box */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-box (shorthand)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. trim-both cap, trim-over text"
                            value={parseArbitraryProperty(selectedElement.classes, "text-box")}
                            onChange={(e) => updateArbitraryProperty("text-box", e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 6. Text Decoration Systems */}
                  {typographySubCategory === "decoration" && (
                    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                        <Palette size={12} />
                        <span>Text Decoration Systems</span>
                      </div>

                      {/* text-decoration-line */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-decoration-line</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select
                              value={getPropValue("text-decoration-line", textDecorationLineMap)}
                              onChange={(e) => setPropValue("text-decoration-line", e.target.value, textDecorationLineMap)}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                            >
                              <option value="">Default (none)</option>
                              <option value="none">none</option>
                              <option value="underline">underline</option>
                              <option value="overline">overline</option>
                              <option value="line-through">line-through</option>
                              <option value="blink">blink</option>
                              <option value="underline overline">underline overline</option>
                              <option value="underline line-through">underline line-through</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                          <input
                            type="text"
                            placeholder="custom combo"
                            value={parseArbitraryProperty(selectedElement.classes, "text-decoration-line")}
                            onChange={(e) => updateArbitraryProperty("text-decoration-line", e.target.value)}
                            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>

                      {/* text-decoration-color */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-decoration-color</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select
                              value={parseArbitraryProperty(selectedElement.classes, "text-decoration-color")}
                              onChange={(e) => updateArbitraryProperty("text-decoration-color", e.target.value)}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                            >
                              <option value="">Default</option>
                              <option value="currentcolor">currentcolor</option>
                              <option value="transparent">transparent</option>
                              <option value="red">red</option>
                              <option value="blue">blue</option>
                              <option value="black">black</option>
                              <option value="white">white</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. #ff0000, oklch(0.6 0.2 29)"
                            value={parseArbitraryProperty(selectedElement.classes, "text-decoration-color")}
                            onChange={(e) => updateArbitraryProperty("text-decoration-color", e.target.value)}
                            className="w-1/2 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white placeholder-stone-400 font-mono"
                          />
                        </div>
                      </div>

                      {/* text-decoration-style */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-decoration-style</label>
                        <div className="relative">
                          <select
                            value={getPropValue("text-decoration-style", textDecorationStyleMap)}
                            onChange={(e) => setPropValue("text-decoration-style", e.target.value, textDecorationStyleMap)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (solid)</option>
                            <option value="solid">solid</option>
                            <option value="double">double</option>
                            <option value="dotted">dotted</option>
                            <option value="dashed">dashed</option>
                            <option value="wavy">wavy</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* text-decoration-thickness */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-decoration-thickness</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select
                              value={parseArbitraryProperty(selectedElement.classes, "text-decoration-thickness")}
                              onChange={(e) => updateArbitraryProperty("text-decoration-thickness", e.target.value)}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                            >
                              <option value="">Default</option>
                              <option value="auto">auto</option>
                              <option value="from-font">from-font</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. 2px, 10%"
                            value={parseArbitraryProperty(selectedElement.classes, "text-decoration-thickness")}
                            onChange={(e) => updateArbitraryProperty("text-decoration-thickness", e.target.value)}
                            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>

                      {/* text-underline-offset */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-underline-offset</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select
                              value={parseArbitraryProperty(selectedElement.classes, "text-underline-offset")}
                              onChange={(e) => updateArbitraryProperty("text-underline-offset", e.target.value)}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                            >
                              <option value="">Default (auto)</option>
                              <option value="auto">auto</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. 3px, 10%"
                            value={parseArbitraryProperty(selectedElement.classes, "text-underline-offset")}
                            onChange={(e) => updateArbitraryProperty("text-underline-offset", e.target.value)}
                            className="w-1/2 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>

                      {/* text-underline-position */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-underline-position</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "text-underline-position")}
                            onChange={(e) => updateArbitraryProperty("text-underline-position", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (auto)</option>
                            <option value="auto">auto</option>
                            <option value="under">under</option>
                            <option value="left">left</option>
                            <option value="right">right</option>
                            <option value="under left">under left</option>
                            <option value="under right">under right</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 7. Text Emphasis & Effects */}
                  {typographySubCategory === "emphasis" && (
                    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                        <Sparkles size={12} />
                        <span>Text Emphasis & Effects</span>
                      </div>

                      {/* text-emphasis-style */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-emphasis-style</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select
                              value={parseArbitraryProperty(selectedElement.classes, "text-emphasis-style")}
                              onChange={(e) => updateArbitraryProperty("text-emphasis-style", e.target.value)}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                            >
                              <option value="">Default (none)</option>
                              <option value="none">none</option>
                              <option value="filled">filled</option>
                              <option value="open">open</option>
                              <option value="dot">dot</option>
                              <option value="circle">circle</option>
                              <option value="double-circle">double-circle</option>
                              <option value="triangle">triangle</option>
                              <option value="sesame">sesame</option>
                              <option value="filled dot">filled dot</option>
                              <option value="open circle">open circle</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                          <input
                            type="text"
                            placeholder='Custom e.g. "x"'
                            value={parseArbitraryProperty(selectedElement.classes, "text-emphasis-style")}
                            onChange={(e) => updateArbitraryProperty("text-emphasis-style", e.target.value)}
                            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>

                      {/* text-emphasis-color */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-emphasis-color</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. currentcolor, red, #00ff00, oklch(...)"
                            value={parseArbitraryProperty(selectedElement.classes, "text-emphasis-color")}
                            onChange={(e) => updateArbitraryProperty("text-emphasis-color", e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>

                      {/* text-emphasis-position */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-emphasis-position</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "text-emphasis-position")}
                            onChange={(e) => updateArbitraryProperty("text-emphasis-position", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default</option>
                            <option value="over">over</option>
                            <option value="under">under</option>
                            <option value="over right">over right</option>
                            <option value="over left">over left</option>
                            <option value="under right">under right</option>
                            <option value="under left">under left</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* text-shadow */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-shadow</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. 1px 1px 2px rgba(0,0,0,0.3)"
                            value={parseArbitraryProperty(selectedElement.classes, "text-shadow")}
                            onChange={(e) => updateArbitraryProperty("text-shadow", e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 8. Text Transform & Case Control */}
                  {typographySubCategory === "transform" && (
                    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                        <Type size={12} />
                        <span>Text Transform & Case Control</span>
                      </div>

                      {/* text-transform */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-transform</label>
                        <div className="relative">
                          <select
                            value={getPropValue("text-transform", textTransformMap)}
                            onChange={(e) => setPropValue("text-transform", e.target.value, textTransformMap)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (none)</option>
                            <option value="none">none</option>
                            <option value="capitalize">capitalize</option>
                            <option value="uppercase">uppercase</option>
                            <option value="lowercase">lowercase</option>
                            <option value="full-width">full-width</option>
                            <option value="full-size-kana">full-size-kana</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* font-variant-caps */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">font-variant-caps</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "font-variant-caps")}
                            onChange={(e) => updateArbitraryProperty("font-variant-caps", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (normal)</option>
                            <option value="normal">normal</option>
                            <option value="small-caps">small-caps</option>
                            <option value="all-small-caps">all-small-caps</option>
                            <option value="petite-caps">petite-caps</option>
                            <option value="all-petite-caps">all-petite-caps</option>
                            <option value="unicase">unicase</option>
                            <option value="titling-caps">titling-caps</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 9. OpenType & Variable Font Controls */}
                  {typographySubCategory === "fontControls" && (
                    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                        <Sliders size={12} />
                        <span>OpenType & Variable Font Control</span>
                      </div>

                      {/* font-variant-ligatures */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">font-variant-ligatures</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "font-variant-ligatures")}
                            onChange={(e) => updateArbitraryProperty("font-variant-ligatures", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (normal)</option>
                            <option value="normal">normal</option>
                            <option value="none">none</option>
                            <option value="common-ligatures">common-ligatures</option>
                            <option value="no-common-ligatures">no-common-ligatures</option>
                            <option value="discretionary-ligatures">discretionary-ligatures</option>
                            <option value="historical-ligatures">historical-ligatures</option>
                            <option value="contextual">contextual</option>
                            <option value="no-contextual">no-contextual</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* font-variant-numeric */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">font-variant-numeric</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "font-variant-numeric")}
                            onChange={(e) => updateArbitraryProperty("font-variant-numeric", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (normal)</option>
                            <option value="normal">normal</option>
                            <option value="ordinal">ordinal</option>
                            <option value="slashed-zero">slashed-zero</option>
                            <option value="lining-nums">lining-nums</option>
                            <option value="oldstyle-nums">oldstyle-nums</option>
                            <option value="proportional-nums">proportional-nums</option>
                            <option value="tabular-nums">tabular-nums</option>
                            <option value="diagonal-fractions">diagonal-fractions</option>
                            <option value="stacked-fractions">stacked-fractions</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* font-variant-east-asian */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">font-variant-east-asian</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "font-variant-east-asian")}
                            onChange={(e) => updateArbitraryProperty("font-variant-east-asian", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (normal)</option>
                            <option value="normal">normal</option>
                            <option value="jis78">jis78</option>
                            <option value="jis83">jis83</option>
                            <option value="jis90">jis90</option>
                            <option value="jis04">jis04</option>
                            <option value="simplified">simplified</option>
                            <option value="traditional">traditional</option>
                            <option value="full-width">full-width</option>
                            <option value="proportional-width">proportional-width</option>
                            <option value="ruby">ruby</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* font-variant-emoji */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">font-variant-emoji</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "font-variant-emoji")}
                            onChange={(e) => updateArbitraryProperty("font-variant-emoji", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (normal)</option>
                            <option value="normal">normal</option>
                            <option value="text">text</option>
                            <option value="emoji">emoji</option>
                            <option value="unicode">unicode</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* font-feature-settings */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">font-feature-settings</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder='e.g. "smcp" on, "liga" 0'
                            value={parseArbitraryProperty(selectedElement.classes, "font-feature-settings")}
                            onChange={(e) => updateArbitraryProperty("font-feature-settings", e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>

                      {/* font-variation-settings */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">font-variation-settings</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder='e.g. "wght" 500, "wdth" 85'
                            value={parseArbitraryProperty(selectedElement.classes, "font-variation-settings")}
                            onChange={(e) => updateArbitraryProperty("font-variation-settings", e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>

                      {/* font-optical-sizing */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">font-optical-sizing</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "font-optical-sizing")}
                            onChange={(e) => updateArbitraryProperty("font-optical-sizing", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (auto)</option>
                            <option value="auto">auto</option>
                            <option value="none">none</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* font-palette */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">font-palette</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select
                              value={parseArbitraryProperty(selectedElement.classes, "font-palette")}
                              onChange={(e) => updateArbitraryProperty("font-palette", e.target.value)}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                            >
                              <option value="">Default (normal)</option>
                              <option value="normal">normal</option>
                              <option value="light">light</option>
                              <option value="dark">dark</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. --my-palette"
                            value={parseArbitraryProperty(selectedElement.classes, "font-palette")}
                            onChange={(e) => updateArbitraryProperty("font-palette", e.target.value)}
                            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 10. Direction & Writing Mode */}
                  {typographySubCategory === "direction" && (
                    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                        <Compass size={12} />
                        <span>Direction & Writing Mode</span>
                      </div>

                      {/* writing-mode */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">writing-mode</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "writing-mode")}
                            onChange={(e) => updateArbitraryProperty("writing-mode", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (horizontal-tb)</option>
                            <option value="horizontal-tb">horizontal-tb</option>
                            <option value="vertical-rl">vertical-rl</option>
                            <option value="vertical-lr">vertical-lr</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* direction */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">direction</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "direction")}
                            onChange={(e) => updateArbitraryProperty("direction", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (ltr)</option>
                            <option value="ltr">ltr (Left-To-Right)</option>
                            <option value="rtl">rtl (Right-To-Left)</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* text-orientation */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">text-orientation</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "text-orientation")}
                            onChange={(e) => updateArbitraryProperty("text-orientation", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (mixed)</option>
                            <option value="mixed">mixed</option>
                            <option value="upright">upright</option>
                            <option value="sideways">sideways</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* unicode-bidi */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">unicode-bidi</label>
                        <div className="relative">
                          <select
                            value={parseArbitraryProperty(selectedElement.classes, "unicode-bidi")}
                            onChange={(e) => updateArbitraryProperty("unicode-bidi", e.target.value)}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Default (normal)</option>
                            <option value="normal">normal</option>
                            <option value="embed">embed</option>
                            <option value="bidi-override">bidi-override</option>
                            <option value="isolate">isolate</option>
                            <option value="isolate-override">isolate-override</option>
                            <option value="plaintext">plaintext</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Informational Typographic Interlinks and Dependencies Card */}
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4.5 space-y-3.5 shadow-xs">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-stone-500 font-mono flex items-center gap-1.5">
                      <HelpCircle size={13} className="text-stone-400" />
                      <span>Typographic Interlinks & CSS Dependencies</span>
                    </div>

                    <div className="space-y-3 text-[11px] leading-relaxed text-stone-600">
                      <div>
                        <span className="font-semibold text-stone-800">1. Unitless vs. Relative line-height Inheritance:</span> Using percentages or absolute font units evaluats a fixed pixel value immediately. Descendants inherit this computed value, leading to overlapping lines on larger children. A unitless ratio (e.g., <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">1.5</code>) recalculates dynamically on descendants.
                      </div>
                      <div>
                        <span className="font-semibold text-stone-800">2. Relative Length Units:</span> Relative units scroll dynamically and recalculate alongside child or parent <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">font-size</code> updates.
                      </div>
                      <div>
                        <span className="font-semibold text-stone-800">3. white-space Constraints:</span> If <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">nowrap</code> is declared, multi-line wrapping, breaking, balance alignment, pretty styling, and hyphenation are bypassed. Ellipsis overflow requires overflow hidden and a block wrapper.
                      </div>
                      <div>
                        <span className="font-semibold text-stone-800">4. OpenType Variants:</span> Font properties (ligatures, numeric alternates, capitals) rely on underlying OpenType font tables to function.
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
        {/* ==================== 3. APPEARANCE & VISUALS ==================== */}
        {inspectorSection === "visuals" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Palette size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Appearance & Styles</span>
            </div>

            {/* Sub-Category Pills Navigation */}
            <div className="flex bg-stone-100/80 p-1 rounded-xl gap-1">
              {(["colors", "backgrounds", "borders", "blending"] as const).map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setAppearanceSubCategory(sub)}
                  className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
                    appearanceSubCategory === sub
                      ? "text-rose-700 bg-white shadow-sm"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {(() => {
              const parseArbitraryProperty = (className: string, propName: string): string => {
                if (!className) return "";
                const match = className.match(new RegExp(`(?:^|\\s)\\[${propName.replace(/[-\[\]()]/g, '\\$&')}:([^\\]]+)\\](?:$|\\s)`));
                return match ? match[1].replace(/_/g, " ") : "";
              };

              const getPropValue = (propName: string): string => {
                const arb = parseArbitraryProperty(selectedElement?.classes || "", propName);
                return arb;
              };

              const setPropValue = (propName: string, value: string) => {
                const currentTokens = (selectedElement?.classes || "").split(/\s+/).filter(Boolean);
                let filtered = currentTokens.filter((token) => !token.startsWith(`[${propName}:`));
                if (value && value.trim()) {
                  filtered.push(`[${propName}:${value.trim().replace(/\s+/g, "_")}]`);
                }
                updateTree((n) => ({ classes: filtered.join(" ") }));
              };

              const appearanceFields = {
                colors: [
                  {
                    prop: "color",
                    label: "Text Color (color)",
                    placeholder: "e.g. red, #ff0000, oklch(0.6 0.25 120)",
                    presets: ["transparent", "currentcolor", "CanvasText", "LinkText", "#000000", "#ffffff", "#ef4444", "#3b82f6", "#10b981", "#f59e0b"]
                  },
                  {
                    prop: "opacity",
                    label: "Opacity (opacity)",
                    placeholder: "e.g. 1, 0.5, 30%",
                    presets: ["0", "0.1", "0.25", "0.5", "0.75", "0.9", "1", "50%", "100%"]
                  }
                ],
                backgrounds: [
                  {
                    prop: "background-color",
                    label: "Background Color (background-color)",
                    placeholder: "e.g. transparent, white, rgba(0,0,0,0.5)",
                    presets: ["transparent", "#ffffff", "#f5f5f4", "#1c1917", "#ef4444", "#3b82f6", "#10b981", "#f59e0b"]
                  },
                  {
                    prop: "background-image",
                    label: "Background Image (background-image)",
                    placeholder: "e.g. url('pattern.png'), linear-gradient(...)",
                    presets: ["none", "linear-gradient(45deg, #f43f5e, #fbbf24)", "radial-gradient(circle, #3b82f6, transparent)"]
                  },
                  {
                    prop: "background-size",
                    label: "Background Size (background-size)",
                    placeholder: "e.g. cover, contain, auto, 100px 100px",
                    presets: ["auto", "cover", "contain"]
                  },
                  {
                    prop: "background-position",
                    label: "Background Position (background-position)",
                    placeholder: "e.g. center, top left, 50% 50%",
                    presets: ["center", "top", "bottom", "left", "right", "top left", "bottom right"]
                  },
                  {
                    prop: "background-repeat",
                    label: "Background Repeat (background-repeat)",
                    placeholder: "e.g. repeat, no-repeat, space",
                    presets: ["repeat", "no-repeat", "repeat-x", "repeat-y", "space", "round"]
                  },
                  {
                    prop: "background-attachment",
                    label: "Background Attachment (background-attachment)",
                    placeholder: "e.g. scroll, fixed, local",
                    presets: ["scroll", "fixed", "local"]
                  },
                  {
                    prop: "background-origin",
                    label: "Background Origin (background-origin)",
                    placeholder: "e.g. padding-box, border-box",
                    presets: ["padding-box", "border-box", "content-box"]
                  },
                  {
                    prop: "background-clip",
                    label: "Background Clip (background-clip)",
                    placeholder: "e.g. border-box, padding-box, text",
                    presets: ["border-box", "padding-box", "content-box", "text"]
                  },
                  {
                    prop: "background",
                    label: "Background Shorthand (background)",
                    placeholder: "e.g. no-repeat center/cover url('bg.jpg')",
                    presets: []
                  }
                ],
                borders: [
                  {
                    prop: "border",
                    label: "Border Shorthand (border)",
                    placeholder: "e.g. 1px solid #e5e7eb, 2px dashed red",
                    presets: ["none", "1px solid #e5e7eb", "2px solid currentcolor", "2px dashed #9ca3af"]
                  },
                  {
                    prop: "border-radius",
                    label: "Border Radius (border-radius)",
                    placeholder: "e.g. 0px, 8px, 1rem, 50%",
                    presets: ["0px", "4px", "8px", "12px", "16px", "24px", "9999px", "50%"]
                  },
                  {
                    prop: "border-top",
                    label: "Border Top (border-top)",
                    placeholder: "e.g. 2px solid red",
                    presets: ["none", "1px solid #e5e7eb"]
                  },
                  {
                    prop: "border-right",
                    label: "Border Right (border-right)",
                    placeholder: "e.g. 2px solid red",
                    presets: ["none", "1px solid #e5e7eb"]
                  },
                  {
                    prop: "border-bottom",
                    label: "Border Bottom (border-bottom)",
                    placeholder: "e.g. 2px solid red",
                    presets: ["none", "1px solid #e5e7eb"]
                  },
                  {
                    prop: "border-left",
                    label: "Border Left (border-left)",
                    placeholder: "e.g. 2px solid red",
                    presets: ["none", "1px solid #e5e7eb"]
                  },
                  {
                    prop: "border-width",
                    label: "Border Width (border-width)",
                    placeholder: "e.g. 1px, 2px, 0.25rem",
                    presets: ["0px", "1px", "2px", "4px", "8px"]
                  },
                  {
                    prop: "border-style",
                    label: "Border Style (border-style)",
                    placeholder: "e.g. solid, dashed, none",
                    presets: ["none", "solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"]
                  },
                  {
                    prop: "border-color",
                    label: "Border Color (border-color)",
                    placeholder: "e.g. red, #000, currentcolor",
                    presets: ["transparent", "currentcolor", "#e5e7eb", "#ef4444", "#3b82f6"]
                  },
                  {
                    prop: "border-image-source",
                    label: "Border Image Source (border-image-source)",
                    placeholder: "e.g. url('border.png'), linear-gradient(...)",
                    presets: ["none"]
                  },
                  {
                    prop: "border-image-slice",
                    label: "Border Image Slice (border-image-slice)",
                    placeholder: "e.g. 30, 30% fill",
                    presets: ["100%"]
                  }
                ],
                blending: [
                  {
                    prop: "mix-blend-mode",
                    label: "Mix Blend Mode (mix-blend-mode)",
                    placeholder: "e.g. normal, multiply, screen",
                    presets: ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"]
                  },
                  {
                    prop: "background-blend-mode",
                    label: "Background Blend Mode",
                    placeholder: "e.g. normal, multiply, screen",
                    presets: ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion"]
                  }
                ]
              };

              const fields = appearanceFields[appearanceSubCategory] || [];

              return (
                <div className="space-y-4">
                  {fields.map((field) => {
                    const currentVal = getPropValue(field.prop);
                    return (
                      <div key={field.prop} className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 shadow-sm space-y-2">
                        <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-1">{field.label}</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={currentVal}
                            placeholder={field.placeholder}
                            onChange={(e) => setPropValue(field.prop, e.target.value)}
                            className="flex-1 min-w-0 bg-white border border-stone-200/85 rounded-xl px-3 py-2 text-xs text-stone-700 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 shadow-sm"
                          />
                          {field.presets.length > 0 && (
                            <div className="relative shrink-0">
                              <select
                                value={field.presets.includes(currentVal) ? currentVal : ""}
                                onChange={(e) => {
                                  if (e.target.value !== "") {
                                    setPropValue(field.prop, e.target.value);
                                  }
                                }}
                                className="appearance-none bg-stone-100 hover:bg-stone-200/70 border border-stone-200 text-stone-600 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold cursor-pointer focus:outline-none"
                              >
                                <option value="">Presets</option>
                                {field.presets.map((p) => (
                                  <option key={p} value={p}>{p}</option>
                                ))}
                              </select>
                              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                                <ChevronDown size={13} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Interlinks and Dependencies Card */}
                  <div className="bg-rose-50/40 border border-rose-100/60 rounded-2xl p-4 mt-6">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-700 font-mono flex items-center gap-1.5 mb-2.5">
                      <HelpCircle size={12} />
                      <span>Interlinks & Dependencies</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-rose-950 font-medium list-disc list-outside pl-4 leading-relaxed">
                      <li><strong>Transparency:</strong> Standard `opacity` directly influences both background fill and nested content. For separate background alpha, prefer advanced color models (`rgba()`, `hsla()`, `oklch()`).</li>
                      <li><strong>Border Outlines:</strong> Setting a container border width relies on both a border style (`solid`/`dashed`) and proper border colors, or a comprehensive shorthand config to become visible.</li>
                      <li><strong>Blend Modes:</strong> Elements using `mix-blend-mode` blend matching regions with parent content layers. Use `background-blend-mode` specifically for blending layered background configurations.</li>
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
        {/* ==================== 4. EFFECTS & FILTERS ==================== */}
        {inspectorSection === "motion" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Play size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Effects & Filters</span>
            </div>

            {/* Sub-Category Pills Navigation */}
            <div className="flex bg-stone-100/80 p-1 rounded-xl gap-1">
              {(["shadows", "filters", "masking", "transparency"] as const).map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setEffectsSubCategory(sub)}
                  className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
                    effectsSubCategory === sub
                      ? "text-rose-700 bg-white shadow-sm"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {(() => {
              const parseArbitraryProperty = (className: string, propName: string): string => {
                if (!className) return "";
                const match = className.match(new RegExp(`(?:^|\\s)\\[${propName.replace(/[-\[\]()]/g, '\\$&')}:([^\\]]+)\\](?:$|\\s)`));
                return match ? match[1].replace(/_/g, " ") : "";
              };

              const getPropValue = (propName: string): string => {
                const arb = parseArbitraryProperty(selectedElement?.classes || "", propName);
                return arb;
              };

              const setPropValue = (propName: string, value: string) => {
                const currentTokens = (selectedElement?.classes || "").split(/\s+/).filter(Boolean);
                let filtered = currentTokens.filter((token) => !token.startsWith(`[${propName}:`));
                if (value && value.trim()) {
                  filtered.push(`[${propName}:${value.trim().replace(/\s+/g, "_")}]`);
                }
                updateTree((n) => ({ classes: filtered.join(" ") }));
              };

              const effectsFields = {
                shadows: [
                  {
                    prop: "box-shadow",
                    label: "Box Shadow (box-shadow)",
                    placeholder: "e.g. 0 4px 6px rgba(0,0,0,0.1), inset 0 2px 4px rgba(0,0,0,0.2)",
                    presets: ["none", "0 1px 3px rgba(0,0,0,0.12)", "0 4px 6px rgba(0,0,0,0.1)", "0 10px 15px rgba(0,0,0,0.1)", "0 20px 25px rgba(0,0,0,0.15)", "inset 0 2px 4px rgba(0,0,0,0.06)"]
                  },
                  {
                    prop: "text-shadow",
                    label: "Text Shadow (text-shadow)",
                    placeholder: "e.g. 1px 1px 2px rgba(0,0,0,0.2), 0 0 8px #f43f5e",
                    presets: ["none", "1px 1px 2px rgba(0,0,0,0.15)", "2px 2px 4px rgba(0,0,0,0.3)", "0 0 8px rgba(239,68,68,0.8)", "0 0 12px rgba(59,130,246,0.8)"]
                  }
                ],
                filters: [
                  {
                    prop: "filter",
                    label: "Graphical Filter (filter)",
                    placeholder: "e.g. blur(4px) contrast(1.2) grayscale(100%)",
                    presets: ["none", "blur(4px)", "grayscale(100%)", "sepia(100%)", "brightness(150%)", "contrast(150%)", "hue-rotate(90deg)", "invert(100%)"]
                  },
                  {
                    prop: "backdrop-filter",
                    label: "Backdrop Filter (backdrop-filter)",
                    placeholder: "e.g. blur(10px) brightness(95%)",
                    presets: ["none", "blur(4px)", "blur(8px)", "blur(12px) brightness(90%)", "grayscale(50%)", "contrast(120%)"]
                  }
                ],
                masking: [
                  {
                    prop: "clip-path",
                    label: "Clip Path Polygon/Shape (clip-path)",
                    placeholder: "e.g. circle(50% at center), polygon(50% 0%, 100% 100%, 0% 100%)",
                    presets: [
                      "none",
                      "circle(50% at center)",
                      "ellipse(50% 30% at center)",
                      "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
                      "polygon(50% 0%, 100% 100%, 0% 100%)",
                      "inset(10% 20% round 8px)"
                    ]
                  }
                ],
                transparency: [
                  {
                    prop: "opacity",
                    label: "Opacity (opacity)",
                    placeholder: "e.g. 1, 0.5, 30%",
                    presets: ["0", "0.1", "0.25", "0.5", "0.75", "1"]
                  },
                  {
                    prop: "mix-blend-mode",
                    label: "Mix Blend Mode (mix-blend-mode)",
                    placeholder: "normal, multiply, screen, overlay",
                    presets: ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion"]
                  },
                  {
                    prop: "background-blend-mode",
                    label: "Background Blend Mode",
                    placeholder: "normal, multiply, screen, overlay",
                    presets: ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion"]
                  }
                ]
              };

              const fields = effectsFields[effectsSubCategory] || [];

              return (
                <div className="space-y-4">
                  {fields.map((field) => {
                    const currentVal = getPropValue(field.prop);
                    return (
                      <div key={field.prop} className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 shadow-sm space-y-2">
                        <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-1">{field.label}</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={currentVal}
                            placeholder={field.placeholder}
                            onChange={(e) => setPropValue(field.prop, e.target.value)}
                            className="flex-1 min-w-0 bg-white border border-stone-200/85 rounded-xl px-3 py-2 text-xs text-stone-700 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 shadow-sm"
                          />
                          {field.presets.length > 0 && (
                            <div className="relative shrink-0">
                              <select
                                value={field.presets.includes(currentVal) ? currentVal : ""}
                                onChange={(e) => {
                                  if (e.target.value !== "") {
                                    setPropValue(field.prop, e.target.value);
                                  }
                                }}
                                className="appearance-none bg-stone-100 hover:bg-stone-200/70 border border-stone-200 text-stone-600 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold cursor-pointer focus:outline-none"
                              >
                                <option value="">Presets</option>
                                {field.presets.map((p) => (
                                  <option key={p} value={p}>{p}</option>
                                ))}
                              </select>
                              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                                <ChevronDown size={13} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Interlinks and Dependencies Card */}
                  <div className="bg-rose-50/40 border border-rose-100/60 rounded-2xl p-4 mt-6">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-700 font-mono flex items-center gap-1.5 mb-2.5">
                      <HelpCircle size={12} />
                      <span>Interlinks & Dependencies</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-rose-950 font-medium list-disc list-outside pl-4 leading-relaxed">
                      <li><strong>Backdrop filters:</strong> Demand high transparency levels on background colors (`background-color: transparent` or alpha transparency values) of parent overlays to let background-blur effects shine through beautifully.</li>
                      <li><strong>Clips & Shadows:</strong> Complex clipping boundaries cut off elements exterior shadow layers (`box-shadow`). In such cases, use layered element nesting to carry shadow definitions on the container separately.</li>
                      <li><strong>Compound Filters:</strong> Chaining multiple custom entries like `blur()` and `contrast()` simultaneously within arbitrary filter configurations demands strict space-delimited styling strings to parse properly on high-performance render engines.</li>
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ==================== MOVEMENT & ANIMATION ==================== */}
        {inspectorSection === "animation" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Wand2 size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">Movement & Animation</span>
            </div>

            {/* Sub-Category Pills Navigation */}
            <div className="flex bg-stone-100/80 p-1 rounded-xl gap-1 overflow-x-auto scrollbar-hide">
              {[
                { id: "transitions", label: "Transitions" },
                { id: "transforms", label: "Transforms" },
                { id: "legacyTransforms", label: "Legacy Transform" },
                { id: "keyframes", label: "Keyframes" },
                { id: "scrollDriven", label: "Scroll-Driven" }
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setAnimationSubCategory(sub.id as any)}
                  className={`flex-1 py-1.5 px-2.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    animationSubCategory === sub.id
                      ? "text-rose-700 bg-white shadow-sm"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {(() => {
              const parseArbitraryProperty = (className: string, propName: string): string => {
                if (!className) return "";
                const match = className.match(new RegExp(`(?:^|\\s)\\[${propName.replace(/[-\[\]()]/g, '\\$&')}:([^\\]]+)\\](?:$|\\s)`));
                return match ? match[1].replace(/_/g, " ") : "";
              };

              const getPropValue = (propName: string): string => {
                const arb = parseArbitraryProperty(selectedElement?.classes || "", propName);
                return arb;
              };

              const setPropValue = (propName: string, value: string) => {
                const currentTokens = (selectedElement?.classes || "").split(/\s+/).filter(Boolean);
                let filtered = currentTokens.filter((token) => !token.startsWith(`[${propName}:`));
                if (value && value.trim()) {
                  filtered.push(`[${propName}:${value.trim().replace(/\s+/g, "_")}]`);
                }
                updateTree((n) => ({ classes: filtered.join(" ") }));
              };

              const animationFields = {
                transitions: [
                  {
                    prop: "transition",
                    label: "Transition Shorthand (transition)",
                    placeholder: "all 0.3s ease-in-out 0s, opacity 200ms linear",
                    presets: ["none", "all 0.3s ease", "all 150ms cubic-bezier(0.4, 0, 0.2, 1)", "opacity 0.2s ease-in-out", "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)"]
                  },
                  {
                    prop: "transition-property",
                    label: "Transition Property (transition-property)",
                    placeholder: "e.g. transform, opacity, background-color",
                    presets: ["none", "all", "transform", "opacity", "background-color", "color", "border-color", "translate", "rotate", "scale"]
                  },
                  {
                    prop: "transition-duration",
                    label: "Transition Duration (transition-duration)",
                    placeholder: "e.g. 0.3s, 300ms",
                    presets: ["0s", "100ms", "150ms", "200ms", "300ms", "500ms", "700ms", "1s"]
                  },
                  {
                    prop: "transition-delay",
                    label: "Transition Delay (transition-delay)",
                    placeholder: "e.g. 0.1s, 100ms",
                    presets: ["0s", "75ms", "100ms", "150ms", "200ms", "300ms", "500ms"]
                  },
                  {
                    prop: "transition-timing-function",
                    label: "Transition Timing (transition-timing-function)",
                    placeholder: "e.g. cubic-bezier(0.25, 0.1, 0.25, 1)",
                    presets: ["ease", "linear", "ease-in", "ease-out", "ease-in-out", "step-start", "step-end", "cubic-bezier(0.34, 1.56, 0.64, 1)", "cubic-bezier(0.25, 1, 0.5, 1)"]
                  },
                  {
                    prop: "transition-behavior",
                    label: "Transition Behavior (transition-behavior)",
                    placeholder: "e.g. normal, allow-discrete",
                    presets: ["normal", "allow-discrete"]
                  }
                ],
                transforms: [
                  {
                    prop: "translate",
                    label: "Translate Offset (translate)",
                    placeholder: "e.g. 10px, 50% 100%, 0 -20px",
                    presets: ["none", "10px", "50%", "-50%", "10px 20px", "50% 100% 15px", "0 -10px", "0 10px"]
                  },
                  {
                    prop: "rotate",
                    label: "Rotation (rotate)",
                    placeholder: "e.g. 45deg, z 90deg, 1 1 0 45deg",
                    presets: ["none", "45deg", "90deg", "180deg", "360deg", "-45deg", "-90deg", "x 45deg", "y 45deg", "z 90deg", "0.25turn"]
                  },
                  {
                    prop: "scale",
                    label: "Scale Factor (scale)",
                    placeholder: "e.g. 1.5, 120% 80%",
                    presets: ["none", "1", "1.05", "1.1", "1.2", "1.5", "2", "0.95", "0.9", "0.8", "0.5"]
                  }
                ],
                legacyTransforms: [
                  {
                    prop: "transform",
                    label: "Legacy Transform List (transform)",
                    placeholder: "e.g. translate(10px, 20px) rotate(45deg) scale(1.5)",
                    presets: ["none", "scale(1.05)", "scale(0.95)", "translateY(-4px)", "translateY(4px)", "rotate(3deg)", "rotate(-3deg)", "skewX(-10deg)"]
                  },
                  {
                    prop: "transform-origin",
                    label: "Transform Origin (transform-origin)",
                    placeholder: "e.g. center, top left, 50% 50%",
                    presets: ["center", "top", "bottom", "left", "right", "top left", "bottom right", "50% 50%"]
                  }
                ],
                keyframes: [
                  {
                    prop: "animation",
                    label: "Animation Shorthand (animation)",
                    placeholder: "e.g. slide-in 1s ease-out infinite forwards",
                    presets: ["none", "spin 1s linear infinite", "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite", "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite", "bounce 1s infinite"]
                  },
                  {
                    prop: "animation-name",
                    label: "Animation Name (animation-name)",
                    placeholder: "e.g. fade-in, bounce-animation",
                    presets: ["none", "spin", "ping", "pulse", "bounce"]
                  },
                  {
                    prop: "animation-duration",
                    label: "Animation Duration (animation-duration)",
                    placeholder: "e.g. 1s, 800ms",
                    presets: ["0s", "150ms", "300ms", "500ms", "800ms", "1s", "1.5s", "2s", "3s", "5s"]
                  },
                  {
                    prop: "animation-delay",
                    label: "Animation Delay (animation-delay)",
                    placeholder: "e.g. 0.5s, 500ms",
                    presets: ["0s", "100ms", "200ms", "300ms", "500ms", "1s", "2s"]
                  },
                  {
                    prop: "animation-timing-function",
                    label: "Animation Timing (animation-timing-function)",
                    placeholder: "e.g. cubic-bezier(0.42, 0, 0.58, 1)",
                    presets: ["ease", "linear", "ease-in", "ease-out", "ease-in-out", "step-start", "step-end"]
                  },
                  {
                    prop: "animation-iteration-count",
                    label: "Iteration Count (animation-iteration-count)",
                    placeholder: "e.g. infinite, 1, 3",
                    presets: ["infinite", "1", "2", "3", "5", "10"]
                  },
                  {
                    prop: "animation-direction",
                    label: "Animation Direction (animation-direction)",
                    placeholder: "e.g. normal, reverse, alternate",
                    presets: ["normal", "reverse", "alternate", "alternate-reverse"]
                  },
                  {
                    prop: "animation-fill-mode",
                    label: "Animation Fill Mode (animation-fill-mode)",
                    placeholder: "e.g. none, forwards, backwards, both",
                    presets: ["none", "forwards", "backwards", "both"]
                  },
                  {
                    prop: "animation-play-state",
                    label: "Animation Play State (animation-play-state)",
                    placeholder: "e.g. running, paused",
                    presets: ["running", "paused"]
                  },
                  {
                    prop: "animation-composition",
                    label: "Animation Composition (animation-composition)",
                    placeholder: "e.g. replace, add, accumulate",
                    presets: ["replace", "add", "accumulate"]
                  }
                ],
                scrollDriven: [
                  {
                    prop: "animation-timeline",
                    label: "Animation Timeline (animation-timeline)",
                    placeholder: "e.g. scroll(self block), view(inline 20%), --my-timeline",
                    presets: ["auto", "none", "scroll()", "scroll(self block)", "scroll(root y)", "view()", "view(inline 20%)"]
                  },
                  {
                    prop: "scroll-timeline",
                    label: "Scroll Timeline Shorthand (scroll-timeline)",
                    placeholder: "e.g. --my-timeline block",
                    presets: ["none", "--scroll-timeline block", "--scroll-timeline inline"]
                  },
                  {
                    prop: "scroll-timeline-name",
                    label: "Scroll Timeline Name (scroll-timeline-name)",
                    placeholder: "e.g. --my-scroll-timeline",
                    presets: ["none", "--scroll-timeline"]
                  },
                  {
                    prop: "scroll-timeline-axis",
                    label: "Scroll Timeline Axis (scroll-timeline-axis)",
                    placeholder: "e.g. block, inline, x, y",
                    presets: ["block", "inline", "x", "y"]
                  },
                  {
                    prop: "view-timeline",
                    label: "View Timeline Shorthand (view-timeline)",
                    placeholder: "e.g. --my-view-timeline block",
                    presets: ["none", "--view-timeline block", "--view-timeline inline"]
                  },
                  {
                    prop: "view-timeline-name",
                    label: "View Timeline Name (view-timeline-name)",
                    placeholder: "e.g. --my-view-timeline",
                    presets: ["none", "--view-timeline"]
                  },
                  {
                    prop: "view-timeline-axis",
                    label: "View Timeline Axis (view-timeline-axis)",
                    placeholder: "e.g. block, inline, x, y",
                    presets: ["block", "inline", "x", "y"]
                  },
                  {
                    prop: "animation-range",
                    label: "Animation Range (animation-range)",
                    placeholder: "e.g. cover 0% cover 100%, entry 10%",
                    presets: ["normal", "cover 0% cover 100%", "contain 20% entry 80%", "entry 0% exit 100%"]
                  },
                  {
                    prop: "animation-range-start",
                    label: "Range Start (animation-range-start)",
                    placeholder: "e.g. cover 0%, entry 20%",
                    presets: ["normal", "auto", "0%", "50%", "100%", "cover 0%", "contain 0%", "entry 0%"]
                  },
                  {
                    prop: "animation-range-end",
                    label: "Range End (animation-range-end)",
                    placeholder: "e.g. cover 100%, exit 80%",
                    presets: ["normal", "auto", "0%", "50%", "100%", "cover 100%", "contain 100%", "exit 100%"]
                  }
                ]
              };

              const fields = animationFields[animationSubCategory] || [];

              return (
                <div className="space-y-4 font-sans text-stone-700">
                  {fields.map((field) => {
                    const currentVal = getPropValue(field.prop);
                    return (
                      <div key={field.prop} className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 shadow-sm space-y-2">
                        <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-1">{field.label}</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={currentVal}
                            placeholder={field.placeholder}
                            onChange={(e) => setPropValue(field.prop, e.target.value)}
                            className="flex-1 min-w-0 bg-white border border-stone-200/85 rounded-xl px-3 py-2 text-xs text-stone-700 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 shadow-sm"
                          />
                          {field.presets.length > 0 && (
                            <div className="relative shrink-0">
                              <select
                                value={field.presets.includes(currentVal) ? currentVal : ""}
                                onChange={(e) => {
                                  if (e.target.value !== "") {
                                    setPropValue(field.prop, e.target.value);
                                  }
                                }}
                                className="appearance-none bg-stone-100 hover:bg-stone-200/70 border border-stone-200 text-stone-600 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold cursor-pointer focus:outline-none"
                              >
                                <option value="">Presets</option>
                                {field.presets.map((p) => (
                                  <option key={p} value={p}>{p}</option>
                                ))}
                              </select>
                              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                                <ChevronDown size={13} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Interlinks and Dependencies Card */}
                  <div className="bg-rose-50/40 border border-rose-100/60 rounded-2xl p-4 mt-6">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-700 font-mono flex items-center gap-1.5 mb-2.5">
                      <HelpCircle size={12} />
                      <span>Interlinks & Dependencies</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-rose-950 font-medium list-disc list-outside pl-4 leading-relaxed">
                      <li><strong>Animation-Name 🔗 External `@keyframes`:</strong> The `animation-name` property requires a corresponding `@keyframes` rule declared elsewhere. If sets to `slide-in`, a `@keyframes slide-in` must exist, or the animation will fail.</li>
                      <li><strong>Scroll-Driven Timeline Associations:</strong> To drive an animation using a custom timeline, the scrolling container defines `scroll-timeline-name: --my-timeline` (or `view-timeline-name`), and the target sets `animation-timeline: --my-timeline`.</li>
                      <li><strong>Shorthand to Longhand Hierarchy:</strong> Setting `transition` overrides individual declarations of `transition-property`, duration, delay, or timing-function. `animation` acts as an aggressive shorthand resetting omitted longhands.</li>
                      <li><strong>`animation-range` 🔗 Scroll-Driven Contexts:</strong> Timeline range properties rely on scroll-driven or view-driven context. If `animation-timeline` is `auto` or time-based, specified ranges are completely ignored.</li>
                      <li><strong>Individual Transforms vs. Shorthand `transform` Conflict:</strong> Modern individual transform properties (`translate`, `rotate`, `scale`) process first, and the shorthand `transform` functions apply afterward. Mixing them indiscriminately can lead to unexpected compounding.</li>
                      <li><strong>Discrete Transitions:</strong> For transitions on discrete properties like `display`, `transition-behavior: allow-discrete` must be set, and `transition-property` must target that specific property.</li>
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ==================== INTERACTIVITY & SCROLLING ==================== */}
        {inspectorSection === "interactivity" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <MousePointer size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">Interactivity & Scrolling</span>
            </div>

            {/* Sub-Category Pills Navigation */}
            <div className="flex bg-stone-100/80 p-1 rounded-xl gap-1 overflow-x-auto scrollbar-hide">
              {[
                { id: "mouse", label: "Mouse Controls" },
                { id: "user", label: "User Actions" },
                { id: "scrollControl", label: "Scroll & Overflow" },
                { id: "containerSnap", label: "Snap (Container)" },
                { id: "itemSnap", label: "Snap (Item)" },
                { id: "touch", label: "Touch & Perf" }
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setInteractivitySubCategory(sub.id as any)}
                  className={`flex-1 py-1.5 px-2.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    interactivitySubCategory === sub.id
                      ? "text-rose-700 bg-white shadow-sm"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {(() => {
              const parseArbitraryProperty = (className: string, propName: string): string => {
                if (!className) return "";
                const match = className.match(new RegExp(`(?:^|\\s)\\[${propName.replace(/[-\[\]()]/g, '\\$&')}:([^\\]]+)\\](?:$|\\s)`));
                return match ? match[1].replace(/_/g, " ") : "";
              };

              const getPropValue = (propName: string): string => {
                return parseArbitraryProperty(selectedElement?.classes || "", propName);
              };

              const setPropValue = (propName: string, value: string) => {
                const currentTokens = (selectedElement?.classes || "").split(/\s+/).filter(Boolean);
                let filtered = currentTokens.filter((token) => !token.startsWith(`[${propName}:`));
                if (value && value.trim()) {
                  filtered.push(`[${propName}:${value.trim().replace(/\s+/g, "_")}]`);
                }
                updateTree((n) => ({ classes: filtered.join(" ") }));
              };

              const interactivityFields = {
                mouse: [
                  {
                    prop: "cursor",
                    label: "Mouse Cursor Style (cursor)",
                    placeholder: "e.g. pointer, grab, url('custom.svg') 10 10, auto",
                    presets: [
                      "auto", "default", "none", "context-menu", "help", "pointer", 
                      "progress", "wait", "cell", "crosshair", "text", "vertical-text", 
                      "alias", "copy", "move", "no-drop", "not-allowed", "grab", "grabbing", 
                      "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", 
                      "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", 
                      "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out"
                    ]
                  },
                  {
                    prop: "pointer-events",
                    label: "Pointer Interaction Mode (pointer-events)",
                    placeholder: "e.g. auto, none",
                    presets: ["auto", "none", "visiblePainted", "visibleFill", "visibleStroke", "visible", "painted", "fill", "stroke", "all"]
                  }
                ],
                user: [
                  {
                    prop: "user-select",
                    label: "Text Selection Control (user-select)",
                    placeholder: "e.g. none, auto, text",
                    presets: ["none", "auto", "text", "all", "contain"]
                  },
                  {
                    prop: "resize",
                    label: "Element Resize Handle (resize)",
                    placeholder: "e.g. both, horizontal",
                    presets: ["none", "both", "horizontal", "vertical", "block", "inline"]
                  }
                ],
                scrollControl: [
                  {
                    prop: "overflow",
                    label: "Overflow Mechanics (overflow)",
                    placeholder: "e.g. visible, hidden, scroll, auto, clip",
                    presets: ["visible", "hidden", "scroll", "auto", "clip", "hidden_auto"]
                  },
                  {
                    prop: "overflow-x",
                    label: "Horizontal Overflow (overflow-x)",
                    placeholder: "e.g. auto, scroll, hidden",
                    presets: ["visible", "hidden", "scroll", "auto", "clip"]
                  },
                  {
                    prop: "overflow-y",
                    label: "Vertical Overflow (overflow-y)",
                    placeholder: "e.g. auto, scroll, hidden",
                    presets: ["visible", "hidden", "scroll", "auto", "clip"]
                  },
                  {
                    prop: "overflow-inline",
                    label: "Inline Overflow (overflow-inline)",
                    placeholder: "e.g. auto, hidden",
                    presets: ["visible", "hidden", "scroll", "auto", "clip"]
                  },
                  {
                    prop: "overflow-block",
                    label: "Block Overflow (overflow-block)",
                    placeholder: "e.g. auto, hidden",
                    presets: ["visible", "hidden", "scroll", "auto", "clip"]
                  },
                  {
                    prop: "scroll-behavior",
                    label: "Scrolling Interpolation (scroll-behavior)",
                    placeholder: "e.g. smooth, auto",
                    presets: ["auto", "smooth"]
                  },
                  {
                    prop: "overscroll-behavior",
                    label: "Overscroll Boundary Chaining (overscroll-behavior)",
                    placeholder: "e.g. auto, contain, none",
                    presets: ["auto", "contain", "none", "contain_none"]
                  },
                  {
                    prop: "overscroll-behavior-x",
                    label: "Overscroll Behavior X (overscroll-behavior-x)",
                    placeholder: "e.g. auto, contain, none",
                    presets: ["auto", "contain", "none"]
                  },
                  {
                    prop: "overscroll-behavior-y",
                    label: "Overscroll Behavior Y (overscroll-behavior-y)",
                    placeholder: "e.g. auto, contain, none",
                    presets: ["auto", "contain", "none"]
                  },
                  {
                    prop: "overscroll-behavior-inline",
                    label: "Overscroll Behavior Inline (overscroll-behavior-inline)",
                    placeholder: "e.g. auto, contain, none",
                    presets: ["auto", "contain", "none"]
                  },
                  {
                    prop: "overscroll-behavior-block",
                    label: "Overscroll Behavior Block (overscroll-behavior-block)",
                    placeholder: "e.g. auto, contain, none",
                    presets: ["auto", "contain", "none"]
                  }
                ],
                containerSnap: [
                  {
                    prop: "scroll-snap-type",
                    label: "Scroll Snap Definition (scroll-snap-type)",
                    placeholder: "e.g. x mandatory, y proximity, both mandatory",
                    presets: ["none", "x", "y", "block", "inline", "both", "x mandatory", "y proximity", "both mandatory", "block proximity"]
                  },
                  {
                    prop: "scroll-padding",
                    label: "Viewport Boundary Padding Shorthand (scroll-padding)",
                    placeholder: "e.g. 10px, 1.5rem, 10px 20px",
                    presets: ["auto", "10px", "20px", "1rem", "1.5rem", "2rem", "10%", "5vh"]
                  },
                  {
                    prop: "scroll-padding-top",
                    label: "Scroll Padding Top",
                    placeholder: "e.g. 24px, 2rem",
                    presets: ["auto", "10px", "20px", "24px", "1.5rem", "2rem", "5%"]
                  },
                  {
                    prop: "scroll-padding-right",
                    label: "Scroll Padding Right",
                    placeholder: "e.g. 24px, 2rem",
                    presets: ["auto", "10px", "20px", "1.5rem", "2rem", "5%"]
                  },
                  {
                    prop: "scroll-padding-bottom",
                    label: "Scroll Padding Bottom",
                    placeholder: "e.g. 24px, 2rem",
                    presets: ["auto", "10px", "20px", "1.5rem", "2rem", "5%"]
                  },
                  {
                    prop: "scroll-padding-left",
                    label: "Scroll Padding Left",
                    placeholder: "e.g. 24px, 2rem",
                    presets: ["auto", "10px", "20px", "1.5rem", "2rem", "5%"]
                  },
                  {
                    prop: "scroll-padding-inline-start",
                    label: "Scroll Padding Inline Start",
                    placeholder: "e.g. 24px, 2rem",
                    presets: ["auto", "10px", "1.5rem", "5%"]
                  },
                  {
                    prop: "scroll-padding-inline-end",
                    label: "Scroll Padding Inline End",
                    placeholder: "e.g. 24px, 2rem",
                    presets: ["auto", "10px", "1.5rem", "5%"]
                  },
                  {
                    prop: "scroll-padding-block-start",
                    label: "Scroll Padding Block Start",
                    placeholder: "e.g. 24px, 2rem",
                    presets: ["auto", "10px", "1.5rem", "5%"]
                  },
                  {
                    prop: "scroll-padding-block-end",
                    label: "Scroll Padding Block End",
                    placeholder: "e.g. 24px, 2rem",
                    presets: ["auto", "10px", "1.5rem", "5%"]
                  }
                ],
                itemSnap: [
                  {
                    prop: "scroll-snap-align",
                    label: "Scroll Snap Alignment (scroll-snap-align)",
                    placeholder: "e.g. center, start, end, none start, start end",
                    presets: ["none", "start", "end", "center", "none start", "start end", "center center"]
                  },
                  {
                    prop: "scroll-snap-stop",
                    label: "Scroll Snap Interception (scroll-snap-stop)",
                    placeholder: "e.g. normal, always",
                    presets: ["normal", "always"]
                  },
                  {
                    prop: "scroll-margin",
                    label: "Scroll Margin Shorthand (scroll-margin)",
                    placeholder: "e.g. 12px, 2rem, 10px 30px",
                    presets: ["12px", "20px", "1rem", "1.5rem", "2rem", "10px 30px", "5px 10px 15px 20px"]
                  },
                  {
                    prop: "scroll-margin-top",
                    label: "Scroll Margin Top",
                    placeholder: "e.g. 15px, 2vh",
                    presets: ["10px", "15px", "20px", "1rem", "1.2em", "2vh", "4vw"]
                  },
                  {
                    prop: "scroll-margin-right",
                    label: "Scroll Margin Right",
                    placeholder: "e.g. 15px, 2vh",
                    presets: ["10px", "15px", "20px", "1rem", "1.2em", "2vh", "4vw"]
                  },
                  {
                    prop: "scroll-margin-bottom",
                    label: "Scroll Margin Bottom",
                    placeholder: "e.g. 15px, 2vh",
                    presets: ["10px", "15px", "20px", "1rem", "1.2em", "2vh", "4vw"]
                  },
                  {
                    prop: "scroll-margin-left",
                    label: "Scroll Margin Left",
                    placeholder: "e.g. 15px, 2vh",
                    presets: ["10px", "15px", "20px", "1rem", "1.2em", "2vh", "4vw"]
                  },
                  {
                    prop: "scroll-margin-inline-start",
                    label: "Scroll Margin Inline Start",
                    placeholder: "e.g. 15px, 2vh",
                    presets: ["10px", "15px", "1rem", "2vh"]
                  },
                  {
                    prop: "scroll-margin-inline-end",
                    label: "Scroll Margin Inline End",
                    placeholder: "e.g. 15px, 2vh",
                    presets: ["10px", "15px", "1rem", "2vh"]
                  },
                  {
                    prop: "scroll-margin-block-start",
                    label: "Scroll Margin Block Start",
                    placeholder: "e.g. 15px, 2vh",
                    presets: ["10px", "15px", "1rem", "2vh"]
                  },
                  {
                    prop: "scroll-margin-block-end",
                    label: "Scroll Margin Block End",
                    placeholder: "e.g. 15px, 2vh",
                    presets: ["10px", "15px", "1rem", "2vh"]
                  }
                ],
                touch: [
                  {
                    prop: "touch-action",
                    label: "Touch Screen Action Mapping (touch-action)",
                    placeholder: "e.g. pan-y, manipulation, none",
                    presets: ["auto", "none", "pan-x", "pan-y", "pan-left", "pan-right", "pan-up", "pan-down", "pinch-zoom", "manipulation", "pan-x pan-y", "pan-x pinch-zoom"]
                  },
                  {
                    prop: "will-change",
                    label: "GPU Rendering Intent hint (will-change)",
                    placeholder: "e.g. transform, opacity, scroll-position",
                    presets: ["auto", "scroll-position", "contents", "transform", "opacity", "transform, opacity"]
                  }
                ]
              };

              const fields = interactivityFields[interactivitySubCategory] || [];

              return (
                <div className="space-y-4 font-sans text-stone-700">
                  {fields.map((field) => {
                    const currentVal = getPropValue(field.prop);
                    const segConfig = SEGMENTED_FIELDS[field.prop];

                    if (segConfig) {
                      return (
                        <div key={field.prop} className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 shadow-sm space-y-3">
                          <SegmentedControl
                            label={field.label}
                            value={currentVal || segConfig.options[0].value}
                            onChange={(val) => setPropValue(field.prop, val)}
                            options={segConfig.options}
                          />
                          <div className="flex flex-col gap-1.5 w-full text-left">
                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-0.5 font-sans">Custom Override</span>
                            <input
                              type="text"
                              value={currentVal}
                              placeholder={field.placeholder}
                              onChange={(e) => setPropValue(field.prop, e.target.value)}
                              className="w-full bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none placeholder-stone-300 font-mono shadow-sm"
                            />
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={field.prop} className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 shadow-sm space-y-2">
                        <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-1">{field.label}</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={currentVal}
                            placeholder={field.placeholder}
                            onChange={(e) => setPropValue(field.prop, e.target.value)}
                            className="flex-1 min-w-0 bg-white border border-stone-200/85 rounded-xl px-3 py-2 text-xs text-stone-700 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 shadow-sm"
                          />
                          {field.presets.length > 0 && (
                            <div className="relative shrink-0">
                              <select
                                value={field.presets.includes(currentVal) ? currentVal : ""}
                                onChange={(e) => {
                                  if (e.target.value !== "") {
                                    setPropValue(field.prop, e.target.value);
                                  }
                                }}
                                className="appearance-none bg-stone-100 hover:bg-stone-200/70 border border-stone-200 text-stone-600 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold cursor-pointer focus:outline-none"
                              >
                                <option value="">Presets</option>
                                {field.presets.map((p) => (
                                  <option key={p} value={p}>{p}</option>
                                ))}
                              </select>
                              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                                <ChevronDown size={13} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Interlinks and Dependencies Card */}
                  <div className="bg-rose-50/40 border border-rose-100/60 rounded-2xl p-4 mt-6">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-700 font-mono flex items-center gap-1.5 mb-2.5">
                      <HelpCircle size={12} />
                      <span>Interlinks & Dependencies</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-rose-950 font-medium list-disc list-outside pl-4 leading-relaxed">
                      <li><strong>`scroll-snap-type` 🔗 `scroll-snap-align`:</strong> Scroll snapping functions only if `scroll-snap-type` is declared on a parent scroll container (with active overflow scrolling) <strong>and</strong> `scroll-snap-align` is declared on one or more child items within that container.</li>
                      <li><strong>`scroll-padding` 🔗 `scroll-margin`:</strong> `scroll-padding` adjusts the inner visual viewport area of the container itself, while `scroll-margin` sets layout outsets directly on the target element.</li>
                      <li><strong>`resize` 🔗 `overflow`:</strong> The `resize` property has no visual or functional effect on an element unless its `overflow` property is set to something other than `visible` (such as `auto`, `scroll`, or `hidden`).</li>
                      <li><strong>`pointer-events: none` 🔗 `cursor`:</strong> Setting `pointer-events: none` on an element fully bypasses any hover/mouse states, so any `cursor` changes on it or its child tree will not render.</li>
                      <li><strong>`touch-action` 🔗 Snapping:</strong> Restrictive `touch-action` configurations (such as `none`, `pan-x` or `pan-y`) override scrolling. If vertical snapping is mandatory but `touch-action: pan-x` is active, touch interaction scrolling is blocked completely.</li>
                      <li><strong>`overscroll-behavior` 🔗 `overflow`:</strong> `overscroll-behavior` controls scroll chaining to parent elements. It remains completely inactive unless the element itself is scrollable (has active overflow hidden/scroll/auto with overflowing content).</li>
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ==================== MEDIA & OBJECTS ==================== */}
        {inspectorSection === "media" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Image size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">Media & Objects</span>
            </div>

            {/* Sub-Category Pills Navigation */}
            <div className="flex bg-stone-100/80 p-1 rounded-xl gap-1 overflow-x-auto scrollbar-hide">
              {[
                { id: "fitting", label: "Media Fitting & Crop" },
                { id: "rendering", label: "Image Rendering" },
                { id: "shapes", label: "Content Flow Shapes" }
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setMediaSubCategory(sub.id as any)}
                  className={`flex-1 py-1.5 px-2.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    mediaSubCategory === sub.id
                      ? "text-rose-700 bg-white shadow-sm"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {(() => {
              const parseArbitraryProperty = (className: string, propName: string): string => {
                if (!className) return "";
                const match = className.match(new RegExp(`(?:^|\\s)\\[${propName.replace(/[-\[\]()]/g, '\\$&')}:([^\\]]+)\\](?:$|\\s)`));
                return match ? match[1].replace(/_/g, " ") : "";
              };

              const getPropValue = (propName: string): string => {
                return parseArbitraryProperty(selectedElement?.classes || "", propName);
              };

              const setPropValue = (propName: string, value: string) => {
                const currentTokens = (selectedElement?.classes || "").split(/\s+/).filter(Boolean);
                let filtered = currentTokens.filter((token) => !token.startsWith(`[${propName}:`));
                if (value && value.trim()) {
                  filtered.push(`[${propName}:${value.trim().replace(/\s+/g, "_")}]`);
                }
                updateTree((n) => ({ classes: filtered.join(" ") }));
              };

              const mediaFields = {
                fitting: [
                  {
                    prop: "object-fit",
                    label: "Object Auto-Fit Scaling (object-fit)",
                    placeholder: "e.g. cover, contain, fill",
                    presets: ["fill", "contain", "cover", "none", "scale-down", "initial", "inherit", "revert", "revert-layer", "unset"]
                  },
                  {
                    prop: "object-position",
                    label: "Object Positioning Coordinates (object-position)",
                    placeholder: "e.g. center, top, left 5vw bottom 20px, 15% 85%",
                    presets: ["center", "top", "bottom", "left", "right", "left top", "right bottom", "50% 50%", "100% 100%", "20px 50px"]
                  },
                  {
                    prop: "object-view-box",
                    label: "Object View Box Crop (object-view-box)",
                    placeholder: "e.g. inset(10% 20% 10% 20%), rect(10px 50px 100px 0)",
                    presets: ["none", "inset(10% 20% 10% 20%)", "inset(10px 20px round 5px)", "rect(10px 50px 100px 0)", "xywh(10px 20px 100px 100px)"]
                  }
                ],
                rendering: [
                  {
                    prop: "image-rendering",
                    label: "Image Rendering Engine (image-rendering)",
                    placeholder: "e.g. pixelated, crisp-edges",
                    presets: ["auto", "crisp-edges", "pixelated", "smooth", "high-quality"]
                  },
                  {
                    prop: "image-orientation",
                    label: "Image Rotation Exif Override (image-orientation)",
                    placeholder: "e.g. from-image, 90deg, 180deg flip",
                    presets: ["from-image", "none", "90deg", "180deg", "270deg", "360deg", "0.25turn", "1.57rad", "flip", "90deg flip"]
                  },
                  {
                    prop: "image-resolution",
                    label: "Pixel Concentration (image-resolution)",
                    placeholder: "e.g. 300dpi, from-image, snap 1dppx",
                    presets: ["from-image", "300dpi", "1dpcm", "2dppx", "1x", "from-image 150dpi", "snap 1dppx"]
                  }
                ],
                shapes: [
                  {
                    prop: "shape-outside",
                    label: "Float Text Content Flow Wrapper (shape-outside)",
                    placeholder: "e.g. circle(50% at center), polygon(0 0, 100% 0, 50% 100%)",
                    presets: [
                      "none", "margin-box", "border-box", "padding-box", "content-box", 
                      "circle(50% at center)", "ellipse(25px 50px at 50% 50%)", 
                      "polygon(0 0, 100% 0, 50% 100%)", "inset(10px round 5px)",
                      "path(\"M 10,10 H 90 V 90 H 10 Z\")"
                    ]
                  },
                  {
                    prop: "shape-margin",
                    label: "Shape Spacing Offset (shape-margin)",
                    placeholder: "e.g. 10px, 1.5em, 3vw, 5%",
                    presets: ["0px", "5px", "10px", "15px", "1.5em", "3vw", "5%"]
                  },
                  {
                    prop: "shape-image-threshold",
                    label: "Shape Alpha Transparency Threshold (shape-image-threshold)",
                    placeholder: "e.g. 0.0, 0.5, 1.0",
                    presets: ["0.0", "0.1", "0.3", "0.5", "0.7", "0.9", "1.0", "50%", "100%"]
                  }
                ]
              };

              const fields = mediaFields[mediaSubCategory] || [];

              return (
                <div className="space-y-4 font-sans text-stone-700">
                  {fields.map((field) => {
                    const currentVal = getPropValue(field.prop);
                    const segConfig = SEGMENTED_FIELDS[field.prop];

                    if (segConfig) {
                      return (
                        <div key={field.prop} className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 shadow-sm space-y-3">
                          <SegmentedControl
                            label={field.label}
                            value={currentVal || segConfig.options[0].value}
                            onChange={(val) => setPropValue(field.prop, val)}
                            options={segConfig.options}
                          />
                          <div className="flex flex-col gap-1.5 w-full text-left">
                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-0.5 font-sans">Custom Override</span>
                            <input
                              type="text"
                              value={currentVal}
                              placeholder={field.placeholder}
                              onChange={(e) => setPropValue(field.prop, e.target.value)}
                              className="w-full bg-white border border-stone-250 rounded-xl px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none placeholder-stone-300 font-mono shadow-sm"
                            />
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={field.prop} className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 shadow-sm space-y-2">
                        <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-1">{field.label}</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={currentVal}
                            placeholder={field.placeholder}
                            onChange={(e) => setPropValue(field.prop, e.target.value)}
                            className="flex-1 min-w-0 bg-white border border-stone-200/85 rounded-xl px-3 py-2 text-xs text-stone-700 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 shadow-sm"
                          />
                          {field.presets.length > 0 && (
                            <div className="relative shrink-0">
                              <select
                                value={field.presets.includes(currentVal) ? currentVal : ""}
                                onChange={(e) => {
                                  if (e.target.value !== "") {
                                    setPropValue(field.prop, e.target.value);
                                  }
                                }}
                                className="appearance-none bg-stone-100 hover:bg-stone-200/70 border border-stone-200 text-stone-600 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold cursor-pointer focus:outline-none"
                              >
                                <option value="">Presets</option>
                                {field.presets.map((p) => (
                                  <option key={p} value={p}>{p}</option>
                                ))}
                              </select>
                              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                                <ChevronDown size={13} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Interlinks and Dependencies Card */}
                  <div className="bg-rose-50/40 border border-rose-100/60 rounded-2xl p-4 mt-6">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-700 font-mono flex items-center gap-1.5 mb-2.5">
                      <HelpCircle size={12} />
                      <span>Interlinks & Dependencies</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-rose-950 font-medium list-disc list-outside pl-4 leading-relaxed">
                      <li><strong>`object-fit` and `object-position`:</strong> If `object-fit` is set to `fill` (stretching fully), `object-position` is completely ignored since there is no leftover space to shift the imagery content.</li>
                      <li><strong>`object-view-box` and friends:</strong> Once cropped via `object-view-box`, standard `object-fit` and `object-position` scale and align only relative to the cropped sub-section.</li>
                      <li><strong>`shape-outside` and `float`:</strong> Flow shapes only function if the element has `float` explicitly set to `left` or `right`. If `float` is set to `none`, `shape-outside` has zero impact.</li>
                      <li><strong>`shape-outside` and Sizing Dimensions:</strong> Custom shapes (`polygon`, `circle`, etc.) require explicit height and width bounds on the container to correctly compute wrapping areas.</li>
                      <li><strong>`shape-margin` and `shape-outside`:</strong> If `shape-outside` is set to `none`, any defined value in `shape-margin` is ignored.</li>
                      <li><strong>`shape-image-threshold` and `shape-outside`:</strong> Opacity threshold is only valid when reading a shape drawn from an image or gradient with transparent elements.</li>
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ==================== 5. CORE DETAILS & CUSTOM CODE ==================== */}
        {inspectorSection === "core" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Content & Custom Utilities</span>
            </div>

            {/* Sub-Category: Content details */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1">
                <Compass size={11} />
                <span>Text / URL Attributes</span>
              </div>
              
              {selectedElement.content !== undefined ? (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Rendered Node inner content</label>
                  <input
                    type="text"
                    value={selectedElement.content || ""}
                    onChange={(e) => updateTree(() => ({ content: e.target.value }))}
                    className="w-full bg-white border border-stone-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all font-sans text-stone-800 shadow-sm"
                    placeholder="Type inner text content or image src url..."
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2.5 text-stone-500 bg-white rounded-xl p-4 border border-stone-200/40 shadow-sm">
                  <HelpCircle size={15} className="text-stone-400" />
                  <span className="text-xs font-medium">This structural layout bounds container doesn't accept direct text fields. Select a text layer child to edit wordings.</span>
                </div>
              )}
            </div>

            {/* Sub-Category: Utility classes direct write */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1">
                <Code size={11} />
                <span>Advanced Tailwind Utility Classes</span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Direct tokens string editor</label>
                <textarea
                  rows={4}
                  value={selectedElement.classes || ""}
                  onChange={(e) => updateTree(() => ({ classes: e.target.value }))}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-3 text-[11px] leading-relaxed focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/20 transition-all font-mono text-emerald-400 resize-none shadow-inner"
                  placeholder="flex items-center justify-between px-4 py-2 border border-gray-100..."
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== 6. CSS PROPERTIES CHEATSHEET & DIRECTORY ==================== */}
        {inspectorSection === "help" && (
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-3 duration-350 pr-0.5">
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">CSS Property Reference</span>
            </div>

            {/* Quick Live Filter Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties, categories or options..."
                className="w-full bg-stone-50 border border-stone-200/80 rounded-xl pl-9 pr-8 py-2.5 text-xs text-stone-700 placeholder-stone-400 focus:outline-none focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all font-sans shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 font-semibold text-[11px] px-1 hover:bg-stone-200/50 rounded cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Interactive Hierarchy Accordions */}
            <div className="flex flex-col gap-4">
              {filteredHierarchy.length === 0 ? (
                <div className="text-center py-8 text-stone-400 bg-stone-50/50 rounded-2xl border border-stone-200/40 p-4">
                  <p className="text-xs font-medium">No CSS properties match "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-xs text-rose-600 font-semibold hover:underline cursor-pointer"
                  >
                    Clear Search Filter
                  </button>
                </div>
              ) : (
                filteredHierarchy.map((category) => {
                  const isExpanded = expandedCategories[category.name] || searchQuery !== "";
                  const totalPropertiesCount = category.subCategories.reduce((acc, sub) => acc + sub.properties.length, 0);

                  return (
                    <div
                      key={category.name}
                      className="bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-sm hover:border-stone-300 transition-all"
                    >
                      {/* Section Accordion Header */}
                      <button
                        type="button"
                        onClick={() => {
                          if (searchQuery === "") {
                            setExpandedCategories(prev => ({
                              ...prev,
                              [category.name]: !prev[category.name]
                            }));
                          }
                        }}
                        disabled={searchQuery !== ""}
                        className={`w-full flex items-center justify-between p-4 bg-stone-50/60 border-b border-stone-100 font-sans cursor-pointer transition-colors ${
                          searchQuery !== "" ? "cursor-default animate-none" : "hover:bg-stone-100/60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <category.icon size={14} className="text-rose-600" />
                          <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wider">
                            {category.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 font-mono">
                            {totalPropertiesCount} props
                          </span>
                          {searchQuery === "" && (
                            <ChevronDown
                              size={14}
                              className={`text-stone-400 transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </div>
                      </button>

                      {/* Section Accordion Content */}
                      {isExpanded && (
                        <div className="p-4 pt-3 flex flex-col gap-4 divide-y divide-stone-100">
                          {category.subCategories.map((subCategory) => (
                            <div key={subCategory.name} className="pt-3 first:pt-0 flex flex-col gap-2.5">
                              {/* SubCategory Heading */}
                              <h4 className="text-[10px] text-rose-600 font-bold uppercase tracking-wider font-sans">
                                {subCategory.name}
                              </h4>

                              {/* Properties Matrix */}
                              <div className="flex flex-col gap-3">
                                {subCategory.properties.map((property) => (
                                  <div
                                    key={property.name}
                                    className="p-3 bg-stone-50/40 border border-stone-200/30 rounded-xl space-y-2 hover:bg-stone-50/90 transition-colors"
                                  >
                                    {/* Property Header */}
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex flex-wrap items-center gap-1.5">
                                        <code
                                          onClick={() => handleCopy(property.name)}
                                          title="Click to copy property name"
                                          className="text-[11.5px] font-mono font-bold text-stone-800 hover:text-rose-700 bg-stone-100/50 px-1.5 py-0.5 rounded cursor-pointer transition-all"
                                        >
                                          {property.name}
                                        </code>
                                        {property.note && (
                                          <span className="text-[10px] text-stone-400 font-medium font-sans">
                                            ({property.note})
                                          </span>
                                        )}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleCopy(property.name)}
                                        className="text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-lg hover:bg-stone-200/40 cursor-pointer"
                                        title="Copy Property Name"
                                      >
                                        <Copy size={11} />
                                      </button>
                                    </div>

                                    {/* Property Values list */}
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                      {property.values.split(/\s*\|\s*/).map((valueItem, vIdx) => {
                                        const trimmedValue = valueItem.trim();
                                        const isCopied = copiedText === trimmedValue;
                                        return (
                                          <button
                                            key={vIdx}
                                            type="button"
                                            onClick={() => handleCopy(trimmedValue)}
                                            style={{ touchAction: "manipulation" }}
                                            className={`px-2 py-0.5 h-6 text-[10px] font-mono rounded-lg border flex items-center gap-1 transition-all duration-150 cursor-pointer select-none ${
                                              isCopied
                                                ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold shadow-sm"
                                                : "bg-white hover:bg-stone-50 border-stone-200/50 text-stone-600 hover:text-stone-800"
                                            }`}
                                          >
                                            <span>{trimmedValue}</span>
                                            {isCopied && <Check size={10} className="text-emerald-600" />}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Micro Quick Notes Footer Tip */}
            <div className="bg-rose-50/50 border border-rose-100/50 rounded-2xl p-4 space-y-1.5 text-[11px] text-stone-600 leading-relaxed font-sans shadow-inner">
              <p className="font-bold text-rose-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Sparkles size={11} />
                <span>Reference Notation Guide:</span>
              </p>
              <ul className="list-disc pl-4 space-y-1 text-stone-500 text-[10.5px]">
                <li><code className="font-mono text-rose-600 font-semibold">&lt;length&gt;</code>: Units like <code className="font-mono bg-rose-50 px-1 py-0.2 rounded text-[10px]">px</code>, <code className="font-mono bg-rose-50 px-1 py-0.2 rounded text-[10px]">rem</code>, <code className="font-mono bg-rose-50 px-1 py-0.2 rounded text-[10px]">em</code>, <code className="font-mono bg-rose-50 px-1 py-0.2 rounded text-[10px]">vw</code>, etc.</li>
                <li><code className="font-mono text-rose-600 font-semibold">&lt;time&gt;</code>: Transition and animation time like <code className="font-mono bg-rose-50 px-1 py-0.2 rounded text-[10px]">s</code> or <code className="font-mono bg-rose-50 px-1 py-0.2 rounded text-[10px]">ms</code>.</li>
                <li>Pills are interactive: **tapping copies values** instantly to clipboard.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Global Delete and Duplicate Action Bar stuck to bottom */}
      <div className="border-t border-stone-100 p-4 shrink-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] flex items-center gap-2.5 bg-stone-50/30">
        <button
          onClick={() => {
            if (selectedElement) duplicateElement(selectedElement.id);
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 bg-stone-100 hover:bg-stone-200 hover:text-stone-900 text-stone-700 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm border border-stone-200/30 cursor-pointer"
        >
          <Copy size={13.5} />
          <span>Duplicate</span>
        </button>

        <button
          onClick={() => {
            if (selectedElement) deleteElement(selectedElement.id);
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-sm border border-red-100/30 cursor-pointer"
        >
          <Trash2 size={13.5} />
          <span>Delete Element</span>
        </button>
      </div>
    </div>
  );
}
