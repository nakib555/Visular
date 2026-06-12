import { CSSCategory } from "../../../types-css";
import { Palette } from "lucide-react";

import { colorsBackgroundsGroup } from "./properties/colors-backgrounds";
import { bordersGroup } from "./properties/borders";
import { effectsFiltersGroup } from "./properties/effects-filters";
import { fillsStrokesGroup } from "./properties/fills-strokes";
import { markersPathsGroup } from "./properties/markers-paths";
import { geometryCoordinatesGroup } from "./properties/geometry-coordinates";
import { svgTextPositioningGroup } from "./properties/svg-text-positioning";
import { optimizationRenderingGroup } from "./properties/optimization-rendering";
import { shapeClippingGroup } from "./properties/shape-clipping";
import { alphaImageMaskingGroup } from "./properties/alpha-image-masking";
import { compositingAndBlendingGroup } from "./properties/compositing-and-blending";
import { objectModelingGroup } from "./properties/object-modeling";

export const appearanceAestheticsSvgCategory: CSSCategory = {
  name: "Appearance, Aesthetics & SVG",
  icon: Palette,
  subCategories: [
    colorsBackgroundsGroup,
    bordersGroup,
    effectsFiltersGroup,
    fillsStrokesGroup,
    markersPathsGroup,
    geometryCoordinatesGroup,
    svgTextPositioningGroup,
    optimizationRenderingGroup,
    shapeClippingGroup,
    alphaImageMaskingGroup,
    compositingAndBlendingGroup,
    objectModelingGroup,
  ],
};
