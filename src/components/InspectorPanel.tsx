import React, { useState } from "react";
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
} from "lucide-react";
import { CSS_HIERARCHY_DATA } from "./css-categories";
import { SpacingSection } from "./css-categories/SpacingSection";
import { SizingSection } from "./css-categories/SizingSection";
import { PositionSection } from "./css-categories/PositionSection";
import { LayoutSection } from "./css-categories/LayoutSection";
import { TypographySection } from "./css-categories/TypographySection";
import { VisualsSection } from "./css-categories/VisualsSection";
import { MotionSection } from "./css-categories/MotionSection";
import { AnimationSection } from "./css-categories/AnimationSection";
import { AnimationsSection } from "./css-categories/AnimationsSection";
import { ViewTransitionsSection } from "./css-categories/ViewTransitionsSection";
import { InteractivitySection } from "./css-categories/InteractivitySection";
import { MediaSection } from "./css-categories/MediaSection";
import { CoreSection } from "./css-categories/CoreSection";
import { HelpSection } from "./css-categories/HelpSection";

import { CSSCategory, CSSSubCategory, CSSProperty } from "../types-css";
import { PropertyControl } from "./PropertyControl";
import { VisualElement } from "../types";
import {
  setGroupClass,
  getActiveGroupClass,
  setPrefixedClass,
  getPrefixedClass,
  setColorClass,
} from "../styleUtils";

export type InspectorSection =
  | "layout"
  | "spacing"
  | "sizing"
  | "position"
  | "typography"
  | "visuals"
  | "motion"
  | "animation"
  | "interactivity"
  | "media"
  | "containerQueries"
  | "listsTables"
  | "svgGraphics"
  | "writingModes"
  | "multiColumn"
  | "scrollbars"
  | "masking"
  | "animations"
  | "touchGestures"
  | "viewTransitions"
  | "printSystem"
  | "advTypography"
  | "3dRendering"
  | "varFonts"
  | "popupsDialogs"
  | "outlines"
  | "generatedContent"
  | "stackingIsolation"
  | "globalValues"
  | "anchorPositioning"
  | "formAutoSizing"
  | "textBoxTrim"
  | "scrollStateQueries"
  | "readingFlow"
  | "subgridLayout"
  | "core"
  | "help";



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
  const [searchQuery, setSearchQuery] = useState("");
  const [containerMockWidth, setContainerMockWidth] = useState(85); // %
  const [rotationX, setRotationX] = useState(25); // degrees
  const [rotationY, setRotationY] = useState(-35); // degrees
  const [scaleFactor, setScaleFactor] = useState(1);
  const [popupVisible, setPopupVisible] = useState(false);
  const [outlineFocused, setOutlineFocused] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    LAYOUT: true,
    SPACING: true,
    SIZING: true,
    POSITION: true,
    "TYPOGRAPHY & TEXT": true,
    "APPEARANCE & VISUALS": true,
    "MOVEMENT & ANIMATION": true,
    "MODERN FORM & INTERACTION STYLING": true,
    "MEDIA & OBJECTS": true,
    "CONTAINER QUERIES & CONTAINMENT": true,
    "LISTS & TABLES": true,
    "SVG & VECTOR GRAPHICS": true,
    "WRITING MODES & FLOW DIRECTION": true,
    "MULTI-COLUMN & LAYOUT BREAKS": true,
    "SCROLLBARS & OVERFLOW BEHAVIOR": true,
    "CSS MASKING & CLIPPING": true,
    "MOTION PATHS": true,
    "TOUCH & GESTURE INTERACTIONS": true,
    "VIEW TRANSITIONS": true,
    "PRINT & SYSTEM ADJUSTMENT": true,
    "ADVANCED TYPOGRAPHY": true,
    "3D RENDERING & PERSPECTIVE": true,
    "VARIABLE FONTS & TYPOGRAPHIC FEATURES": true,
    "POPUPS, DIALOGS & DISCRETE ANIMATIONS": true,
    "FOCUS & INTERACTION OUTLINES": true,
    "GENERATED CONTENT & COUNTERS": true,
    "GRAPHICS & STACKING ISOLATION": true,
    "GLOBAL VALUES & RESETS": true,
    "ADVANCED ANCHOR POSITIONING & ALIGNMENT": true,
    "MODERN FORM AUTO-SIZING & DECORATION": true,
    "NEXT-GEN TEXT-BOX TRIM & LEADING": true,
    "SCROLL-STATE CONTAINER QUERIES": true,
    "ACCESSIBILITY & READING FLOW CONTROL": true,
    "ADVANCED GRID SUBGRID LAYOUT": true,
  });
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => {
      setCopiedText((curr) => (curr === text ? null : curr));
    }, 1500);
  };

  const filteredHierarchy = CSS_HIERARCHY_DATA.map((category) => {
    const matchingSubCategories = category.subCategories
      .map((subCat) => {
        const matchingProperties = subCat.properties.filter((prop) => {
          const query = searchQuery.toLowerCase();
          return (
            prop.name.toLowerCase().includes(query) ||
            prop.values.toLowerCase().includes(query) ||
            (prop.note && prop.note.toLowerCase().includes(query))
          );
        });
        return { ...subCat, properties: matchingProperties };
      })
      .filter((subCat) => subCat.properties.length > 0);

    return { ...category, subCategories: matchingSubCategories };
  }).filter((category) => category.subCategories.length > 0);

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
        {[
          { id: "layout", label: "Layout", icon: Maximize },
          { id: "spacing", label: "Spacing", icon: Move },
          { id: "sizing", label: "Sizing", icon: Sliders },
          { id: "position", label: "Position", icon: Compass },
          { id: "typography", label: "Typography & Text", icon: Type },
          { id: "visuals", label: "Appearance & Styles", icon: Palette },
          { id: "motion", label: "Effects & Filters", icon: Play },
          { id: "animation", label: "Movement & Animation", icon: Wand2 },
          { id: "interactivity", label: "Modern Form & Interaction Styling", icon: MousePointer },
          { id: "media", label: "Media & Objects", icon: Image },
          { id: "containerQueries", label: "Container Queries & Containment", icon: ZoomIn },
          { id: "listsTables", label: "Lists & Tables", icon: List },
          { id: "svgGraphics", label: "SVG & Vector Graphics", icon: PenTool },
          { id: "writingModes", label: "Writing Modes & Flow Direction", icon: AlignLeft },
          { id: "multiColumn", label: "Multi-Column & Layout Breaks", icon: Columns },
          { id: "scrollbars", label: "Scrollbars & Overflow Behavior", icon: Sliders },
          { id: "masking", label: "CSS Masking & Clipping", icon: Scissors },
          { id: "animations", label: "Motion Paths", icon: Route },
          { id: "touchGestures", label: "Touch & Gesture Interactions", icon: Pointer },
          { id: "viewTransitions", label: "View Transitions", icon: Layers },
          { id: "printSystem", label: "Print & System Adjustment", icon: Printer },
          { id: "advTypography", label: "Advanced Typography", icon: Type },
          { id: "3dRendering", label: "3D Rendering & Perspective", icon: Box },
          { id: "varFonts", label: "Variable Fonts & Typographic Features", icon: Type },
          { id: "popupsDialogs", label: "Popups, Dialogs & Discrete Animations", icon: Layers },
          { id: "outlines", label: "Focus & Interaction Outlines", icon: MousePointer },
          { id: "generatedContent", label: "Generated Content & Counters", icon: List },
          { id: "stackingIsolation", label: "Graphics & Stacking Isolation", icon: Palette },
          { id: "globalValues", label: "Global Values & Resets", icon: Settings },
          { id: "anchorPositioning", label: "Advanced Anchor Positioning", icon: Anchor },
          { id: "formAutoSizing", label: "Modern Form Auto-Sizing", icon: Layout },
          { id: "textBoxTrim", label: "Next-Gen Text-Box Trim", icon: Type },
          { id: "scrollStateQueries", label: "Scroll-State Container Queries", icon: ZoomIn },
          { id: "readingFlow", label: "Accessibility & Reading Flow", icon: Eye },
          { id: "subgridLayout", label: "Advanced Grid Subgrid Layout", icon: Grid },
          { id: "core", label: "Content & Code", icon: Sparkles },
          { id: "help", label: "CSS Guide", icon: HelpCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={inspectorSection === tab.id}
            onClick={() => setInspectorSection(tab.id as InspectorSection)}
            className={`relative px-3.5 py-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shrink-0 text-xs font-semibold ${
              inspectorSection === tab.id
                ? "text-rose-700 bg-rose-50/80 shadow-sm border border-rose-100/50"
                : "text-stone-500 border border-transparent hover:text-stone-800 hover:bg-stone-50"
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

      {/* Main Properties Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 flex flex-col gap-6 custom-scrollbar">
        {/* ==================== 1. SPACING ==================== */}
        {inspectorSection === "spacing" && (
          <SpacingSection
            selectedElement={selectedElement}
            updateTree={updateTree}
            handleCopy={handleCopy}
            copiedText={copiedText}
          />
        )}

        {/* ==================== 1.5 SIZING ==================== */}
        {inspectorSection === "sizing" && (
          <SizingSection
            selectedElement={selectedElement}
            updateTree={updateTree}
            handleCopy={handleCopy}
            copiedText={copiedText}
          />
        )}

        {/* ==================== 1.25 POSITION ==================== */}
        {inspectorSection === "position" && (
          <PositionSection
            selectedElement={selectedElement}
            updateTree={updateTree}
            handleCopy={handleCopy}
            copiedText={copiedText}
          />
        )}

        {/* ==================== 1. LAYOUT ==================== */}
        {inspectorSection === "layout" && (
          <LayoutSection
            selectedElement={selectedElement}
            updateTree={updateTree}
            handleCopy={handleCopy}
            copiedText={copiedText}
          />
        )}

        {/* ==================== 2. TYPOGRAPHY & TEXT ==================== */}
        {inspectorSection === "typography" && (
          <TypographySection
            selectedElement={selectedElement}
            updateTree={updateTree}
            handleCopy={handleCopy}
            copiedText={copiedText}
          />
        )}
        {/* ==================== 3. APPEARANCE & VISUALS ==================== */}
        {inspectorSection === "visuals" && (
          <VisualsSection
            selectedElement={selectedElement}
            updateTree={updateTree}
            handleCopy={handleCopy}
            copiedText={copiedText}
          />
        )}
        {/* ==================== 4. EFFECTS & FILTERS ==================== */}
        {inspectorSection === "motion" && (
          <MotionSection
            selectedElement={selectedElement}
            updateTree={updateTree}
            handleCopy={handleCopy}
            copiedText={copiedText}
          />
        )}

        {/* ==================== MOVEMENT & ANIMATION ==================== */}
        {inspectorSection === "animation" && (
          <AnimationSection
            selectedElement={selectedElement}
            updateTree={updateTree}
            handleCopy={handleCopy}
            copiedText={copiedText} containerMockWidth={containerMockWidth} setContainerMockWidth={setContainerMockWidth} rotationX={rotationX} setRotationX={setRotationX} rotationY={rotationY} setRotationY={setRotationY} scaleFactor={scaleFactor} setScaleFactor={setScaleFactor} popupVisible={popupVisible} setPopupVisible={setPopupVisible} outlineFocused={outlineFocused} setOutlineFocused={setOutlineFocused}
          />
        )}

        {/* ==================== ANIMATIONS (MOTION PATHS) ==================== */}
        {inspectorSection === "animations" && (
          <AnimationsSection
            selectedElement={selectedElement}
            updateTree={updateTree}
            handleCopy={handleCopy}
            copiedText={copiedText}
          />
        )}

        {/* ==================== VIEW TRANSITIONS ==================== */}
        {inspectorSection === "viewTransitions" && (
          <ViewTransitionsSection
            selectedElement={selectedElement}
            updateTree={updateTree}
            handleCopy={handleCopy}
            copiedText={copiedText}
          />
        )}

        {/* ==================== INTERACTIVITY & SCROLLING ==================== */}
        {inspectorSection === "interactivity" && (
          <InteractivitySection
            selectedElement={selectedElement}
            updateTree={updateTree}
            handleCopy={handleCopy}
            copiedText={copiedText}
          />
        )}

        {/* ==================== MEDIA & OBJECTS ==================== */}
        {inspectorSection === "media" && (
          <MediaSection
            selectedElement={selectedElement}
            updateTree={updateTree}
            handleCopy={handleCopy}
            copiedText={copiedText}
          />
        )}

        {/* ==================== 5. CORE DETAILS & CUSTOM CODE ==================== */}
        {inspectorSection === "core" && (
          <CoreSection
            selectedElement={selectedElement}
            updateTree={updateTree}
            handleCopy={handleCopy}
            copiedText={copiedText}
          />
        )}

        {/* ==================== DYNAMIC TABS FOR OTHER CSS HIERARCHY CATEGORIES ==================== */}
        {[
          { id: "containerQueries", label: "Container Queries & Containment", category: "CONTAINER QUERIES & CONTAINMENT", icon: ZoomIn },
          { id: "listsTables", label: "Lists & Tables", category: "LISTS & TABLES", icon: List },
          { id: "svgGraphics", label: "SVG & Vector Graphics", category: "SVG & VECTOR GRAPHICS", icon: PenTool },
          { id: "writingModes", label: "Writing Modes & Flow Direction", category: "WRITING MODES & FLOW DIRECTION", icon: AlignLeft },
          { id: "multiColumn", label: "Multi-Column & Layout Breaks", category: "MULTI-COLUMN & LAYOUT BREAKS", icon: Columns },
          { id: "scrollbars", label: "Scrollbars & Overflow Behavior", category: "SCROLLBARS & OVERFLOW BEHAVIOR", icon: Sliders },
          { id: "masking", label: "CSS Masking & Clipping", category: "CSS MASKING & CLIPPING", icon: Scissors },
          { id: "touchGestures", label: "Touch & Gesture Interactions", category: "TOUCH & GESTURE INTERACTIONS", icon: Pointer },
          { id: "printSystem", label: "Print & System Adjustment", category: "PRINT & SYSTEM ADJUSTMENT", icon: Printer },
          { id: "advTypography", label: "Advanced Typography", category: "ADVANCED TYPOGRAPHY", icon: Type },
          { id: "3dRendering", label: "3D Rendering & Perspective", category: "3D RENDERING & PERSPECTIVE", icon: Box },
          { id: "varFonts", label: "Variable Fonts & Typographic Features", category: "VARIABLE FONTS & TYPOGRAPHIC FEATURES", icon: Type },
          { id: "popupsDialogs", label: "Popups, Dialogs & Discrete Animations", category: "POPUPS, DIALOGS & DISCRETE ANIMATIONS", icon: Layers },
          { id: "outlines", label: "Focus & Interaction Outlines", category: "FOCUS & INTERACTION OUTLINES", icon: MousePointer },
          { id: "generatedContent", label: "Generated Content & Counters", category: "GENERATED CONTENT & COUNTERS", icon: List },
          { id: "stackingIsolation", label: "Graphics & Stacking Isolation", category: "GRAPHICS & STACKING ISOLATION", icon: Palette },
          { id: "globalValues", label: "Global Values & Resets", category: "GLOBAL VALUES & RESETS", icon: Settings },
          { id: "anchorPositioning", label: "Advanced Anchor Positioning & Alignment", category: "ADVANCED ANCHOR POSITIONING & ALIGNMENT", icon: Anchor },
          { id: "formAutoSizing", label: "Modern Form Auto-Sizing & Decoration", category: "MODERN FORM AUTO-SIZING & DECORATION", icon: Layout },
          { id: "textBoxTrim", label: "Next-Gen Text-Box Trim & Leading", category: "NEXT-GEN TEXT-BOX TRIM & LEADING", icon: Type },
          { id: "scrollStateQueries", label: "Scroll-State Container Queries", category: "SCROLL-STATE CONTAINER QUERIES", icon: ZoomIn },
          { id: "readingFlow", label: "Accessibility & Reading Flow", category: "ACCESSIBILITY & READING FLOW CONTROL", icon: Eye },
          { id: "subgridLayout", label: "Advanced Grid Subgrid Layout", category: "ADVANCED GRID SUBGRID LAYOUT", icon: Grid },
        ].map(dynamicSection => {
           if (inspectorSection === dynamicSection.id) {
              const hierarchyData = CSS_HIERARCHY_DATA.find((c) => c.name === dynamicSection.category);
              if (!hierarchyData) return null;
              return (
                 <div key={dynamicSection.id} className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
                    {/* Header Block */}
                    <div className="flex items-center gap-2 mb-1">
                      <dynamicSection.icon size={15} className="text-rose-600" />
                      <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">{dynamicSection.label}</span>
                    </div>

                    {(() => {
                        const parseArbitraryProperty = (className: string, propName: string): string => {
                            if (!className) return "";
                            const match = className.match(new RegExp(`(?:^|\\s)\\[${propName.replace(/[-\[\]()]/g, "\\\\$&")}:([^\\]]+)\\](?:$|\\s)`));
                            return match ? match[1].replace(/_/g, " ") : "";
                        };

                        const getPropValue = (propName: string): string => {
                            return parseArbitraryProperty(selectedElement.classes || "", propName);
                        };

                        const setPropValue = (propName: string, val: string) => {
                            const withoutOld = (selectedElement.classes || "").split(" ").filter((c) => !c.startsWith(`[${propName}:`));
                            if (val && val !== "none" && val !== "initial" && val !== "") {
                                withoutOld.push(`[${propName}:${val.replace(/\\s+/g, "_")}]`);
                            }
                            updateTree((n) => ({ classes: withoutOld.join(" ") }));
                        };

                        // Helper: determine slider configurations
                        const getSliderLimits = (pName: string) => {
                          if (pName === "offset-distance") return { min: 0, max: 100, step: 1, unit: "%" };
                          if (pName === "stroke-width" || pName === "outline-width" || pName === "column-rule-width" || pName === "column-width") return { min: 0, max: 24, step: 1, unit: "px" };
                          if (pName === "outline-offset" || pName === "scrollbar-gutter") return { min: -12, max: 24, step: 1, unit: "px" };
                          if (pName === "font-weight") return { min: 100, max: 900, step: 100, unit: "" };
                          if (pName === "letter-spacing") return { min: -4, max: 24, step: 0.5, unit: "px" };
                          if (pName === "column-count") return { min: 1, max: 12, step: 1, unit: "" };
                          if (pName === "column-gap") return { min: 0, max: 64, step: 2, unit: "px" };
                          if (pName === "perspective") return { min: 150, max: 1500, step: 50, unit: "px" };
                          if (pName === "opacity") return { min: 0, max: 1, step: 0.05, unit: "" };
                          return null;
                        };

                        const renderPropertyElement = (prop: any, propIdx: number) => {
                          const propName = prop.name;
                          const currentVal = getPropValue(propName);
                          const isColor = propName.includes("color") || propName === "fill" || propName === "stroke";
                          const sliderConf = getSliderLimits(propName);

                          // 1. Color Swatch + Text combo
                          if (isColor) {
                            const swatches = [
                              { color: "transparent", bg: "bg-white border-2 border-dashed border-stone-300" },
                              { color: "currentColor", bg: "bg-stone-500 border" },
                              { color: "#000000", bg: "bg-black" },
                              { color: "#ffffff", bg: "bg-white border border-stone-250" },
                              { color: "#f43f5e", bg: "bg-rose-500" },
                              { color: "#f59e0b", bg: "bg-amber-500" },
                              { color: "#10b981", bg: "bg-emerald-500" },
                              { color: "#0ea5e9", bg: "bg-sky-500" },
                              { color: "#6366f1", bg: "bg-indigo-500" },
                              { color: "#8b5cf6", bg: "bg-violet-500" }
                            ];

                            return (
                              <div key={propIdx} className="flex flex-col gap-1.5 w-full">
                                <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono flex justify-between">
                                  <span>{propName}</span>
                                  <span className="text-[10px] font-mono font-bold text-stone-400 select-all normal-case">{currentVal || "default"}</span>
                                </label>
                                <div className="flex flex-col gap-2 p-3 bg-white border border-stone-200/90 rounded-2xl shadow-xs">
                                  {/* Presets Grid */}
                                  <div className="flex flex-wrap gap-1.5">
                                    {swatches.map((sw, swIdx) => {
                                      const isSelected = currentVal === sw.color;
                                      return (
                                        <button
                                          key={swIdx}
                                          type="button"
                                          onClick={() => setPropValue(propName, sw.color)}
                                          className={`w-[19px] h-[19px] rounded-full transition-all cursor-pointer ${sw.bg} ${
                                            isSelected ? "ring-2 ring-rose-500 ring-offset-2 scale-110" : "hover:scale-105 active:scale-95"
                                          }`}
                                          title={sw.color}
                                        />
                                      );
                                    })}
                                  </div>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      value={currentVal}
                                      onChange={(e) => setPropValue(propName, e.target.value)}
                                      placeholder="HEX, RGB, or Keyword color"
                                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-3 pr-10 py-1.5 text-xs text-stone-700 outline-none focus:bg-white focus:border-rose-450 focus:ring-4 focus:ring-rose-500/10 font-mono"
                                    />
                                    {currentVal && (
                                      <button
                                        type="button"
                                        onClick={() => setPropValue(propName, "")}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase text-stone-400 hover:text-stone-700 bg-stone-150 rounded px-1.5 py-0.5"
                                      >
                                        reset
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          // 2. Fine-Tuning Slider Controls
                          if (sliderConf) {
                            let parsedNum = sliderConf.min;
                            if (currentVal) {
                              const parsedFloat = parseFloat(currentVal);
                              if (!isNaN(parsedFloat)) {
                                parsedNum = parsedFloat;
                              }
                            }
                            const currentNumValue = Math.max(sliderConf.min, Math.min(sliderConf.max, parsedNum));

                            return (
                              <div key={propIdx} className="flex flex-col gap-1.5 w-full">
                                <div className="flex justify-between items-center pl-1">
                                  <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider font-mono">
                                    {propName}
                                  </label>
                                  <span className="text-[10px] bg-stone-100 text-stone-700 font-bold px-1.5 py-0.5 rounded font-mono">
                                    {currentVal || "default"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 bg-white border border-stone-200/90 rounded-2xl p-2.5 shadow-xs">
                                  <input
                                    type="range"
                                    min={sliderConf.min}
                                    max={sliderConf.max}
                                    step={sliderConf.step}
                                    value={currentNumValue}
                                    onChange={(e) => {
                                      const valNum = e.target.value;
                                      const completedVal = sliderConf.unit ? `${valNum}${sliderConf.unit}` : valNum;
                                      setPropValue(propName, completedVal);
                                    }}
                                    className="flex-1 accent-rose-600 h-1 bg-stone-150 rounded-lg cursor-pointer"
                                  />
                                  <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl overflow-hidden shrink-0">
                                    <input
                                      type="text"
                                      value={currentVal}
                                      onChange={(e) => setPropValue(propName, e.target.value)}
                                      placeholder="Auto"
                                      className="w-16 text-center bg-transparent py-1.5 text-xs text-stone-700 font-semibold font-mono outline-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          // 3. Segmented Pills for 2 to 5 Options
                          const options = prop.values.split("|").map(v => v.replace(/<[^>]+>/g, "").trim()).filter(Boolean).map(v => ({ value: v, label: v }));
                          const uniqueOptions = options.filter((v, i, a) => a.findIndex(t => (t.value === v.value)) === i);

                          if (uniqueOptions.length > 0 && uniqueOptions.length <= 5) {
                            return (
                              <div key={propIdx} className="flex flex-col gap-1.5 w-full">
                                <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono">
                                  {propName}
                                </label>
                                <div className="flex flex-wrap gap-1 p-1 bg-stone-100/70 border border-stone-200/50 rounded-xl select-none">
                                  <button
                                    type="button"
                                    onClick={() => setPropValue(propName, "")}
                                    className={`flex-1 text-center py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                      !currentVal
                                        ? "bg-white text-stone-800 shadow-xs border border-stone-200"
                                        : "text-stone-500 hover:text-stone-850 hover:bg-white/40"
                                    }`}
                                  >
                                    default
                                  </button>
                                  {uniqueOptions.map((opt) => {
                                    const isSelected = currentVal === opt.value;
                                    return (
                                      <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setPropValue(propName, opt.value)}
                                        className={`flex-grow text-center py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer truncate ${
                                          isSelected
                                            ? "bg-white text-rose-700 shadow-xs border border-rose-200"
                                            : "text-stone-500 hover:text-stone-850 hover:bg-white/40"
                                        }`}
                                      >
                                        {opt.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          }

                          // 4. Fallback: Select Menu
                          return (
                            <PropertyControl
                               key={propIdx}
                               label={propName}
                               options={[ { value: "", label: "Auto / Default"}, ...uniqueOptions ]}
                               value={currentVal}
                               onChange={(val) => setPropValue(propName, val)}
                            />
                          );
                        };

                        return (
                           <div className="flex flex-col gap-5">
                              {/* ================= SIMULATION DESK PLAYGROUNDS ================= */}
                              {dynamicSection.id === "containerQueries" && (
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50/25 border border-amber-200/60 rounded-2xl p-4 space-y-3.5 shadow-inner">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-amber-700 font-mono">
                                      <ZoomIn size={12} className="text-amber-600 animate-pulse" />
                                      <span>Container Query Sandbox</span>
                                    </div>
                                    <span className="text-[8px] bg-amber-500 text-white font-extrabold px-1.5 py-0.5 rounded-md font-mono uppercase">
                                      Interactive
                                    </span>
                                  </div>
                                  
                                  <p className="text-[10px] text-stone-600 leading-relaxed font-sans">
                                    Adjust width slider below. Children components automatically collapse and scale based on container parameters.
                                  </p>

                                  <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-[9px] text-stone-550 font-bold font-mono">
                                      <span>Mock Parent Width: {containerMockWidth}%</span>
                                      <span className={containerMockWidth >= 60 ? "text-emerald-600" : "text-amber-750"}>
                                        {containerMockWidth >= 60 ? "Wide Column Layout" : "Mobile Narrow View"}
                                      </span>
                                    </div>
                                    <input
                                      type="range"
                                      min="25"
                                      max="100"
                                      value={containerMockWidth}
                                      onChange={(e) => setContainerMockWidth(Number(e.target.value))}
                                      className="w-full h-1 accent-amber-600 bg-stone-200 rounded-lg cursor-pointer"
                                    />
                                  </div>

                                  <div className="border border-stone-250/50 rounded-2xl overflow-hidden bg-white shadow-xs transition-all duration-300 mx-auto p-3" style={{ width: `${containerMockWidth}%` }}>
                                    <div className={`transition-all duration-300 flex ${containerMockWidth >= 60 ? "flex-row gap-3 items-center" : "flex-col gap-2"}`}>
                                      <div className={`rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 shrink-0 shadow-sm ${containerMockWidth >= 60 ? "w-12 h-12" : "w-full h-8"}`} />
                                      <div className="flex-1 min-w-0 space-y-1.5">
                                        <div className="h-2.5 bg-stone-250 rounded-sm w-3/4" />
                                        <div className="h-2 bg-stone-150 rounded-sm w-1/2" />
                                      </div>
                                    </div>
                                  </div>

                                  {getPropValue("container-type") ? (
                                    <div className="p-2 py-1.5 text-[9px] rounded-xl bg-emerald-50 border border-emerald-100/70 text-emerald-800 font-mono">
                                      🟢 container-type is set to: {getPropValue("container-type")}
                                    </div>
                                  ) : (
                                    <div className="p-2 py-1.5 text-[9px] rounded-xl bg-amber-50 border border-amber-100 color-amber-900 text-stone-600 font-medium font-sans">
                                      ⚠️ Container type unregistered. Register inline-size above to enable responsive container queries.
                                    </div>
                                  )}
                                </div>
                              )}

                              {dynamicSection.id === "svgGraphics" && (
                                <div className="bg-gradient-to-br from-teal-50 to-emerald-50/25 border border-teal-200/60 rounded-2xl p-4 space-y-3 shadow-inner text-left">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-teal-700 font-mono">
                                      <PenTool size={11} className="text-teal-600 animate-spin" style={{ animationDuration: '20s' }} />
                                      <span>Vector SVG Laboratory</span>
                                    </div>
                                    <span className="text-[8px] bg-teal-600 text-white font-extrabold px-1.5 py-0.5 rounded-md font-mono uppercase">
                                      live render
                                    </span>
                                  </div>

                                  {/* Canvas display displaying SVG cog spinning */}
                                  <div className="h-24 bg-white border border-stone-200/60 rounded-xl flex items-center justify-center p-3 relative overflow-hidden select-none">
                                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:12px_12px] opacity-35 pointer-events-none" />
                                    <svg viewBox="0 0 100 100" className="w-16 h-16 animate-spin duration-1000" style={{ animationDuration: '12s' }}>
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
                                      <circle cx="50" cy="51" r="7" fill="#f0fdfa" stroke={getPropValue("stroke") || "#0d9488"} strokeWidth="1" />
                                    </svg>
                                  </div>
                                </div>
                              )}

                              {dynamicSection.id === "scrollbars" && (
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50/20 border border-indigo-200/60 rounded-2xl p-4 space-y-3 shadow-inner text-left">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-indigo-700 font-mono">
                                      <Sliders size={11} className="text-indigo-650" />
                                      <span>Interactive Scroll Track</span>
                                    </div>
                                    <span className="text-[8px] bg-indigo-600 text-white font-extrabold px-1.5 py-0.5 rounded-md font-mono uppercase">
                                      track lab
                                    </span>
                                  </div>

                                  {(() => {
                                    const sbColor = getPropValue("scrollbar-color") || "auto animate";
                                    const sbWidth = getPropValue("scrollbar-width") || "auto";
                                    return (
                                      <div 
                                        className="h-24 border border-stone-200/70 bg-stone-50 overflow-y-scroll rounded-xl p-3 text-[10px] leading-relaxed text-stone-600 shadow-inner"
                                        style={{
                                          scrollbarColor: sbColor,
                                          scrollbarWidth: sbWidth as any,
                                        }}
                                      >
                                        <h5 className="font-bold text-stone-800 text-[10px] leading-tight mb-1">Scroll track test layout</h5>
                                        <p className="mb-2">Line 1: Log streaming started.</p>
                                        <p className="mb-2">Line 2: Tracking properties color={sbColor} width={sbWidth}</p>
                                        <p className="mb-2">Line 3: Scroll up or down inside this view window to view scrollbar customization.</p>
                                        <p className="mb-2">Line 4: End trace log context.</p>
                                      </div>
                                    );
                                  })()}
                                </div>
                              )}

                              {dynamicSection.id === "multiColumn" && (
                                <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50/20 border border-violet-250/60 rounded-2xl p-4 space-y-3 shadow-inner text-left">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-violet-700 font-mono">
                                      <Columns size={11} className="text-violet-600" />
                                      <span>Editorial Layout Columns</span>
                                    </div>
                                    <span className="text-[8px] bg-violet-600 text-white font-extrabold px-1.5 py-0.5 rounded-md font-mono uppercase">
                                      editorial
                                    </span>
                                  </div>

                                  {(() => {
                                    const colCount = getPropValue("column-count") || "auto";
                                    const colGap = getPropValue("column-gap") || "normal";
                                    const colRuleStyle = getPropValue("column-rule-style") || "none";
                                    const colRuleWidth = getPropValue("column-rule-width") || "1px";
                                    const colRuleColor = getPropValue("column-rule-color") || "#ddd";

                                    return (
                                      <div 
                                        className="bg-white border rounded-xl p-3 text-[9.5px] leading-relaxed text-stone-600 shadow-xs max-h-32 overflow-hidden"
                                        style={{
                                          columnCount: colCount === "auto" ? 2 : parseInt(colCount) || 2,
                                          columnGap: colGap,
                                          columnRule: `${colRuleWidth} ${colRuleStyle} ${colRuleColor}`,
                                        }}
                                      >
                                        <h4 className="font-bold text-stone-900 text-[10px] uppercase tracking-wider mb-1 mt-0">visual press column preview</h4>
                                        CSS Multi-Columns allows elegant flow separation standard. Column rule divider style handles gaps in flow gracefully. Adjust variables below to layout columns dynamically.
                                      </div>
                                    );
                                  })()}
                                </div>
                              )}

                              {dynamicSection.id === "3dRendering" && (
                                <div className="bg-gradient-to-br from-pink-50 to-rose-50/20 border border-pink-250/60 rounded-2xl p-4 space-y-3 shadow-inner text-left">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-pink-700 font-mono">
                                      <Box size={11} className="text-pink-600 animate-pulse" />
                                      <span>3D Perspective Extruder</span>
                                    </div>
                                    <span className="text-[8px] bg-pink-500 text-white font-extrabold px-1.5 py-0.5 rounded-md font-mono uppercase">
                                      3D Canvas
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-[9px] font-bold font-mono py-0.5">
                                    <div className="space-y-0.5">
                                      <span className="text-stone-500">Angle X: {rotationX}°</span>
                                      <input 
                                        type="range" 
                                        min="-75" 
                                        max="75" 
                                        value={rotationX} 
                                        onChange={(e) => setRotationX(Number(e.target.value))}
                                        className="w-full accent-pink-600 h-1 bg-stone-200 rounded-lg cursor-pointer"
                                      />
                                    </div>
                                    <div className="space-y-0.5">
                                      <span className="text-stone-500">Angle Y: {rotationY}°</span>
                                      <input 
                                        type="range" 
                                        min="-75" 
                                        max="75" 
                                        value={rotationY} 
                                        onChange={(e) => setRotationY(Number(e.target.value))}
                                        className="w-full accent-pink-600 h-1 bg-stone-200 rounded-lg cursor-pointer"
                                      />
                                    </div>
                                  </div>

                                  {(() => {
                                    let rawPerspective = getPropValue("perspective") || "250px";
                                    if (rawPerspective === "none") rawPerspective = "1000px";
                                    const tStyle = getPropValue("transform-style") || "flat";
                                    const bFace = getPropValue("backface-visibility") || "visible";

                                    return (
                                      <div 
                                        className="h-28 border border-stone-200 bg-stone-900 rounded-xl flex items-center justify-center relative overflow-hidden select-none"
                                        style={{ perspective: rawPerspective }}
                                      >
                                        <div className="absolute top-1.5 left-2 text-[7.5px] font-bold text-stone-400 font-mono">
                                          PERSPECTIVE: {rawPerspective}
                                        </div>
                                        <div 
                                          className="w-16 h-16 transition-transform duration-300 relative rounded-xl shadow-lg border border-pink-400 flex flex-col justify-center items-center text-center text-white bg-gradient-to-tr from-rose-500 to-pink-500"
                                          style={{
                                            transformStyle: tStyle as any,
                                            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
                                            backfaceVisibility: bFace as any,
                                          }}
                                        >
                                          <Box size={14} className="text-white drop-shadow-sm mb-1 animate-pulse" />
                                          <span className="font-mono text-[7px] font-extrabold uppercase tracking-widest text-pink-100">3D FACE</span>
                                          {tStyle === "preserve-3d" && (
                                            <div 
                                              className="absolute inset-0 rounded-xl bg-pink-900/90 border border-white/20 flex items-center justify-center"
                                              style={{
                                                transform: "translateZ(-12px) rotateY(180deg)",
                                                backfaceVisibility: bFace as any,
                                              }}
                                            >
                                              <span className="text-[6.5px] font-mono uppercase font-bold tracking-widest text-pink-200">REAR</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              )}

                              {dynamicSection.id === "outlines" && (
                                <div className="bg-gradient-to-br from-blue-50 to-sky-50/20 border border-blue-250/60 rounded-2xl p-4 space-y-3 shadow-inner text-left">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-blue-750 font-mono">
                                      <MousePointer size={11} className="text-blue-600" />
                                      <span>Reactive Outline Simulation</span>
                                    </div>
                                    <span className="text-[8px] bg-blue-550 text-white font-extrabold px-1.5 py-0.5 rounded-md font-mono uppercase">
                                      Focus Frame
                                    </span>
                                  </div>

                                  {(() => {
                                    const outlineColor = getPropValue("outline-color") || "#3b82f6";
                                    const outlineStyle = getPropValue("outline-style") || "solid";
                                    const outlineWidth = getPropValue("outline-width") || "3px";
                                    const outlineOffset = getPropValue("outline-offset") || "2px";

                                    return (
                                      <div className="bg-white border rounded-xl flex items-center justify-center h-16 shadow-xs select-none">
                                        <button
                                          type="button"
                                          onClick={() => setOutlineFocused(!outlineFocused)}
                                          className={`px-4.5 py-1.5 text-xs font-bold font-sans rounded-xl transition-all border ${
                                            outlineFocused
                                              ? "bg-stone-900 border-stone-850 text-white"
                                              : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100/80"
                                          }`}
                                          style={{
                                            outline: outlineFocused ? `${outlineWidth} ${outlineStyle} ${outlineColor}` : "none",
                                            outlineOffset: outlineFocused ? outlineOffset : "0px",
                                          }}
                                        >
                                          {outlineFocused ? "Focused Focus-Frame" : "Click Me to Focus"}
                                        </button>
                                      </div>
                                    );
                                  })()}
                                </div>
                              )}

                              {/* --- Render Standard Category Sections --- */}
                              {hierarchyData.subCategories.map((sub, idx) => (
                                 <div key={idx} className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
                                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1">
                                      <Settings size={11} />
                                      <span>{sub.name}</span>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                       {sub.properties.map((prop, propIdx) => renderPropertyElement(prop, propIdx))}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        );
                    })()}
                 </div>
              );
           }
           return null;
        })}

        {/* ==================== 6. CSS PROPERTIES CHEATSHEET & DIRECTORY ==================== */}
        {inspectorSection === "help" && (
          <HelpSection
            selectedElement={selectedElement}
            updateTree={updateTree}
            handleCopy={handleCopy}
            copiedText={copiedText}
          />
        )}
      </div>

      {/* Global Delete and Duplicate Action Bar stuck to bottom */}
      <div className="border-t border-stone-100 p-4 shrink-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] flex items-center gap-2.5 bg-stone-50/30">
        <button
          onClick={() => {
            if (selectedElement) duplicateElement(selectedElement.id);
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 bg-stone-100 hover:bg-stone-200 hover:text-stone-900 text-stone-700 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm border border-stone-200/30 cursor-pointer"
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
