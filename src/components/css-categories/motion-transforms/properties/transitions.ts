import { CSSSubCategory } from "../../../../types-css";

export const transitionsGroup: CSSSubCategory = {
  name: "Transitions",
  properties: [
    {
      name: "transition",
      values: "none | all | <single-transition> (e.g. all 0.3s ease-in-out 0s)",
    },
    {
      name: "transition-property",
      values: "none | all | <property-name> (e.g. transform, opacity)",
    },
    {
      name: "transition-duration",
      values: "<time> (e.g. 0.3s, 300ms)",
    },
    {
      name: "transition-delay",
      values: "<time> (e.g. 0.1s, 100ms)",
    },
    {
      name: "transition-timing-function",
      values:
        "ease | linear | ease-in | ease-out | ease-in-out | step-start | step-end | steps(...) | cubic-bezier(...)",
    },
    {
      name: "transition-behavior",
      values: "normal | allow-discrete",
    },
  ],
};
