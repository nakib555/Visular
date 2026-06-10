import { CSSCategory } from "../../types-css";
import { layoutBoxModelCategory } from "./layout-box-model";
import { typographyTextCategory } from "./typography-text";
import { appearanceAestheticsSvgCategory } from "./appearance-aesthetics-svg";
import { motionTransformsCategory } from "./motion-transforms";
import { interactivityUiMiscCategory } from "./interactivity-ui-misc";
import { environmentMediaArchitectureCategory } from "./environment-media-architecture";

export const CSS_HIERARCHY_DATA: CSSCategory[] = [
  layoutBoxModelCategory,
  typographyTextCategory,
  appearanceAestheticsSvgCategory,
  motionTransformsCategory,
  interactivityUiMiscCategory,
  environmentMediaArchitectureCategory,
];
