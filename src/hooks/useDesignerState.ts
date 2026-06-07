import React, { useState, useRef, useEffect } from "react";
import { VisualElement, ElementType } from "../types";
import { COMPONENT_PRESETS, cloneTreeWithNewIds, generateId } from "../presets";
import { compileTreeToHtml } from "../styleUtils";

const API_BASE = ((import.meta as any).env?.VITE_API_URL || "").replace(/\/$/, "");

export function useDesignerState() {
  const [componentTree, setComponentTree] = useState<VisualElement>(() => cloneTreeWithNewIds(COMPONENT_PRESETS[0].root));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [past, setPast] = useState<VisualElement[]>([]);
  const [future, setFuture] = useState<VisualElement[]>([]);
  
  const [backdropTheme, setBackdropTheme] = useState<"stone" | "zinc" | "grid">("grid");
  const [viewMode, setViewMode] = useState<"editor" | "preview" | "code">("editor");
  const [canvasViewport, setCanvasViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [canvasOrientation, setCanvasOrientation] = useState<"portrait" | "landscape">("portrait");
  const [zoomScale, setZoomScale] = useState<number | "auto">("auto");
  const [parentWidth, setParentWidth] = useState(1000);
  const parentContainerRef = useRef<HTMLDivElement>(null);
  
  const [doubleClickId, setDoubleClickId] = useState<string | null>(null);
  const [inlineTextValue, setInlineTextValue] = useState("");
  const inlineEditRef = useRef<HTMLTextAreaElement>(null);
  
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isAIWorking, setIsAIWorking] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiAccent, setAiAccent] = useState("stone-900");
  const [aiGoal, setAiGoal] = useState("Make it sound incredibly premium and engaging");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileActiveView, setMobileActiveView] = useState<"library" | "canvas" | "inspector">("canvas");
  const [inspectorSection, setInspectorSection] = useState<"layout" | "spacing" | "sizing" | "position" | "typography" | "visuals" | "motion" | "animation" | "interactivity" | "media" | "core" | "help">("layout");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragDropTargetId, setDragDropTargetId] = useState<string | null>(null);
  const [dragDropPosition, setDragDropPosition] = useState<"before" | "after" | "inside" | null>(null);
  
  const [activeTab, setActiveTab] = useState<"library" | "structure" | "styles" | "ai">("library");
  
  const [activeSearch, setActiveSearch] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!parentContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect && entry.contentRect.width) {
          setParentWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(parentContainerRef.current);
    return () => observer.disconnect();
  }, [parentContainerRef]);
  
  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then((res) => res.json())
      .then((data) => setHasApiKey(data.hasApiKey))
      .catch((err) => console.log("Failed to load health status", err));
  }, []);

  useEffect(() => {
    if (doubleClickId && inlineEditRef.current) {
      inlineEditRef.current.focus();
      inlineEditRef.current.select();
    }
  }, [doubleClickId]);

  useEffect(() => {
    if (activeTab === "structure" && selectedId) {
      setTimeout(() => {
        const el = document.getElementById(`tree-node-${selectedId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
  }, [selectedId, activeTab]);

  const changeComponentTree = (newTree: VisualElement) => {
    setPast((p) => [...p, componentTree]);
    setFuture([]);
    setComponentTree(newTree);
  };

  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast(past.slice(0, past.length - 1));
    setFuture((f) => [componentTree, ...f]);
    setComponentTree(previous);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture(future.slice(1));
    setPast((p) => [...p, componentTree]);
    setComponentTree(next);
  };

  const findElementById = (tree: VisualElement, id: string): VisualElement | null => {
    if (tree.id === id) return tree;
    if (tree.children) {
      for (const child of tree.children) {
        const found = findElementById(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedElement = selectedId ? findElementById(componentTree, selectedId) : null;

  const updateTree = (updater: (item: VisualElement) => Partial<VisualElement>) => {
    if (!selectedId) return;
    const updateNode = (node: VisualElement): VisualElement => {
      if (node.id === selectedId) return { ...node, ...updater(node) };
      if (node.children) return { ...node, children: node.children.map(updateNode) };
      return node;
    };
    changeComponentTree(updateNode(componentTree));
  };

  const duplicateElement = (id: string) => {
    const duplicateNode = (node: VisualElement): VisualElement => {
      if (node.children) {
        const index = node.children.findIndex((c) => c.id === id);
        if (index !== -1) {
          const childToClone = node.children[index];
          const cloned = cloneTreeWithNewIds(childToClone);
          const nextChildren = [...node.children];
          nextChildren.splice(index + 1, 0, cloned);
          return { ...node, children: nextChildren };
        }
        return { ...node, children: node.children.map(duplicateNode) };
      }
      return node;
    };
    changeComponentTree(duplicateNode(componentTree));
  };

  const deleteElement = (id: string) => {
    if (id === componentTree.id) {
      changeComponentTree({
        id: "canvas_root",
        type: "container",
        tag: "div",
        classes: "p-12 bg-white rounded-3xl min-h-[300px] flex flex-col justify-center items-center text-center",
        content: undefined,
        children: []
      });
      setSelectedId(null);
      return;
    }
    const deleteNode = (node: VisualElement): VisualElement | null => {
      if (node.id === id) return null;
      if (node.children) {
        const nextChildren = node.children.map(deleteNode).filter((c): c is VisualElement => c !== null);
        return { ...node, children: nextChildren };
      }
      return node;
    };
    const nextTree = deleteNode(componentTree);
    if (nextTree) changeComponentTree(nextTree);
    setSelectedId(null);
  };

  const moveElement = (dragged: string, target: string, position: "before" | "after" | "inside") => {
    if (dragged === target || dragged === "root") return;
    let draggedObject: VisualElement | null = null;
    
    const extractAndRemoveNode = (node: VisualElement): VisualElement | null => {
      if (node.id === dragged) {
        draggedObject = node;
        return null;
      }
      if (node.children) {
        const nextChildren = node.children.map(extractAndRemoveNode).filter((c): c is VisualElement => c !== null);
        return { ...node, children: nextChildren };
      }
      return node;
    };

    const treeWithoutDragged = extractAndRemoveNode(componentTree);
    if (!treeWithoutDragged || !draggedObject) return;

    const isInside = (node: VisualElement, id: string): boolean => {
      if (node.id === id) return true;
      if (node.children) return node.children.some(c => isInside(c, id));
      return false;
    };
    if (isInside(draggedObject, target)) return;

    const insertNode = (node: VisualElement): VisualElement => {
      if (node.id === target && position === "inside") {
        return { ...node, children: [...(node.children || []), draggedObject!] };
      }
      if (node.children) {
        const index = node.children.findIndex(c => c.id === target);
        if (index !== -1 && position !== "inside") {
           const nextChildren = [...node.children];
           nextChildren.splice(position === "after" ? index + 1 : index, 0, draggedObject!);
           return { ...node, children: nextChildren };
        }
        return { ...node, children: node.children.map(insertNode) };
      }
      return node;
    };

    let finalTree = insertNode(treeWithoutDragged);
    if (target === "root" && position !== "inside") {
       const alreadyIncluded = finalTree.children?.some(c => c.id === dragged) || finalTree.id === dragged;
       if (!alreadyIncluded) finalTree.children = [...(finalTree.children || []), draggedObject];
    }
    changeComponentTree(finalTree);
  };

  const addNewElement = (type: ElementType, tag: string, baseClasses: string, defaultContent?: string) => {
    const targetId = selectedId || componentTree.id;
    const newElement: VisualElement = { id: generateId(), type, tag, classes: baseClasses, content: defaultContent };

    const addNode = (node: VisualElement): VisualElement => {
      if (node.id === targetId) {
        if (node.type === "image") return node;
        const currentChildren = node.children || [];
        return { ...node, children: [...currentChildren, newElement] };
      }
      if (node.children) return { ...node, children: node.children.map(addNode) };
      return node;
    };

    changeComponentTree(addNode(componentTree));
    setSelectedId(newElement.id);
    if (window.innerWidth < 768) setMobileActiveView("canvas");
  };

  const parseHtmlToTree = (htmlStr: string): VisualElement | null => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlStr, "text/html");
      const firstElement = doc.body.firstElementChild;
      if (!firstElement) return null;
      return parseDomElement(firstElement);
    } catch (e) {
      console.error("DOM Parsing failed:", e);
      return null;
    }
  };

  const parseDomElement = (domNode: Element): VisualElement => {
    const tag = domNode.tagName.toLowerCase();
    const classes = domNode.className || "";
    const id = generateId();
    
    let type: ElementType = "container";
    if (tag === "img") type = "image";
    else if (tag === "button" || tag === "a") type = "button";
    else if (["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"].includes(tag)) type = "text";
    else if (classes.includes("badge") || classes.includes("tag")) type = "badge";

    const children: VisualElement[] = [];
    Array.from(domNode.childNodes).forEach((childNode) => {
      if (childNode.nodeType === Node.ELEMENT_NODE) {
        children.push(parseDomElement(childNode as Element));
      } else if (childNode.nodeType === Node.TEXT_NODE) {
        const text = childNode.textContent?.trim();
        if (text) {
          const hasSiblingElements = Array.from(domNode.children).length > 0;
          if (hasSiblingElements) {
            children.push({ id: generateId(), type: "text", tag: "span", classes: "inline-block", content: text });
          }
        }
      }
    });

    const hasElementChildren = children.length > 0;
    const content = tag === "img"
      ? (domNode.getAttribute("src") || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80")
      : (!hasElementChildren ? domNode.textContent?.trim() || "" : undefined);

    return { id, type, tag, classes, content: content || undefined, children: children.length > 0 ? children : undefined };
  };

  const autoOptimizeLayout = (node: VisualElement, modes: { typography?: boolean; padding?: boolean; columns?: boolean }): VisualElement => {
    let classes = node.classes || "";
    if (modes.columns) {
      if (classes.includes("grid-cols-2") && !classes.includes("sm:grid-cols-2") && !classes.includes("md:grid-cols-2")) classes = classes.replace(/\bgrid-cols-2\b/g, "grid-cols-1 md:grid-cols-2");
      if (classes.includes("grid-cols-3") && !classes.includes("sm:grid-cols-2") && !classes.includes("md:grid-cols-3")) classes = classes.replace(/\bgrid-cols-3\b/g, "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3");
      if (classes.includes("grid-cols-4") && !classes.includes("sm:grid-cols-2") && !classes.includes("lg:grid-cols-4")) classes = classes.replace(/\bgrid-cols-4\b/g, "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4");
      if (classes.includes("flex-row") && !classes.includes("flex-col") && !classes.includes("md:flex-row")) classes = classes.replace(/\bflex-row\b/g, "flex-col sm:flex-row");
      if ((classes.includes("grid-cols-") || classes.includes("flex-col")) && !classes.includes("gap-") && !classes.includes("space-")) classes += " gap-4 sm:gap-6";
    }
    if (modes.padding) {
      classes = classes.replace(/\bp-12\b/g, "p-4 sm:p-8 md:p-12").replace(/\bp-16\b/g, "p-5 sm:p-10 md:p-16").replace(/\bp-20\b/g, "p-6 sm:p-12 md:p-20");
      classes = classes.replace(/\bpx-12\b/g, "px-4 sm:px-8 md:px-12").replace(/\bpx-16\b/g, "px-5 sm:px-10 md:px-16");
      classes = classes.replace(/\bpy-12\b/g, "py-6 sm:py-12").replace(/\bpy-16\b/g, "py-6 sm:py-16");
      if (classes.includes("w-[") || classes.includes("w-96") || classes.includes("w-80")) {
        if (!classes.includes("max-w-")) classes += " max-w-full";
      }
    }
    if (modes.typography) {
      classes = classes.replace(/\btext-3xl\b/g, "text-xl sm:text-2xl md:text-3xl").replace(/\btext-4xl\b/g, "text-2xl sm:text-3xl md:text-4xl");
      classes = classes.replace(/\btext-5xl\b/g, "text-2xl sm:text-4xl md:text-5xl").replace(/\btext-6xl\b/g, "text-3xl sm:text-5xl md:text-6xl");
      classes = classes.replace(/\btext-7xl\b/g, "text-4xl sm:text-6xl md:text-7xl");
    }
    classes = classes.replace(/\s+/g, " ").trim();
    return { ...node, classes, children: node.children ? node.children.map(child => autoOptimizeLayout(child, modes)) : undefined };
  };

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    
    setIsAIWorking(true);
    try {
      const response = await fetch(`${API_BASE}/api/gemini/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          description: aiPrompt,
          accentColor: aiAccent
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed layout generation.");
      }

      const data = await response.json();
      const parsedTree = parseHtmlToTree(data.html);
      
      if (parsedTree) {
        changeComponentTree(parsedTree);
        setSelectedId(parsedTree.id);
        setAiPrompt("");
      } else {
        alert("We generated HTML but couldn't parse it into editable nodes. Please try slightly simpler phrasing.");
      }
    } catch (err: any) {
      console.error(err);
      alert(`AI layout generation issue: ${err.message || "Ensure key is connected in Secrets panel."}`);
    } finally {
      setIsAIWorking(false);
    }
  };

  const runAutoOptimize = (type: "all" | "typography" | "padding" | "columns") => {
    setIsAIWorking(true);
    setTimeout(() => {
      try {
        const modes = {
          typography: type === "all" || type === "typography",
          padding: type === "all" || type === "padding",
          columns: type === "all" || type === "columns",
        };
        const nextTree = autoOptimizeLayout(componentTree, modes);
        changeComponentTree(nextTree);
      } catch (err) {
        console.error("Auto layout adjustments error:", err);
      } finally {
        setIsAIWorking(false);
      }
    }, 450);
  };

  const runAIResponsiveAudit = async () => {
    setIsAIWorking(true);
    try {
      const htmlStr = compileTreeToHtml(componentTree);
      const response = await fetch(`${API_BASE}/api/gemini/responsive-audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: htmlStr }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed responsive layout audit.");
      }

      const data = await response.json();
      const parsedTree = parseHtmlToTree(data.html);
      
      if (parsedTree) {
        changeComponentTree(parsedTree);
        setSelectedId(parsedTree.id);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Could not complete layout audit. Ensure your Gemini API Key is active.");
    } finally {
      setIsAIWorking(false);
    }
  };

  const handleAIEnhanceCopy = async () => {
    if (!selectedElement || !selectedElement.content) return;

    setIsAIWorking(true);
    try {
      const response = await fetch(`${API_BASE}/api/gemini/enhance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectedElement.content,
          goal: aiGoal
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed text enhancement.");
      }

      const data = await response.json();
      updateTree(() => ({ content: data.result || data.text }));
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Could not enhance copy. Ensure your Gemini API Key is active.");
    } finally {
      setIsAIWorking(false);
    }
  };

  const handleCopyCode = () => {
    const compiledCode = compileTreeToHtml(componentTree);
    navigator.clipboard.writeText(compiledCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const rawHtml = compileTreeToHtml(componentTree);
    const fullDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Visual Component</title>
  <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen p-8">
${rawHtml}
</body>
</html>`;
    const blob = new Blob([fullDocument], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "exported-component.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  return {
    componentTree, setComponentTree,
    selectedId, setSelectedId,
    past, setPast,
    future, setFuture,
    backdropTheme, setBackdropTheme,
    viewMode, setViewMode,
    canvasViewport, setCanvasViewport,
    canvasOrientation, setCanvasOrientation,
    zoomScale, setZoomScale,
    parentWidth, setParentWidth,
    parentContainerRef,
    doubleClickId, setDoubleClickId,
    inlineTextValue, setInlineTextValue,
    inlineEditRef,
    hasApiKey, setHasApiKey,
    isAIWorking, setIsAIWorking,
    aiPrompt, setAiPrompt,
    aiAccent, setAiAccent,
    aiGoal, setAiGoal,
    isSidebarOpen, setIsSidebarOpen,
    mobileActiveView, setMobileActiveView,
    inspectorSection, setInspectorSection,
    isMobileDrawerOpen, setIsMobileDrawerOpen,
    draggedId, setDraggedId,
    dragDropTargetId, setDragDropTargetId,
    dragDropPosition, setDragDropPosition,
    activeTab, setActiveTab,
    activeSearch, setActiveSearch,
    showExportModal, setShowExportModal,
    copied, setCopied,
    
    changeComponentTree,
    undo, redo,
    selectedElement, findElementById,
    updateTree, duplicateElement, deleteElement, moveElement, addNewElement,
    parseHtmlToTree, autoOptimizeLayout,
    handleAIGenerate, runAutoOptimize, runAIResponsiveAudit, handleAIEnhanceCopy,
    handleCopyCode, handleDownloadFile,
  };
}
