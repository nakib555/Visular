import { CSSCategory } from "../../../types-css";
import { Type } from "lucide-react";

import { fontSelectionBasicStylingGroup } from "./properties/font-selection-basic-styling";
import { textSizingScalabilityGroup } from "./properties/text-sizing-scalability";
import { textAlignmentJustificationSpacingGroup } from "./properties/text-alignment-justification-spacing";
import { textWrappingBreakingClampingGroup } from "./properties/text-wrapping-breaking-clamping";
import { textBoxTrimMetricsGroup } from "./properties/text-box-trim-metrics";
import { textDecorationSystemsGroup } from "./properties/text-decoration-systems";
import { textEmphasisEffectsGroup } from "./properties/text-emphasis-effects";
import { textTransformCaseControlGroup } from "./properties/text-transform-case-control";
import { opentypeVariableFontControlsGroup } from "./properties/opentype-variable-font-controls";
import { directionWritingModeGroup } from "./properties/direction-writing-mode";
import { flowOrientationGroup } from "./properties/flow-orientation";
import { lineBreakingHyphenationGroup } from "./properties/line-breaking-hyphenation";
import { textDecorationDetailsGroup } from "./properties/text-decoration-details";
import { rubyQuotesGroup } from "./properties/ruby-quotes";
import { variableFontAxesGroup } from "./properties/variable-font-axes";
import { opentypeFeaturesGroup } from "./properties/opentype-features";
import { colorFontsSynthesisGroup } from "./properties/color-fonts-synthesis";
import { textBoxMetricsGroup } from "./properties/text-box-metrics";

export const typographyTextCategory: CSSCategory = {
  name: "Typography & Text",
  icon: Type,
  subCategories: [
    fontSelectionBasicStylingGroup,
    textSizingScalabilityGroup,
    textAlignmentJustificationSpacingGroup,
    textWrappingBreakingClampingGroup,
    textBoxTrimMetricsGroup,
    textDecorationSystemsGroup,
    textEmphasisEffectsGroup,
    textTransformCaseControlGroup,
    opentypeVariableFontControlsGroup,
    directionWritingModeGroup,
    flowOrientationGroup,
    lineBreakingHyphenationGroup,
    textDecorationDetailsGroup,
    rubyQuotesGroup,
    variableFontAxesGroup,
    opentypeFeaturesGroup,
    colorFontsSynthesisGroup,
    textBoxMetricsGroup,
  ],
};
