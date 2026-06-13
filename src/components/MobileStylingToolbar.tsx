import React from "react";
import {
  Sparkles,
  Palette,
  Maximize,
  Type,
  Layers,
  Play,
  Code,
  HelpCircle,
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  MousePointer,
  Grid,
  Compass,
  Cpu,
  Move,
  Wand2,
  Sliders,
  ChevronDown,
  MoreVertical,
  Image,
  Route,
  ZoomIn,
  List,
  PenTool,
  Columns,
  Scissors,
  Pointer,
  Printer,
  Box,
  Settings,
  Anchor,
  Layout,
  Eye,
} from "lucide-react";
import { useDesigner } from "../contexts/DesignerContext";
import { InspectorSection, CSS_HIERARCHY_DATA } from "./InspectorPanel";
import { PropertyControl } from "./PropertyControl";
import {
  setGroupClass,
  getActiveGroupClass,
  setPrefixedClass,
  getPrefixedClass,
  setColorClass,
  STYLE_GROUPS,
} from "../styleUtils";

export interface StylePropertyConfig {
  id: string;
  label: string;
  prefix: string;
  values: string[];
  group?: string;
}

const tabsInfo = [
  { id: "layoutBoxModel", label: "Layout & Box", icon: Maximize },
  { id: "typographyText", label: "Text & Typo", icon: Type },
  { id: "appearanceAestheticsSvg", label: "Appearance", icon: Palette },
  { id: "motionTransforms", label: "Motion", icon: Play },
  { id: "interactivityUiMisc", text: "Interact", label: "Interactivity", icon: MousePointer },
  { id: "environmentMediaArchitecture", label: "Environment", icon: Layers },
];

const getPropsForSubCategory = (
  subCat: string,
  section?: string,
): StylePropertyConfig[] => {
  if (
    subCat.startsWith("dynamic_") &&
    section &&
    window.__dynamicCategoryMapping &&
    window.__dynamicCategoryMapping[section]
  ) {
    const idx = parseInt(subCat.split("_")[1]);
    const hierarchy = CSS_HIERARCHY_DATA.find(
      (c) => c.name === window.__dynamicCategoryMapping[section],
    );
    if (hierarchy && hierarchy.subCategories[idx]) {
      return hierarchy.subCategories[idx].properties.map((prop) => {
        const vals = prop.values
          .split("|")
          .map((v) => v.replace(/<[^>]+>/g, "").trim())
          .filter(Boolean);
        const uniqueVals = vals.filter((v, i, a) => a.indexOf(v) === i);
        return {
          id: prop.name,
          label: prop.name,
          prefix: `[${prop.name}:`, // Special notation for dynamic
          values: uniqueVals,
        };
      });
    }
  }

  return [];
};

declare global {
  interface Window {
    __dynamicCategoryMapping: Record<string, string>;
  }
}

export function MobileToolControls() {
  const designer = useDesigner();
  const {
    selectedElement,
    inspectorSection,
    updateTree,
    deleteElement,
    duplicateElement,
    mobileActiveView,
  } = designer;

  const getInitialSubCategory = (section: string) => {
    if (
      [
        "layoutBoxModel",
        "typographyText",
        "appearanceAestheticsSvg",
        "motionTransforms",
        "interactivityUiMisc",
        "environmentMediaArchitecture",
      ].includes(section)
    ) {
      return "dynamic_0";
    }
    if (section === "layout") return "display";
    if (section === "spacing") return "spacingModel";
    if (section === "sizing") return "sizingModel";
    if (section === "typography") return "typographyStyles";
    if (section === "visuals") return "colors";
    if (section === "motion") return "transitions";
    if (section === "animation") return "movement";
    if (section === "animations") return "paths";
    if (section === "viewTransitions") return "transitions";
    if (section === "interactivity") return "interact";
    if (section === "media") return "media";
    return "dynamic_0";
  };

  const [subCategory, setSubCategory] = React.useState<string>(() =>
    getInitialSubCategory(inspectorSection),
  );
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] =
    React.useState(false);
  const [activeFlexSubmenu, setActiveFlexSubmenu] = React.useState<
    "direction" | "alignment" | "justify" | "gap" | null
  >(null);

  // Property & Value select dropdown menus
  const [selectedSubpropMap, setSelectedSubpropMap] = React.useState<
    Record<string, string>
  >({
    display: "display-mode",
    spacingModel: "margin",
    sizingModel: "width",
    positioning: "position",
    flexbox: "display",
    grid: "display",
    overflow: "overflow",
    typographyStyles: "text-size",
    typographySpacing: "text-align",
    colors: "background-color",
    borders: "rounding",
    transitions: "transition",
    animations: "animation",
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
    if (prop.group && prop.group in STYLE_GROUPS) {
      const activeClass = getActiveGroupClass(classes, prop.group as any);
      if (!activeClass) return "";

      // If we have a prefix, extract the value after it
      if (prop.prefix) {
        if (activeClass.startsWith(prop.prefix)) {
          return activeClass.slice(prop.prefix.length);
        }
      } else {
        // Find inside prop.values that matches activeClass (or if value matches activeClass exactly)
        return prop.values.find((v) => v === activeClass) || "";
      }
    }

    // 2. If it is a prefixed style property
    if (prop.prefix) {
      const match = tokens.find((t) => t.startsWith(prop.prefix));
      if (match) {
        return match.slice(prop.prefix.length);
      }
    } else {
      // 3. No prefix, no group. It is an arbitrary class list toggle (like hover:scale-[1.05] or scroll-smooth)
      return prop.values.find((v) => tokens.includes(v)) || "";
    }

    return "";
  };

  const handleApplyStyle = (propId: string, val: string, subCat: string) => {
    const props = getPropsForSubCategory(subCat, inspectorSection);
    const prop = props.find((p) => p.id === propId);
    if (!prop) return;

    updateTree((node) => {
      let nextClasses = node.classes || "";
      let tokens = nextClasses.split(/\s+/).filter(Boolean);
      const isArbitrary =
        prop.prefix?.startsWith("[") && prop.prefix?.endsWith(":");
      const classToApply = isArbitrary
        ? `${prop.prefix}${val}]`
        : prop.prefix
          ? `${prop.prefix}${val}`
          : val;

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

        if (prop.group && prop.group in STYLE_GROUPS) {
          nextClasses = setGroupClass(nextClasses, prop.group as any, "");
        } else if (prop.prefix) {
          nextClasses = tokens
            .filter((t) => !t.startsWith(prop.prefix))
            .join(" ");
        } else {
          // No prefix, remove any of the values in the set
          nextClasses = tokens
            .filter((t) => !prop.values.includes(t))
            .join(" ");
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
          return {
            classes: setColorClass(nextClasses, "border-", classToApply),
          };
        }
      }

      if (prop.group && prop.group in STYLE_GROUPS) {
        nextClasses = setGroupClass(
          nextClasses,
          prop.group as any,
          classToApply,
        );
      } else {
        if (prop.prefix) {
          // Remove existing with same prefix
          let filtered = tokens.filter((t) => !t.startsWith(prop.prefix));

          // Box model padding clear logic
          if (prop.id === "padding") {
            filtered = filtered.filter(
              (t) =>
                !t.startsWith("pt-") &&
                !t.startsWith("pb-") &&
                !t.startsWith("pl-") &&
                !t.startsWith("pr-") &&
                !t.startsWith("px-") &&
                !t.startsWith("py-"),
            );
          }
          if (
            [
              "padding-top",
              "padding-right",
              "padding-bottom",
              "padding-left",
            ].includes(prop.id)
          ) {
            filtered = filtered.filter((t) => !t.startsWith("p-"));
          }
          // Box model margin clear logic
          if (prop.id === "margin") {
            filtered = filtered.filter(
              (t) =>
                !t.startsWith("mt-") &&
                !t.startsWith("mb-") &&
                !t.startsWith("ml-") &&
                !t.startsWith("mr-") &&
                !t.startsWith("mx-") &&
                !t.startsWith("my-"),
            );
          }
          if (
            [
              "margin-top",
              "margin-right",
              "margin-bottom",
              "margin-left",
            ].includes(prop.id)
          ) {
            filtered = filtered.filter((t) => !t.startsWith("m-"));
          }

          filtered.push(classToApply);
          nextClasses = filtered.join(" ");
        } else {
          // No prefix, no group. It is a plain toggle of values in prop.values.
          // First, filter out any of other values in this prop.values to avoid conflicts
          let filtered = tokens.filter((t) => !prop.values.includes(t));
          filtered.push(classToApply);
          nextClasses = filtered.join(" ");
        }
      }
      return { classes: nextClasses };
    });
  };

  // Dynamic Subcategories Map based on Active Tab aligning exactly with desktop
  const subCategoriesConfig: Record<
    string,
    { id: string; label: string; icon: any }[]
  > = {
    core: [
      { id: "contentDetails", label: "Content Details", icon: Sparkles },
      { id: "utilityClasses", label: "Utility Classes", icon: Code },
    ],
    help: [{ id: "guide", label: "Guide", icon: HelpCircle }],
  };

  const dynamicCategoryMapping: Record<string, string> = {
    layoutBoxModel: "Layout & Box Model",
    typographyText: "Typography & Text",
    appearanceAestheticsSvg: "Appearance, Aesthetics & SVG",
    motionTransforms: "Motion & Transforms",
    interactivityUiMisc: "Interactivity, UI & Miscellaneous",
    environmentMediaArchitecture: "Environment, Media & Architecture",
  };

  if (typeof window !== "undefined") {
    window.__dynamicCategoryMapping = dynamicCategoryMapping;
  }

  Object.entries(dynamicCategoryMapping).forEach(([tabId, cssCategory]) => {
    const hierarchy = CSS_HIERARCHY_DATA.find((c) => c.name === cssCategory);
    if (hierarchy) {
      subCategoriesConfig[tabId] = hierarchy.subCategories.map((sub, idx) => ({
        id: `dynamic_${idx}`,
        label: sub.name,
        icon: Settings,
      }));
    }
  });

  const isClassActive = (item: {
    class: string;
    group?: string;
    prefix?: string;
  }) => {
    const isGroupKey = item.group && item.group in STYLE_GROUPS;
    if (isGroupKey) {
      return getActiveGroupClass(classes, item.group as any) === item.class;
    } else if (item.prefix) {
      return classes.split(/\s+/).includes(item.class);
    }
    return classes.split(/\s+/).includes(item.class);
  };

  const handleApplyClass = (item: {
    class: string;
    group?: string;
    prefix?: string;
  }) => {
    updateTree((node) => {
      let nextClasses = node.classes || "";
      const isGroupKey = item.group && item.group in STYLE_GROUPS;

      if (isGroupKey) {
        nextClasses = setGroupClass(nextClasses, item.group as any, item.class);
      } else if (item.prefix) {
        // If already exists exactly, toggle it off
        if (nextClasses.split(/\s+/).includes(item.class)) {
          nextClasses = nextClasses
            .split(/\s+/)
            .filter((t) => t !== item.class)
            .join(" ");
        } else {
          nextClasses = setPrefixedClass(nextClasses, item.prefix, item.class);
        }
      } else {
        // Standard arbitrary class toggle
        const tokens = nextClasses.split(/\s+/).filter(Boolean);
        if (tokens.includes(item.class)) {
          nextClasses = tokens.filter((t) => t !== item.class).join(" ");
        } else {
          nextClasses = [...tokens, item.class].join(" ");
        }
      }
      return { classes: nextClasses };
    });
  };

  const renderMiddleControls = () => {
    if (subCategory === "flexbox") {
      const isFlexEnabled =
        classes.includes("flex") || classes.includes("inline-flex");

      if (!isFlexEnabled) {
        return (
          <div className="flex-1 flex items-center justify-center animate-fade-in select-none">
            <button
              type="button"
              onClick={() => {
                updateTree((n) => ({
                  classes: setGroupClass(n.classes, "display", "flex"),
                }));
              }}
              className="w-full h-8 rounded-full bg-rose-600 font-bold font-sans text-[10px] text-white flex items-center justify-center gap-1 hover:bg-rose-700 active:scale-95 transition cursor-pointer select-none"
            >
              <Cpu size={12} />
              <span>Enable Flexbox Layout</span>
            </button>
          </div>
        );
      }

      const activeDir =
        getActiveGroupClass(classes, "flexDirection") || "flex-row";
      const activeJustify = getActiveGroupClass(classes, "justify") || "";
      const activeAlign = getActiveGroupClass(classes, "alignment") || "";
      const activeGap = getActiveGroupClass(classes, "gap") || "";

      const dirLabel =
        activeDir === "flex-col"
          ? "Col"
          : activeDir === "flex-wrap"
            ? "Wrap"
            : "Row";

      const justifyLabelMap: Record<string, string> = {
        "": "Justify",
        "justify-start": "Left",
        "justify-center": "Center",
        "justify-end": "Right",
        "justify-between": "Between",
        "justify-around": "Around",
        "justify-evenly": "Evenly",
      };
      const justifyLabel = justifyLabelMap[activeJustify] || "Justify";

      const alignLabelMap: Record<string, string> = {
        "": "Align",
        "items-start": "Top",
        "items-center": "Mid",
        "items-end": "Bot",
        "items-stretch": "Stretch",
        "items-baseline": "Base",
      };
      const alignLabel = alignLabelMap[activeAlign] || "Align";

      const gapLabelMap: Record<string, string> = {
        "": "No Gap",
        "gap-1": "Gap-1",
        "gap-2": "Gap-2",
        "gap-3": "Gap-3",
        "gap-4": "Gap-4",
        "gap-6": "Gap-6",
        "gap-8": "Gap-8",
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
              onClick={() =>
                setActiveFlexSubmenu(
                  activeFlexSubmenu === "direction" ? null : "direction",
                )
              }
              className={`h-7 px-2 rounded-lg flex items-center gap-0.5 text-[9.5px] font-mono font-bold transition border cursor-pointer ${
                activeFlexSubmenu === "direction"
                  ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                  : "bg-stone-50 text-stone-700 border-stone-200/80 hover:bg-stone-100"
              }`}
            >
              <span>Dir: {dirLabel}</span>
              <ChevronDown size={8} />
            </button>

            {activeFlexSubmenu === "direction" && (
              <>
                <div
                  className="fixed inset-0 z-50 bg-transparent"
                  onClick={() => setActiveFlexSubmenu(null)}
                />
                <div className="absolute bottom-full left-0 mb-2 bg-white border border-stone-200 shadow-xl rounded-2xl p-1 w-[120px] z-[999] flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="px-2 py-0.5 text-[7px] text-stone-400 font-bold uppercase font-mono border-b border-stone-100 pb-1 mb-1">
                    Direction
                  </div>
                  {[
                    { key: "flex-row", label: "Horizontal (Row)" },
                    { key: "flex-col", label: "Vertical (Col)" },
                    { key: "flex-wrap", label: "Wrap On" },
                  ].map((d) => (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => {
                        updateTree((n) => ({
                          classes: setGroupClass(
                            n.classes,
                            "flexDirection",
                            d.key,
                          ),
                        }));
                        setActiveFlexSubmenu(null);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-left text-[10px] font-mono transition cursor-pointer ${
                        activeDir === d.key
                          ? "bg-rose-600 text-white font-bold"
                          : "text-stone-600 hover:bg-stone-50"
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
              onClick={() =>
                setActiveFlexSubmenu(
                  activeFlexSubmenu === "alignment" ? null : "alignment",
                )
              }
              className={`h-7 px-2 rounded-lg flex items-center gap-0.5 text-[9.5px] font-mono font-bold transition border cursor-pointer ${
                activeFlexSubmenu === "alignment"
                  ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                  : "bg-stone-50 text-stone-700 border-stone-200/80 hover:bg-stone-100"
              }`}
            >
              <span>V-Align: {alignLabel}</span>
              <ChevronDown size={8} />
            </button>

            {activeFlexSubmenu === "alignment" && (
              <>
                <div
                  className="fixed inset-0 z-50 bg-transparent"
                  onClick={() => setActiveFlexSubmenu(null)}
                />
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
                    { key: "items-baseline", label: "Baseline" },
                  ].map((alignOpt) => (
                    <button
                      key={alignOpt.key}
                      type="button"
                      onClick={() => {
                        updateTree((n) => ({
                          classes: setGroupClass(
                            n.classes,
                            "alignment",
                            alignOpt.key,
                          ),
                        }));
                        setActiveFlexSubmenu(null);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-left text-[10px] font-mono transition cursor-pointer ${
                        activeAlign === alignOpt.key
                          ? "bg-rose-600 text-white font-bold"
                          : "text-stone-600 hover:bg-stone-50"
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
              onClick={() =>
                setActiveFlexSubmenu(
                  activeFlexSubmenu === "justify" ? null : "justify",
                )
              }
              className={`h-7 px-2 rounded-lg flex items-center gap-0.5 text-[9.5px] font-mono font-bold transition border cursor-pointer ${
                activeFlexSubmenu === "justify"
                  ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                  : "bg-stone-50 text-stone-700 border-stone-200/80 hover:bg-stone-100"
              }`}
            >
              <span>H-Align: {justifyLabel}</span>
              <ChevronDown size={8} />
            </button>

            {activeFlexSubmenu === "justify" && (
              <>
                <div
                  className="fixed inset-0 z-50 bg-transparent"
                  onClick={() => setActiveFlexSubmenu(null)}
                />
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
                    { key: "justify-evenly", label: "Space Evenly" },
                  ].map((j) => (
                    <button
                      key={j.key}
                      type="button"
                      onClick={() => {
                        updateTree((n) => ({
                          classes: setGroupClass(n.classes, "justify", j.key),
                        }));
                        setActiveFlexSubmenu(null);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-left text-[10px] font-mono transition cursor-pointer ${
                        activeJustify === j.key
                          ? "bg-rose-600 text-white font-bold"
                          : "text-stone-600 hover:bg-stone-50"
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
              onClick={() =>
                setActiveFlexSubmenu(activeFlexSubmenu === "gap" ? null : "gap")
              }
              className={`h-7 px-2 rounded-lg flex items-center gap-0.5 text-[9.5px] font-mono font-bold transition border cursor-pointer ${
                activeFlexSubmenu === "gap"
                  ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                  : "bg-stone-50 text-stone-700 border-stone-200/80 hover:bg-stone-100"
              }`}
            >
              <span>{gapLabel}</span>
              <ChevronDown size={8} />
            </button>

            {activeFlexSubmenu === "gap" && (
              <>
                <div
                  className="fixed inset-0 z-50 bg-transparent"
                  onClick={() => setActiveFlexSubmenu(null)}
                />
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
                    { key: "gap-8", label: "Spacious (gap-8)" },
                  ].map((g) => (
                    <button
                      key={g.key}
                      type="button"
                      onClick={() => {
                        updateTree((n) => ({
                          classes: setGroupClass(n.classes, "gap", g.key),
                        }));
                        setActiveFlexSubmenu(null);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-left text-[10px] font-mono transition cursor-pointer ${
                        activeGap === g.key
                          ? "bg-rose-600 text-white font-bold"
                          : "text-stone-600 hover:bg-stone-50"
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

    const props = getPropsForSubCategory(subCategory, inspectorSection);
    if (props.length > 0) {
      const selectedPropId = selectedSubpropMap[subCategory] || props[0].id;
      const activeProp = props.find((p) => p.id === selectedPropId) || props[0];
      const activeVal = getActiveValueForProp(activeProp, subCategory);

      const lengthPropIds = [
        "width",
        "height",
        "min-width",
        "max-width",
        "min-height",
        "max-height",
        "margin",
        "margin-top",
        "margin-right",
        "margin-bottom",
        "margin-left",
        "padding",
        "padding-top",
        "padding-right",
        "padding-bottom",
        "padding-left",
        "gap",
        "top",
        "right",
        "bottom",
        "left",
        "inset",
        "cols",
        "rows",
        "text-size",
        "border-width",
        "rounding",
      ];

      return (
        <div className="flex-1 min-w-0 flex items-center gap-1.5 py-1 animate-fade-in select-none">
          {/* Property Select Dropdown */}
          <div className="flex-1 min-w-0">
            <PropertyControl
              type="select"
              value={selectedPropId}
              onChange={(val) => {
                setSelectedSubpropMap((prev) => ({
                  ...prev,
                  [subCategory]: val,
                }));
              }}
              options={props.map((p) => ({ value: p.id, label: p.label }))}
            />
          </div>

          {/* Value Select Dropdown */}
          <div className="flex-1 min-w-0">
            <PropertyControl
              type={lengthPropIds.includes(activeProp.id) ? "number" : "select"}
              value={activeVal || ""}
              onChange={(val) =>
                handleApplyStyle(activeProp.id, val, subCategory)
              }
              placeholder="none"
              options={activeProp.values.map((v) => ({
                value: v,
                label:
                  activeProp.prefix?.startsWith("[") &&
                  activeProp.prefix?.endsWith(":")
                    ? `${activeProp.prefix}${v}]`
                    : `${activeProp.prefix || ""}${v}`,
              }))}
              unit={activeProp.id === "rounding" ? "px" : "px"}
            />
          </div>
        </div>
      );
    }

    switch (inspectorSection) {
      default:
        return null;
    }
  };

  const activeTab =
    tabsInfo.find((t) => t.id === inspectorSection) || tabsInfo[0];

  return (
    <div
      id="mobile_tool_controls"
      className="md:hidden fixed bottom-[138px] left-1/2 -translate-x-1/2 bg-white border border-stone-200/50 p-2 px-3 shadow-[0_12px_45px_rgba(0,0,0,0.18)] flex items-center justify-between gap-2 w-[94vw] max-w-[390px] backdrop-blur-md z-45 animate-fade-in"
      style={{
        marginBottom: "-12px",
        borderRadius: "50px",
        height: "46px",
        borderWidth: "0px",
      }}
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
            const currentSub = subCategoriesConfig[inspectorSection]?.find(
              (s) => s.id === subCategory,
            );
            const IconComponent = currentSub?.icon || activeTab.icon;
            return (
              <IconComponent size={11} className="text-rose-600 shrink-0" />
            );
          })()}
          <span className="max-w-[75px] truncate">
            {subCategoriesConfig[inspectorSection]?.find(
              (s) => s.id === subCategory,
            )?.label || "Box Model"}
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
              style={{
                maxHeight: "320px",
                overflowY: "auto",
                borderWidth: "0px",
              }}
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
                        ? "bg-rose-50 text-rose-700 font-bold border border-rose-100/40"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                  >
                    <sub.icon
                      size={11}
                      className={
                        isSelected ? "text-rose-600" : "text-stone-400"
                      }
                    />
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
              ? "bg-rose-50 text-rose-600 border-rose-200 shadow-sm"
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
    mobileActiveView,
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
          height: "41.4805px",
          borderRadius: "50px",
          marginBottom: "-12px",
          textAlign: "center",
          boxSizing: "border-box",
          paddingLeft: "4px",
          paddingRight: "4px",
        }}
      >
        <div className="flex items-center gap-2 text-[11px] font-medium text-stone-200 animate-pulse">
          <MousePointer size={14} className="text-rose-400" />
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
        height: "41.4805px",
        borderRadius: "50px",
        marginBottom: "-12px",
        textAlign: "center",
        boxSizing: "border-box",
        paddingLeft: "4px",
        paddingRight: "4px",
        WebkitOverflowScrolling: "touch",
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
            <tab.icon
              size={11.5}
              className={isActive ? "text-rose-600" : "text-stone-400"}
            />
            <span className="text-[10px] tracking-tight whitespace-nowrap">
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
