import React from "react";
import { Copy, Trash2, Layout, Square, Type, Play, CheckCircle2, Image as ImageIcon } from "lucide-react";
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
  
  const getTreeNodeIcon = (type: string, tag: string) => {
    switch (type) {
      case "container":
        if (tag.includes("grid") || tag === "section") {
          return <Layout size={12} className={isSelected ? "text-purple-200 shrink-0" : "text-purple-600 shrink-0"} />;
        }
        return <Square size={12} className={isSelected ? "text-indigo-100 fill-white/10 shrink-0" : "text-indigo-500 fill-indigo-50/20 shrink-0"} />;
      case "text":
        return <Type size={12} className={isSelected ? "text-amber-200 shrink-0" : "text-amber-500 shrink-0"} />;
      case "image":
        return <ImageIcon size={12} className={isSelected ? "text-emerald-200 shrink-0" : "text-emerald-500 shrink-0"} />;
      case "button":
        return <Play size={12} className={isSelected ? "text-pink-200 shrink-0" : "text-pink-500 shrink-0"} />;
      case "badge":
        return <CheckCircle2 size={12} className={isSelected ? "text-sky-200 shrink-0" : "text-sky-500 shrink-0"} />;
      default:
        return <Square size={12} className="text-stone-400 shrink-0" />;
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
          setDragDropTargetId(node.id);
          
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const y = e.clientY - rect.top;
          
          if (node.type === "container") {
            if (y < rect.height * 0.25) setDragDropPosition("before");
            else if (y > rect.height * 0.75) setDragDropPosition("after");
            else setDragDropPosition("inside");
          } else {
            if (y < rect.height / 2) setDragDropPosition("before");
            else setDragDropPosition("after");
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
        } ${dragDropTargetId === node.id && dragDropPosition === "inside" ? "ring-2 ring-purple-500 ring-inset bg-purple-50" : ""} ${dragDropTargetId === node.id && dragDropPosition === "before" ? "border-t-[3px] border-t-purple-500" : ""} ${dragDropTargetId === node.id && dragDropPosition === "after" ? "border-b-[3px] border-b-purple-500" : ""}`}
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
        <div className="flex flex-col relative w-full space-y-0.5 mt-0.5">
          {/* Subtle connecting parent-child depth line */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-stone-200/60 z-0 pointer-events-none" style={{ left: `${depth * 10 + 11}px` }}></div>
          {node.children.map(child => (
            <div key={child.id} className="relative z-10 w-full">
              <StructureNode node={child} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
