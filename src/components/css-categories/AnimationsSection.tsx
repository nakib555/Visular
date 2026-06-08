import React, { useState } from "react";
import { Compass } from "lucide-react";
import { VisualElement } from "../../types";
import { PropertyControl } from "../PropertyControl";
import {
  setGroupClass,
  getActiveGroupClass,
  setPrefixedClass,
  getPrefixedClass,
  setColorClass,
} from "../../styleUtils";

interface AnimationsSectionProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
  handleCopy: (text: string) => void;
  copiedText: string | null;
}

export function AnimationsSection({ selectedElement, updateTree, handleCopy, copiedText }: AnimationsSectionProps) {

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Compass size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">
                Motion Paths
              </span>
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

              return (
                <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
                  <PropertyControl
                    label="Motion Path Shape"
                    options={[
                      { value: "none", label: "None" },
                      { value: "path('M_0_0_L_100_100')", label: "Linear" },
                      {
                        value: "path('M_0_0_C_50_0_50_100_100_100')",
                        label: "Ease-In/Out Curve",
                      },
                      {
                        value: "path('M_0_0_Q_50_-50_100_0_T_200_0')",
                        label: "Spring Bounce",
                      },
                      { value: "circle(50px_at_center)", label: "Circle" },
                    ]}
                    value={getPropValue("offset-path")}
                    onChange={(val) => setPropValue("offset-path", val)}
                  />

                  <PropertyControl
                    label="Distance Along Path"
                    options={[
                      { value: "0%", label: "0%" },
                      { value: "25%", label: "25%" },
                      { value: "50%", label: "50%" },
                      { value: "75%", label: "75%" },
                      { value: "100%", label: "100%" },
                    ]}
                    value={getPropValue("offset-distance")}
                    onChange={(val) => setPropValue("offset-distance", val)}
                  />
                </div>
              );
            })()}
          </div>
  );
}
