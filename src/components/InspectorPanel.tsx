import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 350,
      damping: 26,
    },
  },
} as const;

import {
  Settings,
  Sparkles,
  Palette,
  Maximize,
  Type,
  Layers,
  Play,
  Code,
  HelpCircle,
  Lightbulb,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
  Trash2,
  Copy,
  Grid,
  Compass,
  Cpu,
  Move,
  Wand2,
  Search,
  Check,
  ChevronRight,
  Sliders,
  Anchor,
  MousePointer,
  Route,
  Image,
  List,
  PenTool,
  Columns,
  Scissors,
  ScrollText,
  Pointer,
  Printer,
  Box,
  Layout,
  ZoomIn,
  Eye,
  RotateCcw,
} from "lucide-react";
import { CSSCategory, CSSSubCategory, CSSProperty } from "../types-css";
import { layoutBoxModelCategory } from "./css-categories/layout-box-model";
import { typographyTextCategory } from "./css-categories/typography-text";
import { appearanceAestheticsSvgCategory } from "./css-categories/appearance-aesthetics-svg";
import { motionTransformsCategory } from "./css-categories/motion-transforms";
import { interactivityUiMiscCategory } from "./css-categories/interactivity-ui-misc";
import { environmentMediaArchitectureCategory } from "./css-categories/environment-media-architecture";
import { PropertyControl } from "./PropertyControl";
import { ExpertCSSManualDrawer } from "./ExpertCSSManualDrawer";

export const CSS_HIERARCHY_DATA: CSSCategory[] = [
  layoutBoxModelCategory,
  typographyTextCategory,
  appearanceAestheticsSvgCategory,
  motionTransformsCategory,
  interactivityUiMiscCategory,
  environmentMediaArchitectureCategory,
];
import { DisplayDropdown } from "./css-categories/layout-box-model/properties/DisplayDropdown";
import { FlexDirectionControl } from "./css-categories/layout-box-model/properties/FlexDirectionControl";
import { GapControl } from "./css-categories/layout-box-model/properties/GapControl";
import { FlexWrapControl } from "./css-categories/layout-box-model/properties/FlexWrapControl";
import { FlexGrowControl } from "./css-categories/layout-box-model/properties/FlexGrowControl";
import { FlexShrinkControl } from "./css-categories/layout-box-model/properties/FlexShrinkControl";
import { FlexBasisControl } from "./css-categories/layout-box-model/properties/FlexBasisControl";
import { MarginControl } from "./css-categories/layout-box-model/properties/MarginControl";
import { PaddingControl } from "./css-categories/layout-box-model/properties/PaddingControl";
import { WidthControl } from "./css-categories/layout-box-model/properties/WidthControl";
import { HeightControl } from "./css-categories/layout-box-model/properties/HeightControl";
import { AspectRatioControl } from "./css-categories/layout-box-model/properties/AspectRatioControl";
import { PositionOffsetsControl } from "./css-categories/layout-box-model/properties/PositionOffsetsControl";
import { AlignItemsControl } from "./css-categories/layout-box-model/properties/AlignItemsControl";
import { AlignSelfControl } from "./css-categories/layout-box-model/properties/AlignSelfControl";
import { OrderControl } from "./css-categories/layout-box-model/properties/OrderControl";
import { JustifyContentDropdown } from "./css-categories/layout-box-model/properties/JustifyContentDropdown";
import { GridTemplateColumnsControl } from "./css-categories/layout-box-model/properties/GridTemplateColumnsControl";
import { VisualElement } from "../types";
import { useDesigner } from "../contexts/DesignerContext";
import { HslColorPicker } from "./HslColorPicker";
import {
  setGroupClass,
  getActiveGroupClass,
  setPrefixedClass,
  getPrefixedClass,
  setColorClass,
  STYLE_GROUPS,
} from "../styleUtils";

export type InspectorSection =
  | "layoutBoxModel"
  | "typographyText"
  | "appearanceAestheticsSvg"
  | "motionTransforms"
  | "interactivityUiMisc"
  | "environmentMediaArchitecture";

export interface SegmentedControlProps<T> {
  label: string;
  value: T;
  onChange: (val: T) => void;
  options: {
    value: T;
    label?: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
  }[];
}

export function SegmentedControl<T extends string>({
  label,
  value,
  onChange,
  options,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          {label}
        </label>
      )}
      <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-1 flex w-full gap-1">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex-1 flex items-center justify-center py-2 px-3 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-rose-50/80 border border-rose-200/60 text-rose-600 shadow-sm"
                  : "bg-transparent border border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-100/40"
              }`}
            >
              {Icon ? <Icon size={14} className="stroke-[2.25]" /> : opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const SEGMENTED_FIELDS: Record<
  string,
  { label: string; options: { value: string; label: string }[] }
> = {
  "pointer-events": {
    label: "Pointer Interaction Mode",
    options: [
      { value: "auto", label: "Auto" },
      { value: "none", label: "None" },
    ],
  },
  "user-select": {
    label: "Text Selection Control",
    options: [
      { value: "auto", label: "Auto" },
      { value: "text", label: "Text" },
      { value: "none", label: "None" },
    ],
  },
  resize: {
    label: "Element Resize Handle",
    options: [
      { value: "none", label: "None" },
      { value: "both", label: "Both" },
      { value: "horizontal", label: "Horiz" },
      { value: "vertical", label: "Vert" },
    ],
  },
  "scroll-behavior": {
    label: "Scrolling Interpolation",
    options: [
      { value: "auto", label: "Auto" },
      { value: "smooth", label: "Smooth" },
    ],
  },
  "touch-action": {
    label: "Touch Screen Action Mapping",
    options: [
      { value: "auto", label: "Auto" },
      { value: "manipulation", label: "Interact" },
      { value: "none", label: "None" },
    ],
  },
  "object-fit": {
    label: "Object Auto-Fit Scaling",
    options: [
      { value: "cover", label: "Cover" },
      { value: "contain", label: "Contain" },
      { value: "fill", label: "Fill" },
      { value: "none", label: "None" },
    ],
  },
  "image-rendering": {
    label: "Image Rendering Engine",
    options: [
      { value: "auto", label: "Auto" },
      { value: "crisp-edges", label: "Crisp" },
      { value: "pixelated", label: "Pixelated" },
    ],
  },
};

function getIndependentPropertyIcon(propName: string) {
  const name = propName.toLowerCase();
  if (name === "display") return Grid;
  if (name.includes("flex-direction")) return Move;
  if (name.includes("flex-wrap")) return Wand2;
  if (name.includes("gap")) return Sliders;
  if (name === "width" || name === "height" || name.includes("max-") || name.includes("min-") || name === "aspect-ratio") return Maximize;
  if (name.includes("color") || name.includes("bg-") || name === "background-color" || name === "border" || name === "fill" || name === "stroke") return Palette;
  if (name.includes("font") || name.includes("text") || name === "line-height" || name === "letter-spacing" || name === "word-spacing" || name === "white-space") return Type;
  if (name.includes("margin") || name.includes("padding") || name === "top" || name === "right" || name === "bottom" || name === "left" || name.includes("inset") || name === "position") return Move;
  if (name.includes("transform") || name.includes("perspective") || name.includes("scale") || name.includes("rotate") || name.includes("translate")) return Box;
  if (name.includes("transition") || name.includes("animation") || name.includes("keyframes")) return Play;
  if (name.includes("anchor") || name.includes("align-self") || name.includes("justify-self") || name.includes("order")) return Anchor;
  if (name.includes("scroll") || name.includes("overflow")) return Sliders;
  if (name.includes("outline") || name.includes("shadow") || name.includes("filter") || name.includes("clip") || name.includes("mask")) return Scissors;
  if (name.includes("columns") || name.includes("rows") || name.includes("areas") || name.includes("track")) return Columns;
  if (name.includes("pointer-events") || name.includes("cursor") || name.includes("user-select")) return MousePointer;
  return Settings;
}

interface InspectorPanelProps {
  selectedElement: VisualElement | null;
  inspectorSection: InspectorSection;
  setInspectorSection: (s: InspectorSection) => void;
  updateTree: (
    updater: (item: VisualElement) => Partial<VisualElement>,
  ) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
}

export function InspectorPanel({
  selectedElement,
  inspectorSection,
  setInspectorSection,
  updateTree,
  deleteElement,
  duplicateElement,
}: InspectorPanelProps) {
  const { componentTree } = useDesigner();
  const [searchQuery, setSearchQuery] = useState("");
  const [rotationX, setRotationX] = useState(25); // degrees
  const [rotationY, setRotationY] = useState(-35); // degrees
  const [outlineFocused, setOutlineFocused] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [analyzingProperty, setAnalyzingProperty] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => {
      setCopiedText((curr) => (curr === text ? null : curr));
    }, 1500);
  };

  const parseArbitraryProperty = (
    className: string,
    propName: string,
  ): string => {
    if (!className) return "";
    const match = className.match(
      new RegExp(
        `(?:^|\\s)\\[${propName.replace(/[-\[\]()]/g, "\\\\$&")}:([^\\]]+)\\](?:$|\\s)`,
      ),
    );
    return match ? match[1].replace(/_/g, " ") : "";
  };

  const GAP_PIXELS_TO_SCALE: Record<string, string> = {
    "0px": "gap-0",
    "0": "gap-0",
    "2px": "gap-0.5",
    "4px": "gap-1",
    "6px": "gap-1.5",
    "8px": "gap-2",
    "10px": "gap-2.5",
    "12px": "gap-3",
    "16px": "gap-4",
    "20px": "gap-5",
    "24px": "gap-6",
    "32px": "gap-8",
    "40px": "gap-10",
    "48px": "gap-12",
    "64px": "gap-16",
    "80px": "gap-20",
    "96px": "gap-24"
  };

  const SCALE_TO_GAP_PIXELS: Record<string, string> = {
    "0": "0px",
    "0.5": "2px",
    "1": "4px",
    "1.5": "6px",
    "2": "8px",
    "2.5": "10px",
    "3": "12px",
    "4": "16px",
    "5": "20px",
    "6": "24px",
    "8": "32px",
    "10": "40px",
    "12": "48px",
    "16": "64px",
    "20": "80px",
    "24": "96px"
  };

  const getPropValue = (propName: string): string => {
    if (propName === "display") {
      const groupClass = getActiveGroupClass(selectedElement?.classes || "", "display");
      if (groupClass === "hidden") return "none";
      if (groupClass) return groupClass;
    }
    if (propName === "flex-direction") {
      const groupClass = getActiveGroupClass(selectedElement?.classes || "", "flexDirection");
      if (groupClass) {
        return groupClass === "flex-row" ? "row" :
               groupClass === "flex-row-reverse" ? "row-reverse" :
               groupClass === "flex-col" ? "column" :
               groupClass === "flex-col-reverse" ? "column-reverse" : "";
      }
    }
    if (propName === "flex-wrap") {
      const groupClass = getActiveGroupClass(selectedElement?.classes || "", "flexWrap");
      if (groupClass) {
        return groupClass === "flex-wrap" ? "wrap" :
               groupClass === "flex-wrap-reverse" ? "wrap-reverse" :
               groupClass === "flex-nowrap" ? "nowrap" : "";
      }
    }
    if (propName === "align-items") {
      const groupClass = getActiveGroupClass(selectedElement?.classes || "", "alignment");
      if (groupClass) {
        return groupClass === "items-start" ? "flex-start" :
               groupClass === "items-center" ? "center" :
               groupClass === "items-end" ? "flex-end" :
               groupClass === "items-stretch" ? "stretch" :
               groupClass === "items-baseline" ? "baseline" :
               groupClass === "items-normal" ? "normal" : "";
      }
    }
    if (propName === "justify-content") {
      const groupClass = getActiveGroupClass(selectedElement?.classes || "", "justify");
      if (groupClass) {
        return groupClass === "justify-start" ? "flex-start" :
               groupClass === "justify-center" ? "center" :
               groupClass === "justify-end" ? "flex-end" :
               groupClass === "justify-between" ? "space-between" :
               groupClass === "justify-around" ? "space-around" :
               groupClass === "justify-evenly" ? "space-evenly" :
               groupClass === "justify-stretch" ? "stretch" :
               groupClass === "justify-normal" ? "normal" : "";
      }
    }
    if (propName === "align-content") {
      const groupClass = getActiveGroupClass(selectedElement?.classes || "", "alignContent");
      if (groupClass) {
        return groupClass === "content-center" ? "center" :
               groupClass === "content-start" ? "flex-start" :
               groupClass === "content-end" ? "flex-end" :
               groupClass === "content-between" ? "space-between" :
               groupClass === "content-around" ? "space-around" :
               groupClass === "content-evenly" ? "space-evenly" :
               groupClass === "content-baseline" ? "baseline" :
               groupClass === "content-stretch" ? "stretch" :
               groupClass === "content-normal" ? "normal" : "";
      }
    }
    if (propName === "justify-items") {
      const groupClass = getActiveGroupClass(selectedElement?.classes || "", "justifyItems");
      if (groupClass) {
        return groupClass === "justify-items-start" ? "start" :
               groupClass === "justify-items-end" ? "end" :
               groupClass === "justify-items-center" ? "center" :
               groupClass === "justify-items-stretch" ? "stretch" :
               groupClass === "justify-items-normal" ? "normal" : "";
      }
    }
    if (propName === "align-self") {
      const groupClass = getActiveGroupClass(selectedElement?.classes || "", "alignSelf");
      if (groupClass) {
        return groupClass === "self-auto" ? "auto" :
               groupClass === "self-normal" ? "normal" :
               groupClass === "self-stretch" ? "stretch" :
               groupClass === "self-start" ? "flex-start" :
               groupClass === "self-end" ? "flex-end" :
               groupClass === "self-center" ? "center" :
               groupClass === "self-baseline" ? "baseline" : "";
      }
    }
    if (propName === "justify-self") {
      const groupClass = getActiveGroupClass(selectedElement?.classes || "", "justifySelf");
      if (groupClass) {
        return groupClass === "justify-self-auto" ? "auto" :
               groupClass === "justify-self-normal" ? "normal" :
               groupClass === "justify-self-stretch" ? "stretch" :
               groupClass === "justify-self-start" ? "flex-start" :
               groupClass === "justify-self-end" ? "flex-end" :
               groupClass === "justify-self-center" ? "center" : "";
      }
    }
    if (propName === "flex-grow") {
      const clsString = selectedElement?.classes || "";
      const tokens = clsString.split(/\s+/).filter(Boolean);
      const arbitraryMatch = tokens.find(t => t.startsWith("grow-[") && t.endsWith("]"));
      if (arbitraryMatch) return arbitraryMatch.slice(6, -1);
      if (tokens.includes("grow")) return "1";
      if (tokens.includes("grow-0")) return "0";
    }
    if (propName === "flex-shrink") {
      const clsString = selectedElement?.classes || "";
      const tokens = clsString.split(/\s+/).filter(Boolean);
      const arbitraryMatch = tokens.find(t => t.startsWith("shrink-[") && t.endsWith("]"));
      if (arbitraryMatch) return arbitraryMatch.slice(8, -1);
      if (tokens.includes("shrink")) return "1";
      if (tokens.includes("shrink-0")) return "0";
    }
    if (propName === "flex-basis") {
      const clsString = selectedElement?.classes || "";
      const tokens = clsString.split(/\s+/).filter(Boolean);
      const arbitraryMatch = tokens.find(t => t.startsWith("basis-[") && t.endsWith("]"));
      if (arbitraryMatch) return arbitraryMatch.slice(7, -1);
      const standardMatch = tokens.find(t => t.startsWith("basis-") && !t.startsWith("basis-["));
      if (standardMatch) {
         const basisScale = standardMatch.slice(6);
         if (basisScale === "auto") return "auto";
         if (basisScale === "full") return "100%";
         if (basisScale === "0") return "0%";
         if (basisScale === "1/2") return "50%";
         if (basisScale === "1/3") return "33.333333%";
         if (basisScale === "2/3") return "66.666667%";
         if (basisScale === "1/4") return "25%";
         if (basisScale === "3/4") return "75%";
         return basisScale;
      }
    }
    if (propName === "gap" || propName === "row-gap" || propName === "column-gap") {
      const clsString = selectedElement?.classes || "";
      const tokens = clsString.split(/\s+/).filter(Boolean);
      const prefix = propName === "row-gap" ? "gap-y-" : propName === "column-gap" ? "gap-x-" : "gap-";
      const arbitraryMatch = tokens.find(t => t.startsWith(`${prefix}[`) && t.endsWith("]"));
      if (arbitraryMatch) return arbitraryMatch.slice(prefix.length + 1, -1);
      const standardMatch = tokens.find(t => {
         if (propName === "gap") {
            return t.startsWith("gap-") && !t.startsWith("gap-x-") && !t.startsWith("gap-y-") && !t.startsWith("gap-[");
         } else {
            return t.startsWith(prefix) && !t.startsWith(`${prefix}[`);
         }
      });
      if (standardMatch) {
         const scale = standardMatch.slice(prefix.length);
         if (SCALE_TO_GAP_PIXELS[scale]) return SCALE_TO_GAP_PIXELS[scale];
         const num = parseFloat(scale);
         if (!isNaN(num)) return `${num * 4}px`;
      }
    }

    if (propName.startsWith("padding")) {
      const clsString = selectedElement?.classes || "";
      const tokens = clsString.split(/\s+/).filter(Boolean);
      
      let prefix = "";
      if (propName === "padding") prefix = "p-";
      else if (propName === "padding-top") prefix = "pt-";
      else if (propName === "padding-right") prefix = "pr-";
      else if (propName === "padding-bottom") prefix = "pb-";
      else if (propName === "padding-left") prefix = "pl-";
      else if (propName === "padding-block") prefix = "py-";
      else if (propName === "padding-inline") prefix = "px-";
      else if (propName === "padding-inline-start") prefix = "ps-";
      else if (propName === "padding-inline-end") prefix = "pe-";

      if (prefix) {
        const arbitraryMatch = tokens.find(t => t.startsWith(`${prefix}[`) && t.endsWith("]"));
        if (arbitraryMatch) return arbitraryMatch.slice(prefix.length + 1, -1);

        const standardMatch = tokens.find(t => {
           if (propName === "padding") {
              const isP = t.startsWith("p-");
              const isSpecific = t.startsWith("pt-") || t.startsWith("pr-") || t.startsWith("pb-") || t.startsWith("pl-") || t.startsWith("px-") || t.startsWith("py-") || t.startsWith("ps-") || t.startsWith("pe-");
              return isP && !isSpecific && !t.includes("[");
           } else {
              return t.startsWith(prefix) && !t.includes("[");
           }
        });

        if (standardMatch) {
           const scale = standardMatch.slice(prefix.length);
           if (SCALE_TO_GAP_PIXELS[scale]) return SCALE_TO_GAP_PIXELS[scale];
           const num = parseFloat(scale);
           if (!isNaN(num)) return `${num * 4}px`;
        }
      } else {
        return parseArbitraryProperty(clsString, propName);
      }
    }

    if (propName.startsWith("margin") && !propName.includes("trim")) {
      const clsString = selectedElement?.classes || "";
      const tokens = clsString.split(/\s+/).filter(Boolean);
      
      let prefix = "";
      if (propName === "margin") prefix = "m-";
      else if (propName === "margin-top") prefix = "mt-";
      else if (propName === "margin-right") prefix = "mr-";
      else if (propName === "margin-bottom") prefix = "mb-";
      else if (propName === "margin-left") prefix = "ml-";
      else if (propName === "margin-block") prefix = "my-";
      else if (propName === "margin-inline") prefix = "mx-";
      else if (propName === "margin-inline-start") prefix = "ms-";
      else if (propName === "margin-inline-end") prefix = "me-";

      if (prefix) {
        const arbitraryMatch = tokens.find(t => t.startsWith(`${prefix}[`) && t.endsWith("]"));
        if (arbitraryMatch) return arbitraryMatch.slice(prefix.length + 1, -1);

        const negArbitraryMatch = tokens.find(t => t.startsWith(`-${prefix}[`) && t.endsWith("]"));
        if (negArbitraryMatch) return "-" + negArbitraryMatch.slice(prefix.length + 2, -1);

        const standardMatch = tokens.find(t => {
           if (propName === "margin") {
              const isP = t.startsWith("m-") || t.startsWith("-m-");
              const isSpecific = t.startsWith("mt-") || t.startsWith("mr-") || t.startsWith("mb-") || t.startsWith("ml-") || t.startsWith("mx-") || t.startsWith("my-") || t.startsWith("-mt-") || t.startsWith("-mr-") || t.startsWith("-mb-") || t.startsWith("-ml-") || t.startsWith("-mx-") || t.startsWith("-my-") || t.startsWith("ms-") || t.startsWith("-ms-") || t.startsWith("me-") || t.startsWith("-me-");
              return isP && !isSpecific && !t.includes("[");
           } else {
              return (t.startsWith(prefix) || t.startsWith(`-${prefix}`)) && !t.includes("[");
           }
        });

        if (standardMatch) {
           const isNeg = standardMatch.startsWith("-");
           const scale = standardMatch.slice(isNeg ? prefix.length + 1 : prefix.length);
           if (scale === "auto") return "auto";
           if (SCALE_TO_GAP_PIXELS[scale]) return `${isNeg ? "-" : ""}` + SCALE_TO_GAP_PIXELS[scale];
           const num = parseFloat(scale);
           if (!isNaN(num)) return `${isNeg ? "-" : ""}${num * 4}px`;
        }
      } else {
        // Fallback for margin-block-start, margin-block-end
        return parseArbitraryProperty(clsString, propName);
      }
    }
    return parseArbitraryProperty(
      selectedElement?.classes || "",
      propName,
    );
  };

  const setPropValue = (propName: string, val: string) => {
    if (!selectedElement) return;

    if (propName === "display") {
      const mappedVal = val === "none" ? "hidden" : val;
      // also strip out any arbitrary [display:... ] properties
      const withoutOldArbitrary = (selectedElement.classes || "")
        .split(" ")
        .filter((c) => !c.startsWith(`[display:`))
        .join(" ");

      updateTree((n) => ({
        classes: setGroupClass(withoutOldArbitrary, "display", mappedVal),
      }));
      return;
    }

    if (propName === "flex-direction") {
      const mappedVal = 
        val === "row" ? "flex-row" :
        val === "row-reverse" ? "flex-row-reverse" :
        val === "column" ? "flex-col" :
        val === "column-reverse" ? "flex-col-reverse" : "";
      
      const withoutOldArbitrary = (selectedElement.classes || "")
        .split(" ")
        .filter((c) => !c.startsWith(`[flex-direction:`))
        .join(" ");

      updateTree((n) => ({
        classes: setGroupClass(withoutOldArbitrary, "flexDirection", mappedVal),
      }));
      return;
    }

    if (propName === "flex-wrap") {
      const mappedVal = 
        val === "wrap" ? "flex-wrap" :
        val === "wrap-reverse" ? "flex-wrap-reverse" :
        val === "nowrap" ? "flex-nowrap" : "";
      
      const withoutOldArbitrary = (selectedElement.classes || "")
        .split(" ")
        .filter((c) => !c.startsWith(`[flex-wrap:`))
        .join(" ");

      updateTree((n) => ({
        classes: setGroupClass(withoutOldArbitrary, "flexWrap", mappedVal),
      }));
      return;
    }

    if (propName === "align-items") {
      const mappedVal = 
        val === "flex-start" || val === "start" ? "items-start" :
        val === "center" ? "items-center" :
        val === "flex-end" || val === "end" ? "items-end" :
        val === "stretch" ? "items-stretch" :
        val === "baseline" ? "items-baseline" :
        val === "normal" ? "items-normal" : "";
      
      const withoutOldArbitrary = (selectedElement.classes || "")
        .split(" ")
        .filter((c) => !c.startsWith(`[align-items:`))
        .join(" ");

      updateTree((n) => ({
        classes: setGroupClass(withoutOldArbitrary, "alignment", mappedVal),
      }));
      return;
    }

    if (propName === "justify-content") {
      const mappedVal = 
        val === "flex-start" || val === "start" ? "justify-start" :
        val === "center" ? "justify-center" :
        val === "flex-end" || val === "end" ? "justify-end" :
        val === "space-between" ? "justify-between" :
        val === "space-around" ? "justify-around" :
        val === "space-evenly" ? "justify-evenly" :
        val === "stretch" ? "justify-stretch" :
        val === "normal" ? "justify-normal" : "";
      
      const withoutOldArbitrary = (selectedElement.classes || "")
        .split(" ")
        .filter((c) => !c.startsWith(`[justify-content:`))
        .join(" ");

      updateTree((n) => ({
        classes: setGroupClass(withoutOldArbitrary, "justify", mappedVal),
      }));
      return;
    }

    if (propName === "align-content") {
      const mappedVal = 
        val === "center" ? "content-center" :
        val === "flex-start" || val === "start" ? "content-start" :
        val === "flex-end" || val === "end" ? "content-end" :
        val === "space-between" ? "content-between" :
        val === "space-around" ? "content-around" :
        val === "space-evenly" ? "content-evenly" :
        val === "baseline" ? "content-baseline" :
        val === "stretch" ? "content-stretch" :
        val === "normal" ? "content-normal" : "";
      
      const withoutOldArbitrary = (selectedElement.classes || "")
        .split(" ")
        .filter((c) => !c.startsWith(`[align-content:`))
        .join(" ");

      updateTree((n) => ({
        classes: setGroupClass(withoutOldArbitrary, "alignContent", mappedVal),
      }));
      return;
    }

    if (propName === "justify-items") {
      const mappedVal = 
        val === "start" ? "justify-items-start" :
        val === "end" ? "justify-items-end" :
        val === "center" ? "justify-items-center" :
        val === "stretch" ? "justify-items-stretch" :
        val === "normal" ? "justify-items-normal" : "";
      
      const withoutOldArbitrary = (selectedElement.classes || "")
        .split(" ")
        .filter((c) => !c.startsWith(`[justify-items:`))
        .join(" ");

      updateTree((n) => ({
        classes: setGroupClass(withoutOldArbitrary, "justifyItems", mappedVal),
      }));
      return;
    }

    if (propName === "align-self") {
      const mappedVal = 
        val === "auto" ? "self-auto" :
        val === "normal" ? "self-normal" :
        val === "stretch" ? "self-stretch" :
        val === "flex-start" || val === "start" ? "self-start" :
        val === "flex-end" || val === "end" ? "self-end" :
        val === "center" ? "self-center" :
        val === "baseline" ? "self-baseline" : "";
      
      const withoutOldArbitrary = (selectedElement.classes || "")
        .split(" ")
        .filter((c) => !c.startsWith(`[align-self:`))
        .join(" ");

      updateTree((n) => ({
        classes: setGroupClass(withoutOldArbitrary, "alignSelf", mappedVal),
      }));
      return;
    }

    if (propName === "justify-self") {
      const mappedVal = 
        val === "auto" ? "justify-self-auto" :
        val === "normal" ? "justify-self-normal" :
        val === "stretch" ? "justify-self-stretch" :
        val === "flex-start" || val === "start" ? "justify-self-start" :
        val === "flex-end" || val === "end" ? "justify-self-end" :
        val === "center" ? "justify-self-center" : "";
      
      const withoutOldArbitrary = (selectedElement.classes || "")
        .split(" ")
        .filter((c) => !c.startsWith(`[justify-self:`))
        .join(" ");

      updateTree((n) => ({
        classes: setGroupClass(withoutOldArbitrary, "justifySelf", mappedVal),
      }));
      return;
    }

    if (propName === "flex-grow") {
      const clsString = selectedElement.classes || "";
      const filtered = clsString.split(/\s+/).filter(t => t !== "grow" && t !== "grow-0" && !t.startsWith("grow-[") && !t.startsWith("[flex-grow:"));
      if (val && val !== "") {
        if (val === "1" || val === "1.0") {
          filtered.push("grow");
        } else if (val === "0" || val === "0.0") {
          filtered.push("grow-0");
        } else {
          filtered.push(`grow-[${val}]`);
        }
      }
      updateTree((n) => ({ classes: filtered.join(" ") }));
      return;
    }

    if (propName === "flex-shrink") {
      const clsString = selectedElement.classes || "";
      const filtered = clsString.split(/\s+/).filter(t => t !== "shrink" && t !== "shrink-0" && !t.startsWith("shrink-[") && !t.startsWith("[flex-shrink:"));
      if (val && val !== "") {
        if (val === "1" || val === "1.0") {
          filtered.push("shrink");
        } else if (val === "0" || val === "0.0") {
          filtered.push("shrink-0");
        } else {
          filtered.push(`shrink-[${val}]`);
        }
      }
      updateTree((n) => ({ classes: filtered.join(" ") }));
      return;
    }

    if (propName === "flex-basis") {
      const clsString = selectedElement.classes || "";
      const filtered = clsString.split(/\s+/).filter(t => !t.startsWith("basis-") && !t.startsWith("[flex-basis:"));
      if (val && val !== "") {
        if (val === "auto") {
          filtered.push("basis-auto");
        } else if (val === "100%") {
          filtered.push("basis-full");
        } else if (val === "0%") {
          filtered.push("basis-0");
        } else if (val === "50%") {
          filtered.push("basis-1/2");
        } else if (val === "25%") {
          filtered.push("basis-1/4");
        } else if (val === "75%") {
          filtered.push("basis-3/4");
        } else {
          filtered.push(`basis-[${val}]`);
        }
      }
      updateTree((n) => ({ classes: filtered.join(" ") }));
      return;
    }

    if (propName === "gap" || propName === "row-gap" || propName === "column-gap") {
      const clsString = selectedElement.classes || "";
      const prefix = propName === "row-gap" ? "gap-y-" : propName === "column-gap" ? "gap-x-" : "gap-";
      
      let filtered = clsString.split(/\s+/).filter(token => {
        if (propName === "gap") {
          const isUnifiedGap = token.startsWith("gap-") && !token.startsWith("gap-x-") && !token.startsWith("gap-y-");
          const isArbitraryGap = token.startsWith("[gap:");
          return !isUnifiedGap && !isArbitraryGap;
        } else {
          const isMatch = token.startsWith(prefix);
          const isArbitrary = token.startsWith(`[${propName}:`);
          return !isMatch && !isArbitrary;
        }
      });
      
      if (val && val !== "") {
        const cleanVal = val.trim();
        if (GAP_PIXELS_TO_SCALE[cleanVal]) {
          filtered.push(GAP_PIXELS_TO_SCALE[cleanVal].replace("gap-", prefix));
        } else {
          const parsed = parseFloat(cleanVal);
          if (!isNaN(parsed) && cleanVal.endsWith("px")) {
            const tailwindScale = parsed / 4;
            if (Number.isInteger(tailwindScale) || tailwindScale === 0.5 || tailwindScale === 1.5 || tailwindScale === 2.5) {
              filtered.push(`${prefix}${tailwindScale}`);
            } else {
              filtered.push(`${prefix}[${cleanVal}]`);
            }
          } else {
            filtered.push(`${prefix}[${cleanVal}]`);
          }
        }
      }
      
      updateTree((n) => ({ classes: filtered.join(" ") }));
      return;
    }

    if (propName.startsWith("padding")) {
      const clsString = selectedElement?.classes || "";
      
      let prefix = "";
      if (propName === "padding") prefix = "p-";
      else if (propName === "padding-top") prefix = "pt-";
      else if (propName === "padding-right") prefix = "pr-";
      else if (propName === "padding-bottom") prefix = "pb-";
      else if (propName === "padding-left") prefix = "pl-";
      else if (propName === "padding-block") prefix = "py-";
      else if (propName === "padding-inline") prefix = "px-";
      else if (propName === "padding-inline-start") prefix = "ps-";
      else if (propName === "padding-inline-end") prefix = "pe-";

      let filtered = clsString.split(/\s+/);
      
      if (prefix) {
        filtered = filtered.filter(token => {
          if (propName === "padding") {
            const isUnifiedP = token.startsWith("p-") && !token.startsWith("pt-") && !token.startsWith("pr-") && !token.startsWith("pb-") && !token.startsWith("pl-") && !token.startsWith("px-") && !token.startsWith("py-") && !token.startsWith("ps-") && !token.startsWith("pe-");
            const isArbitrary = token.startsWith("[padding:");
            return !isUnifiedP && !isArbitrary;
          } else {
            const isMatch = token.startsWith(prefix);
            const isArbitrary = token.startsWith(`[${propName}:`);
            return !isMatch && !isArbitrary;
          }
        });

        if (val && val !== "") {
          const cleanVal = val.trim();
          let newClass = "";
          if (GAP_PIXELS_TO_SCALE[cleanVal]) {
            const scale = GAP_PIXELS_TO_SCALE[cleanVal].replace("gap-", "");
            newClass = `${prefix}${scale}`;
          } else {
            const parsed = parseFloat(cleanVal);
            if (!isNaN(parsed) && cleanVal.endsWith("px")) {
              const tailwindScale = parsed / 4;
              if (Number.isInteger(tailwindScale) || tailwindScale === 0.5 || tailwindScale === 1.5 || tailwindScale === 2.5) {
                newClass = `${prefix}${tailwindScale}`;
              } else {
                newClass = `${prefix}[${cleanVal}]`;
              }
            } else {
              newClass = `${prefix}[${cleanVal}]`;
            }
          }
          filtered.push(newClass);
        }
      } else {
        filtered = filtered.filter((c) => !c.startsWith(`[${propName}:`));
        if (val) {
          filtered.push(`[${propName}:${val.replace(/\s+/g, "_")}]`);
        }
      }
      
      updateTree((n) => ({ classes: filtered.join(" ") }));
      return;
    }

    if (propName.startsWith("margin") && !propName.includes("trim")) {
      const clsString = selectedElement?.classes || "";
      
      let prefix = "";
      if (propName === "margin") prefix = "m-";
      else if (propName === "margin-top") prefix = "mt-";
      else if (propName === "margin-right") prefix = "mr-";
      else if (propName === "margin-bottom") prefix = "mb-";
      else if (propName === "margin-left") prefix = "ml-";
      else if (propName === "margin-block") prefix = "my-";
      else if (propName === "margin-inline") prefix = "mx-";
      else if (propName === "margin-inline-start") prefix = "ms-";
      else if (propName === "margin-inline-end") prefix = "me-";

      let filtered = clsString.split(/\s+/);
      
      if (prefix) {
        filtered = filtered.filter(token => {
          if (propName === "margin") {
            const isUnifiedP = (token.startsWith("m-") || token.startsWith("-m-")) && !token.startsWith("mt-") && !token.startsWith("mr-") && !token.startsWith("mb-") && !token.startsWith("ml-") && !token.startsWith("mx-") && !token.startsWith("my-") && !token.startsWith("-mt-") && !token.startsWith("-mr-") && !token.startsWith("-mb-") && !token.startsWith("-ml-") && !token.startsWith("-mx-") && !token.startsWith("-my-") && !token.startsWith("ms-") && !token.startsWith("-ms-") && !token.startsWith("me-") && !token.startsWith("-me-");
            const isArbitrary = token.startsWith("[margin:");
            return !isUnifiedP && !isArbitrary;
          } else {
            const isMatch = token.startsWith(prefix) || token.startsWith(`-${prefix}`);
            const isArbitrary = token.startsWith(`[${propName}:`);
            return !isMatch && !isArbitrary;
          }
        });

        if (val && val !== "") {
          const cleanVal = val.trim();
          const isNeg = cleanVal.startsWith("-");
          const absVal = isNeg ? cleanVal.slice(1) : cleanVal;
          
          let newClass = "";
          if (absVal === "auto") {
            newClass = `${isNeg ? "-" : ""}${prefix}auto`;
          } else if (GAP_PIXELS_TO_SCALE[absVal]) {
            const scale = GAP_PIXELS_TO_SCALE[absVal].replace("gap-", "");
            newClass = `${isNeg ? "-" : ""}${prefix}${scale}`;
          } else {
            const parsed = parseFloat(absVal);
            if (!isNaN(parsed) && absVal.endsWith("px")) {
              const tailwindScale = parsed / 4;
              if (Number.isInteger(tailwindScale) || tailwindScale === 0.5 || tailwindScale === 1.5 || tailwindScale === 2.5) {
                newClass = `${isNeg ? "-" : ""}${prefix}${tailwindScale}`;
              } else {
                newClass = `${isNeg ? "-" : ""}${prefix}[${absVal}]`;
              }
            } else {
              newClass = `${isNeg ? "-" : ""}${prefix}[${absVal}]`;
            }
          }
          filtered.push(newClass);
        }
      } else {
        // Fallback for margin-block-start, margin-block-end (arbitrary only)
        filtered = filtered.filter((c) => !c.startsWith(`[${propName}:`));
        if (val) {
          filtered.push(`[${propName}:${val.replace(/\s+/g, "_")}]`);
        }
      }
      
      updateTree((n) => ({ classes: filtered.join(" ") }));
      return;
    }

    const withoutOld = (selectedElement.classes || "")
      .split(" ")
      .filter((c) => !c.startsWith(`[${propName}:`));
    if (
      val &&
      val !== ""
    ) {
      withoutOld.push(
        `[${propName}:${val.replace(/\s+/g, "_")}]`,
      );
    }
    updateTree((n) => ({ classes: withoutOld.join(" ") }));
  };

  const resetAlignment = () => {
    if (!selectedElement) return;

    const currentClasses = selectedElement.classes || "";
    const tokens = currentClasses.split(/\s+/).filter(Boolean);

    // Filter out:
    // 1. Any Tailwind CSS align-items classes (items-start, items-center, items-end, etc.)
    // 2. Any Tailwind CSS align-self classes (self-auto, self-normal, self-stretch, etc.)
    // 3. Any Tailwind CSS align-content classes (content-normal, content-center, etc.)
    // 4. Any arbitrary properties for align-items, align-self, align-content, or align-tracks (like [align-items:...], [align-self:...], etc.)
    const cleanedTokens = tokens.filter((token) => {
      // Handle responsive prefixes (e.g. md:items-center or max-sm:items-center)
      const cleanToken = token.includes(":") ? token.split(":").pop()! : token;

      // Filter standard Tailwind alignment class groups
      if (STYLE_GROUPS.alignment && STYLE_GROUPS.alignment.includes(cleanToken)) return false;
      if (STYLE_GROUPS.alignSelf && STYLE_GROUPS.alignSelf.includes(cleanToken)) return false;
      if (STYLE_GROUPS.alignContent && STYLE_GROUPS.alignContent.includes(cleanToken)) return false;

      // Filter arbitrary bracketed design variables that define alignment properties
      if (cleanToken.startsWith("[align-items:")) return false;
      if (cleanToken.startsWith("[align-self:")) return false;
      if (cleanToken.startsWith("[align-content:")) return false;
      if (cleanToken.startsWith("[align-tracks:")) return false;

      return true;
    });

    const newClasses = cleanedTokens.join(" ");

    updateTree((n) => ({
      classes: newClasses,
    }));
  };

  const getSliderLimits = (pName: string) => {
    if (pName === "offset-distance")
      return { min: 0, max: 100, step: 1, unit: "%" };
    if (pName === "font-weight")
      return { min: 100, max: 900, step: 100, unit: "" };
    if (pName === "letter-spacing")
      return { min: -4, max: 24, step: 0.5, unit: "px" };
    if (pName === "column-count")
      return { min: 1, max: 12, step: 1, unit: "" };
    if (pName === "column-gap")
      return { min: 0, max: 64, step: 2, unit: "px" };
    if (pName === "perspective")
      return { min: 150, max: 1500, step: 50, unit: "px" };
    if (pName === "opacity")
      return { min: 0, max: 1, step: 0.05, unit: "" };
    return null;
  };

  const renderPropertyElement = (
    prop: any,
    propIdx: number,
  ): any => {
    const propName = prop.name;

    // Split composite inline style properties (e.g., "width / height") into recursively rendered individual style controls
    if (propName.includes("/")) {
      const parts = propName.split("/").map((p: string) => p.trim());
      return (
        <div key={propIdx} className="space-y-3.5 border-l-2 border-rose-200 pl-3 pt-1.5 pb-1 my-1.5 bg-stone-50/40 p-2.5 rounded-xl text-left">
          <div className="text-[9px] font-extrabold text-rose-600/85 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-rose-400" />
            <span>Property Group: {parts.join("  +  ")}</span>
          </div>
          <div className="flex flex-col gap-3">
            {parts.map((part: string, partIdx: number) => {
              const subProp = {
                ...prop,
                name: part,
              };
              return renderPropertyElement(subProp, propIdx * 1000 + partIdx);
            })}
          </div>
        </div>
      );
    }

    const currentVal = getPropValue(propName);

    if (SEGMENTED_FIELDS[propName]) {
      const fieldData = SEGMENTED_FIELDS[propName];
      return (
        <div key={propIdx} className="w-full animate-fade-in">
          <SegmentedControl
            label="" // card header already displays property name
            value={currentVal}
            onChange={(val) => setPropValue(propName, val === "auto" || val === currentVal ? "" : val)}
            options={fieldData.options}
          />
        </div>
      );
    }

    if (propName === "grid-template-columns" || propName === "grid-template-rows") {
      return (
        <div key={propIdx} className="w-full animate-fade-in">
          <GridTemplateColumnsControl
            propName={propName}
            value={currentVal}
            onChange={(val) => setPropValue(propName, val)}
          />
        </div>
      );
    }

    if (propName === "display") {
      return (
        <div key={propIdx} className="w-full animate-fade-in">
          <DisplayDropdown
            value={currentVal}
            onChange={(val) => setPropValue(propName, val)}
          />
        </div>
      );
    }

    if (propName === "flex-direction") {
      return (
        <div key={propIdx} className="w-full animate-fade-in">
          <FlexDirectionControl
            value={currentVal}
            onChange={(val) => setPropValue(propName, val)}
          />
        </div>
      );
    }

    if (propName === "flex-wrap") {
      return (
        <div key={propIdx} className="w-full animate-fade-in">
          <FlexWrapControl
             value={currentVal}
             onChange={(val) => setPropValue(propName, val)}
          />
        </div>
      );
    }

    if (propName === "flex-grow") {
      return (
        <div key={propIdx} className="w-full animate-fade-in">
          <FlexGrowControl
             value={currentVal}
             onChange={(val) => setPropValue(propName, val)}
          />
        </div>
      );
    }

    if (propName === "flex-shrink") {
      return (
        <div key={propIdx} className="w-full animate-fade-in">
          <FlexShrinkControl
             value={currentVal}
             onChange={(val) => setPropValue(propName, val)}
          />
        </div>
      );
    }

    if (propName === "flex-basis") {
      return (
        <div key={propIdx} className="w-full animate-fade-in">
          <FlexBasisControl
             value={currentVal}
             onChange={(val) => setPropValue(propName, val)}
          />
        </div>
      );
    }

    if (propName === "align-self" || propName === "justify-self") {
      return (
        <div key={propIdx} className="w-full animate-fade-in">
          <AlignSelfControl
             propName={propName}
             value={currentVal}
             onChange={(val) => setPropValue(propName, val)}
          />
        </div>
      );
    }

    if (propName === "order") {
      return (
        <div key={propIdx} className="w-full animate-fade-in">
          <OrderControl
             value={currentVal}
             onChange={(val) => setPropValue(propName, val)}
          />
        </div>
      );
    }

    if (propName === "gap") {
      return (
        <div key={propIdx} className="w-full animate-fade-in">
          <GapControl
            value={currentVal}
            onChange={(val) => setPropValue(propName, val)}
            rowGapValue={getPropValue("row-gap")}
            columnGapValue={getPropValue("column-gap")}
            onRowGapChange={(val) => setPropValue("row-gap", val)}
            onColumnGapChange={(val) => setPropValue("column-gap", val)}
          />
        </div>
      );
    }

    if (propName.startsWith("padding")) {
      return (
        <div key={propIdx} className="w-full animate-fade-in relative z-[200]">
          <PaddingControl
            value={getPropValue("padding")}
            onChange={(val) => setPropValue("padding", val)}
            paddingTopValue={getPropValue("padding-top")}
            paddingRightValue={getPropValue("padding-right")}
            paddingBottomValue={getPropValue("padding-bottom")}
            paddingLeftValue={getPropValue("padding-left")}
            paddingBlockValue={getPropValue("padding-block")}
            paddingInlineValue={getPropValue("padding-inline")}
            paddingBlockStartValue={getPropValue("padding-block-start")}
            paddingBlockEndValue={getPropValue("padding-block-end")}
            paddingInlineStartValue={getPropValue("padding-inline-start")}
            paddingInlineEndValue={getPropValue("padding-inline-end")}
            onPaddingTopChange={(val) => setPropValue("padding-top", val)}
            onPaddingRightChange={(val) => setPropValue("padding-right", val)}
            onPaddingBottomChange={(val) => setPropValue("padding-bottom", val)}
            onPaddingLeftChange={(val) => setPropValue("padding-left", val)}
            onPaddingBlockChange={(val) => setPropValue("padding-block", val)}
            onPaddingInlineChange={(val) => setPropValue("padding-inline", val)}
            onPaddingBlockStartChange={(val) => setPropValue("padding-block-start", val)}
            onPaddingBlockEndChange={(val) => setPropValue("padding-block-end", val)}
            onPaddingInlineStartChange={(val) => setPropValue("padding-inline-start", val)}
            onPaddingInlineEndChange={(val) => setPropValue("padding-inline-end", val)}
          />
        </div>
      );
    }

    if (propName.startsWith("margin") && !propName.includes("trim")) {
      return (
        <div key={propIdx} className="w-full animate-fade-in relative z-[200]">
          <MarginControl
            value={getPropValue("margin")}
            onChange={(val) => setPropValue("margin", val)}
            marginTopValue={getPropValue("margin-top")}
            marginRightValue={getPropValue("margin-right")}
            marginBottomValue={getPropValue("margin-bottom")}
            marginLeftValue={getPropValue("margin-left")}
            marginBlockValue={getPropValue("margin-block")}
            marginInlineValue={getPropValue("margin-inline")}
            marginBlockStartValue={getPropValue("margin-block-start")}
            marginBlockEndValue={getPropValue("margin-block-end")}
            marginInlineStartValue={getPropValue("margin-inline-start")}
            marginInlineEndValue={getPropValue("margin-inline-end")}
            onMarginTopChange={(val) => setPropValue("margin-top", val)}
            onMarginRightChange={(val) => setPropValue("margin-right", val)}
            onMarginBottomChange={(val) => setPropValue("margin-bottom", val)}
            onMarginLeftChange={(val) => setPropValue("margin-left", val)}
            onMarginBlockChange={(val) => setPropValue("margin-block", val)}
            onMarginInlineChange={(val) => setPropValue("margin-inline", val)}
            onMarginBlockStartChange={(val) => setPropValue("margin-block-start", val)}
            onMarginBlockEndChange={(val) => setPropValue("margin-block-end", val)}
            onMarginInlineStartChange={(val) => setPropValue("margin-inline-start", val)}
            onMarginInlineEndChange={(val) => setPropValue("margin-inline-end", val)}
          />
        </div>
      );
    }

    if (propName === "aspect-ratio") {
      return (
        <div key={propIdx} className="w-full animate-fade-in relative z-[200]">
          <AspectRatioControl
            value={getPropValue("aspect-ratio")}
            onChange={(val) => setPropValue("aspect-ratio", val)}
          />
        </div>
      );
    }

    if (propName === "position") {
      // Handled inline within the integrated PositionOffsetsControl (rendered by "inset")
      return null;
    }

    if (propName === "inset") {
      return (
        <div key={propIdx} className="w-full animate-fade-in relative z-[200]">
          <PositionOffsetsControl
            value={getPropValue("inset")}
            onChange={(val) => setPropValue("inset", val)}
            topValue={getPropValue("top")}
            rightValue={getPropValue("right")}
            bottomValue={getPropValue("bottom")}
            leftValue={getPropValue("left")}
            onTopChange={(val) => setPropValue("top", val)}
            onRightChange={(val) => setPropValue("right", val)}
            onBottomChange={(val) => setPropValue("bottom", val)}
            onLeftChange={(val) => setPropValue("left", val)}
            positionValue={getPropValue("position")}
            onPositionChange={(val) => setPropValue("position", val)}
          />
        </div>
      );
    }

    const isWidthProperty = 
      propName === "width" || 
      propName === "min-width" || 
      propName === "max-width" || 
      propName === "inline-size" || 
      propName === "min-inline-size" || 
      propName === "max-inline-size";

    const isHeightProperty = 
      propName === "height" || 
      propName === "min-height" || 
      propName === "max-height" || 
      propName === "block-size" || 
      propName === "min-block-size" || 
      propName === "max-block-size";

    if (isWidthProperty) {
      return (
        <div key={propIdx} className="w-full animate-fade-in relative z-[200]">
          <WidthControl
            propName={propName}
            value={getPropValue("width")}
            onChange={(val) => setPropValue("width", val)}
            minWidthValue={getPropValue("min-width")}
            maxWidthValue={getPropValue("max-width")}
            inlineSizeValue={getPropValue("inline-size")}
            minInlineSizeValue={getPropValue("min-inline-size")}
            maxInlineSizeValue={getPropValue("max-inline-size")}
            onMinWidthChange={(val) => setPropValue("min-width", val)}
            onMaxWidthChange={(val) => setPropValue("max-width", val)}
            onInlineSizeChange={(val) => setPropValue("inline-size", val)}
            onMinInlineSizeChange={(val) => setPropValue("min-inline-size", val)}
            onMaxInlineSizeChange={(val) => setPropValue("max-inline-size", val)}
          />
        </div>
      );
    }

    if (isHeightProperty) {
      return (
        <div key={propIdx} className="w-full animate-fade-in relative z-[190]">
          <HeightControl
            propName={propName}
            value={getPropValue("height")}
            onChange={(val) => setPropValue("height", val)}
            minHeightValue={getPropValue("min-height")}
            maxHeightValue={getPropValue("max-height")}
            blockSizeValue={getPropValue("block-size")}
            minBlockSizeValue={getPropValue("min-block-size")}
            maxBlockSizeValue={getPropValue("max-block-size")}
            onMinHeightChange={(val) => setPropValue("min-height", val)}
            onMaxHeightChange={(val) => setPropValue("max-height", val)}
            onBlockSizeChange={(val) => setPropValue("block-size", val)}
            onMinBlockSizeChange={(val) => setPropValue("min-block-size", val)}
            onMaxBlockSizeChange={(val) => setPropValue("max-block-size", val)}
          />
        </div>
      );
    }

    const isColor =
      propName.includes("color") ||
      propName === "fill" ||
      propName === "stroke";
    const sliderConf = getSliderLimits(propName);

    if (isColor) {
      return (
        <div
          key={propIdx}
          className="flex flex-col gap-1.5 w-full text-left"
        >
          <HslColorPicker
            propName={propName}
            value={currentVal}
            onChange={(val) => setPropValue(propName, val)}
            rootComponentTree={componentTree}
          />
        </div>
      );
    }

    if (sliderConf) {
      const numVal =
        parseFloat(currentVal) || (sliderConf.min + sliderConf.max) / 2;
      return (
        <div key={propIdx} className="flex flex-col gap-1.5 w-full text-left">
          <div className="flex items-center gap-3 p-3 bg-white border border-stone-200/90 rounded-2xl shadow-xs">
            <input
              type="range"
              min={sliderConf.min}
              max={sliderConf.max}
              step={sliderConf.step}
              value={numVal}
              onChange={(e) => {
                const suffix = sliderConf.unit;
                setPropValue(propName, `${e.target.value}${suffix}`);
              }}
              className="flex-1 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <input
              type="text"
              value={currentVal}
              onChange={(e) => setPropValue(propName, e.target.value)}
              placeholder="e.g. 10px"
              className="w-[72px] bg-stone-50 border border-stone-200/80 rounded-xl px-2 py-0.5 text-center text-[10px] focus:outline-none focus:border-rose-500 font-mono text-stone-850"
            />
          </div>
        </div>
      );
    }

    const options = prop.values
      .split("|")
      .map((v: string) => v.trim())
      .filter(Boolean);
    const uniqueOptions = options.filter(
      (v: any, i: number, a: any) => a.indexOf(v) === i,
    );

    const isComplex = uniqueOptions.some((opt: string) => opt.includes("<") && opt.includes(">")) || uniqueOptions.some((opt: string) => opt.length > 30);

    const isShortOptions =
      !isComplex &&
      uniqueOptions.length <= 4 &&
      uniqueOptions.every((o: string) => o.length <= 15);

    if (isShortOptions && uniqueOptions.length > 1) {
      return (
        <div key={propIdx} className="flex flex-col gap-1.5 w-full text-left">
          <div className="bg-stone-50/70 p-1 border border-stone-200/80 rounded-2xl flex gap-1 w-full overflow-hidden shrink-0">
            {uniqueOptions.map((opt: any) => {
              const isSelected = currentVal === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPropValue(propName, opt)}
                  className={`flex-1 text-center py-1.5 rounded-xl text-[9px] font-sans font-bold transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-white text-stone-900 border border-stone-200/50 shadow-sm"
                      : "text-stone-450 hover:text-stone-700 font-medium"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (propName === "justify-content" || propName === "align-content") {
      return (
        <div key={propIdx} className="w-full animate-fade-in">
          <JustifyContentDropdown
            propName={propName}
            value={currentVal}
            onChange={(val) => setPropValue(propName, val)}
          />
        </div>
      );
    }

    if (propName === "align-items" || propName === "justify-items") {
      const activeDirection = selectedElement?.classes?.includes("flex-col") ? "column" : "row";
      return (
        <AlignItemsControl
          key={propIdx}
          propName={propName}
          value={currentVal}
          onChange={(val) => setPropValue(propName, val)}
          currentDirection={activeDirection}
        />
      );
    }

    if (isComplex) {
      return (
        <PropertyControl
          key={propIdx}
          type="text"
          placeholder={prop.note ? prop.note : "e.g. auto, 10px, 100%..."}
          value={currentVal}
          onChange={(val) => setPropValue(propName, val)}
        />
      );
    }

    return (
      <PropertyControl
        key={propIdx}
        options={[
          { value: "", label: "Auto / Default" },
          ...uniqueOptions.map((opt: string) => ({ value: opt, label: opt })),
        ]}
        value={currentVal}
        onChange={(val) => setPropValue(propName, val)}
      />
    );
  };

  // Expanded status for Accordion categories - only the active panel open by default
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => ({
    layoutBoxModel: inspectorSection === "layoutBoxModel",
    typographyText: inspectorSection === "typographyText",
    appearanceAestheticsSvg: inspectorSection === "appearanceAestheticsSvg",
    motionTransforms: inspectorSection === "motionTransforms",
    interactivityUiMisc: inspectorSection === "interactivityUiMisc",
    environmentMediaArchitecture: inspectorSection === "environmentMediaArchitecture",
  }));

  // Synchronize expandedCategories state when parent's active inspectorSection prop changes
  useEffect(() => {
    setExpandedCategories({
      layoutBoxModel: inspectorSection === "layoutBoxModel",
      typographyText: inspectorSection === "typographyText",
      appearanceAestheticsSvg: inspectorSection === "appearanceAestheticsSvg",
      motionTransforms: inspectorSection === "motionTransforms",
      interactivityUiMisc: inspectorSection === "interactivityUiMisc",
      environmentMediaArchitecture: inspectorSection === "environmentMediaArchitecture",
    });
  }, [inspectorSection]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToCategory = (catId: string) => {
    // Automatically expand the selected section and collapse all other sections
    setExpandedCategories({
      layoutBoxModel: catId === "layoutBoxModel",
      typographyText: catId === "typographyText",
      appearanceAestheticsSvg: catId === "appearanceAestheticsSvg",
      motionTransforms: catId === "motionTransforms",
      interactivityUiMisc: catId === "interactivityUiMisc",
      environmentMediaArchitecture: catId === "environmentMediaArchitecture",
    });
    setInspectorSection(catId as InspectorSection);

    // Reset scroll back to the top of the container
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "auto",
      });
    }
  };

  const categoryConfigs = [
    { id: "layoutBoxModel", label: "Layout & Box Model", icon: Maximize, name: "Layout & Box Model" },
    { id: "typographyText", label: "Typography & Text", icon: Type, name: "Typography & Text" },
    { id: "appearanceAestheticsSvg", label: "Appearance, Aesthetics & SVG", icon: Palette, name: "Appearance, Aesthetics & SVG" },
    { id: "motionTransforms", label: "Motion & Transforms", icon: Play, name: "Motion & Transforms" },
    { id: "interactivityUiMisc", label: "Interactivity, UI & Miscellaneous", icon: MousePointer, name: "Interactivity, UI & Miscellaneous" },
    { id: "environmentMediaArchitecture", label: "Environment, Media & Architecture", icon: Compass, name: "Environment, Media & Architecture" },
  ];

  const activeCategoryData = React.useMemo(() => {
    const cfg = categoryConfigs.find(c => c.id === inspectorSection);
    if (!cfg) return [];

    const activeCategory = CSS_HIERARCHY_DATA.find((c) => c.name === cfg.name);
    if (!activeCategory) return [];

    const list: {
      prop: CSSProperty;
      originalSubCategoryName: string;
      specialWidgetName: "svg" | "scrollbar" | "3d" | "focus" | null;
    }[] = [];

    activeCategory.subCategories.forEach((sub) => {
      const subNameLower = sub.name.toLowerCase();
      let specialWidgetType: "svg" | "scrollbar" | "3d" | "focus" | null = null;
      if (subNameLower.includes("svg") || subNameLower.includes("vector")) specialWidgetType = "svg";
      else if (subNameLower.includes("scrollbar")) specialWidgetType = "scrollbar";
      else if (subNameLower.includes("3d") || subNameLower.includes("perspective")) specialWidgetType = "3d";
      else if (subNameLower.includes("focus") || subNameLower.includes("outline")) specialWidgetType = "focus";

      sub.properties.forEach((prop) => {
        // Splitting composite properties with slash to make them fully independent CSS properties
        if (prop.name.includes("/")) {
          const parts = prop.name.split("/").map((p) => p.trim());
          parts.forEach((part) => {
            // Unify all width sub-properties (min-width, max-width, inline-size, min-inline-size, max-inline-size) 
            // under "width" in the pill list. This makes "width" an all-in-one control.
            if (
              part === "min-width" ||
              part === "max-width" ||
              part === "inline-size" ||
              part === "min-inline-size" ||
              part === "max-inline-size"
            ) {
              return;
            }
            // Unify all physical coordinates sub-properties (right, bottom, left) under "top"
            if (
              part === "right" ||
              part === "bottom" ||
              part === "left"
            ) {
              return;
            }
            list.push({
              prop: {
                ...prop,
                name: part,
              },
              originalSubCategoryName: sub.name,
              // Only associate special widget with a specific lead property to avoid duplication
              specialWidgetName: (part === "fill" && specialWidgetType === "svg") ? "svg" :
                                 (part === "scrollbar-color" && specialWidgetType === "scrollbar") ? "scrollbar" :
                                 (part === "perspective" && specialWidgetType === "3d") ? "3d" :
                                 (part === "outline-width" && specialWidgetType === "focus") ? "focus" : null,
            });
          });
        } else {
          // If a standalone property is one of the other width variations, hide it (to consolidate under "width")
          if (
            prop.name === "min-width" ||
            prop.name === "max-width" ||
            prop.name === "inline-size" ||
            prop.name === "min-inline-size" ||
            prop.name === "max-inline-size"
          ) {
            return;
          }
          list.push({
            prop,
            originalSubCategoryName: sub.name,
            specialWidgetName: (prop.name === "perspective" && specialWidgetType === "3d") ? "3d" :
                               (prop.name === "outline-style" && specialWidgetType === "focus") ? "focus" : null,
          });
        }
      });
    });

    // Handle search queries and deduplicate by property name
    const filteredList = searchQuery
      ? list.filter((item) => {
          const query = searchQuery.toLowerCase().trim();
          return (
            item.prop.name.toLowerCase().includes(query) ||
            (item.prop.name === "width" && (
              "min-width".includes(query) ||
              "max-width".includes(query) ||
              "inline-size".includes(query) ||
              "min-inline-size".includes(query) ||
              "max-inline-size".includes(query)
            )) ||
            (item.prop.name === "inset" && (
              "top".includes(query) ||
              "right".includes(query) ||
              "bottom".includes(query) ||
              "left".includes(query) ||
              "coordinates".includes(query) ||
              "offsets".includes(query) ||
              "position-offsets".includes(query)
            )) ||
            item.prop.values.toLowerCase().includes(query) ||
            (item.prop.note && item.prop.note.toLowerCase().includes(query)) ||
            item.originalSubCategoryName.toLowerCase().includes(query)
          );
        })
      : list;

    const seen = new Set<string>();
    return filteredList.filter((item) => {
      if (seen.has(item.prop.name)) {
        return false;
      }
      seen.add(item.prop.name);
      return true;
    });
  }, [inspectorSection, searchQuery]);

  const activePropName = React.useMemo(() => {
    if (activeCategoryData.length === 0) return null;
    if (selectedProperty && activeCategoryData.some(item => item.prop.name === selectedProperty)) {
      return selectedProperty;
    }
    return activeCategoryData[0].prop.name;
  }, [selectedProperty, activeCategoryData]);

  if (!selectedElement)
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-stone-400 p-8 text-center bg-stone-50/30 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-stone-200/60 flex items-center justify-center mb-4 text-stone-300">
          <Settings size={24} />
        </div>
        <p className="text-sm font-semibold text-stone-600">
          No Element Selected
        </p>
        <p className="text-xs text-stone-400 mt-1 max-w-[200px]">
          Click any element on the canvas to inspect and edit its properties.
        </p>
      </div>
    );

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-white select-none">
      {/* Horizontally Scrollable Categories Tab List */}
      <div
        role="tablist"
        className="px-4 py-3 flex items-center gap-1.5 overflow-x-auto scrollbar-hide border-b border-stone-100 flex-shrink-0 snap-x snap-mandatory scroll-smooth"
        onWheel={(e) => {
          if (e.deltaY !== 0 && e.deltaX === 0) {
            e.currentTarget.scrollLeft += e.deltaY;
          }
        }}
      >
        {categoryConfigs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={inspectorSection === tab.id}
            onClick={() => scrollToCategory(tab.id)}
            className={`relative px-4 py-2.5 sm:py-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer shrink-0 text-xs font-semibold snap-start ${
              inspectorSection === tab.id
                ? "text-rose-700 bg-rose-50/80 shadow-xs border border-rose-100/50 scale-[1.02]"
                : "text-stone-550 border border-transparent hover:text-stone-850 hover:bg-stone-50 active:scale-[0.98]"
            } min-h-[38px] sm:min-h-0`}
          >
            <tab.icon
              size={14}
              className={
                inspectorSection === tab.id ? "text-rose-600" : "text-stone-400"
              }
            />
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Modern Search Filters panel right below the Category Tab list */}
      <div className="px-5 py-3.5 sm:py-3 border-b border-stone-100/80 bg-stone-50/30 flex-shrink-0">
        <div className="relative flex items-center">
          <Search size={14} className="absolute left-3.5 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search CSS properties, attributes, and styles..."
            className="w-full bg-white border border-stone-200 hover:border-stone-300 focus:border-rose-500 rounded-xl pl-9 pr-8 py-2.5 sm:py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-500/10 placeholder-stone-400 transition-all font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 text-stone-450 hover:text-stone-750 font-bold text-base p-1"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Horizontal pill list of category properties */}
      {activeCategoryData.length > 0 && (
        <div
          className="px-5 py-3 sm:py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-hide border-b flex-shrink-0 bg-stone-50/15 snap-x snap-mandatory scroll-smooth"
          style={{ borderColor: "#f5f5f5" }}
          onWheel={(e) => {
            if (e.deltaY !== 0 && e.deltaX === 0) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
        >
          {activeCategoryData.map((item) => {
            const pName = item.prop.name;
            const isSelected = activePropName === pName;
            const currentVal = getPropValue(pName);
            const hasVal = currentVal && currentVal !== "" && currentVal !== "initial" && currentVal !== "unset" && currentVal !== "normal" && currentVal !== "none" && currentVal !== "auto";
            
            return (
              <button
                key={pName}
                type="button"
                onClick={() => setSelectedProperty(pName)}
                className={`relative px-4 py-2 sm:py-1.5 rounded-full flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer shrink-0 text-[10.5px] font-bold snap-start ${
                  isSelected
                    ? "text-rose-700 bg-rose-50/90 border border-rose-250/90 shadow-md scale-[1.01]"
                    : "text-stone-550 border border-stone-200/75 hover:text-stone-850 hover:bg-stone-50 bg-white hover:shadow-2xs active:scale-[0.97]"
                } min-h-[34px] sm:min-h-0`}
              >
                {hasVal && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 animate-pulse" />
                )}
                <span className="font-mono whitespace-nowrap lowercase">{pName}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Properties Content Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-5 flex flex-col gap-6 custom-scrollbar"
      >
        {activeCategoryData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-stone-400 text-center bg-stone-50/20 rounded-2xl border border-dashed border-stone-200">
            <Search size={24} className="text-stone-300 mb-2" />
            <p className="text-xs font-bold text-stone-600">No CSS Property Matches Found</p>
            <p className="text-[10px] text-stone-400 mt-1 max-w-[200px]">None of the categories contain a property matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-in fade-in duration-350">
            {(() => {
              const catConfig = categoryConfigs.find((c) => c.id === inspectorSection);
              if (!catConfig) return null;

              const catId = catConfig.id;
              const isExpanded = expandedCategories[catId] ?? true;

              return (
                <div
                  key={catId}
                  id={`category-sec-${catId}`}
                  className={`transition-all duration-350 ${
                    isExpanded ? "overflow-visible" : "overflow-hidden"
                  }`}
                >
                  {/* Category Header (collapsible toggle) */}
                  <button
                    type="button"
                    onClick={() => {
                      const nextExpandedState = !isExpanded;
                      setExpandedCategories({
                        layoutBoxModel: catId === "layoutBoxModel" ? nextExpandedState : false,
                        typographyText: catId === "typographyText" ? nextExpandedState : false,
                        appearanceAestheticsSvg: catId === "appearanceAestheticsSvg" ? nextExpandedState : false,
                        motionTransforms: catId === "motionTransforms" ? nextExpandedState : false,
                        interactivityUiMisc: catId === "interactivityUiMisc" ? nextExpandedState : false,
                        environmentMediaArchitecture: catId === "environmentMediaArchitecture" ? nextExpandedState : false,
                      });
                      if (nextExpandedState) {
                        setInspectorSection(catId as InspectorSection);
                      }
                    }}
                    className={`w-full py-3.5 flex flex-col gap-1 items-start justify-center font-sans transition-all ${
                      isExpanded
                        ? "text-rose-800"
                        : "text-stone-600 hover:text-stone-800"
                    }`}
                  >
                    {/* Header Group */}
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-xs font-bold tracking-wider uppercase">
                      <catConfig.icon
                        size={14}
                        className={isExpanded ? "text-rose-600" : "text-stone-400"}
                      />
                      <span>{catConfig.label}</span>
                      <span className="text-[9.5px] font-mono font-medium text-stone-400 normal-case bg-stone-100/60 border border-stone-200/40 px-1.5 py-0.5 rounded-full ml-1 bg-white">
                        {activeCategoryData.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-center w-5 h-5 rounded-lg border border-stone-200/40 bg-white shadow-xs text-stone-500 hover:text-rose-600 hover:border-rose-100">
                      <ChevronRight
                        size={12.5}
                        className={`transform transition-transform duration-200 ${
                          isExpanded ? "rotate-90 text-rose-500 font-bold" : ""
                        }`}
                      />
                    </div>
                    </div>
                  </button>

                  {/* Independent properties rendered directly as flat, first-class elements inside the category */}
                  {isExpanded && (
                    <motion.div
                      key={`${selectedElement?.id || ""}-${activePropName || ""}`}
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-col gap-4 mt-1 pb-4"
                    >
                      {activeCategoryData.filter(item => item.prop.name === activePropName).map((item, idx) => {
                        const PropertyIcon = getIndependentPropertyIcon(item.prop.name);
                        const pName = item.prop.name;
                        const currentVal = getPropValue(pName);

                        // If it's a self-contained card-mode property, we don't wrap it in a secondary card!
                        const isSelfContainedCard = 
                          pName.startsWith("padding") ||
                          (pName.startsWith("margin") && !pName.includes("trim")) ||
                          pName === "aspect-ratio" ||
                          pName === "top" ||
                          pName === "width" ||
                          pName === "min-width" ||
                          pName === "max-width" ||
                          pName === "inline-size" ||
                          pName === "min-inline-size" ||
                          pName === "max-inline-size" ||
                          pName === "align-items" || 
                          pName === "align-self" ||
                          pName === "justify-content" ||
                          pName === "align-content" ||
                          pName === "justify-items" ||
                          pName === "justify-self" ||
                          pName === "order" ||
                          pName === "display" ||
                          pName === "flex-direction" || 
                          pName === "flex-wrap" || 
                          pName === "gap" ||
                          pName === "flex-grow" ||
                          pName === "flex-shrink" ||
                          pName === "flex-basis" ||
                          pName === "grid-template-columns" ||
                          pName === "grid-template-rows";

                        // Build matching interactive simulator widgets
                        let specialWidget = null;
                        if (item.specialWidgetName === "svg") {
                          specialWidget = (
                            <div className="bg-gradient-to-br from-teal-50/50 to-emerald-50/15 border border-teal-200/40 rounded-xl p-3.5 space-y-2.5 my-1.5">
                              <div className="flex items-center gap-1.5 text-[9.5px] uppercase font-bold tracking-wider text-teal-700 font-mono">
                                <PenTool size={11} className="text-teal-500" />
                                <span>Vector SVG Laboratory</span>
                              </div>
                              <div className="h-20 bg-white border border-stone-200/50 rounded-xl flex items-center justify-center p-2 relative overflow-hidden">
                                <svg viewBox="0 0 100 100" className="w-12 h-12">
                                  <polygon
                                    points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36"
                                    fill={getPropValue("fill") || "#14b8a6"}
                                    stroke={getPropValue("stroke") || "none"}
                                    strokeWidth={getPropValue("stroke-width") ? parseInt(getPropValue("stroke-width")) || 2 : 2}
                                    strokeDasharray={getPropValue("stroke-dasharray") || ""}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-all duration-300"
                                  />
                                  <circle cx="50" cy="51" r="12" fill="white" />
                                </svg>
                              </div>
                            </div>
                          );
                        } else if (item.specialWidgetName === "scrollbar") {
                          specialWidget = (
                            <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/15 border border-indigo-200/40 rounded-xl p-3.5 space-y-2 my-1.5">
                              <div className="flex items-center gap-1.5 text-[9.5px] uppercase font-bold tracking-wider text-indigo-700 font-mono">
                                <Sliders size={11} className="text-indigo-500" />
                                <span>Interactive Scroll Track</span>
                              </div>
                              <div
                                className="h-20 border border-stone-200 bg-stone-50 overflow-y-scroll rounded-lg p-2 text-[9px] leading-relaxed text-stone-600"
                                style={{
                                  scrollbarColor: getPropValue("scrollbar-color") || "auto",
                                  scrollbarWidth: (getPropValue("scrollbar-width") || "auto") as any,
                                }}
                              >
                                <p className="font-bold text-stone-700 mb-0.5">Custom Scroll Preview</p>
                                <p>Customize track color or width parameters below to style the panel scrollbar.</p>
                              </div>
                            </div>
                          );
                        } else if (item.specialWidgetName === "3d") {
                          specialWidget = (
                            <div className="bg-gradient-to-br from-pink-50/50 to-rose-50/15 border border-pink-200/40 rounded-xl p-3.5 space-y-2.5 my-1.5">
                              <div className="flex justify-between items-center text-[9.5px] uppercase font-bold tracking-wider text-pink-700 font-mono">
                                <div className="flex items-center gap-1.5">
                                  <Box size={11} className="text-pink-500" />
                                  <span>3D Perspective Extruder</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-[8.5px] font-bold font-mono text-stone-500">
                                <div className="space-y-0.5">
                                  <span>Angle X: {rotationX}°</span>
                                  <input
                                    type="range"
                                    min="-75"
                                    max="75"
                                    value={rotationX}
                                    onChange={(e) => setRotationX(Number(e.target.value))}
                                    className="w-full h-1 bg-stone-200 rounded-lg cursor-pointer accent-pink-600"
                                  />
                                </div>
                                <div className="space-y-0.5">
                                  <span>Angle Y: {rotationY}°</span>
                                  <input
                                    type="range"
                                    min="-75"
                                    max="75"
                                    value={rotationY}
                                    onChange={(e) => setRotationY(Number(e.target.value))}
                                    className="w-full h-1 bg-stone-200 rounded-lg cursor-pointer accent-pink-600"
                                  />
                                </div>
                              </div>
                              <div
                                className="h-20 border border-stone-200/80 bg-stone-100/70 rounded-lg flex items-center justify-center relative overflow-hidden"
                                style={{ perspective: getPropValue("perspective") || "250px" }}
                              >
                                {/* Radar grids backdrop */}
                                <div className="absolute inset-0 opacity-[0.3] pointer-events-none bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:10px_10px]" />
                                <div
                                  className="w-12 h-12 rounded-lg border border-pink-400/50 flex flex-col justify-center items-center text-center text-white bg-gradient-to-tr from-rose-500 to-pink-500 transition-transform duration-300 shadow-sm z-10"
                                  style={{
                                    transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
                                  }}
                                >
                                  <span className="font-mono text-[6px] font-extrabold uppercase tracking-widest text-pink-100">3D Face</span>
                                </div>
                              </div>
                            </div>
                          );
                        } else if (item.specialWidgetName === "focus") {
                          specialWidget = (
                            <div className="bg-gradient-to-br from-blue-55/65 to-sky-50/15 border border-blue-200/50 rounded-xl p-3.5 space-y-2 my-1.5">
                              <div className="flex items-center gap-1.5 text-[9.5px] uppercase font-bold tracking-wider text-blue-700 font-mono">
                                <MousePointer size={11} className="text-blue-500" />
                                <span>Reactive Outline Simulation</span>
                              </div>
                              <div className="bg-white border border-stone-200 rounded-lg flex items-center justify-center h-12">
                                <button
                                  type="button"
                                  onClick={() => setOutlineFocused(!outlineFocused)}
                                  className={`px-3 py-1 text-[10px] font-bold font-sans rounded-lg transition-all border ${
                                    outlineFocused ? "bg-indigo-600 border-indigo-700 text-white shadow-3xs" : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100/80"
                                  }`}
                                  style={{
                                    outline: outlineFocused
                                      ? `${getPropValue("outline-width") || "3px"} ${getPropValue("outline-style") || "solid"} ${getPropValue("outline-color") || "#3b82f6"}`
                                      : "none",
                                    outlineOffset: outlineFocused ? getPropValue("outline-offset") || "2px" : "0px",
                                  }}
                                >
                                  {outlineFocused ? "Focused Out" : "Click to view Outline"}
                                </button>
                              </div>
                            </div>
                          );
                        }

                        if (isSelfContainedCard) {
                          return (
                            <motion.div key={pName} variants={itemVariants} className="w-full flex flex-col gap-2">
                              {renderPropertyElement(item.prop, idx)}
                              {specialWidget}
                            </motion.div>
                          );
                        }

                        // Style each property as an elegant, clean, flat standalone section
                        return (
                          <motion.div key={pName} variants={itemVariants} className="w-full flex flex-col gap-3.5 py-2">
                            {/* Flat Header displaying property icon, label, notes, and its original subcategory */}
                            <div className="flex items-center justify-between border-b border-stone-100/75 pb-2 mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-rose-500 flex items-center justify-center">
                                  <PropertyIcon size={13} className="stroke-[2.5]" />
                                </span>
                                <div className="flex flex-col text-left">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[11.5px] font-black text-stone-850 font-mono tracking-tight lowercase">
                                      {pName}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setAnalyzingProperty(pName)}
                                      title={`Open ${pName} Expert Study Manual`}
                                      className="text-amber-500 hover:text-amber-600 hover:bg-stone-100 p-0.5 rounded cursor-pointer transition-colors"
                                    >
                                      <Lightbulb size={11.5} className="stroke-[2.5]" />
                                    </button>
                                  </div>
                                  {item.prop.note && (
                                    <span className="text-[8.5px] text-stone-400 font-sans leading-none mt-1">
                                      {item.prop.note}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="text-[7.5px] font-mono leading-none tracking-widest uppercase bg-stone-100/60 px-1.5 py-0.5 rounded text-stone-400 font-bold">
                                {item.originalSubCategoryName}
                              </span>
                            </div>

                            {/* Property control itself */}
                            <div className="w-full">
                              {renderPropertyElement(item.prop, idx)}
                            </div>

                            {/* Interactive play widgets */}
                            {specialWidget}

                            {/* Reset trigger for this standalone property */}
                            {currentVal && (
                              <div className="flex justify-end pt-1 border-t border-stone-100/40">
                                <button
                                  type="button"
                                  onClick={() => setPropValue(pName, "")}
                                  className="text-[8.5px] font-mono font-bold text-stone-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer py-0.5 px-2 rounded-lg hover:bg-rose-50/60 transition-all border border-stone-100/60 bg-white"
                                >
                                  <RotateCcw size={9} className="stroke-[2]" />
                                  <span>Reset {pName}</span>
                                </button>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Global Delete and Duplicate Action Bar stuck to bottom */}
      <div className="border-t border-stone-100 p-4 shrink-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] flex items-center gap-2.5 bg-stone-50/30">
        <button
          onClick={() => {
            if (selectedElement) duplicateElement(selectedElement.id);
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 bg-stone-100 hover:bg-stone-200 hover:text-stone-900 text-stone-700 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm border border-stone-200/30 cursor-pointer animate-none"
        >
          <Copy size={13.5} />
          <span>Duplicate</span>
        </button>

        <button
          onClick={() => {
            if (selectedElement) deleteElement(selectedElement.id);
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-sm border border-red-100/30 cursor-pointer"
        >
          <Trash2 size={13.5} />
          <span>Delete Element</span>
        </button>
      </div>

      <ExpertCSSManualDrawer
        propertyName={analyzingProperty}
        onClose={() => setAnalyzingProperty(null)}
      />
    </div>
  );
}
