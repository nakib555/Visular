import React from "react";
import { ChevronDown, Sliders } from "lucide-react";
import { VisualElement } from "../../../types";
import {
  fontSizeMap,
  getPropValue,
  setPropValue,
  parseArbitraryProperty,
  updateArbitraryProperty,
} from "./constants";

interface PanelProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
}

export function SizingPanel({ selectedElement, updateTree }: PanelProps) {
  const _getPropValue = (propName: string, map?: any) => getPropValue(selectedElement, propName, map);
  const _setPropValue = (propName: string, val: string, map?: any) => setPropValue(selectedElement, updateTree, propName, val, map);
  const _parseArbitraryProperty = (propName: string) => parseArbitraryProperty(selectedElement.classes || "", propName);
  const _updateArbitraryProperty = (propName: string, val: string) => updateArbitraryProperty(selectedElement, updateTree, propName, val);

  return (
    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
        <Sliders size={12} />
        <span>Text Sizing & Scalability</span>
      </div>

      {/* font-size */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          font-size
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_getPropValue("font-size", fontSizeMap)}
              onChange={(e) => _setPropValue("font-size", e.target.value, fontSizeMap)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default</option>
              <option value="xx-small">xx-small (12px equiv)</option>
              <option value="x-small">x-small (14px equiv)</option>
              <option value="medium">medium (16px equiv)</option>
              <option value="large">large (18px equiv)</option>
              <option value="x-large">x-large (20px equiv)</option>
              <option value="xx-large">xx-large (24px equiv)</option>
              <option value="xxx-large">xxx-large</option>
              <option value="smaller">smaller</option>
              <option value="larger">larger</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="e.g. 1.5rem, 5vw, 16px"
            value={_parseArbitraryProperty("font-size")}
            onChange={(e) => _updateArbitraryProperty("font-size", e.target.value)}
            className="w-1/2 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white placeholder-stone-400 font-mono"
          />
        </div>
      </div>

      {/* font-size-adjust */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          font-size-adjust
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_parseArbitraryProperty("font-size-adjust")}
              onChange={(e) => _updateArbitraryProperty("font-size-adjust", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default (none)</option>
              <option value="none">none</option>
              <option value="ex-height">ex-height</option>
              <option value="cap-height">cap-height</option>
              <option value="ch-width">ch-width</option>
              <option value="from-font">from-font</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="e.g. 0.5"
            value={_parseArbitraryProperty("font-size-adjust")}
            onChange={(e) => _updateArbitraryProperty("font-size-adjust", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>

      {/* font-stretch */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          font-stretch
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_parseArbitraryProperty("font-stretch")}
              onChange={(e) => _updateArbitraryProperty("font-stretch", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default</option>
              <option value="normal">normal</option>
              <option value="ultra-condensed">ultra-condensed</option>
              <option value="extra-condensed">extra-condensed</option>
              <option value="condensed">condensed</option>
              <option value="semi-condensed">semi-condensed</option>
              <option value="semi-expanded">semi-expanded</option>
              <option value="expanded">expanded</option>
              <option value="extra-expanded">extra-expanded</option>
              <option value="ultra-expanded">ultra-expanded</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="e.g. 110%"
            value={_parseArbitraryProperty("font-stretch")}
            onChange={(e) => _updateArbitraryProperty("font-stretch", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>
    </div>
  );
}
