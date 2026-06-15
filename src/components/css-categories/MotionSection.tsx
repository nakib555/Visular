import React, { useState } from "react";
import { Play, HelpCircle, ChevronDown, Box } from "lucide-react";
import { VisualElement } from "../../types";
import {
  setGroupClass,
  getActiveGroupClass,
  setPrefixedClass,
  getPrefixedClass,
  setColorClass,
} from "../../styleUtils";

interface MotionSectionProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
  handleCopy: (text: string) => void;
  copiedText: string | null;
}

export function MotionSection({ selectedElement, updateTree, handleCopy, copiedText }: MotionSectionProps) {
  const [effectsSubCategory, setEffectsSubCategory] = useState<"shadows" | "filters" | "masking" | "transparency">("shadows");

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Play size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">
                Effects & Filters
              </span>
            </div>

            {/* Sub-Category Pills Navigation */}
            <div className="flex bg-stone-100/80 p-1 rounded-xl gap-1">
              {(["shadows", "filters", "masking", "transparency"] as const).map(
                (sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setEffectsSubCategory(sub)}
                    className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
                      effectsSubCategory === sub
                        ? "text-rose-700 bg-white shadow-sm"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    {sub}
                  </button>
                ),
              )}
            </div>

            {(() => {
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
                return match ? match[1].replace(/_/g, " ") : "";
              };

              const getPropValue = (propName: string): string => {
                const arb = parseArbitraryProperty(
                  selectedElement?.classes || "",
                  propName,
                );
                return arb;
              };

              const setPropValue = (propName: string, value: string) => {
                const currentTokens = (selectedElement?.classes || "")
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

              const effectsFields = {
                shadows: [
                  {
                    prop: "box-shadow",
                    label: "Box Shadow (box-shadow)",
                    placeholder:
                      "e.g. 0 4px 6px rgba(0,0,0,0.1), inset 0 2px 4px rgba(0,0,0,0.2)",
                    presets: [
                      "none",
                      "0 1px 3px rgba(0,0,0,0.12)",
                      "0 4px 6px rgba(0,0,0,0.1)",
                      "0 10px 15px rgba(0,0,0,0.1)",
                      "0 20px 25px rgba(0,0,0,0.15)",
                      "inset 0 2px 4px rgba(0,0,0,0.06)",
                    ],
                  },
                  {
                    prop: "text-shadow",
                    label: "Text Shadow (text-shadow)",
                    placeholder:
                      "e.g. 1px 1px 2px rgba(0,0,0,0.2), 0 0 8px #f43f5e",
                    presets: [
                      "none",
                      "1px 1px 2px rgba(0,0,0,0.15)",
                      "2px 2px 4px rgba(0,0,0,0.3)",
                      "0 0 8px rgba(239,68,68,0.8)",
                      "0 0 12px rgba(59,130,246,0.8)",
                    ],
                  },
                ],
                filters: [
                  {
                    prop: "filter",
                    label: "Graphical Filter (filter)",
                    placeholder: "e.g. blur(4px) contrast(1.2) grayscale(100%)",
                    presets: [
                      "none",
                      "blur(4px)",
                      "grayscale(100%)",
                      "sepia(100%)",
                      "brightness(150%)",
                      "contrast(150%)",
                      "hue-rotate(90deg)",
                      "invert(100%)",
                    ],
                  },
                  {
                    prop: "backdrop-filter",
                    label: "Backdrop Filter (backdrop-filter)",
                    placeholder: "e.g. blur(10px) brightness(95%)",
                    presets: [
                      "none",
                      "blur(4px)",
                      "blur(8px)",
                      "blur(12px) brightness(90%)",
                      "grayscale(50%)",
                      "contrast(120%)",
                    ],
                  },
                ],
                masking: [
                  {
                    prop: "clip-path",
                    label: "Clip Path Polygon/Shape (clip-path)",
                    placeholder:
                      "e.g. circle(50% at center), polygon(50% 0%, 100% 100%, 0% 100%)",
                    presets: [
                      "none",
                      "circle(50% at center)",
                      "ellipse(50% 30% at center)",
                      "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
                      "polygon(50% 0%, 100% 100%, 0% 100%)",
                      "inset(10% 20% round 8px)",
                    ],
                  },
                ],
                transparency: [
                  {
                    prop: "opacity",
                    label: "Opacity (opacity)",
                    placeholder: "e.g. 1, 0.5, 30%",
                    presets: ["0", "0.1", "0.25", "0.5", "0.75", "1"],
                  },
                  {
                    prop: "mix-blend-mode",
                    label: "Mix Blend Mode (mix-blend-mode)",
                    placeholder: "normal, multiply, screen, overlay",
                    presets: [
                      "normal",
                      "multiply",
                      "screen",
                      "overlay",
                      "darken",
                      "lighten",
                      "color-dodge",
                      "color-burn",
                      "hard-light",
                      "soft-light",
                      "difference",
                      "exclusion",
                    ],
                  },
                  {
                    prop: "background-blend-mode",
                    label: "Background Blend Mode",
                    placeholder: "normal, multiply, screen, overlay",
                    presets: [
                      "normal",
                      "multiply",
                      "screen",
                      "overlay",
                      "darken",
                      "lighten",
                      "color-dodge",
                      "color-burn",
                      "hard-light",
                      "soft-light",
                      "difference",
                      "exclusion",
                    ],
                  },
                ],
              };

              const fields = effectsFields[effectsSubCategory] || [];

              return (
                <div className="space-y-4">
                  {fields.map((field) => {
                    const currentVal = getPropValue(field.prop);
                    return (
                      <div
                        key={field.prop}
                        className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 shadow-sm space-y-2"
                      >
                        <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-1">
                          {field.label}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={currentVal}
                            placeholder={field.placeholder}
                            onChange={(e) =>
                              setPropValue(field.prop, e.target.value)
                            }
                            className="flex-1 min-w-0 bg-white border border-stone-200/85 rounded-xl px-3 py-2 text-xs text-stone-700 placeholder:text-stone-300 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 shadow-sm"
                          />
                          {field.presets.length > 0 && (
                            <div className="relative shrink-0">
                              <select
                                value={
                                  field.presets.includes(currentVal)
                                    ? currentVal
                                    : ""
                                }
                                onChange={(e) => {
                                  if (e.target.value !== "") {
                                    setPropValue(field.prop, e.target.value);
                                  }
                                }}
                                className="appearance-none bg-stone-100 hover:bg-stone-200/70 border border-stone-200 text-stone-600 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold cursor-pointer focus:outline-none"
                              >
                                <option value="">Presets</option>
                                {field.presets.map((p) => (
                                  <option key={p} value={p}>
                                    {p}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                                <ChevronDown size={13} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Interlinks and Dependencies Card */}
                  <div className="bg-rose-50/40 border border-rose-100/60 rounded-2xl p-4 mt-6">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-rose-700 font-mono flex items-center gap-1.5 mb-2.5">
                      <HelpCircle size={12} />
                      <span>Interlinks & Dependencies</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-rose-950 font-medium list-disc list-outside pl-4 leading-relaxed">
                      <li>
                        <strong>Backdrop filters:</strong> Demand high
                        transparency levels on background colors
                        (`background-color: transparent` or alpha transparency
                        values) of parent overlays to let background-blur
                        effects shine through beautifully.
                      </li>
                      <li>
                        <strong>Clips & Shadows:</strong> Complex clipping
                        boundaries cut off elements exterior shadow layers
                        (`box-shadow`). In such cases, use layered element
                        nesting to carry shadow definitions on the container
                        separately.
                      </li>
                      <li>
                        <strong>Compound Filters:</strong> Chaining multiple
                        custom entries like `blur()` and `contrast()`
                        simultaneously within arbitrary filter configurations
                        demands strict space-delimited styling strings to parse
                        properly on high-performance render engines.
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
  );
}
