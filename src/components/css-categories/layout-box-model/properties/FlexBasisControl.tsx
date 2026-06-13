import React, { useState, useEffect, useRef } from "react";
import { 
  Info, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Scale,
  Maximize2,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface FlexBasisControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function FlexBasisControl({ value, onChange }: FlexBasisControlProps) {
  const [inputValue, setInputValue] = useState("");
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [successIndicator, setSuccessIndicator] = useState(false);
  const [isGuidanceVisible, setIsGuidanceVisible] = useState(true);
  const [isGuidanceCollapsed, setIsGuidanceCollapsed] = useState(true); // default collapsed for space density
  const [showTooltip, setShowTooltip] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync internal input value on external change
  useEffect(() => {
    setInputValue(value || "auto");
  }, [value]);

  const showNotification = (message: string, isSuccess: boolean = false) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isSuccess) {
      setSuccessIndicator(true);
      setWarningMessage(null);
      timerRef.current = setTimeout(() => setSuccessIndicator(false), 2000);
    } else {
      setWarningMessage(message);
      setSuccessIndicator(false);
      timerRef.current = setTimeout(() => setWarningMessage(null), 3500);
    }
  };

  const sanitizeAndEmit = (rawValue: string) => {
    let cleanVal = rawValue.trim();

    // 1. Detect if negative value was attempted
    if (cleanVal.includes("-")) {
      showNotification("Negative sizing values are invalid for flex-basis!");
      cleanVal = cleanVal.replace(/-/g, "");
    }

    // 2. Validate unitless non-zero number (e.g. "100" without unit)
    const isUnitlessNonZero = /^[1-9]\d*$/.test(cleanVal);
    if (isUnitlessNonZero) {
      showNotification("Warning: Unitless non-zero numbers are invalid in CSS. Added 'px'.");
      cleanVal = cleanVal + "px";
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
    showNotification(`Preset "${preset}" selected`, true);
  };

  // Helper to parse the current value for slider controls
  const parseValueForSlider = () => {
    const val = inputValue.trim().toLowerCase();
    
    // Check for keywords
    if (["auto", "content", "max-content", "min-content", "fit-content"].includes(val)) {
      return { num: 100, unit: "px", isKeyword: true };
    }

    // Parse numeric + unit
    const match = val.match(/^([0-9.]+)\s*(px|%|em|rem|vw|vh)?$/);
    if (match) {
      const num = parseFloat(match[1]);
      const unit = match[2] || "px";
      return { num: isNaN(num) ? 0 : num, unit, isKeyword: false };
    }

    return { num: 0, unit: "px", isKeyword: false };
  };

  const { num, unit, isKeyword } = parseValueForSlider();

  // Dynamic slider action based on relative units
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slideNum = parseFloat(e.target.value);
    let targetUnit = unit;
    
    // If it's currently a keyword (like auto) or 0, default to px for physical sizing
    if (isKeyword) {
      targetUnit = "px";
    }

    const nextValue = `${slideNum}${targetUnit}`;
    setInputValue(nextValue);
    onChange(nextValue);
  };

  // Slider bounds depending on the active unit
  const getSliderBounds = () => {
    if (unit === "%") {
      return { min: 0, max: 100, step: 5 };
    }
    if (unit === "rem" || unit === "em") {
      return { min: 0, max: 40, step: 1 };
    }
    // Default to px/any standard length limits
    return { min: 0, max: 600, step: 10 };
  };

  const bounds = getSliderBounds();

  return (
    <div className="flex flex-col w-full bg-[#FCFDFB] rounded-2xl border border-emerald-100 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.08)] relative overflow-hidden p-4 gap-4">
      
      {/* Decorative emerald gradient blur in BG */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-teal-500/10 rounded-full blur-xl pointer-events-none"></div>

      {/* Header section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-1.5 rounded-lg shadow-sm">
              <Scale size={14} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                Flexbox Basis
              </h3>
              <p className="text-[9px] text-slate-400 font-medium">Initial Baseline Sizing Axis</p>
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
              className="bg-white rounded-lg border border-slate-200/80 px-2 py-1 shadow-sm flex items-center relative w-[90px] focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-400 transition-all"
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
                maxLength={15}
              />
            </div>

            {/* floating tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute z-50 top-full right-0 mt-2 w-56 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-xl p-3 select-none pointer-events-none"
                  style={{ transformOrigin: 'top right' }}
                >
                  <div className="absolute -top-1 right-8 w-2 h-2 bg-slate-900 border-l border-t border-slate-800 rotate-45" />
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">
                        Initial Main Sizing Axis
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[9px] px-1 py-0.5 rounded font-black">
                        {isKeyword ? inputValue : unit}
                      </span>
                    </div>

                    <p className="text-[9.5px] leading-snug text-slate-200">
                      Determines the initial main-axis size of the item before remaining space is grow/shrink distributed.
                    </p>

                    <div className="border-t border-slate-800 pt-1.5 mt-1 text-[8.5px] text-slate-400 flex flex-col gap-1">
                      <div>• <span className="text-emerald-400 font-bold">0</span> distributes space perfectly symmetrically.</div>
                      <div>• <span className="text-emerald-400 font-bold">auto</span> respects your base width/height dimensions.</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Dynamic Warning Indicator */}
        <AnimatePresence mode="wait">
          {warningMessage && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-2 flex items-start gap-1.5 mt-1.5">
                <AlertCircle size={12} className="text-amber-600 shrink-0 mt-0.5" />
                <span className="text-[9.5px] font-medium leading-tight">{warningMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Success Indicator */}
        <AnimatePresence>
          {successIndicator && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-1.5 flex items-center gap-1.5 mt-1.5">
                <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                <span className="text-[9.5px] font-extrabold uppercase tracking-wide">Change Broadcasted Successfully</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Range Slider for length adjustments */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[10px] font-bold text-slate-600 select-none">
          <span>Dynamic Size Slider ({isKeyword ? "Locks to px" : unit})</span>
          <span className="font-mono text-emerald-600 font-bold">
            {isKeyword ? "Default (100px)" : `${num}${unit}`}
          </span>
        </div>

        <input
          id="flex-basis-slider"
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={bounds.step}
          value={isKeyword ? 100 : num}
          onChange={handleSliderChange}
          className="w-full h-1.5 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />

        <div className="flex justify-between text-[8px] font-bold text-slate-400/80 px-1 font-mono select-none">
          <span>Min ({bounds.min})</span>
          <span>Mid ({bounds.max / 2})</span>
          <span>Max ({bounds.max})</span>
        </div>
      </div>

      {/* Preset Quick Actions */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400/80 select-none">
          W3C Standard Sizing Presets
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: "Symmetric (0)", val: "0", desc: "Equal expansion" },
            { label: "Auto (Default)", val: "auto", desc: "Respect bounds" },
            { label: "Intrinsic Text", val: "max-content", desc: "No wrapping" },
            { label: "Quarter (25%)", val: "25%", desc: "Proportional" },
            { label: "Third (33.3%)", val: "33.33%", desc: "Split Row" },
            { label: "Half (50%)", val: "50%", desc: "Symmetric half" }
          ].map((preset) => {
            const isActive = inputValue.toLowerCase() === preset.val.toLowerCase();
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetSelect(preset.val)}
                className={`py-1.5 px-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden ${
                  isActive 
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-600 text-white shadow-sm shadow-emerald-500/10 active:scale-95" 
                    : "bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 text-slate-600"
                }`}
              >
                <span className="text-[9px] font-bold tracking-tight select-none">{preset.label}</span>
                <span className={`text-[7.5px] mt-0.5 leading-none select-none font-medium ${isActive ? "text-emerald-100" : "text-slate-400"}`}>
                  {preset.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Collapsible Info/Help Guidance Drawer */}
      <AnimatePresence>
        {isGuidanceVisible ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border border-emerald-50 rounded-xl p-3 w-full mt-1 overflow-hidden"
          >
            {/* Header/Toggle & Close */}
            <div className="flex items-center justify-between pb-1.5 border-b border-emerald-100/60 mb-1.5">
              <button 
                type="button"
                onClick={() => setIsGuidanceCollapsed(!isGuidanceCollapsed)}
                className="flex items-center gap-1.5 focus:outline-none group text-left cursor-pointer"
              >
                <Info size={13} className="text-emerald-500" />
                <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wide group-hover:text-emerald-700 transition-colors">
                  Guidance & Best Practices
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
                title="Dismiss help"
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
                  className="flex flex-col gap-2 overflow-hidden"
                >
                  <div className="flex gap-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wide">
                        Shorter vs Shorthand Sizing
                      </span>
                      <p className="text-[9.5px] text-slate-500 leading-tight mt-1">
                        Use <strong className="text-emerald-700">flex: 1 1 0px</strong> for perfectly equal-width distributions, and <strong className="text-emerald-700">flex: 1 1 auto</strong> to respect text or content sizes.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-emerald-100/40 pt-2 flex gap-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-extrabold text-teal-900 uppercase tracking-wide">
                        Check direction and axis
                      </span>
                      <p className="text-[9.5px] text-slate-500 leading-tight mt-1">
                        If the parent has <strong className="text-emerald-700">flex-direction: column</strong>, <code className="font-mono bg-slate-100/80 px-0.5 text-xs text-slate-600 rounded">flex-basis</code> controls initial height instead of width!
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex justify-end mt-0.5">
            <button
              type="button"
              onClick={() => setIsGuidanceVisible(true)}
              className="text-[9.5px] font-extrabold text-emerald-500 hover:text-emerald-700 bg-emerald-50/60 hover:bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100/40 transition-all cursor-pointer"
            >
              Show Help & Guidance
            </button>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
