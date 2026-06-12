import { CSSCategory } from "../../../types-css";
import { Compass } from "lucide-react";

import { mediaFittingCroppingGroup } from "./properties/media-fitting-cropping";
import { imageRenderingModificationGroup } from "./properties/image-rendering-modification";
import { contentFlowShapesGroup } from "./properties/content-flow-shapes";
import { containerContextQueryRegistrationGroup } from "./properties/container-context-query-registration";
import { performanceContainmentStrategiesGroup } from "./properties/performance-containment-strategies";
import { intrinsicDimensionsPlaceholdersGroup } from "./properties/intrinsic-dimensions-placeholders";
import { scrollbarsStylingGroup } from "./properties/scrollbars-styling";
import { overflowMechanicsGroup } from "./properties/overflow-mechanics";
import { overscrollBehaviorGroup } from "./properties/overscroll-behavior";
import { scrollSnappingCoordinatesGroup } from "./properties/scroll-snapping-coordinates";
import { containerQueryNameGroup } from "./properties/container-query-name";
import { pagedMediaPrintingGroup } from "./properties/paged-media-printing";
import { systemUiCoreGroup } from "./properties/system-ui-core";

export const environmentMediaArchitectureCategory: CSSCategory = {
  name: "Environment, Media & Architecture",
  icon: Compass,
  subCategories: [
    mediaFittingCroppingGroup,
    imageRenderingModificationGroup,
    contentFlowShapesGroup,
    containerContextQueryRegistrationGroup,
    performanceContainmentStrategiesGroup,
    intrinsicDimensionsPlaceholdersGroup,
    scrollbarsStylingGroup,
    overflowMechanicsGroup,
    overscrollBehaviorGroup,
    scrollSnappingCoordinatesGroup,
    containerQueryNameGroup,
    pagedMediaPrintingGroup,
    systemUiCoreGroup,
  ],
};
