import React from "react";
import { ChevronDown } from "lucide-react";

export type PropertyControlType = "select" | "number" | "text";

export interface Option {
  value: string;
  label: string;
}

export interface PropertyControlProps {
  key?: string | number;
  label?: string;
  type?: PropertyControlType;
  value: string;
  onChange: (value: string) => void;
  options?: Option[];
  placeholder?: string;
  unit?: string;
}

export function PropertyControl({
  label,
  type = "select",
  value,
  onChange,
  options = [],
  placeholder,
  unit = "px"
}: PropertyControlProps) {
  // Try to parse out numeric value if it contains a unit (like wrapper classes, e.g., '[15px]')
  let displayValue = value;
  if (type === "number") {
    const match = value?.match(/\[?(-?\d*\.?\d+)/);
    if (match) {
      displayValue = match[1];
    } else if (value === "" && options.length > 0) {
      displayValue = "";
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      onChange("");
    } else {
      onChange(`${val}${unit}`);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full relative">
      {label && <label className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider pl-1">{label}</label>}
      {type === "select" ? (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none bg-stone-50 border border-stone-200/85 rounded-xl pl-2.5 pr-6 py-1.5 text-xs text-stone-700 hover:bg-stone-100 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 cursor-pointer shadow-sm transition-all text-left"
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
        </div>
      ) : type === "number" ? (
        <div className="relative flex items-center bg-stone-50 border border-stone-200/85 rounded-xl overflow-hidden shadow-sm hover:bg-stone-100 transition-all focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-rose-500/10">
          <input
            type="number"
            value={displayValue}
            onChange={handleNumberChange}
            placeholder={placeholder || "Auto"}
            className="w-full bg-transparent pl-2.5 pr-8 py-1.5 text-xs text-stone-700 focus:outline-none"
          />
          <div className="absolute right-2.5 text-[9px] font-bold text-stone-400 uppercase tracking-widest pointer-events-none">{unit}</div>
        </div>
      ) : (
        <div className="relative flex items-center bg-stone-50 border border-stone-200/85 rounded-xl overflow-hidden shadow-sm hover:bg-stone-100 transition-all focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-rose-500/10">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "e.g. auto, 100%, 10px"}
            className="w-full bg-transparent px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none font-mono"
          />
        </div>
      )}
    </div>
  );
}
