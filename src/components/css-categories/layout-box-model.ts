import { Maximize } from "lucide-react";
import { CSSCategory, CSSSubCategory, CSSProperty } from "../../types-css";

export const advancedAnchorAreaPlacementGroup: CSSSubCategory = {
  name: "Advanced Anchor Area Placement",
  properties: [
    {
      name: "position-area",
      values:
        "none | top | bottom | left | right | center | span-all | block-start | block-end | inline-start | inline-end | <combinations> (e.g. top left, center right, block-start inline-end)",
    },
  ],
};


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


export const anchorPositioningGroup: CSSSubCategory = {
  name: "Anchor Positioning",
  properties: [
    {
      name: "anchor-name",
      values:
        "none | <dashed-ident># | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "anchor-scope",
      values:
        "none | all | <dashed-ident># | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "position-anchor",
      values:
        "<anchor-name> | auto | initial | inherit | revert | revert-layer | unset",
    },
  ],
};


export const boxSizingSystemGroup: CSSSubCategory = {
  name: "Box Sizing System",
  properties: [
    {
      name: "box-sizing",
      values: "content-box | border-box",
    },
  ],
};


export const columnDefinitionGroup: CSSSubCategory = {
  name: "Column Definition",
  properties: [
    {
      name: "columns",
      values:
        "<column-width> || <column-count> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "column-count",
      values:
        "auto | <integer> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "column-width",
      values:
        "auto | <length> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "column-fill",
      values:
        "auto | balance | balance-all | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "column-span",
      values: "none | all | initial | inherit | revert | revert-layer | unset",
    },
  ],
};


export const columnGapsRulesGroup: CSSSubCategory = {
  name: "Column Gaps & Rules",
  properties: [
    {
      name: "column-gap",
      values:
        "normal | <length> | <percentage> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "column-rule",
      values:
        "<column-rule-width> || <column-rule-style> || <column-rule-color> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "column-rule-color",
      values: "<color> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "column-rule-style",
      values:
        "none | hidden | dotted | dashed | solid | double | groove | ridge | inset | outset | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "column-rule-width",
      values:
        "thin | medium | thick | <length> | initial | inherit | revert | revert-layer | unset",
    },
  ],
};


export const countersGroup: CSSSubCategory = {
  name: "Counters",
  properties: [
    {
      name: "counter-reset",
      values:
        "none | [<custom-ident> <integer>?]+ | reversed(<custom-ident>) <integer>? | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "counter-increment",
      values:
        "none | [<custom-ident> <integer>?]+ | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "counter-set",
      values:
        "none | [<custom-ident> <integer>?]+ | initial | inherit | revert | revert-layer | unset",
    },
  ],
};


export const dimensionsGroup: CSSSubCategory = {
  name: "Dimensions",
  properties: [
    {
      name: "width / height",
      values:
        "auto | max-content | min-content | fit-content | stretch | <length-absolute> (e.g. px, cm, mm, in, pc, pt, Q) | <length-font-relative> (e.g. em, rem, ex, ch, cap, ic, lh, rlh) | <length-viewport> (e.g. vw, vh, vmin, vmax, vi, vb) | <length-container-query> (e.g. cqw, cqh, cqi, cqb, cqmin, cqmax) | <percentage> (e.g. 0%, 50%, 100%) | <math-function> (e.g. calc(), min(), max(), clamp())",
    },
    {
      name: "min-width / min-height",
      values:
        "auto | max-content | min-content | fit-content | stretch | <length-absolute> (e.g. px, cm, mm, in, pc, pt, Q) | <length-font-relative> (e.g. em, rem, ex, ch, cap, ic, lh, rlh) | <length-viewport> (e.g. vw, vh, vmin, vmax, vi, vb) | <length-container-query> (e.g. cqw, cqh, cqi, cqb, cqmin, cqmax) | <percentage> (e.g. 0%, 50%, 100%) | <math-function> (e.g. calc(), min(), max(), clamp())",
    },
    {
      name: "max-width / max-height",
      values:
        "none | max-content | min-content | fit-content | stretch | <length-absolute> (e.g. px, cm, mm, in, pc, pt, Q) | <length-font-relative> (e.g. em, rem, ex, ch, cap, ic, lh, rlh) | <length-viewport> (e.g. vw, vh, vmin, vmax, vi, vb) | <length-container-query> (e.g. cqw, cqh, cqi, cqb, cqmin, cqmax) | <percentage> (e.g. 0%, 50%, 100%) | <math-function> (e.g. calc(), min(), max(), clamp())",
    },
    {
      name: "aspect-ratio",
      values:
        "auto | <ratio> (e.g. 1 / 1, 16 / 9, 4 / 3, 1.5) | auto <ratio> (e.g. auto 16 / 9) | <ratio> auto (e.g. 1 / 1 auto)",
    },
  ],
};


export const displayModeGroup: CSSSubCategory = {
  name: "Display Mode",
  properties: [
    {
      name: "display",
      values:
        "block | inline-block | inline | flex | inline-flex | grid | inline-grid | flow-root | contents | none | table | table-row | table-cell | list-item",
    },
  ],
};


export const documentFlowPositionGroup: CSSSubCategory = {
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
};


export const flexboxContainerGroup: CSSSubCategory = {
  name: "Flexbox Container",
  properties: [
    {
      name: "flex-direction",
      values: "row | row-reverse | column | column-reverse",
    },
    {
      name: "justify-content",
      values:
        "normal | flex-start | flex-end | center | space-between | space-around | space-evenly | start | end | left | right",
    },
    {
      name: "align-items",
      values:
        "normal | stretch | center | start | end | flex-start | flex-end | self-start | self-end | anchor-center | baseline | first baseline | last baseline | safe center | safe start | safe end | safe flex-start | safe flex-end | safe self-start | safe self-end | unsafe center | unsafe start | unsafe end | unsafe flex-start | unsafe flex-end | unsafe self-start | unsafe self-end | inherit | initial | revert | revert-layer | unset",
    },
    {
      name: "flex-wrap",
      values: "nowrap | wrap | wrap-reverse",
    },
    {
      name: "gap",
      values: "normal | <length> | <percentage> | calc(...) | clamp(...)",
      note: "e.g., 16px, 1rem, 5%",
    },
  ],
};


export const flexboxItemsGroup: CSSSubCategory = {
  name: "Flexbox Items",
  properties: [
    {
      name: "flex-grow",
      values: "<number> | calc(...)",
      note: "e.g., 0, 1, 2.5",
    },
    {
      name: "flex-shrink",
      values: "<number> | calc(...)",
      note: "e.g., 0, 1, 3",
    },
    {
      name: "flex-basis",
      values:
        "auto | content | max-content | min-content | fit-content | <length> | <percentage>",
    },
    {
      name: "align-self",
      values:
        "auto | normal | flex-start | flex-end | center | baseline | stretch | start | end",
    },
    {
      name: "order",
      values: "<integer>",
      note: "e.g., 0, 1, 99, -1, -99",
    },
  ],
};


export const gridContainerGroup: CSSSubCategory = {
  name: "Grid Container",
  properties: [
    {
      name: "grid-template-columns",
      values: "none | subgrid | masonry | <track-list>",
    },
    {
      name: "grid-template-rows",
      values: "none | subgrid | masonry | <track-list>",
    },
    {
      name: "justify-items",
      values:
        "normal | stretch | center | start | end | flex-start | flex-end | self-start | self-end | left | right | legacy",
    },
    {
      name: "align-items",
      values:
        "normal | stretch | center | start | end | flex-start | flex-end | self-start | self-end | anchor-center | baseline | first baseline | last baseline | safe center | safe start | safe end | safe flex-start | safe flex-end | safe self-start | safe self-end | unsafe center | unsafe start | unsafe end | unsafe flex-start | unsafe flex-end | unsafe self-start | unsafe self-end | inherit | initial | revert | revert-layer | unset",
    },
  ],
};


export const gridItemsGroup: CSSSubCategory = {
  name: "Grid Items",
  properties: [
    {
      name: "grid-column",
      values:
        "auto | <integer> | <custom-ident> | <integer> / <integer> | span <integer> | span <custom-ident>",
    },
    {
      name: "grid-row",
      values:
        "auto | <integer> | <custom-ident> | <integer> / <integer> | span <integer> | span <custom-ident>",
    },
    {
      name: "grid-area",
      values:
        "auto | <custom-name> | <row-start> / <column-start> / <row-end> / <column-end>",
    },
  ],
};


export const innerSpacingPhysicalDimensionGroup: CSSSubCategory = {
  name: "Inner Spacing (Physical Dimension)",
  properties: [
    {
      name: "padding",
      values:
        "<absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
    },
    {
      name: "padding-top / padding-right / padding-bottom / padding-left",
      values:
        "<absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
    },
  ],
};


export const layoutBreakingGroup: CSSSubCategory = {
  name: "Layout Breaking",
  properties: [
    {
      name: "break-before",
      values:
        "auto | avoid | always | all | avoid-page | page | left | right | recto | verso | avoid-column | column | avoid-region | region | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "break-after",
      values:
        "auto | avoid | always | all | avoid-page | page | left | right | recto | verso | avoid-column | column | avoid-region | region | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "break-inside",
      values:
        "auto | avoid | avoid-page | avoid-column | avoid-region | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "box-decoration-break",
      values:
        "slice | clone | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "orphans",
      values: "<integer> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "widows",
      values: "<integer> | initial | inherit | revert | revert-layer | unset",
    },
  ],
};


export const listStylingGroup: CSSSubCategory = {
  name: "List Styling",
  properties: [
    {
      name: "list-style",
      values:
        "<list-style-type> || <list-style-position> || <list-style-image> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "list-style-type",
      values:
        "none | disc | circle | square | decimal | decimal-leading-zero | lower-roman | upper-roman | lower-greek | lower-latin | upper-latin | armenian | georgian | lower-alpha | upper-alpha | <string> | <custom-ident> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "list-style-position",
      values:
        "inside | outside | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "list-style-image",
      values:
        "none | url(...) | <image> | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "marker-side",
      values:
        "match-self | match-parent | initial | inherit | revert | revert-layer | unset",
    },
  ],
};


export const logicalDocumentFlowPositionWritingModeAgnosticGroup: CSSSubCategory =
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
  };


export const logicalInnerSpacingWritingSystemAgnosticGroup: CSSSubCategory = {
  name: "Logical Inner Spacing (Writing-System Agnostic)",
  properties: [
    {
      name: "padding-block / padding-inline",
      values:
        "<absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
    },
    {
      name: "padding-block-start / padding-block-end / padding-inline-start / padding-inline-end",
      values:
        "<absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-query> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
    },
  ],
};


export const logicalOuterSpacingWritingSystemAgnosticGroup: CSSSubCategory = {
  name: "Logical Outer Spacing (Writing-System Agnostic)",
  properties: [
    {
      name: "margin-block / margin-inline",
      values:
        "auto | <absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
    },
    {
      name: "margin-block-start / margin-block-end / margin-inline-start / margin-inline-end",
      values:
        "auto | <absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
    },
  ],
};


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


export const outerSpacingPhysicalDimensionGroup: CSSSubCategory = {
  name: "Outer Spacing (Physical Dimension)",
  properties: [
    {
      name: "margin",
      values:
        "auto | <absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
    },
    {
      name: "margin-top / margin-right / margin-bottom / margin-left",
      values:
        "auto | <absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
    },
  ],
};


export const positionFallbacksVisibilityGroup: CSSSubCategory = {
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
};


export const spacingTrimNextGenContainerSpacingControlsGroup: CSSSubCategory = {
  name: "Spacing Trim (Next-Gen Container Spacing Controls)",
  properties: [
    {
      name: "margin-trim",
      values:
        "none | all | block | block-start | block-end | inline | inline-start | inline-end | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
    },
  ],
};


export const stackOrderGroup: CSSSubCategory = {
  name: "Stack Order",
  properties: [
    {
      name: "z-index",
      values:
        "auto | <integer> (e.g. 1, 999, -10, 999999) | <math-function> (e.g. calc(3 + 2))",
    },
  ],
};


export const subgridTemplatesGroup: CSSSubCategory = {
  name: "Subgrid Templates",
  properties: [
    {
      name: "grid-template-columns",
      values:
        "none | <track-list> | <auto-track-list> | subgrid <line-name-list>? | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "grid-template-rows",
      values:
        "none | <track-list> | <auto-track-list> | subgrid <line-name-list>? | initial | inherit | revert | revert-layer | unset",
    },
  ],
};


export const tableLayoutStructureGroup: CSSSubCategory = {
  name: "Table Layout & Structure",
  properties: [
    {
      name: "table-layout",
      values:
        "auto | fixed | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "border-collapse",
      values:
        "collapse | separate | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "border-spacing",
      values:
        "<length> | <length> <length> | initial | inherit | revert | revert-layer | unset",
      note: "e.g., 10px, 1rem 0.5rem",
    },
    {
      name: "empty-cells",
      values: "show | hide | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "caption-side",
      values:
        "top | bottom | block-start | block-end | inline-start | inline-end | initial | inherit | revert | revert-layer | unset",
    },
  ],
};



export const layoutBoxModelCategory: CSSCategory = {
  name: "Layout & Box Model",
  icon: Maximize,
  subCategories: [
    displayModeGroup,
    flexboxContainerGroup,
    flexboxItemsGroup,
    gridContainerGroup,
    gridItemsGroup,
    outerSpacingPhysicalDimensionGroup,
    innerSpacingPhysicalDimensionGroup,
    logicalOuterSpacingWritingSystemAgnosticGroup,
    logicalInnerSpacingWritingSystemAgnosticGroup,
    spacingTrimNextGenContainerSpacingControlsGroup,
    dimensionsGroup,
    boxSizingSystemGroup,
    documentFlowPositionGroup,
    logicalDocumentFlowPositionWritingModeAgnosticGroup,
    stackOrderGroup,
    anchorDefinitionAttachmentModernOverlayPositioningGroup,
    advancedAnchorAreaPlacementGroup,
    positionFallbacksVisibilityGroup,
    subgridTemplatesGroup,
    masonryTracksGroup,
    anchorPositioningGroup,
    anchorAlignmentGroup,
    columnDefinitionGroup,
    columnGapsRulesGroup,
    layoutBreakingGroup,
    listStylingGroup,
    countersGroup,
    tableLayoutStructureGroup,
  ],
};

