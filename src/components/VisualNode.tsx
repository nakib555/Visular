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
  const isDoubleClicked = doubleClickId === elem.id;
  const TagName = elem.tag || "div";

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
  } relative transition-all duration-200`;

  if (isDoubleClicked && elem.content !== undefined) {
    return (
      <textarea
        ref={inlineEditRef}
        value={inlineTextValue}
        onChange={(e) => setInlineTextValue(e.target.value)}
        onBlur={handleInlineBlur}
        onKeyDown={handleInlineKeyDown}
        className="w-full text-stone-900 bg-stone-100 p-2 border border-purple-500 rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        style={{ minHeight: "40px" }}
      />
    );
  }

  if (elem.type === "image") {
    const imgSrc = elem.content || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";
    return (
      <div
        id={elem.id}
        onClick={handleClick}
        className={`relative inline-block ${elem.classes || ""} ${
          isSelected ? "selected-element-outline !overflow-visible" : "hover-element-outline"
        } transition-all duration-200 cursor-pointer`}
      >
        <img
          src={imgSrc}
          alt="Visual asset"
          className="w-full h-full object-cover rounded-[inherit]"
          referrerPolicy="no-referrer"
        />
        {isSelected && (
          <motion.span
            layoutId="focusedNodeOutline"
            className="absolute -inset-[3px] pointer-events-none z-30 rounded-[inherit] border-2 border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.35)] block"
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            {/* Corner Anchors */}
            <span className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-purple-500 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-40" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-purple-500 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-40" />
            <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-purple-500 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-40" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-purple-500 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-40" />

            {/* Quick Actions Bar */}
            <span className="absolute -top-11 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-stone-950/95 text-stone-100 border border-stone-800 px-3 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(168,85,247,0.15)] text-[10px] uppercase font-mono tracking-widest z-50 pointer-events-auto backdrop-blur-md shrink-0">
              <span className="text-purple-400 font-bold px-1.5 bg-purple-500/10 rounded-md ring-1 ring-purple-500/20">{elem.tag}</span>
              <span className="h-3 w-px bg-stone-800"></span>
              
              <span
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
                title="Drag to reposition"
                className="p-1 hover:text-purple-400 hover:bg-stone-900 rounded-md transition cursor-grab active:cursor-grabbing flex items-center justify-center"
              >
                <Layout size={11.5} />
              </span>

              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); duplicateElement(elem.id); }}
                title="Duplicate node"
                className="p-1 hover:text-purple-400 hover:bg-stone-900 rounded-md transition cursor-pointer flex items-center justify-center animate-hover"
              >
                <Copy size={11.5} />
              </span>
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); deleteElement(elem.id); }}
                title="Delete node"
                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-md transition cursor-pointer flex items-center justify-center"
              >
                <Trash2 size={11.5} />
              </span>
            </span>
          </motion.span>
        )}
      </div>
    );
  }

  const hasChildren = elem.children && elem.children.length > 0;

  // Append !overflow-visible on select so corner anchors and toolbar never clip
  const updatedClassList = `max-w-full ${elem.classes || ""} ${
    isSelected ? "selected-element-outline !overflow-visible" : "hover-element-outline"
  } relative transition-all duration-200`;

  return (
    <TagName
      id={elem.id}
      key={elem.id}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onDragOver={(e: any) => {
        if (!draggedId || draggedId === elem.id) return;
        e.preventDefault();
        e.stopPropagation();
        setDragDropTargetId(elem.id);
        
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const y = e.clientY - rect.top;
        const x = e.clientX - rect.left;
        
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
      className={`${updatedClassList} transition-all ${dragDropTargetId === elem.id && dragDropPosition === "inside" ? "ring-2 ring-purple-500 ring-inset opacity-80" : ""} ${dragDropTargetId === elem.id && dragDropPosition === "before" ? "border-t-[3px] border-t-purple-500" : ""} ${dragDropTargetId === elem.id && dragDropPosition === "after" ? "border-b-[3px] border-b-purple-500" : ""}`}
    >
      {isSelected && (
        <motion.span
          layoutId="focusedNodeOutline"
          className="absolute -inset-[3px] pointer-events-none z-30 rounded-[inherit] border-2 border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.35)] block"
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        >
          {/* Corner Anchors */}
          <span className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-purple-500 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-40" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-purple-500 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-40" />
          <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-purple-500 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-40" />
          <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-purple-500 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-40" />

          {/* Quick Actions Bar */}
          <span className="absolute -top-11 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-stone-950/95 text-stone-100 border border-stone-800 px-3 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(168,85,247,0.15)] text-[10px] uppercase font-mono tracking-widest z-50 pointer-events-auto backdrop-blur-md shrink-0">
            <span className="text-purple-400 font-bold px-1.5 bg-purple-500/10 rounded-md ring-1 ring-purple-500/20">{elem.tag}</span>
            <span className="h-3 w-px bg-stone-800"></span>
            
            <span
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
              title="Drag to reposition"
              className="p-1 hover:text-purple-400 hover:bg-stone-900 rounded-md transition cursor-grab active:cursor-grabbing flex items-center justify-center"
            >
              <Layout size={11.5} />
            </span>

            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); duplicateElement(elem.id); }}
              title="Duplicate node"
              className="p-1 hover:text-purple-400 hover:bg-stone-900 rounded-md transition cursor-pointer flex items-center justify-center animate-hover"
            >
              <Copy size={11.5} />
            </span>
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); deleteElement(elem.id); }}
              title="Delete node"
              className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-md transition cursor-pointer flex items-center justify-center"
            >
              <Trash2 size={11.5} />
            </span>
          </span>
        </motion.span>
      )}

      {elem.content}
      {hasChildren && elem.children?.map((child) => <VisualNode key={child.id} elem={child} />)}
    </TagName>
  );
}
