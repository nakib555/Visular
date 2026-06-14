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

interface MarginControlProps {
  value: string;
  onChange: (val: string) => void;
  marginTopValue?: string;
  marginRightValue?: string;
  marginBottomValue?: string;
  marginLeftValue?: string;
  marginBlockValue?: string;
  marginInlineValue?: string;
  marginBlockStartValue?: string;
  marginBlockEndValue?: string;
  marginInlineStartValue?: string;
  marginInlineEndValue?: string;
  onMarginTopChange?: (val: string) => void;
  onMarginRightChange?: (val: string) => void;
  onMarginBottomChange?: (val: string) => void;
  onMarginLeftChange?: (val: string) => void;
  onMarginBlockChange?: (val: string) => void;
  onMarginInlineChange?: (val: string) => void;
  onMarginBlockStartChange?: (val: string) => void;
  onMarginBlockEndChange?: (val: string) => void;
  onMarginInlineStartChange?: (val: string) => void;
  onMarginInlineEndChange?: (val: string) => void;
}

interface MarginPreset {
  label: string;
  value: string;
  badgeColor: string;
}

const MARGIN_PRESETS: MarginPreset[] = [
  { label: "0", value: "0px", badgeColor: "bg-stone-100 text-stone-500 border-stone-200" },
  { label: "1", value: "4px", badgeColor: "bg-teal-50 text-teal-600 border-teal-100" },
  { label: "2", value: "8px", badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { label: "3", value: "12px", badgeColor: "bg-green-50 text-green-600 border-green-100" },
  { label: "4", value: "16px", badgeColor: "bg-cyan-50 text-cyan-600 border-cyan-100" },
  { label: "5", value: "20px", badgeColor: "bg-sky-50 text-sky-600 border-sky-100" },
  { label: "6", value: "24px", badgeColor: "bg-blue-50 text-blue-600 border-blue-100" },
  { label: "8", value: "32px", badgeColor: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { label: "10", value: "40px", badgeColor: "bg-violet-50 text-violet-600 border-violet-100" },
  { label: "12", value: "48px", badgeColor: "bg-purple-50 text-purple-600 border-purple-100" },
  { label: "16", value: "64px", badgeColor: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100" },
  { label: "auto", value: "auto", badgeColor: "bg-rose-50 text-rose-600 border-rose-100" },
];

interface MarginPropertyOption {
  value: "margin" | "margin-top" | "margin-right" | "margin-bottom" | "margin-left" | "margin-block" | "margin-inline" | "margin-block-start" | "margin-block-end" | "margin-inline-start" | "margin-inline-end";
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  badgeBg: string;
  badgeContent: React.ReactNode;
}

const marginPropertyOptions: MarginPropertyOption[] = [
  {
    value: "margin",
    label: "All Sides (margin)",
    description: "Applies spacing to all four sides equally",
    icon: Maximize,
    badgeBg: "bg-indigo-50/90 border border-indigo-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-2 border-indigo-400 border-dashed rounded-sm flex items-center justify-center">
         <div className="w-[8px] h-[8px] bg-indigo-500 rounded-sm" />
      </div>
    )
  },
  {
    value: "margin-inline",
    label: "Horizontal (margin-inline)",
    description: "Spacing on the left and right edges",
    icon: ArrowRightToLine,
    badgeBg: "bg-fuchsia-50/90 border border-fuchsia-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-l-2 border-r-2 border-fuchsia-400 border-dashed rounded-sm flex items-center justify-center">
         <div className="w-[8px] h-[8px] bg-fuchsia-500 rounded-sm" />
      </div>
    )
  },
  {
    value: "margin-block",
    label: "Vertical (margin-block)",
    description: "Spacing on the top and bottom edges",
    icon: ArrowUpToLine,
    badgeBg: "bg-violet-50/90 border border-violet-100/70 p-1 rounded-lg w-9 h-7 flex flex-col items-center justify-center",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-t-2 border-b-2 border-violet-400 border-dashed rounded-sm flex flex-col items-center justify-center">
         <div className="w-[8px] h-[8px] bg-violet-500 rounded-sm" />
      </div>
    )
  },
  {
    value: "margin-top",
    label: "Top (margin-top)",
    description: "Spacing on the top edge",
    icon: ArrowUpToLine,
    badgeBg: "bg-sky-50/90 border border-sky-100/70 p-1 rounded-lg w-9 h-7 flex flex-col items-center justify-center",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-t-2 border-sky-400 border-dashed rounded-sm flex flex-col pt-[2px] items-center">
         <div className="w-[8px] h-[8px] bg-sky-500 rounded-sm" />
      </div>
    )
  },
  {
    value: "margin-right",
    label: "Right (margin-right)",
    description: "Spacing on the right edge",
    icon: ArrowRightToLine,
    badgeBg: "bg-emerald-50/90 border border-emerald-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center pr-0.5",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-r-2 border-emerald-400 border-dashed rounded-sm flex justify-end pr-[2px] items-center">
         <div className="w-[8px] h-[8px] bg-emerald-500 rounded-sm" />
      </div>
    )
  },
  {
    value: "margin-bottom",
    label: "Bottom (margin-bottom)",
    description: "Spacing on the bottom edge",
    icon: ArrowDownToLine,
    badgeBg: "bg-rose-50/90 border border-rose-100/70 p-1 rounded-lg w-9 h-7 flex flex-col items-center justify-center pb-0.5",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-b-2 border-rose-400 border-dashed rounded-sm flex flex-col justify-end pb-[2px] items-center">
         <div className="w-[8px] h-[8px] bg-rose-500 rounded-sm" />
      </div>
    )
  },
  {
    value: "margin-left",
    label: "Left (margin-left)",
    description: "Spacing on the left edge",
    icon: ArrowLeftToLine,
    badgeBg: "bg-amber-50/90 border border-amber-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center pl-0.5",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-l-2 border-amber-400 border-dashed rounded-sm flex pl-[2px] items-center">
         <div className="w-[8px] h-[8px] bg-amber-500 rounded-sm" />
      </div>
    )
  },
  {
    value: "margin-inline-start",
    label: "Inline Start (margin-inline-start)",
    description: "Logical logical start edge (usually left)",
    icon: ArrowLeftToLine,
    badgeBg: "bg-teal-50/90 border border-teal-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center pl-0.5",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-l-2 border-teal-400 border-dashed rounded-sm flex pl-[2px] items-center">
         <div className="w-[8px] h-[8px] bg-teal-500 rounded-sm" />
      </div>
    )
  },
  {
    value: "margin-inline-end",
    label: "Inline End (margin-inline-end)",
    description: "Logical inline end edge (usually right)",
    icon: ArrowRightToLine,
    badgeBg: "bg-cyan-50/90 border border-cyan-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center pr-0.5",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-r-2 border-cyan-400 border-dashed rounded-sm flex justify-end pr-[2px] items-center">
         <div className="w-[8px] h-[8px] bg-cyan-500 rounded-sm" />
      </div>
    )
  },
  {
    value: "margin-block-start",
    label: "Block Start (margin-block-start)",
    description: "Logical block start edge (usually top)",
    icon: ArrowUpToLine,
    badgeBg: "bg-blue-50/90 border border-blue-100/70 p-1 rounded-lg w-9 h-7 flex flex-col items-center justify-center",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-t-2 border-blue-400 border-dashed rounded-sm flex flex-col pt-[2px] items-center">
         <div className="w-[8px] h-[8px] bg-blue-500 rounded-sm" />
      </div>
    )
  },
  {
    value: "margin-block-end",
    label: "Block End (margin-block-end)",
    description: "Logical block end edge (usually bottom)",
    icon: ArrowDownToLine,
    badgeBg: "bg-orange-50/90 border border-orange-100/70 p-1 rounded-lg w-9 h-7 flex flex-col items-center justify-center pb-0.5",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-b-2 border-orange-400 border-dashed rounded-sm flex flex-col justify-end pb-[2px] items-center">
         <div className="w-[8px] h-[8px] bg-orange-500 rounded-sm" />
      </div>
    )
  }
];

export function MarginControl({ 
  value, 
  onChange,
  marginTopValue = "",
  marginRightValue = "",
  marginBottomValue = "",
  marginLeftValue = "",
  marginBlockValue = "",
  marginInlineValue = "",
  marginBlockStartValue = "",
  marginBlockEndValue = "",
  marginInlineStartValue = "",
  marginInlineEndValue = "",
  onMarginTopChange,
  onMarginRightChange,
  onMarginBottomChange,
  onMarginLeftChange,
  onMarginBlockChange,
  onMarginInlineChange,
  onMarginBlockStartChange,
  onMarginBlockEndChange,
  onMarginInlineStartChange,
  onMarginInlineEndChange
}: MarginControlProps) {
  const [activeProperty, setActiveProperty] = useState<MarginPropertyOption["value"]>("margin");
  const [unit, setUnit] = useState<"px" | "rem" | "%" | "em" | "auto">("px");
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
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

  const currentPropertyValue = useMemo(() => {
    switch (activeProperty) {
      case "margin-top": return marginTopValue;
      case "margin-right": return marginRightValue;
      case "margin-bottom": return marginBottomValue;
      case "margin-left": return marginLeftValue;
      case "margin-block": return marginBlockValue;
      case "margin-inline": return marginInlineValue;
      case "margin-block-start": return marginBlockStartValue;
      case "margin-block-end": return marginBlockEndValue;
      case "margin-inline-start": return marginInlineStartValue;
      case "margin-inline-end": return marginInlineEndValue;
      default: return value;
    }
  }, [
    activeProperty, value, marginTopValue, marginRightValue, marginBottomValue, marginLeftValue,
    marginBlockValue, marginInlineValue, marginBlockStartValue, marginBlockEndValue,
    marginInlineStartValue, marginInlineEndValue
  ]);

  const handleCurrentPropertyChange = (val: string) => {
    switch (activeProperty) {
      case "margin-top": onMarginTopChange?.(val); break;
      case "margin-right": onMarginRightChange?.(val); break;
      case "margin-bottom": onMarginBottomChange?.(val); break;
      case "margin-left": onMarginLeftChange?.(val); break;
      case "margin-block": onMarginBlockChange?.(val); break;
      case "margin-inline": onMarginInlineChange?.(val); break;
      case "margin-block-start": onMarginBlockStartChange?.(val); break;
      case "margin-block-end": onMarginBlockEndChange?.(val); break;
      case "margin-inline-start": onMarginInlineStartChange?.(val); break;
      case "margin-inline-end": onMarginInlineEndChange?.(val); break;
      default: onChange(val); break;
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setUnitDropdownOpen(false);
      }
      if (
        propertyDropdownTriggerRef.current && 
        !propertyDropdownTriggerRef.current.contains(target) && 
        !((target as Element).closest('#margin-property-dropdown-menu'))
      ) {
        setPropertyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (propertyDropdownOpen && propertyDropdownTriggerRef.current) {
      const updatePosition = () => {
        if (!propertyDropdownTriggerRef.current) return;
        const rect = propertyDropdownTriggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 350;
        
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
        if (e.target instanceof Element && e.target.closest('#margin-property-dropdown-menu')) return;
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
    if (currentPropertyValue === "auto" || currentPropertyValue === "0 auto") return { numericValue: 0, parsedUnit: "auto" as const };
    
    // Support basic auto / single values. Multi-values split not handled in simple slider.
    const primaryPart = currentPropertyValue.split(" ").pop() || currentPropertyValue;
    const num = parseFloat(primaryPart);
    if (isNaN(num)) return { numericValue: 0, parsedUnit: "px" as const };
    
    if (primaryPart.endsWith("rem")) return { numericValue: num, parsedUnit: "rem" as const };
    if (primaryPart.endsWith("%")) return { numericValue: num, parsedUnit: "%" as const };
    if (primaryPart.endsWith("em")) return { numericValue: num, parsedUnit: "em" as const };
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

  const [customLimits, setCustomLimits] = useState<Record<"px" | "rem" | "%" | "em", { min: number; max: number }>>({
    px: { min: -100, max: 150 },
    rem: { min: -10, max: 10 },
    "%": { min: -50, max: 50 },
    em: { min: -10, max: 10 },
  });

  const [showLimitSettings, setShowLimitSettings] = useState(false);

  // fallback to px limit bounds if auto is selected
  const activeLimitsUnit = unit === "auto" ? "px" : unit;
  const currentLimit = useMemo(() => {
    const lim = customLimits[activeLimitsUnit];
    return {
      min: lim.min,
      max: lim.max,
      step: activeLimitsUnit === "px" ? 1 : activeLimitsUnit === "%" ? 0.5 : 0.125,
      label: unit === "px" ? "Pixels" : unit === "rem" ? "Relative (rem)" : unit === "%" ? "Percentage" : unit === "em" ? "Relative (em)" : "Auto"
    };
  }, [customLimits, activeLimitsUnit, unit]);

  const unitLabels = {
    px: "Pixels (px)",
    rem: "Relative (rem)",
    em: "Relative (em)",
    "%": "Percent (%)",
    "auto": "Auto Space"
  };

  const isAnyDropdownOpen = propertyDropdownOpen || unitDropdownOpen;
  const activeOption = useMemo(() => marginPropertyOptions.find(opt => opt.value === activeProperty)!, [activeProperty]);

  return (
    <div className={`flex flex-col gap-3.5 w-full text-left bg-stone-50 p-4.5 rounded-[22px] border border-stone-200/60 relative overflow-visible group transition-all duration-200 ${
      isAnyDropdownOpen ? "z-[250] shadow-md ring-1 ring-indigo-500/10" : "z-10"
    }`}>
      
      <div className="flex flex-col gap-1.5 w-full relative">
        <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono flex justify-between select-none">
          <span>Margin Property</span>
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
          id="margin-property-dropdown-trigger"
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
                id="margin-property-dropdown-menu"
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
                  <span>Select Margin Side</span>
                </div>

                <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1 pr-1 pb-1">
                  {marginPropertyOptions.map((opt) => {
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
            Scale Presets
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
          {MARGIN_PRESETS.map((preset) => {
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
              Values & Slider
            </span>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
              className="flex items-center gap-1 bg-stone-100 border border-stone-200/60 hover:border-indigo-300 hover:bg-indigo-50/20 px-2 py-1 rounded-lg text-stone-700 font-mono text-[9px] font-extrabold transition-all duration-150 cursor-pointer shadow-3xs"
            >
              <span>{unit.toUpperCase()} Unit</span>
              <ChevronDown size={11} className={`text-stone-400 font-extrabold transition-transform duration-200 ${unitDropdownOpen ? "rotate-180 text-indigo-600" : ""}`} />
            </button>

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
                  {(["px", "rem", "%", "em", "auto"] as const).map((u) => {
                    const isSelected = u === unit;
                    return (
                      <button
                        key={u}
                        type="button"
                        onClick={() => {
                          setUnit(u);
                          setUnitDropdownOpen(false);
                          if (u === "auto") {
                              handleNumericChange(0, "auto");
                          } else if (numericValue !== undefined) {
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className={`flex flex-col gap-1 ${unit === "auto" ? "opacity-30 pointer-events-none" : ""}`}>
          <div className="flex justify-between items-center mb-0.5 select-none">
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest font-mono">
              Adjust Value
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
                      Set Bounds ({activeLimitsUnit})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const defaults = {
                          px: { min: -100, max: 150 },
                          rem: { min: -10, max: 10 },
                          "%": { min: -50, max: 50 },
                          em: { min: -10, max: 10 },
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
                        Lower (Min)
                      </span>
                      <input
                        type="number"
                        value={customLimits[activeLimitsUnit as keyof typeof customLimits].min}
                        step={currentLimit.step}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) {
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
                        Upper (Max)
                      </span>
                      <input
                        type="number"
                        value={customLimits[activeLimitsUnit as keyof typeof customLimits].max}
                        step={currentLimit.step}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) {
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

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 shrink-0 border-0" style={{ width: "132px", borderWidth: "0px" }}>
            <button
              type="button"
              disabled={unit === "auto"}
              onClick={() => {
                const newVal = Math.max(currentLimit.min, (numericValue || 0) - currentLimit.step);
                handleNumericChange(parseFloat(newVal.toFixed(3)));
              }}
              className="w-[25px] h-[25px] rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-650 hover:bg-stone-100 active:bg-stone-250 transition-colors shadow-2xs cursor-pointer select-none disabled:opacity-50"
            >
              -
            </button>

            <div className="relative flex items-center">
              <input
                type="text"
                value={currentPropertyValue || ""}
                onChange={(e) => handleCurrentPropertyChange(e.target.value)}
                placeholder="0px/auto"
                className="w-[71px] bg-stone-50 border border-indigo-500/10 focus:border-indigo-500 rounded-xl px-1.5 py-1 text-center text-[10px] focus:outline-none font-mono text-indigo-700 font-extrabold focus:bg-white shadow-2xs transition-all"
              />
            </div>

            <button
              type="button"
              disabled={unit === "auto"}
              onClick={() => {
                const newVal = Math.min(currentLimit.max, (numericValue || 0) + currentLimit.step);
                handleNumericChange(parseFloat(newVal.toFixed(3)));
              }}
              className="w-[25px] h-[25px] rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-650 hover:bg-stone-100 active:bg-stone-250 transition-colors shadow-2xs cursor-pointer select-none disabled:opacity-50"
            >
              +
            </button>
          </div>

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

      <div className="flex items-start gap-1.5 p-2 bg-indigo-50/30 border border-indigo-100/45 rounded-xl z-10 relative">
        <Info size={11} className="text-indigo-600 shrink-0 mt-0.5" />
        <p className="text-[9px] leading-normal text-stone-550 font-medium select-none">
          The <b>{activeProperty}</b> property controls spacing <em>outside</em> the element's block layout. Supports absolute, percentage, and <code>auto</code> centering logic for Block containers. Note: margin collapsing rules may apply.
        </p>
      </div>

    </div>
  );
}
