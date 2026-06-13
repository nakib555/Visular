import React, { useState, useRef, useEffect } from "react";
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
import { AlignItemsControl } from "./css-categories/layout-box-model/properties/AlignItemsControl";
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

  const getPropValue = (propName: string): string => {
    if (propName === "display") {
      const groupClass = getActiveGroupClass(selectedElement?.classes || "", "display");
      if (groupClass === "hidden") return "none";
      if (groupClass) return groupClass;
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

    const withoutOld = (selectedElement.classes || "")
      .split(" ")
      .filter((c) => !c.startsWith(`[${propName}:`));
    if (
      val &&
      val !== "none" &&
      val !== "initial" &&
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

    const isShortOptions =
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

    if (propName === "align-items") {
      const activeDirection = selectedElement?.classes?.includes("flex-col") ? "column" : "row";
      return (
        <AlignItemsControl
          key={propIdx}
          value={currentVal}
          onChange={(val) => setPropValue(propName, val)}
          currentDirection={activeDirection}
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
          list.push({
            prop,
            originalSubCategoryName: sub.name,
            specialWidgetName: (prop.name === "perspective" && specialWidgetType === "3d") ? "3d" :
                               (prop.name === "outline-style" && specialWidgetType === "focus") ? "focus" : null,
          });
        }
      });
    });

    // Handle search queries
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      return list.filter((item) => {
        return (
          item.prop.name.toLowerCase().includes(query) ||
          item.prop.values.toLowerCase().includes(query) ||
          (item.prop.note && item.prop.note.toLowerCase().includes(query)) ||
          item.originalSubCategoryName.toLowerCase().includes(query)
        );
      });
    }

    return list;
  }, [inspectorSection, searchQuery]);

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
        className="px-4 py-3 flex items-center gap-1.5 overflow-x-auto scrollbar-hide border-b border-stone-100 flex-shrink-0"
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
            className={`relative px-3.5 py-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shrink-0 text-xs font-semibold ${
              inspectorSection === tab.id
                ? "text-rose-700 bg-rose-50/80 shadow-sm border border-rose-100/50"
                : "text-stone-550 border border-transparent hover:text-stone-800 hover:bg-stone-50"
            }`}
          >
            <tab.icon
              size={13.5}
              className={
                inspectorSection === tab.id ? "text-rose-600" : "text-stone-400"
              }
            />
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Modern Search Filters panel right below the Category Tab list */}
      <div className="px-5 py-3 border-b border-stone-100/80 bg-stone-50/30 flex-shrink-0">
        <div className="relative flex items-center">
          <Search size={14} className="absolute left-3.5 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search CSS properties, attributes, and styles..."
            className="w-full bg-white border border-stone-200 hover:border-stone-300 focus:border-rose-500 rounded-xl pl-9 pr-8 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-500/10 placeholder-stone-400 transition-all font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-stone-400 hover:text-stone-600 font-bold text-xs p-1"
            >
              ×
            </button>
          )}
        </div>
      </div>

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
                  className={`bg-stone-50/40 border border-stone-200/50 rounded-3xl transition-all duration-350 shadow-xs ${
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
                    className={`w-full px-5 py-3.5 flex items-center justify-between font-sans text-xs font-bold tracking-wider uppercase border-b transition-all ${
                      isExpanded
                        ? "bg-rose-50/50 border-stone-200/30 text-rose-800"
                        : "bg-white border-transparent text-stone-600 hover:text-stone-800 hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
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
                  </button>

                  {/* Independent properties rendered directly as flat, first-class elements inside the category */}
                  {isExpanded && (
                    <div className="p-4 flex flex-col gap-4 bg-white border-t border-stone-100/60 transition-all">
                      {activeCategoryData.map((item, idx) => {
                        const PropertyIcon = getIndependentPropertyIcon(item.prop.name);
                        const pName = item.prop.name;
                        const currentVal = getPropValue(pName);

                        // If it's a self-contained card-mode property, we don't wrap it in a secondary card!
                        const isSelfContainedCard = 
                          pName === "align-items" || 
                          pName === "flex-direction" || 
                          pName === "flex-wrap" || 
                          pName === "gap";

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
                                className="h-20 border border-stone-200 bg-stone-900 rounded-lg flex items-center justify-center relative overflow-hidden"
                                style={{ perspective: getPropValue("perspective") || "250px" }}
                              >
                                <div
                                  className="w-12 h-12 rounded-lg border border-pink-400 flex flex-col justify-center items-center text-center text-white bg-gradient-to-tr from-rose-500 to-pink-500 transition-transform duration-300"
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
                              <div className="bg-white border rounded-lg flex items-center justify-center h-12">
                                <button
                                  type="button"
                                  onClick={() => setOutlineFocused(!outlineFocused)}
                                  className={`px-3 py-1 text-[10px] font-bold font-sans rounded-lg transition-all border ${
                                    outlineFocused ? "bg-stone-900 border-stone-850 text-white" : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100/80"
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
                            <div key={idx} className="w-full flex flex-col gap-2">
                              {renderPropertyElement(item.prop, idx)}
                              {specialWidget}
                            </div>
                          );
                        }

                        // Style each property as an elegant, clean, standalone independent card
                        return (
                          <div key={idx} className="bg-stone-50/30 border border-stone-200/85 hover:border-stone-300 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-xs rounded-2xl p-4 flex flex-col gap-3 transition-all duration-200">
                            {/* Card Header displaying property icon, label, notes, and its original subcategory */}
                            <div className="flex items-center justify-between border-b border-stone-100/70 pb-2 mb-1">
                              <div className="flex items-center gap-2">
                                <div className="w-[24px] h-[24px] flex items-center justify-center rounded-lg bg-rose-50/40 border border-rose-100/10 text-rose-500">
                                  <PropertyIcon size={12} className="stroke-[2.25]" />
                                </div>
                                <div className="flex flex-col text-left">
                                  <span className="text-[11.5px] font-bold text-stone-800 font-mono tracking-tight lowercase">
                                    {pName}
                                  </span>
                                  {item.prop.note && (
                                    <span className="text-[8.5px] text-stone-400 font-sans leading-none mt-0.5">
                                      {item.prop.note}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="text-[7.5px] font-mono leading-none tracking-widest uppercase bg-stone-50 border border-stone-150/40 px-1.5 py-0.5 rounded text-stone-400">
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
                          </div>
                        );
                      })}
                    </div>
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
    </div>
  );
}
