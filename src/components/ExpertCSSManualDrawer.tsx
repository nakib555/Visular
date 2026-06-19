import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, BookOpen, Lightbulb, CheckCircle2, AlertTriangle, 
  Code, Sliders, Play, Minimize2, Sparkles, HelpCircle,
  Copy, Check, FileCode, RotateCcw, Box
} from "lucide-react";

export interface ExpertCSSData {
  property: string;
  overview: {
    title: string;
    text: string;
  };
  valueType: {
    type: string;
    meaning: string;
    example: string;
  }[];
  validValues: {
    initial: string;
    computed: string;
    inherited: string;
    animatable: string;
    appliesTo: string;
    percentageRef: string;
  };
  categories: {
    title: string;
    code: string;
    description: string;
    behavior: string[];
  }[];
  functions: {
    title: string;
    code: string;
    behavior: string;
  }[];
  invalidValues: {
    example: string;
    why: string;
    behavior: string;
  }[];
  gotchas: {
    title: string;
    badCode: string;
    explanation: string;
    why: string;
    fix: string;
  }[];
  interactions: string[];
  guide: {
    bestProduction: string[];
    performance: {
      bad: string;
      fix: string;
    };
    examples: {
      title: string;
      code: string;
    }[];
  };
  quickRef: {
    label: string;
    value: string;
  }[];
}

// Exactly matching the requested expert-level analysis verbatim for "width"
export const WIDTH_EXPERT_DATA: ExpertCSSData = {
  property: "width",
  overview: {
    title: "Overview",
    text: "The width property defines the horizontal size of an element's content area (or its total size, depending on the box-sizing property). It belongs to the CSS Box Model and the CSS Sizing Module. Its primary purpose in real-world layouts is to control how much horizontal space a component occupies, establishing the structural grid, column sizes, or container constraints of a web page. It heavily affects layout and paint, meaning any changes to width will force the browser to recalculate the layout (reflow) of the entire page."
  },
  valueType: [
    { type: "<length>", meaning: "Fixed or relative physical measurements", example: "300px, 20rem, 50vw" },
    { type: "<percentage>", meaning: "Measurement relative to the parent container's width", example: "50%, 100%" },
    { type: "<keyword>", meaning: "Intrinsic content-based sizing", example: "auto, max-content, min-content" },
    { type: "<function>", meaning: "Calculation or constraint algorithms", example: "calc(), clamp(), fit-content()" },
    { type: "<global-value>", meaning: "Standard CSS globals", example: "inherit, initial, unset" }
  ],
  validValues: {
    initial: "auto",
    computed: "The percentage, absolute length, or keyword as specified.",
    inherited: "No",
    animatable: "Yes (as a length or percentage, but heavily impacts performance).",
    appliesTo: "All elements except non-replaced inline elements (like <span>), table rows, and row groups.",
    percentageRef: "The width of the element's containing block (parent)."
  },
  categories: [
    {
      title: "1. Auto (Default)",
      code: "width: auto;",
      description: "The browser calculates the width based on the element type.",
      behavior: [
        "For block-level elements (like <div>), auto means 'fill the available horizontal space of the parent, minus margins, padding, and borders.'",
        "For inline-block elements or floats, auto means 'shrink to wrap the content inside.'"
      ]
    },
    {
      title: "2. Fixed & Relative Lengths",
      code: `width: 320px;
width: 20rem;
width: 100vw;`,
      description: "Applies a hard mathematical limit to the element.",
      behavior: [
        "The element will stay exactly this wide. If the viewport or parent is smaller than this value, the element will overflow, causing horizontal scrolling."
      ]
    },
    {
      title: "3. Percentages",
      code: `width: 100%;
width: 50%;`,
      description: "Sized as a fraction of the parent container's width.",
      behavior: [
        "Highly responsive. If the parent resizes, the child recalculates its width automatically."
      ]
    },
    {
      title: "4. Intrinsic Sizing Keywords (Modern CSS)",
      code: `width: max-content;
width: min-content;`,
      description: "Sizing dictated by the content inside the element, rather than the parent outside it.",
      behavior: [
        "max-content: The box expands as wide as necessary to hold its content without wrapping any text. (Can cause overflow).",
        "min-content: The box shrinks as much as possible, wrapping all text. The width becomes equal to the longest unbreakable word or image inside it."
      ]
    }
  ],
  functions: [
    {
      title: "1. clamp()",
      code: "width: clamp(300px, 50vw, 800px);",
      behavior: "The holy grail of fluid layout. The width will be 50% of the viewport, but it will never shrink below 300px and never grow above 800px. No media queries required."
    },
    {
      title: "2. fit-content()",
      code: "width: fit-content(400px);",
      behavior: "The box acts like max-content (grows with the text) until it reaches 400px, at which point it wraps the text and stops growing."
    },
    {
      title: "3. calc()",
      code: "width: calc(100% - 2rem);",
      behavior: "Used frequently to mix percentages and fixed units."
    }
  ],
  invalidValues: [
    { example: "width: -100px;", why: "Negative values not allowed. A box cannot have negative physical space.", behavior: "Ignores declaration." },
    { example: "width: 50;", why: "Missing unit. Numbers require a unit (px, %, rem) unless zero.", behavior: "Ignores declaration." },
    { example: "width: stretch;", why: "Experimental/Unsupported. (Usually requires -webkit-fill-available).", behavior: "Ignores declaration in most standard implementations." }
  ],
  gotchas: [
    {
      title: "1. The box-sizing Trap",
      badCode: `div {
  width: 100%;
  padding: 20px;
  border: 2px solid #f5f5f4;
}`,
      explanation: "You expect the div to fit perfectly in its parent. Instead, it overflows by 44px, causing a horizontal scrollbar.",
      why: "The default browser behavior is box-sizing: content-box. This means padding and borders are added to the width. 100% + 40px padding + 4px border is wider than 100%.",
      fix: "Always use the global reset: * { box-sizing: border-box; } so padding shrinks the content inward instead of expanding the box outward."
    },
    {
      title: "2. width: 100% vs width: auto",
      badCode: `div {
  /* Applying to standard block-level div */
  width: 100%;
}`,
      explanation: "Applying width: 100%; to a standard <div> just to make sure it fills the screen.",
      why: "Block elements naturally fill the parent using width: auto;. If you use auto, the browser safely factors in margins. If you force width: 100%; and then add margin-left: 10px;, the box will blow past the right side of the container.",
      fix: "Leave block-level elements as width: auto; unless they are floated, flex items, or absolutely positioned."
    },
    {
      title: "3. Width on Inline Elements",
      badCode: `span {
  width: 200px;
}`,
      explanation: "Applying width: 200px; to a <span> or <a>.",
      why: "Strictly display: inline elements ignore width and height properties completely. Their size is entirely dictated by the text inside them.",
      fix: "Change the element to display: inline-block; or display: block;."
    }
  ],
  interactions: [
    "min-width and max-width: These properties always override width. If you set width: 1000px and max-width: 500px, the computed width will be 500px.",
    "Flexbox: Inside a flex container, flex-basis overrides width. If both are set, flex-basis wins on the main axis.",
    "Logical Counterpart: The modern, internationalized equivalent of width is inline-size. (In a vertical language like Japanese, inline-size controls vertical height, and block-size controls horizontal width)."
  ],
  guide: {
    bestProduction: [
      "Tailwind CSS: w-full (100%), w-auto (auto), w-screen (100vw), w-max (max-content), w-fit (fit-content).",
      "Responsive Design: Professionals rarely use fixed widths (width: 500px). They build fluid containers using width: 100%; max-width: 1200px;."
    ],
    performance: {
      bad: "Animating width (e.g., transition: width 0.3s;) is terrible for performance. Growing an element's width forces the browser to recalculate the Layout (reflow) of text wrapping, sibling positions, and parent containers 60 frames per second.",
      fix: "If you need to visually stretch a box, animate transform: scaleX() instead."
    },
    examples: [
      {
        title: "Example 1: The Standard Page Container",
        code: `.site-container {
  /* Scales perfectly on mobile */
  width: 100%; 
  /* Caps out on desktop so it doesn't get unreadable */
  max-width: 1100px; 
  /* Centers the container horizontally */
  margin: 0 auto; 
}`
      },
      {
        title: "Example 2: The Intrinsic \"Hug\" Button",
        code: `.action-button {
  display: flex;
  /* Instead of a fixed width, the button perfectly hugs the text and icon, 
     preventing it from wrapping onto two lines. */
  width: max-content; 
  padding: 12px 24px;
}`
      },
      {
        title: "Example 3: Fluid Sidebar Layout (Without Media Queries)",
        code: `.sidebar {
  /* Stays 25% of the screen, but never shrinks below 250px 
     and never grows beyond 350px. Perfectly fluid! */
  width: clamp(250px, 25vw, 350px);
}`
      }
    ]
  },
  quickRef: [
    { label: "Initial Value", value: "auto" },
    { label: "Inherited", value: "No" },
    { label: "Animatable", value: "Yes (But severely impacts performance)" },
    { label: "Minimum Valid Value", value: "0" },
    { label: "Maximum Valid Value", value: "Unbounded" },
    { label: "Professional Range", value: "auto, 100%, clamp(), max-content" },
    { label: "Common Production Values", value: "100%, auto, max-content" },
    { label: "Related Properties", value: "max-width, min-width, box-sizing, inline-size" },
    { label: "Performance Impact", value: "❌ Expensive to animate (Triggers Layout / Reflow)" }
  ]
};

// Exactly matching the expert-level analysis for "font-family"
export const FONT_FAMILY_EXPERT_DATA: ExpertCSSData = {
  property: "font-family",
  overview: {
    title: "Overview",
    text: "The font-family property defines a prioritized, comma-separated list of font family names and/or generic family names for the text content of selected elements. It belongs to the CSS Fonts Module. Its primary purpose in real-world layouts is to establish typographic hierarchy, maintain brand identity, and guarantee text readability across different operating systems. It directly impacts layout (reflow), paint, and accessibility because different font faces possess unique horizontal and vertical glyph dimensions, meaning loading a web font dynamically will cause text boundaries to recalculate."
  },
  valueType: [
    { type: "<string>", meaning: "Quoted specific font family name (required if it contains spaces, numbers, or special characters)", example: '"Helvetica Neue", "Fira Code", "Roboto Mono"' },
    { type: "<custom-ident>", meaning: "Unquoted font family name (only valid if it behaves as a single CSS identifier)", example: "Arial, Georgia, Tahoma" },
    { type: "<generic-family>", meaning: "Browser-mapped typographic category fallback keyword", example: "sans-serif, serif, monospace, system-ui" },
    { type: "<global-value>", meaning: "Standard CSS rollback value", example: "inherit, initial, unset" }
  ],
  validValues: {
    initial: "User-Agent dependent (Typically maps to Times New Roman or serif depending on user settings)",
    computed: "As specified",
    inherited: "Yes (All child elements inherit typographic properties unless overridden)",
    animatable: "Discrete (Snaps instantly from one font face to another without transition)",
    appliesTo: "All elements, as well as ::first-letter and ::first-line pseudo-elements",
    percentageRef: "N/A"
  },
  categories: [
    {
      title: "1. Single Word Font Families (Unquoted)",
      code: "font-family: Helvetica;",
      description: "A single, standard font identifier.",
      behavior: [
        "The browser searches locally on the client machine for a font exactly matching 'Helvetica'."
      ]
    },
    {
      title: "2. Multi-Word Font Families (Quoted)",
      code: 'font-family: "Segoe UI", "Fira Code";',
      description: "Any font name containing spaces, numbers, or punctuation must be enclosed in single or double quotes.",
      behavior: [
        "Safe parsing. Ensures the browser interprets the words as a single font family instead of separate keywords."
      ]
    },
    {
      title: "3. Prioritized Fallback List",
      code: 'font-family: "Inter", Arial, sans-serif;',
      description: "A prioritized, comma-separated list evaluated from left to right.",
      behavior: [
        "The browser searches for 'Inter' locally or via @font-face. If unavailable, it falls back to 'Arial'. If 'Arial' is missing, it renders the system's default sans-serif font."
      ]
    }
  ],
  functions: [
    {
      title: "var() Custom Properties",
      code: "font-family: var(--font-primary, sans-serif);",
      behavior: "Standard practice in design systems. This enables dynamic font-toggling (such as dark-mode editorial fonts vs. standard interface fonts) by changing custom properties on the :root element."
    }
  ],
  invalidValues: [
    { example: "font-family: Open Sans, sans-serif;", why: "Multi-word family names must be wrapped in quotes if they contain spaces. Without quotes, some browsers may fail to parse 'Open Sans' as a singular name and discard it.", behavior: "Ignores the 'Open Sans' name and falls back to subsequent fonts in the stack." },
    { example: "font-family: \"Inter\" sans-serif;", why: "Missing comma separator. Elements in the fallback stack must be explicitly divided by commas.", behavior: "Parsing error; the entire font-family declaration is discarded." },
    { example: "font-family: \"Roboto\", 100serif;", why: "Unquoted font names cannot begin with numbers. It must be written as \"100serif\" or resolved to a valid identifier.", behavior: "Syntactic error; ignores the 100serif fallback." }
  ],
  gotchas: [
    {
      title: "1. FOUT vs. FOIT (Flash of Unstyled vs. Invisible Text)",
      badCode: `@font-face {
  font-family: "BrandSans";
  src: url("/fonts/brandsans.woff2") format("woff2");
  /* missing font-display parameter */
}`,
      explanation: "Text content remains invisible or snaps visual dimensions abruptly.",
      why: "When utilizing external web fonts (from Google Fonts or Typekit), the browser may take a moment to fetch the font file, causing Flash of Invisible Text (FOIT) or Flash of Unstyled Text (FOUT).",
      fix: "Always combine font-family with the @font-face property 'font-display: swap;'."
    },
    {
      title: "2. Cumulative Layout Shift (CLS)",
      badCode: `body {
  font-family: "BrandSans", Arial, sans-serif;
}`,
      explanation: "When loading web fonts, sudden layout changes cause layout shifting.",
      why: "If your primary web font and your system fallback font have different horizontal spacing (widths), the moment the web font downloads, the text will jump. This shifts elements, altering layout geometry and lowering your Google SEO ranking.",
      fix: "Use modern CSS fallback adjustments (like size-adjust, ascent-override, or descent-override inside your @font-face rules) to match the dimensions of your system fallback font to your loaded web font."
    },
    {
      title: "3. Shorthand Override Pitfall",
      badCode: `p {
  font-family: "Inter", sans-serif;
  font: 14px/1.4 system-ui; /* Overwrites font-family! */
}`,
      explanation: "Using shorthand resets un-declared granular sub-properties.",
      why: "Typographic longhands (like font-family, font-weight, line-height) are completely cleared if they are specified before the font shorthand, which resets omitted components back to their initial values.",
      fix: "Ensure the shorthand font property is declared first, or solely use individual longhands."
    }
  ],
  interactions: [
    "Parent → Child: Highly inherited. Declaring font-family on html or body will apply it to every heading, paragraph, button, and input on your web page unless overridden.",
    "Sizing Properties (font-size, line-height): Glyphs of different fonts render at different absolute visual scales even if they share the exact same font-size: 16px;. Changing font-family often requires tweaking line-height.",
    "The font Shorthand: font-family is a component of the font shorthand (e.g., font: 16px/1.5 'Inter', sans-serif;). Caution: Setting the font shorthand will completely reset any independently declared typography longhands if declared out of order."
  ],
  guide: {
    bestProduction: [
      "Always combine font-family with the @font-face property 'font-display: swap;' to keep text content immediately readable.",
      "Tailwind CSS standard configurations: use standard font-sans ('sans-serif'), font-serif ('serif'), and font-mono ('monospace') utility classes."
    ],
    performance: {
      bad: "Layout Cost: Re-evaluating font-family triggers layout calculations (reflow). Avoid changing fonts dynamically with classes or hover states.",
      fix: "Network Cost: Limit your custom web fonts to 1 or 2 families with minimal font-weight variants (e.g., just regular 400 and bold 700) to keep your load time optimal."
    },
    examples: [
      {
        title: "Example 1: Standard Modern SaaS Web Typography",
        code: `:root {
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "Fira Code", ui-monospace, monospace;
}

body {
  font-family: var(--font-sans);
  font-feature-settings: "cv02", "cv03", "cv04"; /* Optional: Inter specific ligatures */
}

code {
  font-family: var(--font-mono);
}`
      },
      {
        title: "Example 2: Clean Typography Stack with Local Priority",
        code: `h1, h2, h3 {
  /* Checks local machines for Apple's serif, then Caslon, then standard Serif */
  font-family: "SF Pro Serif", "Big Caslon", Georgia, serif;
  font-weight: 700;
  line-height: 1.2;
}`
      },
      {
        title: "Example 3: Performance-optimized Web Font Loader Fallback",
        code: `@font-face {
  font-family: "BrandSans";
  src: url("/fonts/brandsans.woff2") format("woff2");
  font-display: swap; /* Keeps content visible while loading */
}

body {
  font-family: "BrandSans", -apple-system, sans-serif;
}`
      }
    ]
  },
  quickRef: [
    { label: "Initial Value", value: "User-Agent dependent (typically serif)" },
    { label: "Inherited", value: "Yes" },
    { label: "Animatable", value: "No (Discrete)" },
    { label: "Minimum Valid Value", value: "1 Generic Font Keyword" },
    { label: "Maximum Valid Value", value: "Unbounded stack chain" },
    { label: "Professional Range", value: "Specific Web Font + system fallbacks + generic backup" },
    { label: "Common Production Values", value: '"Inter", sans-serif; system-ui, sans-serif;' },
    { label: "Related Properties", value: "font-size, font-weight, line-height, font-display" },
    { label: "Performance Impact", value: "⚠️ Moderate (Triggers Layout / Reflow on font load)" }
  ]
};

interface ExpertCSSManualDrawerProps {
  propertyName: string | null;
  onClose: () => void;
}

export function ExpertCSSManualDrawer({ propertyName, onClose }: ExpertCSSManualDrawerProps) {
  const [data, setData] = useState<ExpertCSSData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  useEffect(() => {
    if (!propertyName) return;

    // Normalizing check - e.g. "width" or if of layout group
    const normName = propertyName.toLowerCase().trim();

    if (normName === "width") {
      setData(WIDTH_EXPERT_DATA);
      setError(null);
      setLoading(false);
    } else if (normName === "font-family" || normName === "fontfamily") {
      setData(FONT_FAMILY_EXPERT_DATA);
      setError(null);
      setLoading(false);
    } else {
      // Dynamic load via Gemini!
      setLoading(true);
      setError(null);
      setData(null);

      fetch("/api/gemini/css-reference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ property: normName }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.error || "Failed to load dynamic expert analysis.");
          }
          return res.json();
        })
        .then((json) => {
          if (json.data) {
            setData(json.data);
          } else {
            throw new Error("Invalid response schema from server.");
          }
        })
        .catch((err) => {
          console.error("Dynamic reference load error:", err);
          setError(err.message || "Failed to load reference manual parameters.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [propertyName]);

  if (!propertyName) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex justify-end">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs cursor-crosshair"
        />

        {/* Drawer slide panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-full max-w-[620px] h-full bg-stone-50 border-l border-stone-200 shadow-2xl flex flex-col focus:outline-none"
        >
          {/* Header Panel */}
          <div className="px-6 py-4.5 bg-white border-b border-stone-200/80 flex items-center justify-between shadow-xs sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <div className="w-[34px] h-[34px] rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-500 shadow-xs">
                <BookOpen size={16} className="stroke-[2.25] animate-pulse" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-extrabold text-stone-800 tracking-tight flex items-center gap-1.5 uppercase font-sans">
                  <span>CSS Expert Lab manual</span>
                  <span className="bg-amber-100 text-amber-800 text-[8.5px] px-1.5 py-0.5 rounded-md font-bold lowercase tracking-normal">
                    beta
                  </span>
                </h3>
                <p className="text-[10px] text-stone-400 font-medium font-sans mt-0.5">
                  Deep-dive layout behavior, interactive traps & validation schemas.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-500 hover:text-stone-850 cursor-pointer shadow-2xs transition-colors"
            >
              <X size={14} className="stroke-[2.25]" />
            </button>
          </div>

          {/* Body Content Scrollable container */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50/55 border border-amber-100 flex items-center justify-center text-amber-500 animate-spin">
                    <Sparkles size={20} className="stroke-[1.5]" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-ping" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <p className="text-xs font-bold text-stone-700 font-mono">
                    Formulating Expert Analysis...
                  </p>
                  <p className="text-[10px] text-stone-400 leading-relaxed font-sans">
                    Gemini AI agent is drafting real-time layout structures, responsive constraints, box-sizing rules, and best-practice examples for <code className="px-1 py-0.5 rounded bg-amber-50 border border-amber-100 font-mono text-amber-700">{propertyName}</code>.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/60 text-left space-y-3">
                <div className="flex items-center gap-2 text-rose-700 font-bold select-none text-xs font-mono uppercase tracking-wider">
                  <AlertTriangle size={15} />
                  <span>API Integration Error</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed font-sans">
                  {error}
                </p>
                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setData(WIDTH_EXPERT_DATA);
                      setError(null);
                    }}
                    className="flex items-center gap-1.5 text-[9.5px] font-bold font-mono text-amber-600 hover:text-amber-700 bg-white border border-stone-200 py-1.5 px-3 rounded-xl shadow-3xs cursor-pointer"
                  >
                    <RotateCcw size={10} />
                    <span>Fallback to "width" Study Guide</span>
                  </button>
                </div>
              </div>
            )}

            {data && (
              <div className="space-y-6.5 text-left animate-fade-in">
                {/* Visual Title Header */}
                <div className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-2xl p-5 text-white shadow-md relative overflow-hidden flex flex-col gap-2.5 items-start">
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-white pointer-events-none transform translate-x-5 -translate-y-5">
                    <Code size={180} />
                  </div>
                  <span className="text-[8px] font-mono tracking-widest bg-stone-700/60 border border-stone-600 text-stone-300 font-black px-2.5 py-0.5 rounded-full uppercase leading-none">
                    CSS property
                  </span>
                  <div className="flex items-baseline gap-2">
                    <h1 className="text-2xl font-black font-mono tracking-tight text-white select-all lowercase leading-none">
                      {data.property}
                    </h1>
                  </div>
                  <p className="text-[10px] text-stone-300 leading-relaxed max-w-lg mt-1 font-sans">
                    {data.overview.text}
                  </p>
                </div>

                {/* Value Types Grid */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-stone-400 font-mono flex items-center gap-2">
                    <Box size={11} className="text-amber-500" />
                    <span>Value Categories & Syntax Types</span>
                  </h4>
                  <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200/80">
                          <th className="px-4 py-2.5 text-[9px] font-extrabold font-mono text-stone-500 uppercase">Value Type</th>
                          <th className="px-4 py-2.5 text-[9px] font-extrabold font-mono text-stone-500 uppercase">Meaning</th>
                          <th className="px-4 py-2.5 text-[9px] font-extrabold font-mono text-stone-500 uppercase">Production Example</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {data.valueType.map((v, i) => (
                          <tr key={i} className="hover:bg-amber-50/20 transition-colors">
                            <td className="px-4 py-2.5 font-mono text-[9.5px] text-rose-650 font-bold select-all">{v.type}</td>
                            <td className="px-4 py-2.5 text-[10px] text-stone-600 font-medium font-sans">{v.meaning}</td>
                            <td className="px-4 py-2.5 font-mono text-[9px] text-stone-400 font-bold select-all">{v.example}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Reference Table and Block Rules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Valid Values / Default Metadata */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-stone-400 font-mono flex items-center gap-2">
                      <Sliders size={11} className="text-amber-500" />
                      <span>Property Sizing Rules</span>
                    </h4>
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-4.5 space-y-3.5 shadow-2xs">
                      <div className="flex flex-col gap-0.5 pb-2.5 border-b border-stone-100 text-left">
                        <span className="text-[8px] font-bold font-mono uppercase text-stone-400 leading-none">Initial Value</span>
                        <code className="text-xs font-mono font-bold text-rose-650 mt-1 select-all">{data.validValues.initial}</code>
                      </div>
                      <div className="flex flex-col gap-0.5 pb-2.5 border-b border-stone-100 text-left">
                        <span className="text-[8px] font-bold font-mono uppercase text-stone-400 leading-none">Inherited</span>
                        <code className="text-xs font-mono font-bold text-stone-700 mt-1">{data.validValues.inherited}</code>
                      </div>
                      <div className="flex flex-col gap-0.5 pb-2.5 border-b border-stone-100 text-left">
                        <span className="text-[8px] font-bold font-mono uppercase text-stone-400 leading-none">Animatable</span>
                        <p className="text-[10px] text-stone-600 font-medium font-sans mt-1 leading-relaxed">{data.validValues.animatable}</p>
                      </div>
                      <div className="flex flex-col gap-0.5 pb-2.5 border-b border-stone-100 text-left">
                        <span className="text-[8px] font-bold font-mono uppercase text-stone-400 leading-none">Percentage Reference</span>
                        <p className="text-[10px] text-stone-600 font-medium font-sans mt-1 leading-relaxed">{data.validValues.percentageRef}</p>
                      </div>
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="text-[8px] font-bold font-mono uppercase text-stone-400 leading-none">Applies To</span>
                        <p className="text-[10px] text-stone-600 font-medium font-sans mt-1 leading-relaxed">{data.validValues.appliesTo}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cheat sheet / Quick lookup */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-stone-400 font-mono flex items-center gap-2">
                      <HelpCircle size={11} className="text-amber-500" />
                      <span>Cheat-Sheet Specifications</span>
                    </h4>
                    <div className="bg-gradient-to-b from-stone-50 to-stone-100/50 border border-stone-200/80 rounded-2xl p-4.5 space-y-3.5 shadow-2xs text-left h-full flex flex-col justify-between">
                      <div className="space-y-3">
                        {data.quickRef.map((ref, idx) => (
                          <div key={idx} className="flex justify-between items-start gap-3 text-xs">
                            <span className="text-[10.5px] font-medium text-stone-500 shrink-0">{ref.label}</span>
                            <span className="font-mono text-[10px] font-bold text-stone-800 text-right select-all">{ref.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accepted Categories with behaviors */}
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-stone-400 font-mono flex items-center gap-2">
                    <CheckCircle2 size={11} className="text-amber-500" />
                    <span>Behavior Categories deep dive</span>
                  </h4>
                  <div className="space-y-3">
                    {data.categories.map((cat, i) => (
                      <div key={i} className="bg-white border border-stone-200/85 hover:border-amber-250/50 rounded-2xl p-4 flex flex-col gap-3 shadow-3xs transition-all duration-200">
                        <div className="flex justify-between items-center bg-stone-50/50 px-3 py-1.5 rounded-xl border border-stone-150/40">
                          <span className="text-[11px] font-extrabold font-sans text-stone-850">{cat.title}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleCopy(cat.code, `cat-${i}`)}
                              className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-150/40 rounded transition-colors cursor-pointer"
                            >
                              {copiedId === `cat-${i}` ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                            </button>
                          </div>
                        </div>
                        <code className="text-[10.5px] font-mono text-rose-650 bg-stone-50 font-semibold border border-stone-150/30 py-2 px-3 rounded-xl select-all select-none">
                          {cat.code}
                        </code>
                        <div className="space-y-2 text-left pl-1">
                          <p className="text-[10.5px] font-bold text-stone-700 leading-relaxed font-sans">
                            {cat.description}
                          </p>
                          <ul className="space-y-1.5 list-disc list-inside text-[10px] text-stone-550 pl-1 leading-relaxed">
                            {cat.behavior.map((beh, idx) => (
                              <li key={idx} className="marker:text-amber-500">
                                {beh}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advanced Fluid Sizing Functions */}
                {data.functions && data.functions.length > 0 && (
                  <div className="space-y-3 bg-amber-50/15 border border-amber-250/25 rounded-2xl p-5.5 shadow-3xs">
                    <h4 className="text-[10.5px] uppercase tracking-wider font-extrabold text-amber-700 font-mono flex items-center gap-2">
                      <Sparkles size={11.5} className="text-amber-500 animate-pulse" />
                      <span>Next-Gen Fluid sizing functions</span>
                    </h4>
                    <p className="text-[10px] text-stone-500 leading-normal font-sans">
                      Let the browser dynamically resolve calculations on the fly using viewport metrics or clamping ranges.
                    </p>
                    <div className="space-y-4 pt-2">
                      {data.functions.map((fn, i) => (
                        <div key={i} className="bg-white border border-amber-200/40 rounded-xl p-3.5 space-y-2 text-left shadow-2xs">
                          <span className="text-[10.5px] font-bold font-mono text-stone-800">{fn.title}</span>
                          <div className="relative">
                            <pre className="text-[10.5px] font-mono bg-stone-900 text-stone-100 rounded-xl p-3.5 leading-snug select-all scrollbar-thin overflow-x-auto">
                              <code>{fn.code}</code>
                            </pre>
                            <button
                              type="button"
                              onClick={() => handleCopy(fn.code, `fn-${i}`)}
                              className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-300 p-1 hover:bg-stone-800 rounded transition-all cursor-pointer"
                            >
                              {copiedId === `fn-${i}` ? <Check size={11.5} className="text-emerald-400" /> : <Copy size={11.5} />}
                            </button>
                          </div>
                          <p className="text-[10px] text-stone-600 leading-relaxed font-sans pt-1">
                            {fn.behavior}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Invalid Values Alert Section */}
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-stone-400 font-mono flex items-center gap-2">
                    <AlertTriangle size={11} className="text-rose-500" />
                    <span>Invalid Values (Avoid Completely)</span>
                  </h4>
                  <div className="bg-rose-50/20 border border-rose-250/20 rounded-2xl overflow-hidden shadow-3xs divide-y divide-rose-100/40">
                    {data.invalidValues.map((inv, i) => (
                      <div key={i} className="p-4 flex flex-col gap-2 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-[9.5px] font-mono bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded-lg select-all strike-through">
                            {inv.example}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] mt-1 text-stone-600">
                          <div>
                            <span className="font-bold text-stone-500 font-mono block uppercase text-[8px] tracking-wider">Why it fails:</span>
                            <span className="font-medium font-sans leading-relaxed block mt-0.5">{inv.why}</span>
                          </div>
                          <div>
                            <span className="font-bold text-stone-500 font-mono block uppercase text-[8px] tracking-wider">Browser behavior:</span>
                            <span className="font-medium font-mono text-rose-700 leading-relaxed block mt-0.5">{inv.behavior}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gotchas / Interactive Common Traps */}
                <div className="space-y-3.5">
                  <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-stone-400 font-mono flex items-center gap-2">
                    <Sliders size={11} className="text-amber-500" />
                    <span>CSS Sizing Snares & Pitfalls (Gotchas)</span>
                  </h4>
                  <div className="space-y-4">
                    {data.gotchas.map((got, i) => (
                      <div key={i} className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4.5 space-y-3 text-left shadow-2xs">
                        <h5 className="text-[11.5px] font-bold text-stone-850 font-sans border-b border-stone-200/45 pb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span>{got.title}</span>
                        </h5>
                        <p className="text-[10px] text-rose-700 font-semibold font-sans leading-relaxed">
                          ⚠️ {got.explanation}
                        </p>
                        
                        {/* CODE HIGHLIGHT EXAMPLE */}
                        <div className="relative">
                          <pre className="text-[10px] font-mono bg-stone-900 text-stone-300 rounded-xl p-3.5 leading-relaxed select-all">
                            <code>{got.badCode}</code>
                          </pre>
                        </div>

                        <div className="bg-white border border-stone-200 p-3.5 rounded-xl space-y-2 mt-2">
                          <div className="space-y-1">
                            <span className="text-[8px] font-black font-mono text-rose-500 uppercase tracking-widest block">The Mechanics (Why it fails):</span>
                            <p className="text-[10px] text-stone-600 font-medium font-sans leading-relaxed">{got.why}</p>
                          </div>
                          <div className="space-y-1 pt-1.5 border-t border-stone-100">
                            <span className="text-[8px] font-black font-mono text-emerald-500 uppercase tracking-widest block">The Production Fix:</span>
                            <p className="text-[10px] text-stone-750 font-bold font-sans leading-relaxed">{got.fix}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactions & Overrides */}
                {data.interactions && data.interactions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-stone-400 font-mono flex items-center gap-2">
                      <CheckCircle2 size={11} className="text-amber-500" />
                      <span>Property Overrides & Priority Hierarchy</span>
                    </h4>
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-4.5 space-y-3 shadow-2xs text-left">
                      {data.interactions.map((int, i) => (
                        <div key={i} className="flex gap-2.5 items-start text-[10px] text-stone-600 leading-relaxed font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0 mt-1.5" />
                          <p className="font-semibold">{int}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Production Practice and Examples */}
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-stone-400 font-mono flex items-center gap-2">
                    <FileCode size={11} className="text-amber-500" />
                    <span>Professional Guidelines & Performance</span>
                  </h4>
                  <div className="bg-white border border-stone-250/60 rounded-2xl p-4.5 space-y-4 shadow-2xs text-left">
                    <div className="space-y-1.5">
                      <span className="text-[8.5px] font-black font-mono text-stone-400 uppercase tracking-widest">Recommended Tailwind Equiv:</span>
                      <ul className="space-y-1 text-[10px] text-stone-600 list-disc list-inside leading-relaxed pl-1">
                        {data.guide.bestProduction.map((rec, idx) => (
                          <li key={idx} className="marker:text-amber-500 font-semibold">{rec}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl space-y-2 mt-2">
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-black font-mono text-rose-500 uppercase tracking-widest block">Performance Watchout:</span>
                        <p className="text-[10px] text-stone-600 font-semibold leading-relaxed font-sans">{data.guide.performance.bad}</p>
                      </div>
                      <div className="space-y-0.5 pt-1.5 border-t border-stone-150/40">
                        <span className="text-[8px] font-black font-mono text-emerald-500 uppercase tracking-widest block">Performant Fix:</span>
                        <p className="text-[10px] text-stone-850 font-bold leading-relaxed font-sans">{data.guide.performance.fix}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-World Code Recipes */}
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-stone-400 font-mono flex items-center gap-2">
                    <Play size={11} className="text-amber-500" />
                    <span>Interactive Code Recipes</span>
                  </h4>
                  <div className="space-y-3">
                    {data.guide.examples.map((ex, i) => (
                      <div key={i} className="bg-white border border-stone-250/70 rounded-2xl p-4 flex flex-col gap-2.5 shadow-3xs">
                        <span className="text-[11px] font-bold font-sans text-stone-800 text-left pl-1 select-none">
                          {ex.title}
                        </span>
                        <div className="relative">
                          <pre className="text-[10px] font-mono bg-stone-900 text-stone-100 rounded-xl p-3.5 leading-relaxed overflow-x-auto scrollbar-thin select-all">
                            <code>{ex.code}</code>
                          </pre>
                          <button
                            type="button"
                            onClick={() => handleCopy(ex.code, `ex-${i}`)}
                            className="absolute right-3 top-3 text-stone-400 hover:text-stone-300 p-1 hover:bg-stone-800 rounded transition-all cursor-pointer"
                          >
                            {copiedId === `ex-${i}` ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
