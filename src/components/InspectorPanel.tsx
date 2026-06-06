import React from "react";
import { 
  Settings, Sparkles, Palette, Maximize, Type, Layers, Play, Code, 
  HelpCircle, AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronDown, Trash2, Copy,
  Grid, Compass, Cpu, Move, Wand2
} from "lucide-react";
import { VisualElement } from "../types";
import { setGroupClass, getActiveGroupClass, setPrefixedClass, getPrefixedClass, setColorClass } from "../styleUtils";

export type InspectorSection = "layout" | "typography" | "visuals" | "motion" | "core";

interface InspectorPanelProps {
  selectedElement: VisualElement | null;
  inspectorSection: InspectorSection;
  setInspectorSection: (s: InspectorSection) => void;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
}

export function InspectorPanel({
  selectedElement,
  inspectorSection,
  setInspectorSection,
  updateTree,
  deleteElement,
  duplicateElement
}: InspectorPanelProps) {
  if (!selectedElement) return (
    <div className="flex flex-col items-center justify-center h-full w-full text-stone-400 p-8 text-center bg-stone-50/30 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-stone-200/60 flex items-center justify-center mb-4 text-stone-300">
        <Settings size={24} />
      </div>
      <p className="text-sm font-semibold text-stone-600">No Element Selected</p>
      <p className="text-xs text-stone-400 mt-1 max-w-[200px]">Click any element on the canvas to inspect and edit its properties.</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-white select-none">
      {/* Horizontally Scrollable Categories Tab List */}
      <div 
        role="tablist" 
        className="px-4 py-3 flex items-center gap-1.5 overflow-x-auto scrollbar-hide border-b border-stone-100 flex-shrink-0"
        onWheel={(e) => {
          if (e.deltaY !== 0 && e.deltaX === 0) {
            e.currentTarget.scrollLeft += e.deltaY;
          }
        }}
      >
        {[
          { id: "layout", label: "Layout & Spacing", icon: Maximize },
          { id: "typography", label: "Typography & Text", icon: Type },
          { id: "visuals", label: "Appearance & Visuals", icon: Palette },
          { id: "motion", label: "Motion & Effects", icon: Play },
          { id: "core", label: "Content & Code", icon: Sparkles }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={inspectorSection === tab.id}
            onClick={() => setInspectorSection(tab.id as InspectorSection)}
            className={`relative px-3.5 py-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shrink-0 text-xs font-semibold ${
              inspectorSection === tab.id 
                ? "text-purple-700 bg-purple-50/80 shadow-sm border border-purple-100/50" 
                : "text-stone-500 border border-transparent hover:text-stone-800 hover:bg-stone-50"
            }`}
          >
            <tab.icon size={13.5} className={inspectorSection === tab.id ? "text-purple-600" : "text-stone-400"} />
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Properties Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 flex flex-col gap-6 custom-scrollbar">
        
        {/* ==================== 1. LAYOUT & SPACING ==================== */}
        {inspectorSection === "layout" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Maximize size={15} className="text-purple-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">Layout & Structure</span>
            </div>

            {/* Sub-Category: Box Model (Element Spacing & Sizing) */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Grid size={11} />
                <span>Box Model (Spacing & Sizing)</span>
              </div>
              
              {/* Properties: Width & Height */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Width</label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(selectedElement.classes, "width")}
                      onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "width", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/85 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 cursor-pointer shadow-sm"
                    >
                      <option value="">Default (Auto)</option>
                      <option value="w-full">Full Width (w-full)</option>
                      <option value="w-1/2">Half Width (50%)</option>
                      <option value="w-1/3">1/3 Width (33.3%)</option>
                      <option value="w-2/3">2/3 Width (66.6%)</option>
                      <option value="w-1/4">1/4 Width (25%)</option>
                      <option value="w-3/4">3/4 Width (75%)</option>
                      <option value="w-32">Small (w-32)</option>
                      <option value="w-48">Medium (w-48)</option>
                      <option value="w-64">Large (w-64)</option>
                      <option value="w-96">Extra Large (w-96)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-sans">Height</label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(selectedElement.classes, "height")}
                      onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "height", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/85 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 cursor-pointer shadow-sm"
                    >
                      <option value="">Default (Auto)</option>
                      <option value="h-full">Full Height (h-full)</option>
                      <option value="h-12">Small (48px)</option>
                      <option value="h-16">Header/Tabs (64px)</option>
                      <option value="h-24">Compact Block (96px)</option>
                      <option value="h-32">Box (128px)</option>
                      <option value="h-48">Card Size (192px)</option>
                      <option value="h-64">Hero Banner (256px)</option>
                      <option value="h-80">Large Banner (320px)</option>
                      <option value="h-96">Full Height Banner (384px)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Min/Max Sizing select configurations */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Min Width</label>
                  <div className="relative">
                    <select
                      value={getPrefixedClass(selectedElement.classes, "min-w-")}
                      onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "min-w-", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/85 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="">None (min-w-0)</option>
                      <option value="min-w-0">min-w-0</option>
                      <option value="min-w-[100px]">100px</option>
                      <option value="min-w-[200px]">200px</option>
                      <option value="min-w-[300px]">300px</option>
                      <option value="min-w-full">100% (min-w-full)</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Max Width</label>
                  <div className="relative">
                    <select
                      value={getPrefixedClass(selectedElement.classes, "max-w-")}
                      onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "max-w-", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/85 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="">None</option>
                      <option value="max-w-xs">X Small (max-w-xs)</option>
                      <option value="max-w-sm">Small (max-w-sm)</option>
                      <option value="max-w-md">Medium (max-w-md)</option>
                      <option value="max-w-lg">Large (max-w-lg)</option>
                      <option value="max-w-xl">X Large (max-w-xl)</option>
                      <option value="max-w-2xl">2X Large (max-w-2xl)</option>
                      <option value="max-w-full">Full (max-w-full)</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Min Height</label>
                  <div className="relative">
                    <select
                      value={getPrefixedClass(selectedElement.classes, "min-h-")}
                      onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "min-h-", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/85 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="">None (min-h-0)</option>
                      <option value="min-h-0">min-h-0</option>
                      <option value="min-h-[50px]">50px</option>
                      <option value="min-h-[100px]">100px</option>
                      <option value="min-h-[200px]">200px</option>
                      <option value="min-h-full">100% (min-h-full)</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Max Height</label>
                  <div className="relative">
                    <select
                      value={getPrefixedClass(selectedElement.classes, "max-h-")}
                      onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "max-h-", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/85 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="">None</option>
                      <option value="max-h-full">100% (max-h-full)</option>
                      <option value="max-h-[300px]">300px</option>
                      <option value="max-h-[500px]">500px</option>
                      <option value="max-h-screen">Screen height</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Box Sizing & Aspect Ratio */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Box Sizing</label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(selectedElement.classes, "boxSizing")}
                      onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "boxSizing", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/85 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="">Default (Border Box)</option>
                      <option value="box-border">box-border</option>
                      <option value="box-content">box-content</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Aspect Ratio</label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(selectedElement.classes, "aspectRatio")}
                      onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "aspectRatio", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/85 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="">Default (aspect-auto)</option>
                      <option value="aspect-auto">aspect-auto</option>
                      <option value="aspect-square">Square (1:1 / aspect-square)</option>
                      <option value="aspect-video">Video (16:9 / aspect-video)</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Spacing Controls: Margin & Padding */}
              <div className="space-y-3 pt-1">
                <div className="p-3 bg-white border border-stone-200/50 rounded-xl space-y-3">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block font-sans">Padding (Inside Spacing)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1 col-span-2">
                      <label className="text-[9px] text-stone-400 font-medium">All sides padding global</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "p-")}
                        onChange={(e) => {
                          let updated = selectedElement.classes
                            .replace(/\b(pt|pr|pb|pl|px|py)-\w+\b/g, "")
                            .replace(/\s+/g, " ")
                            .trim();
                          updateTree(() => ({ 
                            classes: setPrefixedClass(updated, "p-", e.target.value) 
                          }));
                        }}
                        className="w-full bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">None (p-0)</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24,32,48,64].map((v) => (
                          <option key={v} value={`p-${v}`}>p-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-medium">Top side</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "pt-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "pt-", e.target.value) }))}
                        className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">Inherited</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                          <option key={v} value={`pt-${v}`}>pt-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-medium">Right side</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "pr-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "pr-", e.target.value) }))}
                        className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">Inherited</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                          <option key={v} value={`pr-${v}`}>pr-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-medium">Bottom side</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "pb-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "pb-", e.target.value) }))}
                        className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">Inherited</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                          <option key={v} value={`pb-${v}`}>pb-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-medium">Left side</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "pl-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "pl-", e.target.value) }))}
                        className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">Inherited</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                          <option key={v} value={`pl-${v}`}>pl-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white border border-stone-200/50 rounded-xl space-y-3">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block font-sans">Margin (Outside Spacing)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1 col-span-2">
                      <label className="text-[9px] text-stone-400 font-medium">All sides margin global</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "m-")}
                        onChange={(e) => {
                          let updated = selectedElement.classes
                            .replace(/\b(mt|mr|mb|ml|mx|my)-\w+\b/g, "")
                            .replace(/\s+/g, " ")
                            .trim();
                          updateTree(() => ({ 
                            classes: setPrefixedClass(updated, "m-", e.target.value) 
                          }));
                        }}
                        className="w-full bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">None (m-0)</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24,32,48,64].map((v) => (
                          <option key={v} value={`m-${v}`}>m-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-medium">Top side</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "mt-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "mt-", e.target.value) }))}
                        className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">Inherited</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                          <option key={v} value={`mt-${v}`}>mt-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-medium">Right side</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "mr-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "mr-", e.target.value) }))}
                        className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">Inherited</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                          <option key={v} value={`mr-${v}`}>mr-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-medium">Bottom side</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "mb-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "mb-", e.target.value) }))}
                        className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">Inherited</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                          <option key={v} value={`mb-${v}`}>mb-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-medium">Left side</label>
                      <select
                        value={getPrefixedClass(selectedElement.classes, "ml-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "ml-", e.target.value) }))}
                        className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 cursor-pointer"
                      >
                        <option value="">Inherited</option>
                        {[0,1,2,3,4,5,6,8,10,12,16,20,24].map((v) => (
                          <option key={v} value={`ml-${v}`}>ml-{v} ({v * 4}px)</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Category: Positioning */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Move size={11} />
                <span>Move & Absolute Positioning</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Positioning Scheme</label>
                <div className="relative">
                  <select
                    value={getActiveGroupClass(selectedElement.classes, "position")}
                    onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "position", e.target.value) }))}
                    className="w-full appearance-none bg-white border border-stone-200/85 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                  >
                    <option value="">default (static)</option>
                    <option value="relative">relative (Relative coordinates offset)</option>
                    <option value="absolute">absolute (Absolute pin coordinates)</option>
                    <option value="fixed">fixed (Stuck to viewport window)</option>
                    <option value="sticky">sticky (Follow scroll then stick)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>
              </div>

              {/* Reveal offset details only if position model is not static */}
              {selectedElement.classes.match(/\b(relative|absolute|fixed|sticky)\b/) && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1 font-mono">Top</label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(selectedElement.classes, "top-")}
                          onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "top-", e.target.value) }))}
                          className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                        >
                          <option value="">auto</option>
                          <option value="top-0">top-0</option>
                          <option value="top-1">top-1 (4px)</option>
                          <option value="top-2">top-2 (8px)</option>
                          <option value="top-4">top-4</option>
                          <option value="top-8">top-8</option>
                          <option value="top-12">top-12</option>
                          <option value="top-16">top-16</option>
                          <option value="-top-2">-top-2</option>
                          <option value="-top-4">-top-4</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1 font-mono">Right</label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(selectedElement.classes, "right-")}
                          onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "right-", e.target.value) }))}
                          className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                        >
                          <option value="">auto</option>
                          <option value="right-0">right-0</option>
                          <option value="right-1">right-1</option>
                          <option value="right-2">right-2</option>
                          <option value="right-4">right-4</option>
                          <option value="right-8">right-8</option>
                          <option value="right-12">right-12</option>
                          <option value="-right-2">-right-2</option>
                          <option value="-right-4">-right-4</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1 font-mono">Bottom</label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(selectedElement.classes, "bottom-")}
                          onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "bottom-", e.target.value) }))}
                          className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                        >
                          <option value="">auto</option>
                          <option value="bottom-0">bottom-0</option>
                          <option value="bottom-1">bottom-1</option>
                          <option value="bottom-2">bottom-2</option>
                          <option value="bottom-4">bottom-4</option>
                          <option value="bottom-8">bottom-8</option>
                          <option value="bottom-12">bottom-12</option>
                          <option value="-bottom-2">-bottom-2</option>
                          <option value="-bottom-4">-bottom-4</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1 font-mono">Left</label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(selectedElement.classes, "left-")}
                          onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "left-", e.target.value) }))}
                          className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                        >
                          <option value="">auto</option>
                          <option value="left-0">left-0</option>
                          <option value="left-1">left-1</option>
                          <option value="left-2">left-2</option>
                          <option value="left-4">left-4</option>
                          <option value="left-8">left-8</option>
                          <option value="left-12">left-12</option>
                          <option value="-left-2">-left-2</option>
                          <option value="-left-4">-left-4</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Shorthand Inset</label>
                    <div className="relative">
                      <select
                        value={getPrefixedClass(selectedElement.classes, "inset-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "inset-", e.target.value) }))}
                        className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                      >
                        <option value="">none (auto)</option>
                        <option value="inset-0">inset-0 (full bounds relative pin)</option>
                        <option value="inset-2">inset-2 (pinned with 8px margin)</option>
                        <option value="inset-4">inset-4 (pinned with 16px margin)</option>
                        <option value="inset-auto">inset-auto</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1">z-index (overlapping index)</label>
                    <div className="relative">
                      <select
                        value={getPrefixedClass(selectedElement.classes, "z-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "z-", e.target.value) }))}
                        className="w-full appearance-none bg-white border border-stone-200/85 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm font-semibold"
                      >
                        <option value="">auto</option>
                        <option value="z-0">z-0 (regular element)</option>
                        <option value="z-10">z-10 (floating button / banner)</option>
                        <option value="z-20">z-20 (dropdown menu / panels)</option>
                        <option value="z-30">z-30</option>
                        <option value="z-40">z-40</option>
                        <option value="z-50">z-50 (modal overlays)</option>
                        <option value="z-auto">z-auto</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sub-Category: Flexbox Layout (Flex Container & Flex Items) */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Cpu size={11} />
                <span>Flexbox Arrangement & Items</span>
              </div>

              {/* Display selection state block */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Display Model</label>
                <div className="grid grid-cols-5 gap-1 bg-white p-1 rounded-xl border border-stone-200/80 shadow-sm">
                  {["block", "inline-block", "flex", "grid", "hidden"].map((disp) => {
                    const isActive = getActiveGroupClass(selectedElement.classes, "display") === disp;
                    return (
                      <button
                        key={disp} type="button"
                        onClick={() => updateTree((n) => ({ classes: setGroupClass(n.classes, "display", disp) }))}
                        className={`py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-150 flex items-center justify-center capitalize cursor-pointer ${
                          isActive 
                            ? "bg-purple-600 text-white shadow-sm font-bold border border-purple-500" 
                            : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
                        }`}
                      >
                        {disp === "inline-block" ? "Inline" : disp}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Render controls only if displays as flex */}
              {selectedElement.classes.includes("flex") ? (
                <div className="space-y-4 animate-in fade-in duration-200 pt-1">
                  {/* Flex Direction */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-1">Flex Direction</label>
                    <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-stone-200/60 shadow-sm">
                      {[
                        { key: "flex-row", label: "Horizontal" },
                        { key: "flex-col", label: "Vertical" },
                        { key: "flex-wrap", label: "Wrap On" }
                      ].map((item) => {
                        const isActive = selectedElement.classes.includes(item.key);
                        return (
                          <button
                            key={item.key} type="button"
                            onClick={() => updateTree((n) => ({ classes: setGroupClass(n.classes, "flexDirection", item.key) }))}
                            className={`py-1.5 rounded-lg text-[10px] font-medium transition-all duration-150 flex items-center justify-center cursor-pointer ${
                              isActive 
                                ? "bg-purple-50 text-purple-700 font-bold border border-purple-200" 
                                : "text-stone-500 hover:text-stone-800 hover:bg-stone-100/50"
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Justify Content & Align Items */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-1">Horizontal Align</label>
                      <div className="relative">
                        <select
                          value={getActiveGroupClass(selectedElement.classes, "justify")}
                          onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "justify", e.target.value) }))}
                          className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2 text-[11px] text-stone-700 focus:outline-none cursor-pointer shadow-sm font-medium"
                        >
                          <option value="">Default</option>
                          <option value="justify-start">Start (Left)</option>
                          <option value="justify-center">Center</option>
                          <option value="justify-end">End (Right)</option>
                          <option value="justify-between">Space Between</option>
                          <option value="justify-around">Space Around</option>
                          <option value="justify-evenly">Space Evenly</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-1">Vertical Align</label>
                      <div className="relative">
                        <select
                          value={getActiveGroupClass(selectedElement.classes, "alignment")}
                          onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "alignment", e.target.value) }))}
                          className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2 text-[11px] text-stone-700 focus:outline-none cursor-pointer shadow-sm font-medium"
                        >
                          <option value="">Default</option>
                          <option value="items-start">Top (Start)</option>
                          <option value="items-center">Middle (Center)</option>
                          <option value="items-end">Bottom (End)</option>
                          <option value="items-stretch">Stretch</option>
                          <option value="items-baseline">Baseline</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Inter-element Gap */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-1">Inter-element Gap</label>
                    <div className="relative">
                      <select
                        value={getActiveGroupClass(selectedElement.classes, "gap")}
                        onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "gap", e.target.value) }))}
                        className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                      >
                        <option value="">No Gap</option>
                        <option value="gap-1">Tight (gap-1 - 4px)</option>
                        <option value="gap-2">Small (gap-2 - 8px)</option>
                        <option value="gap-3">Standard (gap-3 - 12px)</option>
                        <option value="gap-4">Relaxed (gap-4 - 16px)</option>
                        <option value="gap-6">Double (gap-6 - 24px)</option>
                        <option value="gap-8">Spacious (gap-8 - 32px)</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-[10px] bg-stone-100 border border-stone-200/40 text-stone-500 rounded-xl p-3 leading-relaxed">
                  Display model is currently not flex. Select <strong>flex</strong> display to reveal detailed container alignment parameters.
                </p>
              )}

              {/* Flex Item Properties */}
              <div className="border-t border-stone-200/50 pt-4 space-y-3">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono block">Selected Item Flex Properties</span>
                <p className="text-[9px] text-stone-400 leading-normal">Override properties for custom wrapping, growing or visual ordering.</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Flex Grow</label>
                    <div className="relative">
                      <select
                        value={getActiveGroupClass(selectedElement.classes, "flexGrow")}
                        onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "flexGrow", e.target.value) }))}
                        className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                      >
                        <option value="">default</option>
                        <option value="grow">grow (fill space)</option>
                        <option value="grow-0">grow-0 (no grow)</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Flex Shrink</label>
                    <div className="relative">
                      <select
                        value={getActiveGroupClass(selectedElement.classes, "flexShrink")}
                        onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "flexShrink", e.target.value) }))}
                        className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                      >
                        <option value="">default</option>
                        <option value="shrink">shrink</option>
                        <option value="shrink-0">shrink-0 (no shrink)</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Align Self Override</label>
                    <div className="relative">
                      <select
                        value={getActiveGroupClass(selectedElement.classes, "alignSelf")}
                        onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "alignSelf", e.target.value) }))}
                        className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm font-medium"
                      >
                        <option value="">Default (Follow Parent)</option>
                        <option value="self-auto">self-auto</option>
                        <option value="self-start">self-start (push to top)</option>
                        <option value="self-end">self-end (push to bottom)</option>
                        <option value="self-center">self-center (middle)</option>
                        <option value="self-stretch">self-stretch</option>
                        <option value="self-baseline">self-baseline</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Flex Basis (Base Size)</label>
                    <div className="relative">
                      <select
                        value={getPrefixedClass(selectedElement.classes, "basis-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "basis-", e.target.value) }))}
                        className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                      >
                        <option value="">default / auto</option>
                        <option value="basis-auto">basis-auto</option>
                        <option value="basis-full">basis-full (100% basis width)</option>
                        <option value="basis-1/2">basis-1/2 (50%)</option>
                        <option value="basis-1/3">basis-1/3 (33%)</option>
                        <option value="basis-1/4">basis-1/4 (25%)</option>
                        <option value="basis-0">basis-0</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Visual Order</label>
                    <div className="relative">
                      <select
                        value={getPrefixedClass(selectedElement.classes, "order-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "order-", e.target.value) }))}
                        className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                      >
                        <option value="">default</option>
                        <option value="order-first">order-first (Render first)</option>
                        <option value="order-last">order-last (Render last)</option>
                        <option value="order-1">order-1</option>
                        <option value="order-2">order-2</option>
                        <option value="order-3">order-3</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Category: Grid Layout */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Grid size={11} />
                <span>Grid Layout Grid columns/rows</span>
              </div>

              {selectedElement.classes.includes("grid") ? (
                <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-1">Grid Columns template</label>
                    <div className="relative">
                      <select
                        value={getPrefixedClass(selectedElement.classes, "grid-cols-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "grid-cols-", e.target.value) }))}
                        className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                      >
                        <option value="">auto</option>
                        <option value="grid-cols-1">1 Column (grid-cols-1)</option>
                        <option value="grid-cols-2">2 Columns (grid-cols-2)</option>
                        <option value="grid-cols-3">3 Columns (grid-cols-3)</option>
                        <option value="grid-cols-4">4 Columns (grid-cols-4)</option>
                        <option value="grid-cols-5">5 Columns</option>
                        <option value="grid-cols-6">6 Columns</option>
                        <option value="grid-cols-12">12 Columns (grid-cols-12)</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-1">Grid Rows template</label>
                    <div className="relative">
                      <select
                        value={getPrefixedClass(selectedElement.classes, "grid-rows-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "grid-rows-", e.target.value) }))}
                        className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                      >
                        <option value="">auto</option>
                        <option value="grid-rows-1">1 Row</option>
                        <option value="grid-rows-2">2 Rows</option>
                        <option value="grid-rows-3">3 Rows</option>
                        <option value="grid-rows-4">4 Rows</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-1">Justify Items (Horizontal plane)</label>
                    <div className="relative">
                      <select
                        value={getActiveGroupClass(selectedElement.classes, "justifyItems")}
                        onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "justifyItems", e.target.value) }))}
                        className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                      >
                        <option value="">Default (Stretch entire cell width)</option>
                        <option value="justify-items-start">start</option>
                        <option value="justify-items-end">end</option>
                        <option value="justify-items-center">center</option>
                        <option value="justify-items-stretch">stretch</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Inter-element Gap */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-1">Grid Gap spacing</label>
                    <div className="relative">
                      <select
                        value={getActiveGroupClass(selectedElement.classes, "gap")}
                        onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "gap", e.target.value) }))}
                        className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                      >
                        <option value="">No Gap</option>
                        <option value="gap-1">Tight (gap-1 - 4px)</option>
                        <option value="gap-2">Small (gap-2 - 8px)</option>
                        <option value="gap-3">Standard (gap-3 - 12px)</option>
                        <option value="gap-4">Relaxed (gap-4 - 16px)</option>
                        <option value="gap-6">Double (gap-6 - 24px)</option>
                        <option value="gap-8">Spacious (gap-8 - 32px)</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-[10px] bg-stone-100 border border-stone-200/40 text-stone-500 rounded-xl p-3 leading-relaxed">
                  Display model is currently not grid. Select <strong>grid</strong> display above to trigger comprehensive Columns details.
                </p>
              )}

              {/* Grid Items Details (Col Span & Row Span) */}
              <div className="border-t border-stone-200/55 pt-4 space-y-3">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono block">Selected Item Grid Properties</span>
                <p className="text-[9px] text-stone-400 leading-normal">Assign custom cell span dimensions inside any Active Grid layout container.</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Column Span (width span)</label>
                    <div className="relative">
                      <select
                        value={getPrefixedClass(selectedElement.classes, "col-span-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "col-span-", e.target.value) }))}
                        className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                      >
                        <option value="">auto</option>
                        <option value="col-span-1">col-span-1 (Takes 1 cell width)</option>
                        <option value="col-span-2">col-span-2 (Takes 2 cell width)</option>
                        <option value="col-span-3">col-span-3</option>
                        <option value="col-span-4">col-span-4</option>
                        <option value="col-span-6">col-span-6</option>
                        <option value="col-span-12">col-span-12 (Spans full grid width)</option>
                        <option value="col-span-full">col-span-full</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Row Span (height span)</label>
                    <div className="relative">
                      <select
                        value={getPrefixedClass(selectedElement.classes, "row-span-")}
                        onChange={(e) => updateTree((n) => ({ classes: setPrefixedClass(n.classes, "row-span-", e.target.value) }))}
                        className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                      >
                        <option value="">auto</option>
                        <option value="row-span-1">row-span-1 (Spans 1 cell height)</option>
                        <option value="row-span-2">row-span-2 (Spans 2 cell height)</option>
                        <option value="row-span-3">row-span-3</option>
                        <option value="row-span-full">row-span-full</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Category: Overflow & Scrolling */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Layers size={11} />
                <span>Overflow & Smooth Scrolling</span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1 font-mono">Global Overflow</label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(selectedElement.classes, "overflow")}
                      onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "overflow", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-sm focus:outline-none cursor-pointer"
                    >
                      <option value="">default (visible)</option>
                      <option value="overflow-auto">overflow-auto (scrolls when content leaks)</option>
                      <option value="overflow-hidden">overflow-hidden (clips all overlaps)</option>
                      <option value="overflow-clip">overflow-clip (hard clip)</option>
                      <option value="overflow-visible">overflow-visible (allow leakages)</option>
                      <option value="overflow-scroll">overflow-scroll (forced scrollbars)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Horizontal (X)</label>
                    <div className="relative">
                      <select
                        value={getActiveGroupClass(selectedElement.classes, "overflowX")}
                        onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "overflowX", e.target.value) }))}
                        className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-2 pr-6 py-1.5 text-xs text-stone-700 shadow-sm focus:outline-none cursor-pointer"
                      >
                        <option value="">auto</option>
                        <option value="overflow-x-auto">auto</option>
                        <option value="overflow-x-hidden">hidden</option>
                        <option value="overflow-x-visible">visible</option>
                        <option value="overflow-x-scroll">scroll</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Vertical (Y)</label>
                    <div className="relative">
                      <select
                        value={getActiveGroupClass(selectedElement.classes, "overflowY")}
                        onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "overflowY", e.target.value) }))}
                        className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-2 pr-6 py-1.5 text-xs text-stone-700 shadow-sm focus:outline-none cursor-pointer"
                      >
                        <option value="">auto</option>
                        <option value="overflow-y-auto">auto</option>
                        <option value="overflow-y-hidden">hidden</option>
                        <option value="overflow-y-visible">visible</option>
                        <option value="overflow-y-scroll">scroll</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Scrolling Behavior</label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(selectedElement.classes, "scrollBehavior")}
                      onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "scrollBehavior", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-sm focus:outline-none cursor-pointer"
                    >
                      <option value="">auto (immediate snap)</option>
                      <option value="scroll-smooth">scroll-smooth (smooth spring transition)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1 font-mono">Scroll Snap Type</label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(selectedElement.classes, "scrollSnapType")}
                      onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "scrollSnapType", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-sm focus:outline-none cursor-pointer"
                    >
                      <option value="">snap-none</option>
                      <option value="snap-x">snap-x (Horizontal Slides Snap)</option>
                      <option value="snap-y">snap-y (Vertical Sections Snap)</option>
                      <option value="snap-both">snap-both (Dual-Axis snapping)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. TYPOGRAPHY & TEXT ==================== */}
        {inspectorSection === "typography" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2">
              <Type size={15} className="text-purple-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Typography & Layout</span>
            </div>
            
            {/* Sub-Category: Core Typography Styles */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Type size={11} />
                <span>Text styling & Font styles</span>
              </div>

              {/* Font Family Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Font Family</label>
                <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-stone-200/80 shadow-sm">
                  {(["font-sans", "font-serif", "font-mono"] as const).map((font) => {
                    const isActive = getActiveGroupClass(selectedElement.classes, "fontFamily") === font;
                    return (
                      <button
                        key={font} type="button"
                        onClick={() => updateTree((n) => ({ classes: setGroupClass(n.classes, "fontFamily", font) }))}
                        className={`py-1.5 rounded-lg text-xs transition-all duration-200 font-semibold flex items-center justify-center capitalize cursor-pointer ${
                          isActive 
                            ? "bg-purple-600 text-white shadow-sm font-bold border border-purple-500" 
                            : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
                        }`}
                      >
                        {font.replace("font-", "")}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Alignment Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Horizontal text Alignment</label>
                <div className="grid grid-cols-4 gap-1 bg-white p-1 rounded-xl border border-stone-200/80 shadow-sm">
                  {([
                    { key: "text-left", icon: <AlignLeft size={14} /> },
                    { key: "text-center", icon: <AlignCenter size={14} /> },
                    { key: "text-right", icon: <AlignRight size={14} /> },
                    { key: "text-justify", icon: <AlignJustify size={14} /> },
                  ] as const).map((align) => {
                    const isActive = getActiveGroupClass(selectedElement.classes, "textAlign") === align.key;
                    return (
                      <button
                        key={align.key} type="button"
                        onClick={() => updateTree((n) => ({ classes: setGroupClass(n.classes, "textAlign", align.key) }))}
                        className={`py-2 rounded-lg transition-all duration-150 flex justify-center items-center cursor-pointer ${
                          isActive 
                            ? "bg-purple-50 text-purple-700 shadow-sm border border-purple-200" 
                            : "text-stone-400 hover:text-stone-800 hover:bg-stone-100"
                        }`}
                      >
                        {align.icon}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Size & Weight Selectors */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Font Size</label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(selectedElement.classes, "textSize")}
                      onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "textSize", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 cursor-pointer shadow-sm"
                    >
                      <option value="">Default (Base)</option>
                      <option value="text-xs">XS (12px)</option>
                      <option value="text-sm">SM (14px)</option>
                      <option value="text-base">Base (16px)</option>
                      <option value="text-lg">LG (18px)</option>
                      <option value="text-xl">XL (20px)</option>
                      <option value="text-2xl">2XL (24px)</option>
                      <option value="text-3xl">3XL (30px)</option>
                      <option value="text-4xl">4XL (36px)</option>
                      <option value="text-5xl">5XL (48px)</option>
                      <option value="text-6xl">6XL (60px)</option>
                      <option value="text-7xl">7XL (72px)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Font Weight</label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(selectedElement.classes, "fontWeight")}
                      onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "fontWeight", e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 cursor-pointer shadow-sm"
                    >
                      <option value="">Default</option>
                      <option value="font-light">Light (300)</option>
                      <option value="font-normal">Normal (400)</option>
                      <option value="font-medium">Medium (500)</option>
                      <option value="font-semibold">Semi Bold (600)</option>
                      <option value="font-bold">Bold (700)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Category: Text Spacing & Flow */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Move size={11} />
                <span>Text tracking & Line Height</span>
              </div>

              {/* Letter Spacing (Tracking) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Letter Spacing (Tracking)</label>
                <div className="relative">
                  <select
                    value={getActiveGroupClass(selectedElement.classes, "tracking")}
                    onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "tracking", e.target.value) }))}
                    className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                  >
                    <option value="">Default (Normal)</option>
                    <option value="tracking-tighter">Tighter (-0.05em)</option>
                    <option value="tracking-tight">Tight (-0.025em)</option>
                    <option value="tracking-normal">Normal (0em)</option>
                    <option value="tracking-wide">Wide (0.025em)</option>
                    <option value="tracking-widest">Widest (0.1em)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>
              </div>

              {/* Line Height (Leading) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Line Height (Leading)</label>
                <div className="relative">
                  <select
                    value={getActiveGroupClass(selectedElement.classes, "leading")}
                    onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, "leading", e.target.value) }))}
                    className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                  >
                    <option value="">Default</option>
                    <option value="leading-none">Tightest (1)</option>
                    <option value="leading-tight">Tight (1.25)</option>
                    <option value="leading-snug">Snug (1.375)</option>
                    <option value="leading-normal">Normal (1.5)</option>
                    <option value="leading-relaxed">Relaxed (1.625)</option>
                    <option value="leading-loose">Loose (2)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. APPEARANCE & VISUALS ==================== */}
        {inspectorSection === "visuals" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Palette size={15} className="text-purple-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Appearance & Visual styles</span>
            </div>

            {/* Sub-Category: Color palettes */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Palette size={11} />
                <span>Colors & Solid Backgrounds</span>
              </div>

              {/* Background Color Swatches */}
              <div className="flex flex-col gap-3">
                <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Background Fill</label>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { name: "Transparent", class: "bg-transparent", ring: "ring-stone-200", render: <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 opacity-50" /> },
                    { name: "White", class: "bg-white", ring: "ring-stone-200" },
                    { name: "Soft Stone", class: "bg-stone-50", ring: "ring-stone-200" },
                    { name: "Deep Stone", class: "bg-stone-900", ring: "ring-stone-900" },
                    { name: "Slate Noir", class: "bg-slate-950", ring: "ring-slate-950" },
                    { name: "Warm Vanilla", class: "bg-amber-50", ring: "ring-amber-200" },
                    { name: "Teal Pine", class: "bg-emerald-900", ring: "ring-emerald-900" },
                    { name: "Cosmic Indigo", class: "bg-indigo-950", ring: "ring-indigo-950" },
                    { name: "Aura Purple", class: "bg-purple-100", ring: "ring-purple-300" },
                    { name: "Soft Amber", class: "bg-amber-100", ring: "ring-amber-300" }
                  ].map((swatch) => {
                    const isSelected = selectedElement.classes.includes(swatch.class) || 
                      (swatch.class === "bg-transparent" && !selectedElement.classes.match(/\bbg-\w+/));
                    
                    return (
                      <button
                        key={swatch.name}
                        type="button"
                        onClick={() => {
                          let textClass = "";
                          if (["bg-stone-900", "bg-slate-950", "bg-emerald-900", "bg-indigo-950"].includes(swatch.class)) {
                            textClass = "text-stone-100";
                          } else if (swatch.class === "bg-transparent") {
                            textClass = "";
                          } else {
                            textClass = "text-stone-800";
                          }
                          updateTree((n) => {
                            let updated = setColorClass(n.classes, "bg-", swatch.class);
                            if (textClass) {
                              updated = setColorClass(updated, "text-", textClass);
                            }
                            return { classes: updated };
                          });
                        }}
                        title={swatch.name}
                        className={`w-8 h-8 rounded-full relative shadow-sm cursor-pointer transition-all duration-200 hover:scale-110 flex items-center justify-center overflow-hidden border ${swatch.class} ${
                          isSelected 
                            ? `ring-2 ${swatch.ring} ring-offset-2 border-transparent scale-105` 
                            : "border-stone-200/80 hover:border-text"
                        }`}
                      >
                        {swatch.render}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Accent Colors selector */}
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Primary Text Accent</label>
                <div className="relative">
                  <select
                    value={selectedElement.classes.match(/\btext-(stone-800|stone-100|purple-600|indigo-600|emerald-600|amber-600|rose-600|white|black)\b/)?.[0] || ""}
                    onChange={(e) => {
                      updateTree((n) => ({ classes: setColorClass(n.classes, "text-", e.target.value) }));
                    }}
                    className="w-full appearance-none bg-white border border-stone-200/85 rounded-xl pl-3 pr-8 py-2.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                  >
                    <option value="">Default (Inherited)</option>
                    <option value="text-stone-800">Deep Earth Gray (text-stone-800)</option>
                    <option value="text-white">Crisp White (text-white)</option>
                    <option value="text-purple-600">Dynamic Purple (text-purple-600)</option>
                    <option value="text-indigo-600">Cosmic Indigo (text-indigo-600)</option>
                    <option value="text-emerald-600">Emerald Forest (text-emerald-600)</option>
                    <option value="text-amber-600">Vibrant Amber (text-amber-600)</option>
                    <option value="text-rose-600">Bright Rose (text-rose-600)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Sub-Category: Borders & Layout Effects */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Layers size={11} />
                <span>Borders, corners & drop shadows</span>
              </div>

              {[
                { 
                  label: "Border Radius (Corners)", 
                  prop: "rounding",
                  options: [
                    { val: "rounded-none", text: "Flat Bounds (None)" },
                    { val: "rounded-sm", text: "Small Curves (Rounded-sm)" },
                    { val: "rounded", text: "Mild Rounded (Rounded)" },
                    { val: "rounded-md", text: "Medium Corners" },
                    { val: "rounded-lg", text: "Large Bounds" },
                    { val: "rounded-xl", text: "Card standard (Rounded-xl)" },
                    { val: "rounded-2xl", text: "Pill/Button standard (2XL)" },
                    { val: "rounded-3xl", text: "Expressive Container (3XL)" },
                    { val: "rounded-full", text: "Pill/Circle (Rounded-full)" }
                  ]
                },
                { 
                  label: "Border Stroke Weight", 
                  prop: "borderWidth",
                  options: [
                    { val: "border-0", text: "Seamless (Zero Borders)" },
                    { val: "border", text: "1px Hairline (border)" },
                    { val: "border-2", text: "2px Precise outline" },
                    { val: "border-4", text: "4px Dynamic frame" },
                    { val: "border-8", text: "8px Heavy border frame" }
                  ]
                },
                { 
                  label: "Shading & Depth (Box Shadow)", 
                  prop: "shadow",
                  options: [
                    { val: "shadow-none", text: "Flat Surface (No Shadow)" },
                    { val: "shadow-sm", text: "Subtle Lift-up (sm)" },
                    { val: "shadow", text: "Ambient Hover Soft (shadow)" },
                    { val: "shadow-md", text: "Double-layered depth (md)" },
                    { val: "shadow-lg", text: "Large floating shadow (lg)" },
                    { val: "shadow-xl", text: "Major Depth Elevation (xl)" },
                    { val: "shadow-2xl", text: "Maximum Contrast Floating (2xl)" }
                  ]
                }
              ].map((control) => (
                <div key={control.label} className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">{control.label}</label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(selectedElement.classes, control.prop as any)}
                      onChange={(e) => updateTree((n) => ({ classes: setGroupClass(n.classes, control.prop as any, e.target.value) }))}
                      className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2.5 text-xs text-stone-700 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 cursor-pointer shadow-sm"
                    >
                      {control.options.map(opt => <option key={opt.val} value={opt.val}>{opt.text}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 4. MOTION & EFFECTS ==================== */}
        {inspectorSection === "motion" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Play size={15} className="text-purple-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Movement & Micro-interactions</span>
            </div>

            {/* Sub-Category: Smooth CSS Transitions */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Play size={11} />
                <span>Transition Curves & Speeds</span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Target Property</label>
                  <div className="relative">
                    <select
                      value={selectedElement.classes.match(/\btransition(-all|-colors|-opacity|-shadow|-transform)?\b/)?.[0] || "none"}
                      onChange={(e) => {
                        updateTree((n) => {
                          let newClasses = n.classes.replace(/\btransition(-all|-colors|-opacity|-shadow|-transform)?\b/g, "").replace(/\s+/g, " ").trim();
                          if (e.target.value !== "none") newClasses += ` ${e.target.value}`;
                          return { classes: newClasses.trim() };
                        });
                      }}
                      className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="none">No Transition</option>
                      <option value="transition-all">All styling variables (transition-all)</option>
                      <option value="transition">Default CSS Props (transition)</option>
                      <option value="transition-colors">Colors, backgrounds, borders</option>
                      <option value="transition-opacity">Opacity only</option>
                      <option value="transition-transform">Position, transforms & scale</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Animate Duration</label>
                  <div className="relative">
                    <select
                      value={selectedElement.classes.match(/\bduration-\d+\b/)?.[0] || "none"}
                      onChange={(e) => {
                        updateTree((n) => {
                          let newClasses = n.classes.replace(/\bduration-\d+\b/g, "").replace(/\s+/g, " ").trim();
                          if (e.target.value !== "none") newClasses += ` ${e.target.value}`;
                          return { classes: newClasses.trim() };
                        });
                      }}
                      className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="none">Default Speed (150ms)</option>
                      <option value="duration-75">75ms (Ultra Snappy)</option>
                      <option value="duration-150">150ms (Regular Click)</option>
                      <option value="duration-300">300ms (Smooth transition)</option>
                      <option value="duration-500">500ms (Noticeable slide)</option>
                      <option value="duration-700">700ms (Polished slower scroll)</option>
                      <option value="duration-1000">1000ms (1 second transition)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider pl-1">Easing Timing Curve</label>
                  <div className="relative">
                    <select
                      value={selectedElement.classes.match(/\bease-(linear|in|out|in-out)\b/)?.[0] || "none"}
                      onChange={(e) => {
                        updateTree((n) => {
                          let newClasses = n.classes.replace(/\bease-(linear|in|out|in-out)\b/g, "").replace(/\s+/g, " ").trim();
                          if (e.target.value !== "none") newClasses += ` ${e.target.value}`;
                          return { classes: newClasses.trim() };
                        });
                      }}
                      className="w-full appearance-none bg-white border border-stone-200/80 rounded-xl pl-3 pr-8 py-2.5 text-xs text-stone-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="none">Default Timing</option>
                      <option value="ease-linear">Linear (constant rate)</option>
                      <option value="ease-in">Ease-In (starts slow)</option>
                      <option value="ease-out">Ease-Out (curves out / decelerates)</option>
                      <option value="ease-in-out">Ease-In-Out (organic bell curve)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Category: Interactive micro-inputs / Animations */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Wand2 size={11} />
                <span>Hover presets & infinite motion</span>
              </div>

              {/* Quick toggle chips */}
              <div className="flex flex-col gap-2.5">
                {[
                  { label: "Scale Lift-up on Hover", class: "hover:scale-[1.03]" },
                  { label: "Slight Rotation on Hover", class: "hover:rotate-3" },
                  { label: "Hover Lift Shadow", class: "hover:shadow-md" },
                  { label: "Gentle Fade-In Entry", class: "animate-fade-in" },
                  { label: "Infinite Ambient Pulse", class: "animate-pulse" },
                  { label: "Attention Bounce loop", class: "animate-bounce" }
                ].map((item) => {
                  const isActive = selectedElement.classes.includes(item.class);
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        updateTree((node) => {
                          let updatedClasses = node.classes;
                          if (isActive) {
                            updatedClasses = updatedClasses.replace(item.class, "");
                          } else {
                            updatedClasses += ` transition-all duration-300 ${item.class}`;
                          }
                          return { classes: updatedClasses.replace(/\s+/g, " ").trim() };
                        });
                      }}
                      className={`w-full py-2 px-3 text-xs rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                        isActive 
                          ? "bg-purple-100/50 border-purple-200 text-purple-700 font-semibold" 
                          : "bg-white border-stone-200/60 text-stone-600 hover:text-stone-800 hover:border-stone-300"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-purple-600" : "bg-stone-200"}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 5. CORE DETAILS & CUSTOM CODE ==================== */}
        {inspectorSection === "core" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={15} className="text-purple-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">Content & Custom Utilities</span>
            </div>

            {/* Sub-Category: Content details */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Compass size={11} />
                <span>Text / URL Attributes</span>
              </div>
              
              {selectedElement.content !== undefined ? (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Rendered Node inner content</label>
                  <input
                    type="text"
                    value={selectedElement.content || ""}
                    onChange={(e) => updateTree(() => ({ content: e.target.value }))}
                    className="w-full bg-white border border-stone-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 transition-all font-sans text-stone-800 shadow-sm"
                    placeholder="Type inner text content or image src url..."
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2.5 text-stone-500 bg-white rounded-xl p-4 border border-stone-200/40 shadow-sm">
                  <HelpCircle size={15} className="text-stone-400" />
                  <span className="text-xs font-medium">This structural layout bounds container doesn't accept direct text fields. Select a text layer child to edit wordings.</span>
                </div>
              )}
            </div>

            {/* Sub-Category: Utility classes direct write */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 font-mono flex items-center gap-1">
                <Code size={11} />
                <span>Advanced Tailwind Utility Classes</span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1">Direct tokens string editor</label>
                <textarea
                  rows={4}
                  value={selectedElement.classes || ""}
                  onChange={(e) => updateTree(() => ({ classes: e.target.value }))}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-3 text-[11px] leading-relaxed focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-500/20 transition-all font-mono text-emerald-400 resize-none shadow-inner"
                  placeholder="flex items-center justify-between px-4 py-2 border border-gray-100..."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Delete and Duplicate Action Bar stuck to bottom */}
      <div className="border-t border-stone-100 p-4 shrink-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] flex items-center gap-2.5 bg-stone-50/30">
        <button
          onClick={() => {
            if (selectedElement) duplicateElement(selectedElement.id);
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 bg-stone-100 hover:bg-stone-200 hover:text-stone-900 text-stone-700 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm border border-stone-200/30 cursor-pointer"
        >
          <Copy size={13.5} />
          <span>Duplicate</span>
        </button>

        <button
          onClick={() => {
            if (selectedElement) deleteElement(selectedElement.id);
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-sm border border-red-100/30 cursor-pointer"
        >
          <Trash2 size={13.5} />
          <span>Delete Element</span>
        </button>
      </div>
    </div>
  );
}
