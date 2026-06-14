import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  RotateCcw, 
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
  propName?: string;
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
  badgeBg?: string;
  badgeContent?: React.ReactNode;
}

const getBadgeStyling = (val: string) => {
  if (val.includes("stretch")) {
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
  if (val.includes("center")) {
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
  if (val.includes("start") || val.includes("normal")) {
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
  if (val.includes("end")) {
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
  if (val.includes("baseline")) {
    return {
      badgeBg: "bg-amber-50/90 border border-amber-100/70 p-1 rounded-lg w-9 h-7 overflow-hidden flex items-end justify-center shrink-0 relative",
      badgeContent: (
        <div className="flex gap-[2px] w-full h-full items-end justify-center relative pb-1">
          <div className="w-full absolute bottom-2 left-0 border-t border-amber-500/60 border-dashed" />
          <div className="w-[5px] h-2 bg-amber-400 rounded-[1.5px] relative z-10" />
          <div className="w-[5px] h-[11px] bg-amber-400 rounded-[1.5px] relative z-10 text-transparent" />
          <div className="w-[5px] h-1.5 bg-amber-400 rounded-[1.5px] relative z-10" />
        </div>
      )
    };
  }

  // generic fallback
  return {
    badgeBg: "bg-stone-50 flex items-center justify-center border border-stone-200/80 p-1 rounded-lg w-9 h-7 shrink-0",
    badgeContent: <span className="text-[8.5px] font-mono text-stone-400 uppercase font-bold tracking-tight">{val.slice(0, 3)}</span>
  };
};

export function AlignItemsControl({ propName = "align-items", value, onChange, currentDirection = "row" }: AlignItemsControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryTab, setActiveCategoryTab] = useState<"all" | "core" | "placement" | "baseline" | "safe" | "unsafe" | "globals">("all");
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  
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
      const clickInsidePortal = (target as Element).closest("#align-items-dropdown-menu");
      if (!clickInsideContainer && !clickInsidePortal) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Monitor element geometry and dynamically reposition dropdown when open
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const updatePosition = () => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 350; // approximate menu height
        
        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
          // Render above
          setDropdownPos({
            placement: "top",
            bottom: window.innerHeight - rect.top + 8,
            left: rect.left,
            width: rect.width,
            top: 0,
            maxHeight: spaceAbove - 16
          });
        } else {
          // Render below
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
        // if user scrolls the dropdown itself, don't update/close
        if (e.target instanceof Element && e.target.closest('#align-items-dropdown-menu')) return;
        // Re-calculate position to stick it to the element during scroll
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

  const activeAlignmentValue = hoveredValue !== null ? hoveredValue : (value || "stretch");

  // Flat array of all 32 distinct interactive align-items values
  const allOptions: AlignmentOption[] = useMemo(() => [
    { val: "stretch", label: "Stretch", desc: "Items expand to fill cross-axis fully", icon: Maximize2, category: "core", color: "from-indigo-450 to-blue-500" },
    { val: "center", label: "Center", desc: "Items aligned down cross-axis center", icon: AlignCenter, category: "core", color: "from-purple-450 to-indigo-500" },
    { val: "flex-start", label: "Flex Start", desc: "Align items at starting line of the container", icon: AlignStartVertical, category: "core", color: "from-emerald-450 to-teal-500" },
    { val: "flex-end", label: "Flex End", desc: "Align items at trailing edge of the container", icon: AlignEndVertical, category: "core", color: "from-rose-450 to-pink-500" },
    { val: "baseline", label: "Baseline", desc: "Align elements matching text baseline rules", icon: Baseline, category: "core", color: "from-amber-450 to-orange-500" },
    { val: "normal", label: "Normal Fallback", desc: "Default layout fallback placement rules", icon: Compass, category: "placement" },
    { val: "start", label: "Start Edge", desc: "Align content tightly to beginning edge", icon: Compass, category: "placement" },
    { val: "end", label: "End Edge", desc: "Align content tightly to trailing end edge", icon: Compass, category: "placement" },
    { val: "self-start", label: "Self Start", desc: "Align element to its own layout start edge", icon: Compass, category: "placement" },
    { val: "self-end", label: "Self End", desc: "Align element to its own layout end edge", icon: Compass, category: "placement" },
    { val: "anchor-center", label: "Anchor Center", desc: "Align exactly to targets' anchor midline", icon: Sparkles, category: "placement" },
    { val: "first baseline", label: "First Baseline", desc: "Align matching first text baseline", icon: Focus, category: "baseline" },
    { val: "last baseline", label: "Last Baseline", desc: "Align matching last text baseline", icon: Focus, category: "baseline" },
    { val: "safe center", label: "Safe Center", desc: "Align center with overflow clipping prevention", icon: ShieldCheck, category: "safe" },
    { val: "safe start", label: "Safe Start", desc: "Align start layout with overflow safety bounds", icon: ShieldCheck, category: "safe" },
    { val: "safe end", label: "Safe End", desc: "Align trailing edge with overflow safety bounds", icon: ShieldCheck, category: "safe" },
    { val: "safe flex-start", label: "Safe Flex-Start", desc: "Flex-start alignment with clipping protection", icon: ShieldCheck, category: "safe" },
    { val: "safe flex-end", label: "Safe Flex-End", desc: "Flex-end alignment with clipping protection", icon: ShieldCheck, category: "safe" },
    { val: "safe self-start", label: "Safe Self-Start", desc: "Self-start alignment fallback guard", icon: ShieldCheck, category: "safe" },
    { val: "safe self-end", label: "Safe Self-End", desc: "Self-end alignment fallback guard", icon: ShieldCheck, category: "safe" },
    { val: "unsafe center", label: "Unsafe Center", desc: "Force center regardless of dimensions causing clip", icon: ZapOff, category: "unsafe" },
    { val: "unsafe start", label: "Unsafe Start", desc: "Force start layout discarding overflow safety", icon: ZapOff, category: "unsafe" },
    { val: "unsafe end", label: "Unsafe End", desc: "Force end layout discarding overflow safety", icon: ZapOff, category: "unsafe" },
    { val: "unsafe flex-start", label: "Unsafe Flex-Start", desc: "Force flex-start ignoring document box size", icon: ZapOff, category: "unsafe" },
    { val: "unsafe flex-end", label: "Unsafe Flex-End", desc: "Force flex-end ignoring document box size", icon: ZapOff, category: "unsafe" },
    { val: "unsafe self-start", label: "Unsafe Self-Start", desc: "Force self-start ignoring box overflow safeguards", icon: ZapOff, category: "unsafe" },
    { val: "unsafe self-end", label: "Unsafe Self-End", desc: "Force self-end ignoring box overflow safeguards", icon: ZapOff, category: "unsafe" },
    { val: "inherit", label: "Inherit", desc: "Directly inherit parent container alignment", icon: Link, category: "globals" },
    { val: "initial", label: "Initial", desc: "Revert back to standard initial CSS specs", icon: Link, category: "globals" },
    { val: "revert", label: "Revert", desc: "Roll back style to user-agent default styles", icon: Link, category: "globals" },
    { val: "revert-layer", label: "Revert Layer", desc: "Roll back to match the outer cascade layer", icon: Link, category: "globals" },
    { val: "unset", label: "Unset", desc: "Clear value inheriting from parent if possible", icon: Link, category: "globals" }
  ], []);

  // Filter options dynamically by category and search queries
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

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery("");
  };

  const ActiveIcon = currentActiveOption.icon;

  return (
    <div className="flex flex-col gap-1.5 w-full text-left relative" ref={containerRef} id="align-items-dropdown-container">
      <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono flex justify-between">
        <span>{propName.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</span>
        <span className="text-[10px] font-mono font-bold text-stone-400 select-all normal-case">
          {value || "default"}
        </span>
      </label>

      {/* Styled Dropdown Trigger Button matching DisplayDropdown */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border ${
          isOpen ? "border-indigo-400 ring-4 ring-indigo-500/10" : "border-stone-200/85 hover:border-stone-300"
        } rounded-2xl p-3 flex items-center justify-between shadow-xs transition-all cursor-pointer text-left focus:outline-none overflow-hidden`}
        id="align-items-dropdown-trigger"
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
          {/* Badge Display on the right of trigger */}
          <div className={`${getBadgeStyling(value || "stretch").badgeBg} select-none`}>
            {getBadgeStyling(value || "stretch").badgeContent}
          </div>
          <ChevronDown
            size={14}
            className={`text-stone-400 transition-transform duration-250 shrink-0 ${
              isOpen ? "rotate-180 text-indigo-500" : ""
            }`}
          />
        </div>
      </button>

      {/* Expandable Dropdown Container List Panel rendered with top-level DOM body Portal */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && dropdownPos && (
            <motion.div
              id="align-items-dropdown-menu"
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
                <span>Select Alignment ({allOptions.length})</span>
              </div>

              {/* Dynamic Filter / Search Bar */}
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

              {/* Horizontal Category Tab list */}
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

              {/* Filtered option rows list wrapper */}
              <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1 pr-1 pb-1">
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
                        onClick={() => handleSelect(isSelected ? "" : opt.val)}
                        className={`group relative text-left p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-row items-center gap-3 ${
                          isSelected
                            ? "bg-indigo-50/40 border-indigo-200 shadow-sm"
                            : "bg-stone-50/40 hover:bg-stone-50 border-stone-200/60 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex-1 flex flex-col gap-0.5 pl-1">
                          <div className="flex items-center gap-2">
                            <OptIcon className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-600" : "text-stone-500 group-hover:text-stone-800"}`} />
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
                      No results for "{searchQuery}". Try selecting alternative categories.
                    </div>
                  </div>
                )}
              </div>

              {/* Footer summary */}
              <div className="border-t border-stone-100 mt-2 pt-2 text-center flex-shrink-0 flex items-center justify-between px-1">
                <span className="text-[8.5px] text-stone-500 font-mono">
                  Showing {filteredOptions.length} of {allOptions.length}
                </span>
                {value && (
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
    </div>
  );
}
