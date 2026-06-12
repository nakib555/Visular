import { CSSSubCategory } from "../../../../types-css";

export const opentypeVariableFontControlsGroup: CSSSubCategory = {
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
      values: 'normal | <string-tag> <number> (e.g. "wght" 500, "wdth" 85)',
    },
    {
      name: "font-optical-sizing",
      values: "auto | none",
    },
    {
      name: "font-palette",
      values: "normal | light | dark | <dashed-ident>",
    },
  ],
};
