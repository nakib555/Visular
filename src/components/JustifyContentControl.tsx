import React from "react";
import { 
  AlignHorizontalDistributeCenter, 
  AlignHorizontalDistributeEnd, 
  AlignHorizontalDistributeStart, 
  AlignHorizontalSpaceAround, 
  AlignHorizontalSpaceBetween,
  AlignVerticalJustifyCenter,
  AlignJustify,
  Maximize2,
  ListFilter,
  Eye,
  Sliders,
  Sparkles,
  HelpCircle
} from "lucide-react";

interface JustifyContentControlProps {
  key?: React.Key | number | string;
  value: string;
  onChange: (val: string) => void;
}

export function JustifyContentControl({ value, onChange }: JustifyContentControlProps) {
  // Map Tailwind classes as primary visual properties
  const properties = [
    {
      val: "justify-start",
      label: "justify-start",
      shortLabel: "Start",
      desc: "Items pack at start of container",
      icon: AlignHorizontalDistributeStart,
      previewClasses: "justify-start",
      explanation: "Items are packed toward the start line of the flex container's main-axis."
    },
    {
      val: "justify-center",
      label: "justify-center",
      shortLabel: "Center",
      desc: "Items pack at central axis",
      icon: AlignHorizontalDistributeCenter,
      previewClasses: "justify-center",
      explanation: "Items are packed toward the center of the main-axis."
    },
    {
      val: "justify-end",
      label: "justify-end",
      shortLabel: "End",
      desc: "Items pack at end of container",
      icon: AlignHorizontalDistributeEnd,
      previewClasses: "justify-end",
      explanation: "Items are packed toward the end line of the main-axis."
    },
    {
      val: "justify-between",
      label: "justify-between",
      shortLabel: "Space Between",
      desc: "Equal distribution; outer items touch edges",
      icon: AlignHorizontalSpaceBetween,
      previewClasses: "justify-between",
      explanation: "First item is at start edge, last item is at end edge, with equal spacing between."
    },
    {
      val: "justify-around",
      label: "justify-around",
      shortLabel: "Space Around",
      desc: "Equal surrounding padding; half-size end gaps",
      icon: AlignHorizontalSpaceAround,
      previewClasses: "justify-around",
      explanation: "Items have equal space around them. Outer gaps are half of inner spaces."
    },
    {
      val: "justify-evenly",
      label: "justify-evenly",
      shortLabel: "Space Evenly",
      desc: "True equal gap distribution",
      icon: AlignVerticalJustifyCenter,
      previewClasses: "justify-evenly",
      explanation: "Gaps between any two adjacent items, and outer margins, are completely identical."
    },
    {
      val: "justify-stretch",
      label: "justify-stretch",
      shortLabel: "Stretch",
      desc: "Stretch items along main axis",
      icon: AlignJustify,
      previewClasses: "justify-stretch",
      explanation: "Items stretch to fit container space (requires auto-sizing or flex-grow on children)."
    }
  ];

  const secondaryProperties = [
    { val: "justify-normal", label: "justify-normal", desc: "Default layout behavior" },
    { val: "justify-items-left", label: "justify-items-left", desc: "Align items left" },
    { val: "justify-items-right", label: "justify-items-right", desc: "Align items right" }
  ];

  // Helper to get active record
  const currentActiveProp = properties.find(p => p.val === value) || 
                            secondaryProperties.find(p => p.val === value);

  return (
    <div className="flex flex-col gap-4 w-full text-left bg-gradient-to-br from-indigo-50/50 via-sky-50/30 to-rose-50/10 p-4 rounded-2xl border border-indigo-100/50 shadow-sm transition-all">
      {/* Property Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 px-1.5 bg-indigo-500 rounded-lg text-white shadow-sm flex items-center justify-center">
            <Sliders size={13} className="animate-pulse" />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] text-indigo-900 font-extrabold uppercase tracking-widest font-mono">
              Justify Content
            </label>
            <span className="text-[8.5px] text-indigo-400 font-sans font-medium">Main-Axis Alignment</span>
          </div>
        </div>
        <div className="flex gap-1.5 items-center">
          {value && (
            <button 
              onClick={() => onChange("")}
              className="text-[8.5px] font-bold text-rose-500 hover:text-rose-700 bg-white hover:bg-rose-50 px-2 py-1 rounded-lg shadow-xs border border-rose-100/70 uppercase tracking-wider transition-all"
            >
              Reset
            </button>
          )}
          <span className="font-mono text-[9.5px] font-bold text-indigo-600 bg-indigo-50/80 px-2 py-1 rounded-lg border border-indigo-100/40 shadow-xs max-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap">
            {value || "default"}
          </span>
        </div>
      </div>

      {/* Dropdown Selector Component - explicitly contains all 7 values */}
      <div className="flex flex-col gap-1.5 bg-white p-3 rounded-xl border border-indigo-100/30 shadow-xs">
        <label className="text-[9.5px] text-indigo-700 font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono">
          <ListFilter size={12} className="text-indigo-400" />
          Direct Utility Selector
        </label>
        <div className="relative">
          <select
            value={value}
            id="justify_content_tailwind_dropdown"
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-indigo-100/70 hover:border-indigo-200/80 rounded-xl pl-3 pr-8 py-2 text-xs font-mono font-medium text-indigo-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer shadow-inner"
          >
            <option value="" className="font-sans text-stone-500">── Default / Not Configured ──</option>
            <optgroup label="Core Tailwind Utilities" className="font-sans font-semibold text-indigo-600">
              {properties.map((prop) => (
                <option key={prop.val} value={prop.val} className="font-mono text-stone-700">
                  {prop.label} ({prop.shortLabel})
                </option>
              ))}
            </optgroup>
            <optgroup label="Other Options" className="font-sans font-semibold text-stone-500">
              {secondaryProperties.map((prop) => (
                <option key={prop.val} value={prop.val} className="font-mono text-stone-700">
                  {prop.label}
                </option>
              ))}
            </optgroup>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Visual Workspace Grid Simulator */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[9.5px] text-indigo-700 font-bold uppercase tracking-wider flex items-center gap-1 font-mono">
            <Eye size={12} className="text-indigo-400" />
            Interactive Visual Axis Playfield
          </span>
          <span className="text-[8px] text-stone-450 font-semibold font-mono">Click cards to toggle layout</span>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {properties.map((prop) => {
            const isSelected = value === prop.val;
            const Icon = prop.icon;

            return (
              <button
                key={prop.val}
                type="button"
                onClick={() => onChange(isSelected ? "" : prop.val)}
                className={`relative flex flex-col md:flex-row items-stretch justify-between p-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left border ${
                  isSelected
                    ? "bg-white border-indigo-400 shadow-[0_4px_16px_-4px_rgba(99,102,241,0.22)] ring-1 ring-indigo-400"
                    : "bg-white/80 border-stone-200 hover:border-indigo-300 hover:bg-stone-50 shadow-xs"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-indigo-400/10 to-transparent rounded-bl-lg border-l border-b border-white" />
                )}

                {/* Left Side Info */}
                <div className="flex flex-col justify-between pr-3 py-0.5 flex-1 select-none">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <div className={`p-1 rounded ${isSelected ? "bg-indigo-50 text-indigo-600" : "bg-stone-100 text-stone-400"}`}>
                        <Icon size={12} strokeWidth={isSelected ? 2.5 : 1.75} />
                      </div>
                      <span className={`text-[11px] font-bold font-mono tracking-tight ${isSelected ? "text-indigo-900" : "text-stone-700"}`}>
                        {prop.shortLabel}
                      </span>
                    </div>
                    <p className="text-[9px] text-stone-450 mt-1 leading-normal font-sans ml-0.5 font-medium">
                      {prop.desc}
                    </p>
                  </div>
                </div>

                {/* Interactive Dynamic Wireframe Axis Simulation */}
                <div className="w-full md:w-[130px] min-w-[120px] flex items-center justify-center p-1.5 bg-stone-50 rounded-lg border border-stone-100 mt-2.5 md:mt-0 shadow-inner overflow-hidden">
                  <div className={`flex w-full h-8 gap-1 p-1 bg-white rounded-md border border-stone-150 relative items-center transition-all duration-300 ${prop.previewClasses}`}>
                    {/* Visual Guideline axis wires */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] border-b border-dashed border-indigo-200/40 pointer-events-none" />
                    
                    {/* Mock Flex Elements */}
                    <div className={`w-3 h-5 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-sm shadow-sm flex items-center justify-center text-[7px] text-white font-extrabold font-mono transition-all duration-300 ${isSelected ? "scale-105" : "opacity-80"}`}>
                      1
                    </div>
                    <div className={`w-3.5 h-5 bg-gradient-to-br from-indigo-300 to-indigo-400 rounded-sm shadow-sm flex items-center justify-center text-[7px] text-white font-extrabold font-mono transition-all duration-300 ${isSelected ? "scale-105" : "opacity-70"}`}>
                      2
                    </div>
                    <div className={`w-2.5 h-5 bg-gradient-to-br from-indigo-200 to-indigo-300 rounded-sm shadow-sm flex items-center justify-center text-[7px] text-white font-extrabold font-mono transition-all duration-300 ${isSelected ? "scale-105 animate-pulse" : "opacity-60"}`}>
                      3
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Custom Chips */}
      <div className="border-t border-indigo-100/50 pt-3">
        <label className="text-[9.5px] font-mono uppercase font-bold text-indigo-500/80 mb-2 block tracking-wider pl-0.5">
          Secondary Alignment Values
        </label>
        <div className="flex flex-wrap gap-1.5">
          {secondaryProperties.map((prop) => {
            const isSelected = value === prop.val;
            return (
              <button
                key={prop.val}
                type="button"
                onClick={() => onChange(isSelected ? "" : prop.val)}
                className={`px-2 py-1.5 rounded-lg text-[9.5px] font-mono font-bold transition-all border ${
                  isSelected
                    ? "bg-indigo-500 text-white shadow shadow-indigo-500/20 border-indigo-600"
                    : "bg-white border-stone-200 text-stone-550 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-100"
                }`}
                title={prop.desc}
              >
                {prop.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Informative layout guidelines */}
      <div className="mt-0.5 bg-gradient-to-r from-indigo-50/70 to-blue-50/40 p-2.5 rounded-xl border border-indigo-100/30 flex gap-2.5 items-start">
        <div className="p-1 bg-white rounded-lg text-indigo-500 shadow-xs flex-shrink-0">
          <HelpCircle size={12} />
        </div>
        <div className="flex flex-col gap-0.5 text-left">
          <span className="text-[9.5px] font-extrabold text-indigo-900 font-mono">DEVELOPER SPEC NOTES:</span>
          <p className="text-[9px] leading-relaxed text-indigo-950/80">
            {currentActiveProp && "explanation" in currentActiveProp ? (
              <span className="font-semibold">{currentActiveProp.explanation}</span>
            ) : (
              <span>Calculates alignment spacing offsets on the parent's current primary main-axis flow (rows or columns). Ensure container is marked as <code className="font-mono bg-indigo-100/60 px-1 rounded text-indigo-700">flex</code> or <code className="font-mono bg-indigo-100/60 px-1 rounded text-indigo-700">grid</code>.</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
