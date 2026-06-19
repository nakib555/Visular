import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Type, 
  RotateCcw, 
  ChevronDown, 
  Search, 
  Check, 
  Sparkles, 
  SlidersHorizontal, 
  Shuffle, 
  CaseUpper, 
  ALargeSmall,
  BookOpen,
  Eye,
  Settings2,
  Lock,
  Globe,
  Heading1,
  FileCode,
  ArrowDown,
  Trash2,
  Plus,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Workflow,
  Compass,
  ArrowUp,
  Sliders
} from "lucide-react";

interface FontFamilyControlProps {
  value: string;
  onChange: (val: string) => void;
  propName?: string;
}

interface FontOption {
  value: string;
  label: string;
  category: "sans-serif" | "serif" | "monospace" | "display";
  vibe: string;
  description: string;
  sample: string;
  pairing: string;
  accent: string;
  badgeBg: string;
  clsRisk: "Very Low" | "Low" | "Medium" | "High" | "Extreme";
  clsScoreHex: string;
}

// Curated high-performance premium web font options
const PRESET_FONTS: FontOption[] = [
  {
    value: "Inter, sans-serif",
    label: "Inter",
    category: "sans-serif",
    vibe: "Swiss / Modern / Highly Legible",
    description: "Designed for high legibility on computer screens. Clean, objective, and neutral.",
    sample: "Aesthetic & Balance",
    pairing: "Playfair Display, serif",
    accent: "bg-teal-500",
    badgeBg: "bg-teal-50 text-teal-700 border-teal-100",
    clsRisk: "Low",
    clsScoreHex: "f59e0b"
  },
  {
    value: '"Space Grotesk", sans-serif',
    label: "Space Grotesk",
    category: "sans-serif",
    vibe: "Geometric / Tech / Brutalist",
    description: "Raw, geometric accents with high aperture and idiosyncratic terminal glyphs.",
    sample: "Brutalist Geometry",
    pairing: "JetBrains Mono, monospace",
    accent: "bg-indigo-500",
    badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
    clsRisk: "High",
    clsScoreHex: "ef4444"
  },
  {
    value: "system-ui, sans-serif",
    label: "System UI Default",
    category: "sans-serif",
    vibe: "Native OS / Fast / Humble",
    description: "Replaces font loading with immediate native platform fonts (SF Pro, Segoe UI, Roboto).",
    sample: "Performant Architecture",
    pairing: "ui-monospace, monospace",
    accent: "bg-stone-500",
    badgeBg: "bg-stone-100 text-stone-700 border-stone-200",
    clsRisk: "Very Low",
    clsScoreHex: "22c55e"
  },
  {
    value: '"DM Sans", sans-serif',
    label: "DM Sans",
    category: "sans-serif",
    vibe: "Modern / Soft / Friendly",
    description: "Geometric sans-serif with subtle warm humanist proportions for app UI panels.",
    sample: "Intuitive Interface",
    pairing: "Cormorant Garamond",
    accent: "bg-blue-500",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-100",
    clsRisk: "Low",
    clsScoreHex: "f59e0b"
  },
  {
    value: '"Outfit", sans-serif',
    label: "Outfit",
    category: "sans-serif",
    vibe: "Geometric / Luxury / Pure",
    description: "Modern circular curves. Premium feeling, great for high-end lifestyle products.",
    sample: "Designed Perfection",
    pairing: "Lora, serif",
    accent: "bg-emerald-500",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
    clsRisk: "Medium",
    clsScoreHex: "f59e0b"
  },
  {
    value: '"Playfair Display", Georgia, serif',
    label: "Playfair Display",
    category: "serif",
    vibe: "Editorial / Classical / Rich",
    description: "High-contrast serif in the transitional style of John Baskerville. Luxurious.",
    sample: "Literature & Culture",
    pairing: "Inter, sans-serif",
    accent: "bg-amber-600",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-100",
    clsRisk: "High",
    clsScoreHex: "ef4444"
  },
  {
    value: '"Lora", serif',
    label: "Lora",
    category: "serif",
    vibe: "Literary / Gentle / Balanced",
    description: "Warm, contemporary serif with moderate contrast and beautiful fluid curves.",
    sample: "Quiet Contemplation",
    pairing: "Outfit, sans-serif",
    accent: "bg-orange-500",
    badgeBg: "bg-orange-50 text-orange-700 border-orange-100",
    clsRisk: "Medium",
    clsScoreHex: "f59e0b"
  },
  {
    value: '"Merriweather", Garamond, serif',
    label: "Merriweather",
    category: "serif",
    vibe: "Robust / Highly Readable / Solid",
    description: "Heavy serifs and large x-height optimized for reading long screens of prose.",
    sample: "Narrative Experience",
    pairing: "DM Sans, sans-serif",
    accent: "bg-rose-500",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-100",
    clsRisk: "Medium",
    clsScoreHex: "f59e0b"
  },
  {
    value: '"Cormorant Garamond", Garamond, serif',
    label: "Cormorant",
    category: "serif",
    vibe: "Imperial / Delicate / Ultra-Refined",
    description: "Extremely elegant curves. Thin strokes are incredibly fine. Perfect for displays.",
    sample: "Grandeur of Heritage",
    pairing: "Inter, sans-serif",
    accent: "bg-pink-600",
    badgeBg: "bg-pink-50 text-pink-700 border-pink-100",
    clsRisk: "High",
    clsScoreHex: "ef4444"
  },
  {
    value: '"JetBrains Mono", Fira Code, monospace',
    label: "JetBrains Mono",
    category: "monospace",
    vibe: "Technical / Pragmatic / Square",
    description: "Specifically created for code readability. Tall x-height and clear font glyphs.",
    sample: "function renderApp()",
    pairing: "Inter, sans-serif",
    accent: "bg-purple-500",
    badgeBg: "bg-purple-50 text-purple-700 border-purple-100",
    clsRisk: "Low",
    clsScoreHex: "f59e0b"
  },
  {
    value: '"Fira Code", monospace',
    label: "Fira Code",
    category: "monospace",
    vibe: "Mathematical / Ligature Rich",
    description: "Monospaced font featuring beautiful programming ligatures (like =>, !=, ===).",
    sample: "const sum = x => y =>",
    pairing: "Space Grotesk, sans-serif",
    accent: "bg-violet-500",
    badgeBg: "bg-violet-50 text-violet-700 border-violet-100",
    clsRisk: "Medium",
    clsScoreHex: "f59e0b"
  },
  {
    value: '"Cinzel", serif',
    label: "Cinzel",
    category: "display",
    vibe: "Classical Roman / Sculpted",
    description: "Based on classical Roman inscriptions with contemporary letter proportions.",
    sample: "EMPIRE & STONE",
    pairing: "Inter, sans-serif",
    accent: "bg-yellow-600",
    badgeBg: "bg-yellow-50 text-yellow-700 border-yellow-100",
    clsRisk: "High",
    clsScoreHex: "ef4444"
  },
  {
    value: '"Syne", sans-serif',
    label: "Syne",
    category: "display",
    vibe: "Aesthetic Radical / Art-Forward",
    description: "Outrageous visual style that widens dramatically at heavier weights. Super fresh.",
    sample: "AVANT-GARDE VIBE",
    pairing: "Space Grotesk, sans-serif",
    accent: "bg-fuchsia-600",
    badgeBg: "bg-fuchsia-10 border border-fuchsia-100 text-fuchsia-700",
    clsRisk: "Extreme",
    clsScoreHex: "ef4444"
  }
];

// Clean search / selection names
const cleanFontValue = (fullVal: string) => {
  if (!fullVal) return "";
  return fullVal.replace(/['"]/g, "").split(",")[0].trim();
};

export function FontFamilyControl({ value, onChange, propName = "font-family" }: FontFamilyControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "sans-serif" | "serif" | "monospace" | "display">("all");
  
  // Custom states for interactive specialized zones
  const [activeZone, setActiveZone] = useState<"cascade" | "anatomy" | "presets" | "performance" | "sandbox">("cascade");
  const [sandboxText, setSandboxText] = useState("Craft typography with architecture.");
  const [sandboxSize, setSandboxSize] = useState(16);
  const [sandboxWeight, setSandboxWeight] = useState("400");
  const [sandboxItalic, setSandboxItalic] = useState(false);
  const [sandboxLetterSpacing, setSandboxLetterSpacing] = useState("normal");
  const [sandboxLineHeight, setSandboxLineHeight] = useState("1.5");
  const [textTransform, setTextTransform] = useState<"none" | "uppercase" | "lowercase">("none");
  
  // Microscope Anatomy State
  const [microscopeChar, setMicroscopeChar] = useState("g");
  const [customChar, setCustomChar] = useState("");

  const triggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ 
    top: number; 
    left: number; 
    width: number; 
    bottom?: number; 
    maxHeight?: number;
    placement: "top" | "bottom" 
  } | null>(null);

  // Parse comma-separated list into actual fallback cascade array
  const fontStack = useMemo(() => {
    if (!value) return ["sans-serif"];
    return value.split(",").map(f => f.trim().replace(/^['"]|['"]$/g, ""));
  }, [value]);

  // Active Main Font Option representation
  const activeFontOption = useMemo(() => {
    const primary = cleanFontValue(value);
    const matched = PRESET_FONTS.find(f => cleanFontValue(f.value).toLowerCase() === primary.toLowerCase());
    
    if (matched) return matched;
    
    // Quick custom placeholder
    return {
      value: value,
      label: primary || "Custom Font Stacking",
      category: (value.toLowerCase().includes("serif") ? "serif" : value.toLowerCase().includes("mono") ? "monospace" : "sans-serif") as any,
      vibe: "Tailored Font Cascade",
      description: "A customized stack specifying precise browser-level typographic fallbacks.",
      sample: "Custom Typography Scale",
      pairing: "system-ui, sans-serif",
      accent: "bg-rose-500",
      badgeBg: "bg-rose-50 text-rose-700 border-rose-100",
      clsRisk: (value.toLowerCase().includes("system") ? "Very Low" : "Medium") as any,
      clsScoreHex: "f59e0b"
    };
  }, [value]);

  // Pre-load current web fonts Dynamically from Google Fonts
  useEffect(() => {
    const cleanNames = fontStack.map(f => cleanFontValue(f));
    const standards = ["sans-serif", "serif", "monospace", "system-ui", "helvetica", "arial", "georgia", "garamond"];
    
    cleanNames.forEach(name => {
      if (name && !standards.includes(name.toLowerCase())) {
        const formatted = name.replace(/\s+/g, "+");
        const linkId = `gfont-${formatted}`;
        
        if (!document.getElementById(linkId)) {
          const link = document.createElement("link");
          link.id = linkId;
          link.rel = "stylesheet";
          link.href = `https://fonts.googleapis.com/css2?family=${formatted}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap`;
          document.head.appendChild(link);
        }
      }
    });
  }, [fontStack]);

  // Pre-load all preset web fonts for consistent visual rendering inside selections
  useEffect(() => {
    PRESET_FONTS.forEach(font => {
      const cleanName = cleanFontValue(font.value);
      if (cleanName !== "sans-serif" && cleanName !== "serif" && cleanName !== "monospace" && cleanName !== "system-ui") {
        const formatted = cleanName.replace(/\s+/g, "+");
        const linkId = `gfont-preload-${formatted}`;
        if (!document.getElementById(linkId)) {
          const link = document.createElement("link");
          link.id = linkId;
          link.rel = "stylesheet";
          link.href = `https://fonts.googleapis.com/css2?family=${formatted}:wght@300;400;500;600;700&display=swap`;
          document.head.appendChild(link);
        }
      }
    });
  }, []);

  // Dropdown togglers and window position math
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node) && 
        !((event.target as Element).closest("#font-family-dropdown-menu"))
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const updatePosition = () => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 350;
        
        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
          setDropdownPos({
            placement: "top",
            bottom: window.innerHeight - rect.top + 6,
            left: rect.left,
            width: rect.width,
            top: 0,
            maxHeight: spaceAbove - 16
          });
        } else {
          setDropdownPos({
            placement: "bottom",
            top: rect.bottom + 6,
            left: rect.left,
            width: rect.width,
            maxHeight: spaceBelow - 16
          });
        }
      };

      updatePosition();
      
      const handleScroll = (e: Event) => {
        if (e.target instanceof Element && e.target.closest('#font-family-dropdown-menu')) return;
        updatePosition();
      };

      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen]);

  // Searching filter matching
  const filteredFonts = useMemo(() => {
    return PRESET_FONTS.filter(f => {
      const isCorrectTab = activeTab === "all" || f.category === activeTab;
      const cleanSearch = searchQuery.toLowerCase().trim();
      const matchesSearch = f.label.toLowerCase().includes(cleanSearch) || 
                            f.vibe.toLowerCase().includes(cleanSearch) ||
                            f.category.toLowerCase().includes(cleanSearch);
      return isCorrectTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  // Operations to alter values
  const handleSelectFont = (fontVal: string) => {
    onChange(fontVal);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleUpdateStackItem = (index: number, val: string) => {
    const updated = [...fontStack];
    updated[index] = val;
    // Format appropriately: Quote items with spaces, leave keywords raw
    const formatted = updated.map(item => {
      const trimmed = item.trim();
      const isKeyword = ["sans-serif", "serif", "monospace", "system-ui", "cursive", "fantasy", "revert", "inherit", "initial", "unset", "ui-sans-serif", "ui-serif", "ui-monospace"].includes(trimmed.toLowerCase());
      if (isKeyword) return trimmed;
      if (trimmed.startsWith("-apple-system") || trimmed.startsWith("BlinkMacSystemFont")) return trimmed;
      // Quote if not already quotes and contains spaces
      if (!trimmed.startsWith('"') && !trimmed.startsWith("'") && (trimmed.includes(" ") || /\d/.test(trimmed))) {
        return `"${trimmed}"`;
      }
      return trimmed;
    });
    onChange(formatted.join(", "));
  };

  const handleDeleteStackItem = (index: number) => {
    if (fontStack.length <= 1) return; // Must hold at least one
    const updated = fontStack.filter((_, i) => i !== index);
    onChange(updated.map(u => (u.includes(" ") && !u.startsWith('"')) ? `"${u}"` : u).join(", "));
  };

  const handleAddStackItem = () => {
    const lastItem = fontStack[fontStack.length - 1] || "sans-serif";
    const updated = [...fontStack, lastItem];
    onChange(updated.map(u => (u.includes(" ") && !u.startsWith('"')) ? `"${u}"` : u).join(", "));
  };

  const handleMoveStackItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === fontStack.length - 1) return;
    const target = direction === "up" ? index - 1 : index + 1;
    const updated = [...fontStack];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange(updated.map(u => (u.includes(" ") && !u.startsWith('"')) ? `"${u}"` : u).join(", "));
  };

  const cycleRandomFont = () => {
    const randomIndex = Math.floor(Math.random() * PRESET_FONTS.length);
    onChange(PRESET_FONTS[randomIndex].value);
  };

  // Safe Fallback Resolution for visual demonstration in CLS panel
  const computedFallbackFont = useMemo(() => {
    const firstGeneric = fontStack.find(item => 
      ["sans-serif", "serif", "monospace", "system-ui", "cursive", "fantasy", "ui-sans-serif", "ui-serif", "ui-monospace"].includes(item.toLowerCase())
    );
    if (firstGeneric) return firstGeneric;
    if (value.toLowerCase().includes("serif")) return "serif";
    if (value.toLowerCase().includes("mono")) return "monospace";
    return "sans-serif";
  }, [fontStack, value]);

  // Visual simulation for Cumulative Layout Shift Metric
  const clsMetric = useMemo(() => {
    const cleanPrimary = cleanFontValue(value).toLowerCase();
    if (cleanPrimary === "system-ui" || cleanPrimary === "sans-serif" || cleanPrimary === "serif" || cleanPrimary.includes("apple-system")) {
      return { score: "0.01", risk: "Negligible", color: "text-emerald-500", bg: "bg-emerald-50/10 border-emerald-500/10" };
    }
    if (activeFontOption.category === "sans-serif") {
      return { score: "0.12", risk: "Low", color: "text-amber-500", bg: "bg-amber-100/5 border-amber-500/10" };
    }
    if (activeFontOption.category === "serif") {
      return { score: "0.24", risk: "Moderate", color: "text-orange-500", bg: "bg-orange-100/5 border-orange-500/10" };
    }
    return { score: "0.38", risk: "Significant", color: "text-red-500", bg: "bg-red-50/10 border-red-500/10" };
  }, [value, activeFontOption]);

  const clsRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "Negligible": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Low": return "bg-teal-50 text-teal-700 border-teal-100";
      case "Moderate": return "bg-amber-55 text-amber-700 border-amber-200";
      default: return "bg-red-50 text-red-700 border-red-100";
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full text-left relative z-10 font-sans" id="typography-font-family-chamber">
      
      {/* Visual Header displaying the customized typography logo */}
      <div className="flex flex-col gap-1 w-full text-left relative">
        <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pl-1 font-mono flex justify-between select-none">
          <span>CSS Typography Chamber</span>
          <span className="text-[10px] font-mono font-bold text-rose-500 uppercase select-all">
            {propName}
          </span>
        </label>

        {/* Customized Trigger showing typeface representation */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-white border ${
            isOpen ? "border-rose-450 ring-4 ring-rose-500/5 shadow-md" : "border-stone-200 hover:border-stone-300"
          } rounded-2xl p-4 flex items-center justify-between shadow-xs transition-all duration-250 cursor-pointer text-left focus:outline-none`}
        >
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-white ${activeFontOption.accent} shadow-inner shrink-0 transition-all duration-300 relative overflow-hidden`}>
              <span className="text-lg font-extrabold font-serif italic select-none">f</span>
              {/* Overlay visual grid on character trigger box */}
              <div className="absolute inset-0 border-[0.5px] border-white/10 pointer-events-none" />
            </div>
            
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-stone-900 leading-tight truncate">
                  {activeFontOption.label}
                </span>
                <span className={`text-[8px] font-extrabold uppercase font-mono tracking-wider px-1.5 py-0.5 rounded-md border shrink-0 ${activeFontOption.badgeBg}`}>
                  {activeFontOption.category}
                </span>
              </div>
              <span className="text-[10px] text-stone-500 font-medium leading-none mt-1 truncate">
                {activeFontOption.vibe}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span 
              className="text-sm text-stone-400 font-medium pr-2 border-r border-stone-100 select-none truncate max-w-[120px] filter saturate-100"
              style={{ fontFamily: value }}
            >
              Abg
            </span>
            <ChevronDown
              size={15}
              className={`text-stone-400 transition-transform duration-250 ${
                isOpen ? "rotate-180 text-rose-500" : ""
              }`}
            />
          </div>
        </button>

        {/* Portal-based custom searchable fonts menu dropdown */}
        {typeof document !== "undefined" && createPortal(
          <AnimatePresence>
            {isOpen && dropdownPos && (
              <motion.div
                id="font-family-dropdown-menu"
                initial={{ opacity: 0, y: dropdownPos.placement === "top" ? 8 : -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.12 } }}
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className="fixed bg-white border border-stone-200 rounded-3xl p-4 shadow-2xl z-[999999] flex flex-col w-full"
                style={{
                  top: dropdownPos.placement === "bottom" ? dropdownPos.top : "auto",
                  bottom: dropdownPos.placement === "top" ? dropdownPos.bottom : "auto",
                  left: dropdownPos.left,
                  width: dropdownPos.width,
                  maxHeight: dropdownPos.maxHeight ? dropdownPos.maxHeight : "380px",
                }}
              >
                <div className="text-[9px] uppercase font-extrabold tracking-widest text-rose-500 font-mono mb-2 flex items-center justify-between pl-1">
                  <div className="flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>Select Fundamental Typeface</span>
                  </div>
                  <span className="text-stone-400 normal-case font-normal select-none">
                    {PRESET_FONTS.length} professional choices
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl mb-3 shrink-0">
                  <Search size={14} className="text-stone-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search premium web typefaces..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none text-xs placeholder-stone-400 focus:outline-none text-stone-850 font-sans"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-[9px] font-sans font-bold hover:text-stone-700 bg-stone-200 px-1.5 py-0.5 rounded text-stone-500 shrink-0 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Sub-categories picker filter */}
                <div className="flex items-center gap-1 pb-2.5 mb-2.5 border-b border-stone-100 overflow-x-auto shrink-0 scrollbar-none">
                  {[
                    { id: "all", label: "All Lists" },
                    { id: "sans-serif", label: "Sans" },
                    { id: "serif", label: "Serif" },
                    { id: "monospace", label: "Mono" },
                    { id: "display", label: "Display" }
                  ].map((tab) => {
                    const isSelected = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-bold font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          isSelected
                            ? "bg-rose-500 text-white shadow-xs"
                            : "bg-stone-50 text-stone-550 border border-stone-200 hover:text-stone-800"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Dropdown List Items */}
                <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1 pr-1 pb-1">
                  {filteredFonts.length > 0 ? (
                    filteredFonts.map((f) => {
                      const isSelected = cleanFontValue(value).toLowerCase() === cleanFontValue(f.value).toLowerCase();
                      
                      return (
                        <button
                          key={f.value}
                          type="button"
                          onClick={() => handleSelectFont(f.value)}
                          className={`group text-left p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
                            isSelected
                              ? "bg-rose-50/30 border-rose-200 shadow-xs"
                              : "bg-stone-50/10 hover:bg-stone-50 border-stone-100 hover:border-stone-200"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <span className={`text-[11px] font-bold ${isSelected ? "text-rose-900" : "text-stone-700 group-hover:text-stone-900"}`}>
                                {f.label}
                              </span>
                              <span className={`text-[8px] font-extrabold uppercase font-mono px-1 py-0.5 border rounded ${f.badgeBg}`}>
                                {f.category}
                              </span>
                            </div>
                            
                            <span className="text-[9px] text-stone-400 font-mono font-medium max-w-[120px] truncate">
                              {f.vibe}
                            </span>
                          </div>

                          {/* Quick Specimen Render in true Font style */}
                          <div 
                            className={`text-sm tracking-wide transform transition-all duration-300 group-hover:translate-x-1 outline-none ${
                              isSelected ? "text-rose-600 font-medium" : "text-stone-500 group-hover:text-stone-800"
                            }`}
                            style={{ fontFamily: f.value }}
                          >
                            {f.sample}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-6 px-4 text-center text-stone-400 flex flex-col items-center justify-center gap-1.5 bg-stone-50/50 border border-stone-200 rounded-2xl">
                      <Type size={18} className="text-stone-350" />
                      <div className="text-xs font-bold text-stone-700">Custom Stacking Active</div>
                      <p className="text-[10px] max-w-[180px] leading-relaxed text-stone-400">
                        Query "{searchQuery}" is not in presets. Try manually typing in custom override!
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-stone-100 mt-2.5 pt-2.5 flex items-center justify-between px-1 shrink-0">
                  <span className="text-[8px] text-stone-400 font-mono">
                    Showing {filteredFonts.length} of {PRESET_FONTS.length} presets
                  </span>
                  
                  <button
                    type="button"
                    onClick={cycleRandomFont}
                    className="text-[9px] flex items-center gap-1 text-rose-500 font-semibold hover:underline cursor-pointer"
                  >
                    <Shuffle size={10} />
                    Random selection
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>

      {/* Specialty Chamber Navigation - Specialized Environment Menu */}
      <div className="flex border border-stone-200/80 bg-stone-50/60 p-0.5 rounded-xl gap-0.5 select-none shrink-0 overflow-x-auto scrollbar-none">
        {[
          { id: "cascade", label: "The Cascade", icon: Workflow },
          { id: "anatomy", label: "Anatomy", icon: Eye },
          { id: "performance", label: "Perform & CLS", icon: AlertTriangle },
          { id: "presets", label: "Preset Systems", icon: Compass },
          { id: "sandbox", label: "Sandbox", icon: Sliders }
        ].map((tab) => {
          const isActive = activeZone === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveZone(tab.id as any)}
              className={`flex-1 py-1 px-2 flex items-center justify-center gap-1 text-[9.5px] font-bold font-mono tracking-tight transition-all rounded-[10px] whitespace-nowrap cursor-pointer ${
                isActive 
                  ? "bg-white text-rose-600 shadow-sm border border-stone-200" 
                  : "text-stone-450 hover:text-stone-700 hover:bg-stone-100/40"
              }`}
            >
              <Icon size={11} className={isActive ? "text-rose-500 animate-pulse" : "text-stone-400"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Specialised Spaces */}
      <div className="transition-all duration-300">
        <AnimatePresence mode="wait">
          
          {/* ZONE A: The Fallback Cascade Stack Builder */}
          {activeZone === "cascade" && (
            <motion.div
              key="cascade"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex flex-col gap-3"
            >
              <div className="bg-stone-50/60 border border-stone-200 p-3.5 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 font-mono flex items-center gap-1.5">
                    <Workflow size={11.5} className="text-rose-500" />
                    <span>The Browser Fallback Cascade</span>
                  </span>
                  
                  <button
                    type="button"
                    onClick={handleAddStackItem}
                    className="text-[9.5px] font-mono text-stone-500 hover:text-rose-600 font-bold flex items-center gap-1 px-1.5 py-0.5 rounded border border-stone-200 bg-white hover:bg-stone-50 transition-colors"
                  >
                    <Plus size={9} />
                    Add Fallback
                  </button>
                </div>

                <p className="text-[9.5px] text-stone-400 leading-normal pl-0.5">
                  The client browser parses fonts from **left-to-right**. If the primary font takes too long or is missing, it descends down our timeline grid:
                </p>

                {/* Timeline vertical chain representation of stack cascade */}
                <div className="flex flex-col gap-2 relative mt-1 pl-3 border-l border-stone-200">
                  {fontStack.map((font, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === fontStack.length - 1;
                    const cleanName = cleanFontValue(font);
                    const isStandardKeyword = ["sans-serif", "serif", "monospace", "system-ui", "cursive", "fantasy"].includes(cleanName.toLowerCase());
                    
                    return (
                      <div key={idx} className="relative flex items-center gap-2 group">
                        
                        {/* Dot connector */}
                        <div className={`absolute -left-[16px] w-[9px] h-[9px] rounded-full border-2 ${
                          isFirst ? "bg-rose-500 border-rose-100" : isLast ? "bg-stone-400 border-stone-100" : "bg-amber-400 border-amber-100"
                        }`} />

                        <div className="flex-1 flex gap-2 items-center bg-white border border-stone-200 hover:border-stone-300 rounded-xl p-2 transition-all shadow-xs">
                          {/* Rank badge */}
                          <span className="text-[8.5px] font-mono font-bold bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">
                            {idx + 1}
                          </span>

                          <input
                            type="text"
                            value={font}
                            onChange={(e) => handleUpdateStackItem(idx, e.target.value)}
                            className="flex-1 bg-transparent border-none text-[10.5px] text-stone-850 font-mono focus:outline-none min-w-0"
                            placeholder="Type Font Family Name..."
                          />

                          {/* Helpers */}
                          {isStandardKeyword && (
                            <span className="text-[8px] uppercase font-mono bg-emerald-50 text-emerald-600 px-1 py-0.2 border rounded border-emerald-100 shrink-0 hidden sm:inline">
                              Browser Safe
                            </span>
                          )}

                          {/* Reordering operations */}
                          <div className="flex items-center gap-1 shrink-0 bg-stone-50/50 p-0.5 border border-stone-150 rounded">
                            <button
                              type="button"
                              onClick={() => handleMoveStackItem(idx, "up")}
                              disabled={isFirst}
                              className={`p-0.5 rounded hover:bg-stone-100 hover:text-stone-700 cursor-pointer disabled:opacity-30 ${isFirst ? "pointer-events-none" : ""}`}
                              title="Move cascade priority up"
                            >
                              <ArrowUp size={10} className="text-stone-400" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveStackItem(idx, "down")}
                              disabled={isLast}
                              className={`p-0.5 rounded hover:bg-stone-100 hover:text-stone-700 cursor-pointer disabled:opacity-30 ${isLast ? "pointer-events-none" : ""}`}
                              title="Move cascade priority down"
                            >
                              <ArrowDown size={10} className="text-stone-400" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStackItem(idx)}
                              disabled={fontStack.length <= 1}
                              className={`p-0.5 rounded hover:bg-rose-50 text-stone-400 hover:text-rose-600 cursor-pointer disabled:opacity-30 ${fontStack.length <= 1 ? "pointer-events-none" : ""}`}
                              title="Delete fallback layer"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Classical OS quick fallback presets appending */}
                <div className="flex flex-col gap-1.5 pt-3.5 mt-2 border-t border-stone-100 pr-1">
                  <span className="text-[8.5px] font-extrabold uppercase font-mono tracking-wider text-stone-400">
                    Append High-Compatibility OS Stack
                  </span>
                  
                  <div className="grid grid-cols-2 xs:grid-cols-3 gap-1 px-0.5">
                    {[
                      { label: "Apple Stack", append: ["-apple-system", "BlinkMacSystemFont", "sans-serif"] },
                      { label: "Windows Core", append: ['"Segoe UI"', "Roboto", "sans-serif"] },
                      { label: "Developer Mono", append: ['"Fira Code"', '"Courier New"', "monospace"] },
                      { label: "Classical Serif", append: ["Georgia", "Times New Roman", "serif"] },
                    ].map((st, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          const primaries = fontStack.filter(item => {
                            const trimmed = item.trim().replace(/^['"]|['"]$/g, "");
                            return !["sans-serif", "serif", "monospace", "system-ui", "cursive", "fantasy", "revert", "inherit", "initial", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Fira Code", "Courier New", "Georgia", "Times New Roman"].includes(trimmed);
                          });
                          const consolidated = [...primaries, ...st.append].map(f => (f.includes(" ") && !f.startsWith('"')) ? `"${f}"` : f).join(", ");
                          onChange(consolidated);
                        }}
                        className="py-1 px-1.5 border border-stone-200/80 bg-white hover:bg-stone-50 text-[9.5px] text-stone-600 hover:text-rose-600 rounded-lg text-center font-semibold cursor-pointer transition-colors"
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-rose-50/20 border border-rose-100 rounded-xl flex gap-2 mt-1">
                  <Lightbulb size={12} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[9px] text-rose-800 leading-normal font-medium">
                    <b>Cascade Tip:</b> Standard browsers require a generic fallback (e.g. <code className="bg-white px-1 whitespace-nowrap rounded border border-rose-200 font-mono font-bold">sans-serif</code> or <code className="bg-white px-1 whitespace-nowrap rounded border border-rose-200 font-mono font-bold">serif</code>) at the absolute bottom of your declaration. If missing, browsers drop styling, falling back back to rigid system layouts.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ZONE B: The Font Microscope (Anatomy Explorer) */}
          {activeZone === "anatomy" && (
            <motion.div
              key="anatomy"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex flex-col gap-3"
            >
              <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl flex flex-col gap-3 text-stone-100">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-450 font-mono flex items-center gap-1.5">
                    <Eye size={12} className="text-rose-400" />
                    <span>Typographic Glyph Anatomy microscope</span>
                  </span>
                  
                  <span className="text-[8px] font-mono uppercase bg-rose-500/20 border border-rose-500/30 text-rose-300 px-1.5 py-0.5 rounded leading-none select-none">
                    Computed
                  </span>
                </div>

                <p className="text-[9px] text-stone-400 leading-normal">
                  Typeface characteristics are defined by visual baselines, apertures, and descending curves. Examine single characters within <span className="font-bold text-white">[{activeFontOption.label}]</span>:
                </p>

                {/* Interactive grid specimen canvas displaying typography guides */}
                <div className="relative h-40 bg-stone-950 border border-stone-800/80 rounded-2xl overflow-hidden flex items-center justify-center select-all">
                  
                  {/* Subtle technical overlay gird coordinates */}
                  <div className="absolute inset-0 bg-radial pointer-events-none opacity-[0.03] select-none" />
                  <div className="absolute inset-0 pointer-events-none opacity-[0.08]" style={{
                    backgroundImage: "linear-gradient(rgba(244,63,94,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(244,63,94,0.08) 1px, transparent 1px)",
                    backgroundSize: "16px 16px"
                  }} />

                  {/* Horizontal Guideline rulers */}
                  <div className="absolute inset-0 flex flex-col justify-between py-6 px-4 pointer-events-none font-mono text-[7px] text-stone-500">
                    <div className="border-b border-rose-500/10 w-full flex justify-between">
                      <span>Capital / Ascender (Line = h)</span>
                      <span className="w-10 border-t border-dashed border-rose-500/40 mt-1" />
                    </div>
                    <div className="border-b border-amber-500/10 w-full flex justify-between">
                      <span>Mean-Line / x-Height (Line = x)</span>
                      <span className="w-10 border-t border-dashed border-amber-500/40 mt-1" />
                    </div>
                    <div className="border-b border-sky-400/20 w-full flex justify-between">
                      <span>Baseline (Line = 0)</span>
                      <span className="w-10 border-t border-sky-400/50 mt-1" />
                    </div>
                    <div className="border-b border-fuchsia-500/10 w-full flex justify-between">
                      <span>Descender Boundary</span>
                      <span className="w-10 border-t border-dashed border-fuchsia-500/40 mt-1" />
                    </div>
                  </div>

                  {/* Massive rendered live text of selected frame */}
                  <div 
                    className="text-8xl select-all select-none text-white relative z-10 font-normal transition-all duration-300 transform"
                    style={{ fontFamily: value }}
                  >
                    {microscopeChar}
                  </div>
                </div>

                {/* Interactive Character Palette Switchers */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[8px] font-extrabold uppercase font-mono text-stone-400">
                    Switch Test Specimen / Custom Input
                  </span>
                  <div className="flex items-center gap-1.5">
                    {["g", "Q", "&", "f", "S", "1", "W"].map((char) => (
                      <button
                        key={char}
                        type="button"
                        onClick={() => {
                          setMicroscopeChar(char);
                          setCustomChar("");
                        }}
                        className={`w-7 h-7 flex items-center justify-center text-xs font-mono border rounded-lg transition-colors cursor-pointer font-bold ${
                          microscopeChar === char && !customChar
                            ? "bg-rose-500 text-white border-rose-400"
                            : "bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700"
                        }`}
                      >
                        {char}
                      </button>
                    ))}
                    
                    <div className="flex-1 flex gap-1 items-center bg-stone-800 border border-stone-700 rounded-lg overflow-hidden px-1.5 h-7">
                      <input
                        type="text"
                        maxLength={2}
                        value={customChar}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomChar(val);
                          if (val) setMicroscopeChar(val);
                        }}
                        placeholder="Custom..."
                        className="w-full bg-transparent border-none text-[10px] focus:outline-none text-white placeholder-stone-500 font-mono text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Visual Specimen Parameters Analysis */}
                <div className="mt-1 bg-stone-950 p-3 rounded-xl border border-stone-850 grid grid-cols-2 gap-x-3 gap-y-2 text-[10px] select-none">
                  <div>
                    <span className="text-stone-500 font-mono uppercase block text-[8px] font-bold">X-Height Aperture</span>
                    <span className="text-stone-300 font-medium">
                      {activeFontOption.category === "sans-serif" ? "Moderate / Standard Open" : activeFontOption.category === "serif" ? "Traditional High Contrast" : "Uniform Mono-Width"}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-mono uppercase block text-[8px] font-bold">Display Scale suitability</span>
                    <span className="text-stone-300 font-medium font-mono">
                      {activeFontOption.category === "display" ? "Optimum (Headline)" : "Body Copy / Interface"}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-mono uppercase block text-[8px] font-bold">Golden Pairing Specimen</span>
                    <span className="text-amber-400 font-bold font-mono">
                      {activeFontOption.pairing}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-mono uppercase block text-[8px] font-bold">Layout Reflow Weight</span>
                    <span className="text-rose-400 font-bold font-mono uppercase text-[9px] flex items-center gap-1">
                      <Sparkles size={9} />
                      {activeFontOption.category === "monospace" ? "Low Cost (Fast)" : "Moderate Ingress"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ZONE C: Cumulative Layout Shift & Performance Analysis */}
          {activeZone === "performance" && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex flex-col gap-3"
            >
              <div className="bg-stone-50/60 border border-stone-200 p-3.5 rounded-2xl flex flex-col gap-3.5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 font-mono flex items-center gap-1.5">
                    <AlertTriangle size={12.5} className="text-rose-500 animate-pulse" />
                    <span>FOUT / CLS Performance Simulator</span>
                  </span>
                  
                  <span className={`text-[8.5px] font-bold uppercase font-mono px-2 py-0.5 border rounded-lg ${clsRiskBadgeColor(clsMetric.risk)}`}>
                    {clsMetric.risk} CLS Risk
                  </span>
                </div>

                <p className="text-[9.5px] text-stone-500 leading-relaxed">
                  Web fonts take split seconds to load, triggering **FOUT** (Flash of Unstyled Text). When the page snaps from system default to custom font, visual text changes boundary width - causing Cumulative Layout Shift (CLS) and worsening Google Web Vitals SEO:
                </p>

                {/* Interactive Layer Visual comparison overlays */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[8px] font-extrabold uppercase font-mono text-stone-400">
                    Dual Font Layout Displacement Overlay (Overlay Simulator)
                  </span>
                  
                  <div className="relative h-24 bg-stone-900 border border-stone-800 rounded-xl overflow-hidden flex items-center justify-center font-mono">
                    {/* Visual alignment layout shift lines */}
                    <div className="absolute inset-x-0 h-full pointer-events-none select-none flex flex-col justify-between py-4 opacity-10">
                      <div className="border-t border-rose-500 w-full" />
                      <div className="border-t border-sky-400 w-full" />
                      <div className="border-t border-rose-500 w-full" />
                    </div>

                    {/* True choice in rose red */}
                    <div 
                      className="absolute text-xl text-rose-500/70 text-center select-none font-bold"
                      style={{ fontFamily: value }}
                    >
                      Displace Layout Geometry
                    </div>
                    {/* Fallback browser standard overlay in solid sky blue */}
                    <div 
                      className="absolute text-xl text-sky-400/50 text-center select-none font-bold strike-inside"
                      style={{ fontFamily: computedFallbackFont }}
                    >
                      Displace Layout Geometry
                    </div>

                    <div className="absolute bottom-1 right-2 flex items-center gap-2 text-[8px] text-stone-400">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Active Font</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> Fallback</span>
                    </div>
                  </div>
                </div>

                {/* Score analysis panel */}
                <div className="grid grid-cols-2 gap-2 text-[10px] select-none bg-white p-3 border border-stone-200 rounded-xl">
                  <div className="border-r border-stone-100 pr-2">
                    <span className="text-stone-400 block text-[8px] font-mono font-bold uppercase">Estimated CLS Shift Shift</span>
                    <span className="text-stone-800 font-extrabold text-xs font-mono">{clsMetric.score} score</span>
                  </div>
                  <div className="pl-2">
                    <span className="text-stone-400 block text-[8px] font-mono font-bold uppercase">Fallback Matching Pair</span>
                    <span className="text-stone-700 font-bold font-mono text-[10.5px]">[{computedFallbackFont}]</span>
                  </div>
                </div>

                {/* Safe Safeguard actions */}
                <div className="flex flex-col gap-2 bg-white p-3 border border-stone-200 rounded-xl">
                  <div className="flex items-start gap-2">
                    <Check size={11} className="text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-[9px] text-stone-600 leading-normal">
                      <b>Add @font-face font-display fallback: swap;</b> inside stylesheets to prevent invisible text (FOIT) while custom asset downloads.
                    </p>
                  </div>
                  <div className="flex items-start gap-2 pt-1.5 border-t border-dashed border-stone-100">
                    <Check size={11} className="text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-[9px] text-stone-600 leading-normal">
                      Use modern CSS rules like <code className="bg-stone-50 text-rose-600 font-mono px-1 py-0.2 border rounded text-[8.5px]">size-adjust</code> inside declarations to downscale fallback metrics to exactly match web fonts perfectly!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ZONE D: Enterprise Curated Presets Bento */}
          {activeZone === "presets" && (
            <motion.div
              key="presets"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex flex-col gap-3"
            >
              <div className="bg-stone-50/60 border border-stone-200 p-3.5 rounded-2xl flex flex-col gap-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 font-mono flex items-center gap-1.5 border-b border-stone-100 pb-2">
                  <Compass size={12} className="text-rose-500" />
                  <span>Curated Multi-Font Fallback Systems</span>
                </span>

                <p className="text-[9.5px] text-stone-500 leading-normal mb-1.5">
                  Choose from masterfully engineered type stacks tuned specifically to aesthetic layouts, performance cascades, and cross-platform safety:
                </p>

                {/* Curated systems grid list */}
                <div className="flex flex-col gap-2">
                  {[
                    {
                      label: "🌐 Native Core OS Dashboard",
                      stack: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
                      sub: "Maximum structural loading speed. Zero web byte footprint. Maps immediately to Mac / Windows native aesthetics.",
                      vibe: "Performant UI",
                      accent: "border-teal-200 bg-teal-50/5 text-teal-800"
                    },
                    {
                      label: "✨ Modern Premium SaaS Product",
                      stack: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      sub: "Standard SaaS product layout stack. High-efficiency legible letters, crisp weights.",
                      vibe: "Elegant Tech",
                      accent: "border-indigo-200 bg-indigo-50/5 text-indigo-800"
                    },
                    {
                      label: "🚀 Radical Tech Geometric",
                      stack: '"Space Grotesk", "Fira Code", "Courier New", monospace',
                      sub: "Web3 engineering aesthetics. Eccentric curves matched by technical sub-font structures.",
                      vibe: "Avant-Garde Mono",
                      accent: "border-rose-200 bg-rose-50/5 text-rose-800"
                    },
                    {
                      label: "🖋️ Luxury Editorial Fashion Stylist",
                      stack: '"Cormorant Garamond", "Playfair Display", Georgia, Times New Roman, serif',
                      sub: "Fine hairlines and high stroke contrast. Elegant, pristine display copy.",
                      vibe: "High Culture",
                      accent: "border-amber-200 bg-amber-50/5 text-amber-800"
                    }
                  ].map((sys, idx) => {
                    const isActive = value.toLowerCase().trim().replace(/['"]/g, "") === sys.stack.toLowerCase().trim().replace(/['"]/g, "");
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onChange(sys.stack)}
                        className={`text-left p-3 rounded-xl border flex flex-col gap-1.5 transition-all cursor-pointer ${
                          isActive 
                            ? "border-rose-450 bg-rose-50/30 ring-2 ring-rose-500/5 shadow-xs" 
                            : "border-stone-200 bg-white hover:bg-stone-50/60 hover:border-stone-250"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] font-bold text-stone-800 font-sans">
                            {sys.label}
                          </span>
                          <span className={`text-[8px] font-extrabold uppercase font-mono px-1 rounded border leading-none py-0.5 ${sys.accent}`}>
                            {sys.vibe}
                          </span>
                        </div>

                        <p className="text-[9px] text-stone-450 leading-relaxed font-sans">
                          {sys.sub}
                        </p>

                        <div className="text-[8.5px] font-mono text-stone-500 bg-stone-50 p-1.5 rounded border border-stone-150 truncate w-full select-all">
                          {sys.stack}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ZONE E: Interactive Microscope Sandbox Specimen */}
          {activeZone === "sandbox" && (
            <motion.div
              key="sandbox"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex flex-col gap-3"
            >
              <div className="bg-white border border-stone-200 p-3.5 rounded-2xl flex flex-col gap-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 font-mono flex items-center gap-1.5">
                    <SlidersHorizontal size={11} className="text-rose-500" />
                    <span>Micro-Anatomy Specimen Playground</span>
                  </span>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      setSandboxText("Craft typography with architecture.");
                      setSandboxSize(16);
                      setSandboxWeight("400");
                      setSandboxItalic(false);
                      setSandboxLetterSpacing("normal");
                      setSandboxLineHeight("1.5");
                      setTextTransform("none");
                    }}
                    className="text-[8px] font-mono text-stone-400 hover:text-rose-600 flex items-center gap-1 border border-stone-150 px-2 py-0.5 rounded hover:bg-stone-50 cursor-pointer"
                  >
                    <RotateCcw size={8} />
                    Reset Specs
                  </button>
                </div>

                <div className="flex flex-col gap-3 text-left">
                  {/* Text Specimen Field */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-stone-400 uppercase font-mono font-bold pl-0.5">
                      Specimen String Input
                    </span>
                    <input
                      type="text"
                      value={sandboxText}
                      onChange={(e) => setSandboxText(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-[10.5px] text-stone-750 focus:outline-none focus:bg-white transition-colors"
                      placeholder="Insert specimen preview sentence..."
                    />
                  </div>

                  {/* Micro sliders panel */}
                  <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-dashed border-stone-100 flex-wrap">
                    
                    {/* Character Size */}
                    <div className="flex flex-col gap-1 w-full">
                      <span className="text-[8px] text-stone-400 uppercase font-mono font-bold flex justify-between">
                        <span>Physical Size</span>
                        <span className="text-stone-500 font-extrabold">{sandboxSize}px</span>
                      </span>
                      <input
                        type="range"
                        min="10"
                        max="36"
                        value={sandboxSize}
                        onChange={(e) => setSandboxSize(parseInt(e.target.value))}
                        className="w-full h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-rose-600 border border-stone-200/50"
                      />
                    </div>

                    {/* Bold weighting */}
                    <div className="flex flex-col gap-1 w-full">
                      <span className="text-[8px] text-stone-400 uppercase font-mono font-bold">
                        Glyph Weight
                      </span>
                      <select
                        value={sandboxWeight}
                        onChange={(e) => setSandboxWeight(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg text-[9.5px] px-1 py-1 focus:outline-none text-stone-700 font-bold"
                      >
                        <option value="100">Thin (100)</option>
                        <option value="300">Light (300)</option>
                        <option value="400">Regular (400)</option>
                        <option value="500">Medium (500)</option>
                        <option value="600">Semibold (600)</option>
                        <option value="700">Bold (700)</option>
                        <option value="900">Black (900)</option>
                      </select>
                    </div>

                    {/* Font line heights */}
                    <div className="flex flex-col gap-1 w-full">
                      <span className="text-[8px] text-stone-400 uppercase font-mono font-bold">
                        Line Height
                      </span>
                      <select
                        value={sandboxLineHeight}
                        onChange={(e) => setSandboxLineHeight(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg text-[9.5px] px-1 py-1 focus:outline-none text-stone-700 font-bold"
                      >
                        <option value="1">Tight (1.0)</option>
                        <option value="1.2">Compact (1.2)</option>
                        <option value="1.5">Standard (1.5)</option>
                        <option value="1.8">Spacious (1.8)</option>
                      </select>
                    </div>

                    {/* Font Letter tracking */}
                    <div className="flex flex-col gap-1 w-full">
                      <span className="text-[8px] text-stone-400 uppercase font-mono font-bold">
                        Tracking (Letter-Spacing)
                      </span>
                      <select
                        value={sandboxLetterSpacing}
                        onChange={(e) => setSandboxLetterSpacing(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg text-[9.5px] px-1 py-1 focus:outline-none text-stone-700 font-bold"
                      >
                        <option value="-0.05em">Compressed</option>
                        <option value="-0.02em">Tight</option>
                        <option value="normal">Default</option>
                        <option value="0.05em">Aerate</option>
                        <option value="0.1em">Wide Space</option>
                      </select>
                    </div>

                    {/* Text Transform */}
                    <div className="flex flex-col gap-1 w-full col-span-2">
                      <span className="text-[8px] text-stone-400 uppercase font-mono font-bold">
                        Text Transformation Case & Style
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setSandboxItalic(!sandboxItalic)}
                          className={`flex-1 py-1 border text-[9.5px] font-mono rounded font-extrabold cursor-pointer transition-all ${
                            sandboxItalic 
                              ? "bg-rose-50 border-rose-350 text-rose-700" 
                              : "bg-stone-50/50 border-stone-200 text-stone-500"
                          }`}
                        >
                          <i>Italic</i>
                        </button>
                        
                        {[
                          { id: "none", label: "Aa" },
                          { id: "uppercase", label: "AA" },
                          { id: "lowercase", label: "aa" }
                        ].map((x) => (
                          <button
                            key={x.id}
                            type="button"
                            onClick={() => setTextTransform(x.id as any)}
                            className={`flex-1 py-1 border text-[9.5px] font-mono rounded font-extrabold cursor-pointer transition-all ${
                              textTransform === x.id 
                                ? "bg-rose-50 border-rose-350 text-rose-700 shadow-3xs" 
                                : "bg-stone-50/50 border-stone-200 text-stone-500"
                            }`}
                          >
                            {x.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Render Specimen box with horizontal blueprint tracking rules */}
                  <div className="relative border border-stone-200/80 rounded-2xl p-5 bg-stone-50/30 overflow-hidden flex flex-col justify-center min-h-[90px] mt-1 relative">
                    <div className="absolute inset-x-0 h-full pointer-events-none opacity-[0.03] select-none flex flex-col justify-between py-2">
                      <div className="border-t border-rose-400 border-dashed w-full" />
                      <div className="border-t border-rose-400 border-dashed w-full" />
                      <div className="border-t border-rose-400 border-dashed w-full" />
                    </div>

                    <div 
                      className="text-stone-850 break-words transition-all duration-300 relative z-10 select-all text-center"
                      style={{ 
                        fontFamily: value, 
                        fontSize: `${sandboxSize}px`,
                        fontWeight: sandboxWeight,
                        fontStyle: sandboxItalic ? "italic" : "normal",
                        letterSpacing: sandboxLetterSpacing,
                        lineHeight: sandboxLineHeight,
                        textTransform: textTransform
                      }}
                    >
                      {sandboxText || "Craft typography with architecture."}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Manual Input Core Web Font Injection box */}
      <div className="bg-stone-50/40 border border-stone-200/50 rounded-2xl p-3.5 flex flex-col gap-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] text-stone-500 font-extrabold uppercase tracking-wider pl-0.5 font-mono flex items-center gap-1">
            <Globe size={11} className="text-stone-400" />
            <span>Dynamic Custom Stacking Console</span>
          </span>
          <span className="text-[8px] font-mono text-stone-400">
            Override Stacks Injected
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <input
            type="text"
            placeholder='e.g. "Space Grotesk", Georgia, sans-serif'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl px-2.5 py-2 text-xs text-stone-800 focus:outline-none focus:border-rose-400 placeholder-stone-300 font-mono shadow-inner text-left"
          />
          <p className="text-[8.5px] leading-normal text-stone-400">
            Override with <i>any</i> Google Font name or custom CSS stack (e.g. <code className="bg-stone-100 px-1 py-0.2 rounded font-mono font-bold">"Syne", sans-serif</code>). The creator automatically resolves and renders it across elements.
          </p>
        </div>
      </div>

    </div>
  );
}
