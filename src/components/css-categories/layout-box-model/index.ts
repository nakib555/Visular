import { CSSCategory } from "../../../types-css";
import { Maximize } from "lucide-react";

import { displayModeGroup } from "./properties/display-mode";
import { flexboxContainerGroup } from "./properties/flexbox-container";
import { flexboxItemsGroup } from "./properties/flexbox-items";
import { gridContainerGroup } from "./properties/grid-container";
import { gridItemsGroup } from "./properties/grid-items";
import { outerSpacingPhysicalDimensionGroup } from "./properties/outer-spacing-physical-dimension";
import { innerSpacingPhysicalDimensionGroup } from "./properties/inner-spacing-physical-dimension";
import { logicalOuterSpacingWritingSystemAgnosticGroup } from "./properties/logical-outer-spacing-writing-system-agnostic";
import { logicalInnerSpacingWritingSystemAgnosticGroup } from "./properties/logical-inner-spacing-writing-system-agnostic";
import { spacingTrimNextGenContainerSpacingControlsGroup } from "./properties/spacing-trim-next-gen-container-spacing-controls";
import { dimensionsGroup } from "./properties/dimensions";
import { boxSizingSystemGroup } from "./properties/box-sizing-system";
import { documentFlowPositionGroup } from "./properties/document-flow-position";
import { logicalDocumentFlowPositionWritingModeAgnosticGroup } from "./properties/logical-document-flow-position-writing-mode-agnostic";
import { stackOrderGroup } from "./properties/stack-order";
import { anchorDefinitionAttachmentModernOverlayPositioningGroup } from "./properties/anchor-definition-attachment-modern-overlay-positioning";
import { advancedAnchorAreaPlacementGroup } from "./properties/advanced-anchor-area-placement";
import { positionFallbacksVisibilityGroup } from "./properties/position-fallbacks-visibility";
import { subgridTemplatesGroup } from "./properties/subgrid-templates";
import { masonryTracksGroup } from "./properties/masonry-tracks";
import { anchorPositioningGroup } from "./properties/anchor-positioning";
import { anchorAlignmentGroup } from "./properties/anchor-alignment";
import { columnDefinitionGroup } from "./properties/column-definition";
import { columnGapsRulesGroup } from "./properties/column-gaps-rules";
import { layoutBreakingGroup } from "./properties/layout-breaking";
import { listStylingGroup } from "./properties/list-styling";
import { countersGroup } from "./properties/counters";
import { tableLayoutStructureGroup } from "./properties/table-layout-structure";

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
