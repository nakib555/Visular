import React from "react";
import { ChevronDown } from "lucide-react";
import { VisualElement } from "../../../types";
import { getActiveGroupClass, setGroupClass } from "../../../styleUtils";

interface PanelProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
}

export function OverflowPanel({ selectedElement, updateTree }: PanelProps) {
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
          <div className="relative">
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
