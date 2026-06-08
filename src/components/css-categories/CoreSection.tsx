import React, { useState } from "react";
import { Sparkles, Type, Code, HelpCircle, Compass } from "lucide-react";
import { VisualElement } from "../../types";
import {
  setGroupClass,
  getActiveGroupClass,
  setPrefixedClass,
  getPrefixedClass,
  setColorClass,
} from "../../styleUtils";

interface CoreSectionProps {
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

export function CoreSection({ selectedElement, updateTree, handleCopy, copiedText, containerMockWidth, setContainerMockWidth, rotationX, setRotationX, rotationY, setRotationY, scaleFactor, setScaleFactor, popupVisible, setPopupVisible, outlineFocused, setOutlineFocused }: CoreSectionProps) {

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">
                Content & Custom Utilities
              </span>
            </div>

            {/* Sub-Category: Content details */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1">
                <Compass size={11} />
                <span>Text / URL Attributes</span>
              </div>

              {selectedElement.content !== undefined ? (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1">
                    Rendered Node inner content
                  </label>
                  <input
                    type="text"
                    value={selectedElement.content || ""}
                    onChange={(e) =>
                      updateTree(() => ({ content: e.target.value }))
                    }
                    className="w-full bg-white border border-stone-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all font-sans text-stone-800 shadow-sm"
                    placeholder="Type inner text content or image src url..."
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2.5 text-stone-500 bg-white rounded-xl p-4 border border-stone-200/40 shadow-sm">
                  <HelpCircle size={15} className="text-stone-400" />
                  <span className="text-xs font-medium">
                    This structural layout bounds container doesn't accept
                    direct text fields. Select a text layer child to edit
                    wordings.
                  </span>
                </div>
              )}
            </div>

            {/* Sub-Category: Utility classes direct write */}
            <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600 font-mono flex items-center gap-1">
                <Code size={11} />
                <span>Advanced Tailwind Utility Classes</span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider pl-1">
                  Direct tokens string editor
                </label>
                <textarea
                  rows={4}
                  value={selectedElement.classes || ""}
                  onChange={(e) =>
                    updateTree(() => ({ classes: e.target.value }))
                  }
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-3 text-[11px] leading-relaxed focus:outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/20 transition-all font-mono text-emerald-400 resize-none shadow-inner"
                  placeholder="flex items-center justify-between px-4 py-2 border border-gray-100..."
                />
              </div>
            </div>
          </div>
  );
}
