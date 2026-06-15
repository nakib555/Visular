import React from "react";
import { ArrowRight, ArrowLeft, ArrowDown, ArrowUp } from "lucide-react";

interface FlexDirectionControlProps {
  value: string;
  onChange: (val: string) => void;
}

export function FlexDirectionControl({ value, onChange }: FlexDirectionControlProps) {
  const directions = [
    {
      val: "row",
      label: "Row",
      desc: "Left to Right",
      icon: ArrowRight,
      demoLayout: "ltr"
    },
    {
      val: "row-reverse",
      label: "Row Reverse",
      desc: "Right to Left",
      icon: ArrowLeft,
      demoLayout: "rtl"
    },
    {
      val: "column",
      label: "Column",
      desc: "Top to Bottom",
      icon: ArrowDown,
      demoLayout: "ttb"
    },
    {
      val: "column-reverse",
      label: "Column Reverse",
      desc: "Bottom to Top",
      icon: ArrowUp,
      demoLayout: "btt"
    }
  ];

  return (
    <div className="flex flex-col gap-3 w-full text-left relative overflow-visible group transition-all duration-200 z-10">
      
      <div className="flex flex-col gap-1.5 w-full relative">
        <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono flex justify-between select-none">
          <span>Flex Direction</span>
          <span className="text-[10px] font-mono font-bold text-stone-400 select-all normal-case">
            {value || "row"}
          </span>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {directions.map((dir) => {
          const isSelected = value === dir.val;
          const Icon = dir.icon;

          return (
            <button
              key={dir.val}
              type="button"
              onClick={() => onChange(isSelected ? "" : dir.val)}
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden border ${
                isSelected
                  ? "bg-amber-50/80 border-amber-300 shadow-[0_2px_10px_-2px_rgba(245,158,11,0.2)]"
                  : "bg-white border-stone-200 hover:border-amber-200 hover:bg-amber-50/30"
              }`}
            >
              {isSelected && (
                <div className="absolute inset-x-0 top-0 h-[2px] bg-amber-400 animate-pulse" />
              )}
              
              {/* Mini Diagram Simulation */}
              <div className={`flex w-full h-8 mb-2 gap-[2px] p-1 bg-stone-100 rounded-lg border border-stone-200/50 ${
                dir.demoLayout === "ltr" ? "flex-row" : 
                dir.demoLayout === "rtl" ? "flex-row-reverse" : 
                dir.demoLayout === "ttb" ? "flex-col" : "flex-col-reverse"
              }`}>
                <div className={`bg-violet-400 rounded-sm shadow-sm opacity-90 ${dir.demoLayout === "ltr" || dir.demoLayout === "rtl" ? "w-1/3 h-full" : "w-full h-1/3"}`} />
                <div className={`bg-indigo-300 rounded-sm shadow-sm opacity-60 ${dir.demoLayout === "ltr" || dir.demoLayout === "rtl" ? "w-1/3 h-full" : "w-full h-1/3"}`} />
                <div className={`bg-sky-200 rounded-sm shadow-sm opacity-30 ${dir.demoLayout === "ltr" || dir.demoLayout === "rtl" ? "flex-1 h-full" : "w-full flex-1"}`} />
              </div>

              <div className="flex items-center gap-1.5 w-full justify-between">
                <span className={`text-[10px] font-bold ${isSelected ? "text-amber-700" : "text-stone-600"}`}>
                  {dir.label}
                </span>
                <Icon size={12} className={isSelected ? "text-amber-600" : "text-stone-400"} />
              </div>
            </button>
          );
        })}
      </div>
      
      <p className="text-[9.5px] leading-relaxed text-stone-500 font-medium bg-white/60 p-2 rounded-xl border border-stone-200/40">
        Controls the principal axis along which flex items are placed inside the flex container.
      </p>
    </div>
  );
}
