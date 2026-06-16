import React, { useState } from "react";
import { Settings, ChevronDown, Grid, Sliders, Box } from "lucide-react";
import { VisualElement } from "../../types";
import { PropertyControl } from "../PropertyControl";
import {
  setGroupClass,
  getActiveGroupClass,
  setPrefixedClass,
  getPrefixedClass,
  setColorClass,
} from "../../styleUtils";

interface SizingSectionProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
  handleCopy: (text: string) => void;
  copiedText: string | null;
}

export function SizingSection({ selectedElement, updateTree, handleCopy, copiedText }: SizingSectionProps) {

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Sliders size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">
                Sizing Settings
              </span>
            </div>

            {/* Sub-Category: Dimensions */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1">
                <Grid size={11} />
                <span>Dimensions</span>
              </div>

              {/* Properties: Width & Height */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono">
                      Width
                    </label>
                    <span className="text-[8px] text-rose-700 bg-rose-50 px-1 py-0.5 rounded font-bold uppercase tracking-wide">
                      Dual-Nature
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative font-sans">
                      <select
                        value={getActiveGroupClass(selectedElement.classes, "width")}
                        onChange={(e) =>
                          updateTree((n) => ({
                            classes: setGroupClass(n.classes, "width", e.target.value),
                          }))
                        }
                        className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                      >
                        <option value="">auto</option>
                        <option value="w-full">100% (full)</option>
                        <option value="w-1/2">50% (1/2)</option>
                        <option value="w-1/3">33.3% (1/3)</option>
                        <option value="w-2/3">66.6% (2/3)</option>
                        <option value="w-1/4">25% (1/4)</option>
                        <option value="w-3/4">75% (3/4)</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="custom e.g. 100px"
                      value={(() => {
                        const C = (selectedElement.classes || "").split(/\s+/).find((k) => k.startsWith("w-[") && k.endsWith("]"));
                        return C ? C.substring(3, C.length - 1).replace(/_/g, " ") : "";
                      })()}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        let R = (selectedElement.classes || "").split(/\s+/).filter(Boolean).filter((Q) => !Q.startsWith("w-["));
                        if (val) R.push(`w-[${val.replace(/\s+/g, "_")}]`);
                        updateTree((Q) => ({ classes: R.join(" ") }));
                      }}
                      className="w-full bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 focus:bg-white font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono">
                      Height
                    </label>
                    <span className="text-[8px] text-rose-700 bg-rose-50 px-1 py-0.5 rounded font-bold uppercase tracking-wide">
                      Dual-Nature
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative font-sans">
                      <select
                        value={getActiveGroupClass(selectedElement.classes, "height")}
                        onChange={(e) =>
                          updateTree((n) => ({
                            classes: setGroupClass(n.classes, "height", e.target.value),
                          }))
                        }
                        className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 shadow-xs focus:outline-none cursor-pointer font-medium"
                      >
                        <option value="">auto</option>
                        <option value="h-full">100% (full)</option>
                        <option value="h-screen">100vh (screen)</option>
                        <option value="h-10">40px (10)</option>
                        <option value="h-12">48px (12)</option>
                        <option value="h-16">64px (16)</option>
                        <option value="h-24">96px (24)</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="custom e.g. 100px"
                      value={(() => {
                        const C = (selectedElement.classes || "").split(/\s+/).find((k) => k.startsWith("h-[") && k.endsWith("]"));
                        return C ? C.substring(3, C.length - 1).replace(/_/g, " ") : "";
                      })()}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        let R = (selectedElement.classes || "").split(/\s+/).filter(Boolean).filter((Q) => !Q.startsWith("h-["));
                        if (val) R.push(`h-[${val.replace(/\s+/g, "_")}]`);
                        updateTree((Q) => ({ classes: R.join(" ") }));
                      }}
                      className="w-full bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 shadow-xs focus:outline-none focus:border-rose-400 focus:bg-white font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Min/Max Sizing select configurations */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-sans">
                    Min Width
                  </label>
                  <div className="relative">
                    <select
                      value={getPrefixedClass(
                        selectedElement.classes,
                        "min-w-",
                      )}
                      onChange={(e) =>
                        updateTree((n) => ({
                          classes: setPrefixedClass(
                            n.classes,
                            "min-w-",
                            e.target.value,
                          ),
                        }))
                      }
                      className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                    >
                      <option value="">None (min-w-0)</option>
                      <option value="min-w-0">min-w-0</option>
                      <option value="min-w-[100px]">100px</option>
                      <option value="min-w-[200px]">200px</option>
                      <option value="min-w-[300px]">300px</option>
                      <option value="min-w-full">100% (min-w-full)</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-sans">
                    Max Width
                  </label>
                  <div className="relative">
                    <select
                      value={getPrefixedClass(
                        selectedElement.classes,
                        "max-w-",
                      )}
                      onChange={(e) =>
                        updateTree((n) => ({
                          classes: setPrefixedClass(
                            n.classes,
                            "max-w-",
                            e.target.value,
                          ),
                        }))
                      }
                      className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
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
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-sans">
                    Min Height
                  </label>
                  <div className="relative">
                    <select
                      value={getPrefixedClass(
                        selectedElement.classes,
                        "min-h-",
                      )}
                      onChange={(e) =>
                        updateTree((n) => ({
                          classes: setPrefixedClass(
                            n.classes,
                            "min-h-",
                            e.target.value,
                          ),
                        }))
                      }
                      className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                    >
                      <option value="">None (min-h-0)</option>
                      <option value="min-h-0">min-h-0</option>
                      <option value="min-h-[50px]">50px</option>
                      <option value="min-h-[100px]">100px</option>
                      <option value="min-h-[200px]">200px</option>
                      <option value="min-h-full">100% (min-h-full)</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-sans">
                    Max Height
                  </label>
                  <div className="relative">
                    <select
                      value={getPrefixedClass(
                        selectedElement.classes,
                        "max-h-",
                      )}
                      onChange={(e) =>
                        updateTree((n) => ({
                          classes: setPrefixedClass(
                            n.classes,
                            "max-h-",
                            e.target.value,
                          ),
                        }))
                      }
                      className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                    >
                      <option value="">None</option>
                      <option value="max-h-full">100% (max-h-full)</option>
                      <option value="max-h-[300px]">300px</option>
                      <option value="max-h-[500px]">500px</option>
                      <option value="max-h-screen">Screen height</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Box Sizing & Aspect Ratio */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-sans">
                    Box Sizing
                  </label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(
                        selectedElement.classes,
                        "boxSizing",
                      )}
                      onChange={(e) =>
                        updateTree((n) => ({
                          classes: setGroupClass(
                            n.classes,
                            "boxSizing",
                            e.target.value,
                          ),
                        }))
                      }
                      className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                    >
                      <option value="">Default (Border Box)</option>
                      <option value="box-border">box-border</option>
                      <option value="box-content">box-content</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1 font-sans">
                    Aspect Ratio
                  </label>
                  <div className="relative">
                    <select
                      value={getActiveGroupClass(
                        selectedElement.classes,
                        "aspectRatio",
                      )}
                      onChange={(e) =>
                        updateTree((n) => ({
                          classes: setGroupClass(
                            n.classes,
                            "aspectRatio",
                            e.target.value,
                          ),
                        }))
                      }
                      className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                    >
                      <option value="">Default (aspect-auto)</option>
                      <option value="aspect-auto">aspect-auto</option>
                      <option value="aspect-square">
                        Square (1:1 / aspect-square)
                      </option>
                      <option value="aspect-video">
                        Video (16:9 / aspect-video)
                      </option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
  );
}
