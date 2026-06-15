import React from "react";
import { ArrowRight, CornerDownLeft, CornerUpLeft, WrapText } from "lucide-react";

interface FlexWrapControlProps {
  value: string;
  onChange: (val: string) => void;
}

export function FlexWrapControl({ value, onChange }: FlexWrapControlProps) {
  const options = [
    {
      val: "nowrap",
      label: "No Wrap",
      desc: "Single-line",
      icon: ArrowRight,
    },
    {
      val: "wrap",
      label: "Wrap",
      desc: "Multi-line",
      icon: CornerDownLeft,
    },
    {
      val: "wrap-reverse",
      label: "Wrap Reverse",
      desc: "Bottom-up multi-line",
      icon: CornerUpLeft,
    },
  ];

  return (
    <div className="flex flex-col gap-3 w-full text-left relative overflow-visible group transition-all duration-200 z-10">
      
      <div className="flex flex-col gap-1.5 w-full relative">
        <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono flex justify-between select-none">
          <span>Flex Wrap</span>
          <span className="text-[10px] font-mono font-bold text-stone-400 select-all normal-case">
            {value || "nowrap"}
          </span>
        </label>
      </div>

      {/* Main Control Area */}
      <div className="flex flex-col gap-2">
          {options.map((opt) => {
            const isSelected = value === opt.val || (!value && opt.val === "nowrap");
            const Icon = opt.icon;

            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => onChange(isSelected && value ? "" : opt.val)}
                className={`group relative flex items-center p-2.5 rounded-lg border transition-all duration-200 text-left ${
                  isSelected
                    ? "bg-emerald-50/60 border-emerald-300 shadow-[0_1px_2px_rgba(16,185,129,0.1)] z-10"
                    : "bg-white border-stone-200 hover:border-emerald-200 hover:bg-emerald-50/20"
                }`}
              >
                {/* Graphic Representation */}
                <div className={`flex shrink-0 items-center justify-center w-9 h-9 rounded-md mr-3 border ${
                  isSelected ? "bg-white border-emerald-200 text-emerald-600 shadow-sm" : "bg-stone-50 border-stone-200/70 text-stone-400 group-hover:text-emerald-500"
                }`}>
                  <Icon size={16} />
                </div>

                {/* Text Content */}
                <div className="flex-1 flex flex-col">
                  <span className={`text-[11px] font-bold ${isSelected ? "text-emerald-800" : "text-stone-700"}`}>
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-stone-500 mt-0.5">
                    {opt.desc}
                  </span>
                </div>

                {/* Visual Layout Preview (Micro Canvas) */}
                <div className="ml-2 flex items-center justify-center w-[42px] h-[32px] bg-stone-100/80 rounded border border-stone-200/50 p-1">
                  {opt.val === "nowrap" && (
                    <div className="flex w-full h-full gap-[2px] overflow-hidden">
                      {[1, 2, 3, 4].map((i) => (
                        <div 
                          key={i} 
                          className={`flex-1 h-full rounded-[2px] shadow-sm ${isSelected ? 'bg-emerald-500' : 'bg-stone-300'}`}
                          style={{ opacity: 1 - i * 0.15 }}
                        />
                      ))}
                    </div>
                  )}
                  {opt.val === "wrap" && (
                    <div className="flex flex-wrap w-full h-full gap-[2px] content-start">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                          key={i} 
                          className={`w-[9px] h-[8px] rounded-[1.5px] shadow-sm ${isSelected ? 'bg-emerald-500' : 'bg-stone-300'}`}
                          style={{ opacity: 1 - i * 0.12 }}
                        />
                      ))}
                    </div>
                  )}
                  {opt.val === "wrap-reverse" && (
                    <div className="flex flex-wrap-reverse w-full h-full gap-[2px] content-start">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                          key={i} 
                          className={`w-[9px] h-[8px] rounded-[1.5px] shadow-sm ${isSelected ? 'bg-emerald-500' : 'bg-stone-300'}`}
                          style={{ opacity: 1 - i * 0.12 }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Active Indicator */}
                {isSelected && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-md" />
                )}
              </button>
            );
          })}
        </div>
      
      {/* Footer Info */}
      <div className="px-3 py-2 bg-stone-50 border-t border-stone-100">
        <p className="text-[9.5px] leading-relaxed text-stone-500 font-medium">
          Dictates whether flex items are forced onto one line or can wrap onto multiple lines.
        </p>
      </div>
    </div>
  );
}
