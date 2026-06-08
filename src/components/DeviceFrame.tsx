import React from "react";
import { Layout, Layers, Lock, Wifi, WifiOff, Battery, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DeviceFrameProps {
  canvasViewport: "desktop" | "tablet" | "mobile";
  canvasOrientation: "portrait" | "landscape";
  backdropTheme: "stone" | "zinc" | "grid";
  children: React.ReactNode;
  
  draggedId: string | null;
  dragDropTargetId: string | null;
  setDragDropTargetId: (id: string | null) => void;
  setDragDropPosition: (pos: "inside" | "before" | "after" | null) => void;
  moveElement: (dragged: string, target: string, position: "inside" | "before" | "after") => void;
  isEmpty: boolean;

  // PREMIUM INTERACTIVE SIMULATION PROPS
  customWidth?: number;
  customHeight?: number;
  deviceName?: string;
  showGridGuides?: boolean;
  batteryLevel?: number; // 0 - 100
  networkStatus?: "5G" | "4G" | "Wi-Fi" | "Offline";
  simulatedTime?: string;
  glossyOverlay?: boolean;
  notificationText?: string | null;
  onClearNotification?: () => void;
}

export function DeviceFrame({
  canvasViewport,
  canvasOrientation,
  backdropTheme,
  children,
  draggedId,
  dragDropTargetId,
  setDragDropTargetId,
  setDragDropPosition,
  moveElement,
  isEmpty,

  customWidth,
  customHeight,
  deviceName = "iPhone 15 Pro",
  showGridGuides = false,
  batteryLevel = 100,
  networkStatus = "Wi-Fi",
  simulatedTime = "9:41",
  glossyOverlay = true,
  notificationText = null,
  onClearNotification
}: DeviceFrameProps) {

  const canvasBackground = backdropTheme === "grid" 
    ? "bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
    : backdropTheme === "zinc"
    ? "bg-stone-950 border-stone-900"
    : "bg-stone-50 border-stone-100";

  const statusColor = backdropTheme === "zinc" ? "#e7e5e4" : "#1c1917";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedId && draggedId !== "root" && dragDropTargetId !== "root") {
      setDragDropTargetId("root");
      setDragDropPosition("inside");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (dragDropTargetId === "root") {
      setDragDropTargetId(null);
      setDragDropPosition(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedId && draggedId !== "root" && dragDropTargetId === "root") {
      moveElement(draggedId, "root", "inside");
    }
    setDragDropTargetId(null);
    setDragDropPosition(null);
  };

  // Battery Level Color Logic
  const getBatteryColor = () => {
    if (batteryLevel <= 20) return "bg-rose-500";
    if (batteryLevel <= 40) return "bg-amber-500";
    return statusColor;
  };

  // 1. Calculate dimensions and styles based on viewport
  let outerClasses = "";
  let outerStyle: React.CSSProperties = {};
  let decorationElements: React.ReactNode = null;
  let canvasClasses = "";
  let innerDecorationElements: React.ReactNode = null;

  if (canvasViewport === "mobile") {
    const baseW = customWidth || 375;
    const baseH = customHeight || 812;
    
    outerClasses = "bg-black p-[12px] shadow-[inset_0_0_2px_1px_rgba(255,255,255,0.15),0_0_0_1px_#171717,0_0_0_4px_#3f3f46,0_0_0_5px_#18181b,0_40px_80px_-15px_rgba(0,0,0,0.5)] flex-shrink-0 relative flex flex-col group w-full h-full";
    outerStyle = { borderRadius: "54px", maxWidth: "none" };
    canvasClasses = `w-full h-full rounded-[42px] overflow-y-auto overflow-x-hidden scrollbar-hide relative border flex flex-col z-10 ${canvasBackground} ${dragDropTargetId === "root" ? "border-rose-500 ring-2 ring-rose-500/50" : "border-stone-200/50"}`;

    decorationElements = (
      <>
        {/* Hardware Buttons */}
        {canvasOrientation === "portrait" ? (
          <div className="absolute inset-0 pointer-events-none rounded-[54px] z-20">
            <div className="absolute top-28 -left-[4px] w-[3px] h-8 bg-[#3f3f46] rounded-l-md shadow-inner" />
            <div className="absolute top-44 -left-[4px] w-[3px] h-14 bg-[#3f3f46] rounded-l-md shadow-inner" />
            <div className="absolute top-60 -left-[4px] w-[3px] h-14 bg-[#3f3f46] rounded-l-md shadow-inner" />
            <div className="absolute top-48 -right-[4px] w-[3px] h-20 bg-[#3f3f46] rounded-r-md shadow-inner" />
            <div className="absolute inset-0 rounded-[54px] border border-white/5 opacity-50 mix-blend-overlay" />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none rounded-[54px] z-20">
            <div className="absolute left-28 -top-[4px] w-8 h-[3px] bg-[#3f3f46] rounded-t-md shadow-inner" />
            <div className="absolute left-44 -top-[4px] w-14 h-[3px] bg-[#3f3f46] rounded-t-md shadow-inner" />
            <div className="absolute left-60 -top-[4px] w-14 h-[3px] bg-[#3f3f46] rounded-t-md shadow-inner" />
            <div className="absolute left-48 -bottom-[4px] w-20 h-[3px] bg-[#3f3f46] rounded-b-md shadow-inner" />
            <div className="absolute inset-0 rounded-[54px] border border-white/5 opacity-50 mix-blend-overlay" />
          </div>
        )}
        {/* Home Indicator */}
        <div className={`absolute z-40 bg-stone-300/40 backdrop-blur-xs rounded-full pointer-events-none transition-all
          ${canvasOrientation === "portrait" ? "bottom-3 left-1/2 -translate-x-1/2 w-[130px] h-[4px]" : "bottom-3 left-1/2 -translate-x-1/2 w-[130px] h-[4px]"}`} 
        />
      </>
    );

    innerDecorationElements = (
      <>
        {/* Dynamic Island and Status Bar Overlay placed INSIDE the canvas but sticky/absolute */}
        <div className="sticky top-0 w-full h-[54px] z-50 flex justify-between items-center px-7 text-[12px] font-sans font-semibold tracking-wide pointer-events-none shrink-0"
             style={{ color: statusColor }}>
          <span className="mt-1 w-12 text-center pointer-events-auto font-mono text-[11px]">{simulatedTime}</span>
          
          {/* Dynamic Island */}
          {canvasOrientation === "portrait" ? (
            <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[110px] h-[28px] bg-black rounded-full flex items-center shadow-md pointer-events-auto ring-1 ring-white/5">
              <div className="ml-3 w-2 h-2 rounded-full bg-orange-900/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" />
              <div className="ml-auto mr-3 w-1.5 h-1.5 rounded-full bg-zinc-900 border border-zinc-750" />
            </div>
          ) : (
            <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[110px] h-[28px] bg-black rounded-full shadow-md pointer-events-auto ring-1 ring-white/5">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            </div>
          )}

          <div className="flex items-center gap-1.5 mt-1 pointer-events-auto">
            {networkStatus === "Offline" ? (
              <WifiOff size={12} className="text-rose-550 filter drop-shadow-xs" />
            ) : networkStatus === "Wi-Fi" ? (
              <Wifi size={12} />
            ) : (
              <span className="text-[9px] font-bold tracking-tighter">{networkStatus}</span>
            )}
            <div className="w-[18px] h-[10px] border rounded-[3px] p-[1px] flex items-center" style={{ borderColor: statusColor }}>
              <div 
                className={`h-full rounded-[1px] transition-all duration-300 ${getBatteryColor()}`} 
                style={{ width: `${batteryLevel}%` }} 
              />
            </div>
          </div>
        </div>
      </>
    );
  } else if (canvasViewport === "tablet") {
    const baseW = customWidth || 768;
    const baseH = customHeight || 1024;

    outerClasses = "bg-[#0f0f0f] p-[16px] shadow-[inset_0_0_2px_1px_rgba(255,255,255,0.1),0_0_0_1px_#171717,0_0_0_4px_#3f3f46,0_0_0_5px_#18181b,0_40px_80px_-15px_rgba(0,0,0,0.5)] flex-shrink-0 relative flex flex-col group w-full h-full";
    outerStyle = { borderRadius: "44px", maxWidth: "none" };
    canvasClasses = `w-full h-full rounded-[28px] overflow-y-auto overflow-x-hidden scrollbar-hide relative border flex flex-col z-10 ${canvasBackground} ${dragDropTargetId === "root" ? "border-rose-500 ring-2 ring-rose-500/50" : "border-stone-200/50"}`;

    decorationElements = (
      <>
        {/* Hardware Buttons */}
        {canvasOrientation === "portrait" ? (
          <div className="absolute inset-0 pointer-events-none rounded-[44px] z-20">
            <div className="absolute top-16 -right-[4px] w-[3px] h-12 bg-[#3f3f46] rounded-r-md shadow-inner" />
            <div className="absolute top-32 -right-[4px] w-[3px] h-12 bg-[#3f3f46] rounded-r-md shadow-inner" />
            <div className="absolute -top-[4px] right-24 h-[3px] w-12 bg-[#3f3f46] rounded-t-md shadow-inner" />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none rounded-[44px] z-20">
            <div className="absolute left-16 -top-[4px] w-12 h-[3px] bg-[#3f3f46] rounded-t-md shadow-inner" />
            <div className="absolute left-32 -top-[4px] w-12 h-[3px] bg-[#3f3f46] rounded-t-md shadow-inner" />
            <div className="absolute -left-[4px] top-24 w-[3px] h-12 bg-[#3f3f46] rounded-l-md shadow-inner" />
          </div>
        )}
        <div className="absolute inset-0 rounded-[44px] border border-white/5 opacity-50 mix-blend-overlay pointer-events-none" />
        {/* Front camera */}
        <div className={`absolute bg-black shadow-inner z-50 flex items-center justify-center rounded-full ring-1 ring-white/5 transition-all duration-500
          ${canvasOrientation === "portrait" ? "top-[8px] left-1/2 -translate-x-1/2 w-4 h-4" : "left-[8px] top-1/2 -translate-y-1/2 w-4 h-4"}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-orange-900/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" />
        </div>
        {/* Home Indicator */}
        <div className={`absolute z-40 bg-stone-300/30 backdrop-blur-xs rounded-full pointer-events-none transition-all duration-500
          ${canvasOrientation === "portrait" ? "bottom-4 left-1/2 -translate-x-1/2 w-[160px] h-[4px]" : "bottom-4 left-1/2 -translate-x-1/2 w-[280px] h-[4px]"}`} 
        />
      </>
    );

    innerDecorationElements = (
      <>
        {/* Tablet Status Bar */}
        <div className="sticky top-0 w-full h-10 flex justify-between items-center px-6 text-[12px] font-sans font-semibold tracking-wide z-50 pointer-events-none shrink-0 animate-in fade-in duration-200"
             style={{ color: statusColor }}>
          <span className="pointer-events-auto mt-1 font-mono text-[11px]">{simulatedTime}</span>
          <div className="flex gap-2 items-center pointer-events-auto mt-1">
            {networkStatus === "Offline" ? (
              <WifiOff size={12} className="text-rose-550" />
            ) : networkStatus === "Wi-Fi" ? (
              <Wifi size={12} />
            ) : (
              <span className="text-[9px] font-bold tracking-tighter">{networkStatus}</span>
            )}
            <span className="font-mono text-[10px]">{batteryLevel}%</span>
             <div className="w-[20px] h-[11px] border rounded-[3px] p-[1px] flex items-center" style={{ borderColor: statusColor }}>
               <div 
                 className={`h-full rounded-[1px] transition-all duration-300 ${getBatteryColor()}`} 
                 style={{ width: `${batteryLevel}%` }} 
               />
             </div>
          </div>
        </div>
      </>
    );
  } else {
    // DESKTOP
    // Make the outer container emulate the "window" structure so `#workspace_canvas` aligns perfectly
    outerClasses = "bg-white shadow-[0_0_0_1px_rgba(15,15,15,0.05),0_30px_60px_-15px_rgba(0,0,0,0.2),0_50px_100px_-20px_rgba(0,0,0,0.15)] ring-1 ring-black/5 flex-shrink-0 relative flex flex-col group w-full h-full";
    // We give it a fixed height from preset configuration
    outerStyle = { borderRadius: "14px", maxWidth: "none" };
    canvasClasses = `flex-1 w-full overflow-y-auto overflow-x-hidden scrollbar-default relative border-0 flex flex-col z-10 rounded-b-[14px] ${canvasBackground} ${dragDropTargetId === "root" ? "ring-2 ring-inset ring-rose-500/50" : ""}`;

    decorationElements = (
      <div className="w-full h-[46px] bg-[#f2f2f2] border-b border-stone-300/80 flex items-center px-4 justify-between select-none z-40 shrink-0 relative backdrop-blur-md rounded-t-[14px]">
        {/* Traffic circles */}
        <div className="flex items-center gap-2 w-24 relative z-10">
          <div className="w-[11px] h-[11px] rounded-full bg-[#ff5f56] border border-[#e0443e] hover:brightness-110 transition-all pointer-events-none" />
          <div className="w-[11px] h-[11px] rounded-full bg-[#ffbd2e] border border-[#dea123] hover:brightness-110 transition-all pointer-events-none" />
          <div className="w-[11px] h-[11px] rounded-full bg-[#27c93f] border border-[#1aab29] hover:brightness-110 transition-all pointer-events-none" />
        </div>
        {/* Browser Address Box */}
        <div className="flex-1 max-w-[480px] mx-auto bg-white border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-[6px] h-7 flex items-center justify-center gap-1.5 text-[11px] text-stone-500 font-semibold font-mono relative z-10 pointer-events-none">
          <Lock size={11} className="text-stone-400 shrink-0" />
          <span className="tracking-wide">localhost:3000/preview</span>
        </div>
        {/* Extensions */}
        <div className="flex items-center gap-3 justify-end w-24 text-stone-400 relative z-10 pointer-events-none">
          <Layers size={14} className="hover:text-stone-700 transition" />
        </div>
      </div>
    );
  }

  return (
    <div className={outerClasses} style={outerStyle}>
      {/* Device unique layers (Bezels, Cams, Hardware Buttons, or Browser Headers) */}
      {decorationElements}

      {/* UNIFIED Screen/Canvas Wrapping Container */}
      <div 
        id="workspace_canvas"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={canvasClasses}
      >
        {innerDecorationElements}

        <div className={`flex-1 flex flex-col relative min-h-max w-full ${canvasViewport === "mobile" ? "pb-8 px-4 pt-2" : canvasViewport === "tablet" ? "px-6 pb-12" : ""}`}>
          
          {/* Safe Guides Overlay */}
          {showGridGuides && canvasViewport === "mobile" && (
            <div className="absolute inset-x-0 top-[2px] bottom-0 z-30 pointer-events-none">
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 select-none">
                <div className="border-r border-b border-dashed border-rose-500/20" />
                <div className="border-r border-b border-dashed border-rose-500/20" />
                <div className="border-b border-dashed border-rose-500/20" />
                
                <div className="border-r border-b border-dashed border-rose-500/20" />
                <div className="border-r border-b border-dashed border-rose-500/20" />
                <div className="border-b border-dashed border-rose-500/20" />
                
                <div className="border-r border-dashed border-rose-500/20" />
                <div className="border-r border-dashed border-rose-500/20" />
                <div className="border-stone-100/0" />
              </div>
              <div className="absolute inset-y-0 left-4 right-4 border-x border-sky-400/20">
                <div className="absolute top-4 bottom-4 left-0 right-0 border-y border-sky-400/20" />
                <span className="absolute left-1 top-1 text-[8px] font-bold text-sky-500/40 font-mono">16px Safe</span>
              </div>
            </div>
          )}

          {showGridGuides && canvasViewport === "tablet" && (
            <div className="absolute inset-x-0 top-0 bottom-0 z-30 pointer-events-none">
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 select-none">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="border-r border-b border-dashed border-rose-500/10" />
                ))}
              </div>
              <div className="absolute inset-y-0 left-6 right-6 border-x border-sky-400/20">
                <div className="absolute top-6 bottom-6 left-0 right-0 border-y border-sky-400/20" />
                <span className="absolute left-2 top-2 text-[8px] font-bold text-sky-500/40 font-mono">24px Safe Area</span>
              </div>
            </div>
          )}

          {showGridGuides && canvasViewport === "desktop" && (
            <div className="absolute inset-x-0 top-0 bottom-0 z-30 pointer-events-none select-none">
              <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="border-r border-dashed border-rose-500/5 h-full relative">
                    <span className="absolute bottom-1 right-1 text-[7px] text-rose-500/30 font-mono">col {i+1}</span>
                  </div>
                ))}
              </div>
              <div className="absolute inset-x-12 top-0 bottom-0 border-x border-sky-400/10 pointer-events-none">
                <span className="absolute left-2 top-2 text-[8px] font-bold text-sky-500/35 font-mono">Desktop safe grid container</span>
              </div>
            </div>
          )}

          {/* Gloss Reflection glare overlay */}
          {glossyOverlay && canvasViewport === "mobile" && (
            <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden rounded-[42px]">
              <div className="absolute top-0 left-0 w-full h-[200%] bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent rotate-[34deg] -translate-x-[20%] -translate-y-[40%]" />
            </div>
          )}

          {glossyOverlay && canvasViewport === "tablet" && (
            <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden rounded-[28px]">
              <div className="absolute top-0 left-0 w-full h-[200%] bg-gradient-to-tr from-transparent via-white/[0.03]/40 to-transparent rotate-[34deg] -translate-x-[20%] -translate-y-[40%]" />
            </div>
          )}

          {glossyOverlay && canvasViewport === "desktop" && (
            <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[200%] bg-gradient-to-tr from-transparent via-white/[0.015] to-transparent rotate-[34deg] -translate-x-[20%] -translate-y-[40%]" />
            </div>
          )}

          {/* Simulated Live Notification Panel */}
          <AnimatePresence>
            {notificationText && canvasViewport === "mobile" && (
              <motion.div
                initial={{ y: -70, opacity: 0, scale: 0.9 }}
                animate={{ y: 8, opacity: 1, scale: 1 }}
                exit={{ y: -70, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 14, stiffness: 180 }}
                className="absolute top-2 left-3 right-3 z-50 bg-white/95 backdrop-blur-md shadow-lg border border-stone-200/80 rounded-2xl p-3 flex gap-2.5 items-center pointer-events-auto text-left"
              >
                <div className="w-7 h-7 bg-rose-600 rounded-xl flex items-center justify-center text-white shrink-0 font-serif font-black italic shadow-xs text-sm">
                  V
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-baseline">
                     <span className="text-[9px] font-bold text-stone-800 uppercase tracking-tight font-mono">Visual Lab</span>
                     <span className="text-[7.5px] text-stone-400 font-bold font-mono">now</span>
                  </div>
                  <p className="text-[9.5px] text-stone-600 font-semibold leading-normal line-clamp-2 mt-0.5">{notificationText}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onClearNotification) onClearNotification();
                  }}
                  className="w-4 h-4 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition text-[10px] font-bold"
                >
                  &times;
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State Prompts */}
          {isEmpty && (
            <div id="empty_view" className={`absolute z-10 bg-white/80 backdrop-blur-md border border-stone-200 shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500
              ${canvasViewport === "mobile" 
                ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-[85%] p-6 rounded-2xl" 
                : canvasViewport === "tablet"
                ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-sm p-8 rounded-2xl w-[85%]"
                : "relative mx-auto mt-[20vh] text-center max-w-lg p-10 rounded-[20px] w-[85%]"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5" />
              <Layout className="mx-auto text-stone-400 mb-3 relative z-10" size={canvasViewport === "desktop" ? 32 : 24} />
              <h3 className="text-xs font-bold text-stone-800 tracking-tight relative z-10">{deviceName}</h3>
              <p className="text-[10px] text-stone-500 mt-1.5 leading-relaxed font-semibold relative z-10">
                {canvasViewport === "mobile" && "Drag and drop elements here to construct your mobile UI."}
                {canvasViewport === "tablet" && "Layout is optimized for tablet widths. Build bento cells or multi-column grids."}
                {canvasViewport === "desktop" && "Start by dragging layout containers to construct your layout hierarchy, then insert individual text, image, and interactive elements."}
              </p>
            </div>
          )}

          {/* User Built Application Content */}
          {children}

        </div>
      </div>
    </div>
  );
}
