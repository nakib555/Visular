import { CSSSubCategory } from "../../../../types-css";

export const keyframeAnimationsGroup: CSSSubCategory = {
  name: "Keyframe Animations",
  properties: [
    {
      name: "animation",
      values:
        "<single-animation> (e.g. slide-in 1s ease-out 0s infinite normal forwards)",
    },
    {
      name: "animation-name",
      values: "none | <custom-name> (e.g. fade-in, bounce-animation)",
    },
    {
      name: "animation-duration",
      values: "<time> (e.g. 1s, 800ms)",
    },
    {
      name: "animation-delay",
      values: "<time>",
    },
    {
      name: "animation-timing-function",
      values:
        "ease | linear | ease-in | ease-out | ease-in-out | step-start | step-end | cubic-bezier(...)",
    },
    {
      name: "animation-iteration-count",
      values: "infinite | <number>",
    },
    {
      name: "animation-direction",
      values: "normal | reverse | alternate | alternate-reverse",
    },
    {
      name: "animation-fill-mode",
      values: "none | forwards | backwards | both",
    },
    {
      name: "animation-play-state",
      values: "running | paused",
    },
    {
      name: "animation-composition",
      values: "replace | add | accumulate",
    },
  ],
};
