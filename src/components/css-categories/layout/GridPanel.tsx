import React from "react";
import { ChevronDown, Grid } from "lucide-react";
import { VisualElement } from "../../../types";
import {
  setGroupClass,
  getActiveGroupClass,
  setPrefixedClass,
  getPrefixedClass,
} from "../../../styleUtils";
import { parseArbitraryValue, updateArbitraryClass } from "./constants";

interface PanelProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
}

export function GridPanel({ selectedElement, updateTree }: PanelProps) {
  const displayVal = getActiveGroupClass(selectedElement.classes || "", "display") || "";
  const isGridContext = displayVal === "grid" || displayVal === "inline-grid";

  const _parseArbitraryValue = (prefix: string) => parseArbitraryValue(selectedElement.classes, prefix);
  const _updateArbitraryClass = (prefix: string, val: string) => updateArbitraryClass(selectedElement, updateTree, prefix, val);

  return (
    <div className="space-y-4 pt-1 animate-in fade-in duration-200">
      {!isGridContext ? (
        <div className="bg-rose-50/30 border border-rose-100 rounded-xl p-3.5 text-center space-y-2">
          <div className="text-rose-700 font-bold text-[11px] font-sans">
            Convert Layout to Grid
          </div>
          <p className="text-[10px] text-rose-600 leading-normal font-medium max-w-[210px] mx-auto">
            To edit template columns, spans, rows, gaps, and placement properties,
            change layout display type to grid.
          </p>
          <button
            type="button"
            onClick={() =>
              updateTree((C) => ({
                classes: setGroupClass(C.classes, "display", "grid"),
              }))
            }
            className="w-full h-8 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5 mr-auto ml-auto"
          >
            <Grid size={11} /> Convert to Grid
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono">
              grid-template-columns
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <select
                  value={getPrefixedClass(selectedElement.classes || "", "grid-cols-") || ""}
                  onChange={(e) =>
                    updateTree((n) => ({
                      classes: setPrefixedClass(n.classes, "grid-cols-", e.target.value),
                    }))
                  }
                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                >
                  <option value="">default / custom</option>
                  <option value="grid-cols-1">1 Col</option>
                  <option value="grid-cols-2">2 Cols</option>
                  <option value="grid-cols-3">3 Cols</option>
                  <option value="grid-cols-4">4 Cols</option>
                  <option value="grid-cols-6">6 Cols</option>
                  <option value="grid-cols-12">12 Cols (Standard)</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />
              </div>
              <input
                type="text"
                placeholder="custom e.g. 1fr 2fr"
                value={_parseArbitraryValue("grid-cols-")}
                onChange={(e) => _updateArbitraryClass("grid-cols-", e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono">
              grid-template-rows
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <select
                  value={getPrefixedClass(selectedElement.classes || "", "grid-rows-") || ""}
                  onChange={(e) =>
                    updateTree((n) => ({
                      classes: setPrefixedClass(n.classes, "grid-rows-", e.target.value),
                    }))
                  }
                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                >
                  <option value="">default / custom</option>
                  <option value="grid-rows-1">1 Row</option>
                  <option value="grid-rows-2">2 Rows</option>
                  <option value="grid-rows-3">3 Rows</option>
                  <option value="grid-rows-4">4 Rows</option>
                  <option value="grid-rows-6">6 Rows</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />
              </div>
              <input
                type="text"
                placeholder="custom e.g. 100px auto"
                value={_parseArbitraryValue("grid-rows-")}
                onChange={(e) => _updateArbitraryClass("grid-rows-", e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono">
              justify-items
            </label>
            <div className="relative">
              <select
                value={getActiveGroupClass(selectedElement.classes || "", "justifyItems") || ""}
                onChange={(e) =>
                  updateTree((n) => ({
                    classes: setGroupClass(n.classes, "justifyItems", e.target.value),
                  }))
                }
                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
              >
                <option value="">normal / stretch (default)</option>
                <option value="justify-items-normal">normal</option>
                <option value="justify-items-stretch">stretch</option>
                <option value="justify-items-center">center</option>
                <option value="justify-items-start">start</option>
                <option value="justify-items-end">end</option>
                <option value="justify-items-left">left</option>
                <option value="justify-items-right">right</option>
                <option value="justify-items-legacy">legacy</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono">
              align-items
            </label>
            <div className="relative">
              <select
                value={getActiveGroupClass(selectedElement.classes || "", "alignment") || ""}
                onChange={(e) =>
                  updateTree((n) => ({
                    classes: setGroupClass(n.classes, "alignment", e.target.value),
                  }))
                }
                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
              >
                <option value="">normal / stretch (default)</option>
                <option value="items-normal">normal</option>
                <option value="items-stretch">stretch</option>
                <option value="items-center">center</option>
                <option value="items-start">start</option>
                <option value="items-end">end</option>
                <option value="items-baseline">baseline</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono font-bold">
                item gap
              </label>
              <span className="text-[8px] text-rose-700 bg-rose-50 px-1 py-0.5 rounded font-bold uppercase tracking-wide">
                Dual-Nature
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <select
                  value={getActiveGroupClass(selectedElement.classes || "", "gap") || ""}
                  onChange={(e) =>
                    updateTree((n) => ({
                      classes: setGroupClass(n.classes, "gap", e.target.value),
                    }))
                  }
                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
                >
                  <option value="">default / custom option</option>
                  <option value="gap-0">0px</option>
                  <option value="gap-1">4px</option>
                  <option value="gap-2">8px</option>
                  <option value="gap-3">12px</option>
                  <option value="gap-4">16px</option>
                  <option value="gap-6">24px</option>
                  <option value="gap-8">32px</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />
              </div>
              <input
                type="text"
                placeholder="custom e.g. 1.25rem"
                value={_parseArbitraryValue("gap-")}
                onChange={(e) => _updateArbitraryClass("gap-", e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
              />
            </div>
            <p className="text-[9px] text-rose-700 leading-snug bg-rose-50/40 p-2 rounded-xl border border-rose-100/30 font-sans font-medium">
              💡 <strong>Grid Gap Dual-Nature:</strong> Spacing applies column-wise and row-wise across cellular layouts seamlessly.
            </p>
          </div>
        </div>
      )}

      {/* Grid items header */}
      <div className="border-t border-stone-200/40 pt-4.5 space-y-4 font-sans select-none">
        <div className="text-[10px] uppercase font-bold tracking-wider text-stone-500 font-mono flex items-center gap-1.5">
          <Grid size={11} className="text-rose-600" />
          <span>Grid Items (Child placement)</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono">
            grid-column (spanning)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <select
                value={getPrefixedClass(selectedElement.classes || "", "col-span-") || ""}
                onChange={(e) =>
                  updateTree((n) => ({
                    classes: setPrefixedClass(n.classes, "col-span-", e.target.value),
                  }))
                }
                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
              >
                <option value="">default / custom span</option>
                <option value="col-span-1">col-span-1</option>
                <option value="col-span-2">col-span-2</option>
                <option value="col-span-3">col-span-3</option>
                <option value="col-span-4">col-span-4</option>
                <option value="col-span-6">col-span-6</option>
                <option value="col-span-full">col-span-full (all cols)</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>
            <input
              type="text"
              placeholder="custom span / start e.g. 1 / 3"
              value={_parseArbitraryValue("col-")}
              onChange={(e) => _updateArbitraryClass("col-", e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 font-mono">
          <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-sans font-bold">
            grid-row (spanning)
          </label>
          <div className="grid grid-cols-2 gap-2 font-sans font-mono font-sans">
            <div className="relative">
              <select
                value={getPrefixedClass(selectedElement.classes || "", "row-span-") || ""}
                onChange={(e) =>
                  updateTree((n) => ({
                    classes: setPrefixedClass(n.classes, "row-span-", e.target.value),
                  }))
                }
                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
              >
                <option value="">default / custom span</option>
                <option value="row-span-1">row-span-1</option>
                <option value="row-span-2">row-span-2</option>
                <option value="row-span-3">row-span-3</option>
                <option value="row-span-full">row-span-full</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>
            <input
              type="text"
              placeholder="custom row e.g. span 2"
              value={_parseArbitraryValue("row-")}
              onChange={(e) => _updateArbitraryClass("row-", e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono">
              justify-self
            </label>
            <div className="relative">
              <select
                value={getActiveGroupClass(selectedElement.classes || "", "justifySelf") || ""}
                onChange={(e) =>
                  updateTree((n) => ({
                    classes: setGroupClass(n.classes, "justifySelf", e.target.value),
                  }))
                }
                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
              >
                <option value="">auto</option>
                <option value="justify-self-auto">auto</option>
                <option value="justify-self-normal">normal</option>
                <option value="justify-self-stretch">stretch</option>
                <option value="justify-self-start">start</option>
                <option value="justify-self-end">end</option>
                <option value="justify-self-center">center</option>
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 font-mono">
            <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-sans font-bold">
              align-self
            </label>
            <div className="relative font-sans">
              <select
                value={getActiveGroupClass(selectedElement.classes || "", "alignSelf") || ""}
                onChange={(e) =>
                  updateTree((n) => ({
                    classes: setGroupClass(n.classes, "alignSelf", e.target.value),
                  }))
                }
                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
              >
                <option value="">auto</option>
                <option value="self-auto">auto</option>
                <option value="self-start">start</option>
                <option value="self-end">end</option>
                <option value="self-center">center</option>
                <option value="self-stretch">stretch</option>
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono">
            grid-area
          </label>
          <input
            type="text"
            placeholder="e.g. header, main, sidebar"
            value={(() => {
              const C = (selectedElement.classes || "").split(/\s+/).find((k) => k.startsWith("[grid-area:") && k.endsWith("]"));
              return C ? C.substring(11, C.length - 1) : "";
            })()}
            onChange={(e) => {
              const k = e.target.value.trim();
              let R = (selectedElement.classes || "").split(/\s+/).filter(Boolean).filter((Q) => !Q.startsWith("[grid-area:"));
              if (k) R.push(`[grid-area:${k}]`);
              updateTree((Q) => ({ classes: R.join(" ") }));
            }}
            className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 shadow-xs focus:outline-none placeholder-stone-400 focus:border-rose-400 font-medium"
          />
        </div>
      </div>
    </div>
  );
}
