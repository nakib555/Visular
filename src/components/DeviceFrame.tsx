import React from "react";
import { Layout, CheckCircle2, Layers } from "lucide-react";

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
        className="bg-neutral-950 p-[12px] shadow-[0_28px_65px_-12px_rgba(0,0,0,0.68),0_0_0_10px_#18181b] border border-neutral-800 flex-shrink-0 relative transition-all duration-500 ease-out flex flex-col justify-between"
        style={{
          width,
          height,
          borderRadius: "55px"
        }}
      >
        {/* Hardware Buttons */}
        {canvasOrientation === "portrait" ? (
          <>
            <div className="absolute top-28 -left-[2.5px] w-[2.5px] h-8 bg-neutral-800/80 rounded-l-md" />
            <div className="absolute top-44 -left-[2.5px] w-[2.5px] h-14 bg-neutral-800/80 rounded-l-md" />
            <div className="absolute top-60 -left-[2.5px] w-[2.5px] h-14 bg-neutral-800/80 rounded-l-md" />
            <div className="absolute top-48 -right-[2.5px] w-[2.5px] h-20 bg-neutral-800/80 rounded-r-md" />
          </>
        ) : (
          <>
            <div className="absolute left-28 -top-[2.5px] w-8 h-[2.5px] bg-neutral-800/80 rounded-t-md" />
            <div className="absolute left-44 -top-[2.5px] w-14 h-[2.5px] bg-neutral-800/80 rounded-t-md" />
            <div className="absolute left-60 -top-[2.5px] w-14 h-[2.5px] bg-neutral-800/80 rounded-t-md" />
            <div className="absolute left-48 -bottom-[2.5px] w-20 h-[2.5px] bg-neutral-800/80 rounded-b-md" />
          </>
        )}

        {/* Home Indicator */}
        <div className={`absolute z-40 bg-stone-500/80 rounded-full pointer-events-none 
          ${canvasOrientation === "portrait" ? "bottom-2.5 left-1/2 -translate-x-1/2 w-[134px] h-[5px]" : "bottom-2.5 left-1/2 -translate-x-1/2 w-[200px] h-[5px]"}`} 
        />

        {/* Screen/Canvas Wrapping */}
        <div 
          id="workspace_canvas"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full h-full rounded-[43px] overflow-y-auto overflow-x-hidden scrollbar-hide relative border flex flex-col
            ${canvasBackground} 
            ${dragDropTargetId === "root" ? "border-purple-500 ring-2 ring-purple-500/50" : "border-stone-200/50"}`}
        >
          {/* Dynamic Island and Status Bar Overlay placed INSIDE the canvas but sticky/absolute */}
          <div className="sticky top-0 w-full h-[54px] z-50 flex justify-between items-center px-8 text-[11px] font-sans font-semibold tracking-wide"
               style={{ color: statusColor }}>
            <span className="mt-1">9:41</span>
            
            {/* Dynamic Island */}
            {canvasOrientation === "portrait" ? (
              <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-full flex items-center shadow-sm">
                <div className="ml-3 w-2.5 h-2.5 rounded-full bg-blue-900/60" />
                <div className="ml-auto mr-3 w-2.5 h-2.5 rounded-full bg-blue-900/40" />
              </div>
            ) : (
                <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-full shadow-sm" />
            )}

            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px]">5G</span>
              <div className="w-[18px] h-[10px] border rounded-[3px] p-[1px] flex items-center" style={{ borderColor: statusColor }}>
                <div className="w-full h-full rounded-[1px]" style={{ backgroundColor: statusColor }} />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col relative min-h-max pb-8 px-4 w-full">
            {isEmpty && (
              <div id="empty_view" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-[85%] p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200 shadow-sm z-10">
                <Layout className="mx-auto text-stone-400 mb-2" size={24} />
                <h3 className="text-xs font-semibold text-stone-800">Mobile Canvas</h3>
                <p className="text-[10px] text-stone-500 mt-1 leading-relaxed font-light">
                  Add elements to build your layout.
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
        className="bg-neutral-900 p-[16px] shadow-[0_24px_55px_-12px_rgba(0,0,0,0.6),0_0_0_8px_#262626] border border-neutral-800 flex-shrink-0 relative transition-all duration-500 ease-out flex flex-col justify-between"
        style={{
          width,
          height,
          borderRadius: "44px"
        }}
      >
        {/* Front camera bezel element */}
        <div className={`absolute bg-stone-950 shadow-inner z-50 flex items-center justify-center rounded-full
          ${canvasOrientation === "portrait" ? "top-[8px] left-1/2 -translate-x-1/2 w-3 h-3" : "left-[8px] top-1/2 -translate-y-1/2 w-3 h-3"}`}>
          <div className="w-1 h-1 rounded-full bg-blue-950/75" />
        </div>

        {/* Screen/Canvas Wrapping */}
        <div 
          id="workspace_canvas"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full h-full rounded-[28px] overflow-y-auto overflow-x-hidden scrollbar-hide relative border flex flex-col
            ${canvasBackground} 
            ${dragDropTargetId === "root" ? "border-purple-500 ring-2 ring-purple-500/50" : "border-stone-200/50"}`}
        >
          <div className="sticky top-0 w-full h-8 flex justify-between items-center px-6 text-[11px] font-sans font-semibold tracking-wide z-50 pointer-events-none"
               style={{ color: statusColor }}>
            <span>9:41 AM</span>
            <div className="flex gap-2">
               <span>100%</span>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col relative w-full px-6 pb-12 pt-2 min-h-max">
            {isEmpty && (
              <div id="empty_view" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-sm p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200 shadow-sm z-10">
                <Layout className="mx-auto text-stone-400 mb-3" size={28} />
                <h3 className="text-xs font-semibold text-stone-800">Tablet Canvas Empty</h3>
                <p className="text-[11px] text-stone-500 mt-1 leading-relaxed font-light">
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
    <div className="w-full max-w-[1280px] flex flex-col transition-all duration-500 items-center">
      <div className="w-full rounded-xl bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-stone-900/5 overflow-hidden transition-all duration-500 flex flex-col relative h-[85vh]">
        {/* Browser Header / Native Window chrome */}
        <div className="w-full h-12 bg-[#f6f6f6] border-b border-stone-200/80 flex items-center px-4 justify-between select-none z-40 shrink-0">
          {/* Traffic circles (macOS style) */}
          <div className="flex items-center gap-2 w-24">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer" />
          </div>

          {/* Browser Address Box */}
          <div className="flex-1 max-w-xl mx-auto bg-white border border-stone-200/80 shadow-sm rounded-md h-7 flex items-center justify-center gap-2 text-[11px] text-stone-500 font-medium font-sans">
            <CheckCircle2 size={12} className="text-stone-400" />
            <span className="tracking-wide">localhost:3000</span>
          </div>

          {/* Right side window control indicators */}
          <div className="flex items-center gap-3 justify-end w-24 text-stone-400">
            <Layers size={14} className="hover:text-stone-700 transition cursor-pointer" />
          </div>
        </div>

        {/* Screen/Canvas Wrapping */}
        <div 
          id="workspace_canvas"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex-1 w-full overflow-y-auto overflow-x-hidden scrollbar-default relative border-0 flex flex-col
            ${canvasBackground} 
            ${dragDropTargetId === "root" ? "ring-2 ring-inset ring-purple-500/50" : ""}`}
        >
          <div className="flex-1 flex flex-col w-full relative min-h-max">
            {isEmpty && (
              <div id="empty_view" className="m-auto mt-[20vh] text-center max-w-lg p-10 bg-white/80 backdrop-blur-md rounded-3xl border border-stone-200 shadow-sm z-10">
                <Layout className="mx-auto text-stone-300 mb-4" size={32} />
                <h3 className="text-sm font-semibold text-stone-800 tracking-tight">Desktop Canvas Outline</h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
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
