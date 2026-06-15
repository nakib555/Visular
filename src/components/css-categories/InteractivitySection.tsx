import React, { useState } from "react";
import { HelpCircle, ChevronDown, MousePointer, Pointer } from "lucide-react";
import { VisualElement } from "../../types";
import { SegmentedControl, SEGMENTED_FIELDS } from "../InspectorPanel";
import {
  setGroupClass,
  getActiveGroupClass,
  setPrefixedClass,
  getPrefixedClass,
  setColorClass,
} from "../../styleUtils";

interface InteractivitySectionProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
  handleCopy: (text: string) => void;
  copiedText: string | null;
}

export function InteractivitySection({ selectedElement, updateTree, handleCopy, copiedText }: InteractivitySectionProps) {
  const [interactivitySubCategory, setInteractivitySubCategory] = useState<"mouse" | "user" | "scrollControl" | "containerSnap" | "itemSnap" | "touch">("mouse");

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <MousePointer size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">
                Interactivity & Scrolling
              </span>
            </div>

            {/* Sub-Category Pills Navigation */}
            <div className="flex bg-stone-100/80 p-1 rounded-xl gap-1 overflow-x-auto scrollbar-hide">
              {[
                { id: "mouse", label: "Mouse Controls" },
                { id: "user", label: "User Actions" },
                { id: "scrollControl", label: "Scroll & Overflow" },
                { id: "containerSnap", label: "Snap (Container)" },
                { id: "itemSnap", label: "Snap (Item)" },
                { id: "touch", label: "Touch & Perf" },
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setInteractivitySubCategory(sub.id as any)}
                  className={`flex-1 py-1.5 px-2.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    interactivitySubCategory === sub.id
                      ? "text-rose-700 bg-white shadow-sm"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
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
                return parseArbitraryProperty(
                  selectedElement?.classes || "",
                  propName,
                );
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

              const interactivityFields = {
                mouse: [
                  {
                    prop: "cursor",
                    label: "Mouse Cursor Style (cursor)",
                    placeholder:
                      "e.g. pointer, grab, url('custom.svg') 10 10, auto",
                    presets: [
                      "auto",
                      "default",
                      "none",
                      "context-menu",
                      "help",
                      "pointer",
                      "progress",
                      "wait",
                      "cell",
                      "crosshair",
                      "text",
                      "vertical-text",
                      "alias",
                      "copy",
                      "move",
                      "no-drop",
                      "not-allowed",
                      "grab",
                      "grabbing",
                      "all-scroll",
                      "col-resize",
                      "row-resize",
                      "n-resize",
                      "e-resize",
                      "s-resize",
                      "w-resize",
                      "ne-resize",
                      "nw-resize",
                      "se-resize",
                      "sw-resize",
                      "ew-resize",
                      "ns-resize",
                      "nesw-resize",
                      "nwse-resize",
                      "zoom-in",
                      "zoom-out",
                    ],
                  },
                  {
                    prop: "pointer-events",
                    label: "Pointer Interaction Mode (pointer-events)",
                    placeholder: "e.g. auto, none",
                    presets: [
                      "auto",
                      "none",
                      "visiblePainted",
                      "visibleFill",
                      "visibleStroke",
                      "visible",
                      "painted",
                      "fill",
                      "stroke",
                      "all",
                    ],
                  },
                ],
                user: [
                  {
                    prop: "user-select",
                    label: "Text Selection Control (user-select)",
                    placeholder: "e.g. none, auto, text",
                    presets: ["none", "auto", "text", "all", "contain"],
                  },
                  {
                    prop: "resize",
                    label: "Element Resize Handle (resize)",
                    placeholder: "e.g. both, horizontal",
                    presets: [
                      "none",
                      "both",
                      "horizontal",
                      "vertical",
                      "block",
                      "inline",
                    ],
                  },
                ],
                scrollControl: [
                  {
                    prop: "overflow",
                    label: "Overflow Mechanics (overflow)",
                    placeholder: "e.g. visible, hidden, scroll, auto, clip",
                    presets: [
                      "visible",
                      "hidden",
                      "scroll",
                      "auto",
                      "clip",
                      "hidden_auto",
                    ],
                  },
                  {
                    prop: "overflow-x",
                    label: "Horizontal Overflow (overflow-x)",
                    placeholder: "e.g. auto, scroll, hidden",
                    presets: ["visible", "hidden", "scroll", "auto", "clip"],
                  },
                  {
                    prop: "overflow-y",
                    label: "Vertical Overflow (overflow-y)",
                    placeholder: "e.g. auto, scroll, hidden",
                    presets: ["visible", "hidden", "scroll", "auto", "clip"],
                  },
                  {
                    prop: "overflow-inline",
                    label: "Inline Overflow (overflow-inline)",
                    placeholder: "e.g. auto, hidden",
                    presets: ["visible", "hidden", "scroll", "auto", "clip"],
                  },
                  {
                    prop: "overflow-block",
                    label: "Block Overflow (overflow-block)",
                    placeholder: "e.g. auto, hidden",
                    presets: ["visible", "hidden", "scroll", "auto", "clip"],
                  },
                  {
                    prop: "scroll-behavior",
                    label: "Scrolling Interpolation (scroll-behavior)",
                    placeholder: "e.g. smooth, auto",
                    presets: ["auto", "smooth"],
                  },
                  {
                    prop: "overscroll-behavior",
                    label: "Overscroll Boundary Chaining (overscroll-behavior)",
                    placeholder: "e.g. auto, contain, none",
                    presets: ["auto", "contain", "none", "contain_none"],
                  },
                  {
                    prop: "overscroll-behavior-x",
                    label: "Overscroll Behavior X (overscroll-behavior-x)",
                    placeholder: "e.g. auto, contain, none",
                    presets: ["auto", "contain", "none"],
                  },
                  {
                    prop: "overscroll-behavior-y",
                    label: "Overscroll Behavior Y (overscroll-behavior-y)",
                    placeholder: "e.g. auto, contain, none",
                    presets: ["auto", "contain", "none"],
                  },
                  {
                    prop: "overscroll-behavior-inline",
                    label:
                      "Overscroll Behavior Inline (overscroll-behavior-inline)",
                    placeholder: "e.g. auto, contain, none",
                    presets: ["auto", "contain", "none"],
                  },
                  {
                    prop: "overscroll-behavior-block",
                    label:
                      "Overscroll Behavior Block (overscroll-behavior-block)",
                    placeholder: "e.g. auto, contain, none",
                    presets: ["auto", "contain", "none"],
                  },
                ],
                containerSnap: [
                  {
                    prop: "scroll-snap-type",
                    label: "Scroll Snap Definition (scroll-snap-type)",
                    placeholder:
                      "e.g. x mandatory, y proximity, both mandatory",
                    presets: [
                      "none",
                      "x",
                      "y",
                      "block",
                      "inline",
                      "both",
                      "x mandatory",
                      "y proximity",
                      "both mandatory",
                      "block proximity",
                    ],
                  },
                  {
                    prop: "scroll-padding",
                    label:
                      "Viewport Boundary Padding Shorthand (scroll-padding)",
                    placeholder: "e.g. 10px, 1.5rem, 10px 20px",
                    presets: [
                      "auto",
                      "10px",
                      "20px",
                      "1rem",
                      "1.5rem",
                      "2rem",
                      "10%",
                      "5vh",
                    ],
                  },
                  {
                    prop: "scroll-padding-top",
                    label: "Scroll Padding Top",
                    placeholder: "e.g. 24px, 2rem",
                    presets: [
                      "auto",
                      "10px",
                      "20px",
                      "24px",
                      "1.5rem",
                      "2rem",
                      "5%",
                    ],
                  },
                  {
                    prop: "scroll-padding-right",
                    label: "Scroll Padding Right",
                    placeholder: "e.g. 24px, 2rem",
                    presets: ["auto", "10px", "20px", "1.5rem", "2rem", "5%"],
                  },
                  {
                    prop: "scroll-padding-bottom",
                    label: "Scroll Padding Bottom",
                    placeholder: "e.g. 24px, 2rem",
                    presets: ["auto", "10px", "20px", "1.5rem", "2rem", "5%"],
                  },
                  {
                    prop: "scroll-padding-left",
                    label: "Scroll Padding Left",
                    placeholder: "e.g. 24px, 2rem",
                    presets: ["auto", "10px", "20px", "1.5rem", "2rem", "5%"],
                  },
                  {
                    prop: "scroll-padding-inline-start",
                    label: "Scroll Padding Inline Start",
                    placeholder: "e.g. 24px, 2rem",
                    presets: ["auto", "10px", "1.5rem", "5%"],
                  },
                  {
                    prop: "scroll-padding-inline-end",
                    label: "Scroll Padding Inline End",
                    placeholder: "e.g. 24px, 2rem",
                    presets: ["auto", "10px", "1.5rem", "5%"],
                  },
                  {
                    prop: "scroll-padding-block-start",
                    label: "Scroll Padding Block Start",
                    placeholder: "e.g. 24px, 2rem",
                    presets: ["auto", "10px", "1.5rem", "5%"],
                  },
                  {
                    prop: "scroll-padding-block-end",
                    label: "Scroll Padding Block End",
                    placeholder: "e.g. 24px, 2rem",
                    presets: ["auto", "10px", "1.5rem", "5%"],
                  },
                ],
                itemSnap: [
                  {
                    prop: "scroll-snap-align",
                    label: "Scroll Snap Alignment (scroll-snap-align)",
                    placeholder:
                      "e.g. center, start, end, none start, start end",
                    presets: [
                      "none",
                      "start",
                      "end",
                      "center",
                      "none start",
                      "start end",
                      "center center",
                    ],
                  },
                  {
                    prop: "scroll-snap-stop",
                    label: "Scroll Snap Interception (scroll-snap-stop)",
                    placeholder: "e.g. normal, always",
                    presets: ["normal", "always"],
                  },
                  {
                    prop: "scroll-margin",
                    label: "Scroll Margin Shorthand (scroll-margin)",
                    placeholder: "e.g. 12px, 2rem, 10px 30px",
                    presets: [
                      "12px",
                      "20px",
                      "1rem",
                      "1.5rem",
                      "2rem",
                      "10px 30px",
                      "5px 10px 15px 20px",
                    ],
                  },
                  {
                    prop: "scroll-margin-top",
                    label: "Scroll Margin Top",
                    placeholder: "e.g. 15px, 2vh",
                    presets: [
                      "10px",
                      "15px",
                      "20px",
                      "1rem",
                      "1.2em",
                      "2vh",
                      "4vw",
                    ],
                  },
                  {
                    prop: "scroll-margin-right",
                    label: "Scroll Margin Right",
                    placeholder: "e.g. 15px, 2vh",
                    presets: [
                      "10px",
                      "15px",
                      "20px",
                      "1rem",
                      "1.2em",
                      "2vh",
                      "4vw",
                    ],
                  },
                  {
                    prop: "scroll-margin-bottom",
                    label: "Scroll Margin Bottom",
                    placeholder: "e.g. 15px, 2vh",
                    presets: [
                      "10px",
                      "15px",
                      "20px",
                      "1rem",
                      "1.2em",
                      "2vh",
                      "4vw",
                    ],
                  },
                  {
                    prop: "scroll-margin-left",
                    label: "Scroll Margin Left",
                    placeholder: "e.g. 15px, 2vh",
                    presets: [
                      "10px",
                      "15px",
                      "20px",
                      "1rem",
                      "1.2em",
                      "2vh",
                      "4vw",
                    ],
                  },
                  {
                    prop: "scroll-margin-inline-start",
                    label: "Scroll Margin Inline Start",
                    placeholder: "e.g. 15px, 2vh",
                    presets: ["10px", "15px", "1rem", "2vh"],
                  },
                  {
                    prop: "scroll-margin-inline-end",
                    label: "Scroll Margin Inline End",
                    placeholder: "e.g. 15px, 2vh",
                    presets: ["10px", "15px", "1rem", "2vh"],
                  },
                  {
                    prop: "scroll-margin-block-start",
                    label: "Scroll Margin Block Start",
                    placeholder: "e.g. 15px, 2vh",
                    presets: ["10px", "15px", "1rem", "2vh"],
                  },
                  {
                    prop: "scroll-margin-block-end",
                    label: "Scroll Margin Block End",
                    placeholder: "e.g. 15px, 2vh",
                    presets: ["10px", "15px", "1rem", "2vh"],
                  },
                ],
                touch: [
                  {
                    prop: "touch-action",
                    label: "Touch Screen Action Mapping (touch-action)",
                    placeholder: "e.g. pan-y, manipulation, none",
                    presets: [
                      "auto",
                      "none",
                      "pan-x",
                      "pan-y",
                      "pan-left",
                      "pan-right",
                      "pan-up",
                      "pan-down",
                      "pinch-zoom",
                      "manipulation",
                      "pan-x pan-y",
                      "pan-x pinch-zoom",
                    ],
                  },
                  {
                    prop: "will-change",
                    label: "GPU Rendering Intent hint (will-change)",
                    placeholder: "e.g. transform, opacity, scroll-position",
                    presets: [
                      "auto",
                      "scroll-position",
                      "contents",
                      "transform",
                      "opacity",
                      "transform, opacity",
                    ],
                  },
                ],
              };

              const fields =
                interactivityFields[interactivitySubCategory] || [];

              return (
                <div className="space-y-4 font-sans text-stone-700">
                  {fields.map((field) => {
                    const currentVal = getPropValue(field.prop);
                    const segConfig = SEGMENTED_FIELDS[field.prop];

                    if (segConfig) {
                      return (
                        <div
                          key={field.prop}
                          className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 shadow-sm space-y-3"
                        >
                          <SegmentedControl
                            label={field.label}
                            value={currentVal || segConfig.options[0].value}
                            onChange={(val) => setPropValue(field.prop, val)}
                            options={segConfig.options}
                          />
                          <div className="flex flex-col gap-1.5 w-full text-left">
                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-0.5 font-sans">
                              Custom Override
                            </span>
                            <input
                              type="text"
                              value={currentVal}
                              placeholder={field.placeholder}
                              onChange={(e) =>
                                setPropValue(field.prop, e.target.value)
                              }
                              className="w-full bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none placeholder-stone-300 font-mono shadow-sm"
                            />
                          </div>
                        </div>
                      );
                    }

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
                        <strong>
                          `scroll-snap-type` 🔗 `scroll-snap-align`:
                        </strong>{" "}
                        Scroll snapping functions only if `scroll-snap-type` is
                        declared on a parent scroll container (with active
                        overflow scrolling) <strong>and</strong>{" "}
                        `scroll-snap-align` is declared on one or more child
                        items within that container.
                      </li>
                      <li>
                        <strong>`scroll-padding` 🔗 `scroll-margin`:</strong>{" "}
                        `scroll-padding` adjusts the inner visual viewport area
                        of the container itself, while `scroll-margin` sets
                        layout outsets directly on the target element.
                      </li>
                      <li>
                        <strong>`resize` 🔗 `overflow`:</strong> The `resize`
                        property has no visual or functional effect on an
                        element unless its `overflow` property is set to
                        something other than `visible` (such as `auto`,
                        `scroll`, or `hidden`).
                      </li>
                      <li>
                        <strong>`pointer-events: none` 🔗 `cursor`:</strong>{" "}
                        Setting `pointer-events: none` on an element fully
                        bypasses any hover/mouse states, so any `cursor` changes
                        on it or its child tree will not render.
                      </li>
                      <li>
                        <strong>`touch-action` 🔗 Snapping:</strong> Restrictive
                        `touch-action` configurations (such as `none`, `pan-x`
                        or `pan-y`) override scrolling. If vertical snapping is
                        mandatory but `touch-action: pan-x` is active, touch
                        interaction scrolling is blocked completely.
                      </li>
                      <li>
                        <strong>`overscroll-behavior` 🔗 `overflow`:</strong>{" "}
                        `overscroll-behavior` controls scroll chaining to parent
                        elements. It remains completely inactive unless the
                        element itself is scrollable (has active overflow
                        hidden/scroll/auto with overflowing content).
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
  );
}
