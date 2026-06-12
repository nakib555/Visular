import { CSSCategory } from "../../../types-css";
import { MousePointer } from "lucide-react";

import { coreFormInputStylingGroup } from "./properties/core-form-input-styling";
import { userActionPointerControlsGroup } from "./properties/user-action-pointer-controls";
import { focusKeyboardNavigationGroup } from "./properties/focus-keyboard-navigation";
import { popoverDialogApiGroup } from "./properties/popover-dialog-api";
import { discreteTransitionAnimationsGroup } from "./properties/discrete-transition-animations";
import { touchPointerActionsGroup } from "./properties/touch-pointer-actions";
import { userModifiersGroup } from "./properties/user-modifiers";
import { outlineStylingGroup } from "./properties/outline-styling";
import { pseudoElementContentGroup } from "./properties/pseudo-element-content";
import { counterManagementGroup } from "./properties/counter-management";
import { allPropertyResetGroup } from "./properties/all-property-reset";
import { inputSizingAppearanceGroup } from "./properties/input-sizing-appearance";
import { decorationGroup } from "./properties/decoration";
import { sequentialNavigationGroup } from "./properties/sequential-navigation";
import { spatialNavigationDirectionGroup } from "./properties/spatial-navigation-direction";
import { spatialNavigationActionGroup } from "./properties/spatial-navigation-action";

export const interactivityUiMiscCategory: CSSCategory = {
  name: "Interactivity, UI & Miscellaneous",
  icon: MousePointer,
  subCategories: [
    coreFormInputStylingGroup,
    userActionPointerControlsGroup,
    focusKeyboardNavigationGroup,
    popoverDialogApiGroup,
    discreteTransitionAnimationsGroup,
    touchPointerActionsGroup,
    userModifiersGroup,
    outlineStylingGroup,
    pseudoElementContentGroup,
    counterManagementGroup,
    allPropertyResetGroup,
    inputSizingAppearanceGroup,
    decorationGroup,
    sequentialNavigationGroup,
    spatialNavigationDirectionGroup,
    spatialNavigationActionGroup,
  ],
};
