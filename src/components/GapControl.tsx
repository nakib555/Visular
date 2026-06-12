import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutGrid, 
  Info, 
  Settings2,
  ChevronDown,
  Check,
  RotateCcw,
  MoveHorizontal,
  MoveVertical,
  Sparkles,
  Sliders
} from "lucide-react";

interface GapControlProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  propertyName?: string;
}

interface GapOption {
  value: string;
  label: string;
  description: string;
}

const GAP_PRESETS: GapOption[] = [
  { value: "0px", label: "None (0px)", description: "Remove separation space completely" },
  { value: "4px", label: "Extra Small (4px)", description: "Tiniest spacing for compact badges or labels" },
  { value: "8px", label: "Small (8px)", description: "Tight structural separation between inline items" },
  { value: "12px", label: "Medium (12px)", description: "Default balanced grid gutter setting" },
  { value: "16px", label: "Large (16px)", description: "Comfortable spacious separation for content sections" },
  { value: "24px", label: "Extra Large (24px)", description: "Wide layout division gap for distinct visual components" },
  { value: "32px", label: "Double Extra Large (32px)", description: "Very expansive separation for majestic sections" },
  { value: "48px", label: "Triple Extra Large (48px)", description: "Grand division spaces built for major headers" },
];

export function GapControl({ value, onChange, label = "Gap", propertyName = "gap" }: GapControlProps) {
  // Active custom unit selection
  const [unit, setUnit] = useState<"px" | "rem" | "%" | "em">("px");
  // Text input status for the custom dropdown unit menu
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  // Main dropdown menu status
  const [isOpen, setIsOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [dropdownPos, setDropdownPos] = useState<{ 
    top: number; 
    left: number; 
    width: number; 
    bottom?: number; 
    maxHeight?: number;
    placement: "top" | "bottom" 
  } | null>(null);

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

  // Handle click outside of menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isInsideContainer = containerRef.current?.contains(target);
      const isInsideMenu = (target as Element).closest("#gap-dropdown-portal-menu");
      
      if (!isInsideContainer && !isInsideMenu) {
        setIsOpen(false);
      }
      
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setUnitDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update layout position of our custom Portal dropdown relative to trigger
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const updatePosition = () => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 360; // Approximate custom UI list height
        
        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
          setDropdownPos({
            placement: "top",
            bottom: window.innerHeight - rect.top + 8,
            left: rect.left,
            width: rect.width,
            top: 0,
            maxHeight: spaceAbove - 16
          });
        } else {
          setDropdownPos({
            placement: "bottom",
            top: rect.bottom + 8,
            left: rect.left,
            width: rect.width,
            maxHeight: spaceBelow - 16
          });
        }
      };

      updatePosition();

      const handleScroll = (e: Event) => {
        if (e.target instanceof Element && e.target.closest("#gap-dropdown-portal-menu")) return;
        updatePosition();
      };

      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen]);

  // Helper to update value with selected unit
  const handleNumericChange = (num: number, targetUnit = unit) => {
    const formatted = num === 0 ? "0px" : `${num}${targetUnit}`;
    onChange(formatted);
  };

  // Determine matching preset
  const activePreset = useMemo(() => {
    if (!value) return null;
    return GAP_PRESETS.find(p => p.value === value) || null;
  }, [value]);

  const isCustomMode = useMemo(() => {
    return value ? !activePreset : false;
  }, [value, activePreset]);

  // Customizable state bounds for range sliders depending on selected unit
  const [customLimits, setCustomLimits] = useState<Record<"px" | "rem" | "%" | "em", { min: number; max: number }>>({
    px: { min: 0, max: 80 },
    rem: { min: 0, max: 6 },
    "%": { min: 0, max: 20 },
    em: { min: 0, max: 6 },
  });

  const [showLimitSettings, setShowLimitSettings] = useState(false);

  const currentLimit = useMemo(() => {
    const lim = customLimits[unit];
    return {
      min: lim.min,
      max: lim.max,
      step: unit === "px" ? 1 : unit === "%" ? 0.5 : 0.125,
      label: unit === "px" ? "Pixels" : unit === "rem" ? "Relative (rem)" : unit === "%" ? "Percentage" : "Relative (em)"
    };
  }, [customLimits, unit]);

  const unitLabels = {
    px: "Pixels (px)",
    rem: "Relative (rem)",
    em: "Relative (em)",
    "%": "Percent (%)"
  };

  // Aesthetics branding dictionary depending on propertyName
  const theme = useMemo(() => {
    switch (propertyName) {
      case "row-gap":
        return {
          colorClass: "text-indigo-600",
          bgClass: "bg-indigo-50 border-indigo-200 text-indigo-800",
          focusRing: "border-indigo-400 ring-indigo-500/10",
          optionBgClass: "bg-indigo-50/40 border-indigo-200",
          accentColor: "indigo",
          barColor: "bg-indigo-500",
          indicatorColor: "border-indigo-400",
          icon: MoveVertical,
        };
      case "column-gap":
        return {
          colorClass: "text-cyan-600",
          bgClass: "bg-cyan-50 border-cyan-200 text-cyan-800",
          focusRing: "border-cyan-400 ring-cyan-500/10",
          optionBgClass: "bg-cyan-50/40 border-cyan-200",
          accentColor: "cyan",
          barColor: "bg-cyan-500",
          indicatorColor: "border-cyan-400",
          icon: MoveHorizontal,
        };
      default:
        return {
          colorClass: "text-emerald-600",
          bgClass: "bg-emerald-50 border-emerald-200 text-emerald-800",
          focusRing: "border-emerald-400 ring-emerald-500/10",
          optionBgClass: "bg-emerald-50/40 border-emerald-200",
          accentColor: "emerald",
          barColor: "bg-emerald-500",
          indicatorColor: "border-emerald-400",
          icon: LayoutGrid,
        };
    }
  }, [propertyName]);

  // Helper component to render standard visual block representations
  const renderVisualBadge = (val: string, isBig = false) => {
    if (!val) {
      return (
        <div className={`flex items-center justify-center ${isBig ? "w-12 h-10" : "w-9 h-7"} rounded-lg border border-dashed border-stone-300 bg-stone-50 text-[8px] font-mono font-bold text-stone-400`}>
          DEF
        </div>
      );
    }

    const num = parseFloat(val) || 0;
    const pxEquivalent = val.endsWith("rem") ? num * 16 : val.endsWith("em") ? num * 16 : val.endsWith("%") ? num * 0.5 : num;
    const scaleFactor = isBig ? 0.8 : 0.45;
    const gapSize = Math.max(0, Math.min(pxEquivalent * scaleFactor, isBig ? 24 : 12));

    if (propertyName === "row-gap") {
      return (
        <div className={`flex flex-col items-center justify-center ${isBig ? "w-12 h-10" : "w-9 h-7"} rounded-lg bg-stone-50 border border-stone-200/50 p-1`}>
          <div className="flex flex-col items-center justify-center w-full h-full gap-0.5">
            <div className={`w-full h-1.5 ${theme.barColor} rounded-sm`} />
            <div style={{ height: `${gapSize}px` }} className={`w-full transition-all border-l border-dashed ${theme.indicatorColor} flex items-center justify-center`} />
            <div className={`w-full h-1.5 ${theme.barColor} rounded-sm`} />
          </div>
        </div>
      );
    }

    if (propertyName === "column-gap") {
      return (
        <div className={`flex items-center justify-center ${isBig ? "w-12 h-10" : "w-9 h-7"} rounded-lg bg-stone-50 border border-stone-200/50 p-1`}>
          <div className="flex items-center justify-center w-full h-full gap-0.5">
            <div className={`w-1.5 h-full ${theme.barColor} rounded-sm`} />
            <div style={{ width: `${gapSize}px` }} className={`h-full transition-all border-t border-dashed ${theme.indicatorColor} flex items-center justify-center`} />
            <div className={`w-1.5 h-full ${theme.barColor} rounded-sm`} />
          </div>
        </div>
      );
    }

    // Default 'gap' (matrix representation)
    const gridGap = Math.max(0, Math.min(pxEquivalent * (isBig ? 0.38 : 0.22), isBig ? 14 : 7));
    return (
      <div className={`flex items-center justify-center ${isBig ? "w-12 h-10" : "w-9 h-7"} rounded-lg bg-stone-50 border border-stone-200/50 p-1`}>
        <div className="grid grid-cols-2 h-full w-full justify-center items-center" style={{ gap: `${gridGap}px` }}>
          <div className={`w-full h-full min-h-[3px] ${theme.barColor} rounded-[2px]`} />
          <div className={`w-full h-full min-h-[3px] ${theme.barColor} rounded-[2px]`} />
          <div className={`w-full h-full min-h-[3px] ${theme.barColor} rounded-[2px]`} />
          <div className={`w-full h-full min-h-[3px] ${theme.barColor} rounded-[2px]`} />
        </div>
      </div>
    );
  };

  const handleSelect = (val: string) => {
    if (val === "custom") {
      // default starting custom val if none set
      if (!value) {
        onChange("16px");
      }
    } else {
      onChange(val);
    }
    setIsOpen(false);
  };

  const PropertyIcon = theme.icon;

  return (
    <div className="flex flex-col gap-2 w-full text-left bg-[#f8f8f8] p-3 rounded-[24px] border-0 relative overflow-visible" ref={containerRef}>
      {/* Label and Badge on Trigger level */}
      <div className="flex items-center justify-between pl-1">
        <label className="text-[10px] text-stone-500 font-extrabold uppercase tracking-widest font-mono flex items-center gap-1">
          <span>{label} Mode</span>
        </label>
        <span className="text-[10px] font-mono font-extrabold text-stone-400 select-all">
          {propertyName}: {value || "default"}
        </span>
      </div>

      {/* Structured Dropdown Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border ${
          isOpen ? theme.focusRing : "border-stone-200 hover:border-stone-300"
        } rounded-xl p-2.5 flex items-center justify-between shadow-xs transition-all cursor-pointer text-left focus:outline-none`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`flex items-center justify-center w-7 h-7 rounded-lg bg-stone-50 border border-stone-100 shrink-0`}>
            <PropertyIcon size={14} className={theme.colorClass} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-stone-800 leading-tight truncate">
              {activePreset ? activePreset.label : isCustomMode ? "Custom Size" : "Default / Empty"}
            </span>
            <span className="text-[9.5px] text-stone-400 font-mono leading-none mt-0.5">
              {propertyName}: {value || "unset"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Badge Display on the right of trigger */}
          {renderVisualBadge(value)}
          <ChevronDown
            size={12}
            className={`text-stone-400 transition-transform duration-250 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Structured Dropdown Overlay */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && dropdownPos && (
            <motion.div
              initial={{ opacity: 0, y: dropdownPos.placement === "top" ? 6 : -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.1 } }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="fixed bg-white border border-stone-200/90 rounded-[24px] p-2.5 shadow-2xl z-[999999] flex flex-col"
              id="gap-dropdown-portal-menu"
              style={{
                top: dropdownPos.placement === "bottom" ? dropdownPos.top : "auto",
                bottom: dropdownPos.placement === "top" ? dropdownPos.bottom : "auto",
                left: dropdownPos.left,
                width: dropdownPos.width,
                maxHeight: dropdownPos.maxHeight ? dropdownPos.maxHeight : "auto",
              }}
            >
              <div className="text-[9px] uppercase font-extrabold tracking-wider text-stone-400 font-mono mb-2 flex items-center gap-1 pl-1.5 flex-shrink-0">
                <Sparkles size={8} className="text-stone-500" />
                <span>Select {label} Gutter</span>
              </div>

              {/* List layout matching display's layout structure */}
              <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1 pr-0.5 pb-1 select-none">
                {GAP_PRESETS.map((opt) => {
                  const isSelected = value === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`text-left p-2 rounded-xl border transition-all duration-150 cursor-pointer flex flex-row items-center gap-2.5 ${
                        isSelected
                          ? theme.optionBgClass
                          : "bg-stone-50/40 hover:bg-stone-150/40 border-stone-200/60 hover:border-stone-300"
                      }`}
                    >
                      <div className="flex-1 flex flex-col min-w-0">
                        <span className={`text-[10.5px] font-extrabold truncate ${isSelected ? "text-stone-900" : "text-stone-700"}`}>
                          {opt.label}
                        </span>
                        <span className="text-[9px] text-stone-400 truncate leading-snug">
                          {opt.description}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {renderVisualBadge(opt.value)}
                        {isSelected && <Check size={11} className={`${theme.colorClass} stroke-[2.5px]`} />}
                      </div>
                    </button>
                  );
                })}

                {/* Custom Value Selection Option */}
                <button
                  type="button"
                  onClick={() => handleSelect("custom")}
                  className={`text-left p-2 rounded-xl border transition-all duration-150 cursor-pointer flex flex-row items-center gap-2.5 ${
                    isCustomMode
                      ? theme.optionBgClass
                      : "bg-stone-50/40 hover:bg-stone-150/40 border-stone-200/60 hover:border-stone-300"
                  }`}
                >
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className={`text-[10.5px] font-extrabold ${isCustomMode ? "text-stone-900" : "text-stone-700"}`}>
                      Custom Space...
                    </span>
                    <span className="text-[9px] text-stone-400 leading-snug">
                      Fine-tune individual values, slide limits, scale units
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center justify-center w-9 h-7 rounded-lg bg-stone-50 border border-stone-200/50">
                      <Sliders size={12} className={isCustomMode ? theme.colorClass : "text-stone-400"} />
                    </div>
                    {isCustomMode && <Check size={11} className={`${theme.colorClass} stroke-[2.5px]`} />}
                  </div>
                </button>
              </div>

              {/* Dropdown bottom visual info */}
              <div className="border-t border-stone-100 mt-1.5 pt-1.5 text-center flex-shrink-0 flex items-center justify-center gap-1">
                <Info size={9} className="text-stone-400 shrink-0" />
                <span className="text-[8.5px] text-stone-400 font-mono">
                  Presets apply strict values, Custom unlocks full sliders
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* COLLAPSIBLE FINE-TUNER DRAWER (Pops open ONLY if Custom is select or active) */}
      <AnimatePresence>
        {(isCustomMode || !activePreset && value) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-1 bg-white border border-stone-200 p-3 rounded-2xl flex flex-col gap-2.5 shadow-xs relative z-10">
              
              {/* Unit Selection and Dropdown */}
              <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-1.5 relative">
                <div className="flex items-center gap-1 min-w-0">
                  <Settings2 size={11} className="text-stone-400 shrink-0" />
                  <span className="text-[9px] font-extrabold text-stone-500 font-mono uppercase tracking-wider truncate">
                    Custom Fine-Tuner Settings
                  </span>
                </div>

                {/* Sub Unit Dropdown Trigger */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
                    className={`flex items-center gap-1 bg-stone-50 border border-stone-200 hover:border-${theme.accentColor}-300 hover:bg-stone-100 px-1.5 py-0.5 rounded-md text-stone-600 font-mono text-[8.5px] font-extrabold transition-all duration-150 cursor-pointer`}
                  >
                    <span>{unit.toUpperCase()} Unit</span>
                    <ChevronDown size={9} className={`text-stone-400 transition-transform duration-200 ${unitDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {unitDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 mt-1 w-32 bg-white border border-stone-200 rounded-lg shadow-md p-0.5 z-[999] flex flex-col"
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
                              className={`w-full text-left px-2 py-1 rounded-md text-[9px] font-bold flex items-center justify-between transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-stone-50 text-stone-900"
                                  : "text-stone-500 hover:bg-stone-50/55 hover:text-stone-800"
                              }`}
                            >
                              <span className="font-mono">{unitLabels[u]}</span>
                              {isSelected && <Check size={10} className={`${theme.colorClass} stroke-[3px]`} />}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Range Slider Container */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center select-none">
                  <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono">
                    Adjust Value
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowLimitSettings(!showLimitSettings)}
                    className={`text-[8px] font-mono font-extrabold flex items-center gap-1 px-1.5 py-0.5 rounded-md border transition-all cursor-pointer ${
                      showLimitSettings 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                        : "bg-stone-50 border-stone-200/60 text-stone-500 hover:bg-stone-100"
                    }`}
                  >
                    Limits: {currentLimit.min} to {currentLimit.max} {unit}
                  </button>
                </div>

                {/* Bounds Config Drawer */}
                <AnimatePresence>
                  {showLimitSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden mb-1"
                    >
                      <div className="bg-stone-50 border border-stone-200/65 p-2 rounded-xl flex flex-col gap-1.5 mb-1.5 select-none text-left">
                        <div className="flex items-center justify-between px-0.5">
                          <span className="text-[7.5px] font-extrabold text-stone-500 uppercase tracking-wider font-mono">
                            Set Bounds ({unit})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const defaults = {
                                px: { min: 0, max: 80 },
                                rem: { min: 0, max: 6 },
                                "%": { min: 0, max: 20 },
                                em: { min: 0, max: 6 },
                              };
                              setCustomLimits(prev => ({
                                ...prev,
                                [unit]: defaults[unit]
                              }));
                            }}
                            className="text-[7.5px] font-extrabold text-stone-400 hover:text-red-500 transition-all cursor-pointer"
                          >
                            Default
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[7px] font-bold text-stone-400 uppercase tracking-wider font-mono pl-0.5">
                              Min Limit
                            </span>
                            <input
                              type="number"
                              value={customLimits[unit].min}
                              step={currentLimit.step}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val)) {
                                  setCustomLimits(prev => ({
                                    ...prev,
                                    [unit]: { ...prev[unit], min: val }
                                  }));
                                }
                              }}
                              className="w-full bg-white border border-stone-200 rounded-lg px-2 py-0.5 text-center font-mono text-[9px] text-stone-700 font-bold focus:outline-none"
                            />
                          </div>

                          <div className="flex flex-col gap-0.5">
                            <span className="text-[7px] font-bold text-stone-400 uppercase tracking-wider font-mono pl-0.5">
                              Max Limit
                            </span>
                            <input
                              type="number"
                              value={customLimits[unit].max}
                              step={currentLimit.step}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val)) {
                                  setCustomLimits(prev => ({
                                    ...prev,
                                    [unit]: { ...prev[unit], max: val }
                                  }));
                                }
                              }}
                              className="w-full bg-white border border-stone-200 rounded-lg px-2 py-0.5 text-center font-mono text-[9px] text-stone-700 font-bold focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <input
                  type="range"
                  min={currentLimit.min}
                  max={currentLimit.max}
                  step={currentLimit.step}
                  value={numericValue || 0}
                  onChange={(e) => {
                    handleNumericChange(parseFloat(e.target.value));
                  }}
                  className={`w-full h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-${theme.accentColor}-500 hover:accent-${theme.accentColor}-600 transition-colors border border-stone-200/50`}
                />
              </div>

              {/* Numeric Inputs and Increment/Decrement Controls */}
              <div className="flex items-center justify-between gap-2.5 pt-0.5">
                <div className="flex items-center gap-1 shrink-0">
                  {/* Decrement */}
                  <button
                    type="button"
                    onClick={() => {
                      const newVal = Math.max(currentLimit.min, (numericValue || 0) - currentLimit.step);
                      handleNumericChange(parseFloat(newVal.toFixed(3)));
                    }}
                    className="w-6 h-6 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center text-xs font-extrabold text-stone-600 hover:bg-stone-100 active:bg-stone-200 transition-colors shadow-3xs cursor-pointer select-none"
                  >
                    -
                  </button>

                  {/* Text Input Display */}
                  <input
                    type="text"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="0px"
                    className="w-[64px] bg-stone-50 border border-stone-200 focus:border-stone-400 rounded-lg py-1 text-center text-[10px] focus:outline-none font-mono text-stone-800 font-extrabold focus:bg-white shadow-3xs transition-all"
                  />

                  {/* Increment */}
                  <button
                    type="button"
                    onClick={() => {
                      const newVal = Math.min(currentLimit.max, (numericValue || 0) + currentLimit.step);
                      handleNumericChange(parseFloat(newVal.toFixed(3)));
                    }}
                    className="w-6 h-6 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center text-xs font-extrabold text-stone-600 hover:bg-stone-100 active:bg-stone-200 transition-colors shadow-3xs cursor-pointer select-none"
                  >
                    +
                  </button>
                </div>

                {/* Quick actions like reset */}
                <button
                  type="button"
                  onClick={() => onChange("")}
                  title="Reset property"
                  className="w-6 h-6 bg-stone-50 hover:bg-red-50 hover:text-red-650 text-stone-400 border border-stone-200 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer shadow-3xs"
                >
                  <RotateCcw size={10} className="stroke-[2.5]" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Hint card */}
      <div className="flex items-start gap-1 p-1.5 bg-white/40 border border-stone-200/50 rounded-xl">
        <Info size={10} className="text-stone-400 shrink-0 mt-0.5" />
        <p className="text-[8.5px] leading-normal text-stone-500 font-medium select-none">
          Sets spacings (gutters) for <b>{propertyName}</b>. Interactive visual above displays layouts instantly.
        </p>
      </div>
    </div>
  );
}
