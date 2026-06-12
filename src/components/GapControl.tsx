import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MoveHorizontal, 
  MoveVertical, 
  LayoutGrid, 
  Info, 
  Sparkles, 
  Settings2,
  ChevronDown,
  Check
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
  { label: "0", value: "0px", pixelEquivalent: 0, badgeColor: "bg-stone-100 text-stone-500 border-stone-200" },
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
  // Text input status for the custom dropdown unit menu
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click-away
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUnitDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const unitLabels = {
    px: "Pixels (px)",
    rem: "Relative (rem)",
    em: "Relative (em)",
    "%": "Percent (%)"
  };

  return (
    <div className="flex flex-col gap-3 w-full text-left bg-gradient-to-b from-stone-50 to-stone-100 p-4 rounded-[22px] border border-stone-250/90 shadow-[inset_0_1.5px_0_0_white,0_1px_3px_rgba(0,0,0,0.02)] relative overflow-visible group">
      
      {/* Decorative top-right overlay glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-350/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header and current value badge */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-5 h-5 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center shrink-0">
            <LayoutGrid size={11} className="text-emerald-600" />
          </div>
          <label className="text-[10px] text-stone-600 font-extrabold uppercase tracking-widest font-mono truncate select-none">
            Element Gap Studio
          </label>
        </div>
        
        {value ? (
          <div className="flex items-center gap-1.5 animate-fade-in shrink-0">
            {activePreset && (
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border ${activePreset.badgeColor} hidden sm:inline`}>
                Preset: {activePreset.label.toUpperCase()}
              </span>
            )}
            <span className="text-[10px] font-mono font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-lg shadow-xs">
              {value}
            </span>
          </div>
        ) : (
          <span className="text-[9.5px] font-mono font-semibold text-stone-400 bg-stone-150/50 px-2 py-0.5 rounded-lg border border-stone-200/40 shrink-0">
            default
          </span>
        )}
      </div>

      {/* Spacing Sandbox Simulator Preview */}
      <div className="bg-white border border-stone-200/90 p-3 rounded-2xl shadow-xs overflow-hidden flex flex-col gap-2.5 relative z-10 transition-all duration-300 hover:border-emerald-250 hover:shadow-sm">
        
        {/* Sandbox Title & Flow Axis Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Sparkles size={11} className="text-amber-500 animate-pulse flex-shrink-0" />
            <span className="text-[10px] font-extrabold text-stone-700 font-sans tracking-tight truncate">
              Interactive Spacing Sandbox
            </span>
          </div>
          
          {/* Layout Direction Selector */}
          <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-200/50 shrink-0 self-start sm:self-auto">
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
              direction === "row" ? "flex-row" : "flex-col"
            }`}
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
                  className={`bg-orange-50 border border-dashed border-orange-300 rounded-md flex items-center justify-center text-[8px] font-extrabold font-mono text-orange-600/80 pointer-events-none transition-all overflow-hidden ${
                    direction === "row" ? "h-6 shrink-0" : "w-16 shrink-0"
                  }`}
                  style={direction === "row" ? { width: `${simulatedPixelGap}px` } : { height: `${simulatedPixelGap}px` }}
                >
                  <span className="truncate max-w-full text-center px-0.5">
                    {simulatedPixelGap >= 24 ? `${simulatedPixelGap}px` : simulatedPixelGap >= 12 ? "•" : ""}
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
                  className={`bg-orange-50 border border-dashed border-orange-300 rounded-md flex items-center justify-center text-[8px] font-extrabold font-mono text-orange-600/80 pointer-events-none transition-all overflow-hidden ${
                    direction === "row" ? "h-6 shrink-0" : "w-16 shrink-0"
                  }`}
                  style={direction === "row" ? { width: `${simulatedPixelGap}px` } : { height: `${simulatedPixelGap}px` }}
                >
                  <span className="truncate max-w-full text-center px-0.5">
                    {simulatedPixelGap >= 24 ? `${simulatedPixelGap}px` : simulatedPixelGap >= 12 ? "•" : ""}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Box 3 */}
            <div className="h-8 w-11 bg-indigo-400 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-xs border border-indigo-500/10 shrink-0 font-medium font-sans">
              Box C
            </div>
          </motion.div>
        </div>
      </div>

      {/* Preset Selectors */}
      <div className="flex flex-col gap-1.5 relative z-10">
        <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest pl-1 font-mono select-none">
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

      {/* Custom Fine-Tuner Section with Dropdown List selection */}
      <div className="bg-white/80 border border-stone-200/70 p-3.5 rounded-2xl flex flex-col gap-3 shadow-2xs relative z-20">
        
        {/* Unit Selection using a dynamic React custom select list / dropdown */}
        <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2 relative">
          <div className="flex items-center gap-1.5 min-w-0">
            <Settings2 size={12} className="text-stone-400 shrink-0" />
            <span className="text-[10px] font-bold text-stone-600 font-mono uppercase tracking-wider truncate">
              Custom Fine-Tuner
            </span>
          </div>

          {/* Unit Dropdown Trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
              className="flex items-center gap-1 bg-stone-100 border border-stone-200/60 hover:border-emerald-300 hover:bg-emerald-50/20 px-2 py-1 rounded-lg text-stone-700 font-mono text-[9px] font-extrabold transition-all duration-150 cursor-pointer shadow-3xs"
            >
              <span>{unit.toUpperCase()} Unit</span>
              <ChevronDown size={11} className={`text-stone-400 font-extrabold transition-transform duration-200 ${unitDropdownOpen ? "rotate-180 text-emerald-600" : ""}`} />
            </button>

            {/* Custom Interactive Dropdown Menu */}
            <AnimatePresence>
              {unitDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 mt-1.5 w-36 bg-white border border-stone-250/90 rounded-xl shadow-lg p-1 z-[999] flex flex-col gap-0.5"
                >
                  {(["px", "rem", "%", "em"] as const).map((u) => {
                    const isSelected = u === unit;
                    return (
                      <button
                        key={u}
                        type="button"
                        onClick={() => {
                          setUnit(u);
                          setUnitDropdownOpen(false);
                          if (numericValue !== undefined) {
                            handleNumericChange(numericValue, u);
                          }
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-[9.5px] font-bold flex items-center justify-between transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-emerald-500/10 text-emerald-800"
                            : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                        }`}
                      >
                        <span className="font-mono">{unitLabels[u]}</span>
                        {isSelected && <Check size={11} className="text-emerald-600 stroke-[3px]" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Range Slider Row */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center mb-0.5 select-none">
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest font-mono">
              Adjust Value
            </span>
            <span className="text-[9px] font-mono font-extrabold text-stone-500 bg-stone-50 border border-stone-200/55 px-1.5 py-0.5 rounded-md">
              Range: {currentLimit.min} to {currentLimit.max} {unit}
            </span>
          </div>
          <input
            type="range"
            min={currentLimit.min}
            max={currentLimit.max}
            step={currentLimit.step}
            value={numericValue || 0}
            onChange={(e) => {
              handleNumericChange(parseFloat(e.target.value));
            }}
            className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-600 transition-colors border border-stone-200/50"
          />
        </div>

        {/* Numeric Input & Adjustments Row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5">
            {/* Decrement Button */}
            <button
              type="button"
              onClick={() => {
                const newVal = Math.max(currentLimit.min, (numericValue || 0) - currentLimit.step);
                handleNumericChange(parseFloat(newVal.toFixed(3)));
              }}
              className="w-7 h-7 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-center text-xs font-bold text-stone-650 hover:bg-stone-100 active:bg-stone-250 transition-colors shadow-2xs cursor-pointer select-none"
            >
              -
            </button>

            {/* Main Input Display */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="0px"
                className="w-24 bg-stone-50 border border-emerald-500/10 focus:border-emerald-500 rounded-xl px-2 py-1.5 text-center text-[11px] focus:outline-none font-mono text-emerald-700 font-extrabold focus:bg-white shadow-2xs transition-all"
              />
            </div>

            {/* Increment Button */}
            <button
              type="button"
              onClick={() => {
                const newVal = Math.min(currentLimit.max, (numericValue || 0) + currentLimit.step);
                handleNumericChange(parseFloat(newVal.toFixed(3)));
              }}
              className="w-7 h-7 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-center text-xs font-bold text-stone-650 hover:bg-stone-100 active:bg-stone-250 transition-colors shadow-2xs cursor-pointer select-none"
            >
              +
            </button>
          </div>

          {/* Value actions like Clear */}
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[9.5px] font-bold text-stone-400 hover:text-red-500 transition-colors duration-150 flex items-center gap-1 cursor-pointer pl-1"
            >
              Reset
            </button>
          )}
        </div>

      </div>

      {/* Helpful Description Footer */}
      <div className="flex items-start gap-1.5 p-2 bg-emerald-50/30 border border-emerald-100/45 rounded-xl z-10 relative">
        <Info size={11} className="text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-[9px] leading-normal text-stone-550 font-medium select-none">
          The <b>gap</b> property sets spacing (gutters) between columns and rows inside flexbox, CSS grid, and multi-column elements automatically.
        </p>
      </div>

    </div>
  );
}
