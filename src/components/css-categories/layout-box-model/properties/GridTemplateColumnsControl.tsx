import React, { useState, useEffect } from "react";
import { 
  Columns, 
  Plus, 
  Trash2, 
  HelpCircle, 
  Wand2, 
  AlertTriangle, 
  Check, 
  Sliders, 
  RefreshCw, 
  Maximize2, 
  Minimize2,
  Settings,
  Grid
} from "lucide-react";

interface GridTemplateColumnsControlProps {
  propName?: string;
  value: string;
  onChange: (val: string) => void;
}

interface Preset {
  name: string;
  value: string;
  desc: string;
  badge: string;
}

const COL_PRESETS: Preset[] = [
  {
    name: "12-Column Responsive",
    value: "repeat(12, minmax(0, 1fr))",
    desc: "Standard layout grid with blowout projection",
    badge: "Enterprise"
  },
  {
    name: "Responsive Cards (RAM)",
    value: "repeat(auto-fit, minmax(180px, 1fr))",
    desc: "Wraps cards fluidly without media queries",
    badge: "Auto-Fit"
  },
  {
    name: "Asymmetric Sidebar (Left)",
    value: "240px minmax(0, 1fr)",
    desc: "Fixed sidebar with expandable main viewport",
    badge: "2-Column"
  },
  {
    name: "Asymmetric Sidebar (Right)",
    value: "minmax(0, 1fr) 280px",
    desc: "Expandable content with fixed drawer setup",
    badge: "2-Column"
  },
  {
    name: "3-Column Symmetric",
    value: "1fr 1fr 1fr",
    desc: "Three perfectly equal columns which resize fluidly",
    badge: "Equal"
  },
  {
    name: "Subgrid Alignment",
    value: "subgrid",
    desc: "Adopts columns seamlessly from parent grid container",
    badge: "Subgrid"
  },
  {
    name: "Standard Flow (None)",
    value: "none",
    desc: "Initial value. Falls back to default block display rows",
    badge: "Initial"
  }
];

const ROW_PRESETS: Preset[] = [
  {
    name: "Holy Grail Vertical",
    value: "auto 1fr auto",
    desc: "Header, main content area, footer",
    badge: "App Shell"
  },
  {
    name: "Header + Content",
    value: "auto 1fr",
    desc: "Sticky top navigation, scrollable content",
    badge: "App Shell"
  },
  {
    name: "Fixed Height Header",
    value: "64px minmax(0, 1fr)",
    desc: "Strictly 64px header, fluid content",
    badge: "Fixed"
  },
  {
    name: "Equal Height Rows",
    value: "repeat(3, 1fr)",
    desc: "Three perfectly equal horizontal strips",
    badge: "Equal"
  },
  {
    name: "Content-Driven Sizes",
    value: "min-content max-content auto",
    desc: "Strict content-based row heights",
    badge: "Intrinsic"
  },
  {
    name: "Subgrid Alignment",
    value: "subgrid",
    desc: "Adopts rows seamlessly from parent grid container",
    badge: "Subgrid"
  },
  {
    name: "Standard Flow (None)",
    value: "none",
    desc: "Initial value. Rows size to content automatically",
    badge: "Initial"
  }
];

// Helper to split tracks safely ignoring spaces inside parentheses / brackets
function parseTrackList(str: string): string[] {
  if (!str || str === "none" || str === "initial" || str === "inherit" || str === "subgrid") return [];
  const tracks: string[] = [];
  let current = "";
  let parenDepth = 0;
  let bracketDepth = 0;
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === "(") parenDepth++;
    else if (char === ")") parenDepth--;
    else if (char === "[") bracketDepth++;
    else if (char === "]") bracketDepth--;

    if (char === " " && parenDepth === 0 && bracketDepth === 0) {
      if (current.trim()) {
        tracks.push(current.trim());
      }
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    tracks.push(current.trim());
  }
  return tracks;
}

export function GridTemplateColumnsControl({ propName = "grid-template-columns", value, onChange }: GridTemplateColumnsControlProps) {
  const isRows = propName === "grid-template-rows";
  const activeVal = value || "none";
  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets");
  const [simWidth, setSimWidth] = useState<number>(100); // Percentage width of simulated container (70% - 100%)
  const [editingTrackIdx, setEditingTrackIdx] = useState<number | null>(null);

  // States for the fast repetition builder (repeat)
  const [repeatCountType, setRepeatCountType] = useState<"number" | "auto-fit" | "auto-fill">("number");
  const [repeatCountNum, setRepeatCountNum] = useState<number>(4);
  const [repeatSizeType, setRepeatSizeType] = useState<"fr" | "px" | "minmax">("fr");
  const [repeatSizeFr, setRepeatSizeFr] = useState<number>(1);
  const [repeatSizePx, setRepeatSizePx] = useState<number>(150);
  const [repeatMinmaxMin, setRepeatMinmaxMin] = useState<string>("150px");
  const [repeatMinmaxMax, setRepeatMinmaxMax] = useState<string>("1fr");

  const tracks = parseTrackList(activeVal);
  const isSpecialValue = activeVal === "none" || activeVal === "subgrid" || activeVal === "masonry";

  // Check if current value represents a repeat() function
  const isRepeatPattern = activeVal.startsWith("repeat(");

  // Apply a custom preset
  const handlePresetSelect = (presetVal: string) => {
    onChange(presetVal);
    setEditingTrackIdx(null);
  };

  // Safe builder for repeat()
  const handleGenerateRepeat = () => {
    let count: string = repeatCountType === "number" ? repeatCountNum.toString() : repeatCountType;
    let size = "1fr";

    if (repeatSizeType === "fr") {
      size = `${repeatSizeFr}fr`;
    } else if (repeatSizeType === "px") {
      size = `${repeatSizePx}px`;
    } else if (repeatSizeType === "minmax") {
      size = `minmax(${repeatMinmaxMin},${repeatMinmaxMax})`;
    }

    const valueString = `repeat(${count}, ${size})`;
    onChange(valueString);
  };

  // Synchronize build inputs from existing repeat pattern if present
  useEffect(() => {
    if (activeVal.startsWith("repeat(")) {
      const match = activeVal.match(/repeat\((auto-fit|auto-fill|\d+)\s*,\s*(.*)\)/);
      if (match) {
        const countPart = match[1];
        const sizePart = match[2].trim();

        if (countPart === "auto-fit" || countPart === "auto-fill") {
          setRepeatCountType(countPart);
        } else {
          setRepeatCountType("number");
          setRepeatCountNum(parseInt(countPart) || 4);
        }

        if (sizePart.startsWith("minmax(")) {
          setRepeatSizeType("minmax");
          const mmMatch = sizePart.match(/minmax\(([^,]+),\s*([^)]+)\)/);
          if (mmMatch) {
            setRepeatMinmaxMin(mmMatch[1].trim());
            setRepeatMinmaxMax(mmMatch[2].trim());
          }
        } else if (sizePart.endsWith("fr")) {
          setRepeatSizeType("fr");
          setRepeatSizeFr(parseFloat(sizePart) || 1);
        } else if (sizePart.endsWith("px")) {
          setRepeatSizeType("px");
          setRepeatSizePx(parseInt(sizePart) || 150);
        }
      }
    }
  }, [activeVal]);

  // Modify individual track in custom track list
  const handleUpdateTrack = (idx: number, newVal: string) => {
    const updated = [...tracks];
    updated[idx] = newVal;
    onChange(updated.join(" "));
  };

  // Add individual track
  const handleAddTrack = () => {
    if (isSpecialValue) {
      onChange("1fr");
      setEditingTrackIdx(0);
    } else {
      const updated = [...tracks, "1fr"];
      onChange(updated.join(" "));
      setEditingTrackIdx(updated.length - 1);
    }
  };

  // Delete individual track
  const handleRemoveTrack = (idx: number) => {
    const updated = tracks.filter((_, i) => i !== idx);
    if (updated.length === 0) {
      onChange("none");
      setEditingTrackIdx(null);
    } else {
      onChange(updated.join(" "));
      setEditingTrackIdx(null);
    }
  };

  // Quick auto-fix for the blowout issue (replaces "1fr" with "minmax(0, 1fr)")
  const hasBlowoutRisk = tracks.some(t => t === "1fr");
  const handleAutoFixBlowout = () => {
    const fixed = tracks.map(t => t === "1fr" ? "minmax(0, 1fr)" : t);
    onChange(fixed.join(" "));
  };

  return (
    <div className="flex flex-col gap-3 w-full text-left bg-gradient-to-b from-stone-50 to-stone-100 p-4 rounded-2xl border border-stone-200/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]">
      {/* Property Header */}
      <div className="flex items-center justify-between mb-0.5">
        <label className="text-[10px] text-stone-600 font-extrabold uppercase tracking-widest flex items-center gap-1.5 font-mono">
          <span className="w-1.5 h-3 bg-rose-500 rounded-full animate-pulse" />
            {isRows ? "Grid Rows" : "Grid Columns"}
        </label>
        <span className="text-[9.5px] font-mono font-bold text-rose-600 bg-white px-2 py-0.5 rounded-lg border border-stone-200/80 shadow-xs max-w-[180px] truncate" title={activeVal}>
          {activeVal}
        </span>
      </div>

      {/* Segmented Controls for Presets vs Builder */}
      <div className="bg-stone-200/50 p-0.5 rounded-xl flex gap-0.5 border border-stone-200/20 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("presets")}
          className={`flex-1 text-center py-1.5 rounded-lg text-[10px] font-sans font-bold transition-all duration-150 cursor-pointer ${
            activeTab === "presets"
              ? "bg-white text-stone-900 border border-stone-200/30 shadow-sm"
              : "text-stone-500 hover:text-stone-850"
          }`}
        >
          Layout Presets
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("custom")}
          className={`flex-1 text-center py-1.5 rounded-lg text-[10px] font-sans font-bold transition-all duration-150 cursor-pointer ${
            activeTab === "custom"
              ? "bg-white text-stone-900 border border-stone-200/30 shadow-sm"
              : "text-stone-500 hover:text-stone-850"
          }`}
        >
          Track Builder
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "presets" ? (
        <div className="flex flex-col gap-1.5 max-h-[190px] overflow-y-auto pr-0.5">
          {(isRows ? ROW_PRESETS : COL_PRESETS).map((preset) => {
            const isSelected = activeVal === preset.value;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => handlePresetSelect(preset.value)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? "bg-rose-50/75 border-rose-200 text-rose-850 hover:bg-rose-50"
                    : "bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50"
                }`}
              >
                <div className="space-y-0.5 pr-2 truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold font-sans">
                      {preset.name}
                    </span>
                    {isSelected && <Check size={10} className="text-rose-500" />}
                  </div>
                  <p className="text-[8.5px] text-stone-400 font-medium truncate">
                    {preset.desc}
                  </p>
                </div>
                <span className="text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200/50 text-stone-500">
                  {preset.badge}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-3.5 mt-0.5">
          {/* Choice between repeating pattern generator & manual custom tracks */}
          <div className="p-3 bg-white border border-stone-200/80 rounded-xl space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="text-[9.5px] font-bold text-stone-600 flex items-center gap-1.5 font-mono">
                <Wand2 size={11} className="text-rose-500" />
                Auto Repeat Generator
              </span>
              <button
                type="button"
                onClick={handleGenerateRepeat}
                className="text-[8.5px] font-sans font-extrabold text-white bg-rose-500 hover:bg-rose-600 px-2 py-0.5 rounded shadow-xs"
              >
                Apply Repeat
              </button>
            </div>

            {/* Repeat count configurations */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest pl-0.5">Repeat Count</span>
                <select
                  value={repeatCountType}
                  onChange={(e) => setRepeatCountType(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-200/90 rounded-lg p-1.5 text-[9.5px] text-stone-700 font-bold focus:outline-none focus:border-rose-450"
                >
                  <option value="number">Fixed count</option>
                  <option value="auto-fit">Auto Fit (Smart)</option>
                  <option value="auto-fill">Auto Fill (Implicit)</option>
                </select>
              </div>

              {repeatCountType === "number" && (
                <div className="space-y-1">
                  <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest pl-0.5">Count Slider ({repeatCountNum})</span>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={repeatCountNum}
                    onChange={(e) => setRepeatCountNum(parseInt(e.target.value))}
                    className="w-full h-1 my-3 bg-stone-200 rounded-lg cursor-pointer accent-rose-500"
                  />
                </div>
              )}
            </div>

            {/* Repeat sizing configuration */}
            <div className="space-y-2">
              <div className="flex gap-1.5">
                {(["fr", "px", "minmax"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setRepeatSizeType(t)}
                    className={`flex-1 text-center py-1 rounded-md text-[8.5px] font-bold transition-all border ${
                      repeatSizeType === t
                        ? "bg-stone-900 border-stone-900 text-white"
                        : "bg-stone-50 border-stone-200 text-stone-550 hover:bg-stone-150/40"
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>

              {repeatSizeType === "fr" && (
                <div className="flex items-center gap-2 p-1.5 bg-stone-50 rounded-lg border border-stone-150">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={repeatSizeFr}
                    onChange={(e) => setRepeatSizeFr(parseFloat(e.target.value))}
                    className="flex-1 h-0.5 cursor-pointer accent-rose-500"
                  />
                  <span className="text-[9px] font-mono font-bold bg-white px-1.5 py-0.5 border rounded border-stone-200 text-stone-600">
                    {repeatSizeFr}fr
                  </span>
                </div>
              )}

              {repeatSizeType === "px" && (
                <div className="flex items-center gap-2 p-1.5 bg-stone-50 rounded-lg border border-stone-150">
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={repeatSizePx}
                    onChange={(e) => setRepeatSizePx(parseInt(e.target.value))}
                    className="flex-1 h-0.5 cursor-pointer accent-rose-500"
                  />
                  <span className="text-[9px] font-mono font-bold bg-white px-1.5 py-0.5 border rounded border-stone-200 text-stone-600">
                    {repeatSizePx}px
                  </span>
                </div>
              )}

              {repeatSizeType === "minmax" && (
                <div className="grid grid-cols-2 gap-2 p-2 bg-stone-50 rounded-lg border border-stone-150">
                  <div className="space-y-0.5">
                    <span className="text-[7.5px] font-bold text-stone-400">Min</span>
                    <input
                      type="text"
                      value={repeatMinmaxMin}
                      onChange={(e) => setRepeatMinmaxMin(e.target.value)}
                      placeholder="e.g. 150px"
                      className="w-full bg-white border border-stone-200 rounded px-1.5 py-0.5 text-[9px] font-mono"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[7.5px] font-bold text-stone-400">Max</span>
                    <input
                      type="text"
                      value={repeatMinmaxMax}
                      onChange={(e) => setRepeatMinmaxMax(e.target.value)}
                      placeholder="e.g. 1fr"
                      className="w-full bg-white border border-stone-200 rounded px-1.5 py-0.5 text-[9px] font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Custom Track Listing Panel */}
          <div className="p-3 bg-white border border-stone-200/80 rounded-xl space-y-2 px-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 pb-1.5 mb-1">
              <span className="text-[9.5px] font-bold text-stone-600 flex items-center gap-1.5 font-mono">
                <Sliders size={11} className="text-rose-500" />
                Custom {isRows ? "Row" : "Column"} List
              </span>
              <button
                type="button"
                onClick={handleAddTrack}
                className="text-[8px] font-sans font-extrabold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100/60 px-2 py-0.5 rounded flex items-center gap-1 leading-none shadow-xs"
              >
                <Plus size={9} /> Add Track
              </button>
            </div>

            {isSpecialValue ? (
              <div className="text-center py-4 bg-stone-50/50 rounded-xl border border-dashed border-stone-200">
                <p className="text-[9px] font-bold text-stone-400">No Custom Tracks configured</p>
                <p className="text-[8px] text-stone-400 mt-1">Value is set to "{activeVal}". Add a column to begin custom building.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto py-1">
                {tracks.map((track, idx) => (
                  <button
                    key={`${track}-${idx}`}
                    type="button"
                    onClick={() => setEditingTrackIdx(editingTrackIdx === idx ? null : idx)}
                    className={`px-2.5 py-1.5 rounded-lg border text-[9px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      editingTrackIdx === idx
                        ? "bg-rose-50 border-rose-300 text-rose-700 font-extrabold ring-1 ring-rose-300"
                        : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    <span>Col {idx + 1}:</span>
                    <span className="text-stone-900 bg-white px-1 border border-stone-150 rounded">{track}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Editing popover inside Custom Track List */}
            {editingTrackIdx !== null && tracks[editingTrackIdx] !== undefined && (
              <div className="mt-3 p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2.5 relative animate-fade-in text-left">
                <div className="flex justify-between items-center pb-1 border-b border-stone-200/60">
                  <span className="text-[8.5px] font-mono font-extrabold text-stone-500 uppercase tracking-wider">
                    Edit {isRows ? "Row" : "Column"} {editingTrackIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTrack(editingTrackIdx)}
                    className="text-stone-400 hover:text-red-500 p-0.5"
                    title="Delete column track"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[7.5px] font-bold text-stone-400">Presets</span>
                    <select
                      value={tracks[editingTrackIdx]}
                      onChange={(e) => handleUpdateTrack(editingTrackIdx, e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded px-1.5 py-1 text-[9px] font-mono font-bold focus:outline-none"
                    >
                      <option value="1fr">1fr</option>
                      <option value="2fr">2fr</option>
                      <option value="minmax(0, 1fr)">minmax(0, 1fr)</option>
                      <option value="200px">200px</option>
                      <option value="300px">300px</option>
                      <option value="auto">auto</option>
                      <option value="max-content">max-content</option>
                      <option value="min-content">min-content</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[7.5px] font-bold text-stone-400">Custom Value</span>
                    <input
                      type="text"
                      value={tracks[editingTrackIdx]}
                      onChange={(e) => handleUpdateTrack(editingTrackIdx, e.target.value)}
                      placeholder="e.g. 120px"
                      className="w-full bg-white border border-stone-200 rounded px-1.5 py-1 text-[9px] font-mono focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Visual Preview / Grid Lab Simulator */}
      <div className="bg-white border border-stone-200 p-3.5 rounded-2xl space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
          <div className="flex items-center gap-1.5">
            <Grid size={12} className="text-rose-500" />
            <span className="text-[9.5px] uppercase font-bold tracking-wider text-stone-700 font-mono">
              Live Interactive Grid Lab
            </span>
          </div>

          {/* Simulated container sizing controller */}
          <div className="flex items-center gap-1 border border-stone-150 rounded-lg p-0.5 bg-stone-50">
            <button
              type="button"
              onClick={() => setSimWidth(70)}
              className={`p-1 rounded text-stone-500 transition-all ${
                simWidth === 70 ? "bg-white text-rose-600 border border-stone-150 shadow-xs" : "hover:bg-stone-150/40"
              }`}
              title="Compact width"
            >
              <Minimize2 size={10} />
            </button>
            <button
              type="button"
              onClick={() => setSimWidth(100)}
              className={`p-1 rounded text-stone-500 transition-all ${
                simWidth === 100 ? "bg-white text-rose-600 border border-stone-150 shadow-xs" : "hover:bg-stone-150/40"
              }`}
              title="Expanded width"
            >
              <Maximize2 size={10} />
            </button>
          </div>
        </div>

        {/* Grid Sandbox displayer */}
        <div className="flex justify-center items-center bg-stone-50 p-2 border border-stone-150 rounded-xl max-h-[110px] overflow-hidden min-h-[90px]">
          <div
            className="grid transition-all duration-300 h-full gap-2 p-1.5 bg-stone-200/50 rounded-lg shadow-inner overflow-hidden"
            style={{
              width: `${simWidth}%`,
              ...(isRows ? { gridTemplateRows: activeVal } : { gridTemplateColumns: activeVal }),
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                className="rounded-lg border border-white text-center font-mono py-1.5 px-1 shadow-sm relative overflow-hidden flex flex-col justify-center items-center select-none"
                style={{
                  background: num === 1 ? "linear-gradient(135deg, #f43f5e, #fda4af)" :
                              num === 2 ? "linear-gradient(135deg, #a855f7, #d8b4fe)" :
                              num === 3 ? "linear-gradient(135deg, #0ea5e9, #bae6fd)" :
                              num === 4 ? "linear-gradient(135deg, #10b981, #a7f3d0)" :
                              num === 5 ? "linear-gradient(135deg, #f59e0b, #fde68a)" :
                                          "linear-gradient(135deg, #64748b, #cbd5e1)",
                  color: num <= 5 ? "#fff" : "#1e293b",
                }}
              >
                <span className="text-[9.5px] font-extrabold">I-{num}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[8.5px] text-stone-400 font-medium text-center">
          Tweak preset sizes or container width above to test automatic column wrapping and item fitting live.
        </p>
      </div>

      {/* Educational Gotchas / Tips & Auto fixes */}
      {hasBlowoutRisk && (
        <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl space-y-2 flex flex-col items-start text-amber-900 border-l-4 border-l-amber-400">
          <div className="flex items-center gap-1.5 text-[9.5px] font-bold font-mono">
            <AlertTriangle size={12} className="text-amber-500 animate-bounce" />
            <span>Grid blowout risk detected</span>
          </div>
          <p className="text-[8.5px] leading-relaxed text-amber-800">
            A column track uses raw <strong>1fr</strong> which behaves as <code>minmax(auto, 1fr)</code>. If items container contains wide elements (images, pre block text), it will blow past margins!
          </p>
          <button
            type="button"
            onClick={handleAutoFixBlowout}
            className="text-[8px] font-sans font-extrabold text-white bg-amber-600 hover:bg-amber-700 px-2 py-1 rounded shadow-xs"
          >
            Apply Auto-Fix (Convert to <code>minmax(0, 1fr)</code>)
          </button>
        </div>
      )}
    </div>
  );
}
