import React, { useState } from "react";
import { Settings, Maximize, ChevronDown, Sliders, Cpu, Grid, Compass } from "lucide-react";
import { VisualElement } from "../../types";
import { getActiveGroupClass } from "../../styleUtils";

// Import lightweight panels
import { DisplayPanel } from "./layout/DisplayPanel";
import { FlexboxPanel } from "./layout/FlexboxPanel";
import { GridPanel } from "./layout/GridPanel";
import { OverflowPanel } from "./layout/OverflowPanel";

interface LayoutSectionProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
  handleCopy: (text: string) => void;
  copiedText: string | null;
}

export function LayoutSection({ selectedElement, updateTree, handleCopy, copiedText }: LayoutSectionProps) {
  const [expandedLayoutSections, setExpandedLayoutSections] = useState<Record<string, boolean>>({
    display: true,
    flex: true,
    grid: true,
    overflow: true,
  });

  const toggleLayoutSection = (section: string) => {
    setExpandedLayoutSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const displayVal = getActiveGroupClass(selectedElement.classes || "", "display") || "";
  const isFlexContext = displayVal === "flex" || displayVal === "inline-flex";
  const isGridContext = displayVal === "grid" || displayVal === "inline-grid";

  const sectionHeader = (
    id: string,
    label: string,
    icon: any,
    badge?: string,
  ) => {
    const isExpanded = expandedLayoutSections[id];
    const IconComponent = icon;
    return (
      <button
        type="button"
        onClick={() => toggleLayoutSection(id)}
        className="w-full flex items-center justify-between pb-1 text-left cursor-pointer select-none font-sans"
      >
        <div className="flex items-center gap-2">
          <div className="text-[10px] uppercase font-bold tracking-wider text-rose-700 font-mono flex items-center gap-1.5">
            <IconComponent size={11} className="text-rose-600" />
            <span>{label}</span>
          </div>
          {badge && (
            <span className="text-[8px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider font-mono select-none animate-pulse">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={14}
          className={`text-stone-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-3 duration-350">
      <div className="flex items-center gap-2 mb-1">
        <Maximize size={15} className="text-rose-600" />
        <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">
          Layout Settings
        </span>
      </div>

      <div className="space-y-4">
        {/* --- 1. DISPLAY MODE --- */}
        <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm select-none">
          {sectionHeader("display", "Display Mode", Sliders)}
          {expandedLayoutSections.display && (
            <DisplayPanel selectedElement={selectedElement} updateTree={updateTree} />
          )}
        </div>

        {/* --- 2. FLEXBOX CONTAINER SUB-CATEGORY --- */}
        <div
          className={`border rounded-2xl p-3.5 space-y-1 transition-all duration-300 shadow-sm ${
            isFlexContext
              ? "bg-stone-50/50 border-stone-200/50"
              : "bg-stone-100/30 border-stone-200/30 opacity-75"
          }`}
        >
          {sectionHeader(
            "flex",
            "Flexbox Container",
            Cpu,
            !isFlexContext
              ? "⚠️ Inactive (Display is not Flex)"
              : undefined,
          )}
          {expandedLayoutSections.flex && (
            <FlexboxPanel selectedElement={selectedElement} updateTree={updateTree} />
          )}
        </div>

        {/* --- 3. GRID CONTAINER SUB-CATEGORY --- */}
        <div
          className={`border rounded-2xl p-3.5 space-y-1 transition-all duration-300 shadow-sm ${
            isGridContext
              ? "bg-stone-50/50 border-stone-200/50"
              : "bg-stone-100/30 border-stone-200/30 opacity-75"
          }`}
        >
          {sectionHeader(
            "grid",
            "Grid Container",
            Grid,
            !isGridContext
              ? "⚠️ Inactive (Display is not Grid)"
              : undefined,
          )}
          {expandedLayoutSections.grid && (
            <GridPanel selectedElement={selectedElement} updateTree={updateTree} />
          )}
        </div>

        {/* --- 4. OVERFLOW & SCROLL Sub-Category --- */}
        <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm select-none">
          {sectionHeader("overflow", "Overflow & Scroll Info", Compass)}
          {expandedLayoutSections.overflow && (
            <OverflowPanel selectedElement={selectedElement} updateTree={updateTree} />
          )}
        </div>
      </div>
    </div>
  );
}
