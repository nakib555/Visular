import React, { useState, useEffect, useRef } from "react";
import { 
  Expand, 
  Scale, 
  Info, 
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface FlexGrowControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function FlexGrowControl({ value, onChange }: FlexGrowControlProps) {
  const [inputValue, setInputValue] = useState("");
  const [isGuidanceVisible, setIsGuidanceVisible] = useState(true);
  const [isGuidanceCollapsed, setIsGuidanceCollapsed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Sync internal input value on external change
  useEffect(() => {
    setInputValue(value || "0");
  }, [value]);

  const showNotification = (message: string, isSuccess: boolean = false) => {
    // Silent validation tracker - UI notifications removed per user constraint
  };

  const sanitizeAndEmit = (rawValue: string) => {
    let cleanVal = rawValue.trim();

    // 1. Detect if negative value was attempted
    if (cleanVal.includes("-")) {
      showNotification("Negative values are invalid for flex-grow! Auto-adjusted to non-negative.");
      cleanVal = cleanVal.replace(/-/g, "");
    }

    // 2. Detect if units like px, %, em, rem, etc., were used
    const unitRegex = /([0-9.]+)\s*(px|%|em|rem|vh|vw|pt|pt|in|cm|mm)$/i;
    if (unitRegex.test(cleanVal)) {
      showNotification("Units (like px, %, em) are ignored! flex-grow takes only raw ratios.");
      cleanVal = cleanVal.replace(/[a-z%]+/gi, "");
    }

    // 3. Remove non-numeric characters except for valid decimals
    cleanVal = cleanVal.replace(/[^0-9.]/g, "");

    // Allow single decimal point
    const parts = cleanVal.split(".");
    if (parts.length > 2) {
      cleanVal = parts[0] + "." + parts.slice(1).join("");
    }

    setInputValue(cleanVal);

    // If empty or resolves to a valid number, emit to the design context
    if (cleanVal === "") {
      onChange("0");
      return;
    }

    const numeric = parseFloat(cleanVal);
    if (!isNaN(numeric) && numeric >= 0) {
      onChange(cleanVal);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    sanitizeAndEmit(e.target.value);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    showNotification("Value set successfully", true);
  };

  const handlePresetSelect = (preset: string) => {
    setInputValue(preset);
    onChange(preset);
    showNotification(`Preset ${preset} selected`, true);
  };

  const numValue = isNaN(parseFloat(inputValue)) ? 0 : Math.max(0, parseFloat(inputValue));

  return (
    <div className="flex flex-col w-full bg-[#FCFDFE] rounded-2xl border border-blue-100 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.08)] relative overflow-hidden p-4 gap-4">
      
      {/* Decorative colored grid in background */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>

      {/* Header section with specialized tool styling */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
              <Expand size={14} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                Flexbox Grow
              </h3>
              <p className="text-[9px] text-slate-400 font-medium">Proportional Axis Fill Indicator</p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                Factor:
              </span>
              
              {/* Context Tooltip Trigger */}
              <div 
                className="relative flex items-center justify-center cursor-help group p-0.5 rounded-md hover:bg-blue-50 transition-colors"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                title="View proportional growth ratio"
              >
                <Info size={11} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>

            <div 
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="bg-white rounded-lg border border-slate-200/80 px-2 py-1 shadow-sm flex items-center relative w-[80px] focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all"
            >
              <input
                id="flex-grow-input"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                className="w-full bg-transparent text-center text-xs font-mono font-bold text-blue-600 focus:outline-none"
                placeholder="0"
                maxLength={5}
              />
            </div>

            {/* Float Tooltip Bubble */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute z-50 top-full right-0 mt-2 w-56 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-xl p-3 select-none pointer-events-none"
                  style={{ transformOrigin: 'top right' }}
                >
                  {/* Decorative caret pointing to the input container */}
                  <div className="absolute -top-1 right-8 w-2 w-2 h-2 bg-slate-900 border-l border-t border-slate-800 rotate-45" />
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase text-blue-400 tracking-wider">
                        Growth Ratio Model
                      </span>
                      <span className="bg-blue-500/20 text-blue-300 font-mono text-[9px] px-1 py-0.5 rounded font-black">
                        {numValue.toFixed(1)}:1.0
                      </span>
                    </div>

                    <p className="text-[9.5px] leading-snug text-slate-200">
                      {numValue === 0 ? (
                        <>This element stays static (<strong className="text-blue-400">0:1 ratio</strong>). Normal siblings claim all extra bounds.</>
                      ) : numValue === 1 ? (
                        <>All elements share the extra space <strong className="text-blue-400">equally (1:1 ratio)</strong>.</>
                      ) : (
                        <>Grows <strong className="text-blue-400">{numValue.toFixed(1)}x</strong> faster than standard siblings (<strong className="text-blue-300">{numValue.toFixed(1)}:1</strong> ratio).</>
                      )}
                    </p>

                    {/* Interactive Proportions Mini Visualizer inside the Tooltip */}
                    <div className="flex flex-col gap-1 mt-1 pt-1.5 border-t border-slate-800">
                      <div className="flex justify-between text-[8px] font-semibold text-slate-400">
                        <span>Active Item</span>
                        <span>Sibling (1.0)</span>
                      </div>
                      
                      <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden flex">
                        {numValue === 0 ? (
                          <div className="h-full bg-slate-700 w-full rounded-full" />
                        ) : (
                          <>
                            <div 
                              className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-300"
                              style={{ width: `${(numValue / (numValue + 1)) * 100}%` }}
                            />
                            <div 
                              className="h-full bg-slate-700 transition-all duration-300" 
                              style={{ width: `${(1 / (numValue + 1)) * 100}%` }}
                            />
                          </>
                        )}
                      </div>
                      
                      <div className="flex justify-between text-[8.5px] font-black font-mono mt-0.5">
                        <span className="text-blue-400">
                          {numValue === 0 ? "0%" : `${Math.round((numValue / (numValue + 1)) * 100)}%`}
                        </span>
                        <span className="text-slate-400">
                          {numValue === 0 ? "100%" : `${Math.round((1 / (numValue + 1)) * 100)}%`}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Range Slider Container with ticks */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[10px] font-bold text-slate-600">
          <span>Control Scale Slider (0 to 3 Recommended)</span>
          <span className="font-mono text-blue-600 font-black">{numValue.toFixed(1)}</span>
        </div>

        <div className="relative flex items-center px-1">
          <input
            id="flex-grow-slider"
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={numValue > 3 ? 3 : numValue}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Ticks representation from 0 to 3 */}
        <div className="flex justify-between text-[8px] font-bold text-slate-400/80 px-1 font-mono select-none">
          <span>0 (Rigid/Static)</span>
          <span>1.0 (Equal Grow)</span>
          <span>2.0 (Double Rate)</span>
          <span>3.0 (Recommended Max)</span>
        </div>
      </div>

      {/* Quick Action Presets */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Quick Factors
        </span>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Rigid (0)", val: "0", desc: "No growth" },
            { label: "Fill (1)", val: "1", desc: "Equal share" },
            { label: "Double (2)", val: "2", desc: "2x rate" },
            { label: "Triple (3)", val: "3", desc: "3x rate" }
          ].map((preset) => {
            const isActive = inputValue === preset.val;
            return (
              <button
                key={preset.val}
                type="button"
                onClick={() => handlePresetSelect(preset.val)}
                className={`py-1.5 px-1 rounded-xl flex flex-col items-center justify-center border text-center transition-all ${
                  isActive
                    ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm ring-1 ring-blue-500/10 font-bold"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                }`}
              >
                <span className="text-xs font-mono font-bold leading-tight">{preset.val}</span>
                <span className="text-[8px] scale-90 whitespace-nowrap opacity-75 font-semibold mt-0.5">{preset.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Informational Guidance Drawer */}
      <AnimatePresence>
        {isGuidanceVisible ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-50 rounded-xl p-3 w-full mt-1 overflow-hidden"
          >
            {/* Header / Toggle & Close row */}
            <div className="flex items-center justify-between pb-1.5 border-b border-blue-100/60 mb-1.5">
              <button 
                type="button"
                onClick={() => setIsGuidanceCollapsed(!isGuidanceCollapsed)}
                className="flex items-center gap-1.5 focus:outline-none group text-left cursor-pointer"
              >
                <Info size={13} className="text-blue-500" />
                <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wide group-hover:text-blue-700 transition-colors">
                  Guidance & Best Practices
                </span>
                {isGuidanceCollapsed ? (
                  <ChevronDown size={11} className="text-blue-400" />
                ) : (
                  <ChevronUp size={11} className="text-blue-400" />
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
                      <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wide flex items-center gap-1">
                        Grow Calculation Rule
                      </span>
                      <p className="text-[9.5px] text-slate-500 leading-tight mt-1">
                        Growth divides <strong>remaining space only</strong>, not total width! Set <code className="bg-blue-105/40 text-blue-800 px-1 py-0.5 rounded text-[8.5px] font-mono">flex-basis: 0</code> or standard width properties to enforce perfectly identical widths on siblings.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-blue-100/40 pt-2 flex gap-2">
                    <Scale size={13} className="text-indigo-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-extrabold text-indigo-900 uppercase tracking-wide">
                        Keep Ratios Mathematically Simple
                      </span>
                      <p className="text-[9.5px] text-slate-500 leading-tight mt-1">
                        Always use single-digit whole numbers or simple decimals (e.g., <code className="bg-indigo-100/40 text-indigo-800 px-1 py-0.5 rounded text-[8.5px] font-mono">1</code>, <code className="bg-indigo-100/40 text-indigo-800 px-1 py-0.5 rounded text-[8.5px] font-mono">2</code>, <code className="bg-indigo-100/40 text-indigo-800 px-1 py-0.5 rounded text-[8.5px] font-mono">1.5</code>) instead of large values like <code className="bg-indigo-100/40 text-indigo-800 px-1 py-0.5 rounded text-[8.5px] font-mono">100</code> and <code className="bg-indigo-100/40 text-indigo-800 px-1 py-0.5 rounded text-[8.5px] font-mono">200</code>. They calculate identically but keep your code highly readable and clean!
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
              className="text-[9.5px] font-extrabold text-blue-500 hover:text-blue-700 bg-blue-50/60 hover:bg-blue-50 px-2 py-1 rounded-lg border border-blue-100/40 transition-all cursor-pointer"
            >
              Show Help & Guidance
            </button>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
