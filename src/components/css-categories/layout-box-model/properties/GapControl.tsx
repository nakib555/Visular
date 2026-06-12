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
  Grid,
  GripHorizontal,
  SplitSquareHorizontal
} from "lucide-react";

interface GapControlProps {
  value: string;
  onChange: (val: string) => void;
  rowGapValue?: string;
  columnGapValue?: string;
  onRowGapChange?: (val: string) => void;
  onColumnGapChange?: (val: string) => void;
}

interface GapPreset {
  label: string;
  value: string;
  pixelEquivalent: number; // For reference
  badgeColor: string;
}

const GAP_PRESETS: GapPreset[] = [
  { label: "0", value: "0px", pixelEquivalent: 0, badgeColor: "bg-stone-100 text-stone-500 border-stone-200" },
  { label: "0.5", value: "2px", pixelEquivalent: 2, badgeColor: "bg-stone-50 text-stone-500 border-stone-100" },
  { label: "1", value: "4px", pixelEquivalent: 4, badgeColor: "bg-teal-50 text-teal-600 border-teal-100" },
  { label: "1.5", value: "6px", pixelEquivalent: 6, badgeColor: "bg-teal-50 text-teal-600 border-teal-100" },
  { label: "2", value: "8px", pixelEquivalent: 8, badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { label: "2.5", value: "10px", pixelEquivalent: 10, badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { label: "3", value: "12px", pixelEquivalent: 12, badgeColor: "bg-green-50 text-green-600 border-green-100" },
  { label: "4", value: "16px", pixelEquivalent: 16, badgeColor: "bg-cyan-50 text-cyan-600 border-cyan-100" },
  { label: "5", value: "20px", pixelEquivalent: 20, badgeColor: "bg-sky-50 text-sky-600 border-sky-100" },
  { label: "6", value: "24px", pixelEquivalent: 24, badgeColor: "bg-blue-50 text-blue-600 border-blue-100" },
  { label: "8", value: "32px", pixelEquivalent: 32, badgeColor: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { label: "10", value: "40px", pixelEquivalent: 40, badgeColor: "bg-violet-50 text-violet-600 border-violet-100" },
  { label: "12", value: "48px", pixelEquivalent: 48, badgeColor: "bg-purple-50 text-purple-600 border-purple-100" },
  { label: "16", value: "64px", pixelEquivalent: 64, badgeColor: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100" },
  { label: "20", value: "80px", pixelEquivalent: 80, badgeColor: "bg-pink-50 text-pink-600 border-pink-100" },
  { label: "24", value: "96px", pixelEquivalent: 96, badgeColor: "bg-rose-50 text-rose-600 border-rose-100" },
];

interface GapPropertyOption {
  value: "gap" | "row-gap" | "column-gap";
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  badgeBg: string;
  badgeContent: React.ReactNode;
}

const gapPropertyOptions: GapPropertyOption[] = [
  {
    value: "gap",
    label: "Unified Gap (gap)",
    description: "Applies equal spacing to rows and columns together",
    icon: Grid,
    badgeBg: "bg-emerald-50/90 border border-emerald-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center",
    badgeContent: (
      <div className="grid grid-cols-2 gap-[2px]">
        <div className="w-[6px] h-[6px] bg-emerald-500 rounded-[1px]" />
        <div className="w-[6px] h-[6px] bg-emerald-500 rounded-[1px]" />
        <div className="w-[6px] h-[6px] bg-emerald-500 rounded-[1px]" />
        <div className="w-[6px] h-[6px] bg-emerald-500 rounded-[1px]" />
      </div>
    )
  },
  {
    value: "row-gap",
    label: "Row Spacing (row-gap)",
    description: "Sets spacing vertically between blocks or grid rows",
    icon: GripHorizontal,
    badgeBg: "bg-rose-50/90 border border-rose-100/70 p-1 rounded-lg w-9 h-7 flex flex-col items-center justify-center gap-[2px]",
    badgeContent: (
      <div className="flex flex-col gap-[3px] w-full px-1 justify-center">
        <div className="w-full h-[3px] bg-rose-500 rounded-[0.5px]" />
        <div className="w-full h-[3px] bg-rose-500 rounded-[0.5px]" />
      </div>
    )
  },
  {
    value: "column-gap",
    label: "Column Spacing (column-gap)",
    description: "Sets spacing horizontally between layout columns",
    icon: SplitSquareHorizontal,
    badgeBg: "bg-indigo-50/90 border border-indigo-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center gap-[2px]",
    badgeContent: (
      <div className="flex gap-[3px] h-3 items-center">
        <div className="w-1.5 h-full bg-indigo-500 rounded-[0.5px]" />
        <div className="w-1.5 h-full bg-indigo-500 rounded-[0.5px]" />
      </div>
    )
  }
];

export function GapControl({ 
  value, 
  onChange,
  rowGapValue = "",
  columnGapValue = "",
  onRowGapChange,
  onColumnGapChange
}: GapControlProps) {
  // Current active property being configured
  const [activeProperty, setActiveProperty] = useState<"gap" | "row-gap" | "column-gap">("gap");
  // Active custom unit selection
  const [unit, setUnit] = useState<"px" | "rem" | "%" | "em">("px");
  // Text input status for the custom dropdown unit menu
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  // Property dropdown status
  const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const propertyDropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const presetsScrollRef = useRef<HTMLDivElement>(null);

  const [dropdownPos, setDropdownPos] = useState<{ 
    top: number; 
    left: number; 
    width: number; 
    bottom?: number; 
    maxHeight?: number;
    placement: "top" | "bottom" 
  } | null>(null);

  // Resolve current property value & update function
  const currentPropertyValue = useMemo(() => {
    if (activeProperty === "row-gap") return rowGapValue;
    if (activeProperty === "column-gap") return columnGapValue;
    return value;
  }, [activeProperty, value, rowGapValue, columnGapValue]);

  const handleCurrentPropertyChange = (val: string) => {
    if (activeProperty === "row-gap") {
      onRowGapChange?.(val);
    } else if (activeProperty === "column-gap") {
      onColumnGapChange?.(val);
    } else {
      onChange(val);
    }
  };

  // Close dropdowns on click-away
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setUnitDropdownOpen(false);
      }
      if (
        propertyDropdownTriggerRef.current && 
        !propertyDropdownTriggerRef.current.contains(target) && 
        !((target as Element).closest('#property-dropdown-menu'))
      ) {
        setPropertyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update dropdown portal position
  useEffect(() => {
    if (propertyDropdownOpen && propertyDropdownTriggerRef.current) {
      const updatePosition = () => {
        if (!propertyDropdownTriggerRef.current) return;
        const rect = propertyDropdownTriggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 265; // approximate menu height
        
        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
          // Render above
          setDropdownPos({
            placement: "top",
            bottom: window.innerHeight - rect.top + 8,
            left: rect.left,
            width: rect.width,
            top: 0,
            maxHeight: spaceAbove - 16
          });
        } else {
          // Render below
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
        if (e.target instanceof Element && e.target.closest('#property-dropdown-menu')) return;
        updatePosition();
      };

      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [propertyDropdownOpen]);

  // Parse the current numeric value and current unit from the CSS string
  const { numericValue, parsedUnit } = useMemo(() => {
    if (!currentPropertyValue) return { numericValue: 0, parsedUnit: "px" as const };
    
    const num = parseFloat(currentPropertyValue);
    if (isNaN(num)) return { numericValue: 0, parsedUnit: "px" as const };
    
    if (currentPropertyValue.endsWith("rem")) return { numericValue: num, parsedUnit: "rem" as const };
    if (currentPropertyValue.endsWith("%")) return { numericValue: num, parsedUnit: "%" as const };
    if (currentPropertyValue.endsWith("em")) return { numericValue: num, parsedUnit: "em" as const };
    return { numericValue: num, parsedUnit: "px" as const };
  }, [currentPropertyValue]);

  // Synchronize unit state when current property value changes
  useEffect(() => {
    if (currentPropertyValue) {
      setUnit(parsedUnit);
    }
  }, [currentPropertyValue, parsedUnit]);

  useEffect(() => {
    const scrollContainer = presetsScrollRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      // If holding shift it's already horizontal, or if deltaX is already present
      if (e.shiftKey || e.deltaX !== 0) return;
      
      const isAtLeftEdge = scrollContainer.scrollLeft <= 0;
      const isAtRightEdge = Math.ceil(scrollContainer.scrollLeft + scrollContainer.clientWidth) >= scrollContainer.scrollWidth;
      
      if ((e.deltaY < 0 && isAtLeftEdge) || (e.deltaY > 0 && isAtRightEdge)) {
        return;
      }

      e.preventDefault();
      scrollContainer.scrollLeft += e.deltaY;
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    return () => scrollContainer.removeEventListener('wheel', handleWheel);
  }, []);

  // Helper to update value with selected unit
  const handleNumericChange = (num: number, targetUnit = unit) => {
    const formatted = num === 0 ? "0px" : `${num}${targetUnit}`;
    handleCurrentPropertyChange(formatted);
  };

  // Handle preset click
  const handlePresetSelect = (val: string) => {
    handleCurrentPropertyChange(val);
  };

  // Preset check
  const activePreset = useMemo(() => {
    return GAP_PRESETS.find(p => p.value === currentPropertyValue) || null;
  }, [currentPropertyValue]);

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

  const isAnyDropdownOpen = propertyDropdownOpen || unitDropdownOpen;

  const activeOption = useMemo(() => {
    return gapPropertyOptions.find(opt => opt.value === activeProperty)!;
  }, [activeProperty]);

  return (
    <div className={`flex flex-col gap-3.5 w-full text-left bg-[#f5f5f5] p-4.5 rounded-[22px] border-0 relative overflow-visible group transition-all duration-200 ${
      isAnyDropdownOpen ? "z-[250] shadow-md ring-1 ring-emerald-500/10" : "z-10"
    }`}>
      
      {/* Decorative top-right overlay glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-350/5 rounded-full blur-2xl pointer-events-none" />

      {/* Styled label and current value span exactly like Display Layout has */}
      <div className="flex flex-col gap-1.5 w-full relative">
        <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono flex justify-between select-none">
          <span>Gap Property Type</span>
          <span className="text-[10px] font-mono font-bold text-stone-400 select-all normal-case">
            {activeProperty}
          </span>
        </label>

        {/* Styled Dropdown Trigger Button exactly matching DisplayDropdown styling */}
        <button
          ref={propertyDropdownTriggerRef}
          type="button"
          onClick={() => setPropertyDropdownOpen(!propertyDropdownOpen)}
          className={`w-full bg-white border ${
            propertyDropdownOpen ? "border-emerald-400 ring-4 ring-emerald-500/10" : "border-stone-200/85 hover:border-stone-300"
          } rounded-2xl p-3 flex items-center justify-between shadow-xs transition-all cursor-pointer text-left focus:outline-none`}
          id="gap-property-dropdown-trigger"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-stone-50 border border-stone-100 text-stone-500">
              <activeOption.icon className="w-4 h-4 text-stone-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-stone-800 leading-tight">
                {activeOption.label}
              </span>
              <span className="text-[10px] text-stone-400 leading-none mt-0.5">
                {activeOption.description}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Badge Display on the right of trigger */}
            <div className={`${activeOption.badgeBg} flex items-center justify-center select-none scale-[0.9]`}>
              {activeOption.badgeContent}
            </div>
            <ChevronDown
              size={14}
              className={`text-stone-400 transition-transform duration-250 ${
                propertyDropdownOpen ? "rotate-180 text-emerald-500" : ""
              }`}
            />
          </div>
        </button>

        {/* Render Portal dropdown menu */}
        {typeof document !== "undefined" && createPortal(
          <AnimatePresence>
            {propertyDropdownOpen && dropdownPos && (
              <motion.div
                initial={{ opacity: 0, y: dropdownPos.placement === "top" ? 6 : -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="fixed bg-white border border-stone-200 rounded-3xl p-3 shadow-2xl z-[999999] flex flex-col"
                id="property-dropdown-menu"
                style={{
                  top: dropdownPos.placement === "bottom" ? dropdownPos.top : "auto",
                  bottom: dropdownPos.placement === "top" ? dropdownPos.bottom : "auto",
                  left: dropdownPos.left,
                  width: dropdownPos.width,
                  maxHeight: dropdownPos.maxHeight ? dropdownPos.maxHeight : "auto",
                }}
              >
                <div className="text-[9.5px] uppercase font-bold tracking-wider text-emerald-600 font-mono mb-2 flex items-center gap-1.5 pl-1.5 flex-shrink-0 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Select Gap Property</span>
                </div>

                <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1 pr-1 pb-1">
                  {gapPropertyOptions.map((opt) => {
                    const isSelected = activeProperty === opt.value;
                    const Icon = opt.icon;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setActiveProperty(opt.value);
                          setPropertyDropdownOpen(false);
                        }}
                        className={`group relative text-left p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-row items-center gap-3 ${
                          isSelected
                            ? "bg-emerald-50/40 border-emerald-200 shadow-sm"
                            : "bg-stone-50/40 hover:bg-stone-50 border-stone-200/60 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex-1 flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-600" : "text-stone-550 group-hover:text-stone-800"}`} />
                            <span className={`text-[11px] font-extrabold tracking-tight ${isSelected ? "text-emerald-900" : "text-stone-700 group-hover:text-stone-900"}`}>
                              {opt.label}
                            </span>
                          </div>
                          <div className="text-[9.5px] text-stone-450 group-hover:text-stone-550 leading-snug">
                            {opt.description}
                          </div>
                        </div>

                        <div className={`${opt.badgeBg} w-9 h-7 flex-shrink-0 flex items-center justify-center relative select-none`}>
                          {opt.badgeContent}
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-[2px] shadow-xs">
                              <Check size={8} />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Footer summary */}
                <div className="border-t border-stone-100 mt-2 pt-2 text-center flex-shrink-0 select-none">
                  <span className="text-[8.5px] text-stone-400 font-mono">
                    Click option to apply target axis gap model properties
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>

      {/* Preset Selectors */}
      <div className="flex flex-col gap-1.5 relative z-10">
        <div className="flex items-center justify-between pl-1">
          <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-mono select-none">
            Interactive Presets
          </span>
          {currentPropertyValue ? (
            <span className="text-[9px] font-mono font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-lg shadow-3xs">
              {currentPropertyValue}
            </span>
          ) : (
            <span className="text-[9px] font-mono font-semibold text-stone-400 select-none">
              default
            </span>
          )}
        </div>
        <div 
          ref={presetsScrollRef}
          className="flex overflow-x-auto gap-2 pb-2 pt-1 px-1 -mx-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory select-none"
        >
          {GAP_PRESETS.map((preset) => {
            const isSelected = currentPropertyValue === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => handlePresetSelect(preset.value)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all duration-250 cursor-pointer min-w-[64px] flex-shrink-0 snap-start ${
                  isSelected
                    ? "bg-emerald-50/85 border-emerald-350 text-emerald-800 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.25)] font-bold"
                    : "bg-white border-stone-200 hover:border-emerald-250 hover:bg-emerald-50/20 text-stone-600 hover:text-stone-850"
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
                  className="absolute right-0 mt-1.5 w-36 bg-white border-0 border-none rounded-xl shadow-lg p-1 z-[999] flex flex-col gap-0.5"
                  style={{ border: "none", borderWidth: "0px" }}
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
            <button
              type="button"
              onClick={() => setShowLimitSettings(!showLimitSettings)}
              title="Click to set custom slider boundary limits"
              className={`text-[8.5px] font-mono font-extrabold flex items-center gap-1 px-1.5 py-0.5 rounded-md border transition-all cursor-pointer ${
                showLimitSettings 
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-3xs" 
                  : "bg-stone-50 border-stone-200/55 text-stone-500 hover:text-stone-850 hover:bg-stone-100"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Range: {currentLimit.min} to {currentLimit.max} {unit}
            </button>
          </div>

          {/* Interactive Limit Config Drawer */}
          <AnimatePresence>
            {showLimitSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden mb-1.5"
              >
                <div className="bg-stone-50/80 border border-stone-200/50 p-2 rounded-xl flex flex-col gap-2 mt-0.5 select-none animate-fade-in text-left">
                  <div className="flex items-center justify-between px-0.5">
                    <span className="text-[8px] font-extrabold text-stone-500 uppercase tracking-wider font-mono">
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
                      className="text-[8px] font-extrabold text-stone-400 hover:text-red-500 hover:underline transition-all cursor-pointer"
                    >
                      Default
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[7.5px] font-bold text-stone-400 uppercase tracking-wider font-mono pl-0.5">
                        Lower (Min)
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
                        className="w-full bg-white border border-stone-200 rounded-lg px-2 py-0.5 text-center font-mono text-[9.5px] text-stone-700 font-bold focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all shadow-3xs"
                      />
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[7.5px] font-bold text-stone-400 uppercase tracking-wider font-mono pl-0.5">
                        Upper (Max)
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
                        className="w-full bg-white border border-stone-200 rounded-lg px-2 py-0.5 text-center font-mono text-[9.5px] text-stone-700 font-bold focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all shadow-3xs"
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
            className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-600 transition-colors border border-stone-200/50"
          />
        </div>

        {/* Numeric Input & Adjustments Row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 shrink-0 border-0" style={{ width: "132px", borderWidth: "0px" }}>
            {/* Decrement Button */}
            <button
              type="button"
              onClick={() => {
                const newVal = Math.max(currentLimit.min, (numericValue || 0) - currentLimit.step);
                handleNumericChange(parseFloat(newVal.toFixed(3)));
              }}
              className="w-[25px] h-[25px] rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-650 hover:bg-stone-100 active:bg-stone-250 transition-colors shadow-2xs cursor-pointer select-none"
            >
              -
            </button>

            {/* Main Input Display */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={currentPropertyValue || ""}
                onChange={(e) => handleCurrentPropertyChange(e.target.value)}
                placeholder="0px"
                className="w-[71px] bg-stone-50 border border-emerald-500/10 focus:border-emerald-500 rounded-xl px-1.5 py-1 text-center text-[10px] focus:outline-none font-mono text-emerald-700 font-extrabold focus:bg-white shadow-2xs transition-all"
              />
            </div>

            {/* Increment Button */}
            <button
              type="button"
              onClick={() => {
                const newVal = Math.min(currentLimit.max, (numericValue || 0) + currentLimit.step);
                handleNumericChange(parseFloat(newVal.toFixed(3)));
              }}
              className="w-[25px] h-[25px] rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-650 hover:bg-stone-100 active:bg-stone-250 transition-colors shadow-2xs cursor-pointer select-none"
            >
              +
            </button>
          </div>

          {/* Value actions like Clear */}
          {currentPropertyValue && (
            <button
              type="button"
              onClick={() => handleCurrentPropertyChange("")}
              title="Reset spacing"
              className="w-7 h-7 bg-stone-50 hover:bg-red-50 hover:text-red-650 text-stone-400 border border-stone-200/60 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer shadow-3xs hover:border-red-200"
            >
              <RotateCcw size={11} className="stroke-[2.5]" />
            </button>
          )}
        </div>

      </div>

      {/* Helpful Description Footer */}
      <div className="flex items-start gap-1.5 p-2 bg-emerald-50/30 border border-emerald-100/45 rounded-xl z-10 relative">
        <Info size={11} className="text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-[9px] leading-normal text-stone-550 font-medium select-none">
          The <b>{activeProperty}</b> property sets the {activeProperty === "row-gap" ? "vertical space (gutters) between rows" : activeProperty === "column-gap" ? "horizontal space (gutters) between columns" : "spacing (gutters) between columns and rows"} inside flexbox, CSS grid, and multi-column elements automatically.
        </p>
      </div>

    </div>
  );
}
