import React from "react";
import { 
  Sparkles, Palette, Maximize, Type, Layers, Play, Code, 
  HelpCircle, Trash2, Copy, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  MousePointer, Grid, Compass, Cpu, Move, Wand2, Sliders, ChevronDown, MoreVertical
} from "lucide-react";
import { useDesigner } from "../contexts/DesignerContext";
import { InspectorSection } from "./InspectorPanel";
import { PropertyControl } from "./PropertyControl";
import { 
  setGroupClass, getActiveGroupClass, 
  setPrefixedClass, getPrefixedClass, 
  setColorClass,
  STYLE_GROUPS
} from "../styleUtils";

const tabsInfo = [
  { id: "layout", label: "Layout", icon: Maximize },
  { id: "spacing", label: "Spacing", icon: Move },
  { id: "typography", label: "Text", icon: Type },
  { id: "visuals", label: "Visuals", icon: Palette },
  { id: "motion", label: "Motion", icon: Play },
  { id: "core", label: "Code", icon: Sparkles },
  { id: "help", label: "Guide", icon: HelpCircle }
];

const BOX_MODEL_PROPS = [
  { id: "width", label: "width", prefix: "w-", group: "width", values: ["auto", "full", "1/2", "1/3", "2/3", "1/4", "3/4", "12", "24", "32", "48", "64", "96"] },
  { id: "height", label: "height", prefix: "h-", group: "height", values: ["auto", "full", "12", "16", "20", "24", "32", "40", "48", "56", "64", "80", "96"] },
  { id: "min-width", label: "min-width", prefix: "min-w-", values: ["0", "[100px]", "[200px]", "[300px]", "full"] },
  { id: "max-width", label: "max-width", prefix: "max-w-", values: ["none", "xs", "sm", "md", "lg", "xl", "2xl", "full"] },
  { id: "min-height", label: "min-height", prefix: "min-h-", values: ["0", "[50px]", "[100px]", "[200px]", "full"] },
  { id: "max-height", label: "max-height", prefix: "max-h-", values: ["full", "[300px]", "[500px]", "screen"] },
  { id: "margin", label: "margin", prefix: "m-", values: ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24", "32", "48", "64", "auto"] },
  { id: "margin-top", label: "margin-top", prefix: "mt-", values: ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24", "auto"] },
  { id: "margin-right", label: "margin-right", prefix: "mr-", values: ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24", "auto"] },
  { id: "margin-bottom", label: "margin-bottom", prefix: "mb-", values: ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24", "auto"] },
  { id: "margin-left", label: "margin-left", prefix: "ml-", values: ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24", "auto"] },
  { id: "padding", label: "padding", prefix: "p-", values: ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24", "32", "48", "64"] },
  { id: "padding-top", label: "padding-top", prefix: "pt-", values: ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24"] },
  { id: "padding-right", label: "padding-right", prefix: "pr-", values: ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24"] },
  { id: "padding-bottom", label: "padding-bottom", prefix: "pb-", values: ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24"] },
  { id: "padding-left", label: "padding-left", prefix: "pl-", values: ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24"] },
  { id: "box-sizing", label: "box-sizing", prefix: "box-", group: "boxSizing", values: ["border", "content"] },
  { id: "aspect-ratio", label: "aspect-ratio", prefix: "aspect-", group: "aspectRatio", values: ["auto", "square", "video"] }
];

const DISPLAY_PROPS = [
  { id: "display-mode", label: "display", prefix: "", group: "display", values: ["block", "inline-block", "inline", "flex", "grid", "none"] }
];

const POSITION_PROPS = [
  { id: "position", label: "position", prefix: "", group: "position", values: ["static", "relative", "absolute", "fixed", "sticky"] },
  { id: "z-index", label: "z-index", prefix: "z-", values: ["auto", "0", "10", "20", "30", "40", "50", "999"] },
  { id: "inset", label: "inset", prefix: "inset-", values: ["auto", "0", "1", "2", "4", "8", "12", "16"] },
  { id: "top", label: "top", prefix: "top-", values: ["auto", "0", "1", "2", "4", "8", "12", "16"] },
  { id: "right", label: "right", prefix: "right-", values: ["auto", "0", "1", "2", "4", "8", "12", "16"] },
  { id: "bottom", label: "bottom", prefix: "bottom-", values: ["auto", "0", "1", "2", "4", "8", "12", "16"] },
  { id: "left", label: "left", prefix: "left-", values: ["auto", "0", "1", "2", "4", "8", "12", "16"] }
];

const FLEXBOX_PROPS = [
  { id: "display", label: "display", prefix: "", group: "display", values: ["flex", "inline-flex"] },
  { id: "direction", label: "direction", prefix: "", group: "flexDirection", values: ["flex-row", "flex-col", "flex-wrap"] },
  { id: "align-items", label: "align-items", prefix: "", group: "alignment", values: ["items-start", "items-center", "items-end", "items-baseline", "items-stretch"] },
  { id: "justify", label: "justify-content", prefix: "", group: "justify", values: ["justify-start", "justify-center", "justify-end", "justify-between", "justify-around", "justify-evenly"] },
  { id: "align-self", label: "align-self", prefix: "", group: "alignSelf", values: ["self-auto", "self-start", "self-end", "self-center", "self-stretch", "self-baseline"] },
  { id: "gap", label: "gap", prefix: "", group: "gap", values: ["gap-0", "gap-1", "gap-2", "gap-3", "gap-4", "gap-5", "gap-6", "gap-8", "gap-10", "gap-12", "gap-16"] },
  { id: "flex-grow", label: "flex grow", prefix: "", group: "flexGrow", values: ["grow-0", "grow"] },
  { id: "flex-shrink", label: "flex shrink", prefix: "", group: "flexShrink", values: ["shrink-0", "shrink"] }
];

const GRID_PROPS = [
  { id: "display", label: "display", prefix: "", group: "display", values: ["grid"] },
  { id: "cols", label: "columns", prefix: "grid-cols-", values: ["1", "2", "3", "4", "5", "6", "12"] },
  { id: "rows", label: "rows", prefix: "grid-rows-", values: ["1", "2", "3"] },
  { id: "gap", label: "gap", prefix: "", group: "gap", values: ["gap-0", "gap-1", "gap-2", "gap-4", "gap-6", "gap-8", "gap-10", "gap-12", "gap-16"] },
  { id: "col-span", label: "column span", prefix: "col-span-", values: ["1", "2", "3", "4", "5", "6", "12", "full"] },
  { id: "row-span", label: "row span", prefix: "row-span-", values: ["1", "2", "3", "4", "5", "6", "full"] }
];

const OVERFLOW_PROPS = [
  { id: "overflow", label: "overflow", prefix: "", group: "overflow", values: ["overflow-auto", "overflow-hidden", "overflow-scroll", "overflow-visible", "overflow-clip"] },
  { id: "overflow-x", label: "overflow-x", prefix: "", group: "overflowX", values: ["overflow-x-auto", "overflow-x-hidden", "overflow-x-scroll", "overflow-x-visible", "overflow-x-clip"] },
  { id: "overflow-y", label: "overflow-y", prefix: "", group: "overflowY", values: ["overflow-y-auto", "overflow-y-hidden", "overflow-y-scroll", "overflow-y-visible", "overflow-y-clip"] },
  { id: "scroll-behavior", label: "scroll-behavior", prefix: "", group: "scrollBehavior", values: ["scroll-smooth", "scroll-auto"] },
  { id: "scroll-snap-type", label: "scroll-snap-type", prefix: "", group: "scrollSnapType", values: ["snap-none", "snap-x", "snap-y", "snap-both"] }
];

const TYPOGRAPHY_STYLES_PROPS = [
  { id: "text-size", label: "text-size", prefix: "", group: "textSize", values: ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl", "text-7xl"] },
  { id: "font-family", label: "font-family", prefix: "", group: "fontFamily", values: ["font-sans", "font-serif", "font-mono"] },
  { id: "font-weight", label: "font-weight", prefix: "", group: "fontWeight", values: ["font-light", "font-normal", "font-medium", "font-semibold", "font-bold"] },
  { id: "line-height", label: "line-height", prefix: "", group: "leading", values: ["leading-none", "leading-tight", "leading-snug", "leading-normal", "leading-relaxed", "leading-loose"] },
  { id: "font-style", label: "font-style", prefix: "", values: ["italic", "not-italic"] }
];

const TYPOGRAPHY_SPACING_PROPS = [
  { id: "text-align", label: "text-align", prefix: "", group: "textAlign", values: ["text-left", "text-center", "text-right", "text-justify"] },
  { id: "decoration", label: "text-decoration", prefix: "", values: ["underline", "line-through", "no-underline"] },
  { id: "transform", label: "text-transform", prefix: "", values: ["uppercase", "lowercase", "capitalize", "normal-case"] },
  { id: "tracking", label: "tracking", prefix: "", group: "tracking", values: ["tracking-tighter", "tracking-tight", "tracking-normal", "tracking-wide", "tracking-widest"] }
];

const COLOR_PROPS = [
  { id: "background-color", label: "background color", prefix: "bg-", values: ["transparent", "white", "stone-50", "stone-100", "stone-200", "stone-900", "stone-950", "purple-100", "purple-600", "indigo-950", "indigo-600", "emerald-50", "emerald-950", "amber-100", "amber-700", "rose-50", "rose-600"] },
  { id: "text-color", label: "text color", prefix: "text-", values: ["white", "black", "stone-800", "stone-100", "purple-600", "indigo-600", "emerald-600", "amber-600", "rose-600"] },
  { id: "border-color", label: "border color", prefix: "border-", values: ["transparent", "stone-200", "stone-300", "stone-800", "purple-200", "purple-600", "indigo-600", "amber-600", "rose-600"] },
  { id: "opacity", label: "opacity", prefix: "opacity-", values: ["0", "10", "20", "25", "30", "40", "50", "60", "70", "75", "80", "90", "95", "100"] }
];

const BORDER_PROPS = [
  { id: "rounding", label: "rounding/radius", prefix: "", group: "rounding", values: ["rounded-none", "rounded-sm", "rounded", "rounded-md", "rounded-lg", "rounded-xl", "rounded-2xl", "rounded-3xl", "rounded-full"] },
  { id: "border-width", label: "border-width", prefix: "", group: "borderWidth", values: ["border-0", "border", "border-2", "border-4", "border-8"] },
  { id: "border-style", label: "border-style", prefix: "", values: ["border-solid", "border-dashed", "border-dotted"] },
  { id: "shadow", label: "box-shadow", prefix: "", group: "shadow", values: ["shadow-none", "shadow-sm", "shadow", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl"] }
];

const TRANSITION_PROPS = [
  { id: "transition", label: "transition", prefix: "", values: ["transition-none", "transition-all", "transition-colors", "transition-opacity", "transition-transform"] },
  { id: "duration", label: "duration", prefix: "", values: ["duration-75", "duration-100", "duration-150", "duration-200", "duration-300", "duration-500", "duration-700", "duration-1000"] },
  { id: "easing", label: "easing", prefix: "", values: ["ease-linear", "ease-in", "ease-out", "ease-in-out"] }
];

const ANIMATION_PROPS = [
  { id: "animation", label: "keyframe animation", prefix: "animate-", values: ["none", "fade-in", "pulse", "bounce", "spin", "ping"] },
  { id: "hover-scale", label: "hover scale", prefix: "", values: ["hover:scale-[1.03]", "hover:scale-[1.05]", "hover:scale-[1.10]"] },
  { id: "hover-rotate", label: "hover rotate", prefix: "", values: ["hover:rotate-1", "hover:rotate-3", "hover:rotate-6"] },
  { id: "hover-shadow", label: "hover shadow", prefix: "", values: ["hover:shadow-sm", "hover:shadow", "hover:shadow-md", "hover:shadow-lg", "hover:shadow-xl", "hover:shadow-2xl"] },
  { id: "hover-opacity", label: "hover opacity", prefix: "", values: ["hover:opacity-10", "hover:opacity-25", "hover:opacity-50", "hover:opacity-75", "hover:opacity-90", "hover:opacity-100"] }
];

interface StylePropertyConfig {
  id: string;
  label: string;
  prefix: string;
  values: string[];
  group?: string;
}

const getPropsForSubCategory = (subCat: string): StylePropertyConfig[] => {
  switch (subCat) {
    case "display": return DISPLAY_PROPS as StylePropertyConfig[];
    case "boxModel": return BOX_MODEL_PROPS as StylePropertyConfig[];
    case "positioning": return POSITION_PROPS as StylePropertyConfig[];
    case "flexbox": return FLEXBOX_PROPS as StylePropertyConfig[];
    case "grid": return GRID_PROPS as StylePropertyConfig[];
    case "overflow": return OVERFLOW_PROPS as StylePropertyConfig[];
    case "typographyStyles": return TYPOGRAPHY_STYLES_PROPS as StylePropertyConfig[];
    case "typographySpacing": return TYPOGRAPHY_SPACING_PROPS as StylePropertyConfig[];
    case "colors": return COLOR_PROPS as StylePropertyConfig[];
    case "borders": return BORDER_PROPS as StylePropertyConfig[];
    case "transitions": return TRANSITION_PROPS as StylePropertyConfig[];
    case "animations": return ANIMATION_PROPS as StylePropertyConfig[];
    default: return [];
  }
};

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
    if (section === "layout") return "display";
    if (section === "spacing") return "boxModel";
    if (section === "typography") return "typographyStyles";
    if (section === "visuals") return "colors";
    if (section === "motion") return "transitions";
    if (section === "help") return "guide";
    return "contentDetails";
  };

  const [subCategory, setSubCategory] = React.useState<string>(() => getInitialSubCategory(inspectorSection));
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = React.useState(false);
  const [activeFlexSubmenu, setActiveFlexSubmenu] = React.useState<"direction" | "alignment" | "justify" | "gap" | null>(null);

  // Property & Value select dropdown menus
  const [selectedSubpropMap, setSelectedSubpropMap] = React.useState<Record<string, string>>({
    display: "display-mode",
    boxModel: "width",
    positioning: "position",
    flexbox: "display",
    grid: "display",
    overflow: "overflow",
    typographyStyles: "text-size",
    typographySpacing: "text-align",
    colors: "background-color",
    borders: "rounding",
    transitions: "transition",
    animations: "animation"
  });
  const [isPropDropdownOpen, setIsPropDropdownOpen] = React.useState(false);
  const [isValDropdownOpen, setIsValDropdownOpen] = React.useState(false);

  // Sync / Reset when active element or tab category changes
  React.useEffect(() => {
    setSubCategory(getInitialSubCategory(inspectorSection));
    setIsDropdownOpen(false);
    setIsActionsDropdownOpen(false);
    setIsPropDropdownOpen(false);
    setIsValDropdownOpen(false);
    setActiveFlexSubmenu(null);
  }, [selectedElement?.id, inspectorSection]);

  // Reset dropdown when subCategory changes
  React.useEffect(() => {
    setIsPropDropdownOpen(false);
    setIsValDropdownOpen(false);
    setActiveFlexSubmenu(null);
  }, [subCategory]);

  // Render ONLY when inside inspector view and we have a selected element
  if (mobileActiveView !== "inspector" || !selectedElement) return null;

  const classes = selectedElement.classes || "";

  const getActiveValueForProp = (prop: StylePropertyConfig, subCat: string) => {
    const tokens = classes.split(/\s+/).filter(Boolean);
    
    // 1. If it belongs to a style group in STYLE_GROUPS
    if (prop.group && (prop.group in STYLE_GROUPS)) {
      const activeClass = getActiveGroupClass(classes, prop.group as any);
      if (!activeClass) return "";
      
      // If we have a prefix, extract the value after it
      if (prop.prefix) {
        if (activeClass.startsWith(prop.prefix)) {
          return activeClass.slice(prop.prefix.length);
        }
      } else {
        // Find inside prop.values that matches activeClass (or if value matches activeClass exactly)
        return prop.values.find(v => v === activeClass) || "";
      }
    }
    
    // 2. If it is a prefixed style property
    if (prop.prefix) {
      const match = tokens.find(t => t.startsWith(prop.prefix));
      if (match) {
        return match.slice(prop.prefix.length);
      }
    } else {
      // 3. No prefix, no group. It is an arbitrary class list toggle (like hover:scale-[1.05] or scroll-smooth)
      return prop.values.find(v => tokens.includes(v)) || "";
    }
    
    return "";
  };

  const handleApplyStyle = (propId: string, val: string, subCat: string) => {
    const props = getPropsForSubCategory(subCat);
    const prop = props.find(p => p.id === propId);
    if (!prop) return;

    updateTree((node) => {
      let nextClasses = node.classes || "";
      let tokens = nextClasses.split(/\s+/).filter(Boolean);
      const classToApply = prop.prefix ? `${prop.prefix}${val}` : val;

      if (!val || val === "none" || val === "") {
        // Clear/Remove style
        if (subCat === "colors") {
          if (prop.id === "background-color") {
            return { classes: setColorClass(nextClasses, "bg-", "") };
          }
          if (prop.id === "text-color") {
            return { classes: setColorClass(nextClasses, "text-", "") };
          }
          if (prop.id === "border-color") {
            return { classes: setColorClass(nextClasses, "border-", "") };
          }
        }

        if (prop.group && (prop.group in STYLE_GROUPS)) {
          nextClasses = setGroupClass(nextClasses, prop.group as any, "");
        } else if (prop.prefix) {
          nextClasses = tokens.filter(t => !t.startsWith(prop.prefix)).join(" ");
        } else {
          // No prefix, remove any of the values in the set
          nextClasses = tokens.filter(t => !prop.values.includes(t)).join(" ");
        }
        return { classes: nextClasses };
      }

      // Special cases for color prefixes to use correct setColorClass helper
      if (subCat === "colors") {
        if (prop.id === "background-color") {
          return { classes: setColorClass(nextClasses, "bg-", classToApply) };
        }
        if (prop.id === "text-color") {
          return { classes: setColorClass(nextClasses, "text-", classToApply) };
        }
        if (prop.id === "border-color") {
          return { classes: setColorClass(nextClasses, "border-", classToApply) };
        }
      }

      if (prop.group && (prop.group in STYLE_GROUPS)) {
        nextClasses = setGroupClass(nextClasses, prop.group as any, classToApply);
      } else {
        if (prop.prefix) {
          // Remove existing with same prefix
          let filtered = tokens.filter(t => !t.startsWith(prop.prefix));

          // Box model padding clear logic
          if (prop.id === "padding") {
            filtered = filtered.filter(t => !t.startsWith("pt-") && !t.startsWith("pb-") && !t.startsWith("pl-") && !t.startsWith("pr-") && !t.startsWith("px-") && !t.startsWith("py-"));
          }
          if (["padding-top", "padding-right", "padding-bottom", "padding-left"].includes(prop.id)) {
            filtered = filtered.filter(t => !t.startsWith("p-"));
          }
          // Box model margin clear logic
          if (prop.id === "margin") {
            filtered = filtered.filter(t => !t.startsWith("mt-") && !t.startsWith("mb-") && !t.startsWith("ml-") && !t.startsWith("mr-") && !t.startsWith("mx-") && !t.startsWith("my-"));
          }
          if (["margin-top", "margin-right", "margin-bottom", "margin-left"].includes(prop.id)) {
            filtered = filtered.filter(t => !t.startsWith("m-"));
          }

          filtered.push(classToApply);
          nextClasses = filtered.join(" ");
        } else {
          // No prefix, no group. It is a plain toggle of values in prop.values.
          // First, filter out any of other values in this prop.values to avoid conflicts
          let filtered = tokens.filter(t => !prop.values.includes(t));
          filtered.push(classToApply);
          nextClasses = filtered.join(" ");
        }
      }
      return { classes: nextClasses };
    });
  };

  // Dynamic Subcategories Map based on Active Tab aligning exactly with desktop
  const subCategoriesConfig: Record<string, { id: string; label: string; icon: any }[]> = {
    layout: [
      { id: "display", label: "Display Mode", icon: Sliders },
      { id: "positioning", label: "Positioning", icon: Move },
      { id: "flexbox", label: "Flexbox Layout", icon: Cpu },
      { id: "grid", label: "Grid Layout", icon: Grid },
      { id: "overflow", label: "Overflow & Scroll", icon: Compass }
    ],
    spacing: [
      { id: "boxModel", label: "Box Model", icon: Grid }
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
    if (subCategory === "flexbox") {
      const isFlexEnabled = classes.includes("flex") || classes.includes("inline-flex");

      if (!isFlexEnabled) {
        return (
          <div className="flex-1 flex items-center justify-center animate-fade-in select-none">
            <button
              type="button"
              onClick={() => {
                updateTree((n) => ({ classes: setGroupClass(n.classes, "display", "flex") }));
              }}
              className="w-full h-8 rounded-full bg-purple-600 font-bold font-sans text-[10px] text-white flex items-center justify-center gap-1 hover:bg-purple-700 active:scale-95 transition cursor-pointer select-none"
            >
              <Cpu size={12} />
              <span>Enable Flexbox Layout</span>
            </button>
          </div>
        );
      }

      const activeDir = getActiveGroupClass(classes, "flexDirection") || "flex-row";
      const activeJustify = getActiveGroupClass(classes, "justify") || "";
      const activeAlign = getActiveGroupClass(classes, "alignment") || "";
      const activeGap = getActiveGroupClass(classes, "gap") || "";

      const dirLabel = activeDir === "flex-col" ? "Col" : activeDir === "flex-wrap" ? "Wrap" : "Row";

      const justifyLabelMap: Record<string, string> = {
        "": "Justify",
        "justify-start": "Left",
        "justify-center": "Center",
        "justify-end": "Right",
        "justify-between": "Between",
        "justify-around": "Around",
        "justify-evenly": "Evenly"
      };
      const justifyLabel = justifyLabelMap[activeJustify] || "Justify";

      const alignLabelMap: Record<string, string> = {
        "": "Align",
        "items-start": "Top",
        "items-center": "Mid",
        "items-end": "Bot",
        "items-stretch": "Stretch",
        "items-baseline": "Base"
      };
      const alignLabel = alignLabelMap[activeAlign] || "Align";

      const gapLabelMap: Record<string, string> = {
        "": "No Gap",
        "gap-1": "Gap-1",
        "gap-2": "Gap-2",
        "gap-3": "Gap-3",
        "gap-4": "Gap-4",
        "gap-6": "Gap-6",
        "gap-8": "Gap-8"
      };
      const gapLabel = gapLabelMap[activeGap] || "No Gap";

      return (
        <div 
          className="flex-1 min-w-0 flex items-center gap-1 overflow-x-auto scrollbar-hide py-1 animate-fade-in touch-pan-x"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* DIRECTION */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setActiveFlexSubmenu(activeFlexSubmenu === "direction" ? null : "direction")}
              className={`h-7 px-2 rounded-lg flex items-center gap-0.5 text-[9.5px] font-mono font-bold transition border cursor-pointer ${
                activeFlexSubmenu === "direction"
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                  : "bg-stone-50 text-stone-700 border-stone-200/80 hover:bg-stone-100"
              }`}
            >
              <span>Dir: {dirLabel}</span>
              <ChevronDown size={8} />
            </button>

            {activeFlexSubmenu === "direction" && (
              <>
                <div className="fixed inset-0 z-50 bg-transparent" onClick={() => setActiveFlexSubmenu(null)} />
                <div className="absolute bottom-full left-0 mb-2 bg-white border border-stone-200 shadow-xl rounded-2xl p-1 w-[120px] z-[999] flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="px-2 py-0.5 text-[7px] text-stone-400 font-bold uppercase font-mono border-b border-stone-100 pb-1 mb-1">
                    Direction
                  </div>
                  {[
                    { key: "flex-row", label: "Horizontal (Row)" },
                    { key: "flex-col", label: "Vertical (Col)" },
                    { key: "flex-wrap", label: "Wrap On" }
                  ].map((d) => (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => {
                        updateTree((n) => ({ classes: setGroupClass(n.classes, "flexDirection", d.key) }));
                        setActiveFlexSubmenu(null);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-left text-[10px] font-mono transition cursor-pointer ${
                        activeDir === d.key ? "bg-purple-600 text-white font-bold" : "text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ALIGN */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setActiveFlexSubmenu(activeFlexSubmenu === "alignment" ? null : "alignment")}
              className={`h-7 px-2 rounded-lg flex items-center gap-0.5 text-[9.5px] font-mono font-bold transition border cursor-pointer ${
                activeFlexSubmenu === "alignment"
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                  : "bg-stone-50 text-stone-700 border-stone-200/80 hover:bg-stone-100"
              }`}
            >
              <span>V-Align: {alignLabel}</span>
              <ChevronDown size={8} />
            </button>

            {activeFlexSubmenu === "alignment" && (
              <>
                <div className="fixed inset-0 z-50 bg-transparent" onClick={() => setActiveFlexSubmenu(null)} />
                <div className="absolute bottom-full left-0 mb-2 bg-white border border-stone-200 shadow-xl rounded-2xl p-1 w-[130px] z-[999] flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="px-2 py-0.5 text-[7px] text-stone-400 font-bold uppercase font-mono border-b border-stone-100 pb-1 mb-1">
                    Vertical Align
                  </div>
                  {[
                    { key: "", label: "Default" },
                    { key: "items-start", label: "Top (Start)" },
                    { key: "items-center", label: "Middle (Center)" },
                    { key: "items-end", label: "Bottom (End)" },
                    { key: "items-stretch", label: "Stretch" },
                    { key: "items-baseline", label: "Baseline" }
                  ].map((alignOpt) => (
                    <button
                      key={alignOpt.key}
                      type="button"
                      onClick={() => {
                        updateTree((n) => ({ classes: setGroupClass(n.classes, "alignment", alignOpt.key) }));
                        setActiveFlexSubmenu(null);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-left text-[10px] font-mono transition cursor-pointer ${
                        activeAlign === alignOpt.key ? "bg-purple-600 text-white font-bold" : "text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      {alignOpt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* JUSTIFY */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setActiveFlexSubmenu(activeFlexSubmenu === "justify" ? null : "justify")}
              className={`h-7 px-2 rounded-lg flex items-center gap-0.5 text-[9.5px] font-mono font-bold transition border cursor-pointer ${
                activeFlexSubmenu === "justify"
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                  : "bg-stone-50 text-stone-700 border-stone-200/80 hover:bg-stone-100"
              }`}
            >
              <span>H-Align: {justifyLabel}</span>
              <ChevronDown size={8} />
            </button>

            {activeFlexSubmenu === "justify" && (
              <>
                <div className="fixed inset-0 z-50 bg-transparent" onClick={() => setActiveFlexSubmenu(null)} />
                <div className="absolute bottom-full right-0 mb-2 bg-white border border-stone-200 shadow-xl rounded-2xl p-1 w-[135px] z-[999] flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="px-2 py-0.5 text-[7px] text-stone-400 font-bold uppercase font-mono border-b border-stone-100 pb-1 mb-1">
                    Horizontal Align
                  </div>
                  {[
                    { key: "", label: "Default" },
                    { key: "justify-start", label: "Start (Left)" },
                    { key: "justify-center", label: "Center" },
                    { key: "justify-end", label: "End (Right)" },
                    { key: "justify-between", label: "Space Between" },
                    { key: "justify-around", label: "Space Around" },
                    { key: "justify-evenly", label: "Space Evenly" }
                  ].map((j) => (
                    <button
                      key={j.key}
                      type="button"
                      onClick={() => {
                        updateTree((n) => ({ classes: setGroupClass(n.classes, "justify", j.key) }));
                        setActiveFlexSubmenu(null);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-left text-[10px] font-mono transition cursor-pointer ${
                        activeJustify === j.key ? "bg-purple-600 text-white font-bold" : "text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      {j.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* GAP */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setActiveFlexSubmenu(activeFlexSubmenu === "gap" ? null : "gap")}
              className={`h-7 px-2 rounded-lg flex items-center gap-0.5 text-[9.5px] font-mono font-bold transition border cursor-pointer ${
                activeFlexSubmenu === "gap"
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                  : "bg-stone-50 text-stone-700 border-stone-200/80 hover:bg-stone-100"
              }`}
            >
              <span>{gapLabel}</span>
              <ChevronDown size={8} />
            </button>

            {activeFlexSubmenu === "gap" && (
              <>
                <div className="fixed inset-0 z-50 bg-transparent" onClick={() => setActiveFlexSubmenu(null)} />
                <div className="absolute bottom-full right-0 mb-2 bg-white border border-stone-200 shadow-xl rounded-2xl p-1 w-[120px] z-[999] flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="px-2 py-0.5 text-[7px] text-stone-400 font-bold uppercase font-mono border-b border-stone-100 pb-1 mb-1">
                    Inter-element Gap
                  </div>
                  {[
                    { key: "", label: "No Gap" },
                    { key: "gap-1", label: "Tight (gap-1)" },
                    { key: "gap-2", label: "Small (gap-2)" },
                    { key: "gap-3", label: "Standard (gap-3)" },
                    { key: "gap-4", label: "Relaxed (gap-4)" },
                    { key: "gap-6", label: "Double (gap-6)" },
                    { key: "gap-8", label: "Spacious (gap-8)" }
                  ].map((g) => (
                    <button
                      key={g.key}
                      type="button"
                      onClick={() => {
                        updateTree((n) => ({ classes: setGroupClass(n.classes, "gap", g.key) }));
                        setActiveFlexSubmenu(null);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-left text-[10px] font-mono transition cursor-pointer ${
                        activeGap === g.key ? "bg-purple-600 text-white font-bold" : "text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    const props = getPropsForSubCategory(subCategory);
    if (props.length > 0) {
      const selectedPropId = selectedSubpropMap[subCategory] || props[0].id;
      const activeProp = props.find(p => p.id === selectedPropId) || props[0];
      const activeVal = getActiveValueForProp(activeProp, subCategory);

      const lengthPropIds = ['width', 'height', 'min-width', 'max-width', 'min-height', 'max-height', 'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'gap', 'top', 'right', 'bottom', 'left', 'inset', 'cols', 'rows', 'text-size', 'border-width', 'rounding'];

      return (
        <div className="flex-1 min-w-0 flex items-center gap-1.5 py-1 animate-fade-in select-none">
          {/* Property Select Dropdown */}
          <div className="flex-1 min-w-0">
             <PropertyControl
                type="select"
                value={selectedPropId}
                onChange={(val) => {
                  setSelectedSubpropMap(prev => ({ ...prev, [subCategory]: val }));
                }}
                options={props.map((p) => ({ value: p.id, label: p.label }))}
             />
          </div>

          {/* Value Select Dropdown */}
          <div className="flex-1 min-w-0">
             <PropertyControl
                type={lengthPropIds.includes(activeProp.id) ? "number" : "select"}
                value={activeVal || ""}
                onChange={(val) => handleApplyStyle(activeProp.id, val, subCategory)}
                placeholder="none"
                options={activeProp.values.map(v => ({ value: v, label: `${activeProp.prefix || ""}${v}` }))}
                unit={activeProp.id === 'rounding' ? 'px' : 'px'}
             />
          </div>
        </div>
      );
    }

    switch (inspectorSection) {
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
      <div className="relative shrink-0 flex items-center gap-1.5">
        <button
          type="button"
          className="w-[30px] h-[30px] rounded-full flex items-center justify-center transition border cursor-pointer bg-stone-50 hover:bg-stone-100 text-stone-500 border-stone-200/50"
          onClick={(e) => {
             e.stopPropagation();
             designer.setIsMobileDrawerOpen(true);
          }}
          title="Open Inspector Drawer"
        >
          <Sliders size={13} />
        </button>

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
      className="md:hidden fixed bottom-[84px] left-1/2 -translate-x-1/2 bg-stone-900 border border-stone-800 text-white shadow-2xl flex items-center justify-start overflow-x-auto scrollbar-hide px-3.5 py-1 gap-2 shrink-0 z-40 touch-pan-x max-w-[390px] w-[92vw]"
      style={{ 
        height: "44.5px", 
        borderRadius: "50px", 
        marginBottom: "-12px",
        textAlign: "center",
        boxSizing: "border-box",
        paddingLeft: "4px",
        paddingRight: "4px",
        WebkitOverflowScrolling: "touch"
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
