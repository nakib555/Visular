import React from "react";
import { ChevronDown, Highlighter } from "lucide-react";
import { VisualElement } from "../../../types";
import {
  parseArbitraryProperty,
  updateArbitraryProperty,
} from "./constants";

interface PanelProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
}

export function EmphasisPanel({ selectedElement, updateTree }: PanelProps) {
  const _parseArbitraryProperty = (propName: string) => parseArbitraryProperty(selectedElement.classes || "", propName);
  const _updateArbitraryProperty = (propName: string, val: string) => updateArbitraryProperty(selectedElement, updateTree, propName, val);

  return (
    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
        <Highlighter size={12} />
        <span>Text Emphasis & Effects</span>
      </div>

      {/* text-emphasis-style */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          text-emphasis-style
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_parseArbitraryProperty("text-emphasis-style")}
              onChange={(e) => _updateArbitraryProperty("text-emphasis-style", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default (none)</option>
              <option value="none">none</option>
              <option value="filled">filled</option>
              <option value="open">open</option>
              <option value="dot">dot</option>
              <option value="circle">circle</option>
              <option value="double-circle">double-circle</option>
              <option value="triangle">triangle</option>
              <option value="sesame">sesame</option>
              <option value="filled dot">filled dot</option>
              <option value="open circle">open circle</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="custom style"
            value={_parseArbitraryProperty("text-emphasis-style")}
            onChange={(e) => _updateArbitraryProperty("text-emphasis-style", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>

      {/* text-emphasis-color */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          text-emphasis-color
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_parseArbitraryProperty("text-emphasis-color")}
              onChange={(e) => _updateArbitraryProperty("text-emphasis-color", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default</option>
              <option value="currentColor">currentColor</option>
              <option value="transparent">transparent</option>
              <option value="red">red</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="e.g. #ffcc00"
            value={_parseArbitraryProperty("text-emphasis-color")}
            onChange={(e) => _updateArbitraryProperty("text-emphasis-color", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>

      {/* text-emphasis-position */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          text-emphasis-position
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_parseArbitraryProperty("text-emphasis-position")}
              onChange={(e) => _updateArbitraryProperty("text-emphasis-position", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default</option>
              <option value="over">over</option>
              <option value="under">under</option>
              <option value="over right">over right</option>
              <option value="over left">over left</option>
              <option value="under right">under right</option>
              <option value="under left">under left</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="custom pos"
            value={_parseArbitraryProperty("text-emphasis-position")}
            onChange={(e) => _updateArbitraryProperty("text-emphasis-position", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>
    </div>
  );
}
