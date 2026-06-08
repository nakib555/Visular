import React, { useState } from "react";
import { Palette, HelpCircle, ChevronDown, Image } from "lucide-react";
import { VisualElement } from "../../types";
import {
  setGroupClass,
  getActiveGroupClass,
  setPrefixedClass,
  getPrefixedClass,
  setColorClass,
} from "../../styleUtils";

interface VisualsSectionProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
  handleCopy: (text: string) => void;
  copiedText: string | null;
}

export function VisualsSection({ selectedElement, updateTree, handleCopy, copiedText }: VisualsSectionProps) {
  const [appearanceSubCategory, setAppearanceSubCategory] = useState<"colors" | "backgrounds" | "borders" | "blending">("colors");

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Palette size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">
                Appearance & Styles
              </span>
            </div>

            {/* Sub-Category Pills Navigation */}
            <div className="flex bg-stone-100/80 p-1 rounded-xl gap-1">
              {(["colors", "backgrounds", "borders", "blending"] as const).map(
                (sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setAppearanceSubCategory(sub)}
                    className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
                      appearanceSubCategory === sub
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

              const appearanceFields = {
                colors: [
                  {
                    prop: "color",
                    label: "Text Color (color)",
                    placeholder: "e.g. red, #ff0000, oklch(0.6 0.25 120)",
                    presets: [
                      "transparent",
                      "currentcolor",
                      "CanvasText",
                      "LinkText",
                      "#000000",
                      "#ffffff",
                      "#ef4444",
                      "#3b82f6",
                      "#10b981",
                      "#f59e0b",
                    ],
                  },
                  {
                    prop: "opacity",
                    label: "Opacity (opacity)",
                    placeholder: "e.g. 1, 0.5, 30%",
                    presets: [
                      "0",
                      "0.1",
                      "0.25",
                      "0.5",
                      "0.75",
                      "0.9",
                      "1",
                      "50%",
                      "100%",
                    ],
                  },
                ],
                backgrounds: [
                  {
                    prop: "background-color",
                    label: "Background Color (background-color)",
                    placeholder: "e.g. transparent, white, rgba(0,0,0,0.5)",
                    presets: [
                      "transparent",
                      "#ffffff",
                      "#f5f5f4",
                      "#1c1917",
                      "#ef4444",
                      "#3b82f6",
                      "#10b981",
                      "#f59e0b",
                    ],
                  },
                  {
                    prop: "background-image",
                    label: "Background Image (background-image)",
                    placeholder:
                      "e.g. url('pattern.png'), linear-gradient(...)",
                    presets: [
                      "none",
                      "linear-gradient(45deg, #f43f5e, #fbbf24)",
                      "radial-gradient(circle, #3b82f6, transparent)",
                    ],
                  },
                  {
                    prop: "background-size",
                    label: "Background Size (background-size)",
                    placeholder: "e.g. cover, contain, auto, 100px 100px",
                    presets: ["auto", "cover", "contain"],
                  },
                  {
                    prop: "background-position",
                    label: "Background Position (background-position)",
                    placeholder: "e.g. center, top left, 50% 50%",
                    presets: [
                      "center",
                      "top",
                      "bottom",
                      "left",
                      "right",
                      "top left",
                      "bottom right",
                    ],
                  },
                  {
                    prop: "background-repeat",
                    label: "Background Repeat (background-repeat)",
                    placeholder: "e.g. repeat, no-repeat, space",
                    presets: [
                      "repeat",
                      "no-repeat",
                      "repeat-x",
                      "repeat-y",
                      "space",
                      "round",
                    ],
                  },
                  {
                    prop: "background-attachment",
                    label: "Background Attachment (background-attachment)",
                    placeholder: "e.g. scroll, fixed, local",
                    presets: ["scroll", "fixed", "local"],
                  },
                  {
                    prop: "background-origin",
                    label: "Background Origin (background-origin)",
                    placeholder: "e.g. padding-box, border-box",
                    presets: ["padding-box", "border-box", "content-box"],
                  },
                  {
                    prop: "background-clip",
                    label: "Background Clip (background-clip)",
                    placeholder: "e.g. border-box, padding-box, text",
                    presets: [
                      "border-box",
                      "padding-box",
                      "content-box",
                      "text",
                    ],
                  },
                  {
                    prop: "background",
                    label: "Background Shorthand (background)",
                    placeholder: "e.g. no-repeat center/cover url('bg.jpg')",
                    presets: [],
                  },
                ],
                borders: [
                  {
                    prop: "border",
                    label: "Border Shorthand (border)",
                    placeholder: "e.g. 1px solid #e5e7eb, 2px dashed red",
                    presets: [
                      "none",
                      "1px solid #e5e7eb",
                      "2px solid currentcolor",
                      "2px dashed #9ca3af",
                    ],
                  },
                  {
                    prop: "border-radius",
                    label: "Border Radius (border-radius)",
                    placeholder: "e.g. 0px, 8px, 1rem, 50%",
                    presets: [
                      "0px",
                      "4px",
                      "8px",
                      "12px",
                      "16px",
                      "24px",
                      "9999px",
                      "50%",
                    ],
                  },
                  {
                    prop: "border-top",
                    label: "Border Top (border-top)",
                    placeholder: "e.g. 2px solid red",
                    presets: ["none", "1px solid #e5e7eb"],
                  },
                  {
                    prop: "border-right",
                    label: "Border Right (border-right)",
                    placeholder: "e.g. 2px solid red",
                    presets: ["none", "1px solid #e5e7eb"],
                  },
                  {
                    prop: "border-bottom",
                    label: "Border Bottom (border-bottom)",
                    placeholder: "e.g. 2px solid red",
                    presets: ["none", "1px solid #e5e7eb"],
                  },
                  {
                    prop: "border-left",
                    label: "Border Left (border-left)",
                    placeholder: "e.g. 2px solid red",
                    presets: ["none", "1px solid #e5e7eb"],
                  },
                  {
                    prop: "border-width",
                    label: "Border Width (border-width)",
                    placeholder: "e.g. 1px, 2px, 0.25rem",
                    presets: ["0px", "1px", "2px", "4px", "8px"],
                  },
                  {
                    prop: "border-style",
                    label: "Border Style (border-style)",
                    placeholder: "e.g. solid, dashed, none",
                    presets: [
                      "none",
                      "solid",
                      "dashed",
                      "dotted",
                      "double",
                      "groove",
                      "ridge",
                      "inset",
                      "outset",
                    ],
                  },
                  {
                    prop: "border-color",
                    label: "Border Color (border-color)",
                    placeholder: "e.g. red, #000, currentcolor",
                    presets: [
                      "transparent",
                      "currentcolor",
                      "#e5e7eb",
                      "#ef4444",
                      "#3b82f6",
                    ],
                  },
                  {
                    prop: "border-image-source",
                    label: "Border Image Source (border-image-source)",
                    placeholder: "e.g. url('border.png'), linear-gradient(...)",
                    presets: ["none"],
                  },
                  {
                    prop: "border-image-slice",
                    label: "Border Image Slice (border-image-slice)",
                    placeholder: "e.g. 30, 30% fill",
                    presets: ["100%"],
                  },
                ],
                blending: [
                  {
                    prop: "mix-blend-mode",
                    label: "Mix Blend Mode (mix-blend-mode)",
                    placeholder: "e.g. normal, multiply, screen",
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
                      "hue",
                      "saturation",
                      "color",
                      "luminosity",
                    ],
                  },
                  {
                    prop: "background-blend-mode",
                    label: "Background Blend Mode",
                    placeholder: "e.g. normal, multiply, screen",
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

              const fields = appearanceFields[appearanceSubCategory] || [];

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
                        <strong>Transparency:</strong> Standard `opacity`
                        directly influences both background fill and nested
                        content. For separate background alpha, prefer advanced
                        color models (`rgba()`, `hsla()`, `oklch()`).
                      </li>
                      <li>
                        <strong>Border Outlines:</strong> Setting a container
                        border width relies on both a border style
                        (`solid`/`dashed`) and proper border colors, or a
                        comprehensive shorthand config to become visible.
                      </li>
                      <li>
                        <strong>Blend Modes:</strong> Elements using
                        `mix-blend-mode` blend matching regions with parent
                        content layers. Use `background-blend-mode` specifically
                        for blending layered background configurations.
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
  );
}
