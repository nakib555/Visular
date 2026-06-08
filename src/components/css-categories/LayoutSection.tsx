import React, { useState } from "react";
import { Settings, Maximize, ChevronDown, Sliders, Cpu, Grid, Compass, Layout } from "lucide-react";
import { VisualElement } from "../../types";
import { getActiveGroupClass, setGroupClass, setPrefixedClass, getPrefixedClass } from "../../styleUtils";

// Arbitrary tailwind value helpers
function parseArbitraryValue(className: string | undefined, prefix: string): string {
  if (!className) return "";
  const match = className.match(
    new RegExp(
      `(?:^|\\s)${prefix.replace(/[-\[\]()]/g, "\\$&")}\\[([^\]]+)\\](?:$|\\s)`
    )
  );
  if (match) return match[1].replace(/_/g, " ");
  const active = className
    .split(/\s+/)
    .find((c) => c.startsWith(prefix) && !c.includes("["));
  return active ? active.substring(prefix.length) : "";
}

function encodeArbitraryValue(prefix: string, value: string): string {
  if (!value || !value.trim()) return "";
  return `${prefix}[${value.trim().replace(/\s+/g, "_")}]`;
}

function updateArbitraryClass(
  selectedElement: VisualElement,
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void,
  prefix: string,
  value: string
) {
  const currentTokens = (selectedElement.classes || "")
    .split(/\s+/)
    .filter(Boolean);
  let filtered = currentTokens.filter((token) => !token.startsWith(prefix));
  if (value && value.trim()) {
    filtered.push(encodeArbitraryValue(prefix, value));
  }
  updateTree((n) => ({ classes: filtered.join(" ") }));
}

interface PanelProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
}

// 1. DISPLAY PANEL
function DisplayPanel({ selectedElement, updateTree }: PanelProps) {
  const displayVal = getActiveGroupClass(selectedElement.classes || "", "display") || "";

  return (
    <div className="flex flex-col gap-2.5 animate-in fade-in duration-200">
      <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono">
        display type
      </label>
      <div className="relative">
        <select
          value={displayVal}
          onChange={(e) =>
            updateTree((n) => ({
              classes: setGroupClass(n.classes, "display", e.target.value),
            }))
          }
          className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 cursor-pointer font-medium"
        >
          <option value="">default / browser inherits</option>
          <option value="block">block</option>
          <option value="inline-block">inline-block</option>
          <option value="inline">inline</option>
          <option value="flex">flex</option>
          <option value="inline-flex">inline-flex</option>
          <option value="grid">grid</option>
          <option value="inline-grid">inline-grid</option>
          <option value="flow-root">flow-root</option>
          <option value="contents">contents</option>
          <option value="table">table</option>
          <option value="table-row">table-row</option>
          <option value="table-cell">table-cell</option>
          <option value="list-item">list-item</option>
          <option value="hidden">none</option>
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
        />
      </div>

      {/* Behavior Details Banner */}
      <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-100/55 text-[10px] leading-relaxed text-rose-900">
        <span className="font-bold uppercase tracking-wider text-rose-700 text-[9px] block font-mono">
          Layout Behavior context
        </span>
        <p className="mt-1">
          {displayVal === "block" &&
            "Behaves as a block container. Takes up full width and starts on a new line."}
          {displayVal === "inline-block" &&
            "Behaves as an inline-level box. Sizing is respectably editable."}
          {displayVal === "inline" &&
            "Element renders as inline, wrapping context without custom dimension frames."}
          {displayVal === "flex" &&
            "Prepares container horizontal or vertical child layouts using standard Flex mechanics."}
          {displayVal === "inline-flex" &&
            "Enables inline Flexbox container where outer layout is inline, inner contents flex."}
          {displayVal === "grid" &&
            "Renders children according to column and row structures under CSS Grid parameters."}
          {displayVal === "inline-grid" &&
            "Enables inline Grid container behavior for precise cell-based layouts."}
          {displayVal === "contents" &&
            "Container is visually ignored; its child components are layout-linked directly to its parent."}
          {displayVal === "hidden" &&
            "Element is fully removed from rendering and page layout flow."}
          {!displayVal &&
            "Inherits standard display properties."}
        </p>
      </div>
    </div>
  );
}

// 2. FLEXBOX PANEL
function FlexboxPanel({ selectedElement, updateTree }: PanelProps) {
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
          <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono">
            order
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative font-sans">
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
              placeholder="custom order"
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

// 3. GRID PANEL
function GridPanel({ selectedElement, updateTree }: PanelProps) {
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
            <div className="relative font-sans">
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
              placeholder="custom span / start"
              value={_parseArbitraryValue("col-")}
              onChange={(e) => _updateArbitraryClass("col-", e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 font-medium"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono font-bold">
            grid-row (spanning)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative font-sans">
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
              placeholder="custom row span"
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
            <div className="relative font-sans">
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

          <div className="flex flex-col gap-1.5 border-0">
            <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono font-bold">
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

// 4. OVERFLOW PANEL
function OverflowPanel({ selectedElement, updateTree }: PanelProps) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-200 pt-1">
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1 font-mono">
          overflow
        </label>
        <div className="relative">
          <select
            value={getActiveGroupClass(selectedElement.classes || "", "overflow") || ""}
            onChange={(e) =>
              updateTree((n) => ({
                classes: setGroupClass(n.classes, "overflow", e.target.value),
              }))
            }
            className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
          >
            <option value="">default (visible)</option>
            <option value="overflow-auto">overflow-auto</option>
            <option value="overflow-hidden">overflow-hidden</option>
            <option value="overflow-clip">overflow-clip</option>
            <option value="overflow-visible">overflow-visible</option>
            <option value="overflow-scroll">overflow-scroll</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          {
            id: "overflowX",
            label: "overflow-x",
            options: [
              { v: "", l: "auto" },
              { v: "overflow-x-auto", l: "auto" },
              { v: "overflow-x-hidden", l: "hidden" },
              { v: "overflow-x-clip", l: "clip" },
              { v: "overflow-x-scroll", l: "scroll" },
            ],
          },
          {
            id: "overflowY",
            label: "overflow-y",
            options: [
              { v: "", l: "auto" },
              { v: "overflow-y-auto", l: "auto" },
              { v: "overflow-y-hidden", l: "hidden" },
              { v: "overflow-y-clip", l: "clip" },
              { v: "overflow-y-scroll", l: "scroll" },
            ],
          },
        ].map((C) => (
          <div className="flex flex-col gap-1.5" key={C.id}>
            <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1 font-mono">
              {C.label}
            </label>
            <div className="relative">
              <select
                value={getActiveGroupClass(selectedElement.classes || "", C.id as any) || ""}
                onChange={(e) =>
                  updateTree((G) => ({
                    classes: setGroupClass(G.classes, C.id as any, e.target.value),
                  }))
                }
                className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-2 pr-6 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
              >
                {C.options.map((k) => (
                  <option value={k.v} key={k.v}>
                    {k.l}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>
          </div>
        ))}
      </div>

      {[
        {
          id: "scrollBehavior",
          label: "scroll-behavior",
          options: [
            { v: "", l: "default" },
            { v: "scroll-auto", l: "scroll-auto" },
            { v: "scroll-smooth", l: "scroll-smooth" },
          ],
        },
        {
          id: "scrollSnapType",
          label: "scroll-snap-type",
          options: [
            { v: "", l: "none" },
            { v: "snap-none", l: "snap-none" },
            { v: "snap-x", l: "snap-x" },
            { v: "snap-y", l: "snap-y" },
            { v: "snap-both", l: "snap-both" },
          ],
        },
      ].map((C) => (
        <div className="flex flex-col gap-1.5" key={C.id}>
          <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1 font-mono">
            {C.label}
          </label>
          <div className="relative font-sans">
            <select
              value={getActiveGroupClass(selectedElement.classes || "", C.id as any) || ""}
              onChange={(e) =>
                updateTree((G) => ({
                  classes: setGroupClass(G.classes, C.id as any, e.target.value),
                }))
              }
              className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer"
            >
              {C.options.map((k) => (
                <option value={k.v} key={k.v}>
                  {k.l}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface LayoutSectionProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
  handleCopy: (text: string) => void;
  copiedText: string | null;
}

export function LayoutSection({ selectedElement, updateTree, handleCopy, copiedText }: LayoutSectionProps) {
  const [expandedLayoutSections, setExpandedLayoutSections] = useState<Record<string, boolean>>({
    display: true,
    flex: true,
    grid: true,
    overflow: true,
  });

  const toggleLayoutSection = (section: string) => {
    setExpandedLayoutSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const displayVal = getActiveGroupClass(selectedElement.classes || "", "display") || "";
  const isFlexContext = displayVal === "flex" || displayVal === "inline-flex";
  const isGridContext = displayVal === "grid" || displayVal === "inline-grid";

  const sectionHeader = (
    id: string,
    label: string,
    icon: any,
    badge?: string,
  ) => {
    const isExpanded = expandedLayoutSections[id];
    const IconComponent = icon;
    return (
      <button
        type="button"
        onClick={() => toggleLayoutSection(id)}
        className="w-full flex items-center justify-between pb-1 text-left cursor-pointer select-none font-sans"
      >
        <div className="flex items-center gap-2">
          <div className="text-[10px] uppercase font-bold tracking-wider text-rose-700 font-mono flex items-center gap-1.5">
            <IconComponent size={11} className="text-rose-600" />
            <span>{label}</span>
          </div>
          {badge && (
            <span className="text-[8px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider font-mono select-none animate-pulse">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={14}
          className={`text-stone-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-3 duration-350">
      <div className="flex items-center gap-2 mb-1">
        <Maximize size={15} className="text-rose-600" />
        <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">
          Layout Settings
        </span>
      </div>

      <div className="space-y-4">
        {/* --- 1. DISPLAY MODE --- */}
        <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm select-none">
          {sectionHeader("display", "Display Mode", Sliders)}
          {expandedLayoutSections.display && (
            <DisplayPanel selectedElement={selectedElement} updateTree={updateTree} />
          )}
        </div>

        {/* --- 2. FLEXBOX CONTAINER SUB-CATEGORY --- */}
        <div
          className={`border rounded-2xl p-3.5 space-y-1 transition-all duration-300 shadow-sm ${
            isFlexContext
              ? "bg-stone-50/50 border-stone-200/50"
              : "bg-stone-100/30 border-stone-200/30 opacity-75"
          }`}
        >
          {sectionHeader(
            "flex",
            "Flexbox Container",
            Cpu,
            !isFlexContext
              ? "⚠️ Inactive (Display is not Flex)"
              : undefined,
          )}
          {expandedLayoutSections.flex && (
            <FlexboxPanel selectedElement={selectedElement} updateTree={updateTree} />
          )}
        </div>

        {/* --- 3. GRID CONTAINER SUB-CATEGORY --- */}
        <div
          className={`border rounded-2xl p-3.5 space-y-1 transition-all duration-300 shadow-sm ${
            isGridContext
              ? "bg-stone-50/50 border-stone-200/50"
              : "bg-stone-100/30 border-stone-200/30 opacity-75"
          }`}
        >
          {sectionHeader(
            "grid",
            "Grid Container",
            Grid,
            !isGridContext
              ? "⚠️ Inactive (Display is not Grid)"
              : undefined,
          )}
          {expandedLayoutSections.grid && (
            <GridPanel selectedElement={selectedElement} updateTree={updateTree} />
          )}
        </div>

        {/* --- 4. OVERFLOW & SCROLL Sub-Category --- */}
        <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm select-none">
          {sectionHeader("overflow", "Overflow & Scroll Info", Compass)}
          {expandedLayoutSections.overflow && (
            <OverflowPanel selectedElement={selectedElement} updateTree={updateTree} />
          )}
        </div>
      </div>
    </div>
  );
}
