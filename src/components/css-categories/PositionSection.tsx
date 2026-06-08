import React, { useState } from "react";
import { Layers, HelpCircle, ChevronDown, Grid, Compass, Move, Anchor } from "lucide-react";
import { VisualElement } from "../../types";
import {
  setGroupClass,
  getActiveGroupClass,
  setPrefixedClass,
  getPrefixedClass,
  setColorClass,
} from "../../styleUtils";

interface PositionSectionProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
  handleCopy: (text: string) => void;
  copiedText: string | null;
}

export function PositionSection({ selectedElement, updateTree, handleCopy, copiedText }: PositionSectionProps) {

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Compass size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">
                CSS Positioning & Anchors
              </span>
            </div>

            {(() => {
              const parseArbitraryValue = (
                className: string,
                prefix: string,
              ): string => {
                if (!className) return "";
                const match = className.match(
                  new RegExp(
                    `(?:^|\\s)${prefix.replace(/[-\[\]()]/g, "\\$&")}\\[([^\\]]+)\\](?:$|\\s)`,
                  ),
                );
                if (match) return match[1].replace(/_/g, " ");
                const active = className
                  .split(/\s+/)
                  .find((c) => c.startsWith(prefix) && !c.includes("["));
                return active ? active.substring(prefix.length) : "";
              };

              const encodeArbitraryValue = (
                prefix: string,
                value: string,
              ): string => {
                if (!value || !value.trim()) return "";
                return `${prefix}[${value.trim().replace(/\s+/g, "_")}]`;
              };

              const updateArbitraryClass = (prefix: string, value: string) => {
                const currentTokens = selectedElement.classes
                  .split(/\s+/)
                  .filter(Boolean);
                let filtered = currentTokens.filter(
                  (token) => !token.startsWith(prefix),
                );
                if (value && value.trim()) {
                  filtered.push(encodeArbitraryValue(prefix, value));
                }
                updateTree((n) => ({ classes: filtered.join(" ") }));
              };

              const parseArbitraryProperty = (
                className: string,
                propName: string,
              ): string => {
                if (!className) return "";
                const match = className.match(
                  new RegExp(
                    `(?:^|\\s)\\[${propName.replace(/[-\[\]()]/g, "\\$&")}:([^\\]]+)\\](?:$|\\s)`,
                  ),
                );
                return match ? match[1] : "";
              };

              const updateArbitraryProperty = (
                propName: string,
                value: string,
              ) => {
                const currentTokens = selectedElement.classes
                  .split(/\s+/)
                  .filter(Boolean);
                let filtered = currentTokens.filter(
                  (token) => !token.startsWith(`[${propName}:`),
                );
                if (value && value.trim()) {
                  filtered.push(
                    `[${propName}:${value.trim().replace(/\s+/g, "_")}]`,
                  );
                }
                updateTree((n) => ({ classes: filtered.join(" ") }));
              };

              return (
                <div className="space-y-4">
                  {/* Category 1: Document Flow Position */}
                  <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3.5 shadow-sm">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <Move size={12} />
                      <span>Document Flow Position</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-0.5">
                        Scheme (position)
                      </label>
                      <div className="relative">
                        <select
                          value={getActiveGroupClass(
                            selectedElement.classes,
                            "position",
                          )}
                          onChange={(e) =>
                            updateTree((n) => ({
                              classes: setGroupClass(
                                n.classes,
                                "position",
                                e.target.value,
                              ),
                            }))
                          }
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs text-stone-700 font-medium focus:outline-none cursor-pointer"
                        >
                          <option value="">default (static)</option>
                          <option value="relative">relative</option>
                          <option value="absolute">absolute</option>
                          <option value="fixed">
                            fixed (viewport relative)
                          </option>
                          <option value="sticky">
                            sticky (scroll relative)
                          </option>
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* Coordinates Grid */}
                    <div className="grid grid-cols-2 gap-3.5 pt-1">
                      {["top", "right", "bottom", "left"].map((dir) => {
                        const prefix = `${dir}-`;
                        const currentVal = getPrefixedClass(
                          selectedElement.classes,
                          prefix,
                        );

                        return (
                          <div
                            key={dir}
                            className="flex flex-col gap-1.5 p-2 bg-white border border-stone-100 rounded-xl shadow-xs"
                          >
                            <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
                              {dir}
                            </label>

                            <div className="relative">
                              <select
                                value={currentVal}
                                onChange={(e) =>
                                  updateTree((n) => ({
                                    classes: setPrefixedClass(
                                      n.classes,
                                      prefix,
                                      e.target.value,
                                    ),
                                  }))
                                }
                                className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg pl-2 pr-6 py-1 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                              >
                                <option value="">Auto</option>
                                <option value={`${prefix}0`}>0px</option>
                                <option value={`${prefix}1`}>
                                  4px (0.25rem)
                                </option>
                                <option value={`${prefix}2`}>
                                  8px (0.5rem)
                                </option>
                                <option value={`${prefix}4`}>
                                  16px (1rem)
                                </option>
                                <option value={`${prefix}8`}>
                                  32px (2rem)
                                </option>
                                <option value={`${prefix}auto`}>auto</option>
                                <option value={`-${prefix}2`}>
                                  -8px (-0.5rem)
                                </option>
                                <option value={`-${prefix}4`}>
                                  -16px (-1rem)
                                </option>
                              </select>
                              <ChevronDown
                                size={12}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                              />
                            </div>

                            <input
                              type="text"
                              placeholder="e.g. 50% or 100vh"
                              value={parseArbitraryValue(
                                selectedElement.classes,
                                prefix,
                              )}
                              onChange={(e) =>
                                updateArbitraryClass(prefix, e.target.value)
                              }
                              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-[11px] text-stone-700 focus:outline-none focus:bg-white placeholder-stone-400 font-mono"
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Shorthand Inset */}
                    <div className="flex flex-col gap-1.5 p-2 bg-white border border-stone-100 rounded-xl shadow-xs">
                      <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-0.5 font-mono">
                        inset (all sides)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <select
                            value={getPrefixedClass(
                              selectedElement.classes,
                              "inset-",
                            )}
                            onChange={(e) =>
                              updateTree((n) => ({
                                classes: setPrefixedClass(
                                  n.classes,
                                  "inset-",
                                  e.target.value,
                                ),
                              }))
                            }
                            className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg pl-2 pr-6 py-1.5 text-xs text-stone-700 cursor-pointer focus:outline-none font-medium"
                          >
                            <option value="">Auto (none)</option>
                            <option value="inset-0">0px (inset-0)</option>
                            <option value="inset-2">8px (inset-2)</option>
                            <option value="inset-4">16px (inset-4)</option>
                            <option value="inset-auto">inset-auto</option>
                          </select>
                          <ChevronDown
                            size={12}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. 10px or 5%"
                          value={parseArbitraryValue(
                            selectedElement.classes,
                            "inset-",
                          )}
                          onChange={(e) =>
                            updateArbitraryClass("inset-", e.target.value)
                          }
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white placeholder-stone-400 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category 2: Logical Document Flow Position (Writing-Mode Agnostic) */}
                  <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3.5 shadow-sm">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <Compass size={12} />
                      <span>Logical Direction offsets</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {/* Inset Block */}
                      <div className="p-2.5 bg-white border border-stone-100 rounded-xl space-y-2">
                        <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">
                          inset-block (vertical inline equivalent)
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="block start/end"
                            value={parseArbitraryValue(
                              selectedElement.classes,
                              "inset-block-",
                            )}
                            onChange={(e) =>
                              updateArbitraryClass(
                                "inset-block-",
                                e.target.value,
                              )
                            }
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                          <input
                            type="text"
                            placeholder="block-start (top)"
                            value={parseArbitraryValue(
                              selectedElement.classes,
                              "inset-block-start-",
                            )}
                            onChange={(e) =>
                              updateArbitraryClass(
                                "inset-block-start-",
                                e.target.value,
                              )
                            }
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>

                      {/* Inset Inline */}
                      <div className="p-2.5 bg-white border border-stone-100 rounded-xl space-y-2">
                        <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">
                          inset-inline (horizontal inline equivalent)
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="inline start/end"
                            value={parseArbitraryValue(
                              selectedElement.classes,
                              "inset-inline-",
                            )}
                            onChange={(e) =>
                              updateArbitraryClass(
                                "inset-inline-",
                                e.target.value,
                              )
                            }
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                          <input
                            type="text"
                            placeholder="inline-start (left)"
                            value={parseArbitraryValue(
                              selectedElement.classes,
                              "inset-inline-start-",
                            )}
                            onChange={(e) =>
                              updateArbitraryClass(
                                "inset-inline-start-",
                                e.target.value,
                              )
                            }
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category 3: Stack Order */}
                  <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3 shadow-sm">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <Layers size={12} />
                      <span>Stack Order</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <select
                          value={getPrefixedClass(
                            selectedElement.classes,
                            "z-",
                          )}
                          onChange={(e) =>
                            updateTree((n) => ({
                              classes: setPrefixedClass(
                                n.classes,
                                "z-",
                                e.target.value,
                              ),
                            }))
                          }
                          className="w-full appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg pl-3 pr-8 py-2 text-xs text-stone-700 focus:outline-none cursor-pointer font-medium"
                        >
                          <option value="">auto</option>
                          <option value="z-0">z-0 (base)</option>
                          <option value="z-10">z-10 (header/nav)</option>
                          <option value="z-20">z-20 (dropdown)</option>
                          <option value="z-30">z-30 (sticky)</option>
                          <option value="z-40">z-40 (drawer)</option>
                          <option value="z-50">z-50 (modal/tooltip)</option>
                          <option value="z-auto">z-auto</option>
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="custom index e.g. 9999"
                        value={parseArbitraryValue(
                          selectedElement.classes,
                          "z-",
                        )}
                        onChange={(e) =>
                          updateArbitraryClass("z-", e.target.value)
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Category 4: Anchor Definition & Attachment */}
                  <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3.5 shadow-sm">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <Anchor size={12} />
                      <span>CSS Anchor Positioning</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-0.5">
                          anchor-name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. --tooltip-trigger"
                          value={parseArbitraryProperty(
                            selectedElement.classes,
                            "anchor-name",
                          )}
                          onChange={(e) =>
                            updateArbitraryProperty(
                              "anchor-name",
                              e.target.value,
                            )
                          }
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-0.5">
                          position-anchor
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. --tooltip-trigger"
                          value={parseArbitraryProperty(
                            selectedElement.classes,
                            "position-anchor",
                          )}
                          onChange={(e) =>
                            updateArbitraryProperty(
                              "position-anchor",
                              e.target.value,
                            )
                          }
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category 5 & 6: Advanced Anchor Area & Try Fallbacks */}
                  <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-3.5 space-y-3.5 shadow-sm">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <HelpCircle size={12} />
                      <span>Fallback & Area Controls</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-0.5">
                          position-area
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. top left, center right"
                          value={parseArbitraryProperty(
                            selectedElement.classes,
                            "position-area",
                          )}
                          onChange={(e) =>
                            updateArbitraryProperty(
                              "position-area",
                              e.target.value,
                            )
                          }
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-0.5">
                          position-try-fallbacks
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. flip-block, flip-inline"
                          value={parseArbitraryProperty(
                            selectedElement.classes,
                            "position-try-fallbacks",
                          )}
                          onChange={(e) =>
                            updateArbitraryProperty(
                              "position-try-fallbacks",
                              e.target.value,
                            )
                          }
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10.5px] text-stone-500 font-semibold uppercase tracking-wider pl-0.5">
                            try-order
                          </label>
                          <input
                            type="text"
                            placeholder="most-width"
                            value={parseArbitraryProperty(
                              selectedElement.classes,
                              "position-try-order",
                            )}
                            onChange={(e) =>
                              updateArbitraryProperty(
                                "position-try-order",
                                e.target.value,
                              )
                            }
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10.5px] text-stone-500 font-semibold uppercase tracking-wider pl-0.5">
                            visibility
                          </label>
                          <input
                            type="text"
                            placeholder="anchors-visible"
                            value={parseArbitraryProperty(
                              selectedElement.classes,
                              "position-visibility",
                            )}
                            onChange={(e) =>
                              updateArbitraryProperty(
                                "position-visibility",
                                e.target.value,
                              )
                            }
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-700 focus:outline-none focus:bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
  );
}
