import { CSSCategory } from "../../../types-css";
import { Play } from "lucide-react";

import { transitionsGroup } from "./properties/transitions";
import { modernIndividualTransformsGroup } from "./properties/modern-individual-transforms";
import { transformLegacyShorthandOriginGroup } from "./properties/transform-legacy-shorthand-origin";
import { keyframeAnimationsGroup } from "./properties/keyframe-animations";
import { scrollDrivenAnimationsGroup } from "./properties/scroll-driven-animations";
import { motionPathDefinitionGroup } from "./properties/motion-path-definition";
import { viewTransitionApiGroup } from "./properties/view-transition-api";
import { perspectiveSettingGroup } from "./properties/perspective-setting";
import { spatialStyling3dGroup } from "./properties/3d-spatial-styling";

export const motionTransformsCategory: CSSCategory = {
  name: "Motion & Transforms",
  icon: Play,
  subCategories: [
    transitionsGroup,
    modernIndividualTransformsGroup,
    transformLegacyShorthandOriginGroup,
    keyframeAnimationsGroup,
    scrollDrivenAnimationsGroup,
    motionPathDefinitionGroup,
    viewTransitionApiGroup,
    perspectiveSettingGroup,
    spatialStyling3dGroup,
  ],
};
