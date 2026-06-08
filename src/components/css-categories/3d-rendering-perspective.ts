import { CSSCategory } from "../../types-css";
import { Box } from "lucide-react";

export const _3dRenderingPerspectiveCategory: CSSCategory = {
    name: "3D RENDERING & PERSPECTIVE",
    icon: Box,
    subCategories: [
      {
        name: "Perspective Setting",
        properties: [
          {
            name: "perspective",
            values:
              "none | <length> | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "perspective-origin",
            values:
              "<position> | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
      {
        name: "3D Spatial Styling",
        properties: [
          {
            name: "transform-style",
            values:
              "flat | preserve-3d | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "backface-visibility",
            values:
              "visible | hidden | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
    ],
  };
