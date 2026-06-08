/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Paintbrush, 
  Layers, 
  Settings, 
  Code, 
  Sparkles, 
  Trash2, 
  Copy, 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  Download, 
  Maximize, 
  Eye, 
  RefreshCw, 
  Palette, 
  Check, 
  Type, 
  Image as ImageIcon, 
  Square, 
  Play, 
  MousePointer, 
  HelpCircle, 
  Lightbulb, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  FileCode,
  Layout,
  CheckCircle2,
  X,
  PlusCircle,
  TrendingDown,
  Undo,
  Redo,
  Monitor,
  Smartphone,
  Tablet,
  Zap,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Minus,
  Sliders,
  Bell,
  Grid,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ElementType, VisualElement, ComponentPreset } from "./types";
import { DeviceFrame } from "./components/DeviceFrame";
import { VisualNode } from "./components/VisualNode";
import { StructureNode } from "./components/StructureNode";
import { DesignerProvider, useDesigner } from "./contexts/DesignerContext";
import { InspectorPanel } from "./components/InspectorPanel";
import { MobileStylingTabs, MobileToolControls } from "./components/MobileStylingToolbar";
import { COMPONENT_PRESETS, cloneTreeWithNewIds, generateId } from "./presets";
import { 
  STYLE_GROUPS, 
  setGroupClass, 
  getActiveGroupClass, 
  setPrefixedClass, 
  getPrefixedClass, 
  setColorClass, 
  compileTreeToHtml 
} from "./styleUtils";

function DesignerApp() {
  // Read all designer state and operations directly from context
  const designer = useDesigner();
  const {
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
    activeSearch, setActiveSearch,
    showExportModal, setShowExportModal,
    copied, setCopied,
    
    changeComponentTree,
    undo, redo,
    selectedElement,
    updateTree, duplicateElement, deleteElement, moveElement, addNewElement,
    handleAIGenerate, runAutoOptimize, runAIResponsiveAudit, handleAIEnhanceCopy,
    handleCopyCode, handleDownloadFile,
  } = designer;

  // PREMIUM INTERACTIVE SIMULATION PRESETS
  const REAL_DEVICES = [
    { id: "iphone-15", name: "iPhone 15 Pro", viewport: "mobile" as const, width: 393, height: 852, badge: "iOS" },
    { id: "iphone-se", name: "iPhone SE", viewport: "mobile" as const, width: 375, height: 667, badge: "iOS" },
    { id: "pixel-8", name: "Google Pixel 8", viewport: "mobile" as const, width: 412, height: 915, badge: "Android" },
    { id: "galaxy-s23", name: "Galaxy S23", viewport: "mobile" as const, width: 360, height: 800, badge: "Android" },
    { id: "ipad-pro", name: "iPad Pro 11\"", viewport: "tablet" as const, width: 834, height: 1194, badge: "iPadOS" },
    { id: "ipad-mini", name: "iPad Mini 8.3\"", viewport: "tablet" as const, width: 744, height: 1133, badge: "iPadOS" },
    { id: "galaxy-tab", name: "Galaxy Tab S9", viewport: "tablet" as const, width: 800, height: 1280, badge: "Android" },
    { id: "macbook-14", name: "MacBook Pro 14\"", viewport: "desktop" as const, width: 1440, height: 900, badge: "macOS" },
    { id: "full-hd", name: "Full HD Monitor", viewport: "desktop" as const, width: 1920, height: 1080, badge: "16:9" }
  ];

  const [selectedDevicePreset, setSelectedDevicePreset] = useState<string>("macbook-14");
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [networkStatus, setNetworkStatus] = useState<"5G" | "4G" | "Wi-Fi" | "Offline">("Wi-Fi");
  const [simulatedTime, setSimulatedTime] = useState<string>("09:41");
  const [showGridGuides, setShowGridGuides] = useState<boolean>(false);
  const [glossyOverlay, setGlossyOverlay] = useState<boolean>(true);
  const [notificationText, setNotificationText] = useState<string | null>(null);
  const [showSimulatorSettings, setShowSimulatorSettings] = useState<boolean>(false);

  // Sync preset if viewport changes
  const selectViewportAndResetPreset = (vp: "desktop" | "tablet" | "mobile") => {
    setCanvasViewport(vp);
    if (vp === "mobile") {
      setSelectedDevicePreset("iphone-15");
    } else if (vp === "tablet") {
      setSelectedDevicePreset("ipad-pro");
    } else {
      setSelectedDevicePreset("macbook-14");
    }
  };

  // Workstation preferences (kept as local state to maintain correct tabs compatibility)
  const [activeTab, setActiveTab] = useState<"presets" | "structure" | "elements" | "styles" | "ai_assist">("presets");
  const [activePresetCategory, setActivePresetCategory] = useState<"all" | "heroes" | "cards" | "lists" | "calls-to-action">("all");

  // Synchronize desktop activeTab with mobileActiveView to ensure states carry over
  useEffect(() => {
    if (activeTab === "styles") setMobileActiveView("inspector");
    else if (activeTab === "presets" || activeTab === "elements" || activeTab === "structure") setMobileActiveView("library");
  }, [activeTab, setMobileActiveView]);

  useEffect(() => {
    if (mobileActiveView === "inspector") {
      setActiveTab("styles");
    } else if (mobileActiveView === "library") {
      if (activeTab === "styles") setActiveTab("presets");
    }
  }, [mobileActiveView]);

  // Sync inline edit text field focus
  useEffect(() => {
    if (doubleClickId && inlineEditRef.current) {
      inlineEditRef.current.focus();
      inlineEditRef.current.select();
    }
  }, [doubleClickId, inlineEditRef]);

  // Auto-scroll the active structural tree node into view
  useEffect(() => {
    if (activeTab === "structure" && selectedId) {
      setTimeout(() => {
        const el = document.getElementById(`tree-node-${selectedId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 50);
    }
  }, [selectedId, activeTab]);

  // Dynamic tree renderer for standard canvas workspace
  const filteredPresets = COMPONENT_PRESETS.filter((p) => {
    const matchesSearch = activeSearch === "" || p.name.toLowerCase().includes(activeSearch.toLowerCase());
    const matchesCategory = activePresetCategory === "all" || p.category === activePresetCategory;
    return matchesSearch && matchesCategory;
  });


  const activeDeviceConfig = REAL_DEVICES.find(d => d.id === selectedDevicePreset) || REAL_DEVICES[0];

  let targetDeviceWidth = activeDeviceConfig.viewport === "desktop"
    ? activeDeviceConfig.width
    : (canvasOrientation === "portrait" ? activeDeviceConfig.width : activeDeviceConfig.height);

  let targetDeviceHeight = activeDeviceConfig.viewport === "desktop"
    ? activeDeviceConfig.height
    : (canvasOrientation === "portrait" ? activeDeviceConfig.height : activeDeviceConfig.width);

  const framePadding = activeDeviceConfig.viewport === "mobile" ? 24 : activeDeviceConfig.viewport === "tablet" ? 32 : 0;
  const scaledWidthWithBezel = targetDeviceWidth + framePadding;
  const scaledHeightWithBezel = targetDeviceHeight + framePadding;

  const dynamicScale = zoomScale === "auto" 
    ? Math.min(1, (parentWidth - 48) / scaledWidthWithBezel)
    : zoomScale;

  return (
    <div id="builder_root" className="min-h-screen bg-stone-50 font-sans text-stone-800 flex flex-col antialiased">
      
      {/* UPPER HIGH-CONTRAST HEADER */}
      <header id="control_bar" className="h-[64px] border-b border-stone-100 bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none gap-4 overflow-x-auto scrollbar-hide">
        
        {/* Editorial Logo Frame */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-[38px] h-[38px] rounded-xl bg-[#1a1a1a] flex items-center justify-center text-white font-serif text-xl shadow-sm flex-shrink-0">
            <span className="italic leading-none">V</span>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-[17px] font-semibold text-stone-900 tracking-tight leading-tight">
              Visual Editor
            </h1>
            <p className="text-[10.5px] text-stone-500 font-mono tracking-[0.15em] font-medium mt-0.5 leading-none hidden sm:block">
              DESIGN • COMPILE • EXPORT
            </p>
          </div>
        </div>

        {/* Dynamic theme switcher & View port selectors */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Undo / Redo Actions */}
          <div className="flex items-center gap-0.5 bg-stone-50 p-1 rounded-xl border border-stone-200/50 select-none hidden sm:flex">
            <button
              type="button"
              onClick={undo}
              disabled={past.length === 0}
              title="Undo (Ctrl+Z)"
              className={`p-1.5 px-3 rounded-lg transition-all ${
                past.length > 0 
                  ? "text-stone-600 hover:text-stone-900 hover:bg-white shadow-sm cursor-pointer" 
                  : "text-stone-300 bg-transparent cursor-not-allowed"
              }`}
            >
              <Undo size={14} />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={future.length === 0}
              title="Redo (Ctrl+Y)"
              className={`p-1.5 px-3 rounded-lg transition-all ${
                future.length > 0 
                  ? "text-stone-600 hover:text-stone-900 hover:bg-white shadow-sm cursor-pointer" 
                  : "text-stone-300 bg-transparent cursor-not-allowed"
              }`}
            >
              <Redo size={14} />
            </button>
          </div>

          {/* Reset Preset button */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Are you sure you want to reset the canvas tree back to the default initial newsletter preset? This can be undone with Undo/Ctrl+Z.")) {
                changeComponentTree(cloneTreeWithNewIds(COMPONENT_PRESETS[0].root));
                setSelectedId(null);
              }
            }}
            title="Reset preset to weekly designs newsletter"
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-stone-200/80 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 shadow-sm hidden sm:flex flex-shrink-0"
          >
            <RefreshCw size={13} className="text-stone-500 flex-shrink-0" />
            <span className="hidden xl:inline">Reset</span>
          </button>

          <div className="h-5 w-[1px] bg-stone-200 mx-1 hidden md:block shrink-0"></div>

          {/* Theme Canvas selector */}
          <div className="hidden md:flex bg-stone-50 p-1 rounded-xl items-center gap-1 border border-stone-200/50 text-[11px] flex-shrink-0">
            <button
              onClick={() => setBackdropTheme("grid")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                backdropTheme === "grid" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Layout size={12} />
              <span className="hidden xl:inline">Grid</span>
            </button>
            <button
              onClick={() => setBackdropTheme("stone")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                backdropTheme === "stone" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Monitor size={12} />
              <span className="hidden xl:inline">Light</span>
            </button>
            <button
              onClick={() => setBackdropTheme("zinc")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                backdropTheme === "zinc" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Smartphone size={12} />
              <span className="hidden xl:inline">Dark</span>
            </button>
          </div>

          <div className="h-5 w-[1px] bg-stone-200 mx-1 hidden sm:block shrink-0"></div>

          {/* Device Viewport Selector */}
          <div className="flex bg-stone-50 p-1 rounded-xl items-center gap-1 border border-stone-200/50 flex-shrink-0" id="device_viewport_selector">
            <button
              type="button"
              onClick={() => selectViewportAndResetPreset("desktop")}
              title="Desktop canvas view"
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 text-[11px] ${
                canvasViewport === "desktop" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Monitor size={14} className={canvasViewport === "desktop" ? "text-stone-800" : "text-stone-400"} />
              <span className="hidden lg:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => selectViewportAndResetPreset("tablet")}
              title="Tablet viewport view"
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 text-[11px] ${
                canvasViewport === "tablet" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Tablet size={14} className={canvasViewport === "tablet" ? "text-stone-800" : "text-stone-400"} />
              <span className="hidden lg:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => selectViewportAndResetPreset("mobile")}
              title="Mobile viewport mockup"
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 text-[11px] ${
                canvasViewport === "mobile" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Smartphone size={14} className={canvasViewport === "mobile" ? "text-stone-800" : "text-stone-400"} />
              <span className="hidden lg:inline">Mobile</span>
            </button>
          </div>

          <div className="h-5 w-[1px] bg-stone-200 mx-1 hidden sm:block shrink-0"></div>

          {/* Export and Preview commands */}
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-[#1a1a1a] text-white text-[11px] font-bold rounded-xl hover:bg-black hover:shadow-lg active:scale-95 transition-all shadow-sm flex items-center gap-2 cursor-pointer border border-stone-800 flex-shrink-0"
          >
            <FileCode size={14} className="text-white/80 flex-shrink-0" />
            <span><span className="hidden xl:inline">Compile & </span>Export</span>
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE SPLIT (Left sidebar | Interactive Center Canvas | Style Inspector right sidebar) */}
      <div id="main_split_container" className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: Elements library, Presets, Layout outlines & AI assistant */}
        <div id="library_panel" className={`w-full md:w-[350px] border-r border-stone-200/60 bg-white shadow-[2px_0_24px_rgba(0,0,0,0.02)] h-[calc(100vh-64px)] overflow-hidden flex-shrink-0 flex-col z-10 ${mobileActiveView === "library" ? "flex" : "hidden md:flex"}`}>
          
          {/* Visual Header Branding for Left Dock */}
          <div className="p-4 flex items-center justify-between border-b border-stone-100">
            <span className="text-[10px] font-mono tracking-widest font-bold text-stone-800 uppercase flex items-center gap-2 bg-rose-50/50 text-rose-700 px-3.5 py-2 rounded-full select-none">
              <Sparkles size={12} className="text-rose-600" />
              Creator Panel
            </span>
            <span className="text-[10px] font-mono text-stone-400">v1.2 Active</span>
          </div>

          {/* Navigation tabs Segmented Control (Pills) */}
          <div className="p-4 border-b border-stone-100">
            <div className="bg-stone-50/50 p-1 rounded-[20px] flex gap-1 border border-stone-200/50">
              <button
                type="button"
                onClick={() => { setActiveTab("presets"); }}
                title="Aesthetic Presets"
                className={`flex-1 py-2.5 text-center text-[11px] font-bold rounded-[16px] transition-all duration-200 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "presets" 
                    ? "bg-white text-stone-900 shadow-sm border border-stone-200/50" 
                    : "text-stone-500 hover:text-stone-800 hover:bg-stone-100/50"
                }`}
              >
                <Layout size={14} className={activeTab === "presets" ? "text-stone-800" : "text-stone-400"} />
                <span>Presets</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("elements"); }}
                title="Add HTML elements"
                className={`flex-1 py-2.5 text-center text-[11px] font-bold rounded-[16px] transition-all duration-200 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "elements" 
                    ? "bg-white text-stone-900 shadow-sm border border-stone-200/50" 
                    : "text-stone-500 hover:text-stone-800 hover:bg-stone-100/50"
                }`}
              >
                <PlusCircle size={14} className={activeTab === "elements" ? "text-rose-600" : "text-stone-400"} />
                <span>Add</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("structure"); }}
                title="Hierarchical Outline"
                className={`flex-1 py-2.5 text-center text-[11px] font-bold rounded-[16px] transition-all duration-200 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "structure" 
                    ? "bg-white text-stone-900 shadow-sm border border-stone-200/50" 
                    : "text-stone-500 hover:text-stone-800 hover:bg-stone-100/50"
                }`}
              >
                <Layers size={14} className={activeTab === "structure" ? "text-amber-500" : "text-stone-400"} />
                <span>Tree</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("styles"); }}
                title="Style Inspector"
                className={`hidden md:flex flex-1 py-2.5 text-center text-[11px] font-bold rounded-[16px] transition-all duration-200 flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "styles" 
                    ? "bg-[#8000FF] text-white shadow-md" 
                    : "text-stone-500 hover:text-stone-800 hover:bg-stone-100/50"
                }`}
              >
                <Settings size={14} className={activeTab === "styles" ? "text-white" : "text-rose-500"} />
                <span>Styles</span>
              </button>
            </div>
          </div>

          <div className={`flex-1 overflow-y-auto ${activeTab === "styles" ? "p-0" : "p-4 space-y-4"}`}>
            
            {/* TAB CONTENT: PRESET BLOCKS */}
            {activeTab === "presets" && (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={activeSearch}
                    onChange={(e) => setActiveSearch(e.target.value)}
                    placeholder="Search templates..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-sans placeholder-stone-400 focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 transition duration-200 shadow-inner"
                  />
                </div>
                
                {/* Category Slider for Presets */}
                <div className="flex flex-row flex-nowrap items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1">
                  {(["all", "heroes", "cards", "lists", "calls-to-action"] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActivePresetCategory(cat)}
                      className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all duration-300 ${
                        activePresetCategory === cat 
                          ? "bg-stone-800 text-white shadow-md scale-105" 
                          : "bg-white text-stone-500 border border-stone-200 hover:bg-stone-100 hover:text-stone-800"
                      }`}
                    >
                      {cat.replace(/-/g, " ")}
                    </button>
                  ))}
                </div>

                <div className={
                  activePresetCategory === "cards" ? "grid grid-cols-2 gap-3" :
                  activePresetCategory === "heroes" ? "space-y-4" :
                  activePresetCategory === "lists" ? "space-y-1.5 bg-stone-50 rounded-xl p-2 border border-stone-100" :
                  activePresetCategory === "calls-to-action" ? "space-y-3" :
                  "space-y-4"
                }>
                  {filteredPresets.map((preset) => {
                    const handleSelect = () => {
                      changeComponentTree(cloneTreeWithNewIds(preset.root));
                      if (window.innerWidth < 768) setMobileActiveView("canvas");
                    };

                    // ---- ALL / DEFAULT LAYOUT (Aesthetic Stacked Details) ----
                    if (activePresetCategory === "all") {
                      return (
                        <div
                          key={preset.name}
                          onClick={handleSelect}
                          className="p-4 bg-white hover:bg-gradient-to-br hover:from-white hover:to-stone-50/80 border border-stone-200/80 hover:border-stone-300 rounded-[18px] cursor-pointer group transition-all duration-300 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <h4 className="text-xs font-bold text-stone-800 group-hover:text-stone-950 transition">
                              {preset.name}
                            </h4>
                            <span className="text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-stone-100 text-stone-600">
                              {preset.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-500 leading-relaxed font-light font-sans line-clamp-2">
                            {preset.description}
                          </p>
                        </div>
                      );
                    }

                    // ---- CARDS LAYOUT (Bento Grid Style) ----
                    if (activePresetCategory === "cards") {
                      return (
                        <div
                          key={preset.name}
                          onClick={handleSelect}
                          className="aspect-square bg-stone-50 hover:bg-white border border-stone-200/80 hover:border-emerald-300 rounded-[24px] cursor-pointer group transition-all duration-500 text-center flex flex-col items-center justify-center p-3 relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.95]"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <Layout size={24} strokeWidth={1.5} className="text-stone-300 group-hover:text-emerald-500 mb-3 transition-colors duration-300" />
                          <h4 className="text-[11px] font-bold text-stone-700 group-hover:text-emerald-900 leading-tight">
                            {preset.name}
                          </h4>
                        </div>
                      );
                    }

                    // ---- HEROES LAYOUT (Cinematic Headers Style) ----
                    if (activePresetCategory === "heroes") {
                      return (
                        <div
                          key={preset.name}
                          onClick={handleSelect}
                          className="h-28 bg-stone-950 hover:bg-black border border-stone-800 hover:border-amber-500/50 rounded-2xl cursor-pointer group transition-all duration-500 flex flex-col justify-end p-4 relative overflow-hidden shadow-md hover:shadow-2xl hover:shadow-amber-500/10 active:scale-[0.98]"
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0" />
                          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.15),transparent_60%)]" />
                          <div className="relative z-10">
                            <h4 className="text-xs font-serif font-medium text-stone-100 group-hover:text-amber-100 transition-colors">
                              {preset.name}
                            </h4>
                            <p className="text-[9px] text-stone-400 font-sans mt-0.5 line-clamp-1 opacity-70 group-hover:opacity-100 transition-opacity">
                              {preset.description}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    // ---- LISTS LAYOUT (Line-Item Index Style) ----
                    if (activePresetCategory === "lists") {
                      return (
                        <div
                          key={preset.name}
                          onClick={handleSelect}
                          className="px-3 py-2.5 bg-white hover:bg-stone-100 border border-stone-200/50 hover:border-stone-300 rounded-lg cursor-pointer group transition-all text-left flex items-center justify-between shadow-sm active:bg-stone-200"
                        >
                          <div className="flex items-center gap-2 overflow-hidden pr-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-stone-300 group-hover:bg-indigo-400 transition-colors shrink-0" />
                            <h4 className="text-[11px] font-medium text-stone-700 truncate group-hover:text-indigo-900">
                              {preset.name}
                            </h4>
                          </div>
                          <PlusCircle size={12} className="text-stone-300 group-hover:text-indigo-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      );
                    }

                    // ---- CALLS TO ACTION LAYOUT (Vibrant Pill Buttons) ----
                    if (activePresetCategory === "calls-to-action") {
                      return (
                        <div
                          key={preset.name}
                          onClick={handleSelect}
                          className="px-4 py-3.5 bg-rose-500 hover:bg-rose-600 rounded-full cursor-pointer group transition-all duration-300 flex items-center justify-center text-center shadow-md hover:shadow-lg hover:shadow-rose-500/20 active:scale-[0.97]"
                        >
                          <h4 className="text-xs font-bold font-sans text-white uppercase tracking-widest flex items-center gap-2">
                            {preset.name}
                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                          </h4>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
                
                {filteredPresets.length === 0 && (
                  <div className="py-10 text-center text-stone-400 text-xs font-medium">
                    No components match your search.
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: RAW LAYOUT BUILDING BASES */}
            {activeTab === "elements" && (
              <div className="space-y-4 text-left">
                <div className="p-3.5 bg-gradient-to-r from-stone-50 to-stone-100 border border-stone-200 rounded-2xl mb-4 shadow-sm">
                  <p className="text-[10.5px] text-stone-500 leading-relaxed font-light">
                    Select any container block, then click items below to append them inside. If no element is marked, builders append items at the root.
                  </p>
                </div>

                {/* STRUCTUAL elements */}
                <div className="space-y-2.5">
                  <h5 className="text-[9.5px] font-bold font-mono tracking-widest text-stone-400 uppercase">Containers & Blocks</h5>
                  
                  <button
                    type="button"
                    onClick={() => addNewElement("container", "div", "p-8 bg-white rounded-3xl border border-stone-200 flex flex-col gap-5 shadow-sm")}
                    className="w-full p-3 bg-white border border-stone-200 hover:border-orange-300 rounded-xl text-xs text-stone-700 font-semibold flex items-center justify-between hover:bg-orange-50/5 hover:shadow-sm transition-all duration-200 group relative cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 px-1.5 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-100 transition">
                        <Square size={13} className="fill-orange-100" />
                      </div>
                      <span className="group-hover:text-stone-900 transition font-sans">Aesthetic Light Card</span>
                    </div>
                    <Plus size={11} className="text-stone-400 group-hover:text-orange-500" />
                  </button>

                  <button
                    type="button"
                    onClick={() => addNewElement("container", "div", "grid grid-cols-1 md:grid-cols-2 gap-6 w-full py-4")}
                    className="w-full p-3 bg-white border border-stone-200 hover:border-orange-300 rounded-xl text-xs text-stone-700 font-semibold flex items-center justify-between hover:bg-orange-50/5 hover:shadow-sm transition-all duration-200 group relative cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 px-1.5 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-100 transition">
                        <Layout size={13} />
                      </div>
                      <span className="group-hover:text-stone-900 transition font-sans">Dual Column Grid (1/2)</span>
                    </div>
                    <Plus size={11} className="text-stone-400 group-hover:text-orange-500" />
                  </button>
                </div>

                {/* TYPOGRAPHY elements */}
                <div className="space-y-2.5 pt-2">
                  <h5 className="text-[9.5px] font-bold font-mono tracking-widest text-stone-400 uppercase">Text & Editorial</h5>
                  
                  <button
                    type="button"
                    onClick={() => addNewElement("text", "h2", "text-3xl font-serif text-stone-900 tracking-tight font-medium mb-3 leading-tight", "Aesthetic Editorial Title")}
                    className="w-full p-3 bg-white border border-stone-200 hover:border-amber-400 rounded-xl text-xs text-stone-700 font-semibold flex items-center justify-between hover:bg-amber-50/5 hover:shadow-sm transition-all duration-200 group relative cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 px-1.5 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition">
                        <Type size={13} className="font-serif" />
                      </div>
                      <span className="group-hover:text-stone-900 transition font-sans">Serif Luxe Title (H2)</span>
                    </div>
                    <Plus size={11} className="text-stone-400 group-hover:text-amber-500" />
                  </button>

                  <button
                    type="button"
                    onClick={() => addNewElement("text", "h3", "text-xl font-sans text-stone-900 tracking-tight font-semibold mb-2", "Modern Feature Header")}
                    className="w-full p-3 bg-white border border-stone-200 hover:border-amber-400 rounded-xl text-xs text-stone-700 font-semibold flex items-center justify-between hover:bg-amber-50/5 hover:shadow-sm transition-all duration-200 group relative cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 px-1.5 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition">
                        <Type size={13} />
                      </div>
                      <span className="group-hover:text-stone-900 transition font-sans">Sans Display Title (H3)</span>
                    </div>
                    <Plus size={11} className="text-stone-400 group-hover:text-amber-500" />
                  </button>

                  <button
                    type="button"
                    onClick={() => addNewElement("text", "p", "text-stone-500 text-sm leading-relaxed mb-6 font-light", "Write description text here. Choose custom styling & font size values later.")}
                    className="w-full p-3 bg-white border border-stone-200 hover:border-amber-400 rounded-xl text-xs text-stone-700 font-semibold flex items-center justify-between hover:bg-amber-50/5 hover:shadow-sm transition-all duration-200 group relative cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 px-1.5 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition">
                        <AlignLeft size={13} />
                      </div>
                      <span className="group-hover:text-stone-900 transition font-sans">Body Paragraph (P)</span>
                    </div>
                    <Plus size={11} className="text-stone-400 group-hover:text-amber-500" />
                  </button>
                </div>

                {/* DYNAMIC ACTIONS elements */}
                <div className="space-y-2.5 pt-2">
                  <h5 className="text-[9.5px] font-bold font-mono tracking-widest text-stone-400 uppercase">Interactive Elements</h5>
                  
                  <button
                    type="button"
                    onClick={() => addNewElement("button", "button", "px-6 py-3 bg-stone-900 text-white font-medium text-xs hover:bg-stone-800 rounded-xl shadow-md transition-all cursor-pointer font-sans active:scale-95", "Primary Action")}
                    className="w-full p-3 bg-white border border-stone-200 hover:border-rose-300 rounded-xl text-xs text-stone-700 font-semibold flex items-center justify-between hover:bg-rose-50/5 hover:shadow-sm transition-all duration-200 group relative cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 px-1.5 bg-rose-50 text-rose-600 rounded-lg group-hover:bg-rose-100 transition">
                        <Play size={11} className="fill-rose-200" />
                      </div>
                      <span className="group-hover:text-stone-900 transition font-sans">Micro Solid Button</span>
                    </div>
                    <Plus size={11} className="text-stone-400 group-hover:text-rose-500" />
                  </button>

                  <button
                    type="button"
                    onClick={() => addNewElement("badge", "span", "inline-block px-3 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-full text-[10px] font-mono tracking-wider uppercase font-semibold", "FEATURED TAG")}
                    className="w-full p-3 bg-white border border-stone-200 hover:border-rose-300 rounded-xl text-xs text-stone-700 font-semibold flex items-center justify-between hover:bg-rose-50/5 hover:shadow-sm transition-all duration-200 group relative cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 px-1.5 bg-rose-50 text-rose-600 rounded-lg group-hover:bg-rose-100 transition">
                        <CheckCircle2 size={13} />
                      </div>
                      <span className="group-hover:text-stone-900 transition font-sans">Aesthetic Tag Capsule</span>
                    </div>
                    <Plus size={11} className="text-stone-400 group-hover:text-rose-500" />
                  </button>

                  <button
                    type="button"
                    onClick={() => addNewElement("image", "img", "w-full h-48 rounded-2xl object-cover shadow-sm mb-4 bg-stone-100", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80")}
                    className="w-full p-3 bg-white border border-stone-200 hover:border-rose-300 rounded-xl text-xs text-stone-700 font-semibold flex items-center justify-between hover:bg-rose-50/5 hover:shadow-sm transition-all duration-200 group relative cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 px-1.5 bg-rose-50 text-rose-600 rounded-lg group-hover:bg-rose-100 transition">
                        <ImageIcon size={13} />
                      </div>
                      <span className="group-hover:text-stone-900 transition font-sans">Image Cover Box</span>
                    </div>
                    <Plus size={11} className="text-stone-400 group-hover:text-rose-500" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DEEP OUTLINE TREE */}
            {activeTab === "structure" && (
              <div className="space-y-2 text-left">
                <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl mb-4">
                  <p className="text-[11px] text-stone-500 leading-relaxed font-light">
                    Tree nesting representation of visual layers. Click nodes to focus on canvas, or drag elements inside.
                  </p>
                </div>
                <div className="border-l border-stone-200 pl-1.5 py-1 space-y-1">
                  <StructureNode node={componentTree} />
                </div>
              </div>
            )}

            {/* TAB CONTENT: STYLES PANEL */}
            {activeTab === "styles" && (
              <div className="text-left transition-all h-full shrink-0 flex flex-col">
                <InspectorPanel
                  selectedElement={selectedElement}
                  inspectorSection={inspectorSection}
                  setInspectorSection={setInspectorSection}
                  updateTree={updateTree}
                  deleteElement={deleteElement}
                  duplicateElement={duplicateElement}
                />
              </div>
            )}
          </div>


        </div>

        {/* INTERACTIVE CENTER VIEWPORT CANVAS */}
        <div ref={parentContainerRef} id="visual_canvas_backyard" className={`flex-1 bg-stone-100 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:24px_24px] flex flex-col items-stretch justify-start relative p-3 sm:p-5 md:p-6 pb-48 md:pb-6 h-[calc(100vh-64px)] overflow-auto ${mobileActiveView === "canvas" || mobileActiveView === "inspector" ? "flex" : "hidden md:flex"}`}>
          
          {/* Subtle loading indicator overlay */}
          <AnimatePresence>
            {isAIWorking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex flex-col justify-center items-center text-white text-center p-6"
              >
                <div id="rotating_spinner" className="flex flex-col items-center gap-4">
                  <RefreshCw className="animate-spin text-rose-400" size={32} />
                  <div className="text-center">
                    <p className="text-sm font-semibold tracking-wide font-mono">AUTOLAYOUT RECONSTRUCTING</p>
                    <p className="text-xs text-stone-300 mt-1 max-w-sm">Dressing visual nodes, calculating viewport layout, & balancing typography...</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CANVAS RESPONSIVENESS CONTROLS TOOLBAR */}
          <div id="canvas_responsiveness_bar" className="w-full max-w-[1024px] mx-auto bg-white border border-stone-200/50 rounded-[18px] py-0 px-2 md:py-0 md:px-3 mb-4 shadow-sm flex flex-row flex-nowrap items-center justify-between gap-2 md:gap-4 overflow-x-auto scrollbar-hide lg:overflow-x-visible text-xs select-none z-10 box-border whitespace-nowrap flex-shrink-0" style={{ height: "46px", borderRadius: "50px" }}>
            
            {/* Left Column: Landscape vs Portrait + Device Selector */}
            <div className="flex flex-row flex-nowrap items-center gap-1.5 md:gap-3 shrink-0 whitespace-nowrap">
              {canvasViewport !== "desktop" && (
                <div className="flex flex-row flex-nowrap items-center gap-1 bg-stone-50 p-0.5 md:p-1 rounded-[30px] border border-stone-100 shrink-0 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => setCanvasOrientation("portrait")}
                    title="Vertical Mode"
                    className={`px-2 md:px-2.5 py-1 md:py-1.5 rounded-[30px] transition-all flex flex-row flex-nowrap items-center gap-1 cursor-pointer text-[10px] md:text-[11px] font-semibold shrink-0 whitespace-nowrap ${
                      canvasOrientation === "portrait"
                        ? "bg-white text-stone-900 shadow-sm"
                        : "text-stone-500 hover:text-stone-800 hover:bg-stone-200/40"
                    }`}
                  >
                    <Smartphone size={11} className={`transition-transform duration-300 shrink-0 ${canvasOrientation === "portrait" ? "text-stone-800" : "text-stone-400"}`} />
                    <span className="hidden sm:inline">Portrait</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCanvasOrientation("landscape")}
                    title="Landscape Mode"
                    className={`px-2 md:px-2.5 py-1 md:py-1.5 rounded-[30px] transition-all flex flex-row flex-nowrap items-center gap-1 cursor-pointer text-[10px] md:text-[11px] font-semibold shrink-0 whitespace-nowrap ${
                      canvasOrientation === "landscape"
                        ? "bg-white text-stone-900 shadow-sm"
                        : "text-stone-500 hover:text-stone-800 hover:bg-stone-200/40"
                    }`}
                  >
                    <Smartphone size={11} className={`rotate-90 transition-transform duration-300 shrink-0 ${canvasOrientation === "landscape" ? "text-stone-800" : "text-stone-400"}`} />
                    <span className="hidden sm:inline">Landscape</span>
                  </button>
                </div>
              )}

              {/* Real Preset Selector Dropdown */}
              <div className="flex items-center gap-1 bg-stone-50 p-0.5 md:p-1 rounded-[30px] border border-stone-100 shrink-0">
                <select
                  value={selectedDevicePreset}
                  onChange={(e) => {
                    const targetId = e.target.value;
                    setSelectedDevicePreset(targetId);
                    const matched = REAL_DEVICES.find(d => d.id === targetId);
                    if (matched) {
                      setCanvasViewport(matched.viewport);
                    }
                  }}
                  className="bg-transparent border-0 text-stone-850 text-[10px] md:text-[11px] font-bold py-1 px-2.5 outline-none cursor-pointer focus:ring-0"
                >
                  <optgroup label="Mobile Devices">
                    {REAL_DEVICES.filter(d => d.viewport === "mobile").map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.width} x {d.height}px)</option>
                    ))}
                  </optgroup>
                  <optgroup label="Tablet Devices">
                    {REAL_DEVICES.filter(d => d.viewport === "tablet").map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.width} x {d.height}px)</option>
                    ))}
                  </optgroup>
                  <optgroup label="Desktop Screens">
                    {REAL_DEVICES.filter(d => d.viewport === "desktop").map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.width} x {d.height}px)</option>
                    ))}
                  </optgroup>
                </select>

                <button
                  type="button"
                  onClick={() => setShowSimulatorSettings(!showSimulatorSettings)}
                  title="Configure simulated device network, battery & grids"
                  className={`px-2 py-1 md:py-1.5 rounded-[30px] transition-all flex flex-row flex-nowrap items-center gap-1 cursor-pointer text-[10px] md:text-[11px] font-semibold shrink-0 whitespace-nowrap ${
                    showSimulatorSettings 
                      ? "bg-stone-900 text-white shadow-xs font-bold" 
                      : "text-stone-500 hover:text-stone-800 hover:bg-stone-200/20"
                  }`}
                >
                  <Sliders size={11} />
                  <span className="hidden sm:inline">Simulate</span>
                </button>
              </div>
            </div>

            {/* Middle Column: Auto Layout Adjustments Quick Actions */}
            <div className="flex flex-row flex-nowrap items-center gap-1.5 md:gap-3 shrink-0 whitespace-nowrap">
              <button
                type="button"
                onClick={runAIResponsiveAudit}
                disabled={!hasApiKey}
                title={hasApiKey ? "Rewrite styles for outstanding mobile/tablet layout presentation" : "Active Gemini API key is required"}
                className={`px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-[11px] font-bold rounded-[30px] shadow-sm flex flex-row flex-nowrap items-center gap-1 md:gap-1.5 transition cursor-pointer active:scale-95 border shrink-0 whitespace-nowrap ${
                  hasApiKey 
                    ? "bg-rose-600 hover:bg-rose-700 text-white border-rose-700" 
                    : "bg-stone-100 text-stone-400 cursor-not-allowed border-stone-200"
                }`}
                style={{ borderRadius: "50px" }}
              >
                <Sparkles size={11} className={hasApiKey ? "text-rose-200 shrink-0" : "text-stone-300 shrink-0"} />
                <span>AI Audit</span>
              </button>
            </div>

            {/* Right Column: Custom Scaling Slider with click Adjustments */}
            <div className="flex flex-row flex-nowrap items-center gap-1.5 md:gap-2 shrink-0 whitespace-nowrap">
              <div className="flex flex-row flex-nowrap bg-stone-50 p-0.5 md:p-1 rounded-[30px] border border-stone-100 items-center justify-center gap-1 md:gap-1.5 shrink-0 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => {
                    if (zoomScale === "auto") {
                      setZoomScale(0.9);
                    } else {
                      setZoomScale(Math.max(0.4, Number((zoomScale - 0.1).toFixed(1))));
                    }
                  }}
                  title="Zoom Out (-10%)"
                  className="p-1 px-1.5 md:p-1.5 md:px-2 hover:bg-white rounded-lg text-stone-400 hover:text-stone-800 transition-all cursor-pointer shadow-sm border border-transparent hover:border-stone-200 shrink-0 whitespace-nowrap"
                  style={{ borderRadius: "50px" }}
                >
                  <ZoomOut size={12} className="shrink-0" />
                </button>
                
                <input 
                  type="range"
                  min="0.4"
                  max="1.5"
                  step="0.05"
                  value={zoomScale === "auto" ? 1.0 : zoomScale}
                  onChange={(e) => setZoomScale(parseFloat(e.target.value))}
                  className="w-12 md:w-16 accent-stone-800 h-[3px] bg-stone-200 rounded-lg cursor-pointer mx-1 shrink-0"
                  title="Drag zoom level"
                  style={{ borderRadius: "50px" }}
                />

                <button
                  type="button"
                  onClick={() => {
                    if (zoomScale === "auto") {
                      setZoomScale(1.1);
                    } else {
                      setZoomScale(Math.min(1.5, Number((zoomScale + 0.1).toFixed(1))));
                    }
                  }}
                  title="Zoom In (+10%)"
                  className="p-1 px-1.5 md:p-1.5 md:px-2 hover:bg-white rounded-lg text-stone-400 hover:text-stone-800 transition-all cursor-pointer shadow-sm border border-transparent hover:border-stone-200 shrink-0 whitespace-nowrap"
                  style={{ borderRadius: "50px" }}
                >
                  <ZoomIn size={12} className="shrink-0" />
                </button>

                <div className="h-4 w-px bg-stone-200 mx-0.5 md:mx-1 shrink-0" />

                <button
                  type="button"
                  onClick={() => setZoomScale(zoomScale === "auto" ? 1.0 : "auto")}
                  title="Toggle container boundaries Auto Fit"
                  className={`px-2 md:px-3 py-1 md:py-1.5 rounded-[30px] text-[9px] md:text-[10px] uppercase transition cursor-pointer min-w-[40px] md:min-w-[50px] text-center shrink-0 whitespace-nowrap ${
                    zoomScale === "auto" 
                      ? "bg-stone-800 text-white font-bold shadow-sm" 
                      : "bg-white text-stone-600 hover:bg-stone-50 font-semibold shadow-sm border border-stone-200/60"
                  }`}
                  style={{ borderRadius: "50px" }}
                >
                  {zoomScale === "auto" ? "Fit" : `${Math.round((zoomScale as number) * 100)}%`}
                </button>
              </div>
            </div>
          </div>

          {/* EXPANDED SIMULATOR SETTINGS PANEL */}
          <AnimatePresence>
            {showSimulatorSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-[1024px] mx-auto bg-stone-900 text-stone-100 border border-stone-800 rounded-[22px] p-4 mb-4 shadow-md flex flex-wrap md:flex-row md:items-center justify-between gap-4 text-xs select-none z-10 box-border"
              >
                {/* Mock Time Field */}
                <div className="flex flex-col gap-1 min-w-[100px]">
                  <label className="text-[9px] uppercase tracking-wider text-stone-400 font-mono font-bold">Simulator Time</label>
                  <input
                    type="text"
                    value={simulatedTime}
                    onChange={(e) => setSimulatedTime(e.target.value)}
                    placeholder="09:41"
                    className="bg-stone-950 border border-stone-850 text-white rounded-lg text-xs font-mono font-bold p-1 px-2.5 w-24 outline-none focus:border-rose-500"
                  />
                </div>

                {/* Battery Slider */}
                <div className="flex flex-col gap-1 min-w-[130px]">
                  <div className="flex justify-between items-center pr-1">
                    <label className="text-[9px] uppercase tracking-wider text-stone-400 font-mono font-bold">Battery Charge</label>
                    <span className="text-[10px] font-mono text-stone-300 font-bold">{batteryLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={batteryLevel}
                    onChange={(e) => setBatteryLevel(parseInt(e.target.value))}
                    className="accent-rose-500 rounded-lg cursor-pointer h-1 bg-stone-800 w-32"
                  />
                </div>

                {/* Connection Select */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-wider text-stone-400 font-mono font-bold">Network State</label>
                  <select
                    value={networkStatus}
                    onChange={(e) => setNetworkStatus(e.target.value as any)}
                    className="bg-stone-950 border border-stone-850 text-white rounded-lg text-xs font-bold p-1 px-2 w-28 cursor-pointer outline-none focus:border-rose-500"
                  >
                    <option value="Wi-Fi">Wi-Fi Wireless</option>
                    <option value="5G">5G Speed</option>
                    <option value="4G">4G Speed</option>
                    <option value="Offline">Offline State</option>
                  </select>
                </div>

                {/* Grid guides trigger */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-wider text-stone-400 font-mono font-bold">Layout Grid Guides</label>
                  <button
                    onClick={() => setShowGridGuides(!showGridGuides)}
                    className={`flex items-center gap-1.5 p-1 px-3 rounded-lg border text-xs font-semibold cursor-pointer select-none transition-all ${
                      showGridGuides
                        ? "bg-rose-500/10 border-rose-500 text-rose-300"
                        : "bg-stone-950 border-stone-800 text-stone-400 hover:text-white"
                    }`}
                  >
                    <Grid size={11} />
                    <span>{showGridGuides ? "Guides: Visible" : "Guides: Hidden"}</span>
                  </button>
                </div>

                {/* Gloss toggle trigger */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-wider text-stone-400 font-mono font-bold">Reflection glare</label>
                  <button
                    onClick={() => setGlossyOverlay(!glossyOverlay)}
                    className={`flex items-center gap-1.5 p-1 px-3 rounded-lg border text-xs font-semibold cursor-pointer select-none transition-all ${
                      glossyOverlay
                        ? "bg-rose-500/10 border-rose-500 text-rose-300"
                        : "bg-stone-950 border-stone-800 text-stone-400 hover:text-white"
                    }`}
                  >
                    <Eye size={11} />
                    <span>{glossyOverlay ? "Glare Refraction: On" : "Glare Refraction: Off"}</span>
                  </button>
                </div>

                {/* Notification Triggerer */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-wider text-stone-400 font-mono font-bold">Notification Box</label>
                  <button
                    onClick={() => {
                      const sampleAlerts = [
                        "🔔 Double click text blocks anywhere to customize words inline!",
                        "🔔 Layout updated successfully! Spacing matches structural criteria.",
                        "🔔 Simulated incoming push message: 'Deploy build complete.'",
                        "🔔 Grid guides enabled! You can now align coordinates.",
                        "🔔 Simulated message: 'We need to check the iPad screen layout next.'"
                      ];
                      const randomMsg = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
                      setNotificationText(randomMsg);
                      setTimeout(() => {
                        setNotificationText(prev => prev === randomMsg ? null : prev);
                      }, 7000);
                    }}
                    className="flex items-center gap-1.5 p-1 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs select-none transition shadow-sm border border-rose-750 cursor-pointer"
                  >
                    <Bell size={11} />
                    <span>Test Notification</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scaler Wrapper Frame with layout-preserving container bounds */}
          <div
            id="scaler_outer_container"
            className="flex-shrink-0 relative transition-all duration-500 ease-out select-none mb-12 mx-auto self-center"
            style={{
              width: `${scaledWidthWithBezel * dynamicScale}px`,
              minWidth: `${scaledWidthWithBezel * dynamicScale}px`,
              height: `${scaledHeightWithBezel * dynamicScale}px`,
              margin: "0 auto",
            }}
          >
            <div 
              id="scaler_bounds"
              className="absolute left-0 top-0 origin-top-left transition-all duration-500 ease-out select-none"
              style={{ 
                width: `${scaledWidthWithBezel}px`,
                minWidth: `${scaledWidthWithBezel}px`,
                height: `${scaledHeightWithBezel}px`,
                transform: `scale(${dynamicScale})`,
                transformOrigin: "top left",
              }}
            >
              <DeviceFrame
                canvasViewport={canvasViewport}
                canvasOrientation={canvasOrientation}
                backdropTheme={backdropTheme}
                draggedId={draggedId}
                dragDropTargetId={dragDropTargetId}
                setDragDropTargetId={setDragDropTargetId}
                setDragDropPosition={setDragDropPosition}
                moveElement={moveElement}
                isEmpty={!componentTree.children || componentTree.children.length === 0}
                customWidth={activeDeviceConfig.width}
                customHeight={activeDeviceConfig.height}
                deviceName={activeDeviceConfig.name}
                showGridGuides={showGridGuides}
                batteryLevel={batteryLevel}
                networkStatus={networkStatus}
                simulatedTime={simulatedTime}
                glossyOverlay={glossyOverlay}
                notificationText={notificationText}
                onClearNotification={() => setNotificationText(null)}
              >
                <VisualNode elem={componentTree} />
              </DeviceFrame>
            </div>
          </div>
          
          {/* Static WYSIWYG tip overlay displayed centered under the active frame */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-stone-400 uppercase font-mono tracking-wider z-10 pointer-events-none shrink-0 mx-auto w-fit">
            <MousePointer size={11} />
            <span>Click element to select • Double click text fields to modify inline</span>
          </div>
        </div>



      </div>

      {/* EXPORT COMPLETED DIALOG SCREEN MODAL */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-3xl w-full border border-stone-200 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                <div className="flex items-center gap-2">
                  <FileCode size={20} className="text-rose-600" />
                  <div>
                    <h2 className="text-sm font-semibold text-stone-900">Your Compiled HTML & Tailwind Output</h2>
                    <p className="text-[10px] text-stone-500 font-mono tracking-wide">COPY OR DOWNLOAD THE BLUEPRINT ROUTINE</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="h-8 w-8 hover:bg-stone-200 rounded-full flex items-center justify-center text-stone-500 transition"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-2 text-left">
                  <Lightbulb size={16} className="text-rose-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-rose-900 leading-relaxed font-light">
                    This component is fully responsive and self-contained. It contains pure HTML inline utilities styled specifically via Tailwind CSS. To see a live preview in a static browser environment, load the single `.html` document bundle by clicking "Download Static Layout" below.
                  </p>
                </div>

                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-mono tracking-wider font-semibold text-stone-400 uppercase">Compiled Source Code</span>
                  <pre className="relative p-4 md:p-6 bg-stone-950 text-emerald-400 rounded-2xl text-xs font-mono overflow-x-auto text-left leading-normal ring-1 ring-stone-800">
                    <code>{compileTreeToHtml(componentTree)}</code>
                  </pre>
                </div>
              </div>

              <div className="p-5 border-t border-stone-200 flex items-center justify-end gap-3.5 bg-stone-50">
                <button
                  onClick={handleDownloadFile}
                  className="px-5 py-2.5 bg-white border border-stone-200 hover:border-stone-300 text-stone-600 text-xs font-semibold rounded-xl hover:bg-stone-50 transition flex items-center gap-1.5"
                >
                  <Download size={13} />
                  Download HTML Document
                </button>
                <button
                  onClick={handleCopyCode}
                  className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Detailed Styling Bottom Sheet Drawer Overlay */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="md:hidden fixed inset-0 bg-stone-900/45 backdrop-blur-xs z-50 flex items-end justify-center">
            {/* Backdrop click close */}
            <div className="absolute inset-0" onClick={() => setIsMobileDrawerOpen(false)} />
            
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 210 }}
              className="bg-white rounded-t-[32px] w-full max-h-[82vh] border-t border-stone-200/60 shadow-[0_-8px_40px_rgba(0,0,0,0.18)] flex flex-col z-10 relative overflow-hidden"
            >
              {/* Top Drag/Close Handle Area */}
              <div 
                className="w-full h-8 flex flex-col justify-center items-center cursor-pointer hover:bg-stone-50 transition border-b border-stone-100/60"
                onClick={() => setIsMobileDrawerOpen(false)}
              >
                <div className="w-12 h-1 bg-stone-300 rounded-full mb-0.5" />
                <span className="text-[9px] uppercase font-mono tracking-wider font-semibold text-stone-400">Tap to Minimize</span>
              </div>

              {/* Title Header with Close Button */}
              <div className="p-4 px-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div className="flex items-center gap-2">
                  <Sliders size={15} className="text-rose-600 animate-pulse" />
                  <div className="text-left">
                    <h3 className="text-xs font-bold text-stone-900 font-sans">Detailed Styling Inspector</h3>
                    {selectedElement && (
                      <p className="text-[9px] font-mono text-rose-600 uppercase font-bold tracking-wider mt-0.5">
                        Editing &lt;{selectedElement.tag}&gt; element
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-7 h-7 hover:bg-stone-200 rounded-full flex items-center justify-center text-stone-500 transition border border-stone-200/20 active:scale-95"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Inspector Content Panel wrapped with its properties inside the sheet container */}
              <div className="flex-1 overflow-y-auto max-h-[70vh] text-left">
                <InspectorPanel
                  selectedElement={selectedElement}
                  inspectorSection={inspectorSection}
                  setInspectorSection={setInspectorSection}
                  updateTree={updateTree}
                  deleteElement={deleteElement}
                  duplicateElement={duplicateElement}
                />
              </div>

              {/* Footer Panel Close CTA */}
              <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between gap-2.5">
                <span className="text-[10px] text-stone-400 font-mono italic">Adjustments previewed above</span>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="px-5 py-2 bg-stone-900 border border-stone-850 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm active:scale-95 transition-all"
                >
                  Apply & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile styling controllers */}
      <MobileStylingTabs />
      <MobileToolControls />

      {/* Mobile view sub-tabs navigator */}
      <div 
        className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-3 py-2 flex items-center justify-around gap-1 z-40 shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-stone-200/85 flex-shrink-0 w-[92vw] max-w-[390px]"
        style={{ height: "44.9931px", borderRadius: "50px" }}
      >
        <button
          onClick={() => setMobileActiveView("library")}
          className={`flex-1 py-1 rounded-xl flex flex-col items-center gap-0.5 text-[9px] font-semibold transition cursor-pointer ${
            mobileActiveView === "library" ? "text-rose-600 bg-rose-50/50" : "text-stone-400 hover:text-stone-600"
          }`}
        >
          <Layout size={16} />
          <span>Library</span>
        </button>
        <button
          onClick={() => setMobileActiveView("canvas")}
          className={`flex-1 py-1 rounded-xl flex flex-col items-center gap-0.5 text-[9px] font-semibold transition cursor-pointer ${
            mobileActiveView === "canvas" ? "text-rose-600 bg-rose-50/50" : "text-stone-400 hover:text-stone-600"
          }`}
        >
          <MousePointer size={16} />
          <span>Canvas</span>
        </button>
        <button
          onClick={() => setMobileActiveView("inspector")}
          className={`flex-1 py-1 rounded-xl flex flex-col items-center gap-0.5 text-[9px] font-semibold transition cursor-pointer ${
            mobileActiveView === "inspector" ? "text-rose-600 bg-rose-50/50" : "text-stone-400 hover:text-stone-600"
          }`}
        >
          <Settings size={16} />
          <span>Inspector</span>
        </button>
      </div>

    </div>
  );
}


export default function App() {
  return (
    <DesignerProvider>
      <DesignerApp />
    </DesignerProvider>
  );
}
