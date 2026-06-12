import React from "react";
import { 
  Copy, 
  Trash2, 
  Layout, 
  Square, 
  Type, 
  Play, 
  CheckCircle2, 
  Image as ImageIcon,
  Layers,
  Heading,
  MousePointer,
  Link,
  List,
  FormInput,
  Menu,
  Sparkles
} from "lucide-react";
import { VisualElement } from "../types";
import { useDesigner } from "../contexts/DesignerContext";

interface StructureNodeProps {
  node: VisualElement;
  depth?: number;
}

export function StructureNode({ node, depth = 0 }: StructureNodeProps) {
  const designer = useDesigner();
  const {
    selectedId,
    setSelectedId,
    draggedId,
    setDraggedId,
    dragDropTargetId,
    setDragDropTargetId,
    dragDropPosition,
    setDragDropPosition,
    duplicateElement,
    deleteElement,
    moveElement
  } = designer;

  const isSelected = selectedId === node.id;
  const isCurrentlyDragged = draggedId === node.id;
  
  const getTreeNodeIcon = (type: string, tag: string) => {
    const t = tag.toLowerCase().trim();
    if (t === "div") {
      return <Layers size={11} className={isSelected ? "text-amber-200 shrink-0" : "text-amber-500/80 shrink-0"} />;
    }
    if (t === "section" || t === "main" || t === "header" || t === "footer" || t === "aside" || t === "article" || t.includes("grid")) {
      return <Layout size={11} className={isSelected ? "text-violet-200 shrink-0" : "text-violet-500 shrink-0"} />;
    }
    if (/^h[1-6]$/.test(t) || t === "heading") {
      return <Heading size={11} className={isSelected ? "text-amber-200 shrink-0" : "text-amber-500 shrink-0"} />;
    }
    if (t === "button") {
      return <MousePointer size={11} className={isSelected ? "text-rose-200 shrink-0" : "text-rose-500 shrink-0"} />;
    }
    if (t === "img" || t === "image" || t === "figure") {
      return <ImageIcon size={11} className={isSelected ? "text-emerald-200 shrink-0" : "text-emerald-500 shrink-0"} />;
    }
    if (t === "a" || t === "link") {
      return <Link size={11} className={isSelected ? "text-emerald-200 shrink-0" : "text-emerald-500 shrink-0"} />;
    }
    if (t === "ul" || t === "ol" || t === "li" || t === "list") {
      return <List size={11} className={isSelected ? "text-emerald-200 shrink-0" : "text-emerald-500 shrink-0"} />;
    }
    if (t === "input" || t === "textarea" || t === "select" || t === "form" || t === "label") {
      return <FormInput size={11} className={isSelected ? "text-orange-200 shrink-0" : "text-orange-500 shrink-0"} />;
    }
    if (t === "p" || t === "span" || t === "strong" || t === "em" || t === "b" || t === "i") {
      return <Type size={11} className={isSelected ? "text-stone-300 shrink-0" : "text-stone-400 shrink-0"} />;
    }
    if (t === "nav" || t === "menu") {
      return <Menu size={11} className={isSelected ? "text-amber-200 shrink-0" : "text-amber-600 shrink-0"} />;
    }
    if (t === "svg" || t === "icon" || t === "path") {
      return <Sparkles size={11} className={isSelected ? "text-yellow-200 shrink-0" : "text-yellow-500 shrink-0"} />;
    }

    // Default fallback based on type
    switch (type) {
      case "container":
        return <Square size={11} className={isSelected ? "text-amber-100 fill-white/10 shrink-0" : "text-amber-500 fill-amber-50/20 shrink-0"} />;
      case "text":
        return <Type size={11} className={isSelected ? "text-amber-200 shrink-0" : "text-amber-500 shrink-0"} />;
      case "image":
        return <ImageIcon size={11} className={isSelected ? "text-emerald-200 shrink-0" : "text-emerald-500 shrink-0"} />;
      case "button":
        return <Play size={11} className={isSelected ? "text-pink-200 shrink-0" : "text-pink-500 shrink-0"} />;
      case "badge":
        return <CheckCircle2 size={11} className={isSelected ? "text-emerald-200 shrink-0" : "text-emerald-500 shrink-0"} />;
      default:
        return <Square size={11} className="text-stone-400 shrink-0" />;
    }
  };

  return (
    <div key={node.id} className="space-y-0.5">
      <div 
        id={`tree-node-${node.id}`}
        draggable
        onDragStart={(e) => {
          e.stopPropagation();
          e.dataTransfer.setData("text/plain", node.id);
          setDraggedId(node.id);
        }}
        onDragEnd={(e) => {
          e.stopPropagation();
          setDraggedId(null);
          setDragDropTargetId(null);
          setDragDropPosition(null);
        }}
        onDragOver={(e) => {
          if (!draggedId || draggedId === node.id) return;
          e.preventDefault();
          e.stopPropagation();
          
          if (dragDropTargetId !== node.id) {
            setDragDropTargetId(node.id);
          }
          
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const y = e.clientY - rect.top;
          
          let targetPos: "before" | "after" | "inside" = "after";
          if (node.type === "container") {
            if (y < rect.height * 0.25) targetPos = "before";
            else if (y > rect.height * 0.75) targetPos = "after";
            else targetPos = "inside";
          } else {
            if (y < rect.height / 2) targetPos = "before";
            else targetPos = "after";
          }
          
          if (dragDropPosition !== targetPos) {
            setDragDropPosition(targetPos);
          }
        }}
        onDragLeave={() => {
          if (dragDropTargetId === node.id) {
            setDragDropTargetId(null);
            setDragDropPosition(null);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (draggedId && dragDropTargetId === node.id && dragDropPosition) {
            moveElement(draggedId, node.id, dragDropPosition);
          }
          setDraggedId(null);
          setDragDropTargetId(null);
          setDragDropPosition(null);
        }}
        onClick={(e) => { e.stopPropagation(); setSelectedId(node.id); }}
        className={`w-full group cursor-pointer border rounded-[10px] text-[11px] font-medium transition-all duration-200 flex items-center justify-between ${
          isSelected 
            ? "bg-stone-900 border-stone-800 text-white shadow-md shadow-stone-900/10" 
            : "border-transparent text-stone-600 hover:bg-stone-100/80 hover:text-stone-900"
        } ${isCurrentlyDragged ? "opacity-30 border-dashed border-stone-300 grayscale select-none pointer-events-none scale-95" : ""} ${dragDropTargetId === node.id && dragDropPosition === "inside" ? "ring-2 ring-rose-500 ring-inset bg-rose-50" : ""} ${dragDropTargetId === node.id && dragDropPosition === "before" ? "border-t-[3px] border-t-rose-500" : ""} ${dragDropTargetId === node.id && dragDropPosition === "after" ? "border-b-[3px] border-b-rose-500" : ""}`}
        style={{ paddingLeft: `${depth * 10 + 6}px`, paddingRight: '6px', paddingTop: '6px', paddingBottom: '6px' }}
      >
        <div className="flex flex-row items-center gap-2 overflow-hidden pr-2">
          {getTreeNodeIcon(node.type, node.tag)}
          <span className="truncate">
            <span className={`${isSelected ? "text-stone-300" : "text-stone-400"} font-mono text-[9px] uppercase tracking-widest mr-1.5`}>{node.tag}</span>
            {node.content ? (
              <span className="opacity-80 truncate">{node.content}</span>
            ) : (
              <span className={`italic ${isSelected ? "text-stone-400" : "text-stone-400"} truncate`}>{node.classes || "Empty Node"}</span>
            )}
          </span>
        </div>
        
        {/* Inline structural controls */}
        {isSelected && (
          <div className="flex items-center gap-0.5 shrink-0 animate-in fade-in zoom-in duration-200">
            <button 
              onClick={(e) => { e.stopPropagation(); duplicateElement(node.id); }}
              className="p-1 hover:bg-stone-700 hover:text-white text-stone-400 rounded-md transition"
              title="Duplicate"
            >
              <Copy size={11} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); deleteElement(node.id); }}
              className="p-1 hover:bg-red-500 hover:text-white text-stone-400 rounded-md transition"
              title="Delete"
            >
              <Trash2 size={11} />
            </button>
          </div>
        )}
      </div>
      
      {node.children && node.children.length > 0 && (
        <div className="flex flex-col relative w-full space-y-0.5 mt-0.5" style={{ contentVisibility: "auto" }}>
          {/* Subtle connecting parent-child depth line */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-stone-200/60 z-0 pointer-events-none" style={{ left: `${depth * 10 + 11}px` }}></div>
          {node.children.map(child => {
            const isChildTarget = dragDropTargetId === child.id;
            const showBefore = isChildTarget && dragDropPosition === "before";
            const showAfter = isChildTarget && dragDropPosition === "after";

            return (
              <React.Fragment key={child.id}>
                {showBefore && (
                  <div 
                    style={{ marginLeft: `${(depth + 1) * 10 + 11}px` }}
                    className="h-1 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full my-1 relative flex items-center justify-start pointer-events-none animate-pulse"
                  >
                    <div className="absolute left-0 -translate-x-[4px] w-2 h-2 rounded-full bg-rose-600 border border-white shadow shadow-rose-500/50" />
                  </div>
                )}
                
                <div className="relative z-10 w-full animate-in fade-in slide-in-from-top-1 duration-150">
                  <StructureNode node={child} depth={depth + 1} />
                </div>
                
                {showAfter && (
                  <div 
                    style={{ marginLeft: `${(depth + 1) * 10 + 11}px` }}
                    className="h-1 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full my-1 relative flex items-center justify-start pointer-events-none animate-pulse"
                  >
                    <div className="absolute left-0 -translate-x-[4px] w-2 h-2 rounded-full bg-rose-600 border border-white shadow shadow-rose-500/50" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
