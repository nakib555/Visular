import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  AlignHorizontalDistributeCenter,
  AlignHorizontalDistributeStart,
  AlignHorizontalDistributeEnd,
  AlignHorizontalSpaceBetween,
  AlignHorizontalSpaceAround,
  Check,
  LayoutTemplate,
  GripHorizontal,
  Code
} from "lucide-react";

interface JustifyOption {
  value: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  badgeBg: string;
  badgeContent: React.ReactNode;
}

const justifyOptions: JustifyOption[] = [
  {
    value: "normal",
    label: "Normal",
    description: "Default packing of items",
    icon: LayoutTemplate,
    badgeBg: "bg-stone-50 border border-stone-200 p-1 rounded-lg flex items-center justify-start",
    badgeContent: (
      <div className="flex items-center gap-[2px]">
        <div className="w-[8px] h-[12px] bg-stone-400 rounded-[2px]" />
        <div className="w-[8px] h-[12px] bg-stone-400 rounded-[2px]" />
      </div>
    )
  },
  {
    value: "flex-start",
    label: "Flex Start",
    description: "Items packed toward the start line",
    icon: AlignHorizontalDistributeStart,
    badgeBg: "bg-blue-50/90 border border-blue-100/70 p-1 rounded-lg flex items-center justify-start w-10",
    badgeContent: (
      <div className="flex items-center gap-[2px] w-full pl-0.5">
        <div className="w-[8px] h-[12px] bg-blue-500 rounded-[2px]" />
        <div className="w-[8px] h-[12px] bg-blue-500 rounded-[2px]" />
      </div>
    )
  },
  {
    value: "center",
    label: "Center",
    description: "Items packed toward the center",
    icon: AlignHorizontalDistributeCenter,
    badgeBg: "bg-indigo-50/90 border border-indigo-100/70 p-1 rounded-lg flex items-center justify-center w-10",
    badgeContent: (
      <div className="flex items-center justify-center gap-[2px] w-full">
        <div className="w-[8px] h-[12px] bg-indigo-500 rounded-[2px]" />
        <div className="w-[8px] h-[12px] bg-indigo-500 rounded-[2px]" />
      </div>
    )
  },
  {
    value: "flex-end",
    label: "Flex End",
    description: "Items packed toward the end line",
    icon: AlignHorizontalDistributeEnd,
    badgeBg: "bg-rose-50/90 border border-rose-100/70 p-1 rounded-lg flex items-center justify-end w-10",
    badgeContent: (
      <div className="flex items-center justify-end gap-[2px] w-full pr-0.5">
        <div className="w-[8px] h-[12px] bg-rose-500 rounded-[2px]" />
        <div className="w-[8px] h-[12px] bg-rose-500 rounded-[2px]" />
      </div>
    )
  },
  {
    value: "space-between",
    label: "Space Between",
    description: "Items evenly distributed, first/last at edges",
    icon: AlignHorizontalSpaceBetween,
    badgeBg: "bg-emerald-50/90 border border-emerald-100/70 p-1 rounded-lg flex items-center justify-between w-10",
    badgeContent: (
      <div className="flex items-center justify-between w-full px-0.5">
        <div className="w-[8px] h-[12px] bg-emerald-500 rounded-[2px]" />
        <div className="w-[8px] h-[12px] bg-emerald-500 rounded-[2px]" />
      </div>
    )
  },
  {
    value: "space-around",
    label: "Space Around",
    description: "Items evenly distributed with equal space around",
    icon: AlignHorizontalSpaceAround,
    badgeBg: "bg-amber-50/90 border border-amber-100/70 p-1 rounded-lg flex items-center justify-around w-10",
    badgeContent: (
      <div className="flex items-center justify-around w-full">
        <div className="w-[8px] h-[12px] bg-amber-500 rounded-[2px]" />
        <div className="w-[8px] h-[12px] bg-amber-500 rounded-[2px]" />
      </div>
    )
  },
  {
    value: "space-evenly",
    label: "Space Evenly",
    description: "Items distributed with exactly equal spacing",
    icon: GripHorizontal,
    badgeBg: "bg-purple-50/90 border border-purple-100/70 p-1 rounded-lg flex items-center justify-evenly w-10",
    badgeContent: (
      <div className="flex items-center justify-evenly w-full">
        <div className="w-[8px] h-[12px] bg-purple-500 rounded-[2px]" />
        <div className="w-[8px] h-[12px] bg-purple-500 rounded-[2px]" />
      </div>
    )
  },
  {
    value: "stretch",
    label: "Stretch",
    description: "Items stretch to fill the container",
    icon: LayoutTemplate,
    badgeBg: "bg-cyan-50/90 border border-cyan-100/70 p-1 rounded-lg flex items-center justify-center w-10",
    badgeContent: (
      <div className="flex items-center justify-between w-full px-0.5 gap-[2px]">
        <div className="flex-1 h-[12px] bg-cyan-500 rounded-[2px]" />
        <div className="flex-1 h-[12px] bg-cyan-500 rounded-[2px]" />
      </div>
    )
  }
];

// include other options as simple items without special icons?
const advancedOptionsValues = [
  "start", "end", "left", "right", 
  "safe center", "safe start", "safe end", "safe flex-start", "safe flex-end", "safe left", "safe right", 
  "unsafe center", "unsafe start", "unsafe end", "unsafe flex-start", "unsafe flex-end", "unsafe left", "unsafe right", 
  "inherit", "initial", "revert", "revert-layer", "unset"
];

const advancedOptions: JustifyOption[] = advancedOptionsValues.map((opt) => ({
  value: opt,
  label: opt.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
  description: `Raw CSS value: justify-content: ${opt}`,
  icon: Code,
  badgeBg: "bg-stone-50/90 border border-stone-200/60 p-1 rounded-lg flex items-center justify-center w-10",
  badgeContent: <span className="text-[8px] text-stone-400 font-mono leading-none tracking-tight">RAW</span>
}));

const allOptions: JustifyOption[] = [...justifyOptions, ...advancedOptions];

interface JustifyContentDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function JustifyContentDropdown({ value, onChange }: JustifyContentDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  // Normalize selected value for active state checking
  const activeValue = value || "normal";
  const activeOption = allOptions.find((opt) => opt.value === activeValue) || {
    value: activeValue,
    label: activeValue.charAt(0).toUpperCase() + activeValue.slice(1),
    description: "Justify content styling option",
    icon: LayoutTemplate,
    badgeBg: "bg-stone-50 border border-stone-200 p-1 rounded-lg flex items-center justify-center",
    badgeContent: <div className="w-4 h-2 bg-stone-400 rounded-sm" />
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isInsideContainer = containerRef.current?.contains(target);
      const isInsideMenu = (target as Element).closest('#justify-dropdown-menu');
      
      if (!isInsideContainer && !isInsideMenu) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        if (e.target instanceof Element && e.target.closest('#justify-dropdown-menu')) return;
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

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full text-left relative" ref={containerRef} id="justify-dropdown-container">
      <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono flex justify-between">
        <span>Justify Content</span>
        <span className="text-[10px] font-mono font-bold text-stone-400 select-all normal-case">
          {value || "default"}
        </span>
      </label>

      {/* Styled Dropdown Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border ${
          isOpen ? "border-rose-400 ring-4 ring-rose-500/10" : "border-stone-200/85 hover:border-stone-300"
        } rounded-2xl p-3 flex items-center justify-between shadow-xs transition-all cursor-pointer text-left focus:outline-none overflow-hidden`}
        id="justify-dropdown-trigger"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex items-center justify-center w-8 h-8 shrink-0 rounded-xl bg-stone-50 border border-stone-100 text-stone-500">
            <activeOption.icon className="w-4 h-4 text-stone-600 shrink-0" />
          </div>
          <div className="flex flex-col min-w-0 pr-2 flex-1">
            <span className="text-xs font-bold text-stone-800 leading-tight truncate w-full">
              {activeOption.label}
            </span>
            <span className="text-[10px] text-stone-400 leading-none mt-0.5 truncate w-full">
              justify-content: {activeOption.value}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className={`${activeOption.badgeBg} w-9 h-7 shrink-0 flex items-center justify-center select-none`}>
            {activeOption.badgeContent}
          </div>
          <ChevronDown
            size={14}
            className={`text-stone-400 transition-transform duration-250 shrink-0 ${
              isOpen ? "rotate-180 text-rose-500" : ""
            }`}
          />
        </div>
      </button>

      {/* Structured Dropdown Overlay */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && dropdownPos && (
            <motion.div
              initial={{ opacity: 0, y: dropdownPos.placement === "top" ? 6 : -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="fixed bg-white border border-stone-200 rounded-3xl p-3 shadow-2xl z-[999999] flex flex-col"
              id="justify-dropdown-menu"
              style={{
                top: dropdownPos.placement === "bottom" ? dropdownPos.top : "auto",
                bottom: dropdownPos.placement === "top" ? dropdownPos.bottom : "auto",
                left: dropdownPos.left,
                width: dropdownPos.width,
                maxHeight: dropdownPos.maxHeight ? dropdownPos.maxHeight : "auto",
              }}
            >
              <div className="text-[9.5px] uppercase font-bold tracking-wider text-rose-600 font-mono mb-2 flex items-center gap-1.5 pl-1.5 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>Select Justify Content</span>
              </div>

            <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1 pr-1 pb-1">
              {justifyOptions.map((opt) => {
                const isSelected = activeValue === opt.value;
                const Icon = opt.icon;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`group relative text-left p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-row items-center gap-3 ${
                      isSelected
                        ? "bg-rose-50/40 border-rose-200 shadow-sm"
                        : "bg-stone-50/40 hover:bg-stone-50 border-stone-200/60 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex-1 flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-rose-600" : "text-stone-550 group-hover:text-stone-800"}`} />
                        <span className={`text-[11px] font-extrabold tracking-tight ${isSelected ? "text-rose-900" : "text-stone-700 group-hover:text-stone-900"}`}>
                          {opt.label}
                        </span>
                      </div>
                      <div className="text-[9.5px] text-stone-450 group-hover:text-stone-550 leading-snug">
                        {opt.description}
                      </div>
                    </div>

                    <div className={`${opt.badgeBg} w-10 h-7 flex-shrink-0 flex items-center justify-center relative`}>
                      {opt.badgeContent}
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-[2px] shadow-xs">
                          <Check size={8} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}

              <div className="text-[9.5px] uppercase font-bold tracking-wider text-stone-400 font-mono mt-2 mb-1 pl-1.5">
                Advanced / Raw Values
              </div>

              {advancedOptions.map((opt) => {
                const isSelected = activeValue === opt.value;
                const Icon = opt.icon;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`group relative text-left p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-row items-center gap-3 ${
                      isSelected
                        ? "bg-rose-50/40 border-rose-200 shadow-sm"
                        : "bg-stone-50/40 hover:bg-stone-50 border-stone-200/60 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex-1 flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-rose-600" : "text-stone-550 group-hover:text-stone-800"}`} />
                        <span className={`text-[11px] font-extrabold tracking-tight ${isSelected ? "text-rose-900" : "text-stone-700 group-hover:text-stone-900"}`}>
                          {opt.label}
                        </span>
                      </div>
                      <div className="text-[9.5px] text-stone-450 group-hover:text-stone-550 leading-snug">
                        {opt.description}
                      </div>
                    </div>

                    <div className={`${opt.badgeBg} w-10 h-7 flex-shrink-0 flex items-center justify-center relative`}>
                      {opt.badgeContent}
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-[2px] shadow-xs">
                          <Check size={8} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}

            </div>

            {/* Footer summary */}
            <div className="border-t border-stone-100 mt-2 pt-2 text-center flex-shrink-0">
              <span className="text-[8.5px] text-stone-400 font-mono">
                Click option to apply styling instantly properties to active node
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

