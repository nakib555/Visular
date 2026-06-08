import { CSSCategory } from "../../types-css";
import { Compass } from "lucide-react";

export const motionPathsCategory: CSSCategory = {
    name: "MOTION PATHS",
    icon: Compass,
    subCategories: [
      {
        name: "Motion Path Definition",
        properties: [
          {
            name: "offset-path",
            values:
              "none | ray() | path() | url() | circle() | ellipse() | polygon() | inset() | rect() | xywh() | coord-box | initial | inherit | revert | revert-layer | unset",
          },
          {
            name: "offset-distance",
            values:
              "<length> | <percentage> | initial | inherit | revert | revert-layer | unset",
            note: "e.g., 50%, 100px",
          },
          {
            name: "offset-rotate",
            values:
              "auto | reverse | <angle> | auto <angle> | reverse <angle> | initial | inherit | revert | revert-layer | unset",
            note: "e.g., auto 90deg, 45deg",
          },
          {
            name: "offset-position",
            values:
              "auto | <position> | initial | inherit | revert | revert-layer | unset",
            note: "e.g., center center, 20% 40%",
          },
          {
            name: "offset-anchor",
            values:
              "auto | <position> | initial | inherit | revert | revert-layer | unset",
            note: "e.g., center, top left",
          },
          {
            name: "offset",
            values:
              "<offset-position>? [ <offset-path> [ <offset-distance> || <offset-rotate> ]? ]? [ / <offset-anchor> ]? | initial | inherit | revert | revert-layer | unset",
          },
        ],
      },
    ],
  };
