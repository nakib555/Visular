import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  RotateCcw, 
  ChevronDown, 
  ChevronUp,
  Search,
  Check,
  Maximize2,
  AlignCenter,
  AlignStartVertical,
  AlignEndVertical,
  Baseline,
  Compass,
  ShieldCheck,
  ZapOff,
  Settings,
  Link,
  Focus,
  Sparkles,
  Info,
  X,
  HelpCircle
} from "lucide-react";

interface AlignSelfControlProps {
  propName?: string;
  value: string;
  onChange: (val: string) => void;
}

interface AlignmentOption {
  val: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  category: "core" | "logical" | "baseline" | "safe" | "unsafe" | "globals";
  color?: string;
}

const getBadgeStyling = (val: string) => {
  const cleanVal = val || "auto";
  if (cleanVal === "stretch") {
    return {
      badgeBg: "bg-indigo-50/90 border border-indigo-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center shrink-0",
      badgeContent: (
        <div className="flex gap-[2px] w-full h-full items-stretch justify-center">
          <div className="w-[5px] bg-indigo-400 rounded-[1.5px]" />
          <div className="w-[5px] bg-indigo-400 rounded-[1.5px]" />
          <div className="w-[5px] bg-indigo-400 rounded-[1.5px]" />
        </div>
      )
    };
  }
  if (cleanVal === "center" || cleanVal.includes("center")) {
    return {
      badgeBg: "bg-purple-50/90 border border-purple-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center shrink-0",
      badgeContent: (
        <div className="flex gap-[2.5px] w-full h-full items-center justify-center">
          <div className="w-[5px] h-[10px] bg-purple-400 rounded-[1.5px]" />
          <div className="w-[5px] h-[14px] bg-purple-400 rounded-[1.5px]" />
          <div className="w-[5px] h-[8px] bg-purple-400 rounded-[1.5px]" />
        </div>
      )
    };
  }
  if (cleanVal.includes("start") || cleanVal === "normal") {
    return {
      badgeBg: "bg-emerald-50/90 border border-emerald-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center shrink-0",
      badgeContent: (
        <div className="flex gap-[2.5px] w-full h-full items-start justify-center">
          <div className="w-[5px] h-[10px] bg-emerald-400 rounded-[1.5px]" />
          <div className="w-[5px] h-[14px] bg-emerald-400 rounded-[1.5px]" />
          <div className="w-[5px] h-[8px] bg-emerald-400 rounded-[1.5px]" />
        </div>
      )
    };
  }
  if (cleanVal.includes("end")) {
    return {
      badgeBg: "bg-rose-50/90 border border-rose-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center shrink-0",
      badgeContent: (
        <div className="flex gap-[2.5px] w-full h-full items-end justify-center">
          <div className="w-[5px] h-[10px] bg-rose-400 rounded-[1.5px]" />
          <div className="w-[5px] h-[14px] bg-rose-400 rounded-[1.5px]" />
          <div className="w-[5px] h-[8px] bg-rose-400 rounded-[1.5px]" />
        </div>
      )
    };
  }
  if (cleanVal.includes("baseline")) {
    return {
      badgeBg: "bg-amber-50/90 border border-amber-100/70 p-1 rounded-lg w-9 h-7 overflow-hidden flex items-end justify-center shrink-0 relative",
      badgeContent: (
        <div className="flex gap-[2px] w-full h-full items-end justify-center relative pb-1">
          <div className="w-full absolute bottom-2 left-0 border-t border-amber-500/60 border-dashed" />
          <div className="w-[5px] h-2 bg-amber-400 rounded-[1.5px] relative z-10" />
          <div className="w-[5px] h-[11px] bg-amber-400 rounded-[1.5px] text-transparent relative z-10" />
          <div className="w-[5px] h-1.5 bg-amber-400 rounded-[1.5px] relative z-10" />
        </div>
      )
    };
  }

  // default fallback (auto etc.)
  return {
    badgeBg: "bg-stone-50 flex items-center justify-center border border-stone-200/80 p-1 rounded-lg w-9 h-7 shrink-0",
    badgeContent: <span className="text-[8.5px] font-mono text-stone-450 uppercase font-bold tracking-tight">{cleanVal.slice(0, 3)}</span>
  };
};

export function AlignSelfControl({ propName = "align-self", value, onChange }: AlignSelfControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryTab, setActiveCategoryTab] = useState<"all" | "core" | "logical" | "baseline" | "safe" | "unsafe" | "globals" >("all");
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [isGuidanceVisible, setIsGuidanceVisible] = useState(true);
  const [isGuidanceCollapsed, setIsGuidanceCollapsed] = useState(false);
  const [activeGuidanceTab, setActiveGuidanceTab] = useState<"overview" | "modifiers" | "gotchas">("overview");

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ 
    top: number; 
    left: number; 
    width: number; 
    bottom?: number; 
    maxHeight?: number;
    placement: "top" | "bottom" 
  } | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickInsideContainer = containerRef.current?.contains(target);
      const clickInsidePortal = (target as Element).closest("#align-self-dropdown-menu");
      if (!clickInsideContainer && !clickInsidePortal) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Monitor geometry to place portal dropdown
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const updatePosition = () => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
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
        if (e.target instanceof Element && e.target.closest('#align-self-dropdown-menu')) return;
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

  const allOptions: AlignmentOption[] = useMemo(() => [
    { val: "auto", label: "Auto", desc: "Defers to parent's align-items setting", icon: Settings, category: "core", color: "from-slate-450 to-stone-500" },
    { val: "stretch", label: "Stretch", desc: "Stretches to fill container's cross-axis", icon: Maximize2, category: "core", color: "from-indigo-450 to-blue-500" },
    { val: "center", label: "Center", desc: "Aligned along cross-axis center midline", icon: AlignCenter, category: "core", color: "from-purple-450 to-indigo-500" },
    { val: "flex-start", label: "Flex Start", desc: "Aligned to alignment container block start", icon: AlignStartVertical, category: "core", color: "from-emerald-450 to-teal-500" },
    { val: "flex-end", label: "Flex End", desc: "Aligned to alignment container block end", icon: AlignEndVertical, category: "core", color: "from-rose-450 to-pink-500" },
    { val: "normal", label: "Normal", desc: "Uses default browser alignment fallbacks", icon: Compass, category: "core" },
    { val: "start", label: "Start Edge", desc: "Starts tightly packed at top/left edge", icon: Compass, category: "logical" },
    { val: "end", label: "End Edge", desc: "Starts tightly packed at bottom/right edge", icon: Compass, category: "logical" },
    { val: "self-start", label: "Self Start", desc: "Aligned using the child's own writing mode start", icon: Compass, category: "logical" },
    { val: "self-end", label: "Self End", desc: "Aligned using the child's own writing mode end", icon: Compass, category: "logical" },
    { val: "baseline", label: "Baseline", desc: "Matches text baseline across same sibling rows", icon: Baseline, category: "baseline" },
    { val: "first baseline", label: "First Baseline", desc: "Align with the top-most textual baseline", icon: Focus, category: "baseline" },
    { val: "last baseline", label: "Last Baseline", desc: "Align with bottom-most textual baseline", icon: Focus, category: "baseline" },
    { val: "safe center", label: "Safe Center", desc: "Centering with data-loss clipping guard", icon: ShieldCheck, category: "safe" },
    { val: "safe start", label: "Safe Start", desc: "Start configuration with safety bounds", icon: ShieldCheck, category: "safe" },
    { val: "safe end", label: "Safe End", desc: "End configuration with safety bounds", icon: ShieldCheck, category: "safe" },
    { val: "unsafe center", label: "Unsafe Center", desc: "Force centering even if overflow triggers data clipping", icon: ZapOff, category: "unsafe" },
    { val: "unsafe start", label: "Unsafe Start", desc: "Force start layout discarding scroll overflow overrides", icon: ZapOff, category: "unsafe" },
    { val: "unsafe end", label: "Unsafe End", desc: "Force end layout discarding scroll overflow overrides", icon: ZapOff, category: "unsafe" },
    { val: "inherit", label: "Inherit", desc: "Adopts computed values of immediate parent container", icon: Link, category: "globals" },
    { val: "initial", label: "Initial", desc: "Restores initial CSS keyword standard ('auto')", icon: Link, category: "globals" },
    { val: "unset", label: "Unset", desc: "Removes configured state cascade rules completely", icon: Link, category: "globals" },
    { val: "revert", label: "Revert", desc: "Reverts to browser stylesheet user-agent baseline", icon: Link, category: "globals" },
    { val: "revert-layer", label: "Revert Layer", desc: "Revert stylesheet values back to preceding styling layers", icon: Link, category: "globals" }
  ], []);

  const filteredOptions = useMemo(() => {
    return allOptions.filter(opt => {
      const isCorrectCategory = activeCategoryTab === "all" || opt.category === activeCategoryTab;
      const cleanSearch = searchQuery.toLowerCase().trim();
      const isSearchMatch = opt.val.toLowerCase().includes(cleanSearch) || 
                            opt.label.toLowerCase().includes(cleanSearch) || 
                            opt.desc.toLowerCase().includes(cleanSearch);
      return isCorrectCategory && isSearchMatch;
    });
  }, [allOptions, activeCategoryTab, searchQuery]);

  const currentActiveOption = useMemo(() => {
    return allOptions.find(opt => opt.val === value) || {
      val: value || "auto",
      label: value ? value.charAt(0).toUpperCase() + value.slice(1) : "Auto",
      desc: "Parent alignment inheritance behavior",
      icon: Settings,
      category: "core" as const
    };
  }, [allOptions, value]);

  const categoryMeta = {
    all: { label: "All Values", icon: Settings },
    core: { label: "Core", icon: Sparkles },
    logical: { label: "Logical", icon: Compass },
    baseline: { label: "Baselines", icon: Focus },
    safe: { label: "Safe Bounds", icon: ShieldCheck },
    unsafe: { label: "Unsafe", icon: ZapOff },
    globals: { label: "Globals", icon: Link }
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery("");
  };

  const ActiveIcon = currentActiveOption.icon;

  return (
    <div className="flex flex-col gap-1.5 w-full text-left relative" ref={containerRef} id="align-self-dropdown-container">
      <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono flex justify-between">
        <span>{propName.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</span>
        <span className="text-[10px] font-mono font-bold text-stone-400 select-all normal-case">
          {value || "auto"}
        </span>
      </label>

      {/* Styled Dropdown Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border ${
          isOpen ? "border-indigo-400 ring-4 ring-indigo-500/10" : "border-stone-200/85 hover:border-stone-300"
        } rounded-2xl p-3 flex items-center justify-between shadow-xs transition-all cursor-pointer text-left focus:outline-none overflow-hidden`}
        id="align-self-dropdown-trigger"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex items-center justify-center w-8 h-8 shrink-0 rounded-xl bg-stone-50 border border-stone-100 text-stone-500">
            <ActiveIcon className="w-4 h-4 text-stone-600 shrink-0" />
          </div>
          <div className="flex flex-col min-w-0 pr-2 flex-1">
            <span className="text-xs font-bold text-stone-800 leading-tight truncate w-full">
              {currentActiveOption.label}
            </span>
            <span className="text-[10px] text-stone-400 leading-none mt-0.5 truncate w-full">
              {currentActiveOption.desc}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className={`${getBadgeStyling(value || "auto").badgeBg} select-none`}>
            {getBadgeStyling(value || "auto").badgeContent}
          </div>
          <ChevronDown
            size={14}
            className={`text-stone-400 transition-transform duration-250 shrink-0 ${
              isOpen ? "rotate-180 text-indigo-500" : ""
            }`}
          />
        </div>
      </button>

      {/* portal popup dropdown */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && dropdownPos && (
            <motion.div
              id="align-self-dropdown-menu"
              initial={{ opacity: 0, y: dropdownPos.placement === "top" ? 6 : -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="fixed bg-white border border-stone-200 rounded-3xl p-3 shadow-2xl z-[999999] flex flex-col"
              style={{
                top: dropdownPos.placement === "bottom" ? dropdownPos.top : "auto",
                bottom: dropdownPos.placement === "top" ? dropdownPos.bottom : "auto",
                left: dropdownPos.left,
                width: dropdownPos.width,
                maxHeight: dropdownPos.maxHeight ? dropdownPos.maxHeight : "auto",
              }}
            >
              <div className="text-[9.5px] uppercase font-bold tracking-wider text-indigo-600 font-mono mb-2 flex items-center gap-1.5 pl-1.5 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span>Override child alignment ({allOptions.length})</span>
              </div>

              {/* Search Field */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl mb-2 shrink-0">
                <Search size={12} className="text-stone-450 shrink-0" />
                <input
                  type="text"
                  placeholder="Query alignment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-[10.5px] placeholder-stone-400 focus:outline-none text-stone-800 font-sans"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-[8.5px] hover:text-stone-700 bg-stone-200 px-1.5 py-0.5 rounded text-stone-500 font-sans cursor-pointer font-bold shrink-0 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Tabs List */}
              <div className="flex items-center gap-1 pb-2 mb-1 border-b border-stone-100 overflow-x-auto shrink-0 scrollbar-none">
                {(Object.keys(categoryMeta) as Array<keyof typeof categoryMeta>).map((catKey) => {
                  const meta = categoryMeta[catKey];
                  const isSelectedTab = activeCategoryTab === catKey;
                  const CatIcon = meta.icon;

                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setActiveCategoryTab(catKey)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[9px] font-bold font-mono transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        isSelectedTab
                          ? "bg-stone-900 border-stone-900 text-stone-100 shadow-sm"
                          : "bg-white text-stone-500 hover:text-stone-900 hover:bg-stone-100 border border-stone-200"
                      }`}
                    >
                      <CatIcon size={10} className={isSelectedTab ? "text-indigo-400" : ""} />
                      <span>{meta.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Scrollable list */}
              <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1 pr-1 pb-1">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => {
                    const isSelected = value === opt.val;
                    const OptIcon = opt.icon;

                    return (
                      <button
                        key={opt.val}
                        type="button"
                        onMouseEnter={() => setHoveredValue(opt.val)}
                        onMouseLeave={() => setHoveredValue(null)}
                        onClick={() => handleSelect(opt.val)}
                        className={`group relative text-left p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-row items-center gap-3 ${
                          isSelected
                            ? "bg-indigo-50/40 border-indigo-200 shadow-sm"
                            : "bg-stone-50/40 hover:bg-stone-50 border-stone-200/60 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex-1 flex flex-col gap-0.5 pl-1">
                          <div className="flex items-center gap-2">
                            <OptIcon className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-600" : "text-stone-550 group-hover:text-stone-800"}`} />
                            <span className={`text-[11px] font-extrabold tracking-tight ${isSelected ? "text-indigo-900" : "text-stone-700 group-hover:text-stone-900"}`}>
                              {opt.label}
                            </span>
                          </div>
                          <div className="text-[9.5px] text-stone-450 group-hover:text-stone-550 leading-snug pl-5">
                            {opt.desc}
                          </div>
                        </div>

                        <div className={`${getBadgeStyling(opt.val).badgeBg} relative`}>
                          {getBadgeStyling(opt.val).badgeContent}
                          {isSelected && (
                            <div className="bg-indigo-500 text-white rounded-full p-[2px] shadow-xs absolute -top-1 -right-1">
                              <Check size={8} />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="py-6 px-4 text-center text-stone-400 flex flex-col items-center justify-center gap-1.5 bg-stone-50/50 border border-stone-150 rounded-2xl my-2">
                    <ZapOff size={18} className="text-stone-300" />
                    <div className="text-[10px] font-bold">No alignments found</div>
                    <div className="text-[8.5px] leading-relaxed max-w-[170px]">
                      No results for "{searchQuery}".
                    </div>
                  </div>
                )}
              </div>

              {/* Footer resetting */}
              <div className="border-t border-stone-100 mt-2 pt-2 text-center flex-shrink-0 flex items-center justify-between px-1">
                <span className="text-[8.5px] text-stone-500 font-mono">
                  Showing {filteredOptions.length} of {allOptions.length}
                </span>
                {value && value !== "auto" && (
                  <button
                    type="button"
                    onClick={() => handleSelect("")}
                    className="text-[8.5px] flex items-center gap-1 text-stone-500 hover:text-rose-600 transition-colors cursor-pointer font-bold"
                  >
                    <RotateCcw size={10} />
                    Reset
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Styled Guidance Panel per layout specifications */}
      <AnimatePresence>
        {isGuidanceVisible ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-xl p-3 w-full mt-1.5 overflow-hidden shadow-xs"
          >
            {/* Header / Toggle & Close row */}
            <div className="flex items-center justify-between pb-1.5 border-b border-blue-200/50 mb-1.5">
              <button 
                type="button"
                onClick={() => setIsGuidanceCollapsed(!isGuidanceCollapsed)}
                className="flex items-center gap-1.5 focus:outline-none group text-left cursor-pointer"
              >
                <Info size={13} className="text-blue-500" />
                <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wide group-hover:text-blue-700 transition-colors font-mono">
                  Align-Self Guide & Best Practices
                </span>
                {isGuidanceCollapsed ? (
                  <ChevronDown size={11} className="text-blue-400" />
                ) : (
                  <ChevronUp size={11} className="text-blue-400 font-bold" />
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
                  className="flex flex-col gap-2.5 overflow-hidden"
                >
                  {/* Miniature Tabs to organize detail fields */}
                  <div className="flex gap-1.5 shrink-0 border-b border-blue-100/40 pb-1.5">
                    <button 
                      type="button"
                      onClick={() => setActiveGuidanceTab("overview")}
                      className={`px-2 py-0.5 rounded-md text-[9px] font-bold transition-all cursor-pointer ${
                        activeGuidanceTab === "overview" 
                          ? "bg-indigo-650 text-white" 
                          : "bg-white border border-indigo-100 text-indigo-700 hover:bg-indigo-50/60"
                      }`}
                    >
                      Overview
                    </button>
                    <button 
                      type="button"
                      onClick={() => setActiveGuidanceTab("modifiers")}
                      className={`px-2 py-0.5 rounded-md text-[9px] font-bold transition-all cursor-pointer ${
                        activeGuidanceTab === "modifiers" 
                          ? "bg-indigo-650 text-white" 
                          : "bg-white border border-indigo-100 text-indigo-700 hover:bg-indigo-50/60"
                      }`}
                    >
                      Safe Bounds
                    </button>
                    <button 
                      type="button"
                      onClick={() => setActiveGuidanceTab("gotchas")}
                      className={`px-2 py-0.5 rounded-md text-[9px] font-bold transition-all cursor-pointer ${
                        activeGuidanceTab === "gotchas" 
                          ? "bg-indigo-650 text-white" 
                          : "bg-white border border-indigo-100 text-indigo-700 hover:bg-indigo-50/60"
                      }`}
                    >
                      Gotchas
                    </button>
                  </div>

                  {activeGuidanceTab === "overview" && (
                    <div className="flex flex-col gap-1.5 animate-fade-in text-left">
                      <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wide flex items-center gap-1">
                        Cross-Axis Override Behavior
                      </span>
                      <p className="text-[9.5px] text-slate-500 leading-tight">
                        The <code className="bg-indigo-100/40 text-indigo-800 px-1 py-0.5 rounded text-[8.5px] font-mono">align-self</code> property overrides parent <code className="bg-indigo-105/40 text-indigo-800 px-1 py-0.5 rounded text-[8.5px] font-mono">align-items</code> for individual flex or grid items. In standard row Flexbox, it moves items up/down. In Grid contexts, it control block alignment.
                      </p>
                      <p className="text-[9.5px] text-slate-500 leading-tight border-l-2 border-indigo-300 pl-2 mt-1">
                        Use <strong className="text-slate-700 font-semibold">center</strong>, <strong className="text-slate-700 font-semibold">flex-end</strong>, or <strong className="text-slate-700 font-semibold">stretch</strong> for highly compatible, fluid alignments. Use modern <code className="bg-indigo-100/40 text-indigo-800 px-1 py-0.5 rounded text-[8.5px] font-mono">start</code> or <code className="bg-indigo-100/40 text-indigo-800 px-1 py-0.5 rounded text-[8.5px] font-mono">end</code> to respect native horizontal or international RTL scripts.
                      </p>
                    </div>
                  )}

                  {activeGuidanceTab === "modifiers" && (
                    <div className="flex flex-col gap-1.5 animate-fade-in text-left">
                      <span className="text-[10px] font-extrabold text-indigo-900 uppercase tracking-wide flex items-center gap-1">
                        Safe vs Unsafe Overflow Clipping
                      </span>
                      <p className="text-[9.5px] text-slate-500 leading-tight">
                        Centering large children on tiny screen viewports can cause text clipping at boundaries, preventing users from scrolling to read cropped ends inside parent boxes.
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className="bg-white/80 rounded-lg p-1.5 border border-emerald-100">
                          <span className="text-[8.5px] font-extrabold text-emerald-800 font-mono">SAFE MODIFIER</span>
                          <p className="text-[8px] text-slate-500 leading-tight mt-0.5">
                            Reverts to <strong className="text-emerald-700">start</strong> if layout overflows, preserving accessible viewport readability.
                          </p>
                        </div>
                        <div className="bg-white/80 rounded-lg p-1.5 border border-rose-100">
                          <span className="text-[8.5px] font-extrabold text-rose-800 font-mono">UNSAFE MODIFIER</span>
                          <p className="text-[8px] text-slate-500 leading-tight mt-0.5">
                            Centres strictly regardless of parent boundaries, accepting scrolling data-loss.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeGuidanceTab === "gotchas" && (
                    <div className="flex flex-col gap-1.5 animate-fade-in text-left">
                      <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wide">
                        Layout Pitfalls to Avoid
                      </span>
                      <div className="space-y-1 text-[9.5px] text-slate-500 leading-tight">
                        <div className="flex items-start gap-1">
                          <span className="text-amber-600 font-bold">•</span>
                          <span><strong>Parent Context constraint:</strong> This has zero effect if the parent is a basic block element. Parent must have <code className="bg-amber-100/35 text-amber-800 px-1 rounded text-[8px]">display: flex</code> or <code className="bg-amber-100/35 text-amber-800 px-1 rounded text-[8px]">grid</code> configured.</span>
                        </div>
                        <div className="flex items-start gap-1">
                          <span className="text-amber-600 font-bold">•</span>
                          <span><strong>No Main-Axis self placement:</strong> There is no <code className="bg-slate-100/50 text-slate-800 px-1 rounded text-[8px]">justify-self</code> inside standard Flexbox. Push main items vertically or horizontally using <code className="bg-slate-100/50 text-slate-800 px-1 rounded text-[8px]">margin-left: auto</code> instead.</span>
                        </div>
                        <div className="flex items-start gap-1">
                          <span className="text-amber-600 font-bold">•</span>
                          <span><strong>Auto Margins conflict:</strong> Having vertical auto margins (e.g., <code className="bg-slate-100/50 text-stone-800 px-1 rounded text-[8px]">margin: auto</code>) swallows all excess channel space, completely disabling <code className="bg-slate-100/50 text-stone-800 px-1 rounded text-[8px]">align-self</code>.</span>
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
              className="text-[9.5px] font-extrabold text-blue-500 hover:text-blue-700 bg-blue-50/60 hover:bg-blue-50 px-2 py-1 rounded-lg border border-blue-100/40 transition-all cursor-pointer flex items-center gap-1"
            >
              <HelpCircle size={10} />
              Show Align-Self Help & Guidance
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
