import { CSSCategory } from "../../types-css";
import { Move } from "lucide-react";

export const spacingCategory: CSSCategory = {
    name: "SPACING",
    icon: Move,
    subCategories: [
      {
        name: "Outer Spacing (Physical Dimension)",
        properties: [
          {
            name: "margin",
            values:
              "auto | <absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
          },
          {
            name: "margin-top / margin-right / margin-bottom / margin-left",
            values:
              "auto | <absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
          },
        ],
      },
      {
        name: "Inner Spacing (Physical Dimension)",
        properties: [
          {
            name: "padding",
            values:
              "<absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
          },
          {
            name: "padding-top / padding-right / padding-bottom / padding-left",
            values:
              "<absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
          },
        ],
      },
      {
        name: "Logical Outer Spacing (Writing-System Agnostic)",
        properties: [
          {
            name: "margin-block / margin-inline",
            values:
              "auto | <absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
          },
          {
            name: "margin-block-start / margin-block-end / margin-inline-start / margin-inline-end",
            values:
              "auto | <absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
          },
        ],
      },
      {
        name: "Logical Inner Spacing (Writing-System Agnostic)",
        properties: [
          {
            name: "padding-block / padding-inline",
            values:
              "<absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-length> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
          },
          {
            name: "padding-block-start / padding-block-end / padding-inline-start / padding-inline-end",
            values:
              "<absolute-length> (e.g. 10px, 1cm, 10mm, 0.25in, 12pt, 1pc, 40Q) | <relative-font-length> (e.g. 1em, 1.5rem, 2ex, 3ch, 1ic, 1lh, 1rlh, 1cap, 1rcap) | <viewport-length> (e.g. 50vw, 100vh, 10vmin, 20vmax, 100dvh, 100svh, 100lvh, 50dvw, 50svw, 50lvw, 10vi, 10vb) | <container-query> (e.g. 10cqw, 5cqh, 10cqi, 10cqb, 5cqmin, 5cqmax) | <percentage> (e.g. 5%, 100%) | <math-function> (e.g. calc(100% - 20px), clamp(1rem, 2vw, 3rem), min(50px, 10vw), max(10px, 2em)) | <css-variable> (e.g. var(--spacing-base)) | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
          },
        ],
      },
      {
        name: "Spacing Trim (Next-Gen Container Spacing Controls)",
        properties: [
          {
            name: "margin-trim",
            values:
              "none | all | block | block-start | block-end | inline | inline-start | inline-end | <global-value> (e.g. inherit, initial, unset, revert, revert-layer)",
          },
        ],
      },
    ],
  };
