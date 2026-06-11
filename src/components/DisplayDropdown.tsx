import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  GripHorizontal,
  Grid,
  Square,
  Layers,
  AlignLeft,
  EyeOff,
  Check,
  Table,
  List,
  Combine,
  BoxSelect,
  SplitSquareHorizontal
} from "lucide-react";

interface DisplayOption {
  value: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  badgeBg: string;
  badgeContent: React.ReactNode;
}

const displayOptions: DisplayOption[] = [
  {
    value: "flex",
    label: "Flexbox",
    description: "1D layout with flexible row or column",
    icon: GripHorizontal,
    badgeBg: "bg-rose-50/90 border border-rose-100/70 p-1 rounded-lg flex items-center justify-center gap-0.5",
    badgeContent: (
      <div className="flex items-center gap-[2px] h-3">
        <div className="w-[5px] h-3.5 bg-rose-500 rounded-[2px]" />
        <div className="w-[12px] h-3.5 bg-rose-500 rounded-[2px]" />
        <div className="w-[5px] h-3.5 bg-rose-500 rounded-[2px]" />
      </div>
    )
  },
  {
    value: "grid",
    label: "CSS Grid",
    description: "2D cell matrix layout rows & cols",
    icon: Grid,
    badgeBg: "bg-purple-50/90 border border-purple-100/70 p-1 rounded-lg flex items-center justify-center",
    badgeContent: (
      <div className="grid grid-cols-2 gap-[2px]">
        <div className="w-[7px] h-[7px] bg-violet-500 rounded-[1.5px]" />
        <div className="w-[7px] h-[7px] bg-violet-500 rounded-[1.5px]" />
        <div className="w-[7px] h-[7px] bg-violet-500 rounded-[1.5px]" />
        <div className="w-[7px] h-[7px] bg-violet-500 rounded-[1.5px]" />
      </div>
    )
  },
  {
    value: "block",
    label: "Block",
    description: "Starts on new line, fills full container",
    icon: Square,
    badgeBg: "bg-amber-50/90 border border-amber-100/70 p-1 rounded-lg w-9 h-7 flex items-center justify-center",
    badgeContent: (
      <div className="flex flex-col gap-[3px] w-full px-1 h-3 justify-center">
        <div className="w-full h-[4px] bg-amber-500 rounded-[1px]" />
        <div className="w-full h-[4px] bg-amber-500/40 rounded-[1px]" />
      </div>
    )
  },
  {
    value: "inline-block",
    label: "Inline Block",
    description: "Flows with text but respects direct sizing",
    icon: Layers,
    badgeBg: "bg-emerald-50/90 border border-emerald-100/70 p-1 rounded-lg flex items-center justify-center gap-0.5",
    badgeContent: (
      <div className="flex gap-[3px] h-3 items-center">
        <div className="w-3 h-2 bg-emerald-500 rounded-[1.5px]" />
        <div className="w-3 h-2 bg-emerald-500 rounded-[1.5px]" />
      </div>
    )
  },
  {
    value: "inline",
    label: "Inline",
    description: "Renders inline, tags content without custom frame",
    icon: AlignLeft,
    badgeBg: "bg-sky-50/90 border border-sky-100/70 border-dashed p-1.5 rounded-lg flex flex-col justify-center w-9 h-7",
    badgeContent: (
      <div className="flex flex-col gap-[3px] w-full justify-center">
        <div className="w-4 h-[1px] border-t-2 border-dashed border-sky-500/80" />
        <div className="w-full h-[1px] border-t-2 border-dashed border-sky-500/80" />
      </div>
    )
  },
  {
    value: "none",
    label: "Hidden",
    description: "Element fully removed from active view flow",
    icon: EyeOff,
    badgeBg: "bg-stone-50/90 border border-stone-200/60 border-dashed p-1 rounded-lg flex items-center justify-center w-9 h-7",
    badgeContent: (
      <div className="w-4 h-3.5 border border-dashed border-stone-350 bg-stone-100/35 rounded-[2px]" />
    )
  },
  {
    value: "inline-flex",
    label: "Inline Flex",
    description: "Flexbox container that flows inline with text",
    icon: SplitSquareHorizontal,
    badgeBg: "bg-fuchsia-50/90 border border-fuchsia-100/70 p-1 rounded-lg flex items-center justify-center gap-0.5 w-9 h-7",
    badgeContent: (
      <div className="flex items-center gap-[2px] h-3">
        <div className="w-[4px] h-2.5 bg-fuchsia-500 rounded-[1px]" />
        <div className="w-[8px] h-2.5 bg-fuchsia-500 rounded-[1px]" />
        <div className="w-[4px] h-2.5 bg-fuchsia-500 rounded-[1px]" />
      </div>
    )
  },
  {
    value: "inline-grid",
    label: "Inline Grid",
    description: "Grid container that flows inline with text",
    icon: Grid,
    badgeBg: "bg-indigo-50/90 border border-indigo-100/70 p-1 rounded-lg flex items-center justify-center w-9 h-7",
    badgeContent: (
      <div className="grid grid-cols-2 gap-[1.5px]">
        <div className="w-[6px] h-[6px] bg-indigo-500 rounded-[1px]" />
        <div className="w-[6px] h-[6px] bg-indigo-500 rounded-[1px]" />
        <div className="w-[6px] h-[6px] bg-indigo-500 rounded-[1px]" />
        <div className="w-[6px] h-[6px] bg-indigo-500 rounded-[1px]" />
      </div>
    )
  },
  {
    value: "flow-root",
    label: "Flow Root",
    description: "Creates a new block formatting context",
    icon: BoxSelect,
    badgeBg: "bg-orange-50/90 border border-orange-100/70 p-1 rounded-lg flex items-center justify-center w-9 h-7",
    badgeContent: (
      <div className="border-[1.5px] border-orange-500 rounded-[2px] w-[18px] h-[14px] flex items-center justify-center">
        <div className="w-[6px] h-[2px] bg-orange-400 rounded-px" />
      </div>
    )
  },
  {
    value: "contents",
    label: "Contents",
    description: "Element doesn't produce a specific box",
    icon: Combine,
    badgeBg: "bg-teal-50/90 border border-teal-100/70 border-dotted p-1 rounded-lg flex items-center justify-center w-9 h-7",
    badgeContent: (
      <div className="flex gap-[2px]">
        <div className="w-[4px] h-[4px] bg-teal-500 rounded-full" />
        <div className="w-[4px] h-[4px] bg-teal-500 rounded-full" />
        <div className="w-[4px] h-[4px] bg-teal-500 rounded-full" />
      </div>
    )
  },
  {
    value: "table",
    label: "Table",
    description: "Behaves like a standard HTML table element",
    icon: Table,
    badgeBg: "bg-cyan-50/90 border border-cyan-100/70 p-1 rounded-lg flex items-center justify-center w-9 h-7",
    badgeContent: (
      <div className="flex flex-col gap-[1px] border border-cyan-500 p-[1px] rounded-[2px]">
        <div className="flex gap-[1px]">
          <div className="w-[5px] h-[4px] bg-cyan-400" />
          <div className="w-[5px] h-[4px] bg-cyan-400" />
        </div>
        <div className="flex gap-[1px]">
          <div className="w-[5px] h-[4px] bg-cyan-400" />
          <div className="w-[5px] h-[4px] bg-cyan-400" />
        </div>
      </div>
    )
  },
  {
    value: "table-row",
    label: "Table Row",
    description: "Behaves like a table row element",
    icon: AlignLeft,
    badgeBg: "bg-fuchsia-50/90 border border-fuchsia-100/70 p-1 rounded-lg flex items-center justify-center w-9 h-7",
    badgeContent: (
      <div className="w-full border-y border-fuchsia-500 py-[2px] flex gap-[2px] justify-center px-[2px]">
        <div className="w-[8px] h-[4px] bg-fuchsia-400 rounded-sm" />
        <div className="w-[8px] h-[4px] bg-fuchsia-400 rounded-sm" />
      </div>
    )
  },
  {
    value: "table-cell",
    label: "Table Cell",
    description: "Behaves like a table cell element",
    icon: Square,
    badgeBg: "bg-lime-50/90 border border-lime-100/70 p-1 rounded-lg flex items-center justify-center w-9 h-7",
    badgeContent: (
      <div className="border border-lime-500 p-[2px] rounded-[1px]">
        <div className="w-[12px] h-[8px] bg-lime-400 rounded-[1px]" />
      </div>
    )
  },
  {
    value: "list-item",
    label: "List Item",
    description: "Behaves like a standard list item with marker",
    icon: List,
    badgeBg: "bg-blue-50/90 border border-blue-100/70 p-1 rounded-lg flex flex-col items-center justify-center gap-[3px] w-9 h-7",
    badgeContent: (
      <div className="flex flex-col gap-[3px] w-full px-1">
        <div className="flex items-center gap-[3px]">
          <div className="w-[3px] h-[3px] bg-blue-500 rounded-full flex-shrink-0" />
          <div className="w-full h-[2px] bg-blue-400 rounded-full" />
        </div>
        <div className="flex items-center gap-[3px]">
          <div className="w-[3px] h-[3px] bg-blue-500 rounded-full flex-shrink-0" />
          <div className="w-[80%] h-[2px] bg-blue-400 rounded-full" />
        </div>
      </div>
    )
  }
];

interface DisplayDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function DisplayDropdown({ value, onChange }: DisplayDropdownProps) {
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
  const activeValue = value || "block";
  const activeOption = displayOptions.find((opt) => opt.value === activeValue) || {
    value: activeValue,
    label: activeValue === "none" ? "Hidden" : activeValue.charAt(0).toUpperCase() + activeValue.slice(1),
    description: "Display layout styling option",
    icon: Square,
    badgeBg: "bg-stone-50 border border-stone-200/60 p-1 rounded-lg flex items-center justify-center",
    badgeContent: <div className="w-4 h-2 bg-stone-400 rounded-sm" />
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isInsideContainer = containerRef.current?.contains(target);
      const isInsideMenu = (target as Element).closest('#display-dropdown-menu');
      
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
        // if user scrolls the dropdown itself, don't update/close
        if (e.target instanceof Element && e.target.closest('#display-dropdown-menu')) return;
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

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full text-left relative" ref={containerRef} id="display-dropdown-container">
      <label className="text-[10px] text-stone-550 font-bold uppercase tracking-wider pl-1 font-mono flex justify-between">
        <span>Display Value</span>
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
        } rounded-2xl p-3 flex items-center justify-between shadow-xs transition-all cursor-pointer text-left focus:outline-none`}
        id="display-dropdown-trigger"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-stone-50 border border-stone-100 text-stone-500">
            <activeOption.icon className="w-4 h-4 text-stone-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-stone-800 leading-tight">
              {activeOption.label}
            </span>
            <span className="text-[10px] text-stone-400 leading-none mt-0.5">
              {activeOption.value === "none" ? "display: none" : `display: ${activeOption.value}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Badge Display on the right of trigger */}
          <div className={`${activeOption.badgeBg} w-9 h-7 flex items-center justify-center select-none`}>
            {activeOption.badgeContent}
          </div>
          <ChevronDown
            size={14}
            className={`text-stone-400 transition-transform duration-250 ${
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
              id="display-dropdown-menu"
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
                <span>Select Display Layout</span>
              </div>

            {/* List layout matching user request to be stacked one by one */}
            <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1 pr-1 pb-1">
              {displayOptions.map((opt) => {
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

                    <div className={`${opt.badgeBg} w-9 h-7 flex-shrink-0 flex items-center justify-center relative`}>
                      {opt.badgeContent}
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-[2px] shadow-xs">
                          <Check size={8} strokeWidth={3} />
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
