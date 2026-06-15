import React, { useState } from "react";
import { Play, HelpCircle, ChevronDown, Wand2, List } from "lucide-react";
import { VisualElement } from "../../types";
import {
  setGroupClass,
  getActiveGroupClass,
  setPrefixedClass,
  getPrefixedClass,
  setColorClass,
} from "../../styleUtils";

interface AnimationSectionProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
  handleCopy: (text: string) => void;
  copiedText: string | null;
  containerMockWidth?: number;
  setContainerMockWidth?: (val: number) => void;
  rotationX?: number;
  setRotationX?: (val: number) => void;
  rotationY?: number;
  setRotationY?: (val: number) => void;
  scaleFactor?: number;
  setScaleFactor?: (val: number) => void;
  popupVisible?: boolean;
  setPopupVisible?: (val: boolean) => void;
  outlineFocused?: boolean;
  setOutlineFocused?: (val: boolean) => void;
}

export function AnimationSection({ selectedElement, updateTree, handleCopy, copiedText, containerMockWidth, setContainerMockWidth, rotationX, setRotationX, rotationY, setRotationY, scaleFactor, setScaleFactor, popupVisible, setPopupVisible, outlineFocused, setOutlineFocused }: AnimationSectionProps) {
  const [animationSubCategory, setAnimationSubCategory] = useState<"transitions" | "transforms" | "legacyTransforms" | "keyframes" | "scrollDriven">("transitions");

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Wand2 size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">
                Movement & Animation
              </span>
            </div>

            {/* Sub-Category Pills Navigation */}
            <div className="flex bg-stone-100/80 p-1 rounded-xl gap-1 overflow-x-auto scrollbar-hide">
              {[
                { id: "transitions", label: "Transitions" },
                { id: "transforms", label: "Transforms" },
                { id: "legacyTransforms", label: "Legacy Transform" },
                { id: "keyframes", label: "Keyframes" },
                { id: "scrollDriven", label: "Scroll-Driven" },
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setAnimationSubCategory(sub.id as any)}
                  className={`flex-1 py-1.5 px-2.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    animationSubCategory === sub.id
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

              const animationFields = {
                transitions: [
                  {
                    prop: "transition",
                    label: "Transition Shorthand (transition)",
                    placeholder:
                      "all 0.3s ease-in-out 0s, opacity 200ms linear",
                    presets: [
                      "none",
                      "all 0.3s ease",
                      "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
                      "opacity 0.2s ease-in-out",
                      "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                    ],
                  },
                  {
                    prop: "transition-property",
                    label: "Transition Property (transition-property)",
                    placeholder: "e.g. transform, opacity, background-color",
                    presets: [
                      "none",
                      "all",
                      "transform",
                      "opacity",
                      "background-color",
                      "color",
                      "border-color",
                      "translate",
                      "rotate",
                      "scale",
                    ],
                  },
                  {
                    prop: "transition-duration",
                    label: "Transition Duration (transition-duration)",
                    placeholder: "e.g. 0.3s, 300ms",
                    presets: [
                      "0s",
                      "100ms",
                      "150ms",
                      "200ms",
                      "300ms",
                      "500ms",
                      "700ms",
                      "1s",
                    ],
                  },
                  {
                    prop: "transition-delay",
                    label: "Transition Delay (transition-delay)",
                    placeholder: "e.g. 0.1s, 100ms",
                    presets: [
                      "0s",
                      "75ms",
                      "100ms",
                      "150ms",
                      "200ms",
                      "300ms",
                      "500ms",
                    ],
                  },
                  {
                    prop: "transition-timing-function",
                    label: "Transition Timing (transition-timing-function)",
                    placeholder: "e.g. cubic-bezier(0.25, 0.1, 0.25, 1)",
                    presets: [
                      "ease",
                      "linear",
                      "ease-in",
                      "ease-out",
                      "ease-in-out",
                      "step-start",
                      "step-end",
                      "cubic-bezier(0.34, 1.56, 0.64, 1)",
                      "cubic-bezier(0.25, 1, 0.5, 1)",
                    ],
                  },
                  {
                    prop: "transition-behavior",
                    label: "Transition Behavior (transition-behavior)",
                    placeholder: "e.g. normal, allow-discrete",
                    presets: ["normal", "allow-discrete"],
                  },
                ],
                transforms: [
                  {
                    prop: "translate",
                    label: "Translate Offset (translate)",
                    placeholder: "e.g. 10px, 50% 100%, 0 -20px",
                    presets: [
                      "none",
                      "10px",
                      "50%",
                      "-50%",
                      "10px 20px",
                      "50% 100% 15px",
                      "0 -10px",
                      "0 10px",
                    ],
                  },
                  {
                    prop: "rotate",
                    label: "Rotation (rotate)",
                    placeholder: "e.g. 45deg, z 90deg, 1 1 0 45deg",
                    presets: [
                      "none",
                      "45deg",
                      "90deg",
                      "180deg",
                      "360deg",
                      "-45deg",
                      "-90deg",
                      "x 45deg",
                      "y 45deg",
                      "z 90deg",
                      "0.25turn",
                    ],
                  },
                  {
                    prop: "scale",
                    label: "Scale Factor (scale)",
                    placeholder: "e.g. 1.5, 120% 80%",
                    presets: [
                      "none",
                      "1",
                      "1.05",
                      "1.1",
                      "1.2",
                      "1.5",
                      "2",
                      "0.95",
                      "0.9",
                      "0.8",
                      "0.5",
                    ],
                  },
                ],
                legacyTransforms: [
                  {
                    prop: "transform",
                    label: "Legacy Transform List (transform)",
                    placeholder:
                      "e.g. translate(10px, 20px) rotate(45deg) scale(1.5)",
                    presets: [
                      "none",
                      "scale(1.05)",
                      "scale(0.95)",
                      "translateY(-4px)",
                      "translateY(4px)",
                      "rotate(3deg)",
                      "rotate(-3deg)",
                      "skewX(-10deg)",
                    ],
                  },
                  {
                    prop: "transform-origin",
                    label: "Transform Origin (transform-origin)",
                    placeholder: "e.g. center, top left, 50% 50%",
                    presets: [
                      "center",
                      "top",
                      "bottom",
                      "left",
                      "right",
                      "top left",
                      "bottom right",
                      "50% 50%",
                    ],
                  },
                ],
                keyframes: [
                  {
                    prop: "animation",
                    label: "Animation Shorthand (animation)",
                    placeholder: "e.g. slide-in 1s ease-out infinite forwards",
                    presets: [
                      "none",
                      "spin 1s linear infinite",
                      "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
                      "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                      "bounce 1s infinite",
                    ],
                  },
                  {
                    prop: "animation-name",
                    label: "Animation Name (animation-name)",
                    placeholder: "e.g. fade-in, bounce-animation",
                    presets: ["none", "spin", "ping", "pulse", "bounce"],
                  },
                  {
                    prop: "animation-duration",
                    label: "Animation Duration (animation-duration)",
                    placeholder: "e.g. 1s, 800ms",
                    presets: [
                      "0s",
                      "150ms",
                      "300ms",
                      "500ms",
                      "800ms",
                      "1s",
                      "1.5s",
                      "2s",
                      "3s",
                      "5s",
                    ],
                  },
                  {
                    prop: "animation-delay",
                    label: "Animation Delay (animation-delay)",
                    placeholder: "e.g. 0.5s, 500ms",
                    presets: [
                      "0s",
                      "100ms",
                      "200ms",
                      "300ms",
                      "500ms",
                      "1s",
                      "2s",
                    ],
                  },
                  {
                    prop: "animation-timing-function",
                    label: "Animation Timing (animation-timing-function)",
                    placeholder: "e.g. cubic-bezier(0.42, 0, 0.58, 1)",
                    presets: [
                      "ease",
                      "linear",
                      "ease-in",
                      "ease-out",
                      "ease-in-out",
                      "step-start",
                      "step-end",
                    ],
                  },
                  {
                    prop: "animation-iteration-count",
                    label: "Iteration Count (animation-iteration-count)",
                    placeholder: "e.g. infinite, 1, 3",
                    presets: ["infinite", "1", "2", "3", "5", "10"],
                  },
                  {
                    prop: "animation-direction",
                    label: "Animation Direction (animation-direction)",
                    placeholder: "e.g. normal, reverse, alternate",
                    presets: [
                      "normal",
                      "reverse",
                      "alternate",
                      "alternate-reverse",
                    ],
                  },
                  {
                    prop: "animation-fill-mode",
                    label: "Animation Fill Mode (animation-fill-mode)",
                    placeholder: "e.g. none, forwards, backwards, both",
                    presets: ["none", "forwards", "backwards", "both"],
                  },
                  {
                    prop: "animation-play-state",
                    label: "Animation Play State (animation-play-state)",
                    placeholder: "e.g. running, paused",
                    presets: ["running", "paused"],
                  },
                  {
                    prop: "animation-composition",
                    label: "Animation Composition (animation-composition)",
                    placeholder: "e.g. replace, add, accumulate",
                    presets: ["replace", "add", "accumulate"],
                  },
                ],
                scrollDriven: [
                  {
                    prop: "animation-timeline",
                    label: "Animation Timeline (animation-timeline)",
                    placeholder:
                      "e.g. scroll(self block), view(inline 20%), --my-timeline",
                    presets: [
                      "auto",
                      "none",
                      "scroll()",
                      "scroll(self block)",
                      "scroll(root y)",
                      "view()",
                      "view(inline 20%)",
                    ],
                  },
                  {
                    prop: "scroll-timeline",
                    label: "Scroll Timeline Shorthand (scroll-timeline)",
                    placeholder: "e.g. --my-timeline block",
                    presets: [
                      "none",
                      "--scroll-timeline block",
                      "--scroll-timeline inline",
                    ],
                  },
                  {
                    prop: "scroll-timeline-name",
                    label: "Scroll Timeline Name (scroll-timeline-name)",
                    placeholder: "e.g. --my-scroll-timeline",
                    presets: ["none", "--scroll-timeline"],
                  },
                  {
                    prop: "scroll-timeline-axis",
                    label: "Scroll Timeline Axis (scroll-timeline-axis)",
                    placeholder: "e.g. block, inline, x, y",
                    presets: ["block", "inline", "x", "y"],
                  },
                  {
                    prop: "view-timeline",
                    label: "View Timeline Shorthand (view-timeline)",
                    placeholder: "e.g. --my-view-timeline block",
                    presets: [
                      "none",
                      "--view-timeline block",
                      "--view-timeline inline",
                    ],
                  },
                  {
                    prop: "view-timeline-name",
                    label: "View Timeline Name (view-timeline-name)",
                    placeholder: "e.g. --my-view-timeline",
                    presets: ["none", "--view-timeline"],
                  },
                  {
                    prop: "view-timeline-axis",
                    label: "View Timeline Axis (view-timeline-axis)",
                    placeholder: "e.g. block, inline, x, y",
                    presets: ["block", "inline", "x", "y"],
                  },
                  {
                    prop: "animation-range",
                    label: "Animation Range (animation-range)",
                    placeholder: "e.g. cover 0% cover 100%, entry 10%",
                    presets: [
                      "normal",
                      "cover 0% cover 100%",
                      "contain 20% entry 80%",
                      "entry 0% exit 100%",
                    ],
                  },
                  {
                    prop: "animation-range-start",
                    label: "Range Start (animation-range-start)",
                    placeholder: "e.g. cover 0%, entry 20%",
                    presets: [
                      "normal",
                      "auto",
                      "0%",
                      "50%",
                      "100%",
                      "cover 0%",
                      "contain 0%",
                      "entry 0%",
                    ],
                  },
                  {
                    prop: "animation-range-end",
                    label: "Range End (animation-range-end)",
                    placeholder: "e.g. cover 100%, exit 80%",
                    presets: [
                      "normal",
                      "auto",
                      "0%",
                      "50%",
                      "100%",
                      "cover 100%",
                      "contain 100%",
                      "exit 100%",
                    ],
                  },
                ],
              };

              const fields = animationFields[animationSubCategory] || [];

              return (
                <div className="space-y-4 font-sans text-stone-700">
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
                        <strong>
                          Animation-Name 🔗 External `@keyframes`:
                        </strong>{" "}
                        The `animation-name` property requires a corresponding
                        `@keyframes` rule declared elsewhere. If sets to
                        `slide-in`, a `@keyframes slide-in` must exist, or the
                        animation will fail.
                      </li>
                      <li>
                        <strong>Scroll-Driven Timeline Associations:</strong> To
                        drive an animation using a custom timeline, the
                        scrolling container defines `scroll-timeline-name:
                        --my-timeline` (or `view-timeline-name`), and the target
                        sets `animation-timeline: --my-timeline`.
                      </li>
                      <li>
                        <strong>Shorthand to Longhand Hierarchy:</strong>{" "}
                        Setting `transition` overrides individual declarations
                        of `transition-property`, duration, delay, or
                        timing-function. `animation` acts as an aggressive
                        shorthand resetting omitted longhands.
                      </li>
                      <li>
                        <strong>
                          `animation-range` 🔗 Scroll-Driven Contexts:
                        </strong>{" "}
                        Timeline range properties rely on scroll-driven or
                        view-driven context. If `animation-timeline` is `auto`
                        or time-based, specified ranges are completely ignored.
                      </li>
                      <li>
                        <strong>
                          Individual Transforms vs. Shorthand `transform`
                          Conflict:
                        </strong>{" "}
                        Modern individual transform properties (`translate`,
                        `rotate`, `scale`) process first, and the shorthand
                        `transform` functions apply afterward. Mixing them
                        indiscriminately can lead to unexpected compounding.
                      </li>
                      <li>
                        <strong>Discrete Transitions:</strong> For transitions
                        on discrete properties like `display`,
                        `transition-behavior: allow-discrete` must be set, and
                        `transition-property` must target that specific
                        property.
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
  );
}
