import React from "react";
import { 
  Sparkles, Palette, Maximize, Type, Layers, Play, Code, 
  HelpCircle, Trash2, Copy, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  MousePointer, Grid, Compass, Cpu, Move, Wand2, Sliders, ChevronDown, MoreVertical
} from "lucide-react";
import { useDesigner } from "../contexts/DesignerContext";
import { InspectorSection } from "./InspectorPanel";
import { 
  setGroupClass, getActiveGroupClass, 
  setPrefixedClass, getPrefixedClass, 
  setColorClass,
  STYLE_GROUPS
} from "../styleUtils";

const tabsInfo = [
  { id: "layout", label: "Layout", icon: Maximize },
  { id: "typography", label: "Text", icon: Type },
  { id: "visuals", label: "Visuals", icon: Palette },
  { id: "motion", label: "Motion", icon: Play },
  { id: "core", label: "Code", icon: Sparkles },
  { id: "help", label: "Guide", icon: HelpCircle }
];

export function MobileToolControls() {
  const designer = useDesigner();
  const {
    selectedElement,
    inspectorSection,
    updateTree,
    deleteElement,
    duplicateElement,
    mobileActiveView
  } = designer;

  const getInitialSubCategory = (section: string) => {
    if (section === "layout") return "boxModel";
    if (section === "typography") return "typographyStyles";
    if (section === "visuals") return "colors";
    if (section === "motion") return "transitions";
    if (section === "help") return "guide";
    return "contentDetails";
  };

  const [subCategory, setSubCategory] = React.useState<string>(() => getInitialSubCategory(inspectorSection));
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = React.useState(false);

  // Sync / Reset when active element or tab category changes
  React.useEffect(() => {
    setSubCategory(getInitialSubCategory(inspectorSection));
    setIsDropdownOpen(false);
    setIsActionsDropdownOpen(false);
  }, [selectedElement?.id, inspectorSection]);

  // Render ONLY when inside inspector view and we have a selected element
  if (mobileActiveView !== "inspector" || !selectedElement) return null;

  const classes = selectedElement.classes || "";

  // Dynamic Subcategories Map based on Active Tab aligning exactly with desktop
  const subCategoriesConfig: Record<string, { id: string; label: string; icon: any }[]> = {
    layout: [
      { id: "boxModel", label: "Box Model", icon: Grid },
      { id: "positioning", label: "Positioning", icon: Move },
      { id: "flexbox", label: "Flexbox Layout", icon: Cpu },
      { id: "grid", label: "Grid Layout", icon: Sliders },
      { id: "overflow", label: "Overflow & Scroll", icon: Compass }
    ],
    typography: [
      { id: "typographyStyles", label: "Font Styling", icon: Type },
      { id: "typographySpacing", label: "Text Spacing", icon: AlignCenter }
    ],
    visuals: [
      { id: "colors", label: "Color Palettes", icon: Palette },
      { id: "borders", label: "Borders & Effects", icon: Layers }
    ],
    motion: [
      { id: "transitions", label: "CSS Transitions", icon: Play },
      { id: "animations", label: "Interactive Animations", icon: Sparkles }
    ],
    core: [
      { id: "contentDetails", label: "Content Details", icon: Sparkles },
      { id: "utilityClasses", label: "Utility Classes", icon: Code }
    ],
    help: [
      { id: "guide", label: "Guide", icon: HelpCircle }
    ]
  };

  const isClassActive = (item: { class: string; group?: string; prefix?: string }) => {
    const isGroupKey = item.group && (item.group in STYLE_GROUPS);
    if (isGroupKey) {
      return getActiveGroupClass(classes, item.group as any) === item.class;
    } else if (item.prefix) {
      return classes.split(/\s+/).includes(item.class);
    }
    return classes.split(/\s+/).includes(item.class);
  };

  const handleApplyClass = (item: { class: string; group?: string; prefix?: string }) => {
    updateTree((node) => {
      let nextClasses = node.classes || "";
      const isGroupKey = item.group && (item.group in STYLE_GROUPS);
      
      if (isGroupKey) {
        nextClasses = setGroupClass(nextClasses, item.group as any, item.class);
      } else if (item.prefix) {
        // If already exists exactly, toggle it off
        if (nextClasses.split(/\s+/).includes(item.class)) {
          nextClasses = nextClasses.split(/\s+/).filter(t => t !== item.class).join(" ");
        } else {
          nextClasses = setPrefixedClass(nextClasses, item.prefix, item.class);
        }
      } else {
        // Standard arbitrary class toggle
        const tokens = nextClasses.split(/\s+/).filter(Boolean);
        if (tokens.includes(item.class)) {
          nextClasses = tokens.filter(t => t !== item.class).join(" ");
        } else {
          nextClasses = [...tokens, item.class].join(" ");
        }
      }
      return { classes: nextClasses };
    });
  };

  const renderMiddleControls = () => {
    switch (inspectorSection) {
      case "layout": {
        let layoutItems: { label: string; class: string; group: string; prefix?: string }[] = [];
        if (subCategory === "boxModel") {
          layoutItems = [
            { label: "Auto-W", class: "w-auto", group: "width" },
            { label: "Full-W", class: "w-full", group: "width" },
            { label: "Half-W", class: "w-1/2", group: "width" },
            { label: "1/3-W", class: "w-1/3", group: "width" },
            { label: "2/3-W", class: "w-2/3", group: "width" },
            { label: "1/4-W", class: "w-1/4", group: "width" },
            { label: "3/4-W", class: "w-3/4", group: "width" },
            { label: "Small-W", class: "w-32", group: "width" },
            { label: "Mid-W", class: "w-48", group: "width" },
            { label: "Large-W", class: "w-64", group: "width" },
            { label: "XLarge-W", class: "w-96", group: "width" },
            { label: "Auto-H", class: "h-auto", group: "height" },
            { label: "Full-H", class: "h-full", group: "height" },
            { label: "Small-H", class: "h-12", group: "height" },
            { label: "Tabs-H", class: "h-16", group: "height" },
            { label: "Box-H", class: "h-32", group: "height" },
            { label: "Card-H", class: "h-48", group: "height" },
            { label: "Hero-H", class: "h-64", group: "height" },
            { label: "p-0", class: "p-0", group: "padding", prefix: "p-" },
            { label: "p-1", class: "p-1", group: "padding", prefix: "p-" },
            { label: "p-2", class: "p-2", group: "padding", prefix: "p-" },
            { label: "p-4", class: "p-4", group: "padding", prefix: "p-" },
            { label: "p-6", class: "p-6", group: "padding", prefix: "p-" },
            { label: "p-8", class: "p-8", group: "padding", prefix: "p-" },
            { label: "p-10", class: "p-10", group: "padding", prefix: "p-" },
            { label: "m-0", class: "m-0", group: "margin", prefix: "m-" },
            { label: "m-1", class: "m-1", group: "margin", prefix: "m-" },
            { label: "m-2", class: "m-2", group: "margin", prefix: "m-" },
            { label: "m-4", class: "m-4", group: "margin", prefix: "m-" },
            { label: "m-6", class: "m-6", group: "margin", prefix: "m-" },
            { label: "m-8", class: "m-8", group: "margin", prefix: "m-" },
            { label: "aspect-auto", class: "aspect-auto", group: "aspectRatio" },
            { label: "aspect-1/1", class: "aspect-square", group: "aspectRatio" },
            { label: "aspect-16/9", class: "aspect-video", group: "aspectRatio" },
            { label: "box-border", class: "box-border", group: "boxSizing" },
            { label: "box-content", class: "box-content", group: "boxSizing" }
          ];
        } else if (subCategory === "positioning") {
          layoutItems = [
            { label: "static", class: "static", group: "position" },
            { label: "relative", class: "relative", group: "position" },
            { label: "absolute", class: "absolute", group: "position" },
            { label: "fixed", class: "fixed", group: "position" },
            { label: "sticky", class: "sticky", group: "position" },
            { label: "inset-0", class: "inset-0", group: "inset", prefix: "inset-" },
            { label: "inset-2", class: "inset-2", group: "inset", prefix: "inset-" },
            { label: "inset-4", class: "inset-4", group: "inset", prefix: "inset-" },
            { label: "z-0", class: "z-0", group: "z", prefix: "z-" },
            { label: "z-10", class: "z-10", group: "z", prefix: "z-" },
            { label: "z-20", class: "z-20", group: "z", prefix: "z-" },
            { label: "z-50", class: "z-50", group: "z", prefix: "z-" },
            { label: "top-0", class: "top-0", group: "top", prefix: "top-" },
            { label: "top-2", class: "top-2", group: "top", prefix: "top-" },
            { label: "top-4", class: "top-4", group: "top", prefix: "top-" },
            { label: "-top-2", class: "-top-2", group: "top", prefix: "top-" },
            { label: "right-0", class: "right-0", group: "right", prefix: "right-" },
            { label: "right-2", class: "right-2", group: "right", prefix: "right-" },
            { label: "bottom-0", class: "bottom-0", group: "bottom", prefix: "bottom-" },
            { label: "bottom-2", class: "bottom-2", group: "bottom", prefix: "bottom-" },
            { label: "left-0", class: "left-0", group: "left", prefix: "left-" },
            { label: "left-2", class: "left-2", group: "left", prefix: "left-" }
          ];
        } else if (subCategory === "flexbox") {
          layoutItems = [
            { label: "flex", class: "flex", group: "display" },
            { label: "inline-flex", class: "inline-flex", group: "display" },
            { label: "flex-col", class: "flex-col", group: "flexDirection" },
            { label: "flex-row", class: "flex-row", group: "flexDirection" },
            { label: "flex-wrap", class: "flex-wrap", group: "flexDirection" },
            { label: "items-start", class: "items-start", group: "alignment" },
            { label: "items-center", class: "items-center", group: "alignment" },
            { label: "items-end", class: "items-end", group: "alignment" },
            { label: "items-stretch", class: "items-stretch", group: "alignment" },
            { label: "justify-start", class: "justify-start", group: "justify" },
            { label: "justify-center", class: "justify-center", group: "justify" },
            { label: "justify-end", class: "justify-end", group: "justify" },
            { label: "justify-between", class: "justify-between", group: "justify" },
            { label: "justify-around", class: "justify-around", group: "justify" },
            { label: "justify-evenly", class: "justify-evenly", group: "justify" },
            { label: "self-auto", class: "self-auto", group: "alignSelf" },
            { label: "self-center", class: "self-center", group: "alignSelf" },
            { label: "self-stretch", class: "self-stretch", group: "alignSelf" },
            { label: "gap-0", class: "gap-0", group: "gap" },
            { label: "gap-1", class: "gap-1", group: "gap" },
            { label: "gap-2", class: "gap-2", group: "gap" },
            { label: "gap-4", class: "gap-4", group: "gap" },
            { label: "gap-6", class: "gap-6", group: "gap" },
            { label: "gap-8", class: "gap-8", group: "gap" }
          ];
        } else if (subCategory === "grid") {
          layoutItems = [
            { label: "grid", class: "grid", group: "display" },
            { label: "cols-1", class: "grid-cols-1", group: "gridCols", prefix: "grid-cols-" },
            { label: "cols-2", class: "grid-cols-2", group: "grid-cols-2" },
            { label: "cols-3", class: "grid-cols-3", group: "grid-cols-3" },
            { label: "cols-4", class: "grid-cols-4", group: "grid-cols-4" },
            { label: "cols-6", class: "grid-cols-6", group: "grid-cols-6" },
            { label: "cols-12", class: "grid-cols-12", group: "grid-cols-12" },
            { label: "rows-1", class: "grid-rows-1", group: "gridRows", prefix: "grid-rows-" },
            { label: "rows-2", class: "grid-rows-2", group: "grid-rows-2" },
            { label: "rows-3", class: "grid-rows-3", group: "grid-rows-3" },
            { label: "gap-0", class: "gap-0", group: "gap" },
            { label: "gap-2", class: "gap-2", group: "gap" },
            { label: "gap-4", class: "gap-4", group: "gap" },
            { label: "gap-6", class: "gap-6", group: "gap" }
          ];
        } else if (subCategory === "overflow") {
          layoutItems = [
            { label: "overflow-auto", class: "overflow-auto", group: "overflow" },
            { label: "overflow-hidden", class: "overflow-hidden", group: "overflow" },
            { label: "overflow-scroll", class: "overflow-scroll", group: "overflow" },
            { label: "overflow-visible", class: "overflow-visible", group: "overflow" },
            { label: "overflow-x-auto", class: "overflow-x-auto", group: "overflowX" },
            { label: "overflow-x-hidden", class: "overflow-x-hidden", group: "overflowX" },
            { label: "overflow-y-auto", class: "overflow-y-auto", group: "overflowY" },
            { label: "overflow-y-hidden", class: "overflow-y-hidden", group: "overflowY" },
            { label: "scroll-smooth", class: "scroll-smooth", group: "scrollBehavior" },
            { label: "scroll-auto", class: "scroll-auto", group: "scrollBehavior" }
          ];
        }

        return (
          <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 animate-fade-in select-none">
            {layoutItems.map((item) => {
              const active = isClassActive(item);
              return (
                <button
                  key={item.label}
                  onClick={() => handleApplyClass(item)}
                  className={`px-3 py-1.5 text-[10px] font-mono rounded-xl shrink-0 transition border cursor-pointer ${
                    active 
                      ? "bg-purple-600 border-purple-500 text-white font-bold animate-pulse-subtle" 
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        );
      }

      case "typography": {
        let typographyItems: { label: string; class: string; group: string; prefix?: string }[] = [];
        if (subCategory === "typographyStyles") {
          typographyItems = [
            { label: "xs", class: "text-xs", group: "textSize" },
            { label: "sm", class: "text-sm", group: "textSize" },
            { label: "base", class: "text-base", group: "textSize" },
            { label: "lg", class: "text-lg", group: "textSize" },
            { label: "xl", class: "text-xl", group: "textSize" },
            { label: "2xl", class: "text-2xl", group: "textSize" },
            { label: "3xl", class: "text-3xl", group: "textSize" },
            { label: "4xl", class: "text-4xl", group: "textSize" },
            { label: "5xl", class: "text-5xl", group: "textSize" },
            { label: "sans", class: "font-sans", group: "fontFamily" },
            { label: "serif", class: "font-serif", group: "fontFamily" },
            { label: "mono", class: "font-mono", group: "fontFamily" },
            { label: "light", class: "font-light", group: "fontWeight" },
            { label: "normal", class: "font-normal", group: "fontWeight" },
            { label: "medium", class: "font-medium", group: "fontWeight" },
            { label: "semibold", class: "font-semibold", group: "fontWeight" },
            { label: "bold", class: "font-bold", group: "fontWeight" },
            { label: "leading-none", class: "leading-none", group: "leading" },
            { label: "leading-tight", class: "leading-tight", group: "leading" },
            { label: "leading-normal", class: "leading-normal", group: "leading" },
            { label: "leading-relaxed", class: "leading-relaxed", group: "leading" },
            { label: "italic", class: "italic", group: "fontStyle", prefix: "italic" },
            { label: "not-italic", class: "not-italic", group: "fontStyle", prefix: "not-italic" }
          ];
        } else if (subCategory === "typographySpacing") {
          typographyItems = [
            { label: "align-left", class: "text-left", group: "textAlign" },
            { label: "align-center", class: "text-center", group: "textAlign" },
            { label: "align-right", class: "text-right", group: "textAlign" },
            { label: "align-justify", class: "text-justify", group: "textAlign" },
            { label: "underline", class: "underline", group: "decoration", prefix: "underline" },
            { label: "line-through", class: "line-through", group: "decoration", prefix: "line-through" },
            { label: "no-underline", class: "no-underline", group: "decoration", prefix: "no-underline" },
            { label: "uppercase", class: "uppercase", group: "transform", prefix: "uppercase" },
            { label: "lowercase", class: "lowercase", group: "transform", prefix: "lowercase" },
            { label: "capitalize", class: "capitalize", group: "transform", prefix: "capitalize" },
            { label: "normal-case", class: "normal-case", group: "transform", prefix: "normal-case" },
            { label: "spacing-tighter", class: "tracking-tighter", group: "tracking" },
            { label: "spacing-tight", class: "tracking-tight", group: "tracking" },
            { label: "spacing-normal", class: "tracking-normal", group: "tracking" },
            { label: "spacing-wide", class: "tracking-wide", group: "tracking" },
            { label: "spacing-widest", class: "tracking-widest", group: "tracking" }
          ];
        }

        return (
          <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 animate-fade-in select-none">
            {typographyItems.map((item) => {
              const active = isClassActive(item);
              return (
                <button
                  key={item.label}
                  onClick={() => handleApplyClass(item)}
                  className={`px-3 py-1.5 text-[10px] font-mono rounded-xl shrink-0 transition border cursor-pointer ${
                    active 
                      ? "bg-purple-600 border-purple-500 text-white font-bold animate-pulse-subtle" 
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        );
      }

      case "visuals": {
        if (subCategory === "colors") {
          const selectColors = [
            { label: "Clear", bg: "bg-transparent", class: "bg-transparent" },
            { label: "White", bg: "bg-white", class: "bg-white border border-stone-200" },
            { label: "Dark", bg: "bg-stone-900 border border-stone-800", class: "bg-stone-900" },
            { label: "Stone", bg: "bg-stone-100", class: "bg-stone-100 border border-stone-200" },
            { label: "Amber", bg: "bg-amber-100", class: "bg-amber-100 border border-amber-200" },
            { label: "Indigo", bg: "bg-indigo-950", class: "bg-indigo-950" },
            { label: "Purple", bg: "bg-purple-100", class: "bg-purple-100" },
            { label: "Teal", bg: "bg-emerald-950", class: "bg-emerald-950" }
          ];

          const textColors = [
            { label: "Text-White", class: "text-white", prefix: "text-" },
            { label: "Text-Dark", class: "text-stone-900", prefix: "text-" },
            { label: "Text-Stone", class: "text-stone-550", prefix: "text-" },
            { label: "Text-Amber", class: "text-amber-700", prefix: "text-" },
            { label: "Text-Indigo", class: "text-indigo-600", prefix: "text-" },
            { label: "Text-Purple", class: "text-purple-600", prefix: "text-" }
          ];

          const opacities = [
            { label: "op-100", class: "opacity-100", prefix: "opacity-" },
            { label: "op-90", class: "opacity-90", prefix: "opacity-" },
            { label: "op-75", class: "opacity-75", prefix: "opacity-" },
            { label: "op-50", class: "opacity-50", prefix: "opacity-" },
            { label: "op-25", class: "opacity-25", prefix: "opacity-" },
            { label: "op-10", class: "opacity-10", prefix: "opacity-" }
          ];

          const activeBg = getPrefixedClass(classes, "bg-") || "bg-transparent";

          return (
            <div className="flex-1 min-w-0 flex items-center justify-between gap-3 overflow-x-auto scrollbar-hide py-1 animate-fade-in select-none">
              {/* Bg Colors circles list */}
              <div className="flex items-center gap-1.5 shrink-0 py-1 border-r border-stone-200 pr-2">
                {selectColors.map((color) => {
                  const isSelected = activeBg === (color.class?.split(" ")[0] || color.bg);
                  return (
                    <button
                      key={color.label}
                      onClick={() => updateTree((n) => ({ classes: setColorClass(n.classes, "bg-", color.class || color.bg) }))}
                      className={`w-5 h-5 rounded-full shrink-0 transition-all ${color.bg} ${
                        isSelected ? "ring-2 ring-purple-500 ring-offset-2 scale-110" : "hover:scale-105 active:scale-95 cursor-pointer"
                      }`}
                      title={color.label}
                    />
                  );
                })}
              </div>

              {/* Text Colors & Opacity presets */}
              <div className="flex items-center gap-1.5 shrink-0">
                {textColors.map((item) => {
                  const active = classes.split(/\s+/).includes(item.class);
                  return (
                    <button
                      key={item.label}
                      onClick={() => updateTree((n) => ({ classes: setColorClass(n.classes, "text-", item.class) }))}
                      className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border transition cursor-pointer ${
                        active 
                          ? "bg-purple-600 border-purple-500 text-white" 
                          : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}

                <div className="h-4 w-px bg-stone-200 shrink-0"></div>

                {opacities.map((item) => {
                  const active = classes.split(/\s+/).includes(item.class);
                  return (
                    <button
                      key={item.label}
                      onClick={() => updateTree((n) => ({ classes: setPrefixedClass(n.classes, item.prefix, item.class) }))}
                      className={`px-2 py-0.5 text-[9px] font-mono rounded-md border transition shrink-0 cursor-pointer ${
                        active 
                          ? "bg-purple-600 border-purple-500 text-white" 
                          : "bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }

        // borders subcategory
        let borderStyleItems = [
          { label: "rounded-none", class: "rounded-none", group: "rounding" },
          { label: "rounded-sm", class: "rounded-sm", group: "rounding" },
          { label: "rounded", class: "rounded", group: "rounding" },
          { label: "rounded-md", class: "rounded-md", group: "rounding" },
          { label: "rounded-lg", class: "rounded-lg", group: "rounding" },
          { label: "rounded-xl", class: "rounded-xl", group: "rounding" },
          { label: "rounded-2xl", class: "rounded-2xl", group: "rounding" },
          { label: "rounded-3xl", class: "rounded-3xl", group: "rounding" },
          { label: "rounded-full", class: "rounded-full", group: "rounding" },
          { label: "border-0", class: "border-0", group: "borderWidth" },
          { label: "border-1", class: "border", group: "borderWidth" },
          { label: "border-2", class: "border-2", group: "borderWidth" },
          { label: "border-4", class: "border-4", group: "borderWidth" },
          { label: "border-8", class: "border-8", group: "borderWidth" },
          { label: "border-solid", class: "border-solid", group: "borderStyle", prefix: "border-" },
          { label: "border-dashed", class: "border-dashed", group: "borderStyle", prefix: "border-" },
          { label: "border-dotted", class: "border-dotted", group: "borderStyle", prefix: "border-" },
          { label: "shadow-none", class: "shadow-none", group: "shadow" },
          { label: "shadow-sm", class: "shadow-sm", group: "shadow" },
          { label: "shadow", class: "shadow", group: "shadow" },
          { label: "shadow-md", class: "shadow-md", group: "shadow" },
          { label: "shadow-lg", class: "shadow-lg", group: "shadow" },
          { label: "shadow-xl", class: "shadow-xl", group: "shadow" },
          { label: "shadow-2xl", class: "shadow-2xl", group: "shadow" }
        ];

        return (
          <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 animate-fade-in select-none">
            {borderStyleItems.map((item) => {
              const active = isClassActive(item);
              return (
                <button
                  key={item.label}
                  onClick={() => handleApplyClass(item)}
                  className={`px-3 py-1.5 text-[10px] font-mono rounded-xl shrink-0 transition border cursor-pointer ${
                    active 
                      ? "bg-purple-600 border-purple-500 text-white font-bold animate-pulse-subtle" 
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        );
      }

      case "motion": {
        let motionItems: { label: string; class: string; group: string; prefix?: string }[] = [];
        if (subCategory === "transitions") {
          motionItems = [
            { label: "transition-none", class: "transition-none", group: "transition", prefix: "transition-" },
            { label: "transition-all", class: "transition-all", group: "transition", prefix: "transition-" },
            { label: "transition-colors", class: "transition-colors", group: "transition", prefix: "transition-" },
            { label: "transition-transform", class: "transition-transform", group: "transition", prefix: "transition-" },
            { label: "duration-75", class: "duration-75", group: "duration", prefix: "duration-" },
            { label: "duration-100", class: "duration-100", group: "duration", prefix: "duration-" },
            { label: "duration-150", class: "duration-150", group: "duration", prefix: "duration-" },
            { label: "duration-200", class: "duration-200", group: "duration", prefix: "duration-" },
            { label: "duration-300", class: "duration-300", group: "duration", prefix: "duration-" },
            { label: "duration-500", class: "duration-500", group: "duration", prefix: "duration-" },
            { label: "duration-700", class: "duration-700", group: "duration", prefix: "duration-" },
            { label: "duration-1000", class: "duration-1000", group: "duration", prefix: "duration-" },
            { label: "ease-linear", class: "ease-linear", group: "easing", prefix: "ease-" },
            { label: "ease-in", class: "ease-in", group: "easing", prefix: "ease-" },
            { label: "ease-out", class: "ease-out", group: "easing", prefix: "ease-" },
            { label: "ease-in-out", class: "ease-in-out", group: "easing", prefix: "ease-" },
            { label: "hover:scale-105", class: "hover:scale-[1.05]", group: "hoverScale", prefix: "hover:scale-" },
            { label: "hover:scale-110", class: "hover:scale-[1.10]", group: "hoverScale", prefix: "hover:scale-" },
            { label: "hover:scale-95", class: "hover:scale-[0.95]", group: "hoverScale", prefix: "hover:scale-" },
            { label: "hover:rotate-1", class: "hover:rotate-1", group: "hoverRotate", prefix: "hover:rotate-" },
            { label: "hover:rotate-3", class: "hover:rotate-3", group: "hoverRotate", prefix: "hover:rotate-" }
          ];
        } else if (subCategory === "animations") {
          motionItems = [
            { label: "animate-none", class: "animate-none", group: "animation", prefix: "animate-" },
            { label: "animate-fade-in", class: "animate-fade-in", group: "animation", prefix: "animate-" },
            { label: "animate-pulse", class: "animate-pulse", group: "animation", prefix: "animate-" },
            { label: "animate-bounce", class: "animate-bounce", group: "animation", prefix: "animate-" },
            { label: "animate-spin", class: "animate-spin", group: "animation", prefix: "animate-" },
            { label: "animate-ping", class: "animate-ping", group: "animation", prefix: "animate-" },
            { label: "hover:shadow-lg", class: "hover:shadow-lg", group: "hoverShadow", prefix: "hover:shadow-" },
            { label: "hover:opacity-90", class: "hover:bg-opacity-90", group: "hoverOpacity", prefix: "hover:bg-opacity-" }
          ];
        }

        return (
          <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 animate-fade-in select-none">
            {motionItems.map((item) => {
              const active = isClassActive(item);
              return (
                <button
                  key={item.label}
                  onClick={() => handleApplyClass(item)}
                  className={`px-3 py-1.5 text-[10px] font-mono rounded-xl shrink-0 transition border cursor-pointer ${
                    active 
                      ? "bg-purple-600 border-purple-500 text-white font-bold animate-pulse-subtle" 
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        );
      }

      case "core": {
        if (subCategory === "contentDetails") {
          return (
            <div className="flex-1 flex items-center pr-1 animate-fade-in gap-2 select-none">
              {selectedElement.content !== undefined ? (
                <input 
                  type="text" 
                  value={selectedElement.content || ""} 
                  onChange={(e) => updateTree(() => ({ content: e.target.value }))}
                  className="flex-1 bg-stone-50 border border-stone-200/85 rounded-xl px-2.5 py-1 text-[10.5px] focus:outline-none focus:border-purple-500 font-sans text-stone-800"
                  placeholder="Text content..."
                />
              ) : (
                <span className="text-[10px] text-stone-400 font-mono italic">No direct content (container element)</span>
              )}
            </div>
          );
        }

        return (
          <div className="flex-1 flex items-center pr-1 animate-fade-in gap-2 select-none">
            <input 
              type="text" 
              value={selectedElement.classes || ""} 
              onChange={(e) => updateTree(() => ({ classes: e.target.value }))}
              className="flex-1 bg-stone-50 border border-stone-200/85 rounded-xl px-2.5 py-1 text-[10px] focus:outline-none focus:border-purple-500 font-mono text-stone-800"
              placeholder="Utilities classes list write..."
            />
          </div>
        );
      }

      case "help":
        return (
          <div className="flex-1 flex items-center pr-1 animate-fade-in text-[10px] text-stone-500 font-mono italic">
            <span>Scroll drawer up to browse full list</span>
          </div>
        );

      default:
        return null;
    }
  };

  const activeTab = tabsInfo.find(t => t.id === inspectorSection) || tabsInfo[0];

  return (
    <div 
      id="mobile_tool_controls" 
      className="md:hidden fixed bottom-[138px] left-1/2 -translate-x-1/2 bg-white border border-stone-200/50 p-2 px-3 shadow-[0_12px_45px_rgba(0,0,0,0.18)] flex items-center justify-between gap-2 w-[94vw] max-w-[390px] backdrop-blur-md z-45 animate-fade-in"
      style={{ marginBottom: "-12px", borderRadius: "50px", height: "46px", borderWidth: "3.5px" }}
    >
      {/* Dynamic Sub-categories drop list on Layout & tab written area */}
      <div className="relative shrink-0 flex items-center">
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
          className="flex items-center gap-1.5 shrink-0 text-stone-800 font-bold uppercase font-mono tracking-wider text-[8.5px] bg-stone-50 hover:bg-stone-100 active:scale-95 px-2.5 py-1.5 rounded-full border transition cursor-pointer select-none"
          style={{ borderColor: "#e8dddc" }}
        >
          {(() => {
            const currentSub = subCategoriesConfig[inspectorSection]?.find(s => s.id === subCategory);
            const IconComponent = currentSub?.icon || activeTab.icon;
            return <IconComponent size={11} className="text-purple-600 shrink-0" />;
          })()}
          <span className="max-w-[75px] truncate">
            {subCategoriesConfig[inspectorSection]?.find(s => s.id === subCategory)?.label || "Box Model"}
          </span>
          <ChevronDown size={9} className="text-stone-500 shrink-0 ml-0.5" />
        </button>

        {isDropdownOpen && (
          <>
            {/* Click-away overlay */}
            <div 
              className="fixed inset-0 z-50 bg-transparent" 
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(false);
              }}
            />
            {/* Sub-categories Dropdown popover floating above category block */}
            <div 
              className="absolute bottom-full left-0 mb-3 bg-white/95 backdrop-blur-md border border-stone-250/90 shadow-[0_-8px_32px_rgba(0,0,0,0.15)] rounded-2xl p-2 w-[170px] z-50 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-150 text-left"
              style={{ maxHeight: "320px", overflowY: "auto", borderWidth: "0px" }}
            >
              <div className="px-2 py-1 text-[8px] text-stone-400 font-bold uppercase font-mono tracking-wider border-b border-stone-100 pb-1.5 mb-1 text-left">
                Sub-Categories
              </div>

              {subCategoriesConfig[inspectorSection]?.map((sub) => {
                const isSelected = subCategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSubCategory(sub.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left text-[11px] font-semibold transition cursor-pointer ${
                      isSelected 
                        ? "bg-purple-50 text-purple-700 font-bold border border-purple-100/40" 
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                  >
                    <sub.icon size={11} className={isSelected ? "text-purple-600" : "text-stone-400"} />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-stone-200 shrink-0"></div>

      {/* Middle controls */}
      {renderMiddleControls()}

      {/* Divider */}
      <div className="h-4 w-px bg-stone-200 shrink-0"></div>

      {/* Right Actions: Combined Dropdown */}
      <div className="relative shrink-0 flex items-center">
        <button 
          id="mobile-actions-dropdown-trigger"
          type="button"
          onClick={(e) => { 
            e.stopPropagation(); 
            setIsActionsDropdownOpen(!isActionsDropdownOpen); 
          }}
          className={`w-[30px] h-[30px] rounded-full flex items-center justify-center transition border cursor-pointer ${
            isActionsDropdownOpen 
              ? "bg-purple-50 text-purple-600 border-purple-200 shadow-sm" 
              : "bg-stone-50 hover:bg-stone-100 text-stone-500 border-stone-200/50"
          }`}
          title="Element Actions"
        >
          <MoreVertical size={13} />
        </button>

        {isActionsDropdownOpen && (
          <>
            {/* Click-away overlay */}
            <div 
              className="fixed inset-0 z-50 bg-transparent" 
              onClick={(e) => {
                e.stopPropagation();
                setIsActionsDropdownOpen(false);
              }}
            />
            {/* Action Dropdown popover floating above */}
            <div 
              id="mobile-element-actions-menu"
              className="absolute bottom-full right-0 mb-3 bg-white/95 backdrop-blur-md border border-stone-250/90 shadow-[0_-8px_32px_rgba(0,0,0,0.15)] rounded-2xl p-1.5 w-[140px] z-50 flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150 text-left"
              style={{ borderRadius: "15px", borderWidth: "0px" }}
            >
              <div className="px-2.5 py-1 text-[8.5px] text-stone-400 font-bold uppercase font-mono tracking-wider border-b border-stone-100 pb-1.5 mb-0.5 text-left select-none">
                Actions
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateElement(selectedElement.id);
                  setIsActionsDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left text-[11px] font-semibold text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition cursor-pointer"
              >
                <Copy size={11.5} className="text-stone-400 shrink-0" />
                <span>Duplicate</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteElement(selectedElement.id);
                  setIsActionsDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left text-[11px] font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-750 transition cursor-pointer"
              >
                <Trash2 size={11.5} className="text-rose-400 shrink-0" />
                <span>Delete</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function MobileStylingTabs() {
  const designer = useDesigner();
  const {
    selectedElement,
    inspectorSection,
    setInspectorSection,
    mobileActiveView
  } = designer;

  // Render ONLY when inside inspector view
  if (mobileActiveView !== "inspector") return null;

  // If no element selected, render a gorgeous helper tip above the bottom nav
  if (!selectedElement) {
    return (
      <div 
        id="mobile_styling_tabs_root"
        className="md:hidden fixed bottom-[84px] left-1/2 -translate-x-1/2 bg-stone-900 border border-stone-800 text-white shadow-2xl flex items-center justify-center px-4 py-2 w-[92vw] max-w-[390px] z-40 select-none animate-fade-in"
        style={{ 
          height: "44.5px", 
          borderRadius: "50px", 
          marginBottom: "-12px",
          textAlign: "center",
          boxSizing: "border-box",
          paddingLeft: "4px",
          paddingRight: "4px"
        }}
      >
        <div className="flex items-center gap-2 text-[11px] font-medium text-stone-200 animate-pulse">
          <MousePointer size={14} className="text-purple-400" />
          <span>Tap any element on canvas to design</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="mobile_styling_tabs_root"
      className="md:hidden fixed bottom-[84px] left-1/2 -translate-x-1/2 bg-stone-900 border border-stone-800 text-white shadow-2xl flex items-center justify-start overflow-x-auto scrollbar-hide px-3.5 py-1 gap-2 shrink-0 z-40 select-none cursor-pointer w-[92vw] max-w-[390px]"
      style={{ 
        height: "44.5px", 
        borderRadius: "50px", 
        marginBottom: "-12px",
        textAlign: "center",
        boxSizing: "border-box",
        paddingLeft: "4px",
        paddingRight: "4px"
      }}
    >
      {tabsInfo.map((tab) => {
        const isActive = inspectorSection === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setInspectorSection(tab.id as InspectorSection)}
            className={`relative px-3.5 py-1 h-[32px] rounded-full flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shrink-0 font-semibold ${
              isActive 
                ? "text-stone-900 bg-white font-bold shadow-md scale-102" 
                : "text-stone-400 hover:text-white"
            }`}
          >
            <tab.icon size={11.5} className={isActive ? "text-purple-600" : "text-stone-400"} />
            <span className="text-[10px] tracking-tight whitespace-nowrap">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
