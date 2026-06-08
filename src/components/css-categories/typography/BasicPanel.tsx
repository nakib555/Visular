import React from "react";
import { ChevronDown, Type } from "lucide-react";
import { VisualElement } from "../../../types";
import { SegmentedControl } from "../../InspectorPanel";
import {
  fontFamilyMap,
  fontWeightMap,
  fontStyleMap,
  getPropValue,
  setPropValue,
  parseArbitraryProperty,
  updateArbitraryProperty,
} from "./constants";

interface PanelProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
}

export function BasicPanel({ selectedElement, updateTree }: PanelProps) {
  const _getPropValue = (propName: string, map?: any) => getPropValue(selectedElement, propName, map);
  const _setPropValue = (propName: string, val: string, map?: any) => setPropValue(selectedElement, updateTree, propName, val, map);
  const _parseArbitraryProperty = (propName: string) => parseArbitraryProperty(selectedElement.classes || "", propName);
  const _updateArbitraryProperty = (propName: string, val: string) => updateArbitraryProperty(selectedElement, updateTree, propName, val);

  return (
    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
        <Type size={12} />
        <span>Font Selection & Basic Styling</span>
      </div>

      {/* font-family */}
      <div className="space-y-2">
        <SegmentedControl
          label="font-family"
          value={_getPropValue("font-family", fontFamilyMap) || "sans-serif"}
          onChange={(val) => _setPropValue("font-family", val, fontFamilyMap)}
          options={[
            { value: "sans-serif", label: "Sans" },
            { value: "serif", label: "Serif" },
            { value: "monospace", label: "Mono" },
          ]}
        />
        <div className="flex flex-col gap-1.5 w-full text-left">
          <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider pl-0.5 font-sans">
            Custom Font Override
          </span>
          <input
            type="text"
            placeholder='e.g. "Space Grotesk"'
            value={_parseArbitraryProperty("font-family")}
            onChange={(e) => _updateArbitraryProperty("font-family", e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none placeholder-stone-300 font-mono shadow-sm"
          />
        </div>
      </div>

      {/* font-weight */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          font-weight
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_getPropValue("font-weight", fontWeightMap)}
              onChange={(e) => _setPropValue("font-weight", e.target.value, fontWeightMap)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default</option>
              <option value="normal">normal</option>
              <option value="bold">bold</option>
              <option value="bolder">bolder</option>
              <option value="lighter">lighter</option>
              <option value="300">300 (Light)</option>
              <option value="400">400 (Regular)</option>
              <option value="500">500 (Medium)</option>
              <option value="600">600 (Semi-Bold)</option>
              <option value="700">700 (Bold)</option>
              <option value="900">900 (Black)</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="e.g. 550"
            value={_parseArbitraryProperty("font-weight")}
            onChange={(e) => _updateArbitraryProperty("font-weight", e.target.value)}
            className="w-1/4 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white placeholder-stone-400 font-mono"
          />
        </div>
      </div>

      {/* font-style */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          font-style
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_getPropValue("font-style", fontStyleMap)}
              onChange={(e) => _setPropValue("font-style", e.target.value, fontStyleMap)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default</option>
              <option value="normal">normal</option>
              <option value="italic">italic</option>
              <option value="oblique">oblique</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="e.g. oblique 12deg"
            value={_parseArbitraryProperty("font-style")}
            onChange={(e) => _updateArbitraryProperty("font-style", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white placeholder-stone-400 font-mono"
          />
        </div>
      </div>

      {/* font-synthesis */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          font-synthesis
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_parseArbitraryProperty("font-synthesis")}
              onChange={(e) => _updateArbitraryProperty("font-synthesis", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default</option>
              <option value="none">none</option>
              <option value="weight">weight</option>
              <option value="style">style</option>
              <option value="small-caps">small-caps</option>
              <option value="weight style">weight style</option>
              <option value="weight style small-caps">all active</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="custom string"
            value={_parseArbitraryProperty("font-synthesis")}
            onChange={(e) => _updateArbitraryProperty("font-synthesis", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>
    </div>
  );
}
