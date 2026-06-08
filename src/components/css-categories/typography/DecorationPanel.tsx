import React from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { VisualElement } from "../../../types";
import {
  textDecorationLineMap,
  textDecorationStyleMap,
  getPropValue,
  setPropValue,
  parseArbitraryProperty,
  updateArbitraryProperty,
} from "./constants";

interface PanelProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
}

export function DecorationPanel({ selectedElement, updateTree }: PanelProps) {
  const _getPropValue = (propName: string, map?: any) => getPropValue(selectedElement, propName, map);
  const _setPropValue = (propName: string, val: string, map?: any) => setPropValue(selectedElement, updateTree, propName, val, map);
  const _parseArbitraryProperty = (propName: string) => parseArbitraryProperty(selectedElement.classes || "", propName);
  const _updateArbitraryProperty = (propName: string, val: string) => updateArbitraryProperty(selectedElement, updateTree, propName, val);

  return (
    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
        <Sparkles size={12} />
        <span>Text Decoration Systems</span>
      </div>

      {/* text-decoration-line */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          text-decoration-line
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_getPropValue("text-decoration-line", textDecorationLineMap)}
              onChange={(e) => _setPropValue("text-decoration-line", e.target.value, textDecorationLineMap)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default (none)</option>
              <option value="none">none</option>
              <option value="underline">underline</option>
              <option value="overline">overline</option>
              <option value="line-through">line-through</option>
              <option value="blink">blink</option>
              <option value="underline overline">underline overline</option>
              <option value="underline line-through">underline line-through</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="custom line"
            value={_parseArbitraryProperty("text-decoration-line")}
            onChange={(e) => _updateArbitraryProperty("text-decoration-line", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>

      {/* text-decoration-color */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          text-decoration-color
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_parseArbitraryProperty("text-decoration-color")}
              onChange={(e) => _updateArbitraryProperty("text-decoration-color", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default</option>
              <option value="currentColor">currentcolor</option>
              <option value="transparent">transparent</option>
              <option value="red">red</option>
              <option value="blue">blue</option>
              <option value="black">black</option>
              <option value="white">white</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="e.g. #ff0055"
            value={_parseArbitraryProperty("text-decoration-color")}
            onChange={(e) => _updateArbitraryProperty("text-decoration-color", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>

      {/* text-decoration-style */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          text-decoration-style
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_getPropValue("text-decoration-style", textDecorationStyleMap)}
              onChange={(e) => _setPropValue("text-decoration-style", e.target.value, textDecorationStyleMap)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default (solid)</option>
              <option value="solid">solid</option>
              <option value="double">double</option>
              <option value="dotted">dotted</option>
              <option value="dashed">dashed</option>
              <option value="wavy">wavy</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="custom style"
            value={_parseArbitraryProperty("text-decoration-style")}
            onChange={(e) => _updateArbitraryProperty("text-decoration-style", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>
    </div>
  );
}
