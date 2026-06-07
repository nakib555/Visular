import React, { useState } from "react";
import { 
  Settings, Sparkles, Palette, Maximize, Type, Layers, Play, Code, 
  HelpCircle, AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronDown, Trash2, Copy,
  Grid, Compass, Cpu, Move, Wand2, Search, Check, ChevronRight, Sliders
} from "lucide-react";
import { PropertyControl } from "./PropertyControl";
import { VisualElement } from "../types";
import { setGroupClass, getActiveGroupClass, setPrefixedClass, getPrefixedClass, setColorClass } from "../styleUtils";

export type InspectorSection = "layout" | "spacing" | "typography" | "visuals" | "motion" | "core" | "help";

interface CSSProperty {
  name: string;
  values: string;
  note?: string;
}

interface CSSSubCategory {
  name: string;
  properties: CSSProperty[];
}

interface CSSCategory {
  name: string;
  icon: any;
  subCategories: CSSSubCategory[];
}

const CSS_HIERARCHY_DATA: CSSCategory[] = [
  {
    name: "LAYOUT",
    icon: Maximize,
    subCategories: [
      {
        name: "Display Mode",
        properties: [
          { name: "display", values: "block | inline-block | inline | flex | inline-flex | grid | inline-grid | flow-root | contents | none | table | table-row | table-cell | list-item" }
        ]
      },
      {
        name: "Flexbox Container",
        properties: [
          { name: "flex-direction", values: "row | row-reverse | column | column-reverse" },
          { name: "justify-content", values: "normal | flex-start | flex-end | center | space-between | space-around | space-evenly | start | end | left | right" },
          { name: "align-items", values: "normal | stretch | flex-start | flex-end | center | baseline | start | end" },
          { name: "flex-wrap", values: "nowrap | wrap | wrap-reverse" },
          { name: "gap", values: "normal | <length> | <percentage> | calc(...) | clamp(...)", note: "e.g., 16px, 1rem, 5%" }
        ]
      },
      {
        name: "Flexbox Items",
        properties: [
          { name: "flex-grow", values: "<number> | calc(...)", note: "e.g., 0, 1, 2.5" },
          { name: "flex-shrink", values: "<number> | calc(...)", note: "e.g., 0, 1, 3" },
          { name: "flex-basis", values: "auto | content | max-content | min-content | fit-content | <length> | <percentage>" },
          { name: "align-self", values: "auto | normal | flex-start | flex-end | center | baseline | stretch | start | end" },
          { name: "order", values: "<integer>", note: "e.g., 0, 1, 99, -1, -99" }
        ]
      },
      {
        name: "Grid Container",
        properties: [
          { name: "grid-template-columns", values: "none | subgrid | masonry | <track-list>" },
          { name: "grid-template-rows", values: "none | subgrid | masonry | <track-list>" },
          { name: "justify-items", values: "normal | stretch | center | start | end | flex-start | flex-end | self-start | self-end | left | right | legacy" },
          { name: "align-items", values: "normal | stretch | center | start | end | flex-start | flex-end | self-start | self-end | baseline" }
        ]
      },
      {
        name: "Grid Items",
        properties: [
          { name: "grid-column", values: "auto | <integer> | <custom-ident> | <integer> / <integer> | span <integer> | span <custom-ident>" },
          { name: "grid-row", values: "auto | <integer> | <custom-ident> | <integer> / <integer> | span <integer> | span <custom-ident>" },
          { name: "grid-area", values: "auto | <custom-name> | <row-start> / <column-start> / <row-end> / <column-end>" }
        ]
      },
      {
        name: "Box Model & Positioning (Legacy)",
        properties: [
          { name: "width", values: "auto | <length> | <percentage> | max-content | min-content", note: "e.g., 100px, 50%" },
          { name: "height", values: "auto | <length> | <percentage> | max-content | min-content", note: "e.g., 100px, 50%" },
          { name: "margin", values: "auto | <length> | <percentage>", note: "e.g., 10px, 2rem, 5%" },
          { name: "padding", values: "<length> | <percentage>", note: "e.g., 20px, 1.5em, 10%" },
          { name: "position", values: "static | relative | absolute | fixed | sticky" },
          { name: "inset", values: "auto | <length> | <percentage>" }
        ]
      }
    ]
  },
  {
    name: "TYPOGRAPHY & TEXT",
    icon: Type,
    subCategories: [
      {
        name: "Font Styling",
        properties: [
          { name: "font-family", values: "<custom-font> | <generic>", note: "e.g., \"Open Sans\", sans-serif, monospace" },
          { name: "font-size", values: "<length> | <percentage> | small | large", note: "e.g., 16px, 1.2rem" },
          { name: "font-weight", values: "normal | bold | bolder | lighter | <number>", note: "e.g., 100, 400, 700" },
          { name: "font-style", values: "normal | italic | oblique" }
        ]
      },
      {
        name: "Text Formatting",
        properties: [
          { name: "text-align", values: "left | right | center | justify" },
          { name: "text-decoration", values: "none | underline | overline | line-through" },
          { name: "text-transform", values: "none | capitalize | uppercase | lowercase" },
          { name: "text-indent", values: "<length> | <percentage>", note: "e.g., 20px, 2rem" }
        ]
      },
      {
        name: "Text Spacing & Wrapping",
        properties: [
          { name: "line-height", values: "normal | <number> | <length> | <percentage>", note: "e.g., 1.5, 24px" },
          { name: "letter-spacing", values: "normal | <length>", note: "e.g., 1px, 0.05em" },
          { name: "word-spacing", values: "normal | <length>", note: "e.g., 2px" },
          { name: "white-space", values: "normal | nowrap | pre | pre-wrap | pre-line" },
          { name: "word-break", values: "normal | break-all | keep-all | break-word" },
          { name: "overflow-wrap", values: "normal | break-all | keep-all | break-word" }
        ]
      }
    ]
  },
  {
    name: "APPEARANCE & VISUALS",
    icon: Palette,
    subCategories: [
      {
        name: "Colors & Backgrounds",
        properties: [
          { name: "color", values: "<color-name> | <hex> | <rgb/rgba> | <hsl> | transparent", note: "e.g., red, #ff0000, rgba(0,0,0,0.5)" },
          { name: "background-color", values: "<color> | transparent" },
          { name: "background-image", values: "none | url(\"...\") | linear-gradient(...) | radial-gradient(...)" },
          { name: "background-size", values: "auto | cover | contain | <length/percentage>", note: "e.g., 100% 50%" },
          { name: "background-position", values: "center | top left | bottom right | <percentage>", note: "e.g., 50% 50%" },
          { name: "background-repeat", values: "repeat | no-repeat | repeat-x | repeat-y" },
          { name: "opacity", values: "<number>", note: "0.0 to 1.0 (e.g. 0.5)" }
        ]
      },
      {
        name: "Borders",
        properties: [
          { name: "border", values: "none | <thickness> <style> <color>", note: "e.g., 1px solid black, 2px dashed red" },
          { name: "outline", values: "none | <thickness> <style> <color>" },
          { name: "border-radius", values: "<length> | <percentage>", note: "e.g., 8px, 50%" }
        ]
      },
      {
        name: "Effects & Filters",
        properties: [
          { name: "box-shadow", values: "none | <offset-x> <offset-y> <blur> <spread> <color>", note: "e.g., 2px 4px 10px rgba(0,0,0,0.3)" },
          { name: "text-shadow", values: "none | <offset-x> <offset-y> <blur> <color>", note: "e.g., 1px 1px 2px black" },
          { name: "filter", values: "none | blur(px) | brightness(num) | contrast(%) | grayscale(%)", note: "e.g., blur(5px)" },
          { name: "backdrop-filter", values: "none | blur(px) | brightness(num) | contrast(%) | grayscale(%)" },
          { name: "clip-path", values: "none | circle(%) | polygon(...) | url(#id)" }
        ]
      }
    ]
  },
  {
    name: "MOVEMENT & ANIMATION",
    icon: Play,
    subCategories: [
      {
        name: "Transitions",
        properties: [
          { name: "transition-property", values: "all | none | <property-name>", note: "e.g., background-color, transform" },
          { name: "transition-duration", values: "<time>", note: "e.g., 0.3s, 500ms" },
          { name: "transition-timing-function", values: "ease | linear | ease-in | ease-out | ease-in-out | cubic-bezier(...)" },
          { name: "transition-delay", values: "<time>" }
        ]
      },
      {
        name: "Transforms",
        properties: [
          { name: "transform", values: "none | translate(X, Y) | scale(X, Y) | rotate(deg) | skew(deg, deg)" },
          { name: "transform-origin", values: "center | top left | bottom right | <length> | <percentage>" }
        ]
      },
      {
        name: "Keyframe Animations",
        properties: [
          { name: "animation-name", values: "none | <custom-name>", note: "e.g., slideIn, pulse" },
          { name: "animation-duration", values: "<time>" },
          { name: "animation-iteration-count", values: "<number> | infinite" },
          { name: "animation-direction", values: "normal | reverse | alternate | alternate-reverse" }
        ]
      }
    ]
  },
  {
    name: "INTERACTIVITY & UI",
    icon: Cpu,
    subCategories: [
      {
        name: "Mouse Controls",
        properties: [
          { name: "cursor", values: "auto | default | pointer | crosshair | not-allowed | grab | grabbing | text" },
          { name: "pointer-events", values: "auto | none" }
        ]
      },
      {
        name: "User Behaviors",
        properties: [
          { name: "user-select", values: "auto | text | none | all" },
          { name: "resize", values: "none | both | horizontal | vertical" },
          { name: "touch-action", values: "auto | none | pan-x | pan-y | manipulation" }
        ]
      },
      {
        name: "Lists & Tables",
        properties: [
          { name: "list-style-type", values: "none | disc | circle | square | decimal | lower-alpha | upper-roman" },
          { name: "border-collapse", values: "collapse | separate" }
        ]
      }
    ]
  }
];

interface InspectorPanelProps {
  selectedElement: VisualElement | null;
  inspectorSection: InspectorSection;
  setInspectorSection: (s: InspectorSection) => void;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
}

export function InspectorPanel({
  selectedElement,
  inspectorSection,
  setInspectorSection,
  updateTree,
  deleteElement,
  duplicateElement
}: InspectorPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "LAYOUT & STRUCTURE": true,
    "TYPOGRAPHY & TEXT": true,
    "APPEARANCE & VISUALS": true,
    "MOVEMENT & ANIMATION": true,
    "INTERACTIVITY & UI": true,
  });
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [layoutSubCategory, setLayoutSubCategory] = useState<"display" | "flex" | "grid" | "position" | "overflow">("display");
  const [expandedLayoutSections, setExpandedLayoutSections] = useState<Record<string, boolean>>({
    display: true,
    flex: true,
    grid: true,
    position: true,
    overflow: true,
  });

  const toggleLayoutSection = (section: string) => {
    setExpandedLayoutSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => {
      setCopiedText((curr) => curr === text ? null : curr);
    }, 1500);
  };

  const filteredHierarchy = CSS_HIERARCHY_DATA.map(category => {
    const matchingSubCategories = category.subCategories.map(subCat => {
      const matchingProperties = subCat.properties.filter(prop => {
        const query = searchQuery.toLowerCase();
        return (
          prop.name.toLowerCase().includes(query) ||
          prop.values.toLowerCase().includes(query) ||
          (prop.note && prop.note.toLowerCase().includes(query))
        );
      });
      return { ...subCat, properties: matchingProperties };
    }).filter(subCat => subCat.properties.length > 0);

    return { ...category, subCategories: matchingSubCategories };
  }).filter(category => category.subCategories.length > 0);

  if (!selectedElement) return (
    <div className="flex flex-col items-center justify-center h-full w-full text-stone-400 p-8 text-center bg-stone-50/30 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-stone-200/60 flex items-center justify-center mb-4 text-stone-300">
        <Settings size={24} />
      </div>
      <p className="text-sm font-semibold text-stone-600">No Element Selected</p>
      <p className="text-xs text-stone-400 mt-1 max-w-[200px]">Click any element on the canvas to inspect and edit its properties.</p>
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
          { id: "typography", label: "Typography & Text", icon: Type },
          { id: "visuals", label: "Appearance & Visuals", icon: Palette },
          { id: "motion", label: "Motion & Effects", icon: Play },
          { id: "core", label: "Content & Code", icon: Sparkles },
          { id: "help", label: "CSS Guide", icon: HelpCircle }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={inspectorSection === tab.id}
            onClick={() => setInspectorSection(tab.id as InspectorSection)}
            className={`relative px-3.5 py-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shrink-0 text-xs font-semibold ${
              inspectorSection === tab.id 
                ? "text-purple-700 bg-purple-50/80 shadow-sm border border-purple-100/50" 
                : "text-stone-500 border border-transparent hover:text-stone-800 hover:bg-stone-50"
            }`}
          >
            <tab.icon size={13.5} className={inspectorSection === tab.id ? "text-purple-600" : "text-stone-400"} />
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Properties Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 flex flex-col gap-6 custom-scrollbar">
        
        {/* ==================== 1. SPACING ==================== */}
        {inspectorSection === "spacing" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Move size={15} className="text-purple-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">Box Model & Spacing</span>
            </div>

            {/* Sub-Category: Box Model (Element Spacing & Sizing) */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Grid size={11} />
                <span>Box Model (Spacing & Sizing)</span>
              </div>
              
              {/* Properties: Width & Height */}
              <div className="grid grid-cols-2 gap-3">
                <PropertyControl
                  label="Width"
                  type="number"
                  value={getActiveGroupClass(selectedElement.classes, "width")}
                  onChange={(val) => updateTree((n) => ({ classes: setGroupClass(n.classes, "width", val) }))}
                  placeholder="Auto"
                />

                <PropertyControl
                  label="Height"
                  type="number"
                  value={getActiveGroupClass(selectedElement.classes, "height")}
                  onChange={(val) => updateTree((n) => ({ classes: setGroupClass(n.classes, "height", val) }))}
                  placeholder="Auto"
                />
              </div>

              {/* Min/Max Sizing select configurations */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Min Width</label>
                  <div className="relative">
                    <select
                      value={getPrefixedClass(selectedElement.classes, "min-w-")}
                      onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "min-w-", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/85 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="">None (min-w-0)</option>
                      <option value="min-w-0">min-w-0</option>
                      <option value="min-w-[100px]">100px</option>
                      <option value="min-w-[200px]">200px</option>
                      <option value="min-w-[300px]">300px</option>
                      <option value="min-w-full">100% (min-w-full)</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Max Width</label>
                  <div className="relative">
                    <select
                      value={getPrefixedClass(selectedElement.classes, "max-w-")}
                      onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "max-w-", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/85 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="">None</option>
                      <option value="max-w-xs">X Small (max-w-xs)</option>
                      <option value="max-w-sm">Small (max-w-sm)</option>
                      <option value="max-w-md">Medium (max-w-md)</option>
                      <option value="max-w-lg">Large (max-w-lg)</option>
                      <option value="max-w-xl">X Large (max-w-xl)</option>
                      <option value="max-w-2xl">2X Large (max-w-2xl)</option>
                      <option value="max-w-full">Full (max-w-full)</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Min Height</label>
                  <div className="relative">
                    <select
                      value={getPrefixedClass(selectedElement.classes, "min-h-")}
                      onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "min-h-", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/85 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="">None (min-h-0)</option>
                      <option value="min-h-0">min-h-0</option>
                      <option value="min-h-[50px]">50px</option>
                      <option value="min-h-[100px]">100px</option>
                      <option value="min-h-[200px]">200px</option>
                      <option value="min-h-full">100% (min-h-full)</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Max Height</label>
                  <div className="relative">
                    <select
                      value={getPrefixedClass(selectedElement.classes, "max-h-")}
                      onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "max-h-", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/85 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="">None</option>
                      <option value="max-h-full">100% (max-h-full)</option>
                      <option value="max-h-[300px]">300px</option>
                      <option value="max-h-[500px]">500px</option>
                      <option value="max-h-screen">Screen height</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Box Sizing & Aspect Ratio */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Box Sizing</label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(selectedElement.classes, "boxSizing")}
                      onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "boxSizing", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/85 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="">Default (Border Box)</option>
                      <option value="box-border">box-border</option>
                      <option value="box-content">box-content</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Aspect Ratio</label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(selectedElement.classes, "aspectRatio")}
                      onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "aspectRatio", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/85 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="">Default (aspect-auto)</option>
                      <option value="aspect-auto">aspect-auto</option>
                      <option value="aspect-square">Square (1:1 / aspect-square)</option>
                      <option value="aspect-video">Video (16:9 / aspect-video)</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Spacing Controls: Margin & Padding */}
              <div className="space-y-3 pt-1">
                <div className="p-3 bg-white border border-stone-200/50 rounded-xl space-y-3">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block font-sans">Padding (Inside Spacing)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1 col-span-2">
                      <label className="text-[9px] text-stone-400 font-medium">All sides padding global</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "p-")}
                        onChange={(e) => {
                          let updated = selectedElement.classes
                            .replace(/\b(pt|pr|pb|pl|px|py)-\w+\b/g, "")
                            .replace(/\s+/g, " ")
                            .trim();
                          updateTree(() => ({ 
                            classes: setPrefixedClass(updated, "p-", e.target.value) 
                          }));
                        }}
                        className="w-full bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">None (p-0)</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24,32,48,64].map((v) => (
                          <option key={v} value={`p-${v}`}>p-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-medium">Top side</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "pt-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "pt-", e.target.value) }))}
                        className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">Inherited</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                          <option key={v} value={`pt-${v}`}>pt-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-medium">Right side</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "pr-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "pr-", e.target.value) }))}
                        className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">Inherited</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                          <option key={v} value={`pr-${v}`}>pr-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-medium">Bottom side</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "pb-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "pb-", e.target.value) }))}
                        className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">Inherited</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                          <option key={v} value={`pb-${v}`}>pb-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-medium">Left side</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "pl-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "pl-", e.target.value) }))}
                        className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">Inherited</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                          <option key={v} value={`pl-${v}`}>pl-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white border border-stone-200/50 rounded-xl space-y-3">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block font-sans">Margin (Outside Spacing)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1 col-span-2">
                      <label className="text-[9px] text-stone-400 font-medium">All sides margin global</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "m-")}
                        onChange={(e) => {
                          let updated = selectedElement.classes
                            .replace(/\b(mt|mr|mb|ml|mx|my)-\w+\b/g, "")
                            .replace(/\s+/g, " ")
                            .trim();
                          updateTree(() => ({ 
                            classes: setPrefixedClass(updated, "m-", e.target.value) 
                          }));
                        }}
                        className="w-full bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">None (m-0)</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24,32,48,64].map((v) => (
                          <option key={v} value={`m-${v}`}>m-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-medium">Top side</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "mt-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "mt-", e.target.value) }))}
                        className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">Inherited</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                          <option key={v} value={`mt-${v}`}>mt-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-medium">Right side</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "mr-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "mr-", e.target.value) }))}
                        className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">Inherited</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                          <option key={v} value={`mr-${v}`}>mr-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-medium">Bottom side</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "mb-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "mb-", e.target.value) }))}
                        className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">Inherited</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                          <option key={v} value={`mb-${v}`}>mb-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-medium">Left side</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "ml-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "ml-", e.target.value) }))}
                        className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">Inherited</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                          <option key={v} value={`ml-${v}`}>ml-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 1. LAYOUT ==================== */}
        {inspectorSection === "layout" && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Maximize size={15} className="text-purple-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">Layout Settings</span>
            </div>

            {(() => {
              const parseArbitraryValue = (className: string, prefix: string): string => {
                if (!className) return "";
                const match = className.match(new RegExp(`(?:^|\\s)${prefix.replace(/[-\[\]()]/g, '\\$&')}\\[([^\\]]+)\\](?:$|\\s)`));
                if (match) return match[1].replace(/_/g, " ");
                const active = className.split(/\s+/).find((c) => c.startsWith(prefix) && !c.includes("["));
                return active ? active.substring(prefix.length) : "";
              };

              const encodeArbitraryValue = (prefix: string, value: string): string => {
                if (!value || !value.trim()) return "";
                return `${prefix}[${value.trim().replace(/\s+/g, "_")}]`;
              };

              const updateArbitraryClass = (prefix: string, value: string) => {
                const currentTokens = selectedElement.classes.split(/\s+/).filter(Boolean);
                let filtered = currentTokens.filter((token) => !token.startsWith(prefix));
                if (value && value.trim()) {
                  filtered.push(encodeArbitraryValue(prefix, value));
                }
                updateTree((n) => ({ classes: filtered.join(" ") }));
              };

              const displayVal = getActiveGroupClass(selectedElement.classes, "display") || "";
              const isFlexContext = displayVal === "flex" || displayVal === "inline-flex";
              const isGridContext = displayVal === "grid" || displayVal === "inline-grid";

              const sectionHeader = (id: string, label: string, icon: any, badge?: string) => {
                const isExpanded = expandedLayoutSections[id];
                const IconComponent = icon;
                return (
                  <button
                    type="button"
                    onClick={() => toggleLayoutSection(id)}
                    className="w-full flex items-center justify-between pb-1 text-left cursor-pointer select-none font-sans"
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-purple-700 font-mono flex items-center gap-1.5">
                        <IconComponent size={11} className="text-purple-600" />
                        <span>{label}</span>
                      </div>
                      {badge && (
                        <span className="text-[8px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider font-mono select-none animate-pulse">
                          {badge}
                        </span>
                      )}
                    </div>
                    <ChevronDown size={14} className={`text-stone-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                );
              };

              return (
                <div className="space-y-4">
                  {/* --- 1. DISPLAY MODE --- */}
                  <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm select-none">
                    {sectionHeader("display", "Display Mode", Sliders)}
                    {expandedLayoutSections.display && (
                      <div className="flex flex-col gap-2.5 animate-in fade-in duration-200">
                        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono">display type</label>
                        <div className="relative">
                          <select
                            value={displayVal}
                            onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "display", e.target.value) }))}
                            className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 cursor-pointer font-medium"
                          >
                            <option value="block">block</option>
                            <option value="inline-block">inline-block</option>
                            <option value="inline">inline</option>
                            <option value="flex">flex</option>
                            <option value="inline-flex">inline-flex</option>
                            <option value="grid">grid</option>
                            <option value="inline-grid">inline-grid</option>
                            <option value="flow-root">flow-root</option>
                            <option value="contents">contents</option>
                            <option value="table">table</option>
                            <option value="table-row">table-row</option>
                            <option value="table-cell">table-cell</option>
                            <option value="list-item">list-item</option>
                            <option value="hidden">none</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>

                        {/* Behavior Details Banner */}
                        <div className="p-3 rounded-xl bg-purple-50/40 border border-purple-100/55 text-[10px] leading-relaxed text-purple-900">
                          <span className="font-bold uppercase tracking-wider text-purple-700 text-[9px] block font-mono">Layout Behavior context</span>
                          <p className="mt-1">
                            {displayVal === "block" && "Behaves as a block container. Takes up full width and starts on a new line."}
                            {displayVal === "inline-block" && "Behaves as an inline-level box. Sizing is respectably editable."}
                            {displayVal === "inline" && "Element renders as inline, wrapping context without custom dimension frames."}
                            {displayVal === "flex" && "Prepares container horizontal or vertical child layouts using standard Flex mechanics."}
                            {displayVal === "inline-flex" && "Enables inline Flexbox container where outer layout is inline, inner contents flex."}
                            {displayVal === "grid" && "Renders children according to column and row structures under CSS Grid parameters."}
                            {displayVal === "inline-grid" && "Enables inline Grid container behavior for precise cell-based layouts."}
                            {displayVal === "contents" && "Container is visually ignored; its child components are layout-linked directly to its parent."}
                            {displayVal === "hidden" && "Element is fully removed from rendering and page layout flow."}
                            {!displayVal && "Inherits standard display properties."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* --- 2. FLEXBOX CONTAINER SUB-CATEGORY --- */}
                  <div className={`border rounded-2xl p-3.5 space-y-1 transition-all duration-300 shadow-sm ${
                    isFlexContext 
                      ? "bg-stone-50/50 border-stone-200/50" 
                      : "bg-stone-100/30 border-stone-200/30 opacity-75"
                  }`}>
                    {sectionHeader("flex", "Flexbox Container", Cpu, !isFlexContext ? "⚠️ Inactive (Display is not Flex)" : undefined)}
                    {expandedLayoutSections.flex && (
                      <div className="space-y-4 pt-3 animate-in fade-in duration-200">
                        {!isFlexContext ? (
                          <div className="bg-purple-50/30 border border-purple-100 rounded-xl p-3.5 text-center space-y-2">
                            <div className="text-purple-700 font-bold text-[11px] font-sans">Convert Layout to Flexbox</div>
                            <p className="text-[10px] text-purple-600 leading-normal font-medium max-w-[210px] mx-auto">
                              To edit direction, align, wrap, and gap features, change layout display type to flex.
                            </p>
                            <button
                              type="button"
                              onClick={() => updateTree((n) => ({ classes: setGroupClass(n.classes, "display", "flex") }))}
                              className="w-full h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5 mr-auto ml-auto"
                            >
                              <Cpu size={12} /> Convert to Flex
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3.5">
                            {/* flex-direction */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-mono">flex-direction</label>
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "flexDirection")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "flexDirection", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
                                >
                                  <option value="">row (default)</option>
                                  <option value="flex-row">row (horizontal left-to-right)</option>
                                  <option value="flex-row-reverse">row-reverse (horizontal right-to-left)</option>
                                  <option value="flex-col">column (vertical top-to-bottom)</option>
                                  <option value="flex-col-reverse">column-reverse (vertical bottom-to-top)</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                            </div>

                            {/* justify-content */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-mono">justify-content</label>
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "justify")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "justify", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
                                >
                                  <option value="">normal (default)</option>
                                  <option value="justify-normal">normal</option>
                                  <option value="justify-start">flex-start / start</option>
                                  <option value="justify-end">flex-end / end</option>
                                  <option value="justify-center">center</option>
                                  <option value="justify-between">space-between</option>
                                  <option value="justify-around">space-around</option>
                                  <option value="justify-evenly">space-evenly</option>
                                  <option value="justify-stretch">stretch</option>
                                  <option value="justify-items-left">left</option>
                                  <option value="justify-items-right">right</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                            </div>

                            {/* align-items */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-mono">align-items</label>
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "alignment")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "alignment", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
                                >
                                  <option value="">normal / stretch (default)</option>
                                  <option value="items-normal">normal</option>
                                  <option value="items-stretch">stretch</option>
                                  <option value="items-start">flex-start / start</option>
                                  <option value="items-end">flex-end / end</option>
                                  <option value="items-center">center</option>
                                  <option value="items-baseline">baseline</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                            </div>

                            {/* flex-wrap */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-mono">flex-wrap</label>
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "flexWrap")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "flexWrap", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
                                >
                                  <option value="">nowrap (default)</option>
                                  <option value="flex-nowrap">nowrap</option>
                                  <option value="flex-wrap">wrap</option>
                                  <option value="flex-wrap-reverse">wrap-reverse</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                            </div>

                            {/* item gap with dual-nature instructions */}
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-mono font-bold">item gap</label>
                                <span className="text-[8px] text-purple-700 bg-purple-50 px-1 py-0.5 rounded font-bold uppercase tracking-wide">Dual-Nature</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="relative">
                                  <select
                                    value={getActiveGroupClass(selectedElement.classes, "gap")}
                                    onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "gap", e.target.value) }))}
                                    className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
                                  >
                                    <option value="">default / custom option</option>
                                    <option value="gap-0">0px</option>
                                    <option value="gap-1">4px</option>
                                    <option value="gap-2">8px</option>
                                    <option value="gap-3">12px</option>
                                    <option value="gap-4">16px</option>
                                    <option value="gap-6">24px</option>
                                    <option value="gap-8">32px</option>
                                  </select>
                                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                                </div>
                                <input
                                  type="text"
                                  placeholder="custom e.g. 15px"
                                  value={parseArbitraryValue(selectedElement.classes, "gap-")}
                                  onChange={(e) => updateArbitraryClass("gap-", e.target.value)}
                                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-purple-400"
                                />
                              </div>
                              <p className="text-[9px] text-purple-700 leading-snug bg-purple-50/40 p-2 rounded-xl border border-purple-100/30 font-sans font-medium">
                                💡 **Gap Dual-Nature:** Spacing applies column-wise in standard horizontal rows, and row-wise in vertical columns (`flex-col`) automatically.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* --- 3. FLEXBOX ITEMS SUB-CATEGORY --- */}
                        <div className="border-t border-stone-200/40 pt-4.5 space-y-4 font-sans select-none">
                          <div className="text-[10px] uppercase font-bold tracking-wider text-stone-500 font-mono flex items-center gap-1.5">
                            <Sparkles size={11} className="text-purple-600" />
                            <span>Flexbox Items (Child overrides)</span>
                          </div>

                          {/* flex-grow & shrink */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">flex-grow</label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "flexGrow")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "flexGrow", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">default (0)</option>
                                  <option value="grow-0">0 (grow-0)</option>
                                  <option value="grow">1 (grow)</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                              <input
                                type="text"
                                placeholder="custom e.g. 2.5"
                                value={parseArbitraryValue(selectedElement.classes, "grow-")}
                                onChange={(e) => updateArbitraryClass("grow-", e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-purple-400 font-medium"
                              />
                            </div>
                          </div>

                          {/* flex-shrink */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">flex-shrink</label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "flexShrink")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "flexShrink", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">default (1)</option>
                                  <option value="shrink">1 (shrink)</option>
                                  <option value="shrink-0">0 (shrink-0)</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                              <input
                                type="text"
                                placeholder="custom e.g. 3"
                                value={parseArbitraryValue(selectedElement.classes, "shrink-")}
                                onChange={(e) => updateArbitraryClass("shrink-", e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-purple-400 font-medium"
                              />
                            </div>
                          </div>

                          {/* flex-basis */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">flex-basis</label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="relative">
                                <select
                                  value={getPrefixedClass(selectedElement.classes, "basis-")}
                                  onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "basis-", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">default / custom</option>
                                  <option value="basis-auto">auto</option>
                                  <option value="basis-full">100% (full)</option>
                                  <option value="basis-1/2">50% (half)</option>
                                  <option value="basis-1/3">33.33% (third)</option>
                                  <option value="basis-1/4">25% (quarter)</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                              <input
                                type="text"
                                placeholder="e.g. 200px, 15rem"
                                value={parseArbitraryValue(selectedElement.classes, "basis-")}
                                onChange={(e) => updateArbitraryClass("basis-", e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-purple-400 font-medium"
                              />
                            </div>
                          </div>

                          {/* align-self override */}
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono">align-self</label>
                              <span className="text-[8px] text-purple-700 bg-purple-50 px-1 py-0.5 rounded font-bold uppercase tracking-wide">Override</span>
                            </div>
                            <div className="relative font-sans">
                              <select
                                value={getActiveGroupClass(selectedElement.classes, "alignSelf")}
                                onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "alignSelf", e.target.value) }))}
                                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                              >
                                <option value="">auto (inherits container items-align)</option>
                                <option value="self-auto">auto</option>
                                <option value="self-normal">normal</option>
                                <option value="self-stretch">stretch</option>
                                <option value="self-start">flex-start / start</option>
                                <option value="self-end">flex-end / end</option>
                                <option value="self-center">center</option>
                                <option value="self-baseline">baseline</option>
                              </select>
                              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                            </div>
                            <p className="text-[9px] text-purple-800 leading-relaxed bg-purple-50/40 p-2.5 rounded-xl border border-purple-100/30 font-medium">
                              👉 **Alignment Override:** Parent container's `align-items` sets the default vertical alignment for children; individual items can override it with `align-self` directly.
                            </p>
                          </div>

                          {/* order */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono font-bold">order</label>
                            <div className="grid grid-cols-2 gap-2 font-sans font-mono font-sans">
                              <div className="relative">
                                <select
                                  value={getPrefixedClass(selectedElement.classes, "order-")}
                                  onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "order-", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">default / custom</option>
                                  <option value="order-first">first (order-first)</option>
                                  <option value="order-last">last (order-last)</option>
                                  <option value="order-1">order-1</option>
                                  <option value="order-2">order-2</option>
                                  <option value="order-3">order-3</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                              <input
                                type="text"
                                placeholder="custom order integer"
                                value={parseArbitraryValue(selectedElement.classes, "order-")}
                                onChange={(e) => updateArbitraryClass("order-", e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-purple-400 font-medium"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* --- 3. GRID LAYOUT CATEGORY --- */}
                  <div className={`border rounded-2xl p-3.5 space-y-1 transition-all duration-300 shadow-sm ${
                    isGridContext 
                      ? "bg-stone-50/50 border-stone-200/50" 
                      : "bg-stone-100/30 border-stone-200/30 opacity-75"
                  }`}>
                    {sectionHeader("grid", "Grid Container", Grid, !isGridContext ? "⚠️ Inactive (Display is not Grid)" : undefined)}
                    {expandedLayoutSections.grid && (
                      <div className="space-y-4 pt-3 animate-in fade-in duration-200">
                        {!isGridContext ? (
                          <div className="bg-purple-50/30 border border-purple-100 rounded-xl p-3.5 text-center space-y-2">
                            <div className="text-purple-700 font-bold text-[11px] font-sans">Convert Layout to Grid</div>
                            <p className="text-[10px] text-purple-600 leading-normal font-medium max-w-[210px] mx-auto">
                              To edit template columns, spans, rows, gaps, and placement properties, change layout display type to grid.
                            </p>
                            <button
                              type="button"
                              onClick={() => updateTree((n) => ({ classes: setGroupClass(n.classes, "display", "grid") }))}
                              className="w-full h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5 mr-auto ml-auto"
                            >
                              <Grid size={11} /> Convert to Grid
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3.5">
                            {/* Columns template */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">grid-template-columns</label>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="relative">
                                  <select
                                    value={getPrefixedClass(selectedElement.classes, "grid-cols-")}
                                    onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "grid-cols-", e.target.value) }))}
                                    className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                  >
                                    <option value="">default / custom</option>
                                    <option value="grid-cols-1">1 Col</option>
                                    <option value="grid-cols-2">2 Cols</option>
                                    <option value="grid-cols-3">3 Cols</option>
                                    <option value="grid-cols-4">4 Cols</option>
                                    <option value="grid-cols-6">6 Cols</option>
                                    <option value="grid-cols-12">12 Cols (Standard)</option>
                                  </select>
                                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                                </div>
                                <input
                                  type="text"
                                  placeholder="custom e.g. 1fr 2fr"
                                  value={parseArbitraryValue(selectedElement.classes, "grid-cols-")}
                                  onChange={(e) => updateArbitraryClass("grid-cols-", e.target.value)}
                                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-purple-400 font-medium"
                                />
                              </div>
                            </div>

                            {/* Rows template */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">grid-template-rows</label>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="relative">
                                  <select
                                    value={getPrefixedClass(selectedElement.classes, "grid-rows-")}
                                    onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "grid-rows-", e.target.value) }))}
                                    className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                  >
                                    <option value="">default / custom</option>
                                    <option value="grid-rows-1">1 Row</option>
                                    <option value="grid-rows-2">2 Rows</option>
                                    <option value="grid-rows-3">3 Rows</option>
                                    <option value="grid-rows-4">4 Rows</option>
                                    <option value="grid-rows-6">6 Rows</option>
                                  </select>
                                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                                </div>
                                <input
                                  type="text"
                                  placeholder="custom e.g. 100px auto"
                                  value={parseArbitraryValue(selectedElement.classes, "grid-rows-")}
                                  onChange={(e) => updateArbitraryClass("grid-rows-", e.target.value)}
                                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-purple-400 font-medium"
                                />
                              </div>
                            </div>

                            {/* justify-items */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">justify-items</label>
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "justifyItems")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "justifyItems", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">normal / stretch (default)</option>
                                  <option value="justify-items-normal">normal</option>
                                  <option value="justify-items-stretch">stretch</option>
                                  <option value="justify-items-center">center</option>
                                  <option value="justify-items-start">start</option>
                                  <option value="justify-items-end">end</option>
                                  <option value="justify-items-left">left</option>
                                  <option value="justify-items-right">right</option>
                                  <option value="justify-items-legacy">legacy</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                            </div>

                            {/* align-items */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">align-items</label>
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "alignment")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "alignment", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">normal / stretch (default)</option>
                                  <option value="items-normal">normal</option>
                                  <option value="items-stretch">stretch</option>
                                  <option value="items-center">center</option>
                                  <option value="items-start">start</option>
                                  <option value="items-end">end</option>
                                  <option value="items-baseline">baseline</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                            </div>

                            {/* item gap with dual-nature instructions */}
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono font-bold">item gap</label>
                                <span className="text-[8px] text-purple-700 bg-purple-50 px-1 py-0.5 rounded font-bold uppercase tracking-wide">Dual-Nature</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="relative">
                                  <select
                                    value={getActiveGroupClass(selectedElement.classes, "gap")}
                                    onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "gap", e.target.value) }))}
                                    className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                  >
                                    <option value="">default / custom option</option>
                                    <option value="gap-0">0px</option>
                                    <option value="gap-1">4px</option>
                                    <option value="gap-2">8px</option>
                                    <option value="gap-3">12px</option>
                                    <option value="gap-4">16px</option>
                                    <option value="gap-6">24px</option>
                                    <option value="gap-8">32px</option>
                                  </select>
                                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                                </div>
                                <input
                                  type="text"
                                  placeholder="custom e.g. 1.25rem"
                                  value={parseArbitraryValue(selectedElement.classes, "gap-")}
                                  onChange={(e) => updateArbitraryClass("gap-", e.target.value)}
                                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-purple-400 font-medium"
                                />
                              </div>
                              <p className="text-[9px] text-purple-700 leading-snug bg-purple-50/40 p-2 rounded-xl border border-purple-100/30 font-sans font-medium">
                                💡 **Grid Gap Dual-Nature:** Spacing applies column-wise and row-wise across cellular layouts seamlessly.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* --- 4. GRID ITEMS SUB-CATEGORY --- */}
                        <div className="border-t border-stone-200/40 pt-4.5 space-y-4 font-sans select-none">
                          <div className="text-[10px] uppercase font-bold tracking-wider text-stone-500 font-mono flex items-center gap-1.5">
                            <Sparkles size={11} className="text-purple-600" />
                            <span>Grid Items (Child placement)</span>
                          </div>

                          {/* Column Spanning */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">grid-column (spanning)</label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="relative">
                                <select
                                  value={getPrefixedClass(selectedElement.classes, "col-span-")}
                                  onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "col-span-", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">default / custom span</option>
                                  <option value="col-span-1">col-span-1</option>
                                  <option value="col-span-2">col-span-2</option>
                                  <option value="col-span-3">col-span-3</option>
                                  <option value="col-span-4">col-span-4</option>
                                  <option value="col-span-6">col-span-6</option>
                                  <option value="col-span-full">col-span-full (all cols)</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                              <input
                                type="text"
                                placeholder="custom span / start e.g. 1 / 3"
                                value={parseArbitraryValue(selectedElement.classes, "col-")}
                                onChange={(e) => updateArbitraryClass("col-", e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-purple-400 font-medium"
                              />
                            </div>
                          </div>

                          {/* Row Spanning */}
                          <div className="flex flex-col gap-1.5 font-mono">
                            <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono font-sans font-bold">grid-row (spanning)</label>
                            <div className="grid grid-cols-2 gap-2 font-sans font-mono font-sans">
                              <div className="relative">
                                <select
                                  value={getPrefixedClass(selectedElement.classes, "row-span-")}
                                  onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "row-span-", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">default / custom span</option>
                                  <option value="row-span-1">row-span-1</option>
                                  <option value="row-span-2">row-span-2</option>
                                  <option value="row-span-3">row-span-3</option>
                                  <option value="row-span-full">row-span-full</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                              <input
                                type="text"
                                placeholder="custom row e.g. span 2"
                                value={parseArbitraryValue(selectedElement.classes, "row-")}
                                onChange={(e) => updateArbitraryClass("row-", e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-purple-400 font-medium"
                              />
                            </div>
                          </div>

                          {/* justify-self & align-self override */}
                          <div className="grid grid-cols-2 gap-3">
                            {/* justify-self */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">justify-self</label>
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "justifySelf")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "justifySelf", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">auto</option>
                                  <option value="justify-self-auto">auto</option>
                                  <option value="justify-self-normal">normal</option>
                                  <option value="justify-self-stretch">stretch</option>
                                  <option value="justify-self-start">start</option>
                                  <option value="justify-self-end">end</option>
                                  <option value="justify-self-center">center</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                            </div>

                            {/* align-self */}
                            <div className="flex flex-col gap-1.5 font-mono">
                              <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-sans font-bold">align-self</label>
                              <div className="relative font-sans">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, "alignSelf")}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "alignSelf", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                                >
                                  <option value="">auto</option>
                                  <option value="self-auto">auto</option>
                                  <option value="self-start">start</option>
                                  <option value="self-end">end</option>
                                  <option value="self-center">center</option>
                                  <option value="self-stretch">stretch</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                            </div>
                          </div>

                          {/* Grid Area Name key-mapping */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-stone-505 font-bold uppercase tracking-wider pl-1 font-mono">grid-area</label>
                            <input
                              type="text"
                              placeholder="e.g. header, main, sidebar"
                              value={(() => {
                                const cls = selectedElement.classes.split(/\s+/).find((c) => c.startsWith("[grid-area:") && c.endsWith("]"));
                                return cls ? cls.substring("[grid-area:".length, cls.length - 1) : "";
                              })()}
                              onChange={(e) => {
                                const val = e.target.value.trim();
                                const currentTokens = selectedElement.classes.split(/\s+/).filter(Boolean);
                                let filtered = currentTokens.filter((token) => !token.startsWith("[grid-area:"));
                                if (val) {
                                  filtered.push(`[grid-area:${val}]`);
                                }
                                updateTree((n) => ({ classes: filtered.join(" ") }));
                              }}
                              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 shadow-xs focus:outline-none placeholder-stone-400 focus:border-purple-400 font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* --- 4. POSITIONING --- */}
                  <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-1 shadow-sm">
                    {sectionHeader("position", "Positioning Scheme & Offsets", Move)}
                    {expandedLayoutSections.position && (
                      <div className="space-y-4 animate-in fade-in duration-200 pt-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] text-stone-505 font-semibold uppercase tracking-wider pl-1">Positioning Scheme</label>
                          <div className="relative">
                            <select
                              value={getActiveGroupClass(selectedElement.classes, "position")}
                              onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "position", e.target.value) }))}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-xs"
                            >
                              <option value="">default (static)</option>
                              <option value="relative">relative</option>
                              <option value="absolute">absolute</option>
                              <option value="fixed">fixed (viewport stick)</option>
                              <option value="sticky">sticky (scroll offset stick)</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                        </div>

                        {/* Coordinates Offset Detail */}
                        <div className="space-y-4 pt-1">
                          <div className="grid grid-cols-2 gap-3">
                            {["top", "right", "bottom", "left"].map((dir) => {
                              const prefix = `${dir}-`;
                              const currentVal = getPrefixedClass(selectedElement.classes, prefix);
                              return (
                                <div key={dir} className="flex flex-col gap-1">
                                  <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1 font-mono">{dir}</label>
                                  <div className="grid grid-cols-1 gap-1">
                                    <div className="relative">
                                      <select
                                        value={currentVal}
                                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, prefix, e.target.value) }))}
                                        className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-2 pr-6 py-1 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-xs"
                                      >
                                        <option value="">auto</option>
                                        <option value={`${prefix}0`}>{prefix}0</option>
                                        <option value={`${prefix}1`}>{prefix}1</option>
                                        <option value={`${prefix}2`}>{prefix}2</option>
                                        <option value={`${prefix}4`}>{prefix}4</option>
                                        <option value={`${prefix}8`}>{prefix}8</option>
                                        <option value={`${prefix}12`}>{prefix}12</option>
                                        <option value={`${prefix}16`}>{prefix}16</option>
                                        <option value={`-${prefix}2`}>-{prefix}2</option>
                                        <option value={`-${prefix}4`}>-{prefix}4</option>
                                      </select>
                                      <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="custompx"
                                      value={parseArbitraryValue(selectedElement.classes, prefix)}
                                      onChange={(e) => updateArbitraryClass(prefix, e.target.value)}
                                      className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1 text-[11px] text-stone-700 focus:outline-none placeholder-stone-400"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Shorthand Inset */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1 font-mono">inset</label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="relative">
                                <select
                                  value={getPrefixedClass(selectedElement.classes, "inset-")}
                                  onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "inset-", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-xs"
                                >
                                  <option value="">none (auto)</option>
                                  <option value="inset-0">inset-0</option>
                                  <option value="inset-2">inset-2 (8px)</option>
                                  <option value="inset-4">inset-4 (16px)</option>
                                  <option value="inset-auto">inset-auto</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                              <input
                                type="text"
                                placeholder="custom e.g. 10%"
                                value={parseArbitraryValue(selectedElement.classes, "inset-")}
                                onChange={(e) => updateArbitraryClass("inset-", e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* z-index */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-mono">z-index</label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="relative">
                                <select
                                  value={getPrefixedClass(selectedElement.classes, "z-")}
                                  onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "z-", e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-xs"
                                >
                                  <option value="">auto</option>
                                  <option value="z-0">z-0</option>
                                  <option value="z-10">z-10</option>
                                  <option value="z-20">z-30</option>
                                  <option value="z-50">z-50</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                              <input
                                type="text"
                                placeholder="custom index e.g. 99"
                                value={parseArbitraryValue(selectedElement.classes, "z-")}
                                onChange={(e) => updateArbitraryClass("z-", e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* --- 5. OVERFLOW --- */}
                  <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-1 shadow-sm">
                    {sectionHeader("overflow", "Overflow & scrolling behavior", Layers)}
                    {expandedLayoutSections.overflow && (
                      <div className="flex flex-col gap-4 animate-in fade-in duration-200 pt-3">
                        {/* Global */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1 font-mono">overflow</label>
                          <div className="relative">
                            <select
                              value={getActiveGroupClass(selectedElement.classes, "overflow")}
                              onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "overflow", e.target.value) }))}
                              className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
                            >
                              <option value="">default (visible)</option>
                              <option value="overflow-auto">overflow-auto</option>
                              <option value="overflow-hidden">overflow-hidden</option>
                              <option value="overflow-clip">overflow-clip</option>
                              <option value="overflow-visible">overflow-visible</option>
                              <option value="overflow-scroll">overflow-scroll</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                        </div>

                        {/* X / Y */}
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: "overflowX" as const, label: "overflow-x", options: [{ v: "", l: "auto" }, { v: "overflow-x-auto", l: "auto" }, { v: "overflow-x-hidden", l: "hidden" }, { v: "overflow-x-clip", l: "clip" }, { v: "overflow-x-scroll", l: "scroll" }] },
                            { id: "overflowY" as const, label: "overflow-y", options: [{ v: "", l: "auto" }, { v: "overflow-y-auto", l: "auto" }, { v: "overflow-y-hidden", l: "hidden" }, { v: "overflow-y-clip", l: "clip" }, { v: "overflow-y-scroll", l: "scroll" }] }
                          ].map((sel) => (
                            <div key={sel.id} className="flex flex-col gap-1.5">
                              <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1 font-mono">{sel.label}</label>
                              <div className="relative">
                                <select
                                  value={getActiveGroupClass(selectedElement.classes, sel.id)}
                                  onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, sel.id, e.target.value) }))}
                                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-2 pr-6 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
                                >
                                  {sel.options.map((opt) => (
                                    <option key={opt.v} value={opt.v}>{opt.l}</option>
                                  ))}
                                </select>
                                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* scroll behavior & snap */}
                        {[
                          { id: "scrollBehavior" as const, label: "scroll-behavior", options: [{ v: "", l: "default" }, { v: "scroll-auto", l: "scroll-auto" }, { v: "scroll-smooth", l: "scroll-smooth" }] },
                          { id: "scrollSnapType" as const, label: "scroll-snap-type", options: [{ v: "", l: "none" }, { v: "snap-none", l: "snap-none" }, { v: "snap-x", l: "snap-x" }, { v: "snap-y", l: "snap-y" }, { v: "snap-both", l: "snap-both" }] }
                        ].map((sel) => (
                          <div key={sel.id} className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1 font-mono">{sel.label}</label>
                            <div className="relative">
                              <select
                                value={getActiveGroupClass(selectedElement.classes, sel.id)}
                                onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, sel.id, e.target.value) }))}
                                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
                              >
                                {sel.options.map((opt) => (
                                  <option key={opt.v} value={opt.v}>{opt.l}</option>
                                ))}
                              </select>
                              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ==================== 2. TYPOGRAPHY & TEXT ==================== */}
        {inspectorSection === "typography" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2">
              <Type size={15} className="text-purple-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Typography & Layout</span>
            </div>
            
            {/* Sub-Category: Core Typography Styles */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Type size={11} />
                <span>Text styling & Font styles</span>
              </div>

              {/* Font Family Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Font Family</label>
                <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-stone-200/80 shadow-sm">
                  {(["font-sans", "font-serif", "font-mono"] as const).map((font) => {
                    const isActive = getActiveGroupClass(selectedElement.classes, "fontFamily") === font;
                    return (
                      <button
                        key={font} type="button"
                        onClick={() => updateTree((n) => ({ classes: setGroupClass(n.classes, "fontFamily", font) }))}
                        className={`py-1.5 rounded-lg text-xs transition-all duration-200 font-semibold flex items-center justify-center capitalize cursor-pointer ${
                          isActive 
                            ? "bg-purple-600 text-white shadow-sm font-bold border border-purple-500" 
                            : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
                        }`}
                      >
                        {font.replace("font-", "")}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Alignment Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Horizontal text Alignment</label>
                <div className="grid grid-cols-4 gap-1 bg-white p-1 rounded-xl border border-stone-200/80 shadow-sm">
                  {([
                    { key: "text-left", icon: <AlignLeft size={14} /> },
                    { key: "text-center", icon: <AlignCenter size={14} /> },
                    { key: "text-right", icon: <AlignRight size={14} /> },
                    { key: "text-justify", icon: <AlignJustify size={14} /> },
                  ] as const).map((align) => {
                    const isActive = getActiveGroupClass(selectedElement.classes, "textAlign") === align.key;
                    return (
                      <button
                        key={align.key} type="button"
                        onClick={() => updateTree((n) => ({ classes: setGroupClass(n.classes, "textAlign", align.key) }))}
                        className={`py-2 rounded-lg transition-all duration-150 flex justify-center items-center cursor-pointer ${
                          isActive 
                            ? "bg-purple-50 text-purple-700 shadow-sm border border-purple-200" 
                            : "text-stone-400 hover:text-stone-800 hover:bg-stone-100"
                        }`}
                      >
                        {align.icon}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Size & Weight Selectors */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Font Size</label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(selectedElement.classes, "textSize")}
                      onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "textSize", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 cursor-pointer shadow-sm"
                    >
                      <option value="">Default (Base)</option>
                      <option value="text-xs">XS (12px)</option>
                      <option value="text-sm">SM (14px)</option>
                      <option value="text-base">Base (16px)</option>
                      <option value="text-lg">LG (18px)</option>
                      <option value="text-xl">XL (20px)</option>
                      <option value="text-2xl">2XL (24px)</option>
                      <option value="text-3xl">3XL (30px)</option>
                      <option value="text-4xl">4XL (36px)</option>
                      <option value="text-5xl">5XL (48px)</option>
                      <option value="text-6xl">6XL (60px)</option>
                      <option value="text-7xl">7XL (72px)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Font Weight</label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(selectedElement.classes, "fontWeight")}
                      onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "fontWeight", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 cursor-pointer shadow-sm"
                    >
                      <option value="">Default</option>
                      <option value="font-light">Light (300)</option>
                      <option value="font-normal">Normal (400)</option>
                      <option value="font-medium">Medium (500)</option>
                      <option value="font-semibold">Semi Bold (600)</option>
                      <option value="font-bold">Bold (700)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Category: Text Spacing & Flow */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Move size={11} />
                <span>Text tracking & Line Height</span>
              </div>

              {/* Letter Spacing (Tracking) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Letter Spacing (Tracking)</label>
                <div className="relative">
                  <select
                    value={getActiveGroupClass(selectedElement.classes, "tracking")}
                    onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "tracking", e.target.value) }))}
                    className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                  >
                    <option value="">Default (Normal)</option>
                    <option value="tracking-tighter">Tighter (-0.05em)</option>
                    <option value="tracking-tight">Tight (-0.025em)</option>
                    <option value="tracking-normal">Normal (0em)</option>
                    <option value="tracking-wide">Wide (0.025em)</option>
                    <option value="tracking-widest">Widest (0.1em)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>
              </div>

              {/* Line Height (Leading) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Line Height (Leading)</label>
                <div className="relative">
                  <select
                    value={getActiveGroupClass(selectedElement.classes, "leading")}
                    onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "leading", e.target.value) }))}
                    className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                  >
                    <option value="">Default</option>
                    <option value="leading-none">Tightest (1)</option>
                    <option value="leading-tight">Tight (1.25)</option>
                    <option value="leading-snug">Snug (1.375)</option>
                    <option value="leading-normal">Normal (1.5)</option>
                    <option value="leading-relaxed">Relaxed (1.625)</option>
                    <option value="leading-loose">Loose (2)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. APPEARANCE & VISUALS ==================== */}
        {inspectorSection === "visuals" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Palette size={15} className="text-purple-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Appearance & Visual styles</span>
            </div>

            {/* Sub-Category: Color palettes */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Palette size={11} />
                <span>Colors & Solid Backgrounds</span>
              </div>

              {/* Background Color Swatches */}
              <div className="flex flex-col gap-3">
                <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Background Fill</label>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { name: "Transparent", class: "bg-transparent", ring: "ring-stone-200", render: <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 opacity-50" /> },
                    { name: "White", class: "bg-white", ring: "ring-stone-200" },
                    { name: "Soft Stone", class: "bg-stone-50", ring: "ring-stone-200" },
                    { name: "Deep Stone", class: "bg-stone-900", ring: "ring-stone-900" },
                    { name: "Slate Noir", class: "bg-slate-950", ring: "ring-slate-950" },
                    { name: "Warm Vanilla", class: "bg-amber-50", ring: "ring-amber-200" },
                    { name: "Teal Pine", class: "bg-emerald-900", ring: "ring-emerald-900" },
                    { name: "Cosmic Indigo", class: "bg-indigo-950", ring: "ring-indigo-950" },
                    { name: "Aura Purple", class: "bg-purple-100", ring: "ring-purple-300" },
                    { name: "Soft Amber", class: "bg-amber-100", ring: "ring-amber-300" }
                  ].map((swatch) => {
                    const isSelected = selectedElement.classes.includes(swatch.class) || 
                      (swatch.class === "bg-transparent" && !selectedElement.classes.match(/\bbg-\w+/));
                    
                    return (
                      <button
                        key={swatch.name}
                        type="button"
                        onClick={() => {
                          let textClass = "";
                          if (["bg-stone-900", "bg-slate-950", "bg-emerald-900", "bg-indigo-950"].includes(swatch.class)) {
                            textClass = "text-stone-100";
                          } else if (swatch.class === "bg-transparent") {
                            textClass = "";
                          } else {
                            textClass = "text-stone-800";
                          }
                          updateTree((n) => {
                            let updated = setColorClass(n.classes, "bg-", swatch.class);
                            if (textClass) {
                              updated = setColorClass(updated, "text-", textClass);
                            }
                            return { classes: updated };
                          });
                        }}
                        title={swatch.name}
                        className={`w-8 h-8 rounded-full relative shadow-sm cursor-pointer transition-all duration-200 hover:scale-110 flex items-center justify-center overflow-hidden border ${swatch.class} ${
                          isSelected 
                            ? `ring-2 ${swatch.ring} ring-offset-2 border-transparent scale-105` 
                            : "border-stone-200/80 hover:border-text"
                        }`}
                      >
                        {swatch.render}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Accent Colors selector */}
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Primary Text Accent</label>
                <div className="relative">
                  <select
                    value={selectedElement.classes.match(/\btext-(stone-800|stone-100|purple-600|indigo-600|emerald-600|amber-600|rose-600|white|black)\b/)?.[0] || ""}
                    onChange={(e) => {
                      updateTree((n) => ({ classes: setColorClass(n.classes, "text-", e.target.value) }));
                    }}
                    className="w-full appearance-none bg-white border border-stone-200/85 rounded-xl pl-3 pr-8 py-2.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                  >
                    <option value="">Default (Inherited)</option>
                    <option value="text-stone-800">Deep Earth Gray (text-stone-800)</option>
                    <option value="text-white">Crisp White (text-white)</option>
                    <option value="text-purple-600">Dynamic Purple (text-purple-600)</option>
                    <option value="text-indigo-600">Cosmic Indigo (text-indigo-600)</option>
                    <option value="text-emerald-600">Emerald Forest (text-emerald-600)</option>
                    <option value="text-amber-600">Vibrant Amber (text-amber-600)</option>
                    <option value="text-rose-600">Bright Rose (text-rose-600)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Sub-Category: Borders & Layout Effects */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Layers size={11} />
                <span>Borders, corners & drop shadows</span>
              </div>

              {[
                { 
                  label: "Border Radius (Corners)", 
                  prop: "rounding",
                  options: [
                    { val: "rounded-none", text: "Flat Bounds (None)" },
                    { val: "rounded-sm", text: "Small Curves (Rounded-sm)" },
                    { val: "rounded", text: "Mild Rounded (Rounded)" },
                    { val: "rounded-md", text: "Medium Corners" },
                    { val: "rounded-lg", text: "Large Bounds" },
                    { val: "rounded-xl", text: "Card standard (Rounded-xl)" },
                    { val: "rounded-2xl", text: "Pill/Button standard (2XL)" },
                    { val: "rounded-3xl", text: "Expressive Container (3XL)" },
                    { val: "rounded-full", text: "Pill/Circle (Rounded-full)" }
                  ]
                },
                { 
                  label: "Border Stroke Weight", 
                  prop: "borderWidth",
                  options: [
                    { val: "border-0", text: "Seamless (Zero Borders)" },
                    { val: "border", text: "1px Hairline (border)" },
                    { val: "border-2", text: "2px Precise outline" },
                    { val: "border-4", text: "4px Dynamic frame" },
                    { val: "border-8", text: "8px Heavy border frame" }
                  ]
                },
                { 
                  label: "Shading & Depth (Box Shadow)", 
                  prop: "shadow",
                  options: [
                    { val: "shadow-none", text: "Flat Surface (No Shadow)" },
                    { val: "shadow-sm", text: "Subtle Lift-up (sm)" },
                    { val: "shadow", text: "Ambient Hover Soft (shadow)" },
                    { val: "shadow-md", text: "Double-layered depth (md)" },
                    { val: "shadow-lg", text: "Large floating shadow (lg)" },
                    { val: "shadow-xl", text: "Major Depth Elevation (xl)" },
                    { val: "shadow-2xl", text: "Maximum Contrast Floating (2xl)" }
                  ]
                }
              ].map((control) => (
                <div key={control.label} className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">{control.label}</label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(selectedElement.classes, control.prop as any)}
                      onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, control.prop as any, e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2.5 text-xs text-stone-700 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 cursor-pointer shadow-sm"
                    >
                      {control.options.map(opt => <option key={opt.val} value={opt.val}>{opt.text}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 4. MOTION & EFFECTS ==================== */}
        {inspectorSection === "motion" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Play size={15} className="text-purple-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Movement & Micro-interactions</span>
            </div>

            {/* Sub-Category: Smooth CSS Transitions */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Play size={11} />
                <span>Transition Curves & Speeds</span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Target Property</label>
                  <div className="relative">
                    <select
                      value={selectedElement.classes.match(/\btransition(-all|-colors|-opacity|-shadow|-transform)?\b/)?.[0] || "none"}
                      onChange={(e) => {
                        updateTree((n) => {
                          let newClasses = n.classes.replace(/\btransition(-all|-colors|-opacity|-shadow|-transform)?\b/g, "").replace(/\s+/g, " ").trim();
                          if (e.target.value !== "none") newClasses += ` ${e.target.value}`;
                          return { classes: newClasses.trim() };
                        });
                      }}
                      className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="none">No Transition</option>
                      <option value="transition-all">All styling variables (transition-all)</option>
                      <option value="transition">Default CSS Props (transition)</option>
                      <option value="transition-colors">Colors, backgrounds, borders</option>
                      <option value="transition-opacity">Opacity only</option>
                      <option value="transition-transform">Position, transforms & scale</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Animate Duration</label>
                  <div className="relative">
                    <select
                      value={selectedElement.classes.match(/\bduration-\d+\b/)?.[0] || "none"}
                      onChange={(e) => {
                        updateTree((n) => {
                          let newClasses = n.classes.replace(/\bduration-\d+\b/g, "").replace(/\s+/g, " ").trim();
                          if (e.target.value !== "none") newClasses += ` ${e.target.value}`;
                          return { classes: newClasses.trim() };
                        });
                      }}
                      className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="none">Default Speed (150ms)</option>
                      <option value="duration-75">75ms (Ultra Snappy)</option>
                      <option value="duration-150">150ms (Regular Click)</option>
                      <option value="duration-300">300ms (Smooth transition)</option>
                      <option value="duration-500">500ms (Noticeable slide)</option>
                      <option value="duration-700">700ms (Polished slower scroll)</option>
                      <option value="duration-1000">1000ms (1 second transition)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Easing Timing Curve</label>
                  <div className="relative">
                    <select
                      value={selectedElement.classes.match(/\bease-(linear|in|out|in-out)\b/)?.[0] || "none"}
                      onChange={(e) => {
                        updateTree((n) => {
                          let newClasses = n.classes.replace(/\bease-(linear|in|out|in-out)\b/g, "").replace(/\s+/g, " ").trim();
                          if (e.target.value !== "none") newClasses += ` ${e.target.value}`;
                          return { classes: newClasses.trim() };
                        });
                      }}
                      className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="none">Default Timing</option>
                      <option value="ease-linear">Linear (constant rate)</option>
                      <option value="ease-in">Ease-In (starts slow)</option>
                      <option value="ease-out">Ease-Out (curves out / decelerates)</option>
                      <option value="ease-in-out">Ease-In-Out (organic bell curve)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Category: Interactive micro-inputs / Animations */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Wand2 size={11} />
                <span>Hover presets & infinite motion</span>
              </div>

              {/* Quick toggle chips */}
              <div className="flex flex-col gap-2.5">
                {[
                  { label: "Scale Lift-up on Hover", class: "hover:scale-[1.03]" },
                  { label: "Slight Rotation on Hover", class: "hover:rotate-3" },
                  { label: "Hover Lift Shadow", class: "hover:shadow-md" },
                  { label: "Gentle Fade-In Entry", class: "animate-fade-in" },
                  { label: "Infinite Ambient Pulse", class: "animate-pulse" },
                  { label: "Attention Bounce loop", class: "animate-bounce" }
                ].map((item) => {
                  const isActive = selectedElement.classes.includes(item.class);
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        updateTree((node) => {
                          let updatedClasses = node.classes;
                          if (isActive) {
                            updatedClasses = updatedClasses.replace(item.class, "");
                          } else {
                            updatedClasses += ` transition-all duration-300 ${item.class}`;
                          }
                          return { classes: updatedClasses.replace(/\s+/g, " ").trim() };
                        });
                      }}
                      className={`w-full py-2 px-3 text-xs rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                        isActive 
                          ? "bg-purple-100/50 border-purple-200 text-purple-700 font-semibold" 
                          : "bg-white border-stone-200/60 text-stone-600 hover:text-stone-800 hover:border-stone-300"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-purple-600" : "bg-stone-200"}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 5. CORE DETAILS & CUSTOM CODE ==================== */}
        {inspectorSection === "core" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={15} className="text-purple-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Content & Custom Utilities</span>
            </div>

            {/* Sub-Category: Content details */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Compass size={11} />
                <span>Text / URL Attributes</span>
              </div>
              
              {selectedElement.content !== undefined ? (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Rendered Node inner content</label>
                  <input
                    type="text"
                    value={selectedElement.content || ""}
                    onChange={(e) => updateTree(() => ({ content: e.target.value }))}
                    className="w-full bg-white border border-stone-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 transition-all font-sans text-stone-800 shadow-sm"
                    placeholder="Type inner text content or image src url..."
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2.5 text-stone-500 bg-white rounded-xl p-4 border border-stone-200/40 shadow-sm">
                  <HelpCircle size={15} className="text-stone-400" />
                  <span className="text-xs font-medium">This structural layout bounds container doesn't accept direct text fields. Select a text layer child to edit wordings.</span>
                </div>
              )}
            </div>

            {/* Sub-Category: Utility classes direct write */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Code size={11} />
                <span>Advanced Tailwind Utility Classes</span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Direct tokens string editor</label>
                <textarea
                  rows={4}
                  value={selectedElement.classes || ""}
                  onChange={(e) => updateTree(() => ({ classes: e.target.value }))}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-3 text-[11px] leading-relaxed focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-500/20 transition-all font-mono text-emerald-400 resize-none shadow-inner"
                  placeholder="flex items-center justify-between px-4 py-2 border border-gray-100..."
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== 6. CSS PROPERTIES CHEATSHEET & DIRECTORY ==================== */}
        {inspectorSection === "help" && (
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-3 duration-350 pr-0.5">
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle size={15} className="text-purple-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">CSS Property Reference</span>
            </div>

            {/* Quick Live Filter Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties, categories or options..."
                className="w-full bg-stone-50 border border-stone-200/80 rounded-xl pl-9 pr-8 py-2.5 text-xs text-stone-700 placeholder-stone-400 focus:outline-none focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all font-sans shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 font-semibold text-[11px] px-1 hover:bg-stone-200/50 rounded cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Interactive Hierarchy Accordions */}
            <div className="flex flex-col gap-4">
              {filteredHierarchy.length === 0 ? (
                <div className="text-center py-8 text-stone-400 bg-stone-50/50 rounded-2xl border border-stone-200/40 p-4">
                  <p className="text-xs font-medium">No CSS properties match "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-xs text-purple-600 font-semibold hover:underline cursor-pointer"
                  >
                    Clear Search Filter
                  </button>
                </div>
              ) : (
                filteredHierarchy.map((category) => {
                  const isExpanded = expandedCategories[category.name] || searchQuery !== "";
                  const totalPropertiesCount = category.subCategories.reduce((acc, sub) => acc + sub.properties.length, 0);

                  return (
                    <div
                      key={category.name}
                      className="bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-sm hover:border-stone-300 transition-all"
                    >
                      {/* Section Accordion Header */}
                      <button
                        type="button"
                        onClick={() => {
                          if (searchQuery === "") {
                            setExpandedCategories(prev => ({
                              ...prev,
                              [category.name]: !prev[category.name]
                            }));
                          }
                        }}
                        disabled={searchQuery !== ""}
                        className={`w-full flex items-center justify-between p-4 bg-stone-50/60 border-b border-stone-100 font-sans cursor-pointer transition-colors ${
                          searchQuery !== "" ? "cursor-default animate-none" : "hover:bg-stone-100/60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <category.icon size={14} className="text-purple-600" />
                          <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wider">
                            {category.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 font-mono">
                            {totalPropertiesCount} props
                          </span>
                          {searchQuery === "" && (
                            <ChevronDown
                              size={14}
                              className={`text-stone-400 transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </div>
                      </button>

                      {/* Section Accordion Content */}
                      {isExpanded && (
                        <div className="p-4 pt-3 flex flex-col gap-4 divide-y divide-stone-100">
                          {category.subCategories.map((subCategory) => (
                            <div key={subCategory.name} className="pt-3 first:pt-0 flex flex-col gap-2.5">
                              {/* SubCategory Heading */}
                              <h4 className="text-[10px] text-purple-600 font-bold uppercase tracking-wider font-sans">
                                {subCategory.name}
                              </h4>

                              {/* Properties Matrix */}
                              <div className="flex flex-col gap-3">
                                {subCategory.properties.map((property) => (
                                  <div
                                    key={property.name}
                                    className="p-3 bg-stone-50/40 border border-stone-200/30 rounded-xl space-y-2 hover:bg-stone-50/90 transition-colors"
                                  >
                                    {/* Property Header */}
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex flex-wrap items-center gap-1.5">
                                        <code
                                          onClick={() => handleCopy(property.name)}
                                          title="Click to copy property name"
                                          className="text-[11.5px] font-mono font-bold text-stone-800 hover:text-purple-700 bg-stone-100/50 px-1.5 py-0.5 rounded cursor-pointer transition-all"
                                        >
                                          {property.name}
                                        </code>
                                        {property.note && (
                                          <span className="text-[10px] text-stone-400 font-medium font-sans">
                                            ({property.note})
                                          </span>
                                        )}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleCopy(property.name)}
                                        className="text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-lg hover:bg-stone-200/40 cursor-pointer"
                                        title="Copy Property Name"
                                      >
                                        <Copy size={11} />
                                      </button>
                                    </div>

                                    {/* Property Values list */}
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                      {property.values.split(/\s*\|\s*/).map((valueItem, vIdx) => {
                                        const trimmedValue = valueItem.trim();
                                        const isCopied = copiedText === trimmedValue;
                                        return (
                                          <button
                                            key={vIdx}
                                            type="button"
                                            onClick={() => handleCopy(trimmedValue)}
                                            style={{ touchAction: "manipulation" }}
                                            className={`px-2 py-0.5 h-6 text-[10px] font-mono rounded-lg border flex items-center gap-1 transition-all duration-150 cursor-pointer select-none ${
                                              isCopied
                                                ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold shadow-sm"
                                                : "bg-white hover:bg-stone-50 border-stone-200/50 text-stone-600 hover:text-stone-800"
                                            }`}
                                          >
                                            <span>{trimmedValue}</span>
                                            {isCopied && <Check size={10} className="text-emerald-600" />}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Micro Quick Notes Footer Tip */}
            <div className="bg-purple-50/50 border border-purple-100/50 rounded-2xl p-4 space-y-1.5 text-[11px] text-stone-600 leading-relaxed font-sans shadow-inner">
              <p className="font-bold text-purple-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Sparkles size={11} />
                <span>Reference Notation Guide:</span>
              </p>
              <ul className="list-disc pl-4 space-y-1 text-stone-500 text-[10.5px]">
                <li><code className="font-mono text-purple-600 font-semibold">&lt;length&gt;</code>: Units like <code className="font-mono bg-purple-50 px-1 py-0.2 rounded text-[10px]">px</code>, <code className="font-mono bg-purple-50 px-1 py-0.2 rounded text-[10px]">rem</code>, <code className="font-mono bg-purple-50 px-1 py-0.2 rounded text-[10px]">em</code>, <code className="font-mono bg-purple-50 px-1 py-0.2 rounded text-[10px]">vw</code>, etc.</li>
                <li><code className="font-mono text-purple-600 font-semibold">&lt;time&gt;</code>: Transition and animation time like <code className="font-mono bg-purple-50 px-1 py-0.2 rounded text-[10px]">s</code> or <code className="font-mono bg-purple-50 px-1 py-0.2 rounded text-[10px]">ms</code>.</li>
                <li>Pills are interactive: **tapping copies values** instantly to clipboard.</li>
              </ul>
            </div>
          </div>
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
