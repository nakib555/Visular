import React, { useState, useEffect, useRef } from "react";
import { 
  Info, 
  HelpCircle, 
  Shrink,
  Scale,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface FlexShrinkControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function FlexShrinkControl({ value, onChange }: FlexShrinkControlProps) {
  const [inputValue, setInputValue] = useState("");
  const [isGuidanceVisible, setIsGuidanceVisible] = useState(true);
  const [isGuidanceCollapsed, setIsGuidanceCollapsed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Sync internal input value on external change
  useEffect(() => {
    setInputValue(value || "1");
  }, [value]);

  const showNotification = (message: string, isSuccess: boolean = false) => {
    // Silent validation tracker - UI notifications removed per user constraint
  };

  const sanitizeAndEmit = (rawValue: string) => {
    let cleanVal = rawValue.trim();

    // 1. Detect if negative value was attempted
    if (cleanVal.includes("-")) {
      showNotification("Negative values are invalid for flex-shrink! Auto-adjusted to non-negative.");
      cleanVal = cleanVal.replace(/-/g, "");
    }

    // 2. Detect if units like px, %, em, rem, etc., were used
    const unitRegex = /([0-9.]+)\s*(px|%|em|rem|vh|vw|pt|pt|in|cm|mm)$/i;
    if (unitRegex.test(cleanVal)) {
      showNotification("Units (like px, %, em) are ignored! flex-shrink takes only raw ratios.");
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
      onChange("1");
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

  const numValue = isNaN(parseFloat(inputValue)) ? 1 : Math.max(0, parseFloat(inputValue));

  return (
    <div className="flex flex-col gap-3.5 w-full text-left relative overflow-visible group transition-all duration-200 z-10">
      
      <div className="flex flex-col gap-1.5 w-full relative">
        <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono flex justify-between select-none">
          <span>Flexbox Shrink Factor</span>
          <span className="text-[10px] font-mono font-bold text-stone-400 select-all normal-case">
            flex-shrink
          </span>
        </label>

        <div className="w-full bg-white border border-stone-200/85 hover:border-stone-300 rounded-2xl p-3 flex items-center justify-between shadow-xs transition-all">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-stone-50 border border-stone-100 text-stone-500">
              <Shrink size={14} className="text-stone-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-stone-800 leading-tight">
                Flexbox Shrink
              </span>
              <span className="text-[10px] text-stone-400 leading-none mt-0.5">
                Negative Space Compensation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                Factor:
              </span>
              
              {/* Context Tooltip Trigger */}
              <div 
                className="relative flex items-center justify-center cursor-help group p-0.5 rounded-md hover:bg-purple-50 transition-colors"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                title="View proportional shrink ratio"
              >
                <Info size={11} className="text-slate-400 group-hover:text-purple-500 transition-colors" />
              </div>
            </div>

            <div 
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="bg-white rounded-lg border border-slate-200/80 px-2 py-1 shadow-sm flex items-center relative w-[80px] focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-400 transition-all"
            >
              <input
                id="flex-shrink-input"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                className="w-full bg-transparent text-center text-xs font-mono font-bold text-purple-600 focus:outline-none"
                placeholder="1"
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
                      <span className="text-[9px] font-black uppercase text-purple-400 tracking-wider">
                        Shrink Compression Ratio
                      </span>
                      <span className="bg-purple-500/20 text-purple-300 font-mono text-[9px] px-1 py-0.5 rounded font-black">
                        {numValue.toFixed(1)}:1.0
                      </span>
                    </div>

                    <p className="text-[9.5px] leading-snug text-slate-200">
                      {numValue === 0 ? (
                        <>This element is <strong className="text-purple-400">rigid (0:1 ratio)</strong>; it resists any shrink or compression entirely.</>
                      ) : numValue === 1 ? (
                        <>All elements shrink <strong className="text-purple-400">equally (1:1 ratio)</strong> to handle overflow space.</>
                      ) : (
                        <>Shrinks <strong className="text-purple-400">{numValue.toFixed(1)}x</strong> faster than standard siblings (<strong className="text-purple-300">{numValue.toFixed(1)}:1</strong> ratio).</>
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
                              className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-300"
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
                        <span className="text-purple-400">
                          {numValue === 0 ? "0% shrink" : `${Math.round((numValue / (numValue + 1)) * 100)}%`}
                        </span>
                        <span className="text-slate-400">
                          {numValue === 0 ? "100% shrink" : `${Math.round((1 / (numValue + 1)) * 100)}%`}
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

      {/* Control Range Slider */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[10px] font-bold text-slate-600">
          <span>Compensation Range Slider (0 to 3 Recommended)</span>
          <span className="font-mono text-purple-600 font-black">{numValue.toFixed(1)}</span>
        </div>

        <div className="relative flex items-center px-1">
          <input
            id="flex-shrink-slider"
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={numValue > 3 ? 3 : numValue}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        {/* Legend */}
        <div className="flex justify-between text-[8px] font-bold text-slate-400/80 px-1 font-mono select-none">
          <span>0 (Never Shrink)</span>
          <span>1.0 (Default/Equal)</span>
          <span>2.0 (Double Rate)</span>
          <span>3.0 (Recommended Max)</span>
        </div>
      </div>

      {/* Quick Factors Grid */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest select-none">
          Presets
        </span>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Rigid (0)", val: "0", desc: "Never shrink" },
            { label: "Shrink (1)", val: "1", desc: "Default" },
            { label: "Double (2)", val: "2", desc: "2x faster" },
            { label: "Triple (3)", val: "3", desc: "3x faster" }
          ].map((preset) => {
            const isActive = inputValue === preset.val;
            return (
              <button
                key={preset.val}
                type="button"
                onClick={() => handlePresetSelect(preset.val)}
                className={`py-1.5 px-1 rounded-xl flex flex-col items-center justify-center border text-center transition-all ${
                  isActive
                    ? "bg-purple-50 border-purple-300 text-purple-700 shadow-sm ring-1 ring-purple-500/10 font-bold"
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

      {/* Gotcha / Critical Warning Guidance Banner */}
      <AnimatePresence>
        {isGuidanceVisible ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col bg-gradient-to-r from-purple-55 to-pink-55 border border-purple-100 rounded-xl p-3 w-full overflow-hidden"
          >
            {/* Header / Toggle & Close row */}
            <div className="flex items-center justify-between pb-1.5 border-b border-purple-200/40 mb-1.5">
              <button 
                type="button"
                onClick={() => setIsGuidanceCollapsed(!isGuidanceCollapsed)}
                className="flex items-center gap-1.5 focus:outline-none group text-left cursor-pointer"
              >
                <HelpCircle size={13} className="text-purple-500" />
                <span className="text-[10px] font-extrabold text-purple-900 uppercase tracking-wide group-hover:text-purple-700 transition-colors">
                  Guidance & Best Practices
                </span>
                {isGuidanceCollapsed ? (
                  <ChevronDown size={11} className="text-purple-400" />
                ) : (
                  <ChevronUp size={11} className="text-purple-400" />
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
                      <span className="text-[10px] font-extrabold text-purple-900 uppercase tracking-wide">
                        The Content Minimum Floor Rule
                      </span>
                      <p className="text-[9.5px] text-slate-500 leading-tight mt-1">
                         If an item fails to shrink despite high coefficients, it hit its internal baseline content floor. Override this by configuring <code className="bg-purple-100/40 text-purple-800 px-1 py-0.5 rounded text-[8.5px] font-mono">min-width: 0</code> on the active flex child.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-purple-200/40 pt-2 flex gap-2">
                    <Scale size={13} className="text-pink-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-extrabold text-pink-900 uppercase tracking-wide">
                        Understand Practical Shrink Rates
                      </span>
                      <p className="text-[9.5px] text-slate-500 leading-tight mt-1">
                         Typically you either want an element to shrink (<code className="bg-pink-100/40 text-pink-800 px-1 py-0.5 rounded text-[8.5px] font-mono">1</code>) or protect it from shrinking (<code className="bg-pink-100/40 text-pink-800 px-1 py-0.5 rounded text-[8.5px] font-mono">0</code>). Only use small simple numbers like <code className="bg-pink-100/40 text-pink-800 px-1 py-0.5 rounded text-[8.5px] font-mono">2</code> or <code className="bg-pink-100/40 text-pink-800 px-1 py-0.5 rounded text-[8.5px] font-mono">3</code> if custom proportionate ratios are strictly needed!
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
              className="text-[9.5px] font-extrabold text-purple-500 hover:text-purple-700 bg-purple-50/60 hover:bg-purple-50 px-2 py-1 rounded-lg border border-purple-100/40 transition-all cursor-pointer"
            >
              Show Help & Guidance
            </button>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
