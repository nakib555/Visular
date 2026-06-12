import React, { useState, useRef, useEffect } from "react";
import { Copy, Check, Sparkles, RefreshCw, Palette } from "lucide-react";
import { VisualElement } from "../types";

// ==========================================
// COLOR TYPE DEFINITIONS & HELPER FUNCTIONS
// ==========================================

export interface HSLColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
  a: number; // 0-1
}

// Convert HSL to HSV (for the 2D saturation/value grid)
export function hslToHsv(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const v = l + s * Math.min(l, 1 - l);
  const sv = v === 0 ? 0 : 2 * (1 - l / v);
  return {
    h,
    s: Math.round(sv * 100),
    v: Math.round(v * 100),
  };
}

// Convert HSV/HSB back to HSL for styles
export function hsvToHsl(h: number, s: number, v: number) {
  s /= 100;
  v /= 100;
  const l = v * (1 - s / 2);
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
  return {
    h,
    s: Math.round(sl * 100),
    l: Math.round(l * 100),
  };
}

// Parse any color string (Hex, RGB, HSL) into HSLColor
export function parseColorToHsl(colorStr: string): HSLColor {
  const defaultColor: HSLColor = { h: 220, s: 70, l: 50, a: 1 };
  if (!colorStr) return defaultColor;

  const trimmed = colorStr.trim().toLowerCase();

  if (trimmed === "transparent") {
    return { h: 0, s: 0, l: 0, a: 0 };
  }
  if (trimmed === "currentcolor" || trimmed === "currentColor") {
    return { h: 0, s: 0, l: 50, a: 1 };
  }

  // 1. Hex format (simple parse)
  if (trimmed.startsWith("#")) {
    const raw = trimmed.substring(1);
    let r = 0, g = 0, b = 0, a = 1;
    if (raw.length === 3) {
      r = parseInt(raw[0] + raw[0], 16);
      g = parseInt(raw[1] + raw[1], 16);
      b = parseInt(raw[2] + raw[2], 16);
    } else if (raw.length === 4) {
      r = parseInt(raw[0] + raw[0], 16);
      g = parseInt(raw[1] + raw[1], 16);
      b = parseInt(raw[2] + raw[2], 16);
      a = parseInt(raw[3] + raw[3], 16) / 255;
    } else if (raw.length === 6) {
      r = parseInt(raw.substring(0, 2), 16);
      g = parseInt(raw.substring(2, 4), 16);
      b = parseInt(raw.substring(4, 6), 16);
    } else if (raw.length === 8) {
      r = parseInt(raw.substring(0, 2), 16);
      g = parseInt(raw.substring(2, 4), 16);
      b = parseInt(raw.substring(4, 6), 16);
      a = parseInt(raw.substring(6, 8), 16) / 255;
    } else {
      return defaultColor;
    }
    return { ...rgbToHsl(r, g, b), a };
  }

  // 2. HSL/HSLA format matching
  const hslMatch = trimmed.match(
    /^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?(?:\s*,\s*([\d.]+))?\s*\)$/,
  );
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]);
    const s = parseFloat(hslMatch[2]);
    const l = parseFloat(hslMatch[3]);
    const a = hslMatch[4] !== undefined ? parseFloat(hslMatch[4]) : 1;
    return {
      h: Math.max(0, Math.min(360, h)),
      s: Math.max(0, Math.min(100, s)),
      l: Math.max(0, Math.min(100, l)),
      a: Math.max(0, Math.min(1, a)),
    };
  }

  // 3. RGB/RGBA format matching
  const rgbMatch = trimmed.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/,
  );
  if (rgbMatch) {
    const r = parseFloat(rgbMatch[1]);
    const g = parseFloat(rgbMatch[2]);
    const b = parseFloat(rgbMatch[3]);
    const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
    return {
      ...rgbToHsl(r, g, b),
      a: Math.max(0, Math.min(1, a)),
    };
  }

  // Common named CSS color fallbacks
  const nameMap: Record<string, string> = {
    red: "#ff0000",
    green: "#00ff00",
    blue: "#0000ff",
    white: "#ffffff",
    black: "#000000",
    yellow: "#ffff00",
    cyan: "#00ffff",
    magenta: "#ff00ff",
    orange: "#ffa500",
    pink: "#ffc0cb",
    purple: "#800080",
    teal: "#008080",
  };
  if (nameMap[trimmed]) {
    return parseColorToHsl(nameMap[trimmed]);
  }

  return defaultColor;
}

export function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(
  h: number,
  s: number,
  l: number,
): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  let r = l;
  let g = l;
  let b = l;

  if (s !== 0) {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  const toHex = (x: number) => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Extract unique dynamic colors from the workspace component style tree
export function extractThemeColors(tree: VisualElement): string[] {
  const colors = new Set<string>();

  // Add some fallback polished modern defaults
  const baseDefaults = [
    "#f43f5e", // Rose
    "#6366f1", // Indigo
    "#10b981", // Emerald
    "#eab308", // Yellow
    "#0ea5e9", // Sky
    "#d946ef", // Fuchsia
    "#1e293b", // Slate
    "#ffffff", // White
    "#1c1917", // Stone
  ];

  function traverse(node: VisualElement) {
    if (!node) return;

    const classesStr = node.classes || "";
    // Regex matches arbitrary properties like: [color:#f43f5e] or [background-color:hsl(220,10,12)]
    const arbitraryMatches = classesStr.matchAll(
      /\[(?:color|background-color|fill|stroke|border-color|outline-color):([^\]]+)\]/g,
    );
    for (const match of arbitraryMatches) {
      if (match && match[1]) {
        const val = match[1].replace(/_/g, " ").trim();
        if (
          val !== "inherit" &&
          val !== "initial" &&
          val !== "transparent" &&
          val !== "currentColor"
        ) {
          // Normalize to HEX if it is a standard hex
          if (/^#[0-9a-fA-F]{3,8}$/.test(val)) {
            colors.add(val.toLowerCase());
          } else {
            colors.add(val);
          }
        }
      }
    }

    // Capture standard Hex patterns
    const hexMatches = classesStr.match(/#[0-9a-fA-F]{3,8}\b/g);
    if (hexMatches) {
      hexMatches.forEach((c) => colors.add(c.toLowerCase()));
    }

    // Capture standard HSLA patterns
    const hslMatches = classesStr.match(/hsla?\([^\)]+\)/g);
    if (hslMatches) {
      hslMatches.forEach((c) => colors.add(c.replace(/_/g, " ")));
    }

    // Capture standard RGBA patterns
    const rgbMatches = classesStr.match(/rgba?\([^\)]+\)/g);
    if (rgbMatches) {
      rgbMatches.forEach((c) => colors.add(c.replace(/_/g, " ")));
    }

    // Also match basic Tailwind color values and convert them for swatches
    const twReg =
      /\b(?:bg|text|border|fill|stroke)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)\b/g;
    const twMatches = classesStr.matchAll(twReg);
    for (const m of twMatches) {
      if (m) {
        const hex = getTailwindColorHex(m[1], m[2]);
        if (hex) colors.add(hex);
      }
    }

    if (node.children) {
      node.children.forEach(traverse);
    }
  }

  traverse(tree);

  // Merge harvested colors with base defaults
  const uniqueList = Array.from(colors);
  baseDefaults.forEach((fallback) => {
    if (uniqueList.length < 15 && !uniqueList.includes(fallback)) {
      uniqueList.push(fallback);
    }
  });

  return uniqueList.slice(0, 16);
}

function getTailwindColorHex(name: string, shade: string): string | null {
  const MAP: Record<string, Record<string, string>> = {
    rose: { "100": "#ffe4e6", "500": "#f43f5e", "600": "#e11d48", "700": "#be123c" },
    pink: { "100": "#fce7f3", "500": "#ec4899", "600": "#db2777", "700": "#be185d" },
    fuchsia: { "500": "#d946ef", "600": "#c026d3" },
    purple: { "500": "#a855f7", "600": "#9333ea" },
    violet: { "500": "#8b5cf6", "600": "#7c3aed" },
    indigo: { "100": "#e0e7ff", "500": "#6366f1", "600": "#4f46e5", "700": "#4338ca" },
    blue: { "100": "#dbeafe", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8" },
    sky: { "500": "#0ea5e9", "600": "#0284c7" },
    cyan: { "500": "#06b6d4" },
    teal: { "500": "#14b8a6", "600": "#0d9488" },
    emerald: { "100": "#d1fae5", "500": "#10b981", "600": "#059669" },
    green: { "500": "#22c55e", "600": "#16a34a" },
    lime: { "500": "#84cc16" },
    yellow: { "500": "#eab308" },
    amber: { "500": "#f59e0b" },
    orange: { "500": "#f97316" },
    red: { "100": "#fee2e2", "500": "#ef4444", "600": "#dc2626", "700": "#b91c1c" },
    stone: { "100": "#f5f5f4", "500": "#78716c", "800": "#292524" },
    zinc: { "500": "#71717a", "800": "#27272a" },
    slate: { "100": "#f1f5f9", "500": "#64748b", "800": "#1e293b" },
    gray: { "100": "#f3f4f6", "500": "#9ca3af", "800": "#1f2937" },
  };
  return MAP[name]?.[shade] || MAP[name]?.["500"] || null;
}

// ==========================================
// HSL COLOR PICKER HOOKS & COMPONENT
// ==========================================

export interface HslColorPickerProps {
  propName: string;
  value: string;
  onChange: (val: string) => void;
  rootComponentTree: VisualElement;
}

export function HslColorPicker({
  propName,
  value,
  onChange,
  rootComponentTree,
}: HslColorPickerProps) {
  // Parse incoming value to structural state
  const rawHsl = parseColorToHsl(value);
  const [h, setH] = useState(rawHsl.h);
  const [s, setS] = useState(rawHsl.s);
  const [l, setL] = useState(rawHsl.l);
  const [a, setA] = useState(rawHsl.a);

  // Sync internal state with incoming prop updates to match editor adjustments
  useEffect(() => {
    const updated = parseColorToHsl(value);
    setH(updated.h);
    setS(updated.s);
    setL(updated.l);
    setA(updated.a);
  }, [value]);

  const [copied, setCopied] = useState(false);
  const [themeColors, setThemeColors] = useState<string[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);

  // Compute theme colors from the workspace
  useEffect(() => {
    if (rootComponentTree) {
      setThemeColors(extractThemeColors(rootComponentTree));
    }
  }, [rootComponentTree]);

  // Derive Hue/Saturation/Value (HSV/HSB) representation for Figma-style 2D Board coordinates
  const hsvRepresentation = hslToHsv(h, s, l);
  const saturationHsv = hsvRepresentation.s;
  const valueHsv = hsvRepresentation.v;

  // Format active styles dynamically
  const solidColorHsl = `hsl(${h}, 100%, 50%)`;
  const activeColorHsla = `hsla(${h}, ${s}%, ${l}%, ${a})`;
  const hexCode = hslToHex(h, s, l);

  // Updates full state and fires callback using either direct hsla or simplified hsl
  const fireColorChange = (hVal: number, sVal: number, lVal: number, aVal: number) => {
    setH(hVal);
    setS(sVal);
    setL(lVal);
    setA(aVal);

    if (aVal === 1) {
      const hslString = `hsl(${hVal}, ${sVal}%, ${lVal}%)`;
      onChange(hslString);
    } else {
      const hslaString = `hsla(${hVal}, ${sVal}%, ${lVal}%, ${parseFloat(aVal.toFixed(2))})`;
      onChange(hslaString);
    }
  };

  // Figma-style 2D Canvas board pointer/touch handler
  const handleBoardPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    // X axis represents Saturation (0% to 100%)
    const sHsv = Math.round((x / rect.width) * 100);
    // Y axis represents Value/Brightness (100% at the top, 0% at the bottom)
    const vHsv = Math.round(100 - (y / rect.height) * 100);

    const converted = hsvToHsl(h, sHsv, vHsv);
    fireColorChange(h, converted.s, converted.l, a);
  };

  const handleBoardPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleBoardPointer(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleBoardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons > 0) {
      handleBoardPointer(e);
    }
  };

  // Quick Swatch applying callback
  const selectSwatch = (colorStr: string) => {
    const parsed = parseColorToHsl(colorStr);
    fireColorChange(parsed.h, parsed.s, parsed.l, parsed.a);
  };

  const copyToClipboard = () => {
    const textToCopy = a === 1 ? hexCode : activeColorHsla;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const isCurrentSelection = (colorStr: string): boolean => {
    const parsed = parseColorToHsl(colorStr);
    return (
      Math.abs(parsed.h - h) < 3 &&
      Math.abs(parsed.s - s) < 3 &&
      Math.abs(parsed.l - l) < 3 &&
      Math.abs(parsed.a - a) < 0.05
    );
  };

  return (
    <div id={`hsl-color-picker-${propName}`} className="flex flex-col gap-3.5 p-3 bg-white border border-stone-200/95 rounded-2xl shadow-xs text-left animate-fade-in">
      
      {/* 2D SATURATION & VALUE INTERACTIVE CANVAS */}
      <div
        ref={boardRef}
        onPointerDown={handleBoardPointerDown}
        onPointerMove={handleBoardPointerMove}
        className="w-full h-32 rounded-xl relative overflow-hidden cursor-crosshair select-none touch-none shadow-inner border border-stone-200/50"
        style={{ backgroundColor: solidColorHsl }}
      >
        {/* White-to-transparent horizontal mask (saturation) */}
        <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
        {/* Transparent-to-black vertical mask (brightness/value) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

        {/* Circular custom pointer node */}
        <div
          className="absolute w-3.5 h-3.5 -ml-[7px] -mt-[7px] rounded-full border-2 border-white pointer-events-none shadow-md"
          style={{
            left: `${saturationHsv}%`,
            top: `${100 - valueHsv}%`,
            backgroundColor: activeColorHsla,
          }}
        />
      </div>

      {/* CORE ADJUSTMENT SLIDERS (HUE, SATURATION, LIGHTNESS, ALPHA) */}
      <div className="flex flex-col gap-2 p-1">
        {/* 1. Hue Spectrum Slider */}
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between items-center text-[9px] font-bold font-mono text-stone-500 uppercase">
            <span>Hue Spectrum</span>
            <span className="text-stone-700">{h}°</span>
          </div>
          <div className="relative h-2.5 w-full rounded-full cursor-pointer border border-stone-200/30 flex items-center">
            <input
              type="range"
              min="0"
              max="360"
              value={h}
              onChange={(e) => fireColorChange(Number(e.target.value), s, l, a)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {/* Background Spectrum Bar */}
            <div
              className="w-full h-[6px] rounded-full"
              style={{
                background:
                  "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
              }}
            />
            {/* Custom slider thumb overlay */}
            <div
              className="absolute w-3 h-3 rounded-full border border-white shadow-sm -ml-1.5 pointer-events-none"
              style={{
                left: `${(h / 360) * 100}%`,
                backgroundColor: `hsl(${h}, 100%, 50%)`,
              }}
            />
          </div>
        </div>

        {/* 2. Saturation Gradation Slider */}
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between items-center text-[9px] font-bold font-mono text-stone-500 uppercase">
            <span>Saturation</span>
            <span className="text-stone-700">{s}%</span>
          </div>
          <div className="relative h-2.5 w-full rounded-full cursor-pointer border border-stone-200/30 flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={s}
              onChange={(e) => fireColorChange(h, Number(e.target.value), l, a)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {/* Background Saturation Slider Gradient representing Gray to Selected Hue Color */}
            <div
              className="w-full h-[6px] rounded-full"
              style={{
                background: `linear-gradient(to right, hsl(${h}, 0%, ${l}%), hsl(${h}, 100%, ${l}%))`,
              }}
            />
            {/* Custom thumb overlay */}
            <div
              className="absolute w-3 h-3 rounded-full border border-white shadow-sm -ml-1.5 pointer-events-none"
              style={{
                left: `${s}%`,
                backgroundColor: `hsl(${h}, ${s}%, ${l}%)`,
              }}
            />
          </div>
        </div>

        {/* 3. Lightness Tone Slider */}
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between items-center text-[9px] font-bold font-mono text-stone-500 uppercase">
            <span>Lightness</span>
            <span className="text-stone-700">{l}%</span>
          </div>
          <div className="relative h-2.5 w-full rounded-full cursor-pointer border border-stone-200/30 flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={l}
              onChange={(e) => fireColorChange(h, s, Number(e.target.value), a)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {/* Background Lightness Slider Gradient representing Black to active color to White */}
            <div
              className="w-full h-[6px] rounded-full"
              style={{
                background: `linear-gradient(to right, #000 0%, hsl(${h}, ${s}%, 50%) 50%, #fff 100%)`,
              }}
            />
            {/* Custom thumb overlay */}
            <div
              className="absolute w-3 h-3 rounded-full border border-white shadow-sm -ml-1.5 pointer-events-none"
              style={{
                left: `${l}%`,
                backgroundColor: `hsl(${h}, ${s}%, ${l}%)`,
              }}
            />
          </div>
        </div>

        {/* 4. Alpha/Opacity Transparency Slider */}
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between items-center text-[9px] font-bold font-mono text-stone-500 uppercase">
            <span>Opacity Alpha</span>
            <span className="text-stone-700">{Math.round(a * 100)}%</span>
          </div>
          <div className="relative h-2.5 w-full rounded-full cursor-pointer border border-stone-200/30 flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={a}
              onChange={(e) => fireColorChange(h, s, l, Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {/* Standard Transparency Checkerboard Container overlay */}
            <div className="absolute inset-y-[2px] left-0 right-0 h-[6px] rounded-full overflow-hidden flex items-stretch">
              <div
                className="w-full h-full rounded-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #ccc 20%, transparent 20%), radial-gradient(circle, #ccc 20%, transparent 20%)",
                  backgroundSize: "6px 6px",
                  backgroundPosition: "0 0, 3px 3px",
                  backgroundColor: "#fff",
                }}
              />
            </div>
            {/* Active Alpha overlay */}
            <div
              className="absolute inset-y-[2px] left-0 right-0 h-[6px] rounded-full"
              style={{
                background: `linear-gradient(to right, transparent, hsl(${h}, ${s}%, ${l}%))`,
              }}
            />
            {/* Custom thumb overlay */}
            <div
              className="absolute w-3 h-3 rounded-full border border-white shadow-sm -ml-1.5 pointer-events-none"
              style={{
                left: `${a * 100}%`,
                backgroundColor: activeColorHsla,
              }}
            />
          </div>
        </div>
      </div>

      {/* CORE PREVIEW & DIRECT TEXT VALUES */}
      <div className="flex items-center gap-3 border-t border-stone-100 pt-3">
        {/* Large color preview disk overlaying checkerboard patterns */}
        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-xs shrink-0 bg-stone-100 border border-stone-200">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ddd 15%, transparent 15%), radial-gradient(circle, #ddd 15%, transparent 15%)",
              backgroundSize: "8px 8px",
              backgroundPosition: "0 0, 4px 4px",
              backgroundColor: "#fff",
            }}
          />
          <div
            className="absolute inset-0 transition-colors"
            style={{ backgroundColor: activeColorHsla }}
          />
        </div>

        {/* Input Text Form Parameters */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex gap-1.5">
            <div className="flex-1 relative">
              <input
                type="text"
                value={a === 1 ? hexCode : activeColorHsla}
                onChange={(e) => {
                  const val = e.target.value;
                  const parsed = parseColorToHsl(val);
                  fireColorChange(parsed.h, parsed.s, parsed.l, parsed.a);
                }}
                className="w-full bg-stone-50 border border-stone-200/80 rounded-xl px-2.5 py-1 text-[10px] focus:outline-none focus:border-rose-500 font-mono text-stone-800"
                style={{ fontSize: "9.5px" }}
                title="Current CSS output value"
              />
            </div>
            <button
              type="button"
              onClick={copyToClipboard}
              className="px-2.5 py-1.5 shrink-0 bg-stone-50 hover:bg-stone-100/80 border border-stone-200/80 hover:border-stone-300 rounded-xl transition-all duration-150 cursor-pointer text-stone-500 hover:text-stone-800 active:scale-95 flex items-center justify-center"
              title="Copy CSS color value to clipboard"
            >
              {copied ? (
                <Check size={11} className="text-emerald-600 font-bold" />
              ) : (
                <Copy size={11} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* DETAILED PROPERTY NUMBER ADJUSTER CELLS */}
      <div className="grid grid-cols-4 gap-1 bg-stone-50/60 p-1.5 border border-stone-200/40 rounded-xl">
        <div className="flex flex-col items-center">
          <span className="text-[7.5px] font-mono font-bold tracking-widest text-stone-400 uppercase">H</span>
          <input
            type="number"
            min="0"
            max="360"
            value={h}
            onChange={(e) => {
              const val = Math.max(0, Math.min(360, Number(e.target.value)));
              fireColorChange(val, s, l, a);
            }}
            className="w-full bg-transparent text-center text-[10px] font-bold font-mono focus:outline-none text-stone-700"
          />
        </div>
        <div className="flex flex-col items-center border-l border-stone-200/50">
          <span className="text-[7.5px] font-mono font-bold tracking-widest text-stone-400 uppercase">S%</span>
          <input
            type="number"
            min="0"
            max="100"
            value={s}
            onChange={(e) => {
              const val = Math.max(0, Math.min(100, Number(e.target.value)));
              fireColorChange(h, val, l, a);
            }}
            className="w-full bg-transparent text-center text-[10px] font-bold font-mono focus:outline-none text-stone-700"
          />
        </div>
        <div className="flex flex-col items-center border-l border-stone-200/50">
          <span className="text-[7.5px] font-mono font-bold tracking-widest text-stone-400 uppercase">L%</span>
          <input
            type="number"
            min="0"
            max="100"
            value={l}
            onChange={(e) => {
              const val = Math.max(0, Math.min(100, Number(e.target.value)));
              fireColorChange(h, s, val, a);
            }}
            className="w-full bg-transparent text-center text-[10px] font-bold font-mono focus:outline-none text-stone-700"
          />
        </div>
        <div className="flex flex-col items-center border-l border-stone-200/50">
          <span className="text-[7.5px] font-mono font-bold tracking-widest text-stone-400 uppercase">A%</span>
          <input
            type="number"
            min="0"
            max="100"
            value={Math.round(a * 100)}
            onChange={(e) => {
              const val = Math.max(0, Math.min(100, Number(e.target.value))) / 100;
              fireColorChange(h, s, l, val);
            }}
            className="w-full bg-transparent text-center text-[10px] font-bold font-mono focus:outline-none text-stone-700"
          />
        </div>
      </div>

      {/* HARVESTED THERMAL PALETTE OF `THEME COLORS` */}
      <div className="border-t border-stone-100 pt-3 flex flex-col gap-1.5">
        <div className="flex justify-between items-center pl-0.5">
          <span className="text-[8.5px] font-extrabold text-stone-450 uppercase tracking-widest font-mono flex items-center gap-1">
            <Palette size={10} className="text-rose-500 animate-pulse" />
            <span>Harmonized Theme Colors</span>
          </span>
          <span className="text-[7.5px] font-mono font-medium text-stone-400">
            {themeColors.length} unique values
          </span>
        </div>
        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-0.5">
          {themeColors.length === 0 ? (
            <span className="text-[8.5px] text-stone-400 py-1 pl-0.5 font-mono">
              Analyzing styles tree...
            </span>
          ) : (
            themeColors.map((colStr, colIdx) => {
              const active = isCurrentSelection(colStr);
              return (
                <button
                  key={`${colStr}-${colIdx}`}
                  type="button"
                  onClick={() => selectSwatch(colStr)}
                  className={`w-5.5 h-5.5 rounded-lg border relative transition-all active:scale-90 cursor-pointer shadow-xs ${
                    active
                      ? "ring-2 ring-rose-500 scale-110 border-rose-600 shadow-sm"
                      : "border-stone-200 hover:scale-105 hover:border-stone-400"
                  }`}
                  style={{ backgroundColor: colStr }}
                  title={`Harmonized color: ${colStr}`}
                >
                  {/* Subtle checkmark overlay top-right */}
                  {active && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
                      <Check size={8} className="text-white font-bold" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
