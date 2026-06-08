import React from "react";
import { ChevronDown, Binary } from "lucide-react";
import { VisualElement } from "../../../types";
import {
  parseArbitraryProperty,
  updateArbitraryProperty,
} from "./constants";

interface PanelProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
}

export function OpenTypePanel({ selectedElement, updateTree }: PanelProps) {
  const _parseArbitraryProperty = (propName: string) => parseArbitraryProperty(selectedElement.classes || "", propName);
  const _updateArbitraryProperty = (propName: string, val: string) => updateArbitraryProperty(selectedElement, updateTree, propName, val);

  return (
    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
        <Binary size={12} />
        <span>OpenType & Variable Font Control</span>
      </div>

      {/* font-variant-ligatures */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          font-variant-ligatures
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_parseArbitraryProperty("font-variant-ligatures")}
              onChange={(e) => _updateArbitraryProperty("font-variant-ligatures", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default (normal)</option>
              <option value="normal">normal</option>
              <option value="none">none</option>
              <option value="common-ligatures">common-ligatures</option>
              <option value="no-common-ligatures">no-common-ligatures</option>
              <option value="discretionary-ligatures">discretionary-ligatures</option>
              <option value="historical-ligatures">historical-ligatures</option>
              <option value="contextual">contextual</option>
              <option value="no-contextual">no-contextual</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="custom ligatures"
            value={_parseArbitraryProperty("font-variant-ligatures")}
            onChange={(e) => _updateArbitraryProperty("font-variant-ligatures", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>

      {/* font-variant-numeric */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          font-variant-numeric
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_parseArbitraryProperty("font-variant-numeric")}
              onChange={(e) => _updateArbitraryProperty("font-variant-numeric", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default (normal)</option>
              <option value="normal">normal</option>
              <option value="ordinal">ordinal</option>
              <option value="slashed-zero">slashed-zero</option>
              <option value="lining-nums">lining-nums</option>
              <option value="oldstyle-nums">oldstyle-nums</option>
              <option value="proportional-nums">proportional-nums</option>
              <option value="tabular-nums">tabular-nums</option>
              <option value="diagonal-fractions">diagonal-fractions</option>
              <option value="stacked-fractions">stacked-fractions</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="custom numeric"
            value={_parseArbitraryProperty("font-variant-numeric")}
            onChange={(e) => _updateArbitraryProperty("font-variant-numeric", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>

      {/* font-variant-east-asian */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          font-variant-east-asian
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_parseArbitraryProperty("font-variant-east-asian")}
              onChange={(e) => _updateArbitraryProperty("font-variant-east-asian", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default</option>
              <option value="normal">normal</option>
              <option value="jis78">jis78</option>
              <option value="jis83">jis83</option>
              <option value="jis90">jis90</option>
              <option value="jis04">jis04</option>
              <option value="simplified">simplified</option>
              <option value="traditional">traditional</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="custom eastern"
            value={_parseArbitraryProperty("font-variant-east-asian")}
            onChange={(e) => _updateArbitraryProperty("font-variant-east-asian", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>
    </div>
  );
}
