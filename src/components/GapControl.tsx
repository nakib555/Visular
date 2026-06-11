import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MoveHorizontal, 
  MoveVertical, 
  LayoutGrid, 
  Info, 
  Sparkles, 
  ChevronRight,
  Settings2
} from "lucide-react";

interface GapControlProps {
  value: string;
  onChange: (val: string) => void;
}

interface GapPreset {
  label: string;
  value: string;
  pixelEquivalent: number; // For rendering simulator/diagram accurately
  badgeColor: string;
}

const GAP_PRESETS: GapPreset[] = [
  { label: "0", value: "0px", pixelEquivalent: 0, badgeColor: "bg-slate-100/75 text-slate-500" },
  { label: "xs", value: "4px", pixelEquivalent: 4, badgeColor: "bg-teal-50 text-teal-600 border-teal-100" },
  { label: "sm", value: "8px", pixelEquivalent: 8, badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { label: "md", value: "12px", pixelEquivalent: 12, badgeColor: "bg-green-50 text-green-600 border-green-100" },
  { label: "lg", value: "16px", pixelEquivalent: 16, badgeColor: "bg-cyan-50 text-cyan-600 border-cyan-100" },
  { label: "xl", value: "24px", pixelEquivalent: 24, badgeColor: "bg-blue-50 text-blue-600 border-blue-100" },
  { label: "2xl", value: "32px", pixelEquivalent: 32, badgeColor: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { label: "3xl", value: "48px", pixelEquivalent: 48, badgeColor: "bg-violet-50 text-violet-600 border-violet-100" },
];

export function GapControl({ value, onChange }: GapControlProps) {
  // Simulator direction: "row" (horizontal) or "column" (vertical)
  const [direction, setDirection] = useState<"row" | "column">("row");
  // Active custom unit selection
  const [unit, setUnit] = useState<"px" | "rem" | "%" | "em">("px");
  
  // Parse the current numeric value and current unit from the CSS string
  const { numericValue, parsedUnit } = useMemo(() => {
    if (!value) return { numericValue: 0, parsedUnit: "px" as const };
    
    const num = parseFloat(value);
    if (isNaN(num)) return { numericValue: 0, parsedUnit: "px" as const };
    
    if (value.endsWith("rem")) return { numericValue: num, parsedUnit: "rem" as const };
    if (value.endsWith("%")) return { numericValue: num, parsedUnit: "%" as const };
    if (value.endsWith("em")) return { numericValue: num, parsedUnit: "em" as const };
    return { numericValue: num, parsedUnit: "px" as const };
  }, [value]);

  // Synchronize unit state when prop value changes
  useEffect(() => {
    if (value) {
      setUnit(parsedUnit);
    }
  }, [value, parsedUnit]);

  // Helper to update value with selected unit
  const handleNumericChange = (num: number, targetUnit = unit) => {
    const formatted = num === 0 ? "0px" : `${num}${targetUnit}`;
    onChange(formatted);
  };

  // Convert current value to responsive simulation width in pixels for diagram
  const simulatedPixelGap = useMemo(() => {
    if (!value) return 12; // default fallback visual
    
    // Check if matches a preset to avoid rough conversion calculations
    const matchedPreset = GAP_PRESETS.find(p => p.value === value);
    if (matchedPreset) return matchedPreset.pixelEquivalent;

    // Convert others approximately for the visualization box
    if (parsedUnit === "rem") return Math.min(numericValue * 16, 75);
    if (parsedUnit === "em") return Math.min(numericValue * 16, 75);
    if (parsedUnit === "%") return Math.min((numericValue / 100) * 120, 75);
    return Math.min(numericValue, 75); // clamp px for UI constraints
  }, [value, parsedUnit, numericValue]);

  // Handle preset click
  const handlePresetSelect = (val: string) => {
    onChange(val);
  };

  // Preset check
  const activePreset = useMemo(() => {
    return GAP_PRESETS.find(p => p.value === value) || null;
  }, [value]);

  // Max bounds for range sliders depending on selected unit
  const unitConfig = {
    px: { min: 0, max: 80, step: 1, label: "Pixels" },
    rem: { min: 0, max: 6, step: 0.125, label: "Relative (rem)" },
    "%": { min: 0, max: 20, step: 0.5, label: "Percentage" },
    em: { min: 0, max: 6, step: 0.125, label: "Relative (em)" },
  };

  const currentLimit = unitConfig[unit];

  return (
    <div className="flex flex-col gap-3 w-full text-left bg-gradient-to-b from-stone-50 to-stone-100 p-4 rounded-[22px] border border-stone-250/90 shadow-[inset_0_1.5px_0_0_white,0_1px_3px_rgba(0,0,0,0.02)] relative overflow-hidden group">
      
      {/* Decorative top-right overlay glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-350/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header and current value badge */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
            <LayoutGrid size={11} className="text-emerald-600" />
          </div>
          <label className="text-[10px] text-stone-600 font-extrabold uppercase tracking-widest font-mono">
            Element Gap Studio
          </label>
        </div>
        
        {value ? (
          <div className="flex items-center gap-1.5 animate-fade-in">
            {activePreset && (
              <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-full border ${activePreset.badgeColor}`}>
                Preset: {activePreset.label.toUpperCase()}
              </span>
            )}
            <span className="text-[10px] font-mono font-extrabold text-emerald-700 bg-emerald-50 Border border-emerald-200/60 px-2 py-0.5 rounded-lg shadow-xs">
              {value}
            </span>
          </div>
        ) : (
          <span className="text-[9.5px] font-mono font-semibold text-stone-400 bg-stone-150/50 px-2 py-0.5 rounded-lg border border-stone-200/40">
            default / not set
          </span>
        )}
      </div>

      {/* Spacing Sandbox Simulator Preview */}
      <div className="bg-white border border-stone-200/90 p-3 rounded-2xl shadow-xs overflow-hidden flex flex-col gap-2.5 relative z-10 transition-all duration-300 hover:border-emerald-250 hover:shadow-sm">
        
        {/* Sandbox Title & Flow Axis Toggle */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <div className="flex items-center gap-1">
            <Sparkles size={11} className="text-amber-500 animate-pulse" />
            <span className="text-[10px] font-extrabold text-stone-700 font-sans tracking-tight">Interactive Spacing Sandbox</span>
          </div>
          
          {/* Layout Direction Selector */}
          <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-200/50">
            <button
              type="button"
              onClick={() => setDirection("row")}
              className={`px-2 py-1 rounded-md text-[9px] font-bold flex items-center gap-1 transition-all duration-250 cursor-pointer ${
                direction === "row" 
                  ? "bg-white text-stone-800 shadow-xs" 
                  : "text-stone-400 hover:text-stone-600"
              }`}
              title="Visualize row flow (horizontal)"
            >
              <MoveHorizontal size={10} />
              Row
            </button>
            <button
              type="button"
              onClick={() => setDirection("column")}
              className={`px-2 py-1 rounded-md text-[9px] font-bold flex items-center gap-1 transition-all duration-250 cursor-pointer ${
                direction === "column" 
                  ? "bg-white text-stone-800 shadow-xs" 
                  : "text-stone-400 hover:text-stone-600"
              }`}
              title="Visualize column flow (vertical)"
            >
              <MoveVertical size={10} />
              Col
            </button>
          </div>
        </div>

        {/* Live Simulator Interface */}
        <div className="h-28 bg-stone-50/50 border border-dashed border-stone-200 rounded-xl relative flex items-center justify-center p-3 select-none">
          
          <motion.div 
            layout
            className={`w-full h-full flex items-center justify-center ${
              direction === "row" ? "flex-row h-10" : "flex-col w-32"
            }`}
            style={{ gap: `${simulatedPixelGap}px` }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
          >
            {/* Box 1 */}
            <div className="h-8 w-11 bg-teal-400 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-xs border border-teal-500/10 shrink-0">
              Box A
            </div>

            {/* Gap Bridge Representation */}
            <AnimatePresence mode="popLayout">
              {simulatedPixelGap > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`bg-orange-50 border border-dashed border-orange-300 rounded-md flex items-center justify-center text-[8px] font-extrabold font-mono text-orange-600/80 pointer-events-none transition-all ${
                    direction === "row" ? "h-6 px-1 shrink-0" : "w-16 py-0.5 shrink-0"
                  }`}
                  style={direction === "row" ? { width: `${simulatedPixelGap}px` } : { height: `${simulatedPixelGap}px` }}
                >
                  <span className="truncate max-w-full text-center">
                    {simulatedPixelGap >= 12 ? `${simulatedPixelGap}px` : "•"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Box 2 */}
            <div className="h-8 w-11 bg-emerald-400 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-xs border border-emerald-500/10 shrink-0">
              Box B
            </div>

            {/* Gap Bridge 2 Representation */}
            <AnimatePresence mode="popLayout">
              {simulatedPixelGap > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`bg-orange-50 border border-dashed border-orange-300 rounded-md flex items-center justify-center text-[8px] font-extrabold font-mono text-orange-600/80 pointer-events-none transition-all ${
                    direction === "row" ? "h-6 px-1 shrink-0" : "w-16 py-0.5 shrink-0"
                  }`}
                  style={direction === "row" ? { width: `${simulatedPixelGap}px` } : { height: `${simulatedPixelGap}px` }}
                >
                  <span className="truncate max-w-full text-center">
                    {simulatedPixelGap >= 12 ? `${simulatedPixelGap}px` : "•"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Box 3 */}
            <div className="h-8 w-11 bg-indigo-400 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-xs border border-indigo-500/10 shrink-0 font-medium">
              Box C
            </div>
          </motion.div>
        </div>
      </div>

      {/* Preset Selectors */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest pl-1 font-mono">
          Interactive Sizing Presets
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          {GAP_PRESETS.map((preset) => {
            const isSelected = value === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => handlePresetSelect(preset.value)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all duration-250 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-800 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.25)] font-bold"
                    : "bg-white border-stone-200 hover:border-emerald-200 hover:bg-emerald-50/20 text-stone-600 hover:text-stone-850"
                }`}
              >
                <span className="text-[10px] tracking-tight">{preset.label}</span>
                <span className={`text-[8px] font-mono mt-0.5 ${isSelected ? "text-emerald-500/90" : "text-stone-400"}`}>
                  {preset.value}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Fine-Tuner Section */}
      <div className="bg-white/80 border border-stone-200/70 p-3 rounded-2xl flex flex-col gap-2.5 shadow-2xs relative z-10">
        
        {/* Unit & Label Selection */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Settings2 size={11} className="text-stone-400" />
            <span className="text-[9.5px] font-bold text-stone-600 font-mono uppercase tracking-wide">
              Custom Fine-Tuner
            </span>
          </div>
          
          <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-205/60 shrink-0">
            {(["px", "rem", "%", "em"] as const).map((u) => {
              const activeUnit = u === unit;
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => {
                    setUnit(u);
                    // Retain value on change or map appropriately
                    if (numericValue !== undefined) {
                      handleNumericChange(numericValue, u);
                    }
                  }}
                  className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-bold leading-none cursor-pointer transition-all ${
                    activeUnit
                      ? "bg-white text-emerald-700 shadow-2xs font-extrabold border border-stone-200/20"
                      : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  {u}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ranger Slider & Text Input Grid Row */}
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={currentLimit.min}
            max={currentLimit.max}
            step={currentLimit.step}
            value={numericValue || 0}
            onChange={(e) => {
              handleNumericChange(parseFloat(e.target.value));
            }}
            className="flex-1 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-600 transition-colors"
          />
          
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="e.g. 15px"
              className="w-20 bg-stone-50 border border-stone-200/95 rounded-xl px-2 py-1 text-center text-[10px] focus:outline-none focus:border-emerald-500 font-mono text-stone-800 font-bold focus:bg-white"
            />
          </div>
        </div>

        {/* Clear Button */}
        {value && (
          <div className="flex justify-end pt-1 border-t border-stone-100">
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[9px] font-bold text-stone-400 hover:text-rose-500 transition-colors duration-150 flex items-center gap-1 cursor-pointer"
            >
              Clear Gap Settings
            </button>
          </div>
        )}
      </div>

      {/* Helpful Description Footer */}
      <div className="flex items-start gap-1.5 p-2 bg-emerald-50/30 border border-emerald-100/45 rounded-xl">
        <Info size={11} className="text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-[9px] leading-normal text-stone-550 font-medium">
          The <b>gap</b> property sets spacing (gutters) between columns and rows inside flexbox, CSS grid, and multi-column elements automatically.
        </p>
      </div>

    </div>
  );
}
