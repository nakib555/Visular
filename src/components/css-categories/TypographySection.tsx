import React, { useState } from "react";
import { Type } from "lucide-react";
import { VisualElement } from "../../types";

// Import lightweight panels
import { BasicPanel } from "./typography/BasicPanel";
import { SizingPanel } from "./typography/SizingPanel";
import { SpacingPanel } from "./typography/SpacingPanel";
import { WrappingPanel } from "./typography/WrappingPanel";
import { TrimPanel } from "./typography/TrimPanel";
import { DecorationPanel } from "./typography/DecorationPanel";
import { EmphasisPanel } from "./typography/EmphasisPanel";
import { TransformPanel } from "./typography/TransformPanel";
import { OpenTypePanel } from "./typography/OpenTypePanel";
import { WritingModePanel } from "./typography/WritingModePanel";

interface TypographySectionProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
  handleCopy: (text: string) => void;
  copiedText: string | null;
}

export function TypographySection({ selectedElement, updateTree, handleCopy, copiedText }: TypographySectionProps) {
  const [typographySubCategory, setTypographySubCategory] = useState<string>("basic");

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-3 duration-350">
      <div className="flex items-center gap-2 mb-1">
        <Type size={15} className="text-rose-600" />
        <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">
          CSS Typography & Text Metrics
        </span>
      </div>

      <div className="space-y-4">
        {/* Visual Subcategory Pill Selector to easily skip to areas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide shrink-0 touch-pan-x">
          {[
            { id: "basic", label: "Basic Styles" },
            { id: "sizing", label: "Sizing" },
            { id: "spacing", label: "Alignment & Spacing" },
            { id: "wrapping", label: "Wrapping & Clamping" },
            { id: "trim", label: "Trim" },
            { id: "decoration", label: "Decorations" },
            { id: "emphasis", label: "Emphasis" },
            { id: "transform", label: "Transform" },
            { id: "fontControls", label: "OpenType" },
            { id: "direction", label: "Writing Mode" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTypographySubCategory(tab.id)}
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 transition-all cursor-pointer ${
                typographySubCategory === tab.id
                  ? "bg-stone-900 border-stone-900 text-white shadow-xs"
                  : "bg-white border-stone-200 text-stone-500 hover:text-stone-700 hover:bg-stone-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ==================== SUB-CATEGORY LISTS ==================== */}
        {typographySubCategory === "basic" && (
          <BasicPanel selectedElement={selectedElement} updateTree={updateTree} />
        )}
        {typographySubCategory === "sizing" && (
          <SizingPanel selectedElement={selectedElement} updateTree={updateTree} />
        )}
        {typographySubCategory === "spacing" && (
          <SpacingPanel selectedElement={selectedElement} updateTree={updateTree} />
        )}
        {typographySubCategory === "wrapping" && (
          <WrappingPanel selectedElement={selectedElement} updateTree={updateTree} />
        )}
        {typographySubCategory === "trim" && (
          <TrimPanel selectedElement={selectedElement} updateTree={updateTree} />
        )}
        {typographySubCategory === "decoration" && (
          <DecorationPanel selectedElement={selectedElement} updateTree={updateTree} />
        )}
        {typographySubCategory === "emphasis" && (
          <EmphasisPanel selectedElement={selectedElement} updateTree={updateTree} />
        )}
        {typographySubCategory === "transform" && (
          <TransformPanel selectedElement={selectedElement} updateTree={updateTree} />
        )}
        {typographySubCategory === "fontControls" && (
          <OpenTypePanel selectedElement={selectedElement} updateTree={updateTree} />
        )}
        {typographySubCategory === "direction" && (
          <WritingModePanel selectedElement={selectedElement} updateTree={updateTree} />
        )}
      </div>
    </div>
  );
}
