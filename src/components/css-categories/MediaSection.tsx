import React, { useState } from "react";
import { HelpCircle, ChevronDown, Image, Box } from "lucide-react";
import { VisualElement } from "../../types";
import { SegmentedControl, SEGMENTED_FIELDS } from "../InspectorPanel";
import {
  setGroupClass,
  getActiveGroupClass,
  setPrefixedClass,
  getPrefixedClass,
  setColorClass,
} from "../../styleUtils";

interface MediaSectionProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
  handleCopy: (text: string) => void;
  copiedText: string | null;
}

export function MediaSection({ selectedElement, updateTree, handleCopy, copiedText }: MediaSectionProps) {
  const [mediaSubCategory, setMediaSubCategory] = useState<"fitting" | "rendering" | "shapes">("fitting");

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Image size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">
                Media & Objects
              </span>
            </div>

            {/* Sub-Category Pills Navigation */}
            <div className="flex bg-stone-100/80 p-1 rounded-xl gap-1 overflow-x-auto scrollbar-hide">
              {[
                { id: "fitting", label: "Media Fitting & Crop" },
                { id: "rendering", label: "Image Rendering" },
                { id: "shapes", label: "Content Flow Shapes" },
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setMediaSubCategory(sub.id as any)}
                  className={`flex-1 py-1.5 px-2.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    mediaSubCategory === sub.id
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

              const mediaFields = {
                fitting: [
                  {
                    prop: "object-fit",
                    label: "Object Auto-Fit Scaling (object-fit)",
                    placeholder: "e.g. cover, contain, fill",
                    presets: [
                      "fill",
                      "contain",
                      "cover",
                      "none",
                      "scale-down",
                      "initial",
                      "inherit",
                      "revert",
                      "revert-layer",
                      "unset",
                    ],
                  },
                  {
                    prop: "object-position",
                    label: "Object Positioning Coordinates (object-position)",
                    placeholder:
                      "e.g. center, top, left 5vw bottom 20px, 15% 85%",
                    presets: [
                      "center",
                      "top",
                      "bottom",
                      "left",
                      "right",
                      "left top",
                      "right bottom",
                      "50% 50%",
                      "100% 100%",
                      "20px 50px",
                    ],
                  },
                  {
                    prop: "object-view-box",
                    label: "Object View Box Crop (object-view-box)",
                    placeholder:
                      "e.g. inset(10% 20% 10% 20%), rect(10px 50px 100px 0)",
                    presets: [
                      "none",
                      "inset(10% 20% 10% 20%)",
                      "inset(10px 20px round 5px)",
                      "rect(10px 50px 100px 0)",
                      "xywh(10px 20px 100px 100px)",
                    ],
                  },
                ],
                rendering: [
                  {
                    prop: "image-rendering",
                    label: "Image Rendering Engine (image-rendering)",
                    placeholder: "e.g. pixelated, crisp-edges",
                    presets: [
                      "auto",
                      "crisp-edges",
                      "pixelated",
                      "smooth",
                      "high-quality",
                    ],
                  },
                  {
                    prop: "image-orientation",
                    label: "Image Rotation Exif Override (image-orientation)",
                    placeholder: "e.g. from-image, 90deg, 180deg flip",
                    presets: [
                      "from-image",
                      "none",
                      "90deg",
                      "180deg",
                      "270deg",
                      "360deg",
                      "0.25turn",
                      "1.57rad",
                      "flip",
                      "90deg flip",
                    ],
                  },
                  {
                    prop: "image-resolution",
                    label: "Pixel Concentration (image-resolution)",
                    placeholder: "e.g. 300dpi, from-image, snap 1dppx",
                    presets: [
                      "from-image",
                      "300dpi",
                      "1dpcm",
                      "2dppx",
                      "1x",
                      "from-image 150dpi",
                      "snap 1dppx",
                    ],
                  },
                ],
                shapes: [
                  {
                    prop: "shape-outside",
                    label: "Float Text Content Flow Wrapper (shape-outside)",
                    placeholder:
                      "e.g. circle(50% at center), polygon(0 0, 100% 0, 50% 100%)",
                    presets: [
                      "none",
                      "margin-box",
                      "border-box",
                      "padding-box",
                      "content-box",
                      "circle(50% at center)",
                      "ellipse(25px 50px at 50% 50%)",
                      "polygon(0 0, 100% 0, 50% 100%)",
                      "inset(10px round 5px)",
                      'path("M 10,10 H 90 V 90 H 10 Z")',
                    ],
                  },
                  {
                    prop: "shape-margin",
                    label: "Shape Spacing Offset (shape-margin)",
                    placeholder: "e.g. 10px, 1.5em, 3vw, 5%",
                    presets: [
                      "0px",
                      "5px",
                      "10px",
                      "15px",
                      "1.5em",
                      "3vw",
                      "5%",
                    ],
                  },
                  {
                    prop: "shape-image-threshold",
                    label:
                      "Shape Alpha Transparency Threshold (shape-image-threshold)",
                    placeholder: "e.g. 0.0, 0.5, 1.0",
                    presets: [
                      "0.0",
                      "0.1",
                      "0.3",
                      "0.5",
                      "0.7",
                      "0.9",
                      "1.0",
                      "50%",
                      "100%",
                    ],
                  },
                ],
              };

              const fields = mediaFields[mediaSubCategory] || [];

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
                              className="w-full bg-white border border-stone-250 rounded-xl px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none placeholder-stone-300 font-mono shadow-sm"
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
                        <strong>`object-fit` and `object-position`:</strong> If
                        `object-fit` is set to `fill` (stretching fully),
                        `object-position` is completely ignored since there is
                        no leftover space to shift the imagery content.
                      </li>
                      <li>
                        <strong>`object-view-box` and friends:</strong> Once
                        cropped via `object-view-box`, standard `object-fit` and
                        `object-position` scale and align only relative to the
                        cropped sub-section.
                      </li>
                      <li>
                        <strong>`shape-outside` and `float`:</strong> Flow
                        shapes only function if the element has `float`
                        explicitly set to `left` or `right`. If `float` is set
                        to `none`, `shape-outside` has zero impact.
                      </li>
                      <li>
                        <strong>`shape-outside` and Sizing Dimensions:</strong>{" "}
                        Custom shapes (`polygon`, `circle`, etc.) require
                        explicit height and width bounds on the container to
                        correctly compute wrapping areas.
                      </li>
                      <li>
                        <strong>`shape-margin` and `shape-outside`:</strong> If
                        `shape-outside` is set to `none`, any defined value in
                        `shape-margin` is ignored.
                      </li>
                      <li>
                        <strong>
                          `shape-image-threshold` and `shape-outside`:
                        </strong>{" "}
                        Opacity threshold is only valid when reading a shape
                        drawn from an image or gradient with transparent
                        elements.
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
  );
}
