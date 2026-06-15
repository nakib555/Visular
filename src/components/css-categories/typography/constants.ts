import { VisualElement } from "../../../types";

export const fontFamilyMap = {
  "font-sans": "sans-serif",
  "font-serif": "serif",
  "font-mono": "monospace",
};
export const fontWeightMap = {
  "font-light": "300",
  "font-normal": "400",
  "font-medium": "500",
  "font-semibold": "600",
  "font-bold": "700",
};
export const fontStyleMap = { italic: "italic", "not-italic": "normal" };
export const fontSizeMap = {
  "text-xs": "xx-small",
  "text-sm": "x-small",
  "text-base": "medium",
  "text-lg": "large",
  "text-xl": "x-large",
  "text-2xl": "xx-large",
};
export const textAlignMap = {
  "text-left": "left",
  "text-center": "center",
  "text-right": "right",
  "text-justify": "justify",
  "text-start": "start",
  "text-end": "end",
};
export const textTransformMap = {
  uppercase: "uppercase",
  lowercase: "lowercase",
  capitalize: "capitalize",
};
export const textDecorationLineMap = {
  underline: "underline",
  "line-through": "line-through",
};
export const lineHeightMap = {
  "leading-none": "1",
  "leading-tight": "1.25",
  "leading-snug": "1.375",
  "leading-normal": "1.5",
  "leading-relaxed": "1.625",
  "leading-loose": "2",
};
export const letterSpacingMap = {
  "tracking-tighter": "-0.05em",
  "tracking-tight": "-0.025em",
  "tracking-normal": "0em",
  "tracking-wide": "0.025em",
  "tracking-wider": "0.05em",
  "tracking-widest": "0.1em",
};
export const textDecorationStyleMap = {
  "decoration-solid": "solid",
  "decoration-double": "double",
  "decoration-dotted": "dotted",
  "decoration-dashed": "dashed",
  "decoration-wavy": "wavy",
};

export function parseArbitraryValue(className: string, prefix: string): string {
  if (!className) return "";
  const match = className.match(
    new RegExp(
      `(?:^|\\s)${prefix.replace(/[-\[\]()]/g, "\\$&")}\\[([^\]]+)\\](?:$|\\s)`
    )
  );
  if (match) return match[1].replace(/_/g, " ");
  const active = className
    .split(/\s+/)
    .find((c) => c.startsWith(prefix) && !c.includes("["));
  return active ? active.substring(prefix.length) : "";
}

export function parseArbitraryProperty(className: string, propName: string): string {
  if (!className) return "";
  const match = className.match(
    new RegExp(
      `(?:^|\\s)\\[${propName.replace(/[-\[\]()]/g, "\\$&")}:([^\]]+)\\](?:$|\\s)`
    )
  );
  return match ? match[1].replace(/_/g, " ") : "";
}

export function updateArbitraryClass(
  selectedElement: VisualElement,
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void,
  prefix: string,
  value: string
) {
  const currentTokens = (selectedElement.classes || "")
    .split(/\s+/)
    .filter(Boolean);
  let filtered = currentTokens.filter((token) => !token.startsWith(prefix));
  if (value && value.trim()) {
    filtered.push(`${prefix}[${value.trim().replace(/\s+/g, "_" )}]`);
  }
  updateTree((n) => ({ classes: filtered.join(" ") }));
}

export function updateArbitraryProperty(
  selectedElement: VisualElement,
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void,
  propName: string,
  value: string
) {
  const currentTokens = (selectedElement.classes || "")
    .split(/\s+/)
    .filter(Boolean);
  let filtered = currentTokens.filter((token) => !token.startsWith(`[${propName}:`));
  if (value && value.trim()) {
    filtered.push(`[${propName}:${value.trim().replace(/\s+/g, "_")}]`);
  }
  updateTree((n) => ({ classes: filtered.join(" ") }));
}

export function getPropValue(
  selectedElement: VisualElement,
  propName: string,
  tailwindMap?: { [key: string]: string }
): string {
  const arb = parseArbitraryProperty(selectedElement.classes || "", propName);
  if (arb) return arb;

  if (tailwindMap) {
    const tokens = (selectedElement.classes || "").split(/\s+/).filter(Boolean);
    for (const [twClass, realVal] of Object.entries(tailwindMap)) {
      if (tokens.includes(twClass)) {
        return realVal;
      }
    }
  }
  return "";
}

export function setPropValue(
  selectedElement: VisualElement,
  updateTree: (updater: (item: VisualElement) => Partial<VisualElement>) => void,
  propName: string,
  value: string,
  tailwindMap?: { [key: string]: string }
) {
  const currentTokens = (selectedElement.classes || "").split(/\s+/).filter(Boolean);
  let filtered = currentTokens.filter((token) => !token.startsWith(`[${propName}:`));

  if (tailwindMap) {
    const twClasses = Object.keys(tailwindMap);
    filtered = filtered.filter((token) => !twClasses.includes(token));
  }

  if (value && value.trim()) {
    let twMatch = "";
    if (tailwindMap) {
      for (const [twClass, realVal] of Object.entries(tailwindMap)) {
        if (realVal === value.trim()) {
          twMatch = twClass;
          break;
        }
      }
    }

    if (twMatch) {
      filtered.push(twMatch);
    } else {
      filtered.push(`[${propName}:${value.trim().replace(/\s+/g, "_")}]`);
    }
  }
  updateTree((n) => ({ classes: filtered.join(" ") }));
}
