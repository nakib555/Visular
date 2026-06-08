import React from "react";
import { ChevronDown } from "lucide-react";
import { VisualElement } from "../../../types";
import { getActiveGroupClass, setGroupClass } from "../../../styleUtils";

interface PanelProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
}

export function DisplayPanel({ selectedElement, updateTree }: PanelProps) {
  const displayVal = getActiveGroupClass(selectedElement.classes || "", "display") || "";

  return (
    <div className="flex flex-col gap-2.5 animate-in fade-in duration-200">
      <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono">
        display type
      </label>
      <div className="relative">
        <select
          value={displayVal}
          onChange={(e) =>
            updateTree((n) => ({
              classes: setGroupClass(n.classes, "display", e.target.value),
            }))
          }
          className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 cursor-pointer font-medium"
        >
          <option value="">default / browser inherits</option>
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
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
        />
      </div>

      {/* Behavior Details Banner */}
      <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-100/55 text-[10px] leading-relaxed text-rose-900">
        <span className="font-bold uppercase tracking-wider text-rose-700 text-[9px] block font-mono">
          Layout Behavior context
        </span>
        <p className="mt-1">
          {displayVal === "block" &&
            "Behaves as a block container. Takes up full width and starts on a new line."}
          {displayVal === "inline-block" &&
            "Behaves as an inline-level box. Sizing is respectably editable."}
          {displayVal === "inline" &&
            "Element renders as inline, wrapping context without custom dimension frames."}
          {displayVal === "flex" &&
            "Prepares container horizontal or vertical child layouts using standard Flex mechanics."}
          {displayVal === "inline-flex" &&
            "Enables inline Flexbox container where outer layout is inline, inner contents flex."}
          {displayVal === "grid" &&
            "Renders children according to column and row structures under CSS Grid parameters."}
          {displayVal === "inline-grid" &&
            "Enables inline Grid container behavior for precise cell-based layouts."}
          {displayVal === "contents" &&
            "Container is visually ignored; its child components are layout-linked directly to its parent."}
          {displayVal === "hidden" &&
            "Element is fully removed from rendering and page layout flow."}
          {!displayVal &&
            "Inherits standard display properties."}
        </p>
      </div>
    </div>
  );
}
