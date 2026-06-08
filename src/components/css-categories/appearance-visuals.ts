import { CSSCategory } from "../../types-css";
import { Palette } from "lucide-react";

export const appearanceVisualsCategory: CSSCategory = {
    name: "APPEARANCE & VISUALS",
    icon: Palette,
    subCategories: [
      {
        name: "Colors & Backgrounds",
        properties: [
          {
            name: "color",
            values: "<color-name> | <hex> | <rgb/rgba> | <hsl> | transparent",
            note: "e.g., red, #ff0000, rgba(0,0,0,0.5)",
          },
          { name: "background-color", values: "<color> | transparent" },
          {
            name: "background-image",
            values:
              'none | url("...") | linear-gradient(...) | radial-gradient(...)',
          },
          {
            name: "background-size",
            values: "auto | cover | contain | <length/percentage>",
            note: "e.g., 100% 50%",
          },
          {
            name: "background-position",
            values: "center | top left | bottom right | <percentage>",
            note: "e.g., 50% 50%",
          },
          {
            name: "background-repeat",
            values: "repeat | no-repeat | repeat-x | repeat-y",
          },
          {
            name: "opacity",
            values: "<number>",
            note: "0.0 to 1.0 (e.g. 0.5)",
          },
        ],
      },
      {
        name: "Borders",
        properties: [
          {
            name: "border",
            values: "none | <thickness> <style> <color>",
            note: "e.g., 1px solid black, 2px dashed red",
          },
          { name: "outline", values: "none | <thickness> <style> <color>" },
          {
            name: "border-radius",
            values: "<length> | <percentage>",
            note: "e.g., 8px, 50%",
          },
        ],
      },
      {
        name: "Effects & Filters",
        properties: [
          {
            name: "box-shadow",
            values: "none | <offset-x> <offset-y> <blur> <spread> <color>",
            note: "e.g., 2px 4px 10px rgba(0,0,0,0.3)",
          },
          {
            name: "text-shadow",
            values: "none | <offset-x> <offset-y> <blur> <color>",
            note: "e.g., 1px 1px 2px black",
          },
          {
            name: "filter",
            values:
              "none | blur(px) | brightness(num) | contrast(%) | grayscale(%)",
            note: "e.g., blur(5px)",
          },
          {
            name: "backdrop-filter",
            values:
              "none | blur(px) | brightness(num) | contrast(%) | grayscale(%)",
          },
          {
            name: "clip-path",
            values: "none | circle(%) | polygon(...) | url(#id)",
          },
        ],
      },
    ],
  };
