import React from "react";
import { 
  Sparkles, Palette, Maximize, Type, Layers, Play, Code, 
  HelpCircle, Trash2, Copy, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  MousePointer, Grid, Compass, Cpu, Move, Wand2, Sliders, ChevronDown
} from "lucide-react";
import { useDesigner } from "../contexts/DesignerContext";
import { InspectorSection } from "./InspectorPanel";
import { 
  setGroupClass, getActiveGroupClass, 
  setPrefixedClass, getPrefixedClass, 
  setColorClass 
} from "../styleUtils";

const tabsInfo = [
  { id: "layout", label: "Layout", icon: Maximize },
  { id: "typography", label: "Text", icon: Type },
  { id: "visuals", label: "Visuals", icon: Palette },
  { id: "motion", label: "Motion", icon: Play },
  { id: "core", label: "Code", icon: Sparkles }
];

export function MobileToolControls() {
  const designer = useDesigner();
  const {
    selectedElement,
    inspectorSection,
    updateTree,
    deleteElement,
    duplicateElement,
    mobileActiveView,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen
  } = designer;

  const [subCategory, setSubCategory] = React.useState<string>("all");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  // Sync / Reset when active element or tab category changes
  React.useEffect(() => {
    setSubCategory("all");
    setIsDropdownOpen(false);
  }, [selectedElement?.id, inspectorSection]);

  // Render ONLY when inside inspector view and we have a selected element
  if (mobileActiveView !== "inspector" || !selectedElement) return null;

  const classes = selectedElement.classes || "";

  // Dynamic Subcategories Map based on Active Tab
  const subCategoriesConfig: Record<string, { id: string; label: string; icon: any }[]> = {
    layout: [
      { id: "all", label: "All Layout", icon: Maximize },
      { id: "width", label: "Sizing", icon: Grid },
      { id: "padding", label: "Padding", icon: Compass },
      { id: "display", label: "Flex & Grid", icon: Cpu }
    ],
    typography: [
      { id: "all", label: "All Text", icon: Type },
      { id: "sizes", label: "Sizes", icon: Type },
      { id: "align", label: "Alignment", icon: AlignCenter }
    ],
    visuals: [
      { id: "all", label: "All Visuals", icon: Palette },
      { id: "color", label: "Colors", icon: Palette },
      { id: "rounded", label: "Curves", icon: Layers }
    ],
    motion: [
      { id: "all", label: "All Motion", icon: Play },
      { id: "hover", label: "Hovers", icon: Play },
      { id: "static", label: "Effects", icon: Sparkles }
    ],
    core: [
      { id: "all", label: "All Content", icon: Sparkles }
    ]
  };

  const renderMiddleControls = () => {
    switch (inspectorSection) {
      case "layout": {
        // Quick layout presets (Dimension + Spacing shorthand)
        let layoutItems = [
          { label: "Full-W", class: "w-full", group: "width" },
          { label: "Half-W", class: "w-1/2", group: "width" },
          { label: "Auto-W", class: "w-auto", group: "width" },
          { label: "p-2", class: "p-2", group: "padding" },
          { label: "p-4", class: "p-4", group: "padding" },
          { label: "p-6", class: "p-6", group: "padding" },
          { label: "p-8", class: "p-8", group: "padding" },
          { label: "Flex", class: "flex", group: "display" },
          { label: "Column", class: "flex-col", group: "flexDirection" },
          { label: "Row", class: "flex-row", group: "flexDirection" }
        ];

        // Apply sub-category filters
        if (subCategory === "width") {
          layoutItems = layoutItems.filter(item => item.group === "width");
        } else if (subCategory === "padding") {
          layoutItems = layoutItems.filter(item => item.group === "padding");
        } else if (subCategory === "display") {
          layoutItems = layoutItems.filter(item => item.group === "display" || item.group === "flexDirection");
        }

        return (
          <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 animate-fade-in select-none">
            {layoutItems.map((item) => {
              let isSelected = false;
              if (item.group === "width") {
                isSelected = getActiveGroupClass(classes, "width") === item.class;
              } else if (item.group === "display") {
                isSelected = getActiveGroupClass(classes, "display") === item.class;
              } else if (item.group === "flexDirection") {
                isSelected = classes.includes(item.class);
              } else {
                isSelected = classes.includes(item.class);
              }

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.group === "width") {
                      updateTree((n) => ({ classes: setGroupClass(n.classes, "width", item.class) }));
                    } else if (item.group === "display") {
                      updateTree((n) => ({ classes: setGroupClass(n.classes, "display", item.class) }));
                    } else if (item.group === "flexDirection") {
                      updateTree((n) => ({ classes: setGroupClass(n.classes, "flexDirection", item.class) }));
                    } else {
                      // padding
                      updateTree((n) => ({ classes: setPrefixedClass(n.classes, "p-", item.class) }));
                    }
                  }}
                  className={`px-3 py-1.5 text-[10px] font-mono rounded-xl shrink-0 transition border cursor-pointer ${
                    isSelected 
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
        const sizePresets = [
          { label: "xs", value: "text-xs" },
          { label: "sm", value: "text-sm" },
          { label: "base", value: "text-base" },
          { label: "lg", value: "text-lg" },
          { label: "xl", value: "text-xl" },
          { label: "2xl", value: "text-2xl" },
          { label: "3xl", value: "text-3xl" }
        ];
        const aligns = [
          { key: "text-left", icon: AlignLeft },
          { key: "text-center", icon: AlignCenter },
          { key: "text-right", icon: AlignRight },
          { key: "text-justify", icon: AlignJustify }
        ];
        const activeSize = getActiveGroupClass(classes, "textSize");
        const activeAlign = getActiveGroupClass(classes, "textAlign") || "text-left";

        const showSizes = subCategory === "all" || subCategory === "sizes";
        const showAligns = subCategory === "all" || subCategory === "align";

        return (
          <div className="flex-1 min-w-0 flex items-center justify-between gap-2.5 overflow-x-auto scrollbar-hide py-1 animate-fade-in select-none">
            {showSizes && (
              <div className="flex items-center gap-1 shrink-0 overflow-x-auto scrollbar-hide">
                {sizePresets.map((sz) => {
                  const isSelected = activeSize === sz.value;
                  return (
                    <button
                      key={sz.label}
                      onClick={() => updateTree((n) => ({ classes: setGroupClass(n.classes, "textSize", sz.value) }))}
                      className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg transition shrink-0 border cursor-pointer ${
                        isSelected 
                          ? "bg-purple-600 border-purple-500 text-white font-bold" 
                          : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {sz.label}
                    </button>
                  );
                })}
              </div>
            )}
            
            {showSizes && showAligns && <div className="h-4 w-px bg-stone-200 shrink-0"></div>}

            {showAligns && (
              <div className="flex items-center gap-1 shrink-0">
                {aligns.map((align) => {
                  const isSelected = activeAlign === align.key;
                  return (
                    <button
                      key={align.key}
                      onClick={() => updateTree((n) => ({ classes: setGroupClass(n.classes, "textAlign", align.key) }))}
                      className={`p-1.5 rounded-lg transition border cursor-pointer ${
                        isSelected 
                          ? "bg-purple-100 border-purple-200 text-purple-600" 
                          : "bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      <align.icon size={11} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case "visuals": {
        const shadingColors = [
          { label: "Clear", bg: "bg-transparent", text: "text-stone-400", class: "bg-transparent" },
          { label: "White", bg: "bg-white", class: "bg-white border border-stone-200" },
          { label: "Dark", bg: "bg-stone-900 border border-stone-800", class: "bg-stone-900" },
          { label: "Stone", bg: "bg-stone-100", class: "bg-stone-100 border border-stone-200" },
          { label: "Amber", bg: "bg-amber-50", class: "bg-amber-100 border border-amber-200" },
          { label: "Indigo", bg: "bg-indigo-950", class: "bg-indigo-950" },
          { label: "Purple", bg: "bg-purple-100", class: "bg-purple-100" },
          { label: "Teal", bg: "bg-emerald-900", class: "bg-emerald-900" }
        ];
        const activeBg = getPrefixedClass(classes, "bg-") || "bg-transparent";

        const roundingPresets = [
          { label: "Flat", value: "rounded-none" },
          { label: "MD", value: "rounded-md" },
          { label: "XL", value: "rounded-xl" },
          { label: "Pill", value: "rounded-full" }
        ];
        const activeRounding = getActiveGroupClass(classes, "rounding") || "rounded-none";

        const showColors = subCategory === "all" || subCategory === "color";
        const showRounding = subCategory === "all" || subCategory === "rounded";

        return (
          <div className="flex-1 min-w-0 flex items-center justify-between gap-3 overflow-x-auto scrollbar-hide py-1 animate-fade-in select-none">
            {showColors && (
              <div className="flex items-center gap-2 shrink-0 py-1">
                {shadingColors.map((color) => {
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
            )}

            {showColors && showRounding && <div className="h-4 w-px bg-stone-200 shrink-0"></div>}

            {showRounding && (
              <div className="flex items-center gap-1 shrink-0">
                {roundingPresets.map((r) => {
                  const isSelected = activeRounding === r.value;
                  return (
                    <button
                      key={r.label}
                      onClick={() => updateTree((n) => ({ classes: setGroupClass(n.classes, "rounding", r.value) }))}
                      className={`px-2 py-0.5 text-[9px] font-semibold rounded-md transition shrink-0 border cursor-pointer ${
                        isSelected 
                          ? "bg-purple-600 border-purple-500 text-white" 
                          : "bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100"
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case "motion": {
        let animations = [
          { label: "Zoom Hover", class: "transition-all duration-300 hover:scale-[1.03]" },
          { label: "Rotate Hover", class: "transition-transform duration-300 hover:rotate-3" },
          { label: "Fade-in", class: "animate-fade-in" },
          { label: "Pulse", class: "animate-pulse" },
          { label: "Bounce", class: "animate-bounce" }
        ];

        if (subCategory === "hover") {
          animations = animations.filter(anim => anim.label.includes("Hover"));
        } else if (subCategory === "static") {
          animations = animations.filter(anim => !anim.label.includes("Hover"));
        }

        return (
          <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 animate-fade-in select-none">
            {animations.map((anim) => {
               const active = classes.includes(anim.class.split(" ")[0]);
               return (
                 <button
                   key={anim.label}
                   onClick={() => {
                     updateTree((node) => {
                       const tokens = node.classes?.split(/\s+/) || [];
                       let nextClasses = "";
                       if (active) {
                         nextClasses = tokens.filter(t => !anim.class.includes(t)).join(" ");
                       } else {
                         nextClasses = [...tokens, anim.class].join(" ");
                       }
                       return { classes: nextClasses };
                     });
                   }}
                   className={`px-2.5 py-1 text-[10px] rounded-lg border transition shrink-0 cursor-pointer ${
                     active 
                       ? "bg-purple-600 border-purple-500 text-white font-bold" 
                       : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                   }`}
                 >
                   {anim.label}
                 </button>
               );
            })}
          </div>
        );
      }

      case "core":
        return (
          <div className="flex-1 flex items-center pr-1 animate-fade-in select-none gap-2">
            {selectedElement.content !== undefined ? (
              <input 
                type="text" 
                value={selectedElement.content || ""} 
                onChange={(e) => updateTree(() => ({ content: e.target.value }))}
                className="flex-1 bg-stone-50 border border-stone-200/80 rounded-xl px-2.5 py-1 text-[10.5px] focus:outline-none focus:border-purple-500 font-sans text-stone-800"
                placeholder="Text content..."
              />
            ) : (
              <input 
                type="text" 
                value={selectedElement.classes || ""} 
                onChange={(e) => updateTree(() => ({ classes: e.target.value }))}
                className="flex-1 bg-stone-50 border border-stone-200/80 rounded-xl px-2.5 py-1 text-[10px] focus:outline-none focus:border-purple-500 font-mono text-stone-800"
                placeholder="Utilities list..."
              />
            )}
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
          className="flex items-center gap-1.5 shrink-0 text-stone-800 font-bold uppercase font-mono tracking-wider text-[8.5px] bg-stone-50 hover:bg-stone-100 active:scale-95 px-2.5 py-1.5 rounded-full border border-stone-250 transition cursor-pointer select-none"
        >
          {(() => {
            const currentSub = subCategoriesConfig[inspectorSection]?.find(s => s.id === subCategory);
            const IconComponent = currentSub?.icon || activeTab.icon;
            return <IconComponent size={11} className="text-purple-600 shrink-0" />;
          })()}
          <span className="max-w-[75px] truncate">
            {subCategoriesConfig[inspectorSection]?.find(s => s.id === subCategory)?.label || "All Layout"}
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
              style={{ maxHeight: "320px", overflowY: "auto" }}
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

      {/* Right Actions: Detail Sliders, Duplicate & Delete */}
      <div className="flex items-center gap-1 shrink-0">
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); setIsMobileDrawerOpen(true); }}
          className="w-7 h-7 rounded-full bg-purple-50 hover:bg-purple-100 flex items-center justify-center text-purple-600 transition border border-purple-200/50 cursor-pointer"
          title="Open Detailed Style Panel"
        >
          <Sliders size={12} />
        </button>
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); duplicateElement(selectedElement.id); }}
          className="w-7 h-7 rounded-full bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-500 transition border border-stone-200/50 cursor-pointer"
          title="Duplicate Element"
        >
          <Copy size={12} />
        </button>
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); deleteElement(selectedElement.id); }}
          className="w-7 h-7 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center text-rose-500 transition border border-rose-200/60 cursor-pointer"
          title="Delete Element"
        >
          <Trash2 size={12} />
        </button>
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
