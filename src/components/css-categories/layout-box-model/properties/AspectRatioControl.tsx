import React, { useState, useEffect, useMemo } from "react";
import { 
  Square, 
  Tv, 
  Smartphone, 
  Image as ImageIcon, 
  Settings2, 
  Layers, 
  Info, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Video,
  Play,
  Sliders,
  Maximize2
} from "lucide-react";
import { motion } from "motion/react";

interface AspectRatioPreset {
  label: string;
  value: string;
  fractionLabel: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
}

const PRESETS: AspectRatioPreset[] = [
  {
    label: "Video (Widescreen)",
    value: "16 / 9",
    fractionLabel: "16 : 9",
    description: "Standard video format for HD monitors & modern streams",
    icon: Tv,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50/50",
    borderColor: "border-indigo-120"
  },
  {
    label: "Square Grid",
    value: "1 / 1",
    fractionLabel: "1 : 1",
    description: "Instagram posts, circular user profiles, and uniform grids",
    icon: Square,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50/50",
    borderColor: "border-emerald-125"
  },
  {
    label: "Mobile Stories",
    value: "9 / 16",
    fractionLabel: "9 : 16",
    description: "Mobile-first responsive vertical cards, TikTok, and Reels",
    icon: Smartphone,
    color: "text-rose-600",
    bgColor: "bg-rose-50/50",
    borderColor: "border-rose-120"
  },
  {
    label: "Classic DSLR",
    value: "4 / 3",
    fractionLabel: "4 : 3",
    description: "Retro television, iPad interfaces, and classical photos",
    icon: ImageIcon,
    color: "text-amber-600",
    bgColor: "bg-amber-50/50",
    borderColor: "border-amber-120"
  },
  {
    label: "Cinematic Scope",
    value: "21 / 9",
    fractionLabel: "21 : 9",
    description: "Ultrawide cinematic views and widescreen panorama graphics",
    icon: Video,
    color: "text-violet-600",
    bgColor: "bg-violet-50/50",
    borderColor: "border-violet-120"
  },
  {
    label: "Automatic Flow",
    value: "auto",
    fractionLabel: "auto",
    description: "Preserves width & height. Defers strictly to content bounds",
    icon: RotateCcw,
    color: "text-stone-600",
    bgColor: "bg-stone-50/50",
    borderColor: "border-stone-150"
  }
];

interface AspectRatioControlProps {
  value: string;
  onChange: (val: string) => void;
}

export function AspectRatioControl({ value, onChange }: AspectRatioControlProps) {
  // Parse incoming value
  const isAutoCombined = value ? value.trim().startsWith("auto ") : false;
  const rawRatioPart = useMemo(() => {
    if (!value) return "auto";
    const cleaned = value.trim();
    if (cleaned === "auto") return "auto";
    if (cleaned.startsWith("auto ")) {
      return cleaned.slice(5).trim();
    }
    return cleaned;
  }, [value]);

  // Set local decimal states
  const [widthRatio, setWidthRatio] = useState(16);
  const [heightRatio, setHeightRatio] = useState(9);
  const [objectFit, setObjectFit] = useState<"cover" | "contain" | "fill">("cover");

  // Synchronize state when raw ratio changes
  useEffect(() => {
    if (rawRatioPart && rawRatioPart !== "auto") {
      const parts = rawRatioPart.split("/").map(p => p.trim());
      if (parts.length === 2) {
        const w = parseFloat(parts[0]);
        const h = parseFloat(parts[1]);
        if (!isNaN(w) && w > 0 && !isNaN(h) && h > 0) {
          setWidthRatio(w);
          setHeightRatio(h);
        }
      } else {
        const singleNum = parseFloat(rawRatioPart);
        if (!isNaN(singleNum) && singleNum > 0) {
          setWidthRatio(singleNum);
          setHeightRatio(1);
        }
      }
    }
  }, [rawRatioPart]);

  const handleApplyRatio = (newRatio: string, combineWithAuto = isAutoCombined) => {
    if (newRatio === "auto") {
      onChange("auto");
    } else {
      onChange(combineWithAuto ? `auto ${newRatio}` : newRatio);
    }
  };

  const handleToggleAutoCombine = () => {
    const nextCombine = !isAutoCombined;
    if (rawRatioPart === "auto") {
      onChange("auto");
    } else {
      onChange(nextCombine ? `auto ${rawRatioPart}` : rawRatioPart);
    }
  };

  const currentComputedFractionNumber = useMemo(() => {
    if (rawRatioPart === "auto") return null;
    const parts = rawRatioPart.split("/").map(p => p.trim());
    if (parts.length === 2) {
      const w = parseFloat(parts[0]);
      const h = parseFloat(parts[1]);
      if (h > 0) return (w / h).toFixed(3);
    } else {
      const singleNum = parseFloat(rawRatioPart);
      if (!isNaN(singleNum)) return singleNum.toFixed(3);
    }
    return null;
  }, [rawRatioPart]);

  const previewBoxStyle = useMemo(() => {
    if (rawRatioPart === "auto") {
      return { aspectRatio: "16 / 9" }; // UI visual fallback ratio of widescreen standard
    }
    return { aspectRatio: rawRatioPart };
  }, [rawRatioPart]);

  const activePreset = useMemo(() => {
    return PRESETS.find(p => p.value === rawRatioPart) || null;
  }, [rawRatioPart]);

  return (
    <div className="flex flex-col gap-5 w-full text-left bg-stone-50 p-6 rounded-[28px] border border-stone-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] relative overflow-visible z-10">
      
      {/* 1. Label and header info */}
      <div className="flex items-center justify-between pl-1 select-none">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700">
              <Maximize2 size={11} className="stroke-[2.5]" />
            </span>
            <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">
              Dimension Proportions
            </label>
          </div>
          <span className="text-[11px] text-stone-400 font-medium font-mono pl-6">
            aspect-ratio
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9.5px]/none bg-indigo-600 font-mono font-extrabold text-white px-2.5 py-1 rounded-full shadow-2xs">
            {value || "auto"}
          </span>
        </div>
      </div>

      {/* 2. Visual Simulator Sandbox Box - Styled off-white matching positioning offset */}
      <div className="relative bg-stone-100/70 rounded-2xl h-48 border border-stone-200 overflow-hidden flex flex-col justify-between p-4.5 shadow-sm">
        {/* Radar grids backdrop */}
        <div className="absolute inset-0 opacity-[0.45] pointer-events-none bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px]" />

        {/* Top visual controls segment of Sandbox */}
        <div className="flex justify-between items-center z-15 select-none shrink-0 border-b border-stone-200/50 pb-2">
          <div className="flex items-center gap-1.5 bg-white/90 px-2 py-0.5 rounded-lg border border-stone-200 shadow-3xs">
            <Layers className="w-2.5 h-2.5 text-indigo-600 font-extrabold" />
            <span className="text-[7.5px] font-mono tracking-widest font-black uppercase text-stone-500 leading-none">
              Proportion Stage
            </span>
          </div>

          <div className="flex gap-1.5">
            {(["cover", "contain", "fill"] as const).map((fit) => {
              const isFit = objectFit === fit;
              return (
                <button
                  key={fit}
                  onClick={() => setObjectFit(fit)}
                  type="button"
                  className={`text-[8px] font-mono px-2 py-0.5 rounded-md transition-all cursor-pointer font-extrabold select-none ${
                    isFit 
                      ? "bg-indigo-600 text-white shadow-sm" 
                      : "bg-white border border-stone-200 text-stone-500 hover:text-stone-850 hover:bg-stone-50"
                  }`}
                  title={`Sets dynamic visual model fill behavior to '${fit}'`}
                >
                  {fit}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Aspect preview mock renderer */}
        <div className="flex-1 w-full flex items-center justify-center p-3.5 min-h-0">
          <motion.div
            layout
            style={previewBoxStyle}
            transition={{ type: "spring", stiffness: 360, damping: 27 }}
            className="h-full max-w-full bg-white border border-stone-200 rounded-xl relative overflow-hidden flex flex-col items-center justify-center shadow-md group/box"
          >
            {/* Visual media image placeholder with light friendly overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=320&q=80"
                alt="Proportional live state indicator rendering helper"
                referrerPolicy="no-referrer"
                className={`w-full h-full opacity-70 filter saturate-[1.1] brightness-[0.98] transition-all duration-300 ${
                  objectFit === "cover" ? "object-cover" : objectFit === "contain" ? "object-contain" : "object-fill"
                }`}
              />
            </div>

            {/* Play button indicator overlay */}
            <div className="z-10 flex flex-col items-center gap-1 pb-1 pt-2 pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-white/95 text-indigo-650 flex items-center justify-center scale-90 group-hover/box:scale-100 transition-all duration-300 shadow-md">
                <Play size={12} className="fill-indigo-600 stroke-none ml-0.5" />
              </div>
              <div className="flex flex-col items-center select-none bg-white/90 px-2 py-0.5 rounded-lg border border-stone-250/20 backdrop-blur-xs">
                <span className="text-[9.5px] font-black tracking-wider text-stone-800 uppercase font-mono">
                  {rawRatioPart === "auto" ? "auto-flow" : rawRatioPart}
                </span>
                {currentComputedFractionNumber && (
                  <span className="text-[8px] font-mono font-bold text-indigo-750 leading-none">
                    coef: {currentComputedFractionNumber}
                  </span>
                )}
              </div>
            </div>

            <div className="absolute bottom-1 right-2 z-10 text-[7px] font-bold font-mono text-stone-500 select-none uppercase tracking-widest bg-white/50 px-1 rounded-sm">
              {rawRatioPart === "auto" ? "content native aspect" : "fixed ratio mapping"}
            </div>
          </motion.div>
        </div>

        {/* Footer info display */}
        <div className="flex justify-between items-end z-15 pl-1 select-none shrink-0 pt-1 border-t border-stone-200/50">
          <div className="flex flex-col">
            <span className="text-[7.5px] font-mono font-extrabold text-stone-450 uppercase leading-none">
              Applied Specification
            </span>
            <span className="text-[10px] font-extrabold text-indigo-650 leading-tight mt-0.5">
              {activePreset ? activePreset.label : "Custom Render Multiplier"}
            </span>
          </div>
          {rawRatioPart === "auto" && (
            <span className="text-[8.5px] font-serif italic text-stone-500 leading-none font-medium">
              * Dimensions match dynamic native text contents
            </span>
          )}
        </div>
      </div>

      {/* 3. Preset selectors Grid layout */}
      <div className="flex flex-col gap-2.5 relative z-10 select-none">
        <span className="text-[9.5px] font-black text-stone-450 uppercase tracking-wider font-mono pl-1 flex items-center gap-1.5">
          <Sparkles size={11} className="text-stone-400" />
          <span>Preset Ratio Layouts</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PRESETS.map((preset) => {
            const isSelected = rawRatioPart === preset.value;
            const Icon = preset.icon;

            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => handleApplyRatio(preset.value)}
                className={`text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between shadow-3xs ${
                  isSelected
                    ? "bg-white border-indigo-400 shadow-sm ring-1 ring-indigo-500/10"
                    : "bg-white hover:bg-stone-100/30 border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-1.5 rounded-xl border flex-shrink-0 ${isSelected ? "bg-indigo-50 border-indigo-150" : "bg-stone-50 border-stone-150"}`}>
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-650" : "text-stone-500"}`} />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className={`text-[10px]/tight font-extrabold truncate ${isSelected ? "text-stone-850" : "text-stone-650"}`}>
                      {preset.label}
                    </span>
                    <span className="text-[8px] text-stone-400 leading-tight truncate mt-0.5">
                      {preset.value}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 ml-1">
                  {isSelected ? (
                    <div className="bg-indigo-600 text-white p-0.5 rounded-full shadow-3xs">
                      <Check size={9} className="stroke-[3.5]" />
                    </div>
                  ) : (
                    <span className="text-[8px] font-mono font-bold text-stone-400 bg-stone-50 border border-stone-200/60 px-1.5 py-0.5 rounded-md">
                      {preset.fractionLabel}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Fine-tuning Configurator Fields and Sliders */}
      <div className="bg-white border border-stone-200 rounded-3xl p-5 flex flex-col gap-4 shadow-3xs relative z-10">
        
        {/* Header fine-tuning and Fallback Toggle */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <Settings2 size={12} className="text-stone-400 shrink-0" />
            <span className="text-[10.5px] font-black text-stone-650 font-mono uppercase tracking-wider">
              Free-form Coef Settings
            </span>
          </div>
          
          <button
            type="button"
            onClick={handleToggleAutoCombine}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-[9px] font-mono font-black transition-all cursor-pointer select-none ${
              isAutoCombined 
                ? "bg-indigo-55/90 border-indigo-250 text-indigo-700 shadow-3xs font-extrabold"
                : "bg-stone-50 border-stone-200/80 text-stone-500 hover:text-stone-850"
            }`}
            title="Sinks the 'auto' rule prefix context before aspect ratios"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isAutoCombined ? "bg-indigo-550 animate-pulse" : "bg-stone-400"}`} />
            <span>Auto Fallback Prefix</span>
          </button>
        </div>

        {/* Split Factor dials inputs side-by-side */}
        <div className="flex items-center justify-between gap-4 mt-1">
          
          {/* Width Input factor */}
          <div className="flex-1 flex flex-col gap-1.5">
            <span className="text-[8.5px] font-bold uppercase tracking-wider font-mono text-stone-400 text-center select-none">
              Width Coeff (W)
            </span>
            <div className="flex items-center justify-between gap-1.5 bg-stone-50 border border-stone-200 rounded-xl p-1.5">
              <button
                type="button"
                onClick={() => {
                  const val = Math.max(1, widthRatio - 1);
                  setWidthRatio(val);
                  handleApplyRatio(`${val} / ${heightRatio}`);
                }}
                className="w-7 h-7 rounded-lg bg-white border border-stone-200/80 flex items-center justify-center text-xs font-black text-stone-600 hover:bg-stone-100 cursor-pointer select-none"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="32"
                value={widthRatio}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val > 0) {
                    setWidthRatio(val);
                    handleApplyRatio(`${val} / ${heightRatio}`);
                  }
                }}
                className="w-12 bg-transparent text-center font-mono font-black text-xs text-stone-800 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  const val = Math.min(32, widthRatio + 1);
                  setWidthRatio(val);
                  handleApplyRatio(`${val} / ${heightRatio}`);
                }}
                className="w-7 h-7 rounded-lg bg-white border border-stone-200/80 flex items-center justify-center text-xs font-black text-stone-600 hover:bg-stone-100 cursor-pointer select-none"
              >
                +
              </button>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center justify-center pt-3 select-none">
            <span className="text-lg font-serif text-stone-300 font-bold leading-none">/</span>
            <span className="text-[7.5px] font-mono text-stone-400 uppercase tracking-widest leading-none mt-1">
              VS
            </span>
          </div>

          {/* Height Input factor */}
          <div className="flex-1 flex flex-col gap-1.5">
            <span className="text-[8.5px] font-bold uppercase tracking-wider font-mono text-stone-400 text-center select-none">
              Height Coeff (H)
            </span>
            <div className="flex items-center justify-between gap-1.5 bg-stone-50 border border-stone-200 rounded-xl p-1.5">
              <button
                type="button"
                onClick={() => {
                  const val = Math.max(1, heightRatio - 1);
                  setHeightRatio(val);
                  handleApplyRatio(`${widthRatio} / ${val}`);
                }}
                className="w-7 h-7 rounded-lg bg-white border border-stone-200/80 flex items-center justify-center text-xs font-black text-stone-600 hover:bg-stone-100 cursor-pointer select-none"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="32"
                value={heightRatio}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val > 0) {
                    setHeightRatio(val);
                    handleApplyRatio(`${widthRatio} / ${val}`);
                  }
                }}
                className="w-12 bg-transparent text-center font-mono font-black text-xs text-stone-800 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  const val = Math.min(32, heightRatio + 1);
                  setHeightRatio(val);
                  handleApplyRatio(`${widthRatio} / ${val}`);
                }}
                className="w-7 h-7 rounded-lg bg-white border border-stone-200/80 flex items-center justify-center text-xs font-black text-stone-600 hover:bg-stone-100 cursor-pointer select-none"
              >
                +
              </button>
            </div>
          </div>

        </div>

        {/* Coeff tactile fine sliders */}
        <div className="flex flex-col gap-3 mt-1 bg-stone-50 border border-stone-150 p-3.5 rounded-2xl select-none">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[7.5px] font-mono text-stone-400 font-bold">
              <span>WIDTH SCALE (W): {widthRatio}</span>
              <span>LIMIT 32</span>
            </div>
            <input
              type="range"
              min="1"
              max="32"
              step="0.5"
              value={widthRatio}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setWidthRatio(val);
                handleApplyRatio(`${val} / ${heightRatio}`);
              }}
              className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-650"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[7.5px] font-mono text-stone-400 font-bold">
              <span>HEIGHT SCALE (H): {heightRatio}</span>
              <span>LIMIT 32</span>
            </div>
            <input
              type="range"
              min="1"
              max="32"
              step="0.5"
              value={heightRatio}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setHeightRatio(val);
                handleApplyRatio(`${widthRatio} / ${val}`);
              }}
              className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-650"
            />
          </div>
        </div>

        {/* Freeform custom manual code field */}
        <div className="flex items-center gap-2 src-override pt-2 border-t border-stone-100">
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="text-[7.5px] font-mono font-bold text-stone-400 uppercase tracking-widest pl-1">
              Raw CSS Explicit Vector Override
            </span>
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="e.g. calc(16 / 9)"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-[10px] font-mono text-stone-850 outline-none focus:border-indigo-400 focus:bg-white"
            />
          </div>
          
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setWidthRatio(16);
                setHeightRatio(9);
              }}
              className="w-8 h-8 rounded-xl bg-stone-50 hover:bg-stone-100 hover:text-red-500 border border-stone-200 flex items-center justify-center text-stone-450 transition-colors ml-auto cursor-pointer"
              title="Reset config to default setting auto layout"
            >
              <RotateCcw size={12} className="stroke-[2.5]" />
            </button>
          )}
        </div>

      </div>

      {/* 5. Helpful Info Callout */}
      <div className="bg-indigo-50/40 border border-indigo-100/50 p-4 rounded-2xl flex items-start gap-2.5 relative z-10 select-none">
        <div className="p-1 rounded-lg bg-indigo-100/60 text-indigo-850 shrink-0 mt-0.5">
          <Info size={13} className="stroke-[2.5]" />
        </div>
        <p className="text-[9.5px]/relaxed text-stone-550 font-medium">
          The <b>aspect-ratio</b> property establishes dynamic proportions. It effectively eliminates layout shifts (CLS), guaranteeing stable viewport sizing before heavy image bytes arrive. Always leave at least one target bounds axis as <code>auto</code> for correct responsive parsing.
        </p>
      </div>

    </div>
  );
}
