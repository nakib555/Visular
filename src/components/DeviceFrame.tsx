import React from "react";
import { Layout, CheckCircle2, Layers, Lock } from "lucide-react";

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
  isEmpty
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

  if (canvasViewport === "mobile") {
    // PREMIUM PHONE DEVICE MOCKUP
    const width = canvasOrientation === "portrait" ? "375px" : "812px";
    const height = canvasOrientation === "portrait" ? "812px" : "375px";
    
    return (
      <div 
        className="bg-black p-[12px] shadow-[inset_0_0_2px_1px_rgba(255,255,255,0.15),0_0_0_1px_#171717,0_0_0_3px_#3f3f46,0_0_0_4px_#18181b,0_40px_80px_-15px_rgba(0,0,0,0.5)] flex-shrink-0 relative transition-all duration-500 ease-out flex flex-col justify-between group"
        style={{
          width,
          height,
          borderRadius: "54px"
        }}
      >
        {/* Hardware Buttons */}
        {canvasOrientation === "portrait" ? (
          <div className="absolute inset-0 pointer-events-none rounded-[54px]">
            <div className="absolute top-28 -left-[4px] w-[3px] h-8 bg-[#3f3f46] rounded-l-md shadow-inner" />
            <div className="absolute top-44 -left-[4px] w-[3px] h-14 bg-[#3f3f46] rounded-l-md shadow-inner" />
            <div className="absolute top-60 -left-[4px] w-[3px] h-14 bg-[#3f3f46] rounded-l-md shadow-inner" />
            <div className="absolute top-48 -right-[4px] w-[3px] h-20 bg-[#3f3f46] rounded-r-md shadow-inner" />
            
            {/* Glossy edge effect */ }
            <div className="absolute inset-0 rounded-[54px] border border-white/5 opacity-50 mix-blend-overlay" />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none rounded-[54px]">
            <div className="absolute left-28 -top-[4px] w-8 h-[3px] bg-[#3f3f46] rounded-t-md shadow-inner" />
            <div className="absolute left-44 -top-[4px] w-14 h-[3px] bg-[#3f3f46] rounded-t-md shadow-inner" />
            <div className="absolute left-60 -top-[4px] w-14 h-[3px] bg-[#3f3f46] rounded-t-md shadow-inner" />
            <div className="absolute left-48 -bottom-[4px] w-20 h-[3px] bg-[#3f3f46] rounded-b-md shadow-inner" />
            
            <div className="absolute inset-0 rounded-[54px] border border-white/5 opacity-50 mix-blend-overlay" />
          </div>
        )}

        {/* Home Indicator */}
        <div className={`absolute z-40 bg-white/20 backdrop-blur-sm rounded-full pointer-events-none transition-all
          ${canvasOrientation === "portrait" ? "bottom-3 left-1/2 -translate-x-1/2 w-[130px] h-[4px]" : "bottom-3 left-1/2 -translate-x-1/2 w-[130px] h-[4px]"}`} 
        />

        {/* Screen/Canvas Wrapping */}
        <div 
          id="workspace_canvas"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full h-full rounded-[42px] overflow-y-auto overflow-x-hidden scrollbar-hide relative border flex flex-col z-10 transition-all duration-300
            ${canvasBackground} 
            ${dragDropTargetId === "root" ? "border-rose-500 ring-2 ring-rose-500/50" : "border-stone-200/50"}`}
        >
          {/* Dynamic Island and Status Bar Overlay placed INSIDE the canvas but sticky/absolute */}
          <div className="sticky top-0 w-full h-[54px] z-50 flex justify-between items-center px-7 text-[12px] font-sans font-medium tracking-wide pointer-events-none"
               style={{ color: statusColor }}>
            <span className="mt-1 w-12 text-center pointer-events-auto">9:41</span>
            
            {/* Dynamic Island */}
            {canvasOrientation === "portrait" ? (
              <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[122px] h-[37px] bg-black rounded-full flex items-center shadow-md pointer-events-auto ring-1 ring-white/5">
                <div className="ml-3 w-2.5 h-2.5 rounded-full bg-orange-900/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" />
                <div className="ml-auto mr-3 w-2.5 h-2.5 rounded-full bg-orange-900/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
              </div>
            ) : (
              <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[122px] h-[37px] bg-black rounded-full shadow-md pointer-events-auto ring-1 ring-white/5">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
              </div>
            )}

            <div className="flex items-center gap-1.5 mt-1 pointer-events-auto">
              <span className="text-[10px] font-bold">5G</span>
              <div className="w-[18px] h-[10px] border rounded-[3px] p-[1px] flex items-center" style={{ borderColor: statusColor }}>
                <div className="w-full h-full rounded-[1px]" style={{ backgroundColor: statusColor }} />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col relative min-h-max pb-8 px-4 w-full pt-2">
            {isEmpty && (
              <div id="empty_view" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-[85%] p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500 z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5" />
                <Layout className="mx-auto text-stone-400 mb-3 relative z-10" size={24} />
                <h3 className="text-xs font-bold text-stone-800 tracking-tight relative z-10">Mobile Canvas</h3>
                <p className="text-[10px] text-stone-500 mt-1.5 leading-relaxed font-medium relative z-10">
                  Drag and drop elements here.
                </p>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    );
  }

  if (canvasViewport === "tablet") {
    // PREMIUM TABLET DEVICE MOCKUP
    const width = canvasOrientation === "portrait" ? "768px" : "1024px";
    const height = canvasOrientation === "portrait" ? "1024px" : "768px";

    return (
      <div 
        className="bg-[#0f0f0f] p-[16px] shadow-[inset_0_0_2px_1px_rgba(255,255,255,0.1),0_0_0_1px_#171717,0_0_0_3px_#3f3f46,0_0_0_4px_#18181b,0_40px_80px_-15px_rgba(0,0,0,0.5)] flex-shrink-0 relative transition-all duration-500 ease-out flex flex-col justify-between group"
        style={{
          width,
          height,
          borderRadius: "44px"
        }}
      >
        {/* Glossy edge effect inside hardware frame */ }
        <div className="absolute inset-0 rounded-[44px] border border-white/5 opacity-50 mix-blend-overlay pointer-events-none" />

        {/* Front camera bezel element */}
        <div className={`absolute bg-black shadow-inner z-50 flex items-center justify-center rounded-full ring-1 ring-white/5
          ${canvasOrientation === "portrait" ? "top-[8px] left-1/2 -translate-x-1/2 w-4 h-4" : "left-[8px] top-1/2 -translate-y-1/2 w-4 h-4"}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-orange-900/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" />
        </div>

        {/* Home Indicator */}
        <div className={`absolute z-40 bg-white/10 backdrop-blur-sm rounded-full pointer-events-none transition-all
          ${canvasOrientation === "portrait" ? "bottom-4 left-1/2 -translate-x-1/2 w-[160px] h-[4px]" : "bottom-4 left-1/2 -translate-x-1/2 w-[220px] h-[4px]"}`} 
        />

        {/* Screen/Canvas Wrapping */}
        <div 
          id="workspace_canvas"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full h-full rounded-[28px] overflow-y-auto overflow-x-hidden scrollbar-hide relative border flex flex-col z-10 transition-all duration-300
            ${canvasBackground} 
            ${dragDropTargetId === "root" ? "border-rose-500 ring-2 ring-rose-500/50" : "border-stone-200/50"}`}
        >
          <div className="sticky top-0 w-full h-10 flex justify-between items-center px-6 text-[12px] font-sans font-medium tracking-wide z-50 pointer-events-none"
               style={{ color: statusColor }}>
            <span className="pointer-events-auto mt-1">9:41 AM</span>
            <div className="flex gap-2 items-center pointer-events-auto mt-1">
               <span className="font-bold">100%</span>
               <div className="w-[20px] h-[11px] border rounded-[3px] p-[1px] flex items-center" style={{ borderColor: statusColor }}>
                 <div className="w-full h-full rounded-[1px]" style={{ backgroundColor: statusColor }} />
               </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col relative w-full px-6 pb-12 min-h-max">
            {isEmpty && (
              <div id="empty_view" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-sm p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500 z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5" />
                <Layout className="mx-auto text-stone-400 mb-4 xl:scale-110 relative z-10" size={28} />
                <h3 className="text-sm font-bold text-stone-800 relative z-10 tracking-tight">Tablet Canvas Empty</h3>
                <p className="text-[11px] text-stone-500 mt-2 leading-relaxed font-medium relative z-10">
                  Layout is optimized for tablet widths. Choose a library component to assemble.
                </p>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    );
  }

  // DESKTOP / BROWSER MOCKUP
  return (
    <div className="w-full max-w-[1280px] flex flex-col transition-all duration-500 items-center group">
      <div className="w-full rounded-[14px] bg-white shadow-[0_0_0_1px_rgba(15,15,15,0.05),0_30px_60px_-15px_rgba(0,0,0,0.2),0_50px_100px_-20px_rgba(0,0,0,0.15)] ring-1 ring-black/5 overflow-hidden transition-all duration-500 flex flex-col relative h-[85vh]">
        {/* Browser Header / Native Window chrome */}
        <div className="w-full h-[46px] bg-[#f2f2f2] border-b border-stone-300/80 flex items-center px-4 justify-between select-none z-40 shrink-0 relative backdrop-blur-md">
          {/* Traffic circles (macOS style) */}
          <div className="flex items-center gap-2 w-24 relative z-10">
            <div className="w-[11px] h-[11px] rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer shadow-sm hover:brightness-110 transition-all" />
            <div className="w-[11px] h-[11px] rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer shadow-sm hover:brightness-110 transition-all" />
            <div className="w-[11px] h-[11px] rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer shadow-sm hover:brightness-110 transition-all" />
          </div>

          {/* Browser Address Box */}
          <div className="flex-1 max-w-[480px] mx-auto bg-white border border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-[6px] h-7 flex items-center justify-center gap-1.5 text-[11px] text-stone-500 font-medium font-sans relative z-10">
            <Lock size={11} className="text-stone-400" />
            <span className="tracking-wide">localhost:3000</span>
          </div>

          {/* Right side window control indicators */}
          <div className="flex items-center gap-3 justify-end w-24 text-stone-400 relative z-10">
            <Layers size={14} className="hover:text-stone-700 transition cursor-pointer" />
          </div>
        </div>

        {/* Screen/Canvas Wrapping */}
        <div 
          id="workspace_canvas"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex-1 w-full overflow-y-auto overflow-x-hidden scrollbar-default relative border-0 flex flex-col z-10
            ${canvasBackground} 
            ${dragDropTargetId === "root" ? "ring-2 ring-inset ring-rose-500/50" : ""}`}
        >
          <div className="flex-1 flex flex-col w-full relative min-h-max">
            {isEmpty && (
              <div id="empty_view" className="m-auto mt-[20vh] text-center max-w-lg p-10 bg-white/80 backdrop-blur-md rounded-[20px] border border-stone-200 shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500 z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5" />
                <Layout className="mx-auto text-stone-300 mb-4 relative z-10" size={32} />
                <h3 className="text-sm font-bold text-stone-800 tracking-tight relative z-10">Desktop Canvas Outline</h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed font-medium relative z-10">
                  Start by dragging layout containers to construct your layout hierarchy, then insert individual text, image, and interactive elements.
                </p>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
