import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { 
  Info, 
  HelpCircle, 
  Scale,
  Maximize2,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Activity,
  Lightbulb,
  Cpu,
  Bookmark,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface FlexBasisControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function FlexBasisControl({ value, onChange }: FlexBasisControlProps) {
  const [inputValue, setInputValue] = useState("");
  const [isGuidanceVisible, setIsGuidanceVisible] = useState(true);
  const [isGuidanceCollapsed, setIsGuidanceCollapsed] = useState(false); // default expanded because this is highly interesting!
  const [activeGuidanceTab, setActiveGuidanceTab] = useState<"gotchas" | "performance" | "specs">("gotchas");
  const [showTooltip, setShowTooltip] = useState(false);
  
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unitTriggerRef = useRef<HTMLButtonElement>(null);
  const [unitDropdownPos, setUnitDropdownPos] = useState<{ 
    top: number; 
    left: number; 
    width: number; 
    bottom?: number; 
    maxHeight?: number;
    placement: "top" | "bottom" 
  } | null>(null);

  // Click outside listener for units dropdown selection
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        unitTriggerRef.current &&
        !unitTriggerRef.current.contains(target) &&
        !((target as Element).closest('#flex-basis-unit-dropdown-menu'))
      ) {
        setUnitDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (unitDropdownOpen && unitTriggerRef.current) {
      const updatePosition = () => {
        if (!unitTriggerRef.current) return;
        const rect = unitTriggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownWidth = 144; // w-36
        const dropdownHeight = 240;
        
        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
          setUnitDropdownPos({
            placement: "top",
            bottom: window.innerHeight - rect.top + 4,
            left: rect.right - dropdownWidth,
            width: dropdownWidth,
            top: 0,
            maxHeight: spaceAbove - 16
          });
        } else {
          setUnitDropdownPos({
            placement: "bottom",
            top: rect.bottom + 4,
            left: rect.right - dropdownWidth,
            width: dropdownWidth,
            maxHeight: spaceBelow - 16
          });
        }
      };

      updatePosition();
      
      const handleScroll = (e: Event) => {
        if (e.target instanceof Element && e.target.closest('#flex-basis-unit-dropdown-menu')) return;
        updatePosition();
      };

      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [unitDropdownOpen]);

  const unitLabels: Record<string, string> = {
    "px": "Pixels (px)",
    "rem": "Relative (rem)",
    "%": "Percent (%)",
    "em": "Element (em)",
    "vw": "Viewport W (vw)",
    "vh": "Viewport H (vh)",
    "dvw": "Dynamic VW (dvw)",
    "dvh": "Dynamic VH (dvh)",
    "vmin": "Viewport Min (vmin)",
    "vmax": "Viewport Max (vmax)",
    "ch": "Character (ch)",
    "ex": "X-Height (ex)",
    "svw": "Small VW (svw)",
    "svh": "Small VH (svh)",
    "lvw": "Large VW (lvw)",
    "lvh": "Large VH (lvh)"
  };

  // Sync internal input value on external change
  useEffect(() => {
    setInputValue(value || "auto");
  }, [value]);

  const showNotification = (message: string, isSuccess: boolean = false) => {
    // Silent validation tracker - UI notifications removed per user constraint
  };

  const sanitizeAndEmit = (rawValue: string) => {
    let cleanVal = rawValue.trim();

    // 1. Detect if negative value was attempted
    // Ignore negative lookahead inside mathematical expressions calc(), clamp(), var()
    const isMathFunctionOrVar = 
      cleanVal.includes("calc") || 
      cleanVal.includes("clamp") || 
      cleanVal.includes("min") || 
      cleanVal.includes("max") || 
      cleanVal.includes("var") || 
      cleanVal.includes("--");

    if (cleanVal.includes("-") && !isMathFunctionOrVar) {
      showNotification("Negative sizing values are strictly invalid for flex-basis!");
      cleanVal = cleanVal.replace(/-/g, "");
    }

    // 2. Validate unitless non-zero number (e.g. "100" without unit)
    const isUnitlessNonZero = /^[1-9]\d*$/.test(cleanVal);
    if (isUnitlessNonZero) {
      showNotification("Warning: Unitless non-zero numbers are invalid in standard CSS. Appended 'px' recursively.");
      cleanVal = cleanVal + "px";
    }

    // 3. Prevent unitless IE11 Zero issue
    if (cleanVal === "0") {
      showNotification("Shorthand Optimization: Changed '0' to '0%' for modern, IE-safe browser parser compatibility.", true);
      cleanVal = "0%";
    }

    setInputValue(cleanVal);

    // If empty, reset to auto
    if (cleanVal === "") {
      onChange("auto");
      return;
    }

    // Pass value up
    onChange(cleanVal);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    sanitizeAndEmit(e.target.value);
  };

  const handlePresetSelect = (preset: string) => {
    setInputValue(preset);
    onChange(preset);
    showNotification(`Active flex-basis set to "${preset}"`, true);
  };

  // Helper to parse the current value for slider controls
  const parseValueForSlider = () => {
    const val = inputValue.trim().toLowerCase();
    
    // Check for keywords and custom math functions
    const isKeywordOrMath = 
      ["auto", "content", "max-content", "min-content", "fit-content", "initial", "inherit"].includes(val) ||
      val.includes("calc") || 
      val.includes("clamp") || 
      val.includes("var") || 
      val.includes("min(") || 
      val.includes("max(");

    if (isKeywordOrMath) {
      return { num: 100, unit: "px", isSpecial: true };
    }

    // Parse numeric + unit
    const match = val.match(/^([0-9.]+)\s*(px|%|em|rem|vw|vh)?$/);
    if (match) {
      const num = parseFloat(match[1]);
      const unit = match[2] || "px";
      return { num: isNaN(num) ? 0 : num, unit, isSpecial: false };
    }

    return { num: 0, unit: "px", isSpecial: false };
  };

  const { num, unit, isSpecial } = parseValueForSlider();

  // Change numerical value while preserving current unit
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slideNum = parseFloat(e.target.value);
    const targetUnit = isSpecial ? "px" : unit;
    const nextValue = `${slideNum}${targetUnit}`;
    setInputValue(nextValue);
    onChange(nextValue);
  };

  // Convert current number unit instantly
  const handleUnitSwap = (newUnit: string) => {
    if (isSpecial) {
      // If it is a keyword, convert it to a sensible numerical base first
      const defaultBases: Record<string, string> = {
        px: "150px",
        "%": "25%",
        rem: "10rem",
        em: "10em",
        vw: "20vw"
      };
      const val = defaultBases[newUnit] || "150px";
      setInputValue(val);
      onChange(val);
      showNotification(`Keyword converted to absolute length: ${val}`, true);
      return;
    }

    let parsedNum = num;
    // Sensible scaling conversions if swapping units
    if (unit === "px" && (newUnit === "rem" || newUnit === "em")) {
      parsedNum = Number((num / 16).toFixed(1));
    } else if ((unit === "rem" || unit === "em") && newUnit === "px") {
      parsedNum = Math.round(num * 16);
    } else if (unit === "px" && newUnit === "%") {
      parsedNum = Math.min(100, Math.max(0, Math.round((num / 600) * 100)));
    } else if (unit === "%" && newUnit === "px") {
      parsedNum = Math.round((num / 100) * 350);
    }

    const nextValue = `${parsedNum}${newUnit}`;
    setInputValue(nextValue);
    onChange(nextValue);
    showNotification(`Recalculated unit standard: ${nextValue}`, true);
  };

  // Slider bounds depending on the active unit
  const getSliderBounds = () => {
    if (unit === "%") {
      return { min: 0, max: 100, step: 5 };
    }
    if (unit === "rem" || unit === "em") {
      return { min: 0, max: 40, step: 0.5 };
    }
    if (unit === "vw" || unit === "vh") {
      return { min: 0, max: 100, step: 2 };
    }
    // Default to px or keyword-assumed bounds
    return { min: 0, max: 600, step: 10 };
  };

  const bounds = getSliderBounds();

  return (
    <div className="flex flex-col gap-3.5 w-full text-left relative overflow-visible group transition-all duration-200 z-10">
      
      <div className="flex flex-col gap-1.5 w-full relative">
        <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono flex justify-between select-none">
          <span>Initial Sizing Axis</span>
          <span className="text-[10px] font-mono font-bold text-stone-400 select-all normal-case">
            flex-basis
          </span>
        </label>

        <div className="w-full bg-white border border-stone-200/85 hover:border-stone-300 rounded-2xl p-3 flex items-center justify-between shadow-xs transition-all">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-stone-50 border border-stone-100 text-stone-500">
              <Scale size={14} className="text-stone-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-stone-800 leading-tight">
                Flex-Basis
              </span>
              <span className="text-[10px] text-stone-400 leading-none mt-0.5">
                Initial Baseline Main-Axis Geometry
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                Basis:
              </span>
              
              {/* Tooltip trigger icon */}
              <div 
                className="relative flex items-center justify-center cursor-help group p-0.5 rounded-md hover:bg-emerald-50 transition-colors"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                title="View flex-basis definition summary"
              >
                <Info size={11} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </div>
            </div>

            <div 
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="bg-white rounded-lg border border-slate-200 px-2 py-1 shadow-sm flex items-center relative w-[105px] focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-400 transition-all"
            >
              <input
                id="flex-basis-input"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                className="w-full bg-transparent text-center text-xs font-mono font-bold text-emerald-600 focus:outline-none"
                placeholder="auto"
                maxLength={45}
              />
            </div>

            {/* floating tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute z-50 top-full right-0 mt-2 w-64 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-xl p-3.5 select-none pointer-events-none"
                  style={{ transformOrigin: 'top right' }}
                >
                  <div className="absolute -top-1 right-8 w-2 h-2 bg-slate-900 border-l border-t border-slate-800 rotate-45" />
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">
                        Initial Main Sizing Axis
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[9px] px-1 py-0.5 rounded font-black">
                        {isSpecial ? "special" : unit}
                      </span>
                    </div>

                    <p className="text-[10px] leading-snug text-slate-200">
                      Dictates the initial "ideal" size of the element along the main axis before any free space allocation or shrinking occurs.
                    </p>

                    <div className="border-t border-slate-800 pt-2 mt-1 text-[8.5px] text-slate-400 flex flex-col gap-1">
                      <div>• <span className="text-emerald-400 font-bold">0%</span> ignores content, making equal columns!</div>
                      <div>• <span className="text-teal-400 font-bold">auto</span> respects your base width/height styles.</div>
                      <div>• <span className="text-amber-400 font-bold">intrinsic</span> keywords sizing dynamically on content.</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Interactive Quick-switch Unit Toolbar */}
      <div className="flex items-center justify-between bg-stone-50/50 p-2.5 rounded-xl border border-stone-150/40 relative overflow-visible">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-slate-400 tracking-wide uppercase select-none">Active Length Units</span>
          <span className="text-[8px] text-stone-450 font-medium">Convert value dynamically</span>
        </div>
        
        <div className="relative">
          <button
            ref={unitTriggerRef}
            type="button"
            onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
            className="flex items-center gap-1 bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/20 px-2 py-1.5 rounded-lg text-stone-755 font-mono text-[9px] font-extrabold transition-all duration-150 cursor-pointer shadow-3xs"
          >
            <span>{isSpecial ? "PX" : unit.toUpperCase()} Unit</span>
            <ChevronDown size={11} className={`text-stone-400 font-extrabold transition-transform duration-200 ${unitDropdownOpen ? "rotate-180 text-emerald-600" : ""}`} />
          </button>

          {typeof document !== "undefined" && createPortal(
            <AnimatePresence>
              {unitDropdownOpen && unitDropdownPos && (
                <motion.div
                  initial={{ opacity: 0, y: unitDropdownPos.placement === "top" ? 6 : -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="fixed bg-white border border-stone-200 rounded-2xl p-1 shadow-2xl z-[9999999] flex flex-col gap-0.5"
                  id="flex-basis-unit-dropdown-menu"
                  style={{
                    top: unitDropdownPos.placement === "bottom" ? unitDropdownPos.top : "auto",
                    bottom: unitDropdownPos.placement === "top" ? unitDropdownPos.bottom : "auto",
                    left: unitDropdownPos.left,
                    width: unitDropdownPos.width,
                    maxHeight: unitDropdownPos.maxHeight ? unitDropdownPos.maxHeight : "auto",
                  }}
                >
                  <div className="text-[8px] uppercase font-bold tracking-wider text-emerald-600 font-mono mb-1 mt-1 pl-2 select-none">
                    Select Unit
                  </div>
                  <div className="flex flex-col gap-0.5 max-h-[160px] overflow-y-auto custom-scrollbar">
                    {((Object.keys(unitLabels)) as readonly (keyof typeof unitLabels)[]).map((u) => {
                      const isCurrentUnit = !isSpecial && unit === u;
                      return (
                        <button
                          key={u}
                          type="button"
                          onClick={() => {
                            handleUnitSwap(u);
                            setUnitDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded-lg text-[9.5px] font-semibold flex items-center justify-between transition-all duration-150 cursor-pointer ${
                            isCurrentUnit
                              ? "bg-emerald-500/10 text-emerald-850 font-bold"
                              : "text-stone-600 hover:bg-stone-55 hover:text-stone-900"
                          }`}
                        >
                          <span className="font-mono">{unitLabels[u]}</span>
                          {isCurrentUnit && <Check size={11} className="text-emerald-600 stroke-[3px]" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
        </div>
      </div>

      {/* Range Slider for length adjustments */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[10px] font-bold text-slate-600 select-none">
          <span className="flex items-center gap-1">
            Dynamic Size Slider 
            <span className="bg-slate-100 px-1 py-0.5 text-[8.5px] font-mono text-slate-400 rounded">
              {isSpecial ? "locks to px" : unit}
            </span>
          </span>
          <span className="font-mono text-emerald-600 font-bold">
            {isSpecial ? `Keyword: ${inputValue}` : `${num}${unit}`}
          </span>
        </div>

        <input
          id="flex-basis-slider"
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={bounds.step}
          value={isSpecial ? 150 : num}
          onChange={handleSliderChange}
          className="w-full h-1.5 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />

        <div className="flex justify-between text-[8px] font-bold text-slate-400/80 px-1 font-mono select-none">
          <span>Min ({bounds.min})</span>
          <span>Mid ({bounds.max / 2})</span>
          <span>Max ({bounds.max})</span>
        </div>
      </div>

      {/* Structured Category Presets */}
      <div className="flex flex-col gap-3">
        {/* Core Layout Standards */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1">
            <Bookmark size={10} className="text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 select-none">
              Production Standards
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { label: "Symmetric (0%)", val: "0%", desc: "Equal expansion, no IE bug" },
              { label: "Auto (Default)", val: "auto", desc: "Respect content sizing" },
              { label: "Force Wrap (100%)", val: "100%", desc: "Force full line break" },
            ].map((preset) => {
              const isActive = inputValue.toLowerCase() === preset.val.toLowerCase();
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePresetSelect(preset.val)}
                  className={`py-1.5 px-1 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    isActive 
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-600 text-white shadow-sm shadow-emerald-500/10 active:scale-95" 
                      : "bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <span className="text-[9.5px] font-bold tracking-tight select-none leading-tight">{preset.label}</span>
                  <span className={`text-[7px] mt-0.5 leading-none select-none font-medium truncate w-full ${isActive ? "text-emerald-100" : "text-slate-400"}`}>
                    {preset.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Intrinsic Content Sizing */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1">
            <Sparkles size={10} className="text-teal-500 rotate-12" />
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 select-none">
              Intrinsic Content Keywords
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { label: "max-content", val: "max-content", desc: "Forbid wrap" },
              { label: "min-content", val: "min-content", desc: "Maximum wrap" },
              { label: "fit-content", val: "fit-content", desc: "Fluid inside bounds" },
            ].map((preset) => {
              const isActive = inputValue.toLowerCase() === preset.val.toLowerCase();
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePresetSelect(preset.val)}
                  className={`py-1.5 px-1 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    isActive 
                      ? "bg-gradient-to-br from-teal-500 to-emerald-600 border-teal-600 text-white shadow-sm shadow-teal-500/10 active:scale-95" 
                      : "bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <span className="text-[9.5px] font-mono font-bold tracking-tight select-none leading-tight">{preset.label}</span>
                  <span className={`text-[7px] mt-0.5 leading-none select-none font-medium truncate w-full ${isActive ? "text-teal-100" : "text-slate-400"}`}>
                    {preset.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Math & Variable Templates */}
        <div className="flex flex-col gap-1.5 pt-0.5">
          <div className="flex items-center gap-1">
            <Cpu size={10} className="text-amber-500" />
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 select-none">
              Math Functions & Design Systems
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: "calc(100% - 1rem)", val: "calc(100% - 1rem)", desc: "Row offset with gaps" },
              { label: "clamp(200px, 40%, 400px)", val: "clamp(200px, 40%, 400px)", desc: "Fluid clamps bounds" },
            ].map((preset) => {
              const isActive = inputValue === preset.val;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePresetSelect(preset.val)}
                  className={`py-1.5 px-2 rounded-xl border flex flex-col items-start text-left transition-all cursor-pointer ${
                    isActive 
                      ? "bg-slate-900 border-slate-900 text-amber-300 shadow-sm" 
                      : "bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <span className="text-[9px] font-mono font-bold tracking-tight select-none truncate w-full">{preset.label}</span>
                  <span className={`text-[7px] mt-0.5 leading-none select-none font-medium truncate w-full ${isActive ? "text-amber-400" : "text-slate-400"}`}>
                    {preset.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expanded Knowledge guidance deck */}
      <AnimatePresence>
        {isGuidanceVisible ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border border-emerald-50 rounded-xl p-3 w-full overflow-hidden"
          >
            {/* Header/Toggle & Close */}
            <div className="flex items-center justify-between pb-1.5 border-b border-emerald-100/65 mb-1.5">
              <button 
                type="button"
                onClick={() => setIsGuidanceCollapsed(!isGuidanceCollapsed)}
                className="flex items-center gap-1.5 focus:outline-none group text-left cursor-pointer"
              >
                <Info size={13} className="text-emerald-500" />
                <span className="text-[9.5px] font-extrabold text-emerald-900 uppercase tracking-widest group-hover:text-emerald-700 transition-colors">
                  Interactive CSS Spec Deck
                </span>
                {isGuidanceCollapsed ? (
                  <ChevronDown size={11} className="text-emerald-400" />
                ) : (
                  <ChevronUp size={11} className="text-emerald-400" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsGuidanceVisible(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/50 transition-all cursor-pointer"
                title="Dismiss deck"
              >
                <X size={12} />
              </button>
            </div>

            <AnimatePresence initial={false}>
              {!isGuidanceCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-col gap-2.5 overflow-hidden"
                >
                  {/* Tabs navigation */}
                  <div className="flex border-b border-slate-200/60 pb-1.5 gap-2 text-[8.5px] font-black uppercase tracking-wider text-slate-400">
                    <button
                      type="button"
                      onClick={() => setActiveGuidanceTab("gotchas")}
                      className={`pb-0.5 cursor-pointer border-b ${
                        activeGuidanceTab === "gotchas" 
                          ? "border-emerald-500 text-emerald-800" 
                          : "border-transparent hover:text-emerald-600"
                      }`}
                    >
                      Gotchas
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveGuidanceTab("performance")}
                      className={`pb-0.5 cursor-pointer border-b ${
                        activeGuidanceTab === "performance" 
                          ? "border-emerald-500 text-emerald-800" 
                          : "border-transparent hover:text-emerald-600"
                      }`}
                    >
                      Performance
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveGuidanceTab("specs")}
                      className={`pb-0.5 cursor-pointer border-b ${
                        activeGuidanceTab === "specs" 
                          ? "border-emerald-500 text-emerald-800" 
                          : "border-transparent hover:text-emerald-600"
                      }`}
                    >
                      Spec Table
                    </button>
                  </div>

                  {/* Tab 1: Gotchas */}
                  {activeGuidanceTab === "gotchas" && (
                    <div className="flex flex-col gap-2 text-[9.5px] leading-tight text-slate-600 animate-fadeIn">
                      <div className="bg-white/80 p-2 rounded-lg border border-emerald-50">
                        <div className="flex items-center gap-1 text-emerald-900 font-extrabold pb-0.5 uppercase tracking-wide">
                          <Lightbulb size={11} className="text-amber-500" />
                          <span>0% vs Auto Distinction</span>
                        </div>
                        <p className="text-slate-500 text-[9px]">
                          <strong>0%</strong> completely ignores content size inside columns, while <strong>auto</strong> respects inner content dimensions—causing elements with more text to start bigger.
                        </p>
                      </div>

                      <div className="bg-white/80 p-2 rounded-lg border border-emerald-50">
                        <div className="flex items-center gap-1 text-emerald-950 font-extrabold pb-0.5 uppercase tracking-wide">
                          <Activity size={11} className="text-emerald-500" />
                          <span>Flex Direction Influence</span>
                        </div>
                        <p className="text-slate-500 text-[9px]">
                          When parent is <code>column</code>, <code>flex-basis</code> coordinates the <strong>height</strong> along the main axis rather than width!
                        </p>
                      </div>

                      <div className="bg-white/80 p-2 rounded-lg border border-emerald-50">
                        <div className="flex items-center gap-1 text-emerald-950 font-extrabold pb-0.5 uppercase tracking-wide font-medium">
                          <span>Max / Min Constraints</span>
                        </div>
                        <p className="text-slate-500 text-[9px]">
                          <code>max-width</code> or <code>max-height</code> acts as a hard limit that constrains whatever <code>flex-basis</code> calculates.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Performance */}
                  {activeGuidanceTab === "performance" && (
                    <div className="flex flex-col gap-2 text-[9.5px] leading-tight text-slate-600 animate-fadeIn">
                      <div className="bg-rose-50/40 border border-rose-100 rounded-lg p-2 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 font-bold text-rose-850 uppercase tracking-tight">
                            <Activity size={12} className="text-rose-500" />
                            <span>Browser Reflow Cost</span>
                          </div>
                          <span className="bg-rose-500 text-white text-[7.5px] font-black uppercase px-1 rounded-sm">
                            Expensive
                          </span>
                        </div>
                        <p className="text-slate-500 text-[9px]">
                          Modifying <strong>flex-basis</strong> dynamically forces the browser to calculate layout positions (Reflow) for the item AND its siblings in the document tree.
                        </p>
                      </div>

                      <div className="bg-white/80 p-2 rounded-lg border border-teal-100 flex items-center gap-2">
                        <Cpu size={12} className="text-teal-600 shrink-0" />
                        <div>
                          <span className="font-bold text-teal-900 block uppercase text-[8.5px]">Performance Recommendation</span>
                          <p className="text-slate-500 text-[9px] mt-0.5">
                            Avoid transitions/keyframes animating <code>flex-basis</code>. Instead, animate <code>transform: scale()</code> on GPU threads for silky smooth 60fps animations.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Detailed Spec cheatsheet */}
                  {activeGuidanceTab === "specs" && (
                    <div className="flex flex-col gap-1.5 text-[9px] font-mono text-slate-600 animate-fadeIn overflow-x-auto">
                      <table className="min-w-full text-left divide-y divide-emerald-100/60">
                        <thead>
                          <tr className="text-[8px] font-bold text-emerald-950 uppercase tracking-wider">
                            <th className="pb-1">Spec Item</th>
                            <th className="pb-1 pl-2">Value / Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 bg-white/40 rounded-lg">
                          <tr>
                            <td className="py-1 font-bold text-slate-700">Initial State</td>
                            <td className="py-1 pl-2 font-bold text-emerald-600">auto</td>
                          </tr>
                          <tr>
                            <td className="py-1 font-bold text-slate-700">Inherited</td>
                            <td className="py-1 pl-2 text-rose-500 font-extrabold pb-0.5">No</td>
                          </tr>
                          <tr>
                            <td className="py-1 font-bold text-slate-700">Animatable</td>
                            <td className="py-1 pl-2 text-emerald-605">Yes (lengths/%)</td>
                          </tr>
                          <tr>
                            <td className="py-1 font-bold text-slate-700">Reflow Trigger</td>
                            <td className="py-1 pl-2 text-rose-600 font-bold">Yes (High-Cost)</td>
                          </tr>
                          <tr>
                            <td className="py-1 font-bold text-slate-700">IE11 Symmetrical</td>
                            <td className="py-1 pl-2 font-sans font-bold text-slate-500">Shorthand '0%'</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex justify-end mt-0.5">
            <button
              type="button"
              onClick={() => setIsGuidanceVisible(true)}
              className="text-[9px] font-black uppercase tracking-wider text-emerald-500 hover:text-emerald-700 bg-emerald-50/60 hover:bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100/40 transition-all cursor-pointer"
            >
              Open Interactive CSS Spec Deck
            </button>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
