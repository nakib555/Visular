import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Square, 
  Info, 
  Settings2,
  ChevronDown,
  Check,
  RotateCcw,
  ArrowUpToLine,
  ArrowRightToLine,
  ArrowDownToLine,
  ArrowLeftToLine,
  Maximize
} from "lucide-react";

interface WidthControlProps {
  propName?: string;
  value: string;
  onChange: (val: string) => void;
  minWidthValue?: string;
  maxWidthValue?: string;
  inlineSizeValue?: string;
  minInlineSizeValue?: string;
  maxInlineSizeValue?: string;
  onMinWidthChange?: (val: string) => void;
  onMaxWidthChange?: (val: string) => void;
  onInlineSizeChange?: (val: string) => void;
  onMinInlineSizeChange?: (val: string) => void;
  onMaxInlineSizeChange?: (val: string) => void;
}

interface WidthPreset {
  label: string;
  value: string;
  badgeColor: string;
}

const WIDTH_PRESETS: WidthPreset[] = [
  { label: "auto", value: "auto", badgeColor: "bg-rose-50 text-rose-600 border-rose-100" },
  { label: "100%", value: "100%", badgeColor: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { label: "50%", value: "50%", badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { label: "33.3%", value: "33.333%", badgeColor: "bg-teal-50 text-teal-600 border-teal-100" },
  { label: "25%", value: "25%", badgeColor: "bg-cyan-50 text-cyan-600 border-cyan-100" },
  { label: "max-content", value: "max-content", badgeColor: "bg-violet-50 text-violet-650 border-violet-100" },
  { label: "min-content", value: "min-content", badgeColor: "bg-fuchsia-50 text-fuchsia-650 border-fuchsia-100" },
  { label: "fit-content", value: "fit-content", badgeColor: "bg-orange-50 text-orange-650 border-orange-100" },
  { label: "320px", value: "320px", badgeColor: "bg-blue-50 text-blue-655 border-blue-100" },
  { label: "768px", value: "768px", badgeColor: "bg-sky-50 text-sky-655 border-sky-100" },
  { label: "1024px", value: "1024px", badgeColor: "bg-sky-50 text-sky-655 border-sky-100" },
  { label: "1200px", value: "1200px", badgeColor: "bg-stone-55 text-stone-655 border-stone-100" },
];

interface WidthPropertyOption {
  value: "width" | "min-width" | "max-width" | "inline-size" | "min-inline-size" | "max-inline-size";
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  badgeBg: string;
  badgeContent: React.ReactNode;
}

const widthPropertyOptions: WidthPropertyOption[] = [
  {
    value: "width",
    label: "Width (width)",
    description: "Sets the horizontal size of the element",
    icon: Maximize,
    badgeBg: "bg-indigo-50/90 border border-indigo-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-2 border-indigo-400 rounded-sm flex items-center justify-between px-[2px]">
         <div className="w-[2px] h-[10px] bg-indigo-500 rounded-full" />
         <div className="h-[2px] w-[6px] bg-indigo-500/60" />
         <div className="w-[2px] h-[10px] bg-indigo-500 rounded-full" />
      </div>
    )
  },
  {
    value: "min-width",
    label: "Min Width (min-width)",
    description: "Sets the lower bound limit of element width",
    icon: ArrowLeftToLine,
    badgeBg: "bg-teal-50/90 border border-teal-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-2 border-teal-400 border-dashed rounded-sm flex items-center justify-start pl-[2px]">
         <div className="w-[2px] h-[10px] bg-teal-500 rounded-full scale-y-110" />
      </div>
    )
  },
  {
    value: "max-width",
    label: "Max Width (max-width)",
    description: "Sets the upper bound limit of element width",
    icon: ArrowRightToLine,
    badgeBg: "bg-fuchsia-50/90 border border-fuchsia-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-2 border-fuchsia-400 border-dashed rounded-sm flex items-center justify-end pr-[2px]">
         <div className="w-[2px] h-[10px] bg-fuchsia-500 rounded-full scale-y-110" />
      </div>
    )
  },
  {
    value: "inline-size",
    label: "Inline Size (inline-size)",
    description: "Logical width depending on language vertical/horizontal flow",
    icon: Square,
    badgeBg: "bg-violet-50/90 border border-violet-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-y-2 border-violet-400 rounded-sm flex items-center justify-center">
         <div className="w-[8px] h-[2px] bg-violet-500 rounded-sm" />
      </div>
    )
  },
  {
    value: "min-inline-size",
    label: "Min Inline Size (min-inline-size)",
    description: "Logical lower bound depending on writing mode flow",
    icon: ArrowLeftToLine,
    badgeBg: "bg-emerald-50/90 border border-emerald-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-y-2 border-emerald-400 border-dashed rounded-sm flex items-center justify-start pl-[2px]">
         <div className="w-[3px] h-[6px] bg-emerald-500 rounded-xs" />
      </div>
    )
  },
  {
    value: "max-inline-size",
    label: "Max Inline Size (max-inline-size)",
    description: "Logical upper bound depending on writing mode flow",
    icon: ArrowRightToLine,
    badgeBg: "bg-orange-50/90 border border-orange-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-y-2 border-orange-400 border-dashed rounded-sm flex items-center justify-end pr-[2px]">
         <div className="w-[3px] h-[6px] bg-orange-500 rounded-xs" />
      </div>
    )
  }
];

export function WidthControl({ 
  propName = "width",
  value, 
  onChange,
  minWidthValue = "",
  maxWidthValue = "",
  inlineSizeValue = "",
  minInlineSizeValue = "",
  maxInlineSizeValue = "",
  onMinWidthChange,
  onMaxWidthChange,
  onInlineSizeChange,
  onMinInlineSizeChange,
  onMaxInlineSizeChange
}: WidthControlProps) {
  const [activeProperty, setActiveProperty] = useState<WidthPropertyOption["value"]>("width");
  const [unit, setUnit] = useState<"px" | "rem" | "%" | "em" | "vw" | "vh" | "vmin" | "vmax" | "ch" | "ex" | "dvw" | "dvh" | "svw" | "svh" | "lvw" | "lvh" | "auto">("px");
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unitTriggerRef = useRef<HTMLButtonElement>(null);
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

  const [unitDropdownPos, setUnitDropdownPos] = useState<{ 
    top: number; 
    left: number; 
    width: number; 
    bottom?: number; 
    maxHeight?: number;
    placement: "top" | "bottom" 
  } | null>(null);

  // Synchronize active property based on which propName was rendered
  useEffect(() => {
    if (propName && widthPropertyOptions.some(opt => opt.value === propName)) {
      setActiveProperty(propName as any);
    }
  }, [propName]);

  const currentPropertyValue = useMemo(() => {
    switch (activeProperty) {
      case "min-width": return minWidthValue;
      case "max-width": return maxWidthValue;
      case "inline-size": return inlineSizeValue;
      case "min-inline-size": return minInlineSizeValue;
      case "max-inline-size": return maxInlineSizeValue;
      default: return value;
    }
  }, [
    activeProperty, value, minWidthValue, maxWidthValue,
    inlineSizeValue, minInlineSizeValue, maxInlineSizeValue
  ]);

  const handleCurrentPropertyChange = (val: string) => {
    switch (activeProperty) {
      case "min-width": onMinWidthChange?.(val); break;
      case "max-width": onMaxWidthChange?.(val); break;
      case "inline-size": onInlineSizeChange?.(val); break;
      case "min-inline-size": onMinInlineSizeChange?.(val); break;
      case "max-inline-size": onMaxInlineSizeChange?.(val); break;
      default: onChange(val); break;
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      if (
        propertyDropdownTriggerRef.current && 
        !propertyDropdownTriggerRef.current.contains(target) && 
        !((target as Element).closest('#width-property-dropdown-menu'))
      ) {
        setPropertyDropdownOpen(false);
      }

      if (
        unitTriggerRef.current &&
        !unitTriggerRef.current.contains(target) &&
        !((target as Element).closest('#width-unit-dropdown-menu'))
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
        if (e.target instanceof Element && e.target.closest('#width-unit-dropdown-menu')) return;
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

  useEffect(() => {
    if (propertyDropdownOpen && propertyDropdownTriggerRef.current) {
      const updatePosition = () => {
        if (!propertyDropdownTriggerRef.current) return;
        const rect = propertyDropdownTriggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 300;
        
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
        if (e.target instanceof Element && e.target.closest('#width-property-dropdown-menu')) return;
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

  const { numericValue, parsedUnit } = useMemo(() => {
    if (!currentPropertyValue) return { numericValue: 0, parsedUnit: "px" as const };
    if (currentPropertyValue === "auto") return { numericValue: 0, parsedUnit: "auto" as const };
    if (currentPropertyValue === "none") return { numericValue: 100, parsedUnit: "%" as const }; // fallback max-width 'none' visual representation
    
    const primaryPart = currentPropertyValue.trim();
    const num = parseFloat(primaryPart);
    if (isNaN(num)) return { numericValue: 0, parsedUnit: "px" as const };
    if (primaryPart.endsWith("rem")) return { numericValue: num, parsedUnit: "rem" as const };
    if (primaryPart.endsWith("%")) return { numericValue: num, parsedUnit: "%" as const };
    if (primaryPart.endsWith("em")) return { numericValue: num, parsedUnit: "em" as const };
    if (primaryPart.endsWith("vw")) return { numericValue: num, parsedUnit: "vw" as const };
    if (primaryPart.endsWith("vh")) return { numericValue: num, parsedUnit: "vh" as const };
    if (primaryPart.endsWith("vmin")) return { numericValue: num, parsedUnit: "vmin" as const };
    if (primaryPart.endsWith("vmax")) return { numericValue: num, parsedUnit: "vmax" as const };
    if (primaryPart.endsWith("ch")) return { numericValue: num, parsedUnit: "ch" as const };
    if (primaryPart.endsWith("ex")) return { numericValue: num, parsedUnit: "ex" as const };
    if (primaryPart.endsWith("dvw")) return { numericValue: num, parsedUnit: "dvw" as const };
    if (primaryPart.endsWith("dvh")) return { numericValue: num, parsedUnit: "dvh" as const };
    if (primaryPart.endsWith("svw")) return { numericValue: num, parsedUnit: "svw" as const };
    if (primaryPart.endsWith("svh")) return { numericValue: num, parsedUnit: "svh" as const };
    if (primaryPart.endsWith("lvw")) return { numericValue: num, parsedUnit: "lvw" as const };
    if (primaryPart.endsWith("lvh")) return { numericValue: num, parsedUnit: "lvh" as const };
    return { numericValue: num, parsedUnit: "px" as const };
  }, [currentPropertyValue]);

  useEffect(() => {
    if (currentPropertyValue && parsedUnit !== "auto") {
      setUnit(parsedUnit);
    }
  }, [currentPropertyValue, parsedUnit]);

  useEffect(() => {
    const scrollContainer = presetsScrollRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.shiftKey || e.deltaX !== 0) return;
      const isAtLeftEdge = scrollContainer.scrollLeft <= 0;
      const isAtRightEdge = Math.ceil(scrollContainer.scrollLeft + scrollContainer.clientWidth) >= scrollContainer.scrollWidth;
      
      if ((e.deltaY < 0 && isAtLeftEdge) || (e.deltaY > 0 && isAtRightEdge)) return;

      e.preventDefault();
      scrollContainer.scrollLeft += e.deltaY;
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    return () => scrollContainer.removeEventListener('wheel', handleWheel);
  }, []);

  const handleNumericChange = (num: number, targetUnit = unit) => {
    if (targetUnit === "auto") {
      handleCurrentPropertyChange("auto");
      return;
    }
    const formatted = num === 0 ? "0px" : `${num}${targetUnit}`;
    handleCurrentPropertyChange(formatted);
  };

  const handlePresetSelect = (val: string) => {
    handleCurrentPropertyChange(val);
  };

  const [customLimits, setCustomLimits] = useState<Record<"px" | "rem" | "%" | "em" | "vw" | "vh" | "dvw" | "dvh" | "vmin" | "vmax", { min: number; max: number }>>({
    px: { min: 0, max: 1440 },
    rem: { min: 0, max: 100 },
    "%": { min: 0, max: 100 },
    em: { min: 0, max: 100 },
    vw: { min: 0, max: 100 },
    vh: { min: 0, max: 100 },
    dvw: { min: 0, max: 100 },
    dvh: { min: 0, max: 100 },
    vmin: { min: 0, max: 100 },
    vmax: { min: 0, max: 100 },
  });

  const [showLimitSettings, setShowLimitSettings] = useState(false);

  const activeLimitsUnit = unit === "auto" ? "px" : unit;
  const currentLimit = useMemo(() => {
    const lim = customLimits[activeLimitsUnit];
    return {
      min: lim.min,
      max: lim.max,
      step: activeLimitsUnit === "px" ? 10 : activeLimitsUnit === "%" ? 1 : 0.5,
      label: unit === "px" ? "Pixels" : unit === "rem" ? "Relative (rem)" : unit === "%" ? "Percentage" : unit === "em" ? "Relative (em)" : unit === "vw" ? "Viewport Width" : unit === "vh" ? "Viewport Height" : unit === "dvw" ? "Dynamic VW" : unit === "dvh" ? "Dynamic VH" : unit === "vmin" ? "Viewport Min" : unit === "vmax" ? "Viewport Max" : "Auto"
    };
  }, [customLimits, activeLimitsUnit, unit]);

  const unitLabels = {
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

  const isAnyDropdownOpen = propertyDropdownOpen || unitDropdownOpen;
  const activeOption = useMemo(() => widthPropertyOptions.find(opt => opt.value === activeProperty) || widthPropertyOptions[0], [activeProperty]);

  return (
    <div className={`flex flex-col gap-3.5 w-full text-left relative overflow-visible group transition-all duration-200 ${
      isAnyDropdownOpen ? "z-[250]" : "z-10"
    }`}>
      
      <div className="flex flex-col gap-1.5 w-full relative">
        <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono flex justify-between select-none">
          <span>Width & Sizing Property</span>
          <span className="text-[10px] font-mono font-bold text-stone-400 select-all normal-case">
            {activeProperty}
          </span>
        </label>

        <button
          ref={propertyDropdownTriggerRef}
          type="button"
          onClick={() => setPropertyDropdownOpen(!propertyDropdownOpen)}
          className={`w-full bg-white border ${
            propertyDropdownOpen ? "border-indigo-400 ring-4 ring-indigo-500/10" : "border-stone-200/85 hover:border-stone-300"
          } rounded-2xl p-3 flex items-center justify-between shadow-xs transition-all cursor-pointer text-left focus:outline-none`}
          id="width-property-dropdown-trigger"
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
            <div className={`${activeOption.badgeBg} flex items-center justify-center select-none scale-[0.9]`}>
              {activeOption.badgeContent}
            </div>
            <ChevronDown
              size={14}
              className={`text-stone-400 transition-transform duration-250 ${
                propertyDropdownOpen ? "rotate-180 text-indigo-500" : ""
              }`}
            />
          </div>
        </button>

        {typeof document !== "undefined" && createPortal(
          <AnimatePresence>
            {propertyDropdownOpen && dropdownPos && (
              <motion.div
                initial={{ opacity: 0, y: dropdownPos.placement === "top" ? 6 : -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="fixed bg-white border border-stone-200 rounded-3xl p-3 shadow-2xl z-[999999] flex flex-col"
                id="width-property-dropdown-menu"
                style={{
                  top: dropdownPos.placement === "bottom" ? dropdownPos.top : "auto",
                  bottom: dropdownPos.placement === "top" ? dropdownPos.bottom : "auto",
                  left: dropdownPos.left,
                  width: dropdownPos.width,
                  maxHeight: dropdownPos.maxHeight ? dropdownPos.maxHeight : "auto",
                }}
              >
                <div className="text-[9.5px] uppercase font-bold tracking-wider text-indigo-600 font-mono mb-2 flex items-center gap-1.5 pl-1.5 flex-shrink-0 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span>Select Dimension Side</span>
                </div>

                <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1 pr-1 pb-1">
                  {widthPropertyOptions.map((opt) => {
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
                            ? "bg-indigo-50/40 border-indigo-200 shadow-sm"
                            : "bg-stone-50/40 hover:bg-stone-50 border-stone-200/60 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex-1 flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-600" : "text-stone-550 group-hover:text-stone-800"}`} />
                            <span className={`text-[11px] font-extrabold tracking-tight ${isSelected ? "text-indigo-900" : "text-stone-700 group-hover:text-stone-900"}`}>
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
                            <div className="absolute -top-1 -right-1 bg-indigo-500 text-white rounded-full p-[2px] shadow-xs">
                              <Check size={8} />
                            </div>
                          )}
                        </div>
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

      <div className="flex flex-col gap-1.5 relative z-10">
        <div className="flex items-center justify-between pl-1">
          <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-mono select-none">
            Width Presets
          </span>
          {currentPropertyValue ? (
            <span className="text-[9px] font-mono font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-1.5 py-0.5 rounded-lg shadow-3xs">
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
          {WIDTH_PRESETS.map((preset) => {
            const isSelected = currentPropertyValue === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => handlePresetSelect(preset.value)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all duration-250 cursor-pointer min-w-[64px] flex-shrink-0 snap-start ${
                  isSelected
                    ? "bg-indigo-50/85 border-indigo-350 text-indigo-800 shadow-[0_2px_8px_-2px_rgba(99,102,241,0.25)] font-bold"
                    : "bg-white border-stone-200 hover:border-indigo-250 hover:bg-indigo-50/20 text-stone-600 hover:text-stone-850"
                }`}
              >
                <span className="text-[10px] tracking-tight">{preset.label}</span>
                <span className={`text-[8px] font-mono mt-0.5 ${isSelected ? "text-indigo-500/90" : "text-stone-400"}`}>
                  {preset.value}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white/80 border border-stone-200/70 p-3.5 rounded-2xl flex flex-col gap-3 shadow-2xs relative z-20">
        <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2 relative">
          <div className="flex items-center gap-1.5 min-w-0">
            <Settings2 size={12} className="text-stone-400 shrink-0" />
            <span className="text-[10px] font-bold text-stone-600 font-mono uppercase tracking-wider truncate">
              Dimension Options & Slider
            </span>
          </div>

          <div className="relative">
            <button
              ref={unitTriggerRef}
              type="button"
              onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
              className="flex items-center gap-1 bg-stone-100 border border-stone-200/60 hover:border-indigo-300 hover:bg-indigo-50/20 px-2 py-1 rounded-lg text-stone-700 font-mono text-[9px] font-extrabold transition-all duration-150 cursor-pointer shadow-3xs"
            >
              <span>{unit.toUpperCase()} Unit</span>
              <ChevronDown size={11} className={`text-stone-400 font-extrabold transition-transform duration-200 ${unitDropdownOpen ? "rotate-180 text-indigo-600" : ""}`} />
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
                    id="width-unit-dropdown-menu"
                    style={{
                      top: unitDropdownPos.placement === "bottom" ? unitDropdownPos.top : "auto",
                      bottom: unitDropdownPos.placement === "top" ? unitDropdownPos.bottom : "auto",
                      left: unitDropdownPos.left,
                      width: unitDropdownPos.width,
                      maxHeight: unitDropdownPos.maxHeight ? unitDropdownPos.maxHeight : "auto",
                    }}
                  >
                    <div className="text-[8px] uppercase font-bold tracking-wider text-indigo-600 font-mono mb-1 mt-1 pl-2 select-none">
                      Select Unit
                    </div>
                    <div className="flex flex-col gap-0.5 max-h-[160px] overflow-y-auto custom-scrollbar">
                      {((Object.keys(unitLabels)) as readonly (keyof typeof unitLabels)[]).map((u) => {
                        const isSelected = (u as string) === unit;
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
                                ? "bg-indigo-500/10 text-indigo-800"
                                : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                            }`}
                          >
                            <span className="font-mono">{unitLabels[u]}</span>
                            {isSelected && <Check size={11} className="text-indigo-600 stroke-[3px]" />}
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

        <div className={`flex flex-col gap-1 ${unit === "auto" ? "opacity-35 pointer-events-none" : ""}`}>
          <div className="flex justify-between items-center mb-0.5 select-none">
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest font-mono">
              Sizing Range Slider
            </span>
            <button
              type="button"
              onClick={() => setShowLimitSettings(!showLimitSettings)}
              className={`text-[8.5px] font-mono font-extrabold flex items-center gap-1 px-1.5 py-0.5 rounded-md border transition-all cursor-pointer ${
                showLimitSettings 
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-3xs" 
                  : "bg-stone-50 border-stone-200/55 text-stone-500 hover:text-stone-850 hover:bg-stone-100"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse inline-block" />
              Range: {currentLimit.min} to {currentLimit.max} {activeLimitsUnit}
            </button>
          </div>

          <AnimatePresence>
            {showLimitSettings && unit !== "auto" && (
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
                      Set bounds ({activeLimitsUnit})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const defaults = {
                          px: { min: 0, max: 1440 },
                              rem: { min: 0, max: 100 },
                              "%": { min: -100, max: 100 },
                              "em": { min: 0, max: 100 },
                              "vw": { min: 0, max: 100 },
                              "vh": { min: 0, max: 100 },
                              "vmin": { min: 0, max: 100 },
                              "vmax": { min: 0, max: 100 },
                              "ch": { min: 0, max: 100 },
                              "ex": { min: 0, max: 100 },
                              "dvw": { min: 0, max: 100 },
                              "dvh": { min: 0, max: 100 },
                              "svw": { min: 0, max: 100 },
                              "svh": { min: 0, max: 100 },
                              "lvw": { min: 0, max: 100 },
                              "lvh": { min: 0, max: 100 }
  };
                        setCustomLimits(prev => ({
                          ...prev,
                          [activeLimitsUnit as keyof typeof customLimits]: defaults[activeLimitsUnit as keyof typeof customLimits]
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
                        Lower limit (Min)
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={customLimits[activeLimitsUnit as keyof typeof customLimits].min}
                        step={currentLimit.step}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val >= 0) {
                            setCustomLimits(prev => ({
                              ...prev,
                              [activeLimitsUnit]: { ...prev[activeLimitsUnit as keyof typeof customLimits], min: val }
                            }));
                          }
                        }}
                        className="w-full bg-white border border-stone-200 rounded-lg px-2 py-0.5 text-center font-mono text-[9.5px] text-stone-700 font-bold focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all shadow-3xs"
                      />
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[7.5px] font-bold text-stone-400 uppercase tracking-wider font-mono pl-0.5">
                        Upper limit (Max)
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={customLimits[activeLimitsUnit as keyof typeof customLimits].max}
                        step={currentLimit.step}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            setCustomLimits(prev => ({
                              ...prev,
                              [activeLimitsUnit]: { ...prev[activeLimitsUnit as keyof typeof customLimits], max: val }
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
            disabled={unit === "auto"}
            onChange={(e) => {
              handleNumericChange(parseFloat(e.target.value));
            }}
            className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-600 transition-colors border border-stone-200/50"
          />
        </div>

        <div className="flex items-center justify-between gap-2.5 pt-1 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5 shrink-0 border-0 w-full sm:w-auto">
            <button
              type="button"
              disabled={unit === "auto"}
              onClick={() => {
                const newVal = Math.max(currentLimit.min, (numericValue || 0) - currentLimit.step);
                handleNumericChange(parseFloat(newVal.toFixed(3)));
              }}
              className="w-8 h-8 sm:w-[25px] sm:h-[25px] rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-650 hover:bg-stone-100 active:bg-stone-250 transition-colors shadow-2xs cursor-pointer select-none disabled:opacity-50"
            >
              -
            </button>

            <div className="relative flex-1 sm:flex-initial flex items-center">
              <input
                type="text"
                value={currentPropertyValue || ""}
                onChange={(e) => handleCurrentPropertyChange(e.target.value)}
                placeholder="auto"
                className="w-full sm:w-[82px] bg-stone-50 border border-indigo-500/10 focus:border-indigo-500 rounded-xl px-1.5 py-1 text-center text-[10px] focus:outline-none font-mono text-indigo-700 font-extrabold focus:bg-white shadow-2xs transition-all"
              />
            </div>

            <button
              type="button"
              disabled={unit === "auto"}
              onClick={() => {
                const newVal = Math.min(currentLimit.max, (numericValue || 0) + currentLimit.step);
                handleNumericChange(parseFloat(newVal.toFixed(3)));
              }}
              className="w-8 h-8 sm:w-[25px] sm:h-[25px] rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-650 hover:bg-stone-100 active:bg-stone-250 transition-colors shadow-2xs cursor-pointer select-none disabled:opacity-50"
            >
              +
            </button>
          </div>

          {currentPropertyValue && (
            <button
              type="button"
              onClick={() => handleCurrentPropertyChange("")}
              title="Reset width scale"
              className="w-8 h-8 sm:w-7 sm:h-7 bg-stone-50 hover:bg-red-50 hover:text-red-655 text-stone-400 border border-stone-200/60 rounded-xl sm:rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer shadow-3xs hover:border-red-200 ml-auto"
            >
              <RotateCcw size={11} className="stroke-[2.5]" />
            </button>
          )}
        </div>

      </div>

      <div className="flex items-start gap-1.5 p-2 bg-indigo-50/30 border border-indigo-100/45 rounded-xl z-10 relative">
        <Info size={11} className="text-indigo-600 shrink-0 mt-0.5" />
        <p className="text-[9px] leading-normal text-stone-550 font-medium select-none">
          The <b>{activeProperty}</b> property controls the horizontal size constraint of elements. Adjusting width values triggers browser reflow and changes layout flow. Supports local auto calculation, relative ratios, or solid pixels.
        </p>
      </div>

    </div>
  );
}
