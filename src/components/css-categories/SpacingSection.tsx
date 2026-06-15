import React, { useState } from "react";
import { Settings, ChevronDown, Move } from "lucide-react";
import { VisualElement } from "../../types";
import {
  setGroupClass,
  getActiveGroupClass,
  setPrefixedClass,
  getPrefixedClass,
  setColorClass,
} from "../../styleUtils";

interface SpacingSectionProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
  handleCopy: (text: string) => void;
  copiedText: string | null;
}

export function SpacingSection({ selectedElement, updateTree, handleCopy, copiedText }: SpacingSectionProps) {

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Move size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">
                Spacing Settings
              </span>
            </div>

            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1">
                <Move size={11} />
                <span>Margin & Padding Controls</span>
              </div>

              {/* Spacing Controls: Margin & Padding */}
              <div className="space-y-3 pt-1">
                <div className="p-3 bg-white border border-stone-200/50 rounded-xl space-y-3">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block font-sans">
                    Padding (Inside Spacing)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1 col-span-2">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">
                        All sides padding global
                      </label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(
                            selectedElement.classes,
                            "p-",
                          )}
                          onChange={(e) => {
                            let updated = selectedElement.classes
                              .replace(/\b(pt|pr|pb|pl|px|py)-\w+\b/g, "")
                              .replace(/\s+/g, " ")
                              .trim();
                            updateTree(() => ({
                              classes: setPrefixedClass(
                                updated,
                                "p-",
                                e.target.value,
                              ),
                            }));
                          }}
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">None (p-0)</option>
                          {[
                            0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 48,
                            64,
                          ].map((v) => (
                            <option key={v} value={`p-${v}`}>
                              p-{v} ({v * 4}px)
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">
                        Top side
                      </label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(
                            selectedElement.classes,
                            "pt-",
                          )}
                          onChange={(e) =>
                            updateTree((n) => ({
                              classes: setPrefixedClass(
                                n.classes,
                                "pt-",
                                e.target.value,
                              ),
                            }))
                          }
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-7 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">Inherited</option>
                          {[0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map(
                            (v) => (
                              <option key={v} value={`pt-${v}`}>
                                pt-{v} ({v * 4}px)
                              </option>
                            ),
                          )}
                        </select>
                        <ChevronDown
                          size={13}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">
                        Right side
                      </label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(
                            selectedElement.classes,
                            "pr-",
                          )}
                          onChange={(e) =>
                            updateTree((n) => ({
                              classes: setPrefixedClass(
                                n.classes,
                                "pr-",
                                e.target.value,
                              ),
                            }))
                          }
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-7 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">Inherited</option>
                          {[0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map(
                            (v) => (
                              <option key={v} value={`pr-${v}`}>
                                pr-{v} ({v * 4}px)
                              </option>
                            ),
                          )}
                        </select>
                        <ChevronDown
                          size={13}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">
                        Bottom side
                      </label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(
                            selectedElement.classes,
                            "pb-",
                          )}
                          onChange={(e) =>
                            updateTree((n) => ({
                              classes: setPrefixedClass(
                                n.classes,
                                "pb-",
                                e.target.value,
                              ),
                            }))
                          }
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-7 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">Inherited</option>
                          {[0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map(
                            (v) => (
                              <option key={v} value={`pb-${v}`}>
                                pb-{v} ({v * 4}px)
                              </option>
                            ),
                          )}
                        </select>
                        <ChevronDown
                          size={13}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">
                        Left side
                      </label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(
                            selectedElement.classes,
                            "pl-",
                          )}
                          onChange={(e) =>
                            updateTree((n) => ({
                              classes: setPrefixedClass(
                                n.classes,
                                "pl-",
                                e.target.value,
                              ),
                            }))
                          }
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-7 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">Inherited</option>
                          {[0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map(
                            (v) => (
                              <option key={v} value={`pl-${v}`}>
                                pl-{v} ({v * 4}px)
                              </option>
                            ),
                          )}
                        </select>
                        <ChevronDown
                          size={13}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white border border-stone-200/50 rounded-xl space-y-3">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block font-sans">
                    Margin (Outside Spacing)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1 col-span-2">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">
                        All sides margin global
                      </label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(
                            selectedElement.classes,
                            "m-",
                          )}
                          onChange={(e) => {
                            let updated = selectedElement.classes
                              .replace(/\b(mt|mr|mb|ml|mx|my)-\w+\b/g, "")
                              .replace(/\s+/g, " ")
                              .trim();
                            updateTree(() => ({
                              classes: setPrefixedClass(
                                updated,
                                "m-",
                                e.target.value,
                              ),
                            }));
                          }}
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">None (m-0)</option>
                          {[
                            0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 48,
                            64,
                          ].map((v) => (
                            <option key={v} value={`m-${v}`}>
                              m-{v} ({v * 4}px)
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">
                        Top side
                      </label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(
                            selectedElement.classes,
                            "mt-",
                          )}
                          onChange={(e) =>
                            updateTree((n) => ({
                              classes: setPrefixedClass(
                                n.classes,
                                "mt-",
                                e.target.value,
                              ),
                            }))
                          }
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-7 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">Inherited</option>
                          {[0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map(
                            (v) => (
                              <option key={v} value={`mt-${v}`}>
                                mt-{v} ({v * 4}px)
                              </option>
                            ),
                          )}
                        </select>
                        <ChevronDown
                          size={13}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">
                        Right side
                      </label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(
                            selectedElement.classes,
                            "mr-",
                          )}
                          onChange={(e) =>
                            updateTree((n) => ({
                              classes: setPrefixedClass(
                                n.classes,
                                "mr-",
                                e.target.value,
                              ),
                            }))
                          }
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-7 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">Inherited</option>
                          {[0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map(
                            (v) => (
                              <option key={v} value={`mr-${v}`}>
                                mr-{v} ({v * 4}px)
                              </option>
                            ),
                          )}
                        </select>
                        <ChevronDown
                          size={13}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">
                        Bottom side
                      </label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(
                            selectedElement.classes,
                            "mb-",
                          )}
                          onChange={(e) =>
                            updateTree((n) => ({
                              classes: setPrefixedClass(
                                n.classes,
                                "mb-",
                                e.target.value,
                              ),
                            }))
                          }
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-7 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">Inherited</option>
                          {[0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map(
                            (v) => (
                              <option key={v} value={`mb-${v}`}>
                                mb-{v} ({v * 4}px)
                              </option>
                            ),
                          )}
                        </select>
                        <ChevronDown
                          size={13}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider font-mono">
                        Left side
                      </label>
                      <div className="relative">
                        <select
                          value={getPrefixedClass(
                            selectedElement.classes,
                            "ml-",
                          )}
                          onChange={(e) =>
                            updateTree((n) => ({
                              classes: setPrefixedClass(
                                n.classes,
                                "ml-",
                                e.target.value,
                              ),
                            }))
                          }
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-7 py-2 text-xs text-stone-700 cursor-pointer shadow-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 font-medium"
                        >
                          <option value="">Inherited</option>
                          {[0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map(
                            (v) => (
                              <option key={v} value={`ml-${v}`}>
                                ml-{v} ({v * 4}px)
                              </option>
                            ),
                          )}
                        </select>
                        <ChevronDown
                          size={13}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  );
}
