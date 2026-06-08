import React from "react";
import { ChevronDown, WrapText } from "lucide-react";
import { VisualElement } from "../../../types";
import {
  getPropValue,
  setPropValue,
  parseArbitraryProperty,
  updateArbitraryProperty,
} from "./constants";

interface PanelProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
}

export function WrappingPanel({ selectedElement, updateTree }: PanelProps) {
  const _parseArbitraryProperty = (propName: string) => parseArbitraryProperty(selectedElement.classes || "", propName);
  const _updateArbitraryProperty = (propName: string, val: string) => updateArbitraryProperty(selectedElement, updateTree, propName, val);

  return (
    <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm animate-in fade-in duration-200">
      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
        <WrapText size={12} />
        <span>Wrapping, Breaking & Clamping</span>
      </div>

      {/* white-space */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          white-space
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_parseArbitraryProperty("white-space")}
              onChange={(e) => _updateArbitraryProperty("white-space", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default (normal)</option>
              <option value="normal">normal</option>
              <option value="pre">pre</option>
              <option value="nowrap">nowrap</option>
              <option value="pre-wrap">pre-wrap</option>
              <option value="pre-line">pre-line</option>
              <option value="break-spaces">break-spaces</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="custom white-space"
            value={_parseArbitraryProperty("white-space")}
            onChange={(e) => _updateArbitraryProperty("white-space", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>

      {/* text-wrap */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          text-wrap
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_parseArbitraryProperty("text-wrap")}
              onChange={(e) => _updateArbitraryProperty("text-wrap", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default (wrap)</option>
              <option value="wrap">wrap</option>
              <option value="balance">balance (header layout)</option>
              <option value="pretty">pretty (avoid orphans)</option>
              <option value="stable">stable</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="custom text-wrap"
            value={_parseArbitraryProperty("text-wrap")}
            onChange={(e) => _updateArbitraryProperty("text-wrap", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>

      {/* word-break */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          word-break
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_parseArbitraryProperty("word-break")}
              onChange={(e) => _updateArbitraryProperty("word-break", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default</option>
              <option value="break-all">break-all</option>
              <option value="keep-all">keep-all</option>
              <option value="break-word">break-word</option>
              <option value="anywhere">anywhere</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder="custom word-break"
            value={_parseArbitraryProperty("word-break")}
            onChange={(e) => _updateArbitraryProperty("word-break", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>

      {/* text-overflow */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
          text-overflow
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={_parseArbitraryProperty("text-overflow")}
              onChange={(e) => _updateArbitraryProperty("text-overflow", e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
            >
              <option value="">Default (clip)</option>
              <option value="clip">clip</option>
              <option value="ellipsis">ellipsis (...)</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <input
            type="text"
            placeholder='e.g. "..."'
            value={_parseArbitraryProperty("text-overflow")}
            onChange={(e) => _updateArbitraryProperty("text-overflow", e.target.value)}
            className="w-1/3 bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
          />
        </div>
      </div>
    </div>
  );
}
