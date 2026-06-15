import React, { useState, useEffect, useMemo } from "react";
import { 
  ArrowLeftRight, 
  Info, 
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Minus,
  AlertTriangle,
  Move,
  Shuffle,
  Activity,
  Award,
  Link,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface OrderControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function OrderControl({ value, onChange }: OrderControlProps) {
  const [inputValue, setInputValue] = useState("0");
  const [isGuidanceVisible, setIsGuidanceVisible] = useState(true);
  const [isGuidanceCollapsed, setIsGuidanceCollapsed] = useState(false);
  const [activeGuidanceTab, setActiveGuidanceTab] = useState<"overview" | "accessibility" | "gotchas">("overview");
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Sync internal input value on external change
  useEffect(() => {
    // If empty or auto, standard CSS order initial is "0"
    if (!value || value === "auto") {
      setInputValue("0");
    } else {
      setInputValue(value);
    }
  }, [value]);

  const validateAndEmit = (rawValue: string) => {
    let cleanVal = rawValue.trim();

    // Reset warning
    setWarningMessage(null);

    // If empty, reset and emit "0" or empty string
    if (cleanVal === "") {
      setInputValue("");
      onChange("");
      return;
    }

    // Checking if units like px, em etc are used
    const unitRegex = /([-\d.]+)\s*(px|%|em|rem|vh|vw|pt|pt|in|cm|mm)$/i;
    if (unitRegex.test(cleanVal)) {
      setWarningMessage("Units (like px, %) are invalid for 'order'. Order takes raw integers only.");
      cleanVal = cleanVal.replace(/[a-z%]+/gi, "");
    }

    // Check if decimal point lies inside
    if (cleanVal.includes(".")) {
      setWarningMessage("Order accepts strictly whole integers. Rounded decimal to integer.");
      cleanVal = cleanVal.split(".")[0];
    }

    // Clean other non-numeric chars but keep minus sign at start
    const isNegative = cleanVal.startsWith("-");
    const digitsOnly = cleanVal.replace(/[^\d]/g, "");
    cleanVal = (isNegative ? "-" : "") + digitsOnly;

    // Handle just "-" character temporarily without emitting invalid number
    if (cleanVal === "-" || cleanVal === "") {
      setInputValue(cleanVal);
      return;
    }

    const numeric = parseInt(cleanVal, 10);
    if (!isNaN(numeric)) {
      // Bounds check corresponding to expert documentation limits
      if (numeric < -1000) {
        setWarningMessage("Extremely low order value applied. Fits spec, but consider simple ranges (-1 to 5).");
      } else if (numeric > 100000) {
        setWarningMessage("Extremely high order value applied (potential 'z-index syndrome').");
      }
      
      setInputValue(numeric.toString());
      onChange(numeric.toString());
    }
  };

  const increment = () => {
    const current = parseInt(inputValue, 10) || 0;
    const next = current + 1;
    setInputValue(next.toString());
    onChange(next.toString());
  };

  const decrement = () => {
    const current = parseInt(inputValue, 10) || 0;
    const next = current - 1;
    setInputValue(next.toString());
    onChange(next.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndEmit(e.target.value);
  };

  const handlePresetSelect = (preset: string) => {
    setInputValue(preset);
    onChange(preset);
    setWarningMessage(null);
  };

  const orderNum = parseInt(inputValue, 10) || 0;

  // Visual sibling list simulation to educational visualization
  // Left-to-right representation illustrating dynamic changes.
  // Card A: default order = 0
  // Card B (Active): order = orderNum
  // Card C: default order = 0
  const sortedSiblings = useMemo(() => {
    const cards = [
      { id: "A", name: "Sibling Item A", order: 0, isTarget: false },
      { id: "B", name: "Target Item B", order: orderNum, isTarget: true },
      { id: "C", name: "Sibling Item C", order: 0, isTarget: false }
    ];
    // Stable sort matching standard browser rendering layout rules:
    // Sort by order value, break ties using source sequence (index)
    return [...cards].sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      // If order matches, keep source presentation sequence
      return cards.indexOf(a) - cards.indexOf(b);
    });
  }, [orderNum]);

  return (
    <div className="flex flex-col gap-3.5 w-full text-left relative overflow-visible group transition-all duration-200 z-10">
      
      <div className="flex flex-col gap-1.5 w-full relative">
        <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono flex justify-between select-none">
          <span>Render Order override</span>
          <span className="text-[10px] font-mono font-bold text-stone-400 select-all normal-case">
            order
          </span>
        </label>

        <div className="w-full bg-white border border-stone-200/85 hover:border-stone-300 rounded-2xl p-3 flex items-center justify-between shadow-xs transition-all">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-stone-50 border border-stone-100 text-stone-500">
              <ArrowLeftRight size={14} className="text-stone-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-stone-800 leading-tight">
                Render Sequence
              </span>
              <span className="text-[10px] text-stone-400 leading-none mt-0.5">
                Visual presentation placement override
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Value Stepper */}
            <div className="flex items-center bg-white border border-stone-200/90 rounded-xl shadow-xs overflow-hidden h-[28px]">
              <button
                type="button"
                onClick={decrement}
                className="w-7 h-full flex items-center justify-center hover:bg-stone-50 active:bg-stone-100 border-r border-stone-200 transition-colors text-stone-500 hover:text-stone-800 cursor-pointer"
                title="Decrease Order Value"
              >
                <Minus size={10} />
              </button>
              
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="w-10 text-center text-xs font-mono font-bold text-rose-600 bg-transparent focus:outline-none"
                placeholder="0"
              />
              
              <button
                type="button"
                onClick={increment}
                className="w-7 h-full flex items-center justify-center hover:bg-stone-50 active:bg-stone-100 border-l border-stone-200 transition-colors text-stone-500 hover:text-stone-800 cursor-pointer"
                title="Increase Order Value"
              >
                <Plus size={10} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {warningMessage && (
        <div className="flex items-start gap-1 p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 animate-fade-in text-[9.5px] leading-tight">
          <AlertTriangle size={12} className="shrink-0 text-amber-500 mt-0.5" />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* Educational Interactive Sibling Re-ordering visualization tracker */}
      <div className="flex flex-col gap-2 bg-stone-50/70 rounded-xl p-3 border border-stone-100/80 relative">
        <span className="text-[8.5px] font-extrabold font-mono text-stone-450 uppercase tracking-widest">
          Dynamic HTML Rendering Sequence Map
        </span>
        
        {/* Row element container simulating a Flexbox layout track */}
        <div className="flex flex-row gap-2 mt-1 h-[48px] items-center relative pr-2 select-none">
          {sortedSiblings.map((sibling, idx) => {
            const isTarget = sibling.isTarget;
            return (
              <motion.div
                key={sibling.id}
                layout
                transition={{ type: "spring", stiffness: 350, damping: 26 }}
                className={`flex-1 h-full rounded-lg border ${
                  isTarget 
                    ? "bg-rose-50/70 border-rose-300 shadow-sm" 
                    : "bg-white border-stone-200 text-stone-450"
                } flex flex-col justify-center items-center px-1 text-center`}
              >
                <span className={`text-[9.5px] font-extrabold ${isTarget ? "text-rose-700" : "text-stone-700"}`}>
                  {sibling.name}
                </span>
                <span className="text-[7.5px] font-mono font-bold text-stone-400">
                  order: {sibling.order}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Informative text below tracker */}
        <p className="text-[8.5px] leading-relaxed text-stone-450 text-left mt-1 border-t border-stone-150-dot border-dashed pt-1.5 flex items-center gap-1">
          <Move size={9} className="text-stone-450" />
          <span>
            {orderNum < 0 ? (
              <>Item B is shifted <strong className="text-rose-600 font-semibold">before</strong> all standard sibling items.</>
            ) : orderNum > 0 ? (
              <>Item B is shifted <strong className="text-amber-600 font-semibold">after</strong> all standard sibling items.</>
            ) : (
              <>Elements render sequentially conforming to standard source DOM sequence.</>
            )}
          </span>
        </p>
      </div>

      {/* Presets List */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center pl-0.5">
          <span className="text-[9px] font-extrabold text-stone-450 uppercase tracking-widest font-mono">
            Core Override Presets
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => handlePresetSelect("-1")}
            className={`py-1.5 px-2 rounded-xl border text-[9px] font-bold font-mono transition-all text-center cursor-pointer ${
              inputValue === "-1"
                ? "bg-stone-900 border-stone-900 text-white shadow-sm"
                : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-800"
            }`}
          >
            <div className="flex flex-col">
              <span className="text-[10px]">-1</span>
              <span className="text-[7.5px] font-sans font-medium text-slate-400">Promote First</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handlePresetSelect("0")}
            className={`py-1.5 px-2 rounded-xl border text-[9px] font-bold font-mono transition-all text-center cursor-pointer ${
              inputValue === "0"
                ? "bg-stone-900 border-stone-900 text-white shadow-sm"
                : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-800"
            }`}
          >
            <div className="flex flex-col">
              <span className="text-[10px]">0</span>
              <span className="text-[7.5px] font-sans font-medium text-slate-400">Default Flow</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handlePresetSelect("1")}
            className={`py-1.5 px-2 rounded-xl border text-[9px] font-bold font-mono transition-all text-center cursor-pointer ${
              inputValue === "1"
                ? "bg-stone-900 border-stone-900 text-white shadow-sm"
                : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-800"
            }`}
          >
            <div className="flex flex-col">
              <span className="text-[10px]">1</span>
              <span className="text-[7.5px] font-sans font-medium text-slate-400">Push Last</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handlePresetSelect("9999")}
            className={`py-1.5 px-2 rounded-xl border text-[9px] font-bold font-mono transition-all text-center cursor-pointer ${
              inputValue === "9999"
                ? "bg-stone-900 border-stone-900 text-white shadow-sm"
                : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-800"
            }`}
          >
            <div className="flex flex-col">
              <span className="text-[10px]">9999</span>
              <span className="text-[7.5px] font-sans font-medium text-slate-400">Sticky Last</span>
            </div>
          </button>
        </div>
      </div>

      {/* Styled guidance block detailed */}
      <AnimatePresence>
        {isGuidanceVisible ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex flex-col bg-gradient-to-r from-rose-50/40 to-amber-50/30 border border-rose-100 rounded-xl p-3 w-full overflow-hidden shadow-xs"
          >
            {/* Guidance upper toggles */}
            <div className="flex items-center justify-between pb-1.5 border-b border-rose-200/50 mb-1.5">
              <button 
                type="button"
                onClick={() => setIsGuidanceCollapsed(!isGuidanceCollapsed)}
                className="flex items-center gap-1.5 focus:outline-none group text-left cursor-pointer"
              >
                <BookOpen size={13} className="text-rose-500" />
                <span className="text-[10px] font-extrabold text-rose-950 uppercase tracking-widest font-mono group-hover:text-rose-800 transition-colors">
                  Order Specification Guidelines
                </span>
                {isGuidanceCollapsed ? (
                  <ChevronDown size={11} className="text-rose-450" />
                ) : (
                  <ChevronUp size={11} className="text-rose-450 font-black" />
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setIsGuidanceVisible(false)}
                className="text-stone-400 hover:text-stone-600 p-0.5 rounded-full hover:bg-rose-100/40 transition-all cursor-pointer"
                title="Hide instructions"
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
                  {/* Miniature Tabs inside instruction panel */}
                  <div className="flex gap-1.5 border-b border-rose-100/40 pb-1.5 shrink-0 scrollbar-none">
                    <button 
                      type="button"
                      onClick={() => setActiveGuidanceTab("overview")}
                      className={`px-2 py-0.5 rounded-md text-[9px] font-bold transition-all cursor-pointer ${
                        activeGuidanceTab === "overview" 
                          ? "bg-rose-650 text-white" 
                          : "bg-white border border-rose-100 text-rose-700 hover:bg-rose-50/60"
                      }`}
                    >
                      Overview
                    </button>
                    <button 
                      type="button"
                      onClick={() => setActiveGuidanceTab("accessibility")}
                      className={`px-2 py-0.5 rounded-md text-[9px] font-bold transition-all cursor-pointer ${
                        activeGuidanceTab === "accessibility" 
                          ? "bg-rose-650 text-white" 
                          : "bg-white border border-rose-100 text-rose-700 hover:bg-rose-50/60"
                      }`}
                    >
                      WCAG Access
                    </button>
                    <button 
                      type="button"
                      onClick={() => setActiveGuidanceTab("gotchas")}
                      className={`px-2 py-0.5 rounded-md text-[9px] font-bold transition-all cursor-pointer ${
                        activeGuidanceTab === "gotchas" 
                          ? "bg-rose-650 text-white" 
                          : "bg-white border border-rose-100 text-rose-700 hover:bg-rose-50/60"
                      }`}
                    >
                      Gotchas
                    </button>
                  </div>

                  {activeGuidanceTab === "overview" && (
                    <div className="flex flex-col gap-1.5 animate-fade-in text-left">
                      <span className="text-[9.5px] font-extrabold text-rose-900 uppercase tracking-wide">
                        Visual Rendering Sequence Override
                      </span>
                      <p className="text-[9.5px] text-slate-500 leading-tight">
                        The <code className="bg-rose-100/35 text-rose-800 px-1 py-0.5 rounded font-mono text-[8.5px]">order</code> property allows granular repositioning inside <code className="bg-slate-100/60 text-slate-800 px-1 py-0.5 rounded font-mono text-[8.5px]">display: flex</code> or <code className="bg-slate-100/50 text-slate-800 px-1 rounded font-mono text-[8.5px]">grid</code> markup.
                      </p>
                      <p className="text-[9.5px] text-slate-500 leading-snug border-l-2 border-rose-300 pl-2">
                        Whole integers shift matching tags. Same numbers fall back to source sequence ordering cascade. Zero serves as initial layout condition.
                      </p>
                    </div>
                  )}

                  {activeGuidanceTab === "accessibility" && (
                    <div className="flex flex-col gap-1.5 animate-fade-in text-left">
                      <span className="text-[9.5px] font-extrabold text-amber-900 uppercase tracking-wide flex items-center gap-1">
                        ⚠️ CRITICAL: WCAG Tab Index Warning
                      </span>
                      <p className="text-[9.5px] text-slate-500 leading-tight">
                        Reordering items visually with <code className="bg-rose-100/35 text-rose-850 px-1 rounded font-mono text-[8px]">order</code> does <strong className="text-amber-800 font-bold">NOT</strong> update physical keyboard step indices or screen reader reading paths.
                      </p>
                      <p className="text-[9.2px] text-slate-500 leading-relaxed bg-white/70 rounded-lg p-1.5 border border-amber-200">
                        Using order can create a confusing disconnect for blind or keyboard-dependent users, as the focus leaps unpredictably around the viewport. Keep structural code aligned with read sequence whenever feasible.
                      </p>
                    </div>
                  )}

                  {activeGuidanceTab === "gotchas" && (
                    <div className="flex flex-col gap-1.5 animate-fade-in text-left">
                      <span className="text-[9.5px] font-extrabold text-rose-900 uppercase tracking-wide">
                        Layout Rules & Warnings
                      </span>
                      <div className="space-y-1 text-[9.5px] text-slate-500 leading-tight">
                        <div className="flex items-start gap-1">
                          <span className="text-rose-500">•</span>
                          <span><strong>Context Dependent:</strong> Ignores block tags. Element container must specify <code className="bg-rose-50 text-rose-800 rounded font-mono text-[8px] px-1">flex</code> or <code className="bg-rose-50 text-rose-800 rounded font-mono text-[8px] px-1">grid</code>.</span>
                        </div>
                        <div className="flex items-start gap-1">
                          <span className="text-rose-500">•</span>
                          <span><strong>Grid algorithm:</strong> Affects auto placement algorithms heavily. Grid items with fully explicit columns might ignore offset spacing effects.</span>
                        </div>
                        <div className="flex items-start gap-1">
                          <span className="text-rose-500">•</span>
                          <span><strong>Z-Index interaction:</strong> Modifies absolute rendering stacks with flex/grid containers before index constraints lock layer positions.</span>
                        </div>
                      </div>
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
              className="text-[9.5px] font-extrabold text-rose-500 hover:text-rose-600 bg-rose-50/60 hover:bg-rose-50 px-2 py-1 rounded-lg border border-rose-100/40 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Info size={10} />
              Show Order Override Help & Guidance
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
