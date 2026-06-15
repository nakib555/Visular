import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { 
  Move, 
  ArrowUp, 
  ArrowRight, 
  ArrowDown, 
  ArrowLeft, 
  Info, 
  RotateCcw, 
  Check, 
  Settings2,
  AlertTriangle,
  Lightbulb,
  CornerRightDown,
  Expand,
  Maximize,
  Compass,
  Zap,
  Sliders,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface OffsetPreset {
  label: string;
  value: string;
  description: string;
  offsets: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  icon: React.ComponentType<any>;
  badgeColor: string;
  borderColor: string;
}

const PRESETS: OffsetPreset[] = [
  {
    label: "Full Stretch Overlay",
    value: "stretch",
    description: "Fills the entire parent container (or viewport if fixed)",
    offsets: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    icon: Expand,
    badgeColor: "text-indigo-600 bg-indigo-50 border-indigo-120",
    borderColor: "border-indigo-100"
  },
  {
    label: "Absolute Centering",
    value: "center",
    description: "Aligns top & left to 50%. Needs transform (-50%, -50%)",
    offsets: { top: "50%", right: "auto", bottom: "auto", left: "50%" },
    icon: Compass,
    badgeColor: "text-emerald-600 bg-emerald-50 border-emerald-120",
    borderColor: "border-emerald-100"
  },
  {
    label: "Header Sticky Pin",
    value: "sticky-header",
    description: "Sticky layout pinned to the very top edge with full width",
    offsets: { top: "0px", right: "0px", bottom: "auto", left: "0px" },
    icon: ArrowUp,
    badgeColor: "text-amber-600 bg-amber-50 border-amber-120",
    borderColor: "border-amber-100"
  },
  {
    label: "Floating Bot-Right",
    value: "fab-right",
    description: "Standard coordinates for chat badges or floating system cards",
    offsets: { top: "auto", right: "24px", bottom: "24px", left: "auto" },
    icon: CornerRightDown,
    badgeColor: "text-rose-600 bg-rose-50 border-rose-120",
    borderColor: "border-rose-100"
  }
];

interface PositionTypeOption {
  value: string;
  label: string;
  desc: string;
  icon: React.ComponentType<any>;
  badgeBg: string;
  badgeContent: React.ReactNode;
}

const POSITION_TYPES: PositionTypeOption[] = [
  {
    value: "static",
    label: "Static",
    desc: "Default layout flow. Offsets are ignored.",
    icon: Sliders,
    badgeBg: "bg-stone-50 border border-stone-200/65 p-1 rounded-lg w-9 h-7 flex items-center justify-center",
    badgeContent: (
      <div className="flex flex-col gap-[2.5px] w-4 items-center">
        <div className="w-full h-[2.5px] bg-stone-400 rounded-px" />
        <div className="w-full h-[2.5px] bg-stone-450 rounded-px" />
        <div className="w-full h-[2.5px] bg-stone-400 rounded-px" />
      </div>
    )
  },
  {
    value: "relative",
    label: "Relative",
    desc: "Offset relative to its original flow position.",
    icon: Sliders,
    badgeBg: "bg-indigo-50/90 border border-indigo-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center",
    badgeContent: (
      <div className="w-[18px] h-[18px] border border-indigo-300 border-dashed rounded-sm flex items-center justify-center relative">
         <div className="w-[10px] h-[10px] bg-indigo-500 rounded-sm absolute -top-[3.5px] -left-[3.5px]" />
      </div>
    )
  },
  {
    value: "absolute",
    label: "Absolute",
    desc: "Offset relative to nearest positioned ancestor.",
    icon: Compass,
    badgeBg: "bg-purple-50/90 border border-purple-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-2 border-purple-350 rounded-sm flex items-center justify-center relative">
         <div className="w-[8px] h-[8px] bg-purple-500 rounded-sm absolute top-[1px] right-[1px]" />
      </div>
    )
  },
  {
    value: "fixed",
    label: "Fixed",
    desc: "Offset relative to viewport frame. Stays in place.",
    icon: Maximize,
    badgeBg: "bg-rose-50/90 border border-rose-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center",
    badgeContent: (
      <div className="w-[18px] h-[18px] border border-rose-400 border-dashed rounded-sm flex items-center justify-center relative">
         <div className="w-[10px] h-[10px] bg-rose-500 rounded-sm absolute top-0 left-0" />
      </div>
    )
  },
  {
    value: "sticky",
    label: "Sticky",
    desc: "Scrolls normally, pins when reaching offset threshold.",
    icon: Zap,
    badgeBg: "bg-amber-50/90 border border-amber-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-t-2 border-amber-500 rounded-[2px] flex items-center justify-center relative">
         <div className="w-[8px] h-[8px] bg-amber-400 rounded-sm absolute bottom-[1px]" />
      </div>
    )
  }
];

interface PositionPropertyOption {
  value: "inset" | "top" | "right" | "bottom" | "left";
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  badgeBg: string;
  badgeContent: React.ReactNode;
}

const positionPropertyOptions: PositionPropertyOption[] = [
  {
    value: "inset",
    label: "All Sides (inset)",
    description: "Applies edge offsets to all four sides simultaneously",
    icon: Expand,
    badgeBg: "bg-indigo-50/90 border border-indigo-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-2 border-indigo-400 rounded-sm flex items-center justify-center">
         <div className="w-[10px] h-[10px] bg-indigo-500 rounded-sm" />
      </div>
    )
  },
  {
    value: "top",
    label: "Top Offset (top)",
    description: "Offset distance from the top bounds",
    icon: ArrowUp,
    badgeBg: "bg-sky-50/90 border border-sky-100/70 p-1 rounded-lg w-9 h-7 flex flex-col items-center justify-center",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-t-2 border-sky-400 border-dotted rounded-sm flex flex-col pt-[2px] items-center">
         <div className="w-[8px] h-[4px] bg-sky-550 rounded-[1px]" />
      </div>
    )
  },
  {
    value: "right",
    label: "Right Offset (right)",
    description: "Offset distance from the right bounds",
    icon: ArrowRight,
    badgeBg: "bg-emerald-50/90 border border-emerald-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center pr-0.5",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-r-2 border-emerald-450 border-dotted rounded-sm flex justify-end pr-[2px] items-center">
         <div className="w-[4px] h-[8px] bg-emerald-500 rounded-[1px]" />
      </div>
    )
  },
  {
    value: "bottom",
    label: "Bottom Offset (bottom)",
    description: "Offset distance from the bottom bounds",
    icon: ArrowDown,
    badgeBg: "bg-rose-50/90 border border-rose-100/70 p-1 rounded-lg w-9 h-7 flex flex-col items-center justify-center pb-0.5",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-b-2 border-rose-450 border-dotted rounded-sm flex flex-col justify-end pb-[2px] items-center">
         <div className="w-[8px] h-[4px] bg-rose-550 rounded-[1px]" />
      </div>
    )
  },
  {
    value: "left",
    label: "Left Offset (left)",
    description: "Offset distance from the left bounds",
    icon: ArrowLeft,
    badgeBg: "bg-amber-50/90 border border-amber-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center pl-0.5",
    badgeContent: (
      <div className="w-[18px] h-[18px] border-l-2 border-amber-450 border-dotted rounded-sm flex pl-[2px] items-center">
         <div className="w-[4px] h-[8px] bg-amber-500 rounded-[1px]" />
      </div>
    )
  }
];

// Helper to parse `inset` string into 4 components [top, right, bottom, left]
function parseInsetValue(insetStr: string): { top: string; right: string; bottom: string; left: string } {
  if (!insetStr) {
    return { top: "auto", right: "auto", bottom: "auto", left: "auto" };
  }
  
  const parts = insetStr.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { top: "auto", right: "auto", bottom: "auto", left: "auto" };
  }
  
  let top = "auto";
  let right = "auto";
  let bottom = "auto";
  let left = "auto";
  
  if (parts.length === 1) {
    top = right = bottom = left = parts[0];
  } else if (parts.length === 2) {
    top = bottom = parts[0];
    right = left = parts[1];
  } else if (parts.length === 3) {
    top = parts[0];
    right = left = parts[1];
    bottom = parts[2];
  } else if (parts.length >= 4) {
    top = parts[0];
    right = parts[1];
    bottom = parts[2];
    left = parts[3];
  }
  
  return { top, right, bottom, left };
}

// Helper to compile top, right, bottom, left back into a single clean shorthand string
function compileInsetValue(top: string, right: string, bottom: string, left: string): string {
  const t = top || "auto";
  const r = right || "auto";
  const b = bottom || "auto";
  const l = left || "auto";
  
  // if all are the same
  if (t === r && r === b && b === l) {
    return t;
  }
  // if top/bottom are same, right/left are same
  if (t === b && r === l) {
    return `${t} ${r}`;
  }
  // if right/left are same but top/bottom differ
  if (r === l) {
    return `${t} ${r} ${b}`;
  }
  return `${t} ${r} ${b} ${l}`;
}

interface PositionOffsetsControlProps {
  value: string;
  onChange: (val: string) => void;
  positionValue: string;
  onPositionChange: (val: string) => void;
  topValue?: string;
  rightValue?: string;
  bottomValue?: string;
  leftValue?: string;
  onTopChange?: (val: string) => void;
  onRightChange?: (val: string) => void;
  onBottomChange?: (val: string) => void;
  onLeftChange?: (val: string) => void;
}

export function PositionOffsetsControl({
  value = "auto",
  onChange,
  positionValue = "static",
  onPositionChange,
  topValue = "auto",
  rightValue = "auto",
  bottomValue = "auto",
  leftValue = "auto",
  onTopChange,
  onRightChange,
  onBottomChange,
  onLeftChange
}: PositionOffsetsControlProps) {
  
  const parsedInsetValue = useMemo(() => {
    return parseInsetValue(value);
  }, [value]);

  const activePosition = positionValue || "static";

  // Logical and Visual sync states:
  const [activeSide, setActiveSide] = useState<"top" | "right" | "bottom" | "left">("top");
  const [activeProperty, setActiveProperty] = useState<"inset" | "top" | "right" | "bottom" | "left">("inset");
  
  // Dropdowns opens states
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const [positionDropdownOpen, setPositionDropdownOpen] = useState(false);
  const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);

  // Refs for tracking click outside
  const unitDropdownRef = useRef<HTMLDivElement>(null);
  const positionDropdownRef = useRef<HTMLDivElement>(null);
  const propertyDropdownRef = useRef<HTMLDivElement>(null);

  // Trigger refs for portalled calculations
  const positionTriggerRef = useRef<HTMLButtonElement>(null);
  const propertyTriggerRef = useRef<HTMLButtonElement>(null);

  // Floating coordinates positions state for portalled overlays
  const [positionDropdownPos, setPositionDropdownPos] = useState<{
    top: number;
    left: number;
    width: number;
    bottom?: number;
    maxHeight?: number;
    placement: "top" | "bottom";
  } | null>(null);

  const [propertyDropdownPos, setPropertyDropdownPos] = useState<{
    top: number;
    left: number;
    width: number;
    bottom?: number;
    maxHeight?: number;
    placement: "top" | "bottom";
  } | null>(null);

  // Click outside listener matching Display layout strategy
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const targetElement = target as Element;

      if (unitDropdownRef.current && !unitDropdownRef.current.contains(target)) {
        setUnitDropdownOpen(false);
      }

      const isInsidePositionTrigger = positionTriggerRef.current?.contains(target);
      const isInsidePositionMenu = targetElement.closest("#position-mode-dropdown-menu");
      if (!isInsidePositionTrigger && !isInsidePositionMenu) {
        setPositionDropdownOpen(false);
      }

      const isInsidePropertyTrigger = propertyTriggerRef.current?.contains(target);
      const isInsidePropertyMenu = targetElement.closest("#active-offset-dropdown-menu");
      if (!isInsidePropertyTrigger && !isInsidePropertyMenu) {
        setPropertyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute position floating rect dynamically for Position dropdown
  useEffect(() => {
    if (positionDropdownOpen && positionTriggerRef.current) {
      const updatePosition = () => {
        if (!positionTriggerRef.current) return;
        const rect = positionTriggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 300; // approximate menu maximum height

        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
          setPositionDropdownPos({
            placement: "top",
            bottom: window.innerHeight - rect.top + 8,
            left: rect.left,
            width: rect.width,
            top: 0,
            maxHeight: spaceAbove - 16
          });
        } else {
          setPositionDropdownPos({
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
        if (e.target instanceof Element && e.target.closest("#position-mode-dropdown-menu")) return;
        updatePosition();
      };

      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [positionDropdownOpen]);

  // Compute property selection coordinates rect dynamically for Active Coordinate dropdown
  useEffect(() => {
    if (propertyDropdownOpen && propertyTriggerRef.current) {
      const updatePosition = () => {
        if (!propertyTriggerRef.current) return;
        const rect = propertyTriggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 300; // approximate menu maximum height

        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
          setPropertyDropdownPos({
            placement: "top",
            bottom: window.innerHeight - rect.top + 8,
            left: rect.left,
            width: rect.width,
            top: 0,
            maxHeight: spaceAbove - 16
          });
        } else {
          setPropertyDropdownPos({
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
        if (e.target instanceof Element && e.target.closest("#active-offset-dropdown-menu")) return;
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

  // Determine current active coordinate value being modified
  const currentPropertyValue = useMemo(() => {
    switch (activeProperty) {
      case "top": return topValue || parsedInsetValue.top || "auto";
      case "right": return rightValue || parsedInsetValue.right || "auto";
      case "bottom": return bottomValue || parsedInsetValue.bottom || "auto";
      case "left": return leftValue || parsedInsetValue.left || "auto";
      default: return value || "auto"; // inset
    }
  }, [activeProperty, value, topValue, rightValue, bottomValue, leftValue, parsedInsetValue]);

  // Handler for dispatching changes to the element logic flow
  const handleCurrentPropertyChange = (newVal: string) => {
    switch (activeProperty) {
      case "top": onTopChange?.(newVal); break;
      case "right": onRightChange?.(newVal); break;
      case "bottom": onBottomChange?.(newVal); break;
      case "left": onLeftChange?.(newVal); break;
      default: onChange(newVal); break; // inset
    }
  };

  // Sync unit based on the current parsed coordinate value
  const [activeUnit, setActiveUnit] = useState<"px" | "%" | "rem" | "auto">("px");
  useEffect(() => {
    if (currentPropertyValue === "auto" || currentPropertyValue === "") {
      setActiveUnit("auto");
    } else if (currentPropertyValue.endsWith("%")) {
      setActiveUnit("%");
    } else if (currentPropertyValue.endsWith("rem")) {
      setActiveUnit("rem");
    } else {
      setActiveUnit("px");
    }
  }, [currentPropertyValue, activeProperty]);

  // Extract numeric part for range sliders
  const numericPart = useMemo(() => {
    if (currentPropertyValue === "auto" || currentPropertyValue === "") return 0;
    const num = parseFloat(currentPropertyValue);
    return isNaN(num) ? 0 : num;
  }, [currentPropertyValue]);

  // Triggered when preset templates are selected
  const handleApplyPreset = (preset: OffsetPreset) => {
    // Clear individual offset coordinates to prevent style conflicts
    onTopChange?.("");
    onRightChange?.("");
    onBottomChange?.("");
    onLeftChange?.("");
    
    // Write new composite inline value to inset shorthand
    onChange(compileInsetValue(
      preset.offsets.top,
      preset.offsets.right,
      preset.offsets.bottom,
      preset.offsets.left
    ));
    
    setActiveProperty("inset");
  };

  // Stepper / Range helper value updates
  const handleNumericScrub = (numVal: number) => {
    if (activeUnit === "auto") {
      handleCurrentPropertyChange("auto");
      return;
    }
    handleCurrentPropertyChange(`${numVal}${activeUnit}`);
  };

  const handleUnitToggle = (unit: "px" | "%" | "rem" | "auto") => {
    setActiveUnit(unit);
    if (unit === "auto") {
      handleCurrentPropertyChange("auto");
    } else {
      const isAuto = currentPropertyValue === "auto" || currentPropertyValue === "";
      const baseNum = isAuto ? 0 : numericPart;
      handleCurrentPropertyChange(`${baseNum}${unit}`);
    }
  };

  const isPositioned = useMemo(() => {
    return activePosition !== "static" && activePosition !== "";
  }, [activePosition]);

  // Find selected preset
  const activePreset = useMemo(() => {
    const normalize = (v: string) => (v || "auto").trim();
    return PRESETS.find(p => 
      normalize(topValue) === normalize(p.offsets.top) &&
      normalize(rightValue) === normalize(p.offsets.right) &&
      normalize(bottomValue) === normalize(p.offsets.bottom) &&
      normalize(leftValue) === normalize(p.offsets.left)
    ) || null;
  }, [topValue, rightValue, bottomValue, leftValue]);

  // Contextual scale options for coordinates unit types
  const activeSidePresetValues = useMemo(() => {
    if (activeUnit === "%") return ["0%", "25%", "50%", "100%", "auto"];
    if (activeUnit === "rem") return ["0rem", "1rem", "2rem", "4rem", "auto"];
    return ["0px", "8px", "16px", "24px", "32px", "48px", "auto"];
  }, [activeUnit]);

  const unitLabels = {
    px: "Pixels (px)",
    rem: "Relative (rem)",
    "%": "Percent (%)",
    "auto": "Auto Space"
  };

  const isAnyDropdownOpen = unitDropdownOpen || positionDropdownOpen || propertyDropdownOpen;

  const currentPositionOption = useMemo(() => {
    return POSITION_TYPES.find(t => t.value === activePosition) || {
      value: activePosition,
      label: activePosition.charAt(0).toUpperCase() + activePosition.slice(1),
      desc: "Custom positioning setting",
      icon: Compass,
      badgeBg: "bg-indigo-50 border border-indigo-150 p-1 rounded-lg w-9 h-7 flex items-center justify-center",
      badgeContent: <div className="w-[10px] h-[10px] bg-indigo-500 rounded-sm" />
    };
  }, [activePosition]);

  const currentPropertyOption = useMemo(() => {
    return positionPropertyOptions.find(o => o.value === activeProperty) || {
      value: activeProperty,
      label: activeProperty,
      description: "Coordinates Offset Factor",
      icon: Expand,
      badgeBg: "bg-stone-50 border border-stone-250 p-1 rounded-lg w-9 h-7 flex items-center justify-center",
      badgeContent: <div className="w-[10px] h-[10px] bg-indigo-500 rounded-sm" />
    };
  }, [activeProperty]);

  return (
    <div className={`flex flex-col gap-5 w-full text-left relative transition-all duration-200 ${
      isAnyDropdownOpen ? "z-[250]" : "z-10"
    }`}>
      
      {/* 1. Header label with layout info */}
      <div className="flex items-center justify-between pl-1 select-none flex-shrink-0">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700">
              <Compass size={11} className="stroke-[2.5]" />
            </span>
            <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">
              Positioning Engine & Coordinates
            </label>
          </div>
          <span className="text-[11px] text-stone-400 font-medium font-mono pl-6">
            position / inset / offsets
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono pointer-events-none">
          <span className="text-[9.5px]/none bg-indigo-600 font-extrabold text-white px-2.5 py-1 rounded-full shadow-2xs">
            {activePosition}
          </span>
        </div>
      </div>

      {/* 2. Position Mode Dropdown */}
      <div className="flex flex-col gap-1.5 relative z-10" ref={positionDropdownRef}>
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono flex justify-between select-none">
          <span>Position Mode</span>
          <span className="text-[10px] font-mono font-bold text-stone-400 select-all normal-case">
            position: {activePosition}
          </span>
        </label>

        <button
          ref={positionTriggerRef}
          type="button"
          onClick={() => setPositionDropdownOpen(!positionDropdownOpen)}
          className={`w-full bg-white border ${
            positionDropdownOpen ? "border-indigo-400 ring-4 ring-indigo-500/10" : "border-stone-200/85 hover:border-stone-300"
          } rounded-2xl p-3 flex items-center justify-between shadow-xs transition-all cursor-pointer text-left focus:outline-none overflow-hidden`}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex items-center justify-center w-8 h-8 shrink-0 rounded-xl bg-stone-50 border border-stone-100 text-stone-500">
              <currentPositionOption.icon className="w-4 h-4 text-stone-600 shrink-0" />
            </div>
            <div className="flex flex-col min-w-0 pr-2 flex-1">
              <span className="text-xs font-bold text-stone-800 leading-tight truncate w-full">
                {currentPositionOption.label}
              </span>
              <span className="text-[10px] text-stone-400 leading-none mt-0.5 truncate w-full">
                position: {currentPositionOption.value}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className={`${currentPositionOption.badgeBg} shrink-0 flex items-center justify-center select-none scale-[0.9]`}>
              {currentPositionOption.badgeContent}
            </div>
            <ChevronDown
              size={14}
              className={`text-stone-400 transition-transform duration-250 shrink-0 ${
                positionDropdownOpen ? "rotate-180 text-indigo-500" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* 3. Active Offset Property Selector Dropdown */}
      <div className="flex flex-col gap-1.5 relative z-10" ref={propertyDropdownRef}>
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono flex justify-between select-none">
          <span>Active Coordinates Offset</span>
          <span className="text-[10px] font-mono font-bold text-stone-400 select-all normal-case">
            {activeProperty}: {currentPropertyValue}
          </span>
        </label>

        <button
          ref={propertyTriggerRef}
          type="button"
          onClick={() => setPropertyDropdownOpen(!propertyDropdownOpen)}
          className={`w-full bg-white border ${
            propertyDropdownOpen ? "border-indigo-400 ring-4 ring-indigo-500/10" : "border-stone-200/85 hover:border-stone-300"
          } rounded-2xl p-3 flex items-center justify-between shadow-xs transition-all cursor-pointer text-left focus:outline-none overflow-hidden`}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex items-center justify-center w-8 h-8 shrink-0 rounded-xl bg-stone-50 border border-stone-100 text-stone-500">
              <currentPropertyOption.icon className="w-4 h-4 text-stone-600 shrink-0" />
            </div>
            <div className="flex flex-col min-w-0 pr-2 flex-1">
              <span className="text-xs font-bold text-stone-800 leading-tight truncate w-full">
                {currentPropertyOption.label}
              </span>
              <span className="text-[10px] text-stone-400 leading-none mt-0.5 truncate w-full">
                {currentPropertyOption.value}: {currentPropertyValue}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className={`${currentPropertyOption.badgeBg} shrink-0 flex items-center justify-center select-none scale-[0.9]`}>
              {currentPropertyOption.badgeContent}
            </div>
            <ChevronDown
              size={14}
              className={`text-stone-400 transition-transform duration-250 shrink-0 ${
                propertyDropdownOpen ? "rotate-180 text-indigo-500" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* 4. Warn about Static lock constraints */}
      {!isPositioned && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-amber-50 to-amber-50/35 border border-amber-200/60 p-4 rounded-2xl flex flex-col gap-3 relative z-10 shadow-3xs"
        >
          <div className="flex gap-2.5 items-start">
            <div className="p-1 px-1.5 bg-amber-100/80 border border-amber-200/40 text-amber-800 rounded-lg shrink-0 mt-0.5">
              <AlertTriangle size={13} className="stroke-[2.5]" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest font-mono">
                Coordinate Lock Active
              </span>
              <p className="text-[9.5px] text-amber-800/90 leading-relaxed mt-0.5">
                Active offsets have <b>zero effect</b> while positioned as <code>static</code>. Unlock physical offsets by setting standard positioning coordinate flow values:
              </p>
            </div>
          </div>
          <div className="flex gap-1.5 justify-end">
            <button
              type="button"
              onClick={() => onPositionChange("relative")}
              className="text-[9px] font-mono font-bold bg-amber-600 text-white hover:bg-amber-700 transition-colors px-3 py-1.5 rounded-xl cursor-pointer shadow-3xs flex items-center gap-1 hover:shadow-2xs"
            >
              <span>relative</span>
            </button>
            <button
              type="button"
              onClick={() => onPositionChange("absolute")}
              className="text-[9px] font-mono font-bold bg-white hover:bg-amber-100 border border-amber-200 text-amber-900 transition-colors px-3 py-1.5 rounded-xl cursor-pointer shadow-3xs"
            >
              <span>absolute</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* 5. Split Section: Interactive Layout Deck */}
      <div className="flex flex-col md:flex-row gap-5 items-stretch select-none">
        
        {/* Right Side Adjustment Deck Card */}
        <div className="flex-1 bg-white border border-stone-200 rounded-2xl p-4.5 flex flex-col justify-between gap-3.5 shadow-3xs overflow-visible">
          
          <div className="flex items-center justify-between border-b border-stone-100 pb-2.5 relative overflow-visible">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-150 text-indigo-700 text-[10px] font-mono font-black uppercase">
                {activeProperty}
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-stone-700 leading-tight">
                  Line Vector Tuning
                </span>
                <span className="text-[8px] font-mono text-stone-400">
                  Editing {activeProperty} factors
                </span>
              </div>
            </div>

            {/* Elegant Dropdown for active unit selection */}
            <div className="relative" ref={unitDropdownRef}>
              <button
                type="button"
                onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
                className="flex items-center gap-1 bg-stone-100 border border-stone-200/60 hover:border-indigo-300 hover:bg-indigo-50/20 px-2.5 py-1 rounded-lg text-stone-750 font-mono text-[9px] font-extrabold transition-all duration-150 cursor-pointer shadow-3xs"
              >
                <span>{activeUnit.toUpperCase()} Unit</span>
                <ChevronDown size={11} className={`text-stone-400 font-extrabold transition-transform duration-250 ${unitDropdownOpen ? "rotate-180 text-indigo-600" : ""}`} />
              </button>

              <AnimatePresence>
                {unitDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 mt-1.5 w-36 bg-white border border-stone-150 rounded-xl shadow-lg p-1 z-[999] flex flex-col gap-0.5"
                  >
                    {(["px", "%", "rem", "auto"] as const).map((u) => {
                      const isSelected = u === activeUnit;
                      return (
                        <button
                          key={u}
                          type="button"
                          onClick={() => {
                            handleUnitToggle(u);
                            setUnitDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded-lg text-[9.5px] font-semibold flex items-center justify-between transition-all duration-150 cursor-pointer ${
                            isSelected
                              ? "bg-indigo-500/10 text-indigo-850 font-bold"
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

          {/* Stepper with Custom increments */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider font-mono">
              Vector Length Value
            </span>
            <div className="flex items-center justify-between gap-2.5 bg-stone-50 border border-stone-200 rounded-xl p-1.5">
              <button
                type="button"
                onClick={() => {
                  const unit = activeUnit === "auto" ? "px" : activeUnit;
                  const step = unit === "%" ? 5 : unit === "rem" ? 0.25 : 4;
                  const target = Math.round((numericPart - step) * 100) / 100;
                  handleCurrentPropertyChange(`${target}${unit}`);
                }}
                className="w-8 h-8 rounded-lg bg-white border border-stone-200/80 flex items-center justify-center text-sm font-black text-stone-600 hover:bg-stone-100 cursor-pointer select-none"
              >
                -
              </button>
              
              <input
                type="text"
                value={currentPropertyValue}
                onChange={(e) => handleCurrentPropertyChange(e.target.value)}
                placeholder="auto"
                className="w-20 bg-transparent text-center font-mono font-black text-xs text-indigo-700 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => {
                  const unit = activeUnit === "auto" ? "px" : activeUnit;
                  const step = unit === "%" ? 5 : unit === "rem" ? 0.25 : 4;
                  const target = Math.round((numericPart + step) * 100) / 100;
                  handleCurrentPropertyChange(`${target}${unit}`);
                }}
                className="w-8 h-8 rounded-lg bg-white border border-stone-200/80 flex items-center justify-center text-sm font-black text-stone-600 hover:bg-stone-100 cursor-pointer select-none"
              >
                +
              </button>
            </div>
          </div>

          {/* Scrubber slider */}
          <div className="flex flex-col gap-1 bg-stone-50 p-2.5 rounded-xl border border-stone-100 select-none">
            <div className="flex justify-between items-center text-[7.5px] font-mono text-stone-400 font-bold">
              <span>SCRUB ADJUSTER:</span>
              <span>{numericPart}{activeUnit === "auto" ? "px" : activeUnit}</span>
            </div>
            <input
              type="range"
              min={activeUnit === "%" ? "0" : "0"}
              max={activeUnit === "%" ? "100" : activeUnit === "rem" ? "16" : "120"}
              step={activeUnit === "rem" ? "0.25" : "1"}
              value={numericPart}
              disabled={activeUnit === "auto"}
              onChange={(e) => handleNumericScrub(parseFloat(e.target.value))}
              className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-600 disabled:opacity-30"
            />
          </div>

          {/* Preset contextual factors */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider font-mono">
              Quick Factors
            </span>
            <div className="flex flex-wrap gap-1">
              {activeSidePresetValues.map((opt) => {
                const isSelected = currentPropertyValue === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleCurrentPropertyChange(opt)}
                    className={`text-[9.5px] font-mono px-2 py-1 rounded-lg border transition-all cursor-pointer select-none ${
                      isSelected 
                        ? "bg-indigo-600 border-indigo-650 text-white font-extrabold shadow-3xs"
                        : "bg-white hover:bg-stone-50 border-stone-200 text-stone-550 hover:text-stone-750 hover:border-stone-300"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* 6. Custom Coordinate presets grid */}
      <div className="flex flex-col gap-2.5 select-none relative z-10 pt-1 border-t border-stone-200/50">
        <span className="text-[9.5px] font-black text-stone-450 uppercase tracking-wider font-mono pl-1 flex items-center gap-1.5">
          <Settings2 size={11} className="text-stone-400" />
          <span>Composite Bound Coordinate Templates</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PRESETS.map((preset) => {
            const isSelected = activePreset?.value === preset.value;
            const Icon = preset.icon;

            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between shadow-3xs ${
                  isSelected
                    ? "bg-white border-indigo-400 shadow-sm ring-1 ring-indigo-500/10"
                    : "bg-white hover:bg-stone-100/30 border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="flex items-center gap-2.5 max-w-[85%] font-sans">
                  <div className={`p-1.5 rounded-xl border flex-shrink-0 flex items-center justify-center ${isSelected ? "bg-indigo-50 border-indigo-150 text-indigo-650" : "bg-stone-50 border-stone-150 text-stone-500"}`}>
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className={`text-[10px]/tight font-extrabold truncate ${isSelected ? "text-stone-850" : "text-stone-650"}`}>
                      {preset.label}
                    </span>
                    <span className="text-[8px] text-stone-400 leading-tight truncate mt-0.5">
                      {preset.description}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 ml-1">
                  {isSelected ? (
                    <div className="bg-indigo-600 text-white p-0.5 rounded-full shadow-3xs flex items-center justify-center">
                      <Check size={9} className="stroke-[3.5]" />
                    </div>
                  ) : (
                    <span className={`text-[7.5px] font-mono leading-none font-bold px-1.5 py-0.5 rounded-md border ${preset.badgeColor}`}>
                      {preset.value}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. GPU Performance */}
      <div className="bg-indigo-50/40 border border-indigo-100/30 p-4 rounded-2xl flex items-start gap-2.5 relative z-10 select-none">
        <div className="p-1 rounded-lg bg-indigo-100/60 text-indigo-800 shrink-0 mt-0.5 flex items-center justify-center">
          <Lightbulb size={13} className="stroke-[2.5]" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest font-mono">
            GPU Performance Vector
          </span>
          <p className="text-[9.5px]/relaxed text-stone-500 font-medium font-sans">
            Offset variables can cause browser recalculations. For translation animations, pair offsets with GPU-bound <b>transform: translate3d()</b> parameters to run transitions smoothly at 120 FPS.
          </p>
        </div>
      </div>

      {/* Structured Portalled Overlay - Position Mode Dropdown */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {positionDropdownOpen && positionDropdownPos && (
            <motion.div
              initial={{ opacity: 0, y: positionDropdownPos.placement === "top" ? 6 : -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="fixed bg-white border border-stone-200 rounded-3xl p-3 shadow-2xl z-[999999] flex flex-col"
              id="position-mode-dropdown-menu"
              style={{
                top: positionDropdownPos.placement === "bottom" ? positionDropdownPos.top : "auto",
                bottom: positionDropdownPos.placement === "top" ? positionDropdownPos.bottom : "auto",
                left: positionDropdownPos.left,
                width: positionDropdownPos.width,
                maxHeight: positionDropdownPos.maxHeight ? positionDropdownPos.maxHeight : "auto",
              }}
            >
              <div className="text-[9.5px] uppercase font-bold tracking-wider text-indigo-650 font-mono mb-2 flex items-center gap-1.5 pl-1.5 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span>Select Position Mode</span>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1 pr-1 pb-1">
                {POSITION_TYPES.map((opt) => {
                  const isSelected = activePosition === opt.value;
                  const Icon = opt.icon;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onPositionChange(opt.value);
                        setPositionDropdownOpen(false);
                      }}
                      className={`group relative text-left p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-row items-center gap-3 ${
                        isSelected
                          ? "bg-indigo-50/40 border-indigo-200 shadow-sm"
                          : "bg-stone-50/40 hover:bg-stone-50 border-stone-200/60 hover:border-stone-300"
                      }`}
                    >
                      <div className="flex-1 flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-600" : "text-stone-550 group-hover:text-stone-850"}`} />
                          <span className={`text-[11px] font-extrabold tracking-tight ${isSelected ? "text-indigo-900" : "text-stone-700 group-hover:text-stone-900"}`}>
                            {opt.label}
                          </span>
                        </div>
                        <div className="text-[9.5px] text-stone-450 group-hover:text-stone-550 leading-snug">
                          {opt.desc}
                        </div>
                      </div>

                      <div className={`${opt.badgeBg} w-9 h-7 flex-shrink-0 flex items-center justify-center relative`}>
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

              <div className="border-t border-stone-100 mt-2 pt-2 text-center flex-shrink-0">
                <span className="text-[8.5px] text-stone-450 font-mono">
                  Coordinates behavior changes based on layout position type
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Structured Portalled Overlay - Active Offset Property Selector */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {propertyDropdownOpen && propertyDropdownPos && (
            <motion.div
              initial={{ opacity: 0, y: propertyDropdownPos.placement === "top" ? 6 : -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="fixed bg-white border border-stone-200 rounded-3xl p-3 shadow-2xl z-[999999] flex flex-col"
              id="active-offset-dropdown-menu"
              style={{
                top: propertyDropdownPos.placement === "bottom" ? propertyDropdownPos.top : "auto",
                bottom: propertyDropdownPos.placement === "top" ? propertyDropdownPos.bottom : "auto",
                left: propertyDropdownPos.left,
                width: propertyDropdownPos.width,
                maxHeight: propertyDropdownPos.maxHeight ? propertyDropdownPos.maxHeight : "auto",
              }}
            >
              <div className="text-[9.5px] uppercase font-bold tracking-wider text-indigo-650 font-mono mb-2 flex items-center gap-1.5 pl-1.5 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span>Select active offsets context</span>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1 pr-1 pb-1">
                {positionPropertyOptions.map((opt) => {
                  const isSelected = activeProperty === opt.value;
                  const Icon = opt.icon;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setActiveProperty(opt.value);
                        if (opt.value !== "inset") {
                          setActiveSide(opt.value);
                        }
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
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-600" : "text-stone-550 group-hover:text-stone-850"}`} />
                          <span className={`text-[11px] font-extrabold tracking-tight ${isSelected ? "text-indigo-900" : "text-stone-700 group-hover:text-stone-900"}`}>
                            {opt.label}
                          </span>
                        </div>
                        <div className="text-[9.5px] text-stone-450 group-hover:text-stone-550 leading-snug">
                          {opt.description}
                        </div>
                      </div>

                      <div className={`${opt.badgeBg} w-9 h-7 flex-shrink-0 flex items-center justify-center relative`}>
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

              <div className="border-t border-stone-100 mt-2 pt-2 text-center flex-shrink-0">
                <span className="text-[8.5px] text-stone-450 font-mono">
                  Modify individual properties or all boundaries simultaneously
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
}
