import React from "react";
import { ChevronDown, AlignLeft } from "lucide-react";
import { VisualElement } from "../../../types";
import { SegmentedControl } from "../../InspectorPanel";
import {
  textAlignMap,
  lineHeightMap,
  letterSpacingMap,
  getPropValue,
  setPropValue,
  parseArbitraryProperty,
  updateArbitraryProperty,
} from "./constants";

interface PanelProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
}

export function SpacingPanel({ selectedElement, updateTree }: PanelProps) {
  const _getPropValue = (propName: string, map?: any) => getPropValue(selectedElement, propName, map);
  const _setPropValue = (propName: string, val: string, map?: any) => setPropValue(selectedElement, updateTree, propName, val, map);
  const _parseArbitraryProperty = (propName: string) => parseArbitraryProperty(selectedElement.classes || "", propName);
  const _updateArbitraryProperty = (propName: string, val: string) => updateArbitraryProperty(selectedElement, updateTree, propName, val);

  return (
    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
        <AlignLeft size={12} />
        <span>Alignment, Justification & Spacing</span>
      </div>

      {/* text-align */}
      <div className="space-y-2">
        <SegmentedControl
          label="text-align"
          value={_getPropValue("text-align", textAlignMap) || "left"}
          onChange={(val) => _setPropValue("text-align", val, textAlignMap)}
          options={[
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
            { value: "justify", label: "Justify" },
          ]}
        />
      </div>

      {/* text-align-last */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          text-align-last
        </label>
        <div className="relative">
          <select
            value={_parseArbitraryProperty("text-align-last")}
            onChange={(e) => _updateArbitraryProperty("text-align-last", e.target.value)}
            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
          >
            <option value="">Default (auto)</option>
            <option value="auto">auto</option>
            <option value="start">start</option>
            <option value="end">end</option>
            <option value="left">left</option>
            <option value="right">right</option>
            <option value="center">center</option>
            <option value="justify">justify</option>
          </select>
          <ChevronDown
            size={12}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
          />
        </div>
      </div>

      {/* text-justify */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          text-justify
        </label>
        <div className="relative">
          <select
            value={_parseArbitraryProperty("text-justify")}
            onChange={(e) => _updateArbitraryProperty("text-justify", e.target.value)}
            className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
          >
            <option value="">Default</option>
            <option value="none">none</option>
            <option value="inter-word">inter-word</option>
            <option value="inter-character">inter-character</option>
            <option value="distribute">distribute</option>
          </select>
          <ChevronDown
            size={12}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
          />
        </div>
      </div>

      {/* line-height */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          line-height (leading)
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_getPropValue("line-height", lineHeightMap)}
              onChange={(e) => _setPropValue("line-height", e.target.value, lineHeightMap)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default</option>
              <option value="1">1 (none equiv)</option>
              <option value="1.25">1.25 (tight)</option>
              <option value="1.375">1.375 (snug)</option>
              <option value="1.5">1.5 (normal)</option>
              <option value="1.625">1.625 (relaxed)</option>
              <option value="2">2 (loose)</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="e.g. 1.8, 24px"
            value={_parseArbitraryProperty("line-height")}
            onChange={(e) => _updateArbitraryProperty("line-height", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>

      {/* letter-spacing */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          letter-spacing (tracking)
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_getPropValue("letter-spacing", letterSpacingMap)}
              onChange={(e) => _setPropValue("letter-spacing", e.target.value, letterSpacingMap)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default</option>
              <option value="-0.05em">Tighter (-0.05em)</option>
              <option value="-0.025em">Tight (-0.025em)</option>
              <option value="0em">Normal (0em)</option>
              <option value="0.025em">Wide (0.025em)</option>
              <option value="0.05em">Wider (0.05em)</option>
              <option value="0.1em">Widest (0.1em)</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="e.g. 2px, 0.15em"
            value={_parseArbitraryProperty("letter-spacing")}
            onChange={(e) => _updateArbitraryProperty("letter-spacing", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>

      {/* word-spacing */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          word-spacing
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_parseArbitraryProperty("word-spacing")}
              onChange={(e) => _updateArbitraryProperty("word-spacing", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default</option>
              <option value="normal">normal</option>
              <option value="0.1em">0.1em</option>
              <option value="0.2em">0.2em</option>
              <option value="0.3em">0.3em</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="e.g. 5px, 0.5em"
            value={_parseArbitraryProperty("word-spacing")}
            onChange={(e) => _updateArbitraryProperty("word-spacing", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>
    </div>
  );
}
