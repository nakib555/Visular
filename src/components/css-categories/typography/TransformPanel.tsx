import React from "react";
import { ChevronDown, RefreshCw } from "lucide-react";
import { VisualElement } from "../../../types";
import {
  textTransformMap,
  getPropValue,
  setPropValue,
  parseArbitraryProperty,
  updateArbitraryProperty,
} from "./constants";

interface PanelProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
}

export function TransformPanel({ selectedElement, updateTree }: PanelProps) {
  const _getPropValue = (propName: string, map?: any) => getPropValue(selectedElement, propName, map);
  const _setPropValue = (propName: string, val: string, map?: any) => setPropValue(selectedElement, updateTree, propName, val, map);
  const _parseArbitraryProperty = (propName: string) => parseArbitraryProperty(selectedElement.classes || "", propName);
  const _updateArbitraryProperty = (propName: string, val: string) => updateArbitraryProperty(selectedElement, updateTree, propName, val);

  return (
    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
        <RefreshCw size={12} />
        <span>Text Transform & Case Control</span>
      </div>

      {/* text-transform */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          text-transform
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_getPropValue("text-transform", textTransformMap)}
              onChange={(e) => _setPropValue("text-transform", e.target.value, textTransformMap)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default (none)</option>
              <option value="capitalize">capitalize</option>
              <option value="uppercase">uppercase</option>
              <option value="lowercase">lowercase</option>
              <option value="full-width">full-width</option>
              <option value="full-size-kana">full-size-kana</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="custom transform"
            value={_parseArbitraryProperty("text-transform")}
            onChange={(e) => _updateArbitraryProperty("text-transform", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>

      {/* font-variant-caps */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          font-variant-caps
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_parseArbitraryProperty("font-variant-caps")}
              onChange={(e) => _updateArbitraryProperty("font-variant-caps", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default (normal)</option>
              <option value="normal">normal</option>
              <option value="small-caps">small-caps</option>
              <option value="all-small-caps">all-small-caps</option>
              <option value="petite-caps">petite-caps</option>
              <option value="all-petite-caps">all-petite-caps</option>
              <option value="unicase">unicase</option>
              <option value="titling-caps">titling-caps</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="custom variant"
            value={_parseArbitraryProperty("font-variant-caps")}
            onChange={(e) => _updateArbitraryProperty("font-variant-caps", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>
    </div>
  );
}
