import React from "react";
import { Copy, Trash2, Layout } from "lucide-react";
import { motion } from "motion/react";
import { VisualElement } from "../types";
import { useDesigner } from "../contexts/DesignerContext";

interface VisualNodeProps {
  elem: VisualElement;
  key?: React.Key;
}

export function VisualNode({ elem }: VisualNodeProps) {
  const designer = useDesigner();
  const {
    selectedId,
    doubleClickId,
    setDoubleClickId,
    inlineTextValue,
    setInlineTextValue,
    draggedId,
    dragDropTargetId,
    dragDropPosition,
    setDragDropTargetId,
    setDragDropPosition,
    moveElement,
    setDraggedId,
    duplicateElement,
    deleteElement,
    setSelectedId,
    inlineEditRef
  } = designer;

  const isSelected = selectedId === elem.id;
  const isCurrentlyDragged = draggedId === elem.id;
  const isDoubleClicked = doubleClickId === elem.id;
  const TagName = elem.tag || "div";

  const getInlineStylesFromClasses = (classesString: string): React.CSSProperties => {
    const styles: Record<string, string> = {};
    if (!classesString) return styles;
    
    // Extract any matching arbitrary properties of the form [prop-name:value_string]
    const matches = classesString.matchAll(/\[([a-zA-Z0-9-]+):([^\]]+)\]/g);
    for (const match of matches) {
      const propName = match[1];
      const propVal = match[2].replace(/_/g, " ");
      
      // Convert style keys to camelCase for standard React component compatibility, except custom CSS properties (--)
      const reactStyleKey = propName.startsWith("--")
        ? propName
        : propName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        
      styles[reactStyleKey] = propVal;
    }
    
    return styles as React.CSSProperties;
  };

  const inlineStyles = getInlineStylesFromClasses(elem.classes || "");

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(elem.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (elem.type === "text" || elem.type === "button" || elem.type === "badge") {
      setDoubleClickId(elem.id);
      setInlineTextValue(elem.content || "");
    }
  };

  const handleInlineBlur = () => {
    if (inlineTextValue !== elem.content) {
      designer.updateTree(() => ({ content: inlineTextValue }));
    }
    setDoubleClickId(null);
  };

  const handleInlineKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleInlineBlur();
    }
    if (e.key === "Escape") {
      setDoubleClickId(null);
    }
  };

  const customClassList = `max-w-full ${elem.classes || ""} ${
    isSelected ? "selected-element-outline" : "hover-element-outline"
  } ${isCurrentlyDragged ? "opacity-35 grayscale-[50%] scale-[0.98] border border-dashed border-rose-400 pointer-events-none" : ""} relative transition-all duration-200`;

  if (isDoubleClicked && elem.content !== undefined) {
    return (
      <TagName
        {...({} as any)}
        ref={inlineEditRef as any}
        style={inlineStyles}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e: React.FocusEvent<HTMLElement>) => {
          const newText = e.currentTarget.textContent || "";
          if (newText !== elem.content) {
            designer.updateTree(() => ({ content: newText }));
          }
          setDoubleClickId(null);
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.blur();
          }
          if (e.key === "Escape") {
            e.preventDefault();
            e.currentTarget.blur();
          }
          // prevent visual node wrapper commands from bleeding
          e.stopPropagation();
        }}
        className={`${elem.classes || ""} outline-none ring-2 ring-rose-500 rounded-sm relative z-50 caret-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)] shadow-rose-500`}
        dangerouslySetInnerHTML={{ __html: elem.content }}
      />
    );
  }

  const renderFloatingToolbar = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.95, x: "-50%" }}
        animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
        transition={{ type: "spring", stiffness: 450, damping: 26 }}
        className="absolute -top-12 left-1/2 flex items-center gap-1.5 bg-zinc-950 border border-zinc-850 px-3 py-1.5 rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.65),0_0_0_1px_rgba(244,63,94,0.15)] z-50 pointer-events-auto shrink-0 select-none backdrop-blur-md"
      >
        {/* Tag Name Badge */}
        <span className="text-[10px] uppercase font-mono font-bold text-rose-400 px-2 py-0.5 bg-rose-500/10 rounded-lg border border-rose-500/20 mr-1.5">
          {elem.tag}
        </span>
        
        <span className="h-4 w-px bg-zinc-805" />

        {/* Reposition/Drag Handle */}
        <div
          draggable
          onDragStart={(e) => {
            e.stopPropagation();
            e.dataTransfer.setData("text/plain", elem.id);
            setDraggedId(elem.id);
          }}
          onDragEnd={(e) => {
            e.stopPropagation();
            setDraggedId(null);
            setDragDropTargetId(null);
            setDragDropPosition(null);
          }}
          title="Drag to reposition element"
          className="p-1 px-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 active:bg-zinc-850 rounded-lg transition cursor-grab active:cursor-grabbing flex items-center justify-center gap-1 text-[10.5px] font-sans font-medium"
        >
          <Layout size={12} className="shrink-0" />
          <span>Move</span>
        </div>

        <span className="h-4 w-px bg-zinc-805" />

        {/* Duplicate Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            duplicateElement(elem.id);
          }}
          title="Duplicate Element"
          className="flex items-center gap-1.5 px-2 py-1 text-zinc-300 hover:text-rose-400 hover:bg-rose-500/10 active:scale-95 rounded-lg transition-all cursor-pointer font-sans font-medium text-[10.5px] border border-transparent hover:border-rose-500/20"
        >
          <Copy size={12} className="shrink-0" />
          <span>Duplicate</span>
        </button>

        <span className="h-4 w-px bg-zinc-805" />

        {/* Delete Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            deleteElement(elem.id);
          }}
          title="Delete Element"
          className="flex items-center gap-1.5 px-2 py-1 text-zinc-300 hover:text-red-400 hover:bg-red-500/15 active:scale-95 rounded-lg transition-all cursor-pointer font-sans font-medium text-[10.5px] border border-transparent hover:border-red-500/20"
        >
          <Trash2 size={12} className="shrink-0" />
          <span>Delete</span>
        </button>
      </motion.div>
    );
  };

  if (elem.type === "image") {
    const imgSrc = elem.content || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";
    return (
      <motion.div
        id={elem.id}
        key={elem.id}
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={handleClick}
        style={inlineStyles}
        onDragOver={(e: any) => {
          if (!draggedId || draggedId === elem.id) return;
          e.preventDefault();
          e.stopPropagation();
          setDragDropTargetId(elem.id);
          
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const y = e.clientY - rect.top;
          
          if (y < rect.height / 2) setDragDropPosition("before");
          else setDragDropPosition("after");
        }}
        onDragLeave={(e: any) => {
          e.stopPropagation();
          if (dragDropTargetId === elem.id) {
            setDragDropTargetId(null);
            setDragDropPosition(null);
          }
        }}
        onDrop={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          if (draggedId && dragDropTargetId === elem.id && dragDropPosition) {
            moveElement(draggedId, elem.id, dragDropPosition);
          }
          setDraggedId(null);
          setDragDropTargetId(null);
          setDragDropPosition(null);
        }}
        className={`relative inline-block ${elem.classes || ""} ${
          isSelected ? "selected-element-outline !overflow-visible" : "hover-element-outline"
        } ${isCurrentlyDragged ? "opacity-35 grayscale-[50%] scale-[0.98] border border-dashed border-rose-400 pointer-events-none" : ""} ${dragDropTargetId === elem.id && dragDropPosition === "before" ? "border-t-[3px] border-t-rose-500" : ""} ${dragDropTargetId === elem.id && dragDropPosition === "after" ? "border-b-[3px] border-b-rose-500" : ""} transition-all duration-200 cursor-pointer`}
      >
        <img
          src={imgSrc}
          alt="Visual asset"
          className="w-full h-full object-cover rounded-[inherit]"
          referrerPolicy="no-referrer"
        />
        {isSelected && (
          <motion.span
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -inset-[3px] pointer-events-none z-30 rounded-[inherit] border-2 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.35)] block"
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            {/* Corner Anchors */}
            <span className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-rose-500 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-40" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-rose-500 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-40" />
            <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-rose-500 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-40" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-rose-500 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-40" />

            {/* Quick Actions Bar */}
            {renderFloatingToolbar()}
          </motion.span>
        )}
      </motion.div>
    );
  }

  const hasChildren = elem.children && elem.children.length > 0;

  const renderChildrenWithDropIndicators = () => {
    if (!elem.children) return null;
    
    return elem.children.map((child) => {
      const isChildTarget = dragDropTargetId === child.id;
      const showBefore = isChildTarget && dragDropPosition === "before";
      const showAfter = isChildTarget && dragDropPosition === "after";
      
      return (
        <React.Fragment key={child.id}>
          {showBefore && (
            <div 
              className="w-full h-1 my-2 flex items-center justify-start pointer-events-none relative transition-all duration-300 z-40"
              style={{ contentVisibility: "auto" }}
            >
              {/* Pulsing Horizontal Gradient Line */}
              <div className="absolute inset-x-0 h-1 rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.85)]" />
              {/* Point Indicator Dot */}
              <div className="absolute left-1.5 w-3.5 h-3.5 rounded-full bg-rose-600 border-2 border-white shadow-lg flex items-center justify-center -translate-y-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              {/* Ghost Indicator Label Badge */}
              <div className="absolute left-7 -translate-y-4 px-2 py-0.5 rounded bg-rose-600/95 backdrop-blur-sm text-[9px] text-white font-mono font-bold shadow-md shadow-rose-900/20 flex items-center gap-1">
                <span>Insert here</span>
              </div>
            </div>
          )}
          
          <VisualNode elem={child} />
          
          {showAfter && (
            <div 
              className="w-full h-1 my-2 flex items-center justify-start pointer-events-none relative transition-all duration-300 z-40"
              style={{ contentVisibility: "auto" }}
            >
              {/* Pulsing Horizontal Gradient Line */}
              <div className="absolute inset-x-0 h-1 rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.85)]" />
              {/* Point Indicator Dot */}
              <div className="absolute left-1.5 w-3.5 h-3.5 rounded-full bg-rose-600 border-2 border-white shadow-lg flex items-center justify-center -translate-y-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              {/* Ghost Indicator Label Badge */}
              <div className="absolute left-7 -translate-y-4 px-2 py-0.5 rounded bg-rose-600/95 backdrop-blur-sm text-[9px] text-white font-mono font-bold shadow-md shadow-rose-900/20 flex items-center gap-1">
                <span>Insert here</span>
              </div>
            </div>
          )}
        </React.Fragment>
      );
    });
  };

  // Append !overflow-visible on select so corner anchors and toolbar never clip
  const updatedClassList = `max-w-full ${elem.classes || ""} ${
    isSelected ? "selected-element-outline !overflow-visible" : "hover-element-outline"
  } ${isCurrentlyDragged ? "opacity-35 grayscale-[50%] scale-[0.98] border border-dashed border-rose-400 pointer-events-none" : ""} relative transition-all duration-200`;

  const MotionTag = motion(TagName as any);

  return (
    <MotionTag
      id={elem.id}
      key={elem.id}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={inlineStyles}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onDragOver={(e: any) => {
        if (!draggedId || draggedId === elem.id) return;
        e.preventDefault();
        e.stopPropagation();
        setDragDropTargetId(elem.id);
        
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const y = e.clientY - rect.top;
        
        if (elem.type === "container") {
          if (y < rect.height * 0.25) setDragDropPosition("before");
          else if (y > rect.height * 0.75) setDragDropPosition("after");
          else setDragDropPosition("inside");
        } else {
          if (y < rect.height / 2) setDragDropPosition("before");
          else setDragDropPosition("after");
        }
      }}
      onDragLeave={(e: any) => {
        e.stopPropagation();
        if (dragDropTargetId === elem.id) {
          setDragDropTargetId(null);
          setDragDropPosition(null);
        }
      }}
      onDrop={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (draggedId && dragDropTargetId === elem.id && dragDropPosition) {
          moveElement(draggedId, elem.id, dragDropPosition);
        }
        setDraggedId(null);
        setDragDropTargetId(null);
        setDragDropPosition(null);
      }}
      className={`${updatedClassList} transition-all ${dragDropTargetId === elem.id && dragDropPosition === "inside" ? "ring-2 ring-rose-500 ring-inset opacity-80 bg-rose-500/5" : ""} ${dragDropTargetId === elem.id && dragDropPosition === "before" ? "border-t-[3px] border-t-rose-500" : ""} ${dragDropTargetId === elem.id && dragDropPosition === "after" ? "border-b-[3px] border-b-rose-500" : ""}`}
    >
      {isSelected && (
        <motion.span
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -inset-[3px] pointer-events-none z-30 rounded-[inherit] border-2 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.35)] block"
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        >
          {/* Corner Anchors */}
          <span className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-rose-500 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-40" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-rose-500 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-40" />
          <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-rose-500 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-40" />
          <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-rose-500 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-40" />

          {/* Quick Actions Bar */}
          {renderFloatingToolbar()}
        </motion.span>
      )}

      {elem.content}
      
      {/* Recursively mapping children with active line placeholders */}
      {hasChildren ? renderChildrenWithDropIndicators() : null}
      
      {/* Highlight inside container placeholder area */}
      {dragDropTargetId === elem.id && dragDropPosition === "inside" && (
        <div className="w-full min-h-[50px] border-2 border-dashed border-rose-500/70 bg-rose-500/5 hover:bg-rose-500/10 rounded-xl flex items-center justify-center p-4 my-2 pointer-events-none animate-pulse transition-all">
          <span className="text-[10px] sm:text-xs font-semibold text-rose-700 uppercase tracking-widest font-mono flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
            Nest inside {elem.tag}
          </span>
        </div>
      )}
    </MotionTag>
  );
}
