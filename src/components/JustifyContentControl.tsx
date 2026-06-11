import React from "react";
import { 
  AlignHorizontalDistributeCenter, 
  AlignHorizontalDistributeEnd, 
  AlignHorizontalDistributeStart, 
  AlignHorizontalSpaceAround, 
  AlignHorizontalSpaceBetween,
  AlignVerticalJustifyCenter,
  AlignLeft,
  AlignRight
} from "lucide-react";

interface JustifyContentControlProps {
  value: string;
  onChange: (val: string) => void;
}

export function JustifyContentControl({ value, onChange }: JustifyContentControlProps) {
  // Using generic flex-row layout visualization for justify-content
  
  const properties = [
    {
      val: "flex-start",
      label: "Start",
      desc: "Items pack at start",
      icon: AlignHorizontalDistributeStart,
      previewClasses: "justify-start"
    },
    {
      val: "center",
      label: "Center",
      desc: "Items pack at center",
      icon: AlignHorizontalDistributeCenter,
      previewClasses: "justify-center"
    },
    {
      val: "flex-end",
      label: "End",
      desc: "Items pack at end",
      icon: AlignHorizontalDistributeEnd,
      previewClasses: "justify-end"
    },
    {
      val: "space-between",
      label: "Space Between",
      desc: "Equal spacing between",
      icon: AlignHorizontalSpaceBetween,
      previewClasses: "justify-between"
    },
    {
      val: "space-around",
      label: "Space Around",
      desc: "Equal spacing around",
      icon: AlignHorizontalSpaceAround,
      previewClasses: "justify-around"
    },
    {
      val: "space-evenly",
      label: "Space Evenly",
      desc: "Equal spacing evenly",
      icon: AlignVerticalJustifyCenter,
      previewClasses: "justify-evenly"
    }
  ];

  const genericProperties = [
    "normal", "start", "end", "left", "right"
  ];

  return (
    <div className="flex flex-col gap-3 w-full text-left bg-gradient-to-br from-emerald-50/40 to-teal-50/20 p-3.5 rounded-2xl border border-emerald-100/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]">
      <div className="flex items-center justify-between mb-0.5">
        <label className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-widest flex items-center gap-1.5 font-mono">
          <span className="w-1.5 h-3 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
          Justify Content
        </label>
        <div className="flex gap-1.5 items-center">
          {value && (
            <button 
              onClick={() => onChange("")}
              className="text-[8px] font-bold text-emerald-500 hover:text-emerald-700 bg-white px-1.5 py-0.5 rounded shadow-sm border border-emerald-100 uppercase tracking-wider"
            >
              Clear
            </button>
          )}
          <span className="text-[9px] font-mono font-medium text-emerald-700 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200/60 shadow-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">
            {value || "default"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {properties.map((prop) => {
          const isSelected = value === prop.val;
          const Icon = prop.icon;

          return (
            <button
              key={prop.val}
              type="button"
              onClick={() => onChange(isSelected ? "" : prop.val)}
              className={`relative flex flex-col p-2.5 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden border ${
                isSelected
                  ? "bg-emerald-50/90 border-emerald-400 shadow-[0_2px_12px_-2px_rgba(52,211,153,0.25)] ring-1 ring-emerald-400/20"
                  : "bg-white border-stone-200/80 hover:border-emerald-300 hover:bg-emerald-50/40 shadow-sm"
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-emerald-400/20 to-transparent rounded-bl-xl border-l border-b border-white/40" />
              )}
              
              {/* Mini Diagram Simulation for Justify Content */}
              <div className={`flex w-full h-7 mb-2.5 gap-0.5 p-1 bg-stone-100 rounded-lg border border-stone-200/60 shadow-inner ${prop.previewClasses}`}>
                <div className="w-3 h-full bg-emerald-400 rounded-sm shadow-sm" />
                <div className="w-4 h-full bg-teal-400 rounded-sm shadow-sm opacity-80" />
                <div className="w-2.5 h-full bg-cyan-400 rounded-sm shadow-sm opacity-60" />
              </div>

              <div className="flex items-center gap-1.5 w-full justify-between">
                <div className="flex flex-col items-start gap-0.5">
                  <span className={`text-[10px] font-bold ${isSelected ? "text-emerald-800" : "text-stone-700"}`}>
                    {prop.label}
                  </span>
                </div>
                <Icon size={14} className={isSelected ? "text-emerald-600" : "text-stone-400"} strokeWidth={isSelected ? 2.5 : 2} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Other generic properties as a compact chip list */}
      <div className="mt-1 pt-3 border-t border-emerald-100/60">
        <span className="text-[8.5px] font-mono uppercase font-bold text-emerald-600/70 mb-2 block tracking-widest pl-0.5">Other Values</span>
        <div className="flex flex-wrap gap-1.5">
          {genericProperties.map((propVal) => {
            const isSelected = value === propVal;
            return (
              <button
                key={propVal}
                type="button"
                onClick={() => onChange(isSelected ? "" : propVal)}
                className={`px-2 py-1 rounded-md text-[9.5px] font-mono font-medium transition-all ${
                  isSelected
                    ? "bg-emerald-500 text-white shadow shadow-emerald-500/20 border-emerald-600 border"
                    : "bg-white border border-stone-200 text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                }`}
              >
                {propVal}
              </button>
            );
          })}
        </div>
      </div>
      
      <p className="mt-1 text-[9px] leading-relaxed text-emerald-800/70 font-medium bg-emerald-100/30 p-2 rounded-lg border border-emerald-200/30">
        Defines how space is distributed between and around content items along the main-axis of a flexbox or grid container.
      </p>
    </div>
  );
}
