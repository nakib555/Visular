import React, { useState, useEffect, useMemo, useRef } from "react";
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

const POSITION_TYPES = [
  { value: "static", label: "Static", desc: "Default layout flow. Offsets are ignored." },
  { value: "relative", label: "Relative", desc: "Offset relative to its original flow position." },
  { value: "absolute", label: "Absolute", desc: "Offset relative to nearest positioned ancestor." },
  { value: "fixed", label: "Fixed", desc: "Offset relative to viewport frame. Stays in place." },
  { value: "sticky", label: "Sticky", desc: "Scrolls normally, pins when reaching offset threshold." }
];

interface PositionOffsetsControlProps {
  topValue: string;
  rightValue: string;
  bottomValue: string;
  leftValue: string;
  positionValue: string;
  onTopChange: (val: string) => void;
  onRightChange: (val: string) => void;
  onBottomChange: (val: string) => void;
  onLeftChange: (val: string) => void;
  onPositionChange: (val: string) => void;
}

export function PositionOffsetsControl({
  topValue,
  rightValue,
  bottomValue,
  leftValue,
  positionValue = "static",
  onTopChange,
  onRightChange,
  onBottomChange,
  onLeftChange,
  onPositionChange
}: PositionOffsetsControlProps) {
  
  // Local state for active side selection in visual diagram
  const [activeSide, setActiveSide] = useState<"top" | "right" | "bottom" | "left">("top");
  const [activeUnit, setActiveUnit] = useState<"px" | "%" | "rem" | "auto">("px");
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside listener for units dropdown selection
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUnitDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unitLabels = {
    px: "Pixels (px)",
    rem: "Relative (rem)",
    "%": "Percent (%)",
    "auto": "Auto Space"
  };

  // Normalized active position value
  const activePosition = positionValue || "static";

  // Get current active offset based on selected side
  const currentSideValue = useMemo(() => {
    if (activeSide === "top") return topValue || "auto";
    if (activeSide === "right") return rightValue || "auto";
    if (activeSide === "bottom") return bottomValue || "auto";
    return leftValue || "auto";
  }, [activeSide, topValue, rightValue, bottomValue, leftValue]);

  // Sync back unit when active side changes
  useEffect(() => {
    if (currentSideValue === "auto" || currentSideValue === "") {
      setActiveUnit("auto");
    } else if (currentSideValue.endsWith("%")) {
      setActiveUnit("%");
    } else if (currentSideValue.endsWith("rem")) {
      setActiveUnit("rem");
    } else {
      setActiveUnit("px");
    }
  }, [currentSideValue, activeSide]);

  // Scrubbed helper numeric value for the active offset slider
  const numericPart = useMemo(() => {
    if (currentSideValue === "auto" || currentSideValue === "") return 0;
    const num = parseFloat(currentSideValue);
    return isNaN(num) ? 0 : num;
  }, [currentSideValue]);

  const handleApplyPreset = (preset: OffsetPreset) => {
    onTopChange(preset.offsets.top);
    onRightChange(preset.offsets.right);
    onBottomChange(preset.offsets.bottom);
    onLeftChange(preset.offsets.left);
  };

  const updateOffsetSide = (side: "top" | "right" | "bottom" | "left", val: string) => {
    if (side === "top") onTopChange(val);
    else if (side === "right") onRightChange(val);
    else if (side === "bottom") onBottomChange(val);
    else onLeftChange(val);
  };

  const handleNumericScrub = (numVal: number) => {
    if (activeUnit === "auto") {
      updateOffsetSide(activeSide, "0px");
      setActiveUnit("px");
      return;
    }
    const unitSfx = activeUnit;
    updateOffsetSide(activeSide, `${numVal}${unitSfx}`);
  };

  const handleUnitToggle = (unit: "px" | "%" | "rem" | "auto") => {
    setActiveUnit(unit);
    if (unit === "auto") {
      updateOffsetSide(activeSide, "auto");
    } else {
      // Re-apply existing number with new unit
      const isAuto = currentSideValue === "auto" || currentSideValue === "";
      const baseNum = isAuto ? 0 : numericPart;
      updateOffsetSide(activeSide, `${baseNum}${unit}`);
    }
  };

  const isPositioned = useMemo(() => {
    return activePosition !== "static" && activePosition !== "";
  }, [activePosition]);

  // Check if current coordinate values match a preset exactly
  const activePreset = useMemo(() => {
    const normalize = (v: string) => (v || "auto").trim();
    return PRESETS.find(p => 
      normalize(topValue) === normalize(p.offsets.top) &&
      normalize(rightValue) === normalize(p.offsets.right) &&
      normalize(bottomValue) === normalize(p.offsets.bottom) &&
      normalize(leftValue) === normalize(p.offsets.left)
    ) || null;
  }, [topValue, rightValue, bottomValue, leftValue]);

  const activeSidePresetValues = useMemo(() => {
    if (activeUnit === "%") return ["0%", "25%", "50%", "100%", "auto"];
    if (activeUnit === "rem") return ["0rem", "1rem", "2rem", "4rem", "auto"];
    return ["0px", "8px", "16px", "24px", "32px", "48px", "auto"];
  }, [activeUnit]);

  return (
    <div className="flex flex-col gap-5 w-full text-left bg-stone-50 p-6 rounded-[28px] border border-stone-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] relative overflow-visible z-10">
      
      {/* 1. Header with Metadata Label */}
      <div className="flex items-center justify-between pl-1 select-none">
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
            position / top / right / bottom / left
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-[9.5px]/none bg-indigo-600 font-extrabold text-white px-2.5 py-1 rounded-full shadow-2xs">
            {activePosition}
          </span>
        </div>
      </div>

      {/* 2. Custom Segments Position Switcher bar */}
      <div className="flex flex-col gap-1.5 bg-white p-1 rounded-2xl border border-stone-200/80 shadow-3xs max-w-full">
        <div className="grid grid-cols-5 gap-1">
          {POSITION_TYPES.map((t) => {
            const isActive = activePosition === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => onPositionChange(t.value)}
                className={`relative py-2.5 px-1 rounded-xl transition-all font-mono font-black text-[9.5px] uppercase tracking-wide cursor-pointer flex flex-col items-center justify-center gap-1 select-none ${
                  isActive
                    ? "bg-stone-900 border border-stone-950 text-white shadow-sm font-black"
                    : "bg-transparent text-stone-550 hover:text-stone-850 hover:bg-stone-100/40"
                }`}
                title={t.desc}
              >
                {isActive && (
                  <motion.div
                    layoutId="pos-active-pill"
                    className="absolute inset-0 bg-stone-900 rounded-xl"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}
                <span className="z-10 leading-none">{t.label}</span>
              </button>
            );
          })}
        </div>
        
        {/* Intrinsic interactive position contextual indicator text */}
        <div className="px-2.5 py-1.5 bg-stone-50/50 rounded-xl border border-stone-100 flex items-center justify-between">
          <span className="text-[8.5px] font-mono font-bold text-stone-450 uppercase flex items-center gap-1">
            <Zap size={10} className="text-amber-500" />
            <span>Scope Impact</span>
          </span>
          <span className="text-[9px] text-stone-500 font-medium text-right truncate max-w-[80%]">
            {POSITION_TYPES.find(t => t.value === activePosition)?.desc}
          </span>
        </div>
      </div>

      {/* 3. Warn about Static lock constraints */}
      {!isPositioned && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-amber-50 to-amber-50/30 border border-amber-200/80 p-4 rounded-2xl flex flex-col gap-3 relative z-10 shadow-3xs"
        >
          <div className="flex gap-2.5 items-start">
            <div className="p-1 px-1.5 bg-amber-100/80 border border-amber-200/50 text-amber-800 rounded-lg shrink-0 mt-0.5">
              <AlertTriangle size={13} className="stroke-[2.5]" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest font-mono">
                Coordinate Lock Signal
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

      {/* 4. Split Section: Beautiful Interactive Layout Deck */}
      <div className="flex flex-col md:flex-row gap-5 items-stretch select-none">
        
        {/* Left Side Visual Deck Block - Off-White Refinement */}
        <div className="flex-1 min-h-[170px] bg-stone-100/70 rounded-2xl border border-stone-200 flex flex-col items-center justify-center p-5 relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 opacity-[0.45] pointer-events-none bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:14px_14px]" />
          
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-white/90 px-2 py-0.5 rounded-lg border border-stone-200 pointer-events-none shadow-3xs">
            <Maximize className="w-2.5 h-2.5 text-indigo-600" />
            <span className="text-[7.5px] font-mono tracking-widest text-stone-500 uppercase leading-none font-black">
              Directional Vectors
            </span>
          </div>

          {/* Interactive Core Box representation */}
          <div className="w-[125px] h-[125px] relative mt-1.5">
            
            {/* Center Dynamic Element container */}
            <div className="absolute inset-[26px] bg-white border border-stone-200 rounded-xl flex items-center justify-center flex-col p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.03)] z-15">
              <span className="text-[8.5px] font-mono font-extrabold text-stone-500 uppercase tracking-widest leading-none">
                Card
              </span>
              <span className="text-[7.5px] text-indigo-650 font-mono mt-1 font-extrabold truncate max-w-full">
                {activePosition}
              </span>
            </div>

            {/* TOP Sizing boundary Handle */}
            <button
              type="button"
              onClick={() => setActiveSide("top")}
              className={`absolute top-0 left-[26px] right-[26px] h-[22px] rounded-t-lg transition-all flex items-center justify-center cursor-pointer ${
                activeSide === "top"
                  ? "bg-indigo-600 border-b border-indigo-500 text-white shadow-md shadow-indigo-600/30 z-20 scale-y-105"
                  : "bg-white border hover:bg-stone-50 border-stone-200 text-stone-500 z-10 hover:text-stone-700 hover:border-stone-300"
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <ArrowUp size={8} className="stroke-[3.5]" />
                <span className="text-[7px] font-mono font-extrabold truncate max-w-[55px] leading-none">
                  {topValue || "auto"}
                </span>
              </div>
            </button>

            {/* RIGHT Sizing boundary Handle */}
            <button
              type="button"
              onClick={() => setActiveSide("right")}
              className={`absolute right-0 top-[26px] bottom-[26px] w-[22px] rounded-r-lg transition-all flex items-center justify-center cursor-pointer ${
                activeSide === "right"
                  ? "bg-indigo-600 border-l border-indigo-500 text-white shadow-md shadow-indigo-600/30 z-20 scale-x-105"
                  : "bg-white border hover:bg-stone-50 border-stone-200 text-stone-500 z-10 hover:text-stone-700 hover:border-stone-300"
              }`}
            >
              <div className="flex flex-col items-center gap-0.5 origin-center rotate-90">
                <ArrowRight size={8} className="stroke-[3.5] rotate-270" />
                <span className="text-[7px] font-mono font-extrabold truncate max-w-[55px] leading-none">
                  {rightValue || "auto"}
                </span>
              </div>
            </button>

            {/* BOTTOM Sizing boundary Handle */}
            <button
              type="button"
              onClick={() => setActiveSide("bottom")}
              className={`absolute bottom-0 left-[26px] right-[26px] h-[22px] rounded-b-lg transition-all flex items-center justify-center cursor-pointer ${
                activeSide === "bottom"
                  ? "bg-indigo-600 border-t border-indigo-500 text-white shadow-md shadow-indigo-600/30 z-20 scale-y-105"
                  : "bg-white border hover:bg-stone-50 border-stone-200 text-stone-500 z-10 hover:text-stone-700 hover:border-stone-300"
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[7px] font-mono font-extrabold truncate max-w-[55px] leading-none">
                  {bottomValue || "auto"}
                </span>
                <ArrowDown size={8} className="stroke-[3.5]" />
              </div>
            </button>

            {/* LEFT Sizing boundary Handle */}
            <button
              type="button"
              onClick={() => setActiveSide("left")}
              className={`absolute left-0 top-[26px] bottom-[26px] w-[22px] rounded-l-lg transition-all flex items-center justify-center cursor-pointer ${
                activeSide === "left"
                  ? "bg-indigo-600 border-r border-indigo-500 text-white shadow-md shadow-indigo-600/30 z-20 scale-x-105"
                  : "bg-white border hover:bg-stone-50 border-stone-200 text-stone-500 z-10 hover:text-stone-700 hover:border-stone-300"
              }`}
            >
              <div className="flex flex-col items-center gap-0.5 origin-center rotate-270">
                <span className="text-[7px] font-mono font-extrabold truncate max-w-[55px] leading-none">
                  {leftValue || "auto"}
                </span>
                <ArrowLeft size={8} className="stroke-[3.5] rotate-90" />
              </div>
            </button>

            {/* Radial radar ring highlights if targeted */}
            {activeSide === "top" && <div className="absolute top-[22px] left-[26px] right-[26px] h-[1.5px] bg-indigo-500/30 animate-pulse" />}
            {activeSide === "right" && <div className="absolute top-[26px] bottom-[26px] right-[22px] w-[1.5px] bg-indigo-500/30 animate-pulse" />}
            {activeSide === "bottom" && <div className="absolute bottom-[22px] left-[26px] right-[26px] h-[1.5px] bg-indigo-500/30 animate-pulse" />}
            {activeSide === "left" && <div className="absolute top-[26px] bottom-[26px] left-[22px] w-[1.5px] bg-indigo-500/30 animate-pulse" />}

          </div>
        </div>

        {/* Right Side Adjustment Deck Card */}
        <div className="flex-1 bg-white border border-stone-200/80 rounded-2xl p-4.5 flex flex-col justify-between gap-3.5 shadow-3xs overflow-visible">
          
          {/* Active side context indicator header to prevent confusion */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-2.5 relative overflow-visible">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-150 text-indigo-700 text-[10px] font-mono font-black uppercase">
                {activeSide}
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-stone-700 leading-tight">
                  Bound Adjustment
                </span>
                <span className="text-[8px] font-mono text-stone-400">
                  Editing position {activeSide} edge
                </span>
              </div>
            </div>

            {/* Elegant Dropdown for active unit selection instead of inline selectors */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
                className="flex items-center gap-1 bg-stone-100 border border-stone-200/60 hover:border-indigo-300 hover:bg-indigo-50/20 px-2 py-1 rounded-lg text-stone-750 font-mono text-[9px] font-extrabold transition-all duration-150 cursor-pointer shadow-3xs"
              >
                <span>{activeUnit.toUpperCase()} Unit</span>
                <ChevronDown size={11} className={`text-stone-400 font-extrabold transition-transform duration-200 ${unitDropdownOpen ? "rotate-180 text-indigo-600" : ""}`} />
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

          {/* Stepper block with Custom increments */}
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
                  updateOffsetSide(activeSide, `${target}${unit}`);
                }}
                className="w-8 h-8 rounded-lg bg-white border border-stone-200/80 flex items-center justify-center text-sm font-black text-stone-600 hover:bg-stone-100 cursor-pointer select-none"
              >
                -
              </button>
              
              <input
                type="text"
                value={currentSideValue}
                onChange={(e) => updateOffsetSide(activeSide, e.target.value)}
                placeholder="auto"
                className="w-20 bg-transparent text-center font-mono font-black text-xs text-indigo-700 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => {
                  const unit = activeUnit === "auto" ? "px" : activeUnit;
                  const step = unit === "%" ? 5 : unit === "rem" ? 0.25 : 4;
                  const target = Math.round((numericPart + step) * 100) / 100;
                  updateOffsetSide(activeSide, `${target}${unit}`);
                }}
                className="w-8 h-8 rounded-lg bg-white border border-stone-200/80 flex items-center justify-center text-sm font-black text-stone-600 hover:bg-stone-100 cursor-pointer select-none"
              >
                +
              </button>
            </div>
          </div>

          {/* Core Interactive Scrubber Slider */}
          <div className="flex flex-col gap-1 bg-stone-50 p-2.5 rounded-xl border border-stone-100 select-none">
            <div className="flex justify-between items-center text-[7.5px] font-mono text-stone-400 font-bold">
              <span>SCRUB ADJUSTMENT:</span>
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
              className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-650 disabled:opacity-30"
            />
          </div>

          {/* Spacing presets contextual list */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider font-mono">
              Quick Coordinate Factors
            </span>
            <div className="flex flex-wrap gap-1">
              {activeSidePresetValues.map((opt) => {
                const isSelected = currentSideValue === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      updateOffsetSide(activeSide, opt);
                    }}
                    className={`text-[9.5px] font-mono px-2 py-1 rounded-lg border transition-all cursor-pointer select-none ${
                      isSelected 
                        ? "bg-indigo-600 border-indigo-650 text-white font-extrabold shadow-3xs"
                        : "bg-white hover:bg-stone-50 border-stone-200 text-stone-550 hover:text-stone-850 hover:border-stone-300"
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

      {/* 5. Custom Coordinate presets grid */}
      <div className="flex flex-col gap-2.5 select-none relative z-10">
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
                <div className="flex items-center gap-2.5 max-w-[85%]">
                  <div className={`p-1.5 rounded-xl border flex-shrink-0 ${isSelected ? "bg-indigo-50 border-indigo-150" : "bg-stone-50 border-stone-150"}`}>
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-650" : "text-stone-500"}`} />
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
                    <div className="bg-indigo-600 text-white p-0.5 rounded-full shadow-3xs">
                      <Check size={9} className="stroke-[3.5]" />
                    </div>
                  ) : (
                    <span className={`text-[7.5px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${preset.badgeColor}`}>
                      {preset.value}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Professional standard Performance helper rules block */}
      <div className="bg-indigo-50/40 border border-indigo-100/50 p-4 rounded-2xl flex items-start gap-2.5 relative z-10 select-none">
        <div className="p-1 rounded-lg bg-indigo-100/60 text-indigo-800 shrink-0 mt-0.5">
          <Lightbulb size={13} className="stroke-[2.5]" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest font-mono">
            GPU Performance Vector
          </span>
          <p className="text-[9.5px] leading-relaxed text-stone-550 font-medium">
            Offset variables can cause browser recalculations. For translation animations, pair offsets with GPU-bound <b>transform: translate3d()</b> parameters to run transitions smoothly at 120 FPS.
          </p>
        </div>
      </div>

    </div>
  );
}
