import React, { useState } from "react";
import { Layers } from "lucide-react";
import { VisualElement } from "../../types";
import { PropertyControl } from "../PropertyControl";
import {
  setGroupClass,
  getActiveGroupClass,
  setPrefixedClass,
  getPrefixedClass,
  setColorClass,
} from "../../styleUtils";

interface ViewTransitionsSectionProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
  handleCopy: (text: string) => void;
  copiedText: string | null;
}

export function ViewTransitionsSection({ selectedElement, updateTree, handleCopy, copiedText }: ViewTransitionsSectionProps) {

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Layers size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">
                View Transitions
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
                    label="View Transition Name"
                    options={[
                      { value: "none", label: "None" },
                      { value: "card", label: "card" },
                      { value: "hero-image", label: "hero-image" },
                      { value: "header", label: "header" },
                      { value: "title", label: "title" },
                    ]}
                    value={getPropValue("view-transition-name")}
                    onChange={(val) =>
                      setPropValue("view-transition-name", val)
                    }
                  />
                </div>
              );
            })()}
          </div>
  );
}
