import { CSSCategory } from "../../types-css";
import { Type } from "lucide-react";

export const typographyTextCategory: CSSCategory = {
    name: "TYPOGRAPHY & TEXT",
    icon: Type,
    subCategories: [
      {
        name: "Font Selection & Basic Styling",
        properties: [
          {
            name: "font-family",
            values:
              'serif | sans-serif | monospace | cursive | fantasy | system-ui | ui-serif | ui-sans-serif | ui-monospace | ui-rounded | emoji | math | fangsong | <string> (e.g. "Helvetica Neue", "SF Pro", "Inter")',
          },
          {
            name: "font-weight",
            values:
              "normal | bold | bolder | lighter | <number-range-1-1000> (e.g. 100, 400, 700, 900, 550)",
          },
          {
            name: "font-style",
            values:
              "normal | italic | oblique | oblique <angle> (e.g. oblique 14deg, oblique -10deg)",
          },
          {
            name: "font-synthesis",
            values:
              "none | weight | style | small-caps | weight style | weight style small-caps",
          },
        ],
      },
      {
        name: "Text Sizing & Scalability",
        properties: [
          {
            name: "font-size",
            values:
              "xx-small | x-small | small | medium | large | x-large | xx-large | xxx-large | smaller | larger | <length-absolute> (e.g. 16px, 12pt) | <length-relative-font> (e.g. 1.5em, 1.2rem, 12ch, 2lh, 2rlh) | <length-relative-viewport> (e.g. 4vw, 3vh, 3svh, 2dvw) | <length-container> (e.g. 5cqw, 4cqh, 3cqmin) | <percentage> (e.g. 120%)",
          },
          {
            name: "font-size-adjust",
            values:
              "none | ex-height | cap-height | ch-width | ic-width | <number> (e.g. 0.5, 0.485) | from-font",
          },
          {
            name: "font-stretch",
            values:
              "normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded | <percentage-range-50-200> (e.g. 75%, 120%)",
          },
        ],
      },
      {
        name: "Text Alignment, Justification & Spacing",
        properties: [
          {
            name: "text-align",
            values:
              "start | end | left | right | center | justify | justify-all | match-parent",
          },
          {
            name: "text-align-last",
            values: "auto | start | end | left | right | center | justify",
          },
          {
            name: "text-justify",
            values: "auto | none | inter-word | inter-character | distribute",
          },
          {
            name: "line-height",
            values:
              "normal | <number> (e.g. 1.5, 1.2) | <length-absolute> (e.g. 24px) | <length-relative-font> (e.g. 1.8em, 1.6rem) | <length-relative-viewport> (e.g. 3vw) | <percentage> (e.g. 150%)",
          },
          {
            name: "letter-spacing",
            values:
              "normal | <length-absolute> (e.g. 1px) | <length-relative-font> (e.g. 0.05em, 0.1rem)",
          },
          {
            name: "word-spacing",
            values:
              "normal | <length-absolute> (e.g. 4px) | <length-relative-font> (e.g. 0.25em, 0.3rem) | <percentage> (e.g. 50%)",
          },
          {
            name: "text-indent",
            values:
              "<length-absolute> (e.g. 20px) | <length-relative-font> (e.g. 2em, 1.5rem) | <percentage> (e.g. 5%) | each-line | hanging | each-line hanging | hanging each-line",
          },
        ],
      },
      {
        name: "Text Wrapping, Breaking & Clamping",
        properties: [
          {
            name: "white-space",
            values:
              "normal | pre | nowrap | pre-wrap | pre-line | break-spaces",
          },
          {
            name: "text-wrap",
            values: "wrap | nowrap | balance | pretty | stable",
          },
          {
            name: "word-break",
            values: "normal | break-all | keep-all | break-word",
          },
          { name: "overflow-wrap", values: "normal | break-word | anywhere" },
          {
            name: "text-overflow",
            values: 'clip | ellipsis | <string> (e.g. "...", " [read more]")',
          },
          {
            name: "line-clamp",
            values:
              'none | <integer> (e.g. 3, 5) | <integer> <string> (e.g. 3 "...")',
          },
          { name: "hyphens", values: "none | manual | auto" },
          { name: "hyphenate-character", values: 'auto | <string> (e.g. "-")' },
        ],
      },
      {
        name: "Text Box Trim & Metrics",
        properties: [
          {
            name: "text-box-trim",
            values: "none | trim-over | trim-under | trim-both",
          },
          {
            name: "text-box-edge",
            values: "auto | text | cap | ex | ideographic | ideographic-ink",
          },
          {
            name: "text-box",
            values:
              "none | <text-box-trim> <text-box-edge> (e.g. trim-both cap, trim-over text)",
          },
        ],
      },
      {
        name: "Text Decoration Systems",
        properties: [
          {
            name: "text-decoration-line",
            values:
              "none | underline | overline | line-through | blink | underline overline | underline line-through",
          },
          {
            name: "text-decoration-color",
            values:
              "<color-keyword> (e.g. red) | <color-hex> (e.g. #ff0000) | <color-rgb> | <color-hsl> | <color-oklch> | currentcolor",
          },
          {
            name: "text-decoration-style",
            values: "solid | double | dotted | dashed | wavy",
          },
          {
            name: "text-decoration-thickness",
            values:
              "auto | from-font | <length-absolute> (e.g. 2px) | <length-relative-font> (e.g. 0.1em) | <percentage>",
          },
          {
            name: "text-underline-offset",
            values:
              "auto | <length-absolute> (e.g. 3px) | <length-relative-font> (e.g. 0.25em) | <percentage>",
          },
          {
            name: "text-underline-position",
            values: "auto | under | left | right | under left | under right",
          },
        ],
      },
      {
        name: "Text Emphasis & Effects",
        properties: [
          {
            name: "text-emphasis-style",
            values:
              'none | filled | open | dot | circle | double-circle | triangle | sesame | <string> (e.g. "x") | filled dot | open circle',
          },
          {
            name: "text-emphasis-color",
            values:
              "<color-keyword> | <color-hex> | <color-rgb> | <color-hsl> | <color-oklch> | currentcolor",
          },
          {
            name: "text-emphasis-position",
            values:
              "over | under | over right | over left | under right | under left",
          },
          {
            name: "text-shadow",
            values:
              "none | <length-offset-x> <length-offset-y> <color> | <length-offset-x> <length-offset-y> <length-blur> <color>",
          },
        ],
      },
      {
        name: "Text Transform & Case Control",
        properties: [
          {
            name: "text-transform",
            values:
              "none | capitalize | uppercase | lowercase | full-width | full-size-kana",
          },
          {
            name: "font-variant-caps",
            values:
              "normal | small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps",
          },
        ],
      },
      {
        name: "OpenType & Variable Font Controls",
        properties: [
          {
            name: "font-variant-ligatures",
            values:
              "normal | none | common-ligatures | no-common-ligatures | discretionary-ligatures | historical-ligatures | contextual",
          },
          {
            name: "font-variant-numeric",
            values:
              "normal | ordinal | slashed-zero | lining-nums | oldstyle-nums | proportional-nums | tabular-nums | diagonal-fractions | stacked-fractions",
          },
          {
            name: "font-variant-east-asian",
            values:
              "normal | jis78 | jis83 | jis04 | simplified | traditional | full-width | ruby",
          },
          {
            name: "font-variant-emoji",
            values: "normal | text | emoji | unicode",
          },
          {
            name: "font-feature-settings",
            values:
              'normal | <string-tag> <on-off-integer> (e.g. "smcp" on, "liga" 0)',
          },
          {
            name: "font-variation-settings",
            values:
              'normal | <string-tag> <number> (e.g. "wght" 500, "wdth" 85)',
          },
          { name: "font-optical-sizing", values: "auto | none" },
          {
            name: "font-palette",
            values: "normal | light | dark | <dashed-ident>",
          },
        ],
      },
      {
        name: "Direction & Writing Mode",
        properties: [
          {
            name: "writing-mode",
            values: "horizontal-tb | vertical-rl | vertical-lr",
          },
          { name: "direction", values: "ltr | rtl" },
          { name: "text-orientation", values: "mixed | upright | sideways" },
          {
            name: "unicode-bidi",
            values:
              "normal | embed | bidi-override | isolate | isolate-override | plaintext",
          },
        ],
      },
    ],
  };
