import React from "react";
import { ChevronDown, Sliders, Cpu, Layout } from "lucide-react";
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

export function FlexboxPanel({ selectedElement, updateTree }: PanelProps) {
  const displayVal = getActiveGroupClass(selectedElement.classes || "", "display") || "";
  const isFlexContext = displayVal === "flex" || displayVal === "inline-flex";

  const _parseArbitraryValue = (prefix: string) => parseArbitraryValue(selectedElement.classes, prefix);
  const _updateArbitraryClass = (prefix: string, val: string) => updateArbitraryClass(selectedElement, updateTree, prefix, val);

  return (
    <div className="space-y-4 pt-1 animate-in fade-in duration-200">
      {!isFlexContext ? (
        <div className="bg-rose-50/30 border border-rose-100 rounded-xl p-3.5 text-center space-y-2">
          <div className="text-rose-700 font-bold text-[11px] font-sans">
            Convert Layout to Flexbox
          </div>
          <p className="text-[10px] text-rose-600 leading-normal font-medium max-w-[210px] mx-auto">
            To edit direction, align, wrap, and gap features,
            change layout display type to flex.
          </p>
          <button
            type="button"
            onClick={() =>
              updateTree((C) => ({
                classes: setGroupClass(C.classes, "display", "flex"),
              }))
            }
            className="w-full h-8 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5 mr-auto ml-auto"
          >
            <Cpu size={12} /> Convert to Flex
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-mono">
              flex-direction
            </label>
            <div className="relative">
              <select
                value={getActiveGroupClass(selectedElement.classes || "", "flexDirection") || ""}
                onChange={(e) =>
                  updateTree((n) => ({
                    classes: setGroupClass(n.classes, "flexDirection", e.target.value),
                  }))
                }
                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
              >
                <option value="">row (default)</option>
                <option value="flex-row">row (horizontal left-to-right)</option>
                <option value="flex-row-reverse">row-reverse (horizontal right-to-left)</option>
                <option value="flex-col">column (vertical top-to-bottom)</option>
                <option value="flex-col-reverse">column-reverse (vertical bottom-to-top)</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-mono">
              justify-content
            </label>
            <div className="relative">
              <select
                value={getActiveGroupClass(selectedElement.classes || "", "justify") || ""}
                onChange={(e) =>
                  updateTree((n) => ({
                    classes: setGroupClass(n.classes, "justify", e.target.value),
                  }))
                }
                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
              >
                <option value="">normal (default)</option>
                <option value="justify-normal">normal</option>
                <option value="justify-start">flex-start / start</option>
                <option value="justify-end">flex-end / end</option>
                <option value="justify-center">center</option>
                <option value="justify-between">space-between</option>
                <option value="justify-around">space-around</option>
                <option value="justify-evenly">space-evenly</option>
                <option value="justify-stretch">stretch</option>
                <option value="justify-items-left">left</option>
                <option value="justify-items-right">right</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-mono">
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
                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
              >
                <option value="">normal / stretch (default)</option>
                <option value="items-normal">normal</option>
                <option value="items-stretch">stretch</option>
                <option value="items-start">flex-start / start</option>
                <option value="items-end">flex-end / end</option>
                <option value="items-center">center</option>
                <option value="items-baseline">baseline</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-mono">
              flex-wrap
            </label>
            <div className="relative">
              <select
                value={getActiveGroupClass(selectedElement.classes || "", "flexWrap") || ""}
                onChange={(e) =>
                  updateTree((n) => ({
                    classes: setGroupClass(n.classes, "flexWrap", e.target.value),
                  }))
                }
                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
              >
                <option value="">nowrap (default)</option>
                <option value="flex-nowrap">nowrap</option>
                <option value="flex-wrap">wrap</option>
                <option value="flex-wrap-reverse">wrap-reverse</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-mono font-bold">
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
                placeholder="custom e.g. 15px"
                value={_parseArbitraryValue("gap-")}
                onChange={(e) => _updateArbitraryClass("gap-", e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400"
              />
            </div>
            <p className="text-[9px] text-rose-700 leading-snug bg-rose-50/40 p-2 rounded-xl border border-rose-100/30 font-sans font-medium">
              💡 <strong>Gap Dual-Nature:</strong> Spacing applies column-wise in standard horizontal rows, and row-wise in vertical columns (<code>flex-col</code>) automatically.
            </p>
          </div>
        </div>
      )}

      {/* Item overrides header */}
      <div className="border-t border-stone-200/40 pt-4.5 space-y-4 font-sans select-none">
        <div className="text-[10px] uppercase font-bold tracking-wider text-stone-500 font-mono flex items-center gap-1.5">
          <Layout size={11} className="text-rose-600" />
          <span>Flexbox Items (Child overrides)</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono">
            flex-grow
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <select
                value={getActiveGroupClass(selectedElement.classes || "", "flexGrow") || ""}
                onChange={(e) =>
                  updateTree((n) => ({
                    classes: setGroupClass(n.classes, "flexGrow", e.target.value),
                  }))
                }
                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
              >
                <option value="">default (0)</option>
                <option value="grow-0">0 (grow-0)</option>
                <option value="grow">1 (grow)</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>
            <input
              type="text"
              placeholder="custom e.g. 2.5"
              value={_parseArbitraryValue("grow-")}
              onChange={(e) => _updateArbitraryClass("grow-", e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono">
            flex-shrink
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <select
                value={getActiveGroupClass(selectedElement.classes || "", "flexShrink") || ""}
                onChange={(e) =>
                  updateTree((n) => ({
                    classes: setGroupClass(n.classes, "flexShrink", e.target.value),
                  }))
                }
                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
              >
                <option value="">default (1)</option>
                <option value="shrink">1 (shrink)</option>
                <option value="shrink-0">0 (shrink-0)</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>
            <input
              type="text"
              placeholder="custom e.g. 3"
              value={_parseArbitraryValue("shrink-")}
              onChange={(e) => _updateArbitraryClass("shrink-", e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono">
            flex-basis
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <select
                value={getPrefixedClass(selectedElement.classes || "", "basis-") || ""}
                onChange={(e) =>
                  updateTree((n) => ({
                    classes: setPrefixedClass(n.classes, "basis-", e.target.value),
                  }))
                }
                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
              >
                <option value="">default / custom</option>
                <option value="basis-auto">auto</option>
                <option value="basis-full">100% (full)</option>
                <option value="basis-1/2">50% (half)</option>
                <option value="basis-1/3">33.33% (third)</option>
                <option value="basis-1/4">25% (quarter)</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>
            <input
              type="text"
              placeholder="e.g. 200px, 15rem"
              value={_parseArbitraryValue("basis-")}
              onChange={(e) => _updateArbitraryClass("basis-", e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono">
              align-self
            </label>
            <span className="text-[8px] text-rose-700 bg-rose-50 px-1 py-0.5 rounded font-bold uppercase tracking-wide">
              Override
            </span>
          </div>
          <div className="relative font-sans">
            <select
              value={getActiveGroupClass(selectedElement.classes || "", "alignSelf") || ""}
              onChange={(e) =>
                updateTree((n) => ({
                  classes: setGroupClass(n.classes, "alignSelf", e.target.value),
                }))
              }
              className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
            >
              <option value="">auto (inherits container items-align)</option>
              <option value="self-auto">auto</option>
              <option value="self-normal">normal</option>
              <option value="self-stretch">stretch</option>
              <option value="self-start">flex-start / start</option>
              <option value="self-end">flex-end / end</option>
              <option value="self-center">center</option>
              <option value="self-baseline">baseline</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
          <p className="text-[9px] text-rose-800 leading-relaxed bg-rose-50/40 p-2.5 rounded-xl border border-rose-100/30 font-medium">
            👉 <strong>Alignment Override:</strong> Parent container's <code>align-items</code> sets the default vertical alignment for children; individual items can override it with <code>align-self</code> directly.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono font-bold">
            order
          </label>
          <div className="grid grid-cols-2 gap-2 font-sans font-mono font-sans">
            <div className="relative">
              <select
                value={getPrefixedClass(selectedElement.classes || "", "order-") || ""}
                onChange={(e) =>
                  updateTree((n) => ({
                    classes: setPrefixedClass(n.classes, "order-", e.target.value),
                  }))
                }
                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
              >
                <option value="">default / custom</option>
                <option value="order-first">first (order-first)</option>
                <option value="order-last">last (order-last)</option>
                <option value="order-1">order-1</option>
                <option value="order-2">order-2</option>
                <option value="order-3">order-3</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>
            <input
              type="text"
              placeholder="custom order integer"
              value={_parseArbitraryValue("order-")}
              onChange={(e) => _updateArbitraryClass("order-", e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
