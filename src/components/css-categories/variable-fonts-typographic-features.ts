import { CSSCategory } from "../../types-css";
import { Type } from "lucide-react";

export const variableFontsTypographicFeaturesCategory: CSSCategory = {
    name: "VARIABLE FONTS & TYPOGRAPHIC FEATURES",
    icon: Type,
    subCategories: [
      {
        name: "Variable Font Axes",
        properties: [
          {
            name: "font-variation-settings",
            values:
              "normal | [ <string> <number> ]# | initial | inherit | revert | revert-layer | unset",
            note: "e.g., 'wght' 700, 'wdth' 120",
          },
          {
            name: "font-optical-sizing",
            values:
              "auto | none | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "font-stretch",
            values:
              "normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded | <percentage> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "font-style",
            values:
              "normal | italic | oblique <angle>? | initial | inherit | revert | revert-layer | unset",
            note: "e.g., oblique 14deg",
          },
          {
            name: "font-weight",
            values:
              "normal | bold | lighter | bolder | <number> | initial | inherit | revert | revert-layer | unset",
            note: "e.g., 350",
          },
        ],
      },
      {
        name: "OpenType Features",
        properties: [
          {
            name: "font-feature-settings",
            values:
              "normal | <feature-tag-value># | initial | inherit | revert | revert-layer | unset",
            note: "e.g., 'smcp' on, 'tnum' 1",
          },
          {
            name: "font-variant",
            values:
              "normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> || stylistic(<feature-value-name>) || historical-forms || styleset(<feature-value-name>#) || character-variant(<feature-value-name>#) || swash(<feature-value-name>) || ornaments(<feature-value-name>) || annotation(<feature-value-name>) || [ small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps ] || <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero || <east-asian-variant-values> || <east-asian-width-values> || ruby ] | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "font-variant-ligatures",
            values:
              "normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> ] | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "font-variant-caps",
            values:
              "normal | small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "font-variant-numeric",
            values:
              "normal | [ <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero ] | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "font-variant-alternates",
            values:
              "normal | [ stylistic(<feature-value-name>) || historical-forms || styleset(<feature-value-name>#) || character-variant(<feature-value-name>#) || swash(<feature-value-name>) || ornaments(<feature-value-name>) || annotation(<feature-value-name>) ] | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "font-variant-position",
            values:
              "normal | sub | super | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "font-variant-east-asian",
            values:
              "normal | [ <east-asian-variant-values> || <east-asian-width-values> || ruby ] | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "font-variant-emoji",
            values:
              "normal | text | emoji | unicode | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "font-kerning",
            values:
              "auto | normal | none | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "font-language-override",
            values:
              "normal | <string> | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
      {
        name: "Color Fonts & Synthesis",
        properties: [
          {
            name: "font-palette",
            values:
              "normal | light | dark | <palette-identifier> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "font-synthesis",
            values:
              "none | [ weight || style || small-caps || position ] | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "font-synthesis-weight",
            values:
              "auto | none | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "font-synthesis-style",
            values:
              "auto | none | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "font-synthesis-small-caps",
            values:
              "auto | none | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "font-synthesis-position",
            values:
              "auto | none | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
    ],
  };
