import React, { useState } from "react";
import { Sparkles, HelpCircle, ChevronDown, Copy, Search, Check } from "lucide-react";
import { VisualElement } from "../../types";
import { CSS_HIERARCHY_DATA } from "./index";
import {
  setGroupClass,
  getActiveGroupClass,
  setPrefixedClass,
  getPrefixedClass,
  setColorClass,
} from "../../styleUtils";

interface HelpSectionProps {
  selectedElement: VisualElement;
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void;
  handleCopy: (text: string) => void;
  copiedText: string | null;
}

export function HelpSection({ selectedElement, updateTree, handleCopy, copiedText }: HelpSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "LAYOUT & VISUAL DESIGN MODE": true,
    "SPACING MODEL & INNER BOUNDS": true,
    "SIZING MODEL & ASPECT CONSTRAINTS": true,
    "POSITION SYSTEM & INDEX OVERLAYS": true,
    "CORE TYPOGRAPHY SYSTEM": true,
  });

  const filteredHierarchy = CSS_HIERARCHY_DATA.map((category) => {
    const matchingSubCategories = category.subCategories
      .map((sub) => {
        const matchesProperties = sub.properties.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.values.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.note && p.note.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        if (
          sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          matchesProperties.length > 0
        ) {
          return {
            ...sub,
            properties:
              matchesProperties.length > 0 ? matchesProperties : sub.properties,
          };
        }
        return null;
      })
      .filter((sub): sub is Exclude<typeof sub, null> => sub !== null);

    if (
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      matchingSubCategories.length > 0
    ) {
      return { ...category, subCategories: matchingSubCategories };
    }
    return null;
  }).filter((category): category is Exclude<typeof category, null> => category !== null && category.subCategories.length > 0);

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-3 duration-350 pr-0.5">
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle size={15} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800 uppercase tracking-widest">
                CSS Property Reference
              </span>
            </div>

            {/* Quick Live Filter Search */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties, categories or options..."
                className="w-full bg-stone-50 border border-stone-200/80 rounded-xl pl-9 pr-8 py-2.5 text-xs text-stone-700 placeholder-stone-400 focus:outline-none focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all font-sans shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 font-semibold text-[11px] px-1 hover:bg-stone-200/50 rounded cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Interactive Hierarchy Accordions */}
            <div className="flex flex-col gap-4">
              {filteredHierarchy.length === 0 ? (
                <div className="text-center py-8 text-stone-400 bg-stone-50/50 rounded-2xl border border-stone-200/40 p-4">
                  <p className="text-xs font-medium">
                    No CSS properties match "{searchQuery}"
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-xs text-rose-600 font-semibold hover:underline cursor-pointer"
                  >
                    Clear Search Filter
                  </button>
                </div>
              ) : (
                filteredHierarchy.map((category) => {
                  const isExpanded =
                    expandedCategories[category.name] || searchQuery !== "";
                  const totalPropertiesCount = category.subCategories.reduce(
                    (acc, sub) => acc + sub.properties.length,
                    0,
                  );

                  return (
                    <div
                      key={category.name}
                      className="bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-sm hover:border-stone-300 transition-all"
                    >
                      {/* Section Accordion Header */}
                      <button
                        type="button"
                        onClick={() => {
                          if (searchQuery === "") {
                            setExpandedCategories((prev) => ({
                              ...prev,
                              [category.name]: !prev[category.name],
                            }));
                          }
                        }}
                        disabled={searchQuery !== ""}
                        className={`w-full flex items-center justify-between p-4 bg-stone-50/60 border-b border-stone-100 font-sans cursor-pointer transition-colors ${
                          searchQuery !== ""
                            ? "cursor-default animate-none"
                            : "hover:bg-stone-100/60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <category.icon size={14} className="text-rose-600" />
                          <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wider">
                            {category.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 font-mono">
                            {totalPropertiesCount} props
                          </span>
                          {searchQuery === "" && (
                            <ChevronDown
                              size={14}
                              className={`text-stone-400 transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </div>
                      </button>

                      {/* Section Accordion Content */}
                      {isExpanded && (
                        <div className="p-4 pt-3 flex flex-col gap-4 divide-y divide-stone-100">
                          {category.subCategories.map((subCategory) => (
                            <div
                              key={subCategory.name}
                              className="pt-3 first:pt-0 flex flex-col gap-2.5"
                            >
                              {/* SubCategory Heading */}
                              <h4 className="text-[10px] text-rose-600 font-bold uppercase tracking-wider font-sans">
                                {subCategory.name}
                              </h4>

                              {/* Properties Matrix */}
                              <div className="flex flex-col gap-3">
                                {subCategory.properties.map((property) => (
                                  <div
                                    key={property.name}
                                    className="p-3 bg-stone-50/40 border border-stone-200/30 rounded-xl space-y-2 hover:bg-stone-50/90 transition-colors"
                                  >
                                    {/* Property Header */}
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex flex-wrap items-center gap-1.5">
                                        <code
                                          onClick={() =>
                                            handleCopy(property.name)
                                          }
                                          title="Click to copy property name"
                                          className="text-[11.5px] font-mono font-bold text-stone-800 hover:text-rose-700 bg-stone-100/50 px-1.5 py-0.5 rounded cursor-pointer transition-all"
                                        >
                                          {property.name}
                                        </code>
                                        {property.note && (
                                          <span className="text-[10px] text-stone-400 font-medium font-sans">
                                            ({property.note})
                                          </span>
                                        )}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleCopy(property.name)
                                        }
                                        className="text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-lg hover:bg-stone-200/40 cursor-pointer"
                                        title="Copy Property Name"
                                      >
                                        <Copy size={11} />
                                      </button>
                                    </div>

                                    {/* Property Values list */}
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                      {property.values
                                        .split(/\s*\|\s*/)
                                        .map((valueItem, vIdx) => {
                                          const trimmedValue = valueItem.trim();
                                          const isCopied =
                                            copiedText === trimmedValue;
                                          return (
                                            <button
                                              key={vIdx}
                                              type="button"
                                              onClick={() =>
                                                handleCopy(trimmedValue)
                                              }
                                              style={{
                                                touchAction: "manipulation",
                                              }}
                                              className={`px-2 py-0.5 h-6 text-[10px] font-mono rounded-lg border flex items-center gap-1 transition-all duration-150 cursor-pointer select-none ${
                                                isCopied
                                                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold shadow-sm"
                                                  : "bg-white hover:bg-stone-50 border-stone-200/50 text-stone-600 hover:text-stone-800"
                                              }`}
                                            >
                                              <span>{trimmedValue}</span>
                                              {isCopied && (
                                                <Check
                                                  size={10}
                                                  className="text-emerald-600"
                                                />
                                              )}
                                            </button>
                                          );
                                        })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Micro Quick Notes Footer Tip */}
            <div className="bg-rose-50/50 border border-rose-100/50 rounded-2xl p-4 space-y-1.5 text-[11px] text-stone-600 leading-relaxed font-sans shadow-inner">
              <p className="font-bold text-rose-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Sparkles size={11} />
                <span>Reference Notation Guide:</span>
              </p>
              <ul className="list-disc pl-4 space-y-1 text-stone-500 text-[10.5px]">
                <li>
                  <code className="font-mono text-rose-600 font-semibold">
                    &lt;length&gt;
                  </code>
                  : Units like{" "}
                  <code className="font-mono bg-rose-50 px-1 py-0.2 rounded text-[10px]">
                    px
                  </code>
                  ,{" "}
                  <code className="font-mono bg-rose-50 px-1 py-0.2 rounded text-[10px]">
                    rem
                  </code>
                  ,{" "}
                  <code className="font-mono bg-rose-50 px-1 py-0.2 rounded text-[10px]">
                    em
                  </code>
                  ,{" "}
                  <code className="font-mono bg-rose-50 px-1 py-0.2 rounded text-[10px]">
                    vw
                  </code>
                  , etc.
                </li>
                <li>
                  <code className="font-mono text-rose-600 font-semibold">
                    &lt;time&gt;
                  </code>
                  : Transition and animation time like{" "}
                  <code className="font-mono bg-rose-50 px-1 py-0.2 rounded text-[10px]">
                    s
                  </code>{" "}
                  or{" "}
                  <code className="font-mono bg-rose-50 px-1 py-0.2 rounded text-[10px]">
                    ms
                  </code>
                  .
                </li>
                <li>
                  Pills are interactive: **tapping copies values** instantly to
                  clipboard.
                </li>
              </ul>
            </div>
          </div>
  );
}
