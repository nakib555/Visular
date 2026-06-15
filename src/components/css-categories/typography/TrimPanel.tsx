import React from "react";
import { ChevronDown, Scissors } from "lucide-react";
import { VisualElement } from "../../../types";
import {
  parseArbitraryProperty,
  updateArbitraryProperty,
} from "./constants";

interface PanelProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
}

export function TrimPanel({ selectedElement, updateTree }: PanelProps) {
  const _parseArbitraryProperty = (propName: string) => parseArbitraryProperty(selectedElement.classes || "", propName);
  const _updateArbitraryProperty = (propName: string, val: string) => updateArbitraryProperty(selectedElement, updateTree, propName, val);

  return (
    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
        <Scissors size={12} />
        <span>Text Box Trim & Metrics</span>
      </div>

      {/* text-box-trim */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          text-box-trim
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_parseArbitraryProperty("text-box-trim")}
              onChange={(e) => _updateArbitraryProperty("text-box-trim", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default (none)</option>
              <option value="none">none</option>
              <option value="trim-over">trim-over (top)</option>
              <option value="trim-under">trim-under (bottom)</option>
              <option value="trim-both">trim-both</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="custom trim"
            value={_parseArbitraryProperty("text-box-trim")}
            onChange={(e) => _updateArbitraryProperty("text-box-trim", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>

      {/* text-box-edge */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          text-box-edge
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_parseArbitraryProperty("text-box-edge")}
              onChange={(e) => _updateArbitraryProperty("text-box-edge", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default (auto)</option>
              <option value="auto">auto</option>
              <option value="text">text</option>
              <option value="cap">cap</option>
              <option value="ex">ex</option>
              <option value="ideographic">ideographic</option>
              <option value="ideographic-ink">ideographic-ink</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="custom edge"
            value={_parseArbitraryProperty("text-box-edge")}
            onChange={(e) => _updateArbitraryProperty("text-box-edge", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>
    </div>
  );
}
