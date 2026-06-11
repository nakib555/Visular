import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Monitor, Smartphone, Tablet, Settings2 } from "lucide-react";

interface Device {
  id: string;
  name: string;
  viewport: "mobile" | "tablet" | "desktop";
  width: number;
  height: number;
}

interface DevicePresetDropdownProps {
  devices: Device[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function DevicePresetDropdown({ devices, selectedId, onSelect }: DevicePresetDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    left: number;
    width: number;
    bottom?: number;
    placement: "top" | "bottom";
  } | null>(null);

  const selectedDevice = devices.find(d => d.id === selectedId) || { name: "Custom", width: "...", height: "..." };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!isOpen) return;
      
      const target = event.target as Node;
      const isInsideContainer = containerRef.current?.contains(target);
      const isInsideMenu = (target as Element).closest('#device-preset-dropdown-menu');
      
      if (!isInsideContainer && !isInsideMenu) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const updatePosition = () => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = 400; // approximate menu max height
        
        if (spaceBelow < dropdownHeight && rect.top > spaceBelow) {
          // Render above
          setDropdownPos({
            placement: "top",
            bottom: window.innerHeight - rect.top + 8,
            left: rect.left,
            width: 280, // slightly wider than trigger for better layout
            top: 0
          });
        } else {
          // Render below
          setDropdownPos({
            placement: "bottom",
            top: rect.bottom + 8,
            left: rect.left,
            width: 280
          });
        }
      };

      updatePosition();
      
      const handleScroll = (e: Event) => {
        const target = e.target as Element;
        if (target && target.closest('#device-preset-dropdown-menu')) return;
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

  const handleSelect = (id: string) => {
    onSelect(id);
  };

  const mobileDevices = devices.filter(d => d.viewport === "mobile" && d.id !== "custom");
  const tabletDevices = devices.filter(d => d.viewport === "tablet" && d.id !== "custom");
  const desktopDevices = devices.filter(d => d.viewport === "desktop" && d.id !== "custom");

  return (
    <div className="relative isolate flex items-center" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 h-8 bg-transparent hover:bg-stone-100/80 rounded-full text-[11px] font-semibold text-stone-700 transition duration-200 outline-none w-full max-w-[180px] xs:max-w-none"
      >
        <span className="truncate flex-1 text-left">{selectedDevice.name}</span>
        <span className="text-[10px] text-stone-400 font-mono pl-1 hidden md:inline-block">
          {selectedDevice.width}×{selectedDevice.height}
        </span>
        <ChevronDown size={14} className={`text-stone-400 transition-transform duration-300 flex-shrink-0 ml-1 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && dropdownPos && (
            <motion.div
              initial={{ opacity: 0, y: dropdownPos.placement === "top" ? 6 : -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="fixed bg-white border border-stone-200/80 rounded-2xl shadow-xl shadow-stone-200/50 z-[999999] flex flex-col overflow-hidden max-h-[65vh]"
              id="device-preset-dropdown-menu"
              style={{
                top: dropdownPos.placement === "bottom" ? dropdownPos.top : "auto",
                bottom: dropdownPos.placement === "top" ? dropdownPos.bottom : "auto",
                left: dropdownPos.left,
                width: dropdownPos.width,
              }}
            >
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                {/* Desktop */}
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 px-2 py-1 mb-1">
                    <Monitor size={12} className="text-sky-500" />
                    <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Desktop</h3>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {desktopDevices.map(d => (
                      <button
                        key={d.id}
                        onClick={() => handleSelect(d.id)}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-left transition-colors duration-150 ${selectedId === d.id ? "bg-sky-50 text-sky-900 font-semibold" : "text-stone-600 hover:bg-stone-50"}`}
                      >
                        <span className="text-[11px] truncate flex-1">{d.name}</span>
                        <span className={`text-[9px] font-mono flex-shrink-0 ${selectedId === d.id ? "text-sky-600/70" : "text-stone-400"}`}>{d.width}×{d.height}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Tablet */}
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 px-2 py-1 mb-1">
                    <Tablet size={12} className="text-emerald-500" />
                    <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Tablet</h3>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {tabletDevices.map(d => (
                      <button
                        key={d.id}
                        onClick={() => handleSelect(d.id)}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-left transition-colors duration-150 ${selectedId === d.id ? "bg-emerald-50 text-emerald-900 font-semibold" : "text-stone-600 hover:bg-stone-50"}`}
                      >
                        <span className="text-[11px] truncate flex-1">{d.name}</span>
                        <span className={`text-[9px] font-mono flex-shrink-0 ${selectedId === d.id ? "text-emerald-600/70" : "text-stone-400"}`}>{d.width}×{d.height}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile */}
                <div className="mb-1">
                  <div className="flex items-center gap-1.5 px-2 py-1 mb-1">
                    <Smartphone size={12} className="text-rose-500" />
                    <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Mobile</h3>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {mobileDevices.map(d => (
                      <button
                        key={d.id}
                        onClick={() => handleSelect(d.id)}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-left transition-colors duration-150 ${selectedId === d.id ? "bg-rose-50 text-rose-900 font-semibold" : "text-stone-600 hover:bg-stone-50"}`}
                      >
                        <span className="text-[11px] truncate flex-1">{d.name}</span>
                        <span className={`text-[9px] font-mono flex-shrink-0 ${selectedId === d.id ? "text-rose-600/70" : "text-stone-400"}`}>{d.width}×{d.height}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Custom Target Input Trigger */}
              <div className="border-t border-stone-100/70 p-2 mt-auto">
                 <button
                    onClick={() => handleSelect("custom")}
                    className={`flex items-center gap-2 px-3 py-2 w-full rounded-xl text-left transition-colors duration-150 ${selectedId === "custom" ? "bg-stone-100 text-stone-900 font-semibold" : "text-stone-600 hover:bg-stone-50"}`}
                  >
                    <Settings2 size={13} className={selectedId === "custom" ? "text-stone-700" : "text-stone-400"} />
                    <span className="text-[11px] flex-1">Custom Resolution...</span>
                  </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
