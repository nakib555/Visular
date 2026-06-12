import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  RotateCcw, 
  HelpCircle, 
  ChevronDown, 
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
  Sparkles
} from "lucide-react";

interface AlignItemsControlProps {
  value: string;
  onChange: (val: string) => void;
  currentDirection?: string; // e.g. "row" or "column"
}

interface AlignmentOption {
  val: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  category: "core" | "placement" | "baseline" | "safe" | "unsafe" | "globals";
  color?: string;
  accentBg?: string;
  accentText?: string;
  accentBorder?: string;
}

export function AlignItemsControl({ value, onChange, currentDirection = "row" }: AlignItemsControlProps) {
  const [demoDirection, setDemoDirection] = useState<"row" | "column">(
    currentDirection.includes("column") ? "column" : "row"
  );
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryTab, setActiveCategoryTab] = useState<"all" | "core" | "placement" | "baseline" | "safe" | "unsafe" | "globals">("all");
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [coords, setCoords] = useState<{
    top: number | "auto";
    bottom: number | "auto";
    left: number;
    width: number;
    placement: "top" | "bottom";
    maxHeight: string;
  } | null>(null);

  // Close dropdown when clicking outside (considering both relative trigger container and absolute body portal box)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickInsideTrigger = dropdownRef.current?.contains(target);
      const clickInsidePortal = (target as Element).closest("#align-items-dropdown-menu");
      if (!clickInsideTrigger && !clickInsidePortal) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Monitor element geometry and dynamically reposition dropdown when open
  useEffect(() => {
    if (!isOpen) {
      setCoords(null);
      return;
    }

    const updateCoords = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      
      const dropdownMaxHeight = 310; // customized max-height inside portal to avoid screen spillover
      const gap = 4;
      const spaceBelow = window.innerHeight - rect.bottom - gap;
      const spaceAbove = rect.top - gap;
      
      let placement: "top" | "bottom" = "bottom";
      if (spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow) {
        placement = "top";
      }

      const calculatedMaxHeight = placement === "bottom"
        ? Math.max(220, Math.min(dropdownMaxHeight, spaceBelow - 16))
        : Math.max(220, Math.min(dropdownMaxHeight, spaceAbove - 16));

      setCoords({
        top: placement === "bottom" ? rect.bottom + gap : "auto",
        bottom: placement === "top" ? window.innerHeight - rect.top + gap : "auto",
        left: rect.left,
        width: rect.width,
        placement,
        maxHeight: `${calculatedMaxHeight}px`
      });
    };

    updateCoords();

    window.addEventListener("resize", updateCoords);
    window.addEventListener("scroll", updateCoords, { capture: true });

    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords, { capture: true });
    };
  }, [isOpen]);

  const activeAlignmentValue = hoveredValue !== null ? hoveredValue : (value || "stretch");

  // Flat array of all 32 distinct interactive align-items values!
  const allOptions: AlignmentOption[] = useMemo(() => [
    // 1. Core Category
    {
      val: "stretch",
      label: "Stretch",
      desc: "Items expand to fill cross-axis fully",
      icon: Maximize2,
      category: "core",
      color: "from-sky-450 to-blue-500",
      accentBg: "bg-blue-50/70",
      accentText: "text-blue-750",
      accentBorder: "border-blue-200"
    },
    {
      val: "center",
      label: "Center",
      desc: "Items aligned down cross-axis center",
      icon: AlignCenter,
      category: "core",
      color: "from-purple-450 to-indigo-500",
      accentBg: "bg-indigo-50/70",
      accentText: "text-indigo-750",
      accentBorder: "border-indigo-200"
    },
    {
      val: "flex-start",
      label: "Flex Start",
      desc: "Align items at starting line of the container",
      icon: AlignStartVertical,
      category: "core",
      color: "from-emerald-450 to-teal-500",
      accentBg: "bg-teal-50/70",
      accentText: "text-teal-750",
      accentBorder: "border-teal-200"
    },
    {
      val: "flex-end",
      label: "Flex End",
      desc: "Align items at trailing edge of the container",
      icon: AlignEndVertical,
      category: "core",
      color: "from-rose-450 to-pink-500",
      accentBg: "bg-pink-50/70",
      accentText: "text-pink-750",
      accentBorder: "border-pink-200"
    },
    {
      val: "baseline",
      label: "Baseline",
      desc: "Align elements matching text baseline rules",
      icon: Baseline,
      category: "core",
      color: "from-amber-450 to-orange-500",
      accentBg: "bg-orange-50/70",
      accentText: "text-orange-750",
      accentBorder: "border-orange-200"
    },

    // 2. Content Placement Category
    { val: "normal", label: "Normal Fallback", desc: "Default layout fallback placement rules", icon: Compass, category: "placement" },
    { val: "start", label: "Start Edge", desc: "Align content tightly to beginning edge", icon: Compass, category: "placement" },
    { val: "end", label: "End Edge", desc: "Align content tightly to trailing end edge", icon: Compass, category: "placement" },
    { val: "self-start", label: "Self Start", desc: "Align element to its own layout start edge", icon: Compass, category: "placement" },
    { val: "self-end", label: "Self End", desc: "Align element to its own layout end edge", icon: Compass, category: "placement" },
    { val: "anchor-center", label: "Anchor Center", desc: "Align exactly to targets' anchor midline", icon: Sparkles, category: "placement" },

    // 3. Baselines Category
    { val: "first baseline", label: "First Baseline", desc: "Align matching first text baseline", icon: Focus, category: "baseline" },
    { val: "last baseline", label: "Last Baseline", desc: "Align matching last text baseline", icon: Focus, category: "baseline" },

    // 4. Safe Mode Category
    { val: "safe center", label: "Safe Center", desc: "Align center with overflow clipping prevention", icon: ShieldCheck, category: "safe" },
    { val: "safe start", label: "Safe Start", desc: "Align start layout with overflow safety bounds", icon: ShieldCheck, category: "safe" },
    { val: "safe end", label: "Safe End", desc: "Align trailing edge with overflow safety bounds", icon: ShieldCheck, category: "safe" },
    { val: "safe flex-start", label: "Safe Flex-Start", desc: "Flex-start alignment with clipping protection", icon: ShieldCheck, category: "safe" },
    { val: "safe flex-end", label: "Safe Flex-End", desc: "Flex-end alignment with clipping protection", icon: ShieldCheck, category: "safe" },
    { val: "safe self-start", label: "Safe Self-Start", desc: "Self-start alignment fallback guard", icon: ShieldCheck, category: "safe" },
    { val: "safe self-end", label: "Safe Self-End", desc: "Self-end alignment fallback guard", icon: ShieldCheck, category: "safe" },

    // 5. Unsafe Mode Category
    { val: "unsafe center", label: "Unsafe Center", desc: "Force center regardless of dimensions causing clip", icon: ZapOff, category: "unsafe" },
    { val: "unsafe start", label: "Unsafe Start", desc: "Force start layout discarding overflow safety", icon: ZapOff, category: "unsafe" },
    { val: "unsafe end", label: "Unsafe End", desc: "Force end layout discarding overflow safety", icon: ZapOff, category: "unsafe" },
    { val: "unsafe flex-start", label: "Unsafe Flex-Start", desc: "Force flex-start ignoring document box size", icon: ZapOff, category: "unsafe" },
    { val: "unsafe flex-end", label: "Unsafe Flex-End", desc: "Force flex-end ignoring document box size", icon: ZapOff, category: "unsafe" },
    { val: "unsafe self-start", label: "Unsafe Self-Start", desc: "Force self-start ignoring box overflow safeguards", icon: ZapOff, category: "unsafe" },
    { val: "unsafe self-end", label: "Unsafe Self-End", desc: "Force self-end ignoring box overflow safeguards", icon: ZapOff, category: "unsafe" },

    // 6. Inheritance & Globals
    { val: "inherit", label: "Inherit", desc: "Directly inherit parent container alignment", icon: Link, category: "globals" },
    { val: "initial", label: "Initial", desc: "Revert back to standard initial CSS specs", icon: Link, category: "globals" },
    { val: "revert", label: "Revert", desc: "Roll back style to user-agent default styles", icon: Link, category: "globals" },
    { val: "revert-layer", label: "Revert Layer", desc: "Roll back to match the outer cascade layer", icon: Link, category: "globals" },
    { val: "unset", label: "Unset", desc: "Clear value inheriting from parent if possible", icon: Link, category: "globals" }
  ], []);

  // Filter options dynamically by category and search queries
  const filteredOptions = useMemo(() => {
    return allOptions.filter(opt => {
      // Category match
      const isCorrectCategory = activeCategoryTab === "all" || opt.category === activeCategoryTab;
      
      // Search text match
      const cleanSearch = searchQuery.toLowerCase().trim();
      const isSearchMatch = opt.val.toLowerCase().includes(cleanSearch) || 
                            opt.label.toLowerCase().includes(cleanSearch) || 
                            opt.desc.toLowerCase().includes(cleanSearch);
      
      return isCorrectCategory && isSearchMatch;
    });
  }, [allOptions, activeCategoryTab, searchQuery]);

  // Find currently active option object
  const currentActiveOption = useMemo(() => {
    return allOptions.find(opt => opt.val === value) || {
      val: value || "default",
      label: value ? value.charAt(0).toUpperCase() + value.slice(1) : "Default (Stretch)",
      desc: "Configured layout cross-axis alignment",
      icon: Settings,
      category: "core" as const
    };
  }, [allOptions, value]);

  // Categories helper configuration
  const categoryMeta = {
    all: { label: "All Values", icon: Settings, textStyle: "text-stone-500" },
    core: { label: "Core", icon: Sparkles, textStyle: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    placement: { label: "Placement", icon: Compass, textStyle: "text-blue-600 bg-blue-50 border-blue-100" },
    baseline: { label: "Baselines", icon: Focus, textStyle: "text-amber-600 bg-amber-50 border-amber-100" },
    safe: { label: "Safe Bounds", icon: ShieldCheck, textStyle: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    unsafe: { label: "Unsafe", icon: ZapOff, textStyle: "text-rose-600 bg-rose-50 border-rose-100" },
    globals: { label: "Globals", icon: Link, textStyle: "text-purple-600 bg-purple-50 border-purple-100" }
  };

  // Maps CSS align-items values to simulated classes for the sandbox
  const getSimulatedAlignClass = (val: string) => {
    if (val.includes("stretch")) return "items-stretch";
    if (val.includes("center")) return "items-center";
    if (val.includes("start") || val.includes("normal")) return "items-start";
    if (val.includes("end")) return "items-end";
    if (val.includes("baseline")) return "items-baseline";
    return "items-stretch";
  };

  const ActiveIcon = currentActiveOption.icon;

  return (
    <div className="flex flex-col gap-3.5 w-full text-left bg-gradient-to-b from-stone-50 via-white to-stone-50/80 p-4 rounded-3xl border border-stone-200/90 shadow-[0_2px_12px_-5px_rgba(0,0,0,0.03)] relative overflow-hidden select-none">
      
      {/* Decent, decorative background blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/10 rounded-full blur-2xl pointer-events-none" />

      {/* HEADER WITH INTERACTIVE STATS / DISCLOSURES */}
      <div className="flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-3.5 bg-indigo-500 rounded-full shadow-[0_1px_4px_rgba(99,102,241,0.4)]" />
          <span className="text-[10.5px] font-mono font-extrabold uppercase tracking-widest text-stone-750">
            Cross-Axis (align-items)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {value && (
            <span className="text-[8.5px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
              {value}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowHelp((prev) => !prev)}
            className={`p-1 rounded-lg hover:bg-stone-100 transition cursor-pointer text-stone-400 hover:text-stone-700 ${showHelp ? "bg-stone-50 text-indigo-500" : ""}`}
            title="Toggle interactive alignment tutorial card"
          >
            <HelpCircle size={13} />
          </button>
        </div>
      </div>

      {/* EXPLAINER LESSON SHEET */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 bg-indigo-50/30 border border-indigo-100/60 rounded-2xl flex gap-2 w-full text-[10px] leading-relaxed text-indigo-950 font-normal shadow-inner mt-0.5">
              <Compass size={14} className="text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-900 block mb-0.5">Understanding Cross-Axis Alignment</span>
                The <span className="font-mono bg-indigo-50 px-1 py-0.2 rounded border border-indigo-100">align-items</span> property aligns indirect layout items horizontally or vertically down the opposite cross-axis. Choose from any of the 32 compliant CSS layouts using our custom search dropdown below.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DYNAMIC SANDBOX SIMULATOR WORKSPACE */}
      <div className="bg-stone-900/95 border border-stone-850 rounded-2xl p-3 shadow-md relative overflow-hidden flex flex-col z-10">
        
        {/* Sandbox Controls */}
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-800/40">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.5)] animate-pulse" />
            <span className="text-[8px] font-mono leading-none tracking-wider text-stone-400 uppercase font-bold">
              Dynamic Sandbox Simulator
            </span>
          </div>
          
          <div className="flex bg-stone-800/60 p-0.5 border border-stone-750 rounded-lg">
            <button
              type="button"
              onClick={() => setDemoDirection("row")}
              className={`px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase transition-all duration-150 cursor-pointer ${
                demoDirection === "row" 
                  ? "bg-stone-700 text-stone-100 shadow-sm" 
                  : "text-stone-450 hover:text-stone-300"
              }`}
            >
              Row Model
            </button>
            <button
              type="button"
              onClick={() => setDemoDirection("column")}
              className={`px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase transition-all duration-150 cursor-pointer ${
                demoDirection === "column" 
                  ? "bg-stone-700 text-stone-100 shadow-sm" 
                  : "text-stone-450 hover:text-stone-300"
              }`}
            >
              Col Model
            </button>
          </div>
        </div>

        {/* Live Simulation window */}
        <div 
          className={`flex w-full bg-stone-950/40 border border-stone-850 rounded-xl transition-all duration-300 p-2.5 min-h-[96px] ${
            demoDirection === "row" 
              ? "flex-row h-24 gap-3 justify-center" 
              : "flex-col w-full h-[140px] gap-2.5 justify-center"
          } ${getSimulatedAlignClass(activeAlignmentValue)}`}
        >
          {/* Item A */}
          <div className="bg-stone-800/90 border border-stone-700/60 rounded-lg px-2.5 py-1 text-center flex flex-col justify-center shadow-md shrink-0">
            <span className="text-[9px] font-bold font-mono text-stone-400">A</span>
            <span className="text-[6.5px] font-serif italic text-stone-500 mt-0.5">base</span>
          </div>

          {/* Item B (Tall Element) */}
          <div className="bg-stone-750 border border-stone-650 rounded-lg px-2.5 py-4 text-center flex flex-col justify-center shadow-lg shrink-0">
            <span className="text-[10px] font-bold font-mono text-stone-200">B</span>
            <span className="text-[6.5px] font-mono text-stone-400 tracking-wider">tall</span>
          </div>

          {/* Item C */}
          <div className="bg-stone-800/90 border border-stone-700/60 rounded-lg px-2.5 py-2 text-center flex flex-col justify-center shadow-md shrink-0">
            <span className="text-[9px] font-bold font-mono text-stone-400">C</span>
            <span className="text-[6.5px] font-sans text-stone-500">box</span>
          </div>
        </div>

        {/* Active layout coordinates */}
        <div className="flex items-center justify-between text-[7px] font-mono text-stone-500 uppercase tracking-widest mt-2">
          <span>Simulation target: <span className="text-white hover:text-indigo-400 font-extrabold font-sans transition">{activeAlignmentValue}</span></span>
          <span>Simulation Active</span>
        </div>
      </div>

      {/* PREMIUM CUSTOM REACT DROPDOWN ELEMENT */}
      <div className="relative z-25 w-full flex flex-col gap-1" ref={dropdownRef}>
        <span className="text-[8.5px] font-mono font-extrabold uppercase tracking-wider text-stone-450 pl-1">
          Select Layout Value ({allOptions.length} Options Available)
        </span>

        {/* Dropdown Header Trigger */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex items-center justify-between w-full p-3 rounded-2xl border bg-white shadow-xs text-left cursor-pointer transition-all duration-200 outline-hidden hover:border-indigo-350 focus:ring-2 focus:ring-indigo-150 ${
            isOpen ? "border-indigo-500 ring-2 ring-indigo-50/85" : "border-stone-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center`}>
              <ActiveIcon size={15} />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-stone-850">
                {currentActiveOption.label}
              </span>
              <span className="text-[9px] text-stone-450 leading-none mt-0.5 truncate max-w-[150px] sm:max-w-[200px]">
                {currentActiveOption.desc}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono font-bold uppercase bg-stone-100 text-stone-605 px-2 py-0.5 rounded border border-stone-200">
              {currentActiveOption.val || "default"}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.15 }}
              className="text-stone-400"
            >
              <ChevronDown size={14} />
            </motion.div>
          </div>
        </button>

        {/* Expandable Dropdown Container List Panel rendered with top-level DOM body Portal to prevent container overflow hidden clipping */}
        {typeof document !== "undefined" && createPortal(
          <AnimatePresence>
            {isOpen && coords && (
              <motion.div
                ref={portalRef}
                id="align-items-dropdown-menu"
                initial={{ opacity: 0, y: coords.placement === "bottom" ? 6 : -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: coords.placement === "bottom" ? 4 : -4, scale: 0.99 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                style={{
                  position: "fixed",
                  top: coords.top === "auto" ? "auto" : coords.top,
                  bottom: coords.bottom === "auto" ? "auto" : coords.bottom,
                  left: coords.left,
                  width: coords.width,
                  maxHeight: coords.maxHeight,
                }}
                className="bg-white border border-stone-250/90 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col z-[9999]"
              >
                
                {/* Dynamic Filter / Search Bar */}
                <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 border-b border-stone-150 shrink-0">
                  <Search size={12} className="text-stone-450 shrink-0" />
                  <input
                    type="text"
                    placeholder="Query alignment... (e.g. baseline, safe start, normal, Center)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none text-[10.5px] placeholder-stone-400 focus:outline-hidden text-stone-800 font-sans"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-[8.5px] hover:text-stone-700 bg-stone-205 px-1.5 py-0.5 rounded text-stone-450 font-sans cursor-pointer font-bold shrink-0"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Horizontal Category Tab list */}
                <div className="flex items-center gap-1 px-2.5 py-1.5 bg-stone-55 border-b border-stone-150 overflow-x-auto shrink-0 scrollbar-none scroll-smooth">
                  {(Object.keys(categoryMeta) as Array<keyof typeof categoryMeta>).map((catKey) => {
                    const meta = categoryMeta[catKey];
                    const isSelectedTab = activeCategoryTab === catKey;
                    const CatIcon = meta.icon;

                    return (
                      <button
                        key={catKey}
                        type="button"
                        onClick={() => setActiveCategoryTab(catKey)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] font-bold font-mono uppercase whitespace-nowrap transition-all cursor-pointer ${
                          isSelectedTab
                            ? "bg-stone-900 border-stone-900 text-amber-405 shadow-sm font-extrabold"
                            : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                        }`}
                      >
                        <CatIcon size={9} />
                        <span>{meta.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Filtered option rows list wrapper with proper flex scaling & overflow-y */}
                <div className="flex-1 min-h-0 overflow-y-auto p-1.5 bg-stone-50/35 flex flex-col gap-1 scrollbar-thin">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt) => {
                      const isSelected = value === opt.val;
                      const isHovered = hoveredValue === opt.val;
                      const OptIcon = opt.icon;

                      return (
                        <button
                          key={opt.val}
                          type="button"
                          onMouseEnter={() => setHoveredValue(opt.val)}
                          onMouseLeave={() => setHoveredValue(null)}
                          onClick={() => {
                            onChange(isSelected ? "" : opt.val);
                            setIsOpen(false);
                            setSearchQuery("");
                          }}
                          className={`group w-full flex items-center justify-between p-2 rounded-xl text-left border transition-all duration-150 cursor-pointer ${
                            isSelected
                              ? "bg-stone-950 border-stone-950 text-white shadow-sm"
                              : "bg-white border-stone-150/60 text-stone-750 hover:bg-indigo-50/15 hover:border-stone-300"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden w-4/5">
                            {/* Option specific Icon or fallback styling indicator */}
                            <div 
                              className={`p-1.5 rounded-lg shrink-0 transition-all ${
                                isSelected
                                  ? "bg-indigo-600 text-white"
                                  : opt.accentBg
                                  ? `${opt.accentBg} ${opt.accentText} border ${opt.accentBorder}`
                                  : "bg-stone-100 text-stone-500 border border-stone-200"
                              } group-hover:scale-105`}
                            >
                              <OptIcon size={11} />
                            </div>

                            <div className="flex flex-col overflow-hidden">
                              <span className="text-[10px] font-bold truncate">
                                {opt.label}
                              </span>
                              <span className={`text-[8px] truncate font-normal leading-tight ${
                                isSelected ? "text-stone-300" : "text-stone-450"
                              }`}>
                                {opt.desc}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 pl-1">
                            <span className={`text-[6.5px] font-mono leading-none tracking-tight px-1 py-0.5 rounded uppercase ${
                              isSelected ? "bg-stone-850 text-stone-300 border border-stone-800" : "bg-stone-50 text-stone-450 border border-stone-150"
                            }`}>
                              {opt.val}
                            </span>
                            {isSelected && (
                              <Check size={10} className="text-emerald-500 animate-fade-in shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-6 px-4 text-center text-stone-400 flex flex-col items-center justify-center gap-1.5 bg-white/70 border border-stone-150 rounded-xl my-1">
                      <ZapOff size={18} className="text-stone-300" />
                      <div className="text-[10px] font-bold">No alignments found</div>
                      <div className="text-[8px] leading-relaxed max-w-[170px]">
                        No results for "{searchQuery}". Try selecting alternative categories.
                      </div>
                    </div>
                  )}
                </div>

                {/* Dropdown Panel Info Footer summary */}
                <div className="px-3 py-1.5 bg-stone-100 text-[7.5px] font-mono text-stone-550 border-t border-stone-200 flex items-center justify-between shrink-0 uppercase tracking-wider">
                  <span>Showing {filteredOptions.length} of {allOptions.length}</span>
                  <span>Tab: {activeCategoryTab}</span>
                </div>

              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>

      {/* DETAILED QUICK ACTION PRE-DUE RESET CONTROLLER TRIGGER */}
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            setHoveredValue(null);
          }}
          className="w-full py-2.5 rounded-2xl text-[9.5px] font-bold text-stone-500 hover:text-rose-600 bg-stone-50 hover:bg-rose-50/30 border border-stone-200/80 hover:border-rose-150 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98] z-10 shrink-0"
          title="Restore standard alignment to CSS inheritance rules"
        >
          <RotateCcw size={11} className="text-stone-400 group-hover:text-rose-500" />
          <span>Reset inherited align-items behavior</span>
        </button>
      )}
    </div>
  );
}
