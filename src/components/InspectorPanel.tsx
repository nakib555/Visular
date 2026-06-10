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
} from "lucide-react";
import { CSS_HIERARCHY_DATA } from "./css-categories";
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
    return parseArbitraryProperty(
      selectedElement?.classes || "",
      propName,
    );
  };

  const setPropValue = (propName: string, val: string) => {
    if (!selectedElement) return;
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
    const isColor =
      propName.includes("color") ||
      propName === "fill" ||
      propName === "stroke";
    const sliderConf = getSliderLimits(propName);

    if (isColor) {
      const swatches = [
        {
          color: "transparent",
          bg: "bg-white border-2 border-dashed border-stone-300",
        },
        { color: "currentColor", bg: "bg-stone-500 border" },
        { color: "#000000", bg: "bg-black" },
        {
          color: "#ffffff",
          bg: "bg-white border border-stone-200",
        },
        { color: "#f43f5e", bg: "bg-rose-500" },
        { color: "#f59e0b", bg: "bg-amber-500" },
        { color: "#10b981", bg: "bg-emerald-500" },
        { color: "#0ea5e9", bg: "bg-sky-500" },
        { color: "#6366f1", bg: "bg-indigo-500" },
        { color: "#8b5cf6", bg: "bg-violet-500" },
      ];

      return (
        <div
          key={propIdx}
          className="flex flex-col gap-1.5 w-full text-left"
        >
          <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono flex justify-between">
            <span>{propName}</span>
            <span className="text-[10px] font-mono font-bold text-stone-400 select-all normal-case">
              {currentVal || "default"}
            </span>
          </label>
          <div className="flex flex-col gap-2 p-3 bg-white border border-stone-200/90 rounded-2xl shadow-xs">
            <div className="flex flex-wrap gap-1.5">
              {swatches.map((sw, swIdx) => {
                const isSelected = currentVal === sw.color;
                return (
                  <button
                    key={swIdx}
                    type="button"
                    onClick={() => setPropValue(propName, sw.color)}
                    className={`w-6 h-6 rounded-lg transition-transform active:scale-95 duration-150 cursor-pointer ${sw.bg} ${
                      isSelected
                        ? "ring-2 ring-rose-500 ring-offset-1 scale-110 shadow-sm"
                        : "hover:scale-105"
                    }`}
                    title={sw.color}
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-1.5 mt-1 border-t border-stone-100 pt-2">
              <span className="text-[9px] font-bold text-stone-400 uppercase font-mono">
                Hex / Val:
              </span>
              <input
                type="text"
                value={currentVal}
                onChange={(e) => setPropValue(propName, e.target.value)}
                placeholder="#3b82f6, transparent..."
                className="flex-1 bg-stone-50 border border-stone-200/80 rounded-xl px-2.5 py-1 text-[10.5px] focus:outline-none focus:border-rose-500 font-mono text-stone-850"
              />
            </div>
          </div>
        </div>
      );
    }

    if (sliderConf) {
      const numVal =
        parseFloat(currentVal) || (sliderConf.min + sliderConf.max) / 2;
      return (
        <div key={propIdx} className="flex flex-col gap-1.5 w-full text-left">
          <div className="flex justify-between items-center px-1 font-mono text-[10px] font-bold uppercase tracking-wider text-stone-550">
            <span>{propName}</span>
            <span className="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-sm">
              {currentVal || "default"}
            </span>
          </div>

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
          <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono flex justify-between">
            <span>{propName}</span>
          </label>
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
                      : "text-stone-450 hover:text-stone-700"
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

    return (
      <PropertyControl
        key={propIdx}
        label={propName}
        options={[
          { value: "", label: "Auto / Default" },
          ...uniqueOptions.map((opt: string) => ({ value: opt, label: opt })),
        ]}
        value={currentVal}
        onChange={(val) => setPropValue(propName, val)}
      />
    );
  };

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

  // Expanded status for Accordion categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    layoutBoxModel: true,
    typographyText: true,
    appearanceAestheticsSvg: true,
    motionTransforms: true,
    interactivityUiMisc: true,
    environmentMediaArchitecture: true,
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const scrollToCategory = (catId: string) => {
    isScrollingRef.current = true;
    
    // Automatically expand the section if minimized
    setExpandedCategories((prev) => ({ ...prev, [catId]: true }));
    setInspectorSection(catId as InspectorSection);

    setTimeout(() => {
      const el = document.getElementById(`category-sec-${catId}`);
      const container = scrollContainerRef.current;
      if (el && container) {
        const containerTop = container.getBoundingClientRect().top;
        const elTop = el.getBoundingClientRect().top;
        const offset = elTop - containerTop + container.scrollTop;
        
        container.scrollTo({
          top: Math.max(0, offset - 10),
          behavior: "smooth",
        });
      }
      
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 600);
    }, 50);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingRef.current) return;
      const container = scrollContainerRef.current;
      if (!container) return;

      const containerTop = container.getBoundingClientRect().top;
      let minDistance = Infinity;
      let currentActive = inspectorSection;

      const categoryIds = [
        "layoutBoxModel",
        "typographyText",
        "appearanceAestheticsSvg",
        "motionTransforms",
        "interactivityUiMisc",
        "environmentMediaArchitecture",
      ];

      for (const id of categoryIds) {
        const el = document.getElementById(`category-sec-${id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(rect.top - (containerTop + 16));
          if (distance < minDistance) {
            minDistance = distance;
            currentActive = id as any;
          }
        }
      }

      if (currentActive !== inspectorSection) {
        setInspectorSection(currentActive as any);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [inspectorSection, setInspectorSection]);

  const categoryConfigs = [
    { id: "layoutBoxModel", label: "Layout & Box Model", icon: Maximize, name: "Layout & Box Model" },
    { id: "typographyText", label: "Typography & Text", icon: Type, name: "Typography & Text" },
    { id: "appearanceAestheticsSvg", label: "Appearance, Aesthetics & SVG", icon: Palette, name: "Appearance, Aesthetics & SVG" },
    { id: "motionTransforms", label: "Motion & Transforms", icon: Play, name: "Motion & Transforms" },
    { id: "interactivityUiMisc", label: "Interactivity, UI & Miscellaneous", icon: MousePointer, name: "Interactivity, UI & Miscellaneous" },
    { id: "environmentMediaArchitecture", label: "Environment, Media & Architecture", icon: Compass, name: "Environment, Media & Architecture" },
  ];

  // We search properties and subcategories globally based on searchQuery
  const globalFilteredCategories = categoryConfigs.map((cfg) => {
    const activeCategory = CSS_HIERARCHY_DATA.find((c) => c.name === cfg.name);
    if (!activeCategory) return { ...cfg, subCategories: [] };

    const filteredSubCategories = searchQuery
      ? activeCategory.subCategories
          .map((sub) => {
            const properties = sub.properties.filter((prop) => {
              const query = searchQuery.toLowerCase();
              return (
                prop.name.toLowerCase().includes(query) ||
                prop.values.toLowerCase().includes(query) ||
                (prop.note && prop.note.toLowerCase().includes(query))
              );
            });
            return { ...sub, properties };
          })
          .filter((sub) => sub.properties.length > 0)
      : activeCategory.subCategories;

    return {
      ...cfg,
      subCategories: filteredSubCategories,
    };
  }).filter((cfg) => cfg.subCategories.length > 0);

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
        {globalFilteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-stone-400 text-center bg-stone-50/20 rounded-2xl border border-dashed border-stone-200">
            <Search size={24} className="text-stone-300 mb-2" />
            <p className="text-xs font-bold text-stone-600">No CSS Property Matches Found</p>
            <p className="text-[10px] text-stone-400 mt-1 max-w-[200px]">None of the categories contain a property matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-in fade-in duration-350">
            {globalFilteredCategories.map((catConfig) => {
              const catId = catConfig.id;
              const isExpanded = expandedCategories[catId] ?? true;
              
              return (
                <div
                  key={catId}
                  id={`category-sec-${catId}`}
                  className="bg-stone-50/40 border border-stone-200/50 rounded-3xl overflow-hidden transition-all duration-350 shadow-xs"
                >
                  {/* Category Header (collapsible toggle) */}
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedCategories((prev) => ({
                        ...prev,
                        [catId]: !isExpanded,
                      }));
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
                        {catConfig.subCategories.length}
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

                  {/* Category Sections (Subcategories & Properties) */}
                  {isExpanded && (
                    <div className="p-4 flex flex-col gap-5 bg-white border-t border-stone-100/60 transition-all">
                      {catConfig.subCategories.map((sub, idx) => {
                        let IconComponent = Settings;
                        const sName = sub.name.toLowerCase();

                        if (sName.includes("display") || sName.includes("flow-root") || sName.includes("context")) IconComponent = Maximize;
                        else if (sName.includes("flexbox")) IconComponent = Grid;
                        else if (sName.includes("grid")) IconComponent = Grid;
                        else if (sName.includes("margin") || sName.includes("padding") || sName.includes("spacing")) IconComponent = Move;
                        else if (sName.includes("sizing") || sName.includes("dimension") || sName.includes("width") || sName.includes("height") || sName.includes("ratio")) IconComponent = Sliders;
                        else if (sName.includes("position") || sName.includes("coordinate") || sName.includes("inset") || sName.includes("stack")) IconComponent = Compass;
                        else if (sName.includes("anchor")) IconComponent = Anchor;
                        else if (sName.includes("typography") || sName.includes("font") || sName.includes("text")) IconComponent = Type;
                        else if (sName.includes("svg") || sName.includes("vector") || sName.includes("stroke") || sName.includes("fill")) IconComponent = PenTool;
                        else if (sName.includes("background") || sName.includes("border") || sName.includes("shadow") || sName.includes("visual") || sName.includes("aesthetic") || sName.includes("appearance")) IconComponent = Palette;
                        else if (sName.includes("filter") || sName.includes("opacity") || sName.includes("transform")) IconComponent = Play;
                        else if (sName.includes("transition") || sName.includes("discrete")) IconComponent = Wand2;
                        else if (sName.includes("animation")) IconComponent = Route;
                        else if (sName.includes("interactivity") || sName.includes("event") || sName.includes("pointer") || sName.includes("select")) IconComponent = MousePointer;
                        else if (sName.includes("media") || sName.includes("responsive") || sName.includes("adaptability") || sName.includes("environment")) IconComponent = Compass;
                        else if (sName.includes("column") || sName.includes("break")) IconComponent = Columns;
                        else if (sName.includes("scroll") || sName.includes("scrollbar") || sName.includes("overflow")) IconComponent = Sliders;
                        else if (sName.includes("mask") || sName.includes("clipping")) IconComponent = Scissors;
                        else if (sName.includes("list") || sName.includes("table")) IconComponent = List;
                        else if (sName.includes("3d") || sName.includes("perspective")) IconComponent = Box;
                        else if (sName.includes("accessibility") || sName.includes("reading")) IconComponent = Eye;

                        let specialWidget = null;
                        if (sName.includes("svg & vector") || sName.includes("vector graphics") || sName.includes("svg")) {
                          specialWidget = (
                            <div className="bg-gradient-to-br from-teal-50/50 to-emerald-50/15 border border-teal-200/40 rounded-xl p-3.5 space-y-2.5 my-2">
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
                        } else if (sName.includes("scrollbar") || sName.includes("scrollbars")) {
                          specialWidget = (
                            <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/15 border border-indigo-200/40 rounded-xl p-3.5 space-y-2 my-2">
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
                        } else if (sName.includes("3d") || sName.includes("perspective")) {
                          specialWidget = (
                            <div className="bg-gradient-to-br from-pink-50/50 to-rose-50/15 border border-pink-200/40 rounded-xl p-3.5 space-y-2.5 my-2">
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
                        } else if (sName.includes("focus") || sName.includes("outline")) {
                          specialWidget = (
                            <div className="bg-gradient-to-br from-blue-55/65 to-sky-50/15 border border-blue-200/50 rounded-xl p-3.5 space-y-2 my-2">
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

                        return (
                          <div key={idx} className="bg-stone-50/10 border border-stone-200/80 shadow-xs rounded-2xl p-4 space-y-4">
                            <div className="flex items-center gap-2 border-b border-stone-100 pb-2 mb-4 text-left">
                              <IconComponent size={14} className="text-rose-600" />
                              <span className="text-[10px] font-bold text-stone-800 uppercase tracking-widest flex-1">
                                {sub.name}
                              </span>
                            </div>
                            {specialWidget}
                            <div className="flex flex-col gap-4">
                              {sub.properties.map((prop: CSSProperty, propIdx: number) => renderPropertyElement(prop, propIdx))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
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
