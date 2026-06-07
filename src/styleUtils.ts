// Tailwind class group utility mappings for clean mutually-exclusive swaps
export const STYLE_GROUPS = {
  fontFamily: ["font-sans", "font-serif", "font-mono"],
  fontWeight: ["font-light", "font-normal", "font-medium", "font-semibold", "font-bold"],
  textSize: [
    "text-xs",
    "text-sm",
    "text-base",
    "text-lg",
    "text-xl",
    "text-2xl",
    "text-3xl",
    "text-4xl",
    "text-5xl",
    "text-6xl",
    "text-7xl",
  ],
  display: ["block", "inline-block", "inline", "flex", "grid", "hidden"],
  flexDirection: ["flex-row", "flex-row-reverse", "flex-col", "flex-col-reverse"],
  flexWrap: ["flex-nowrap", "flex-wrap", "flex-wrap-reverse"],
  alignment: ["items-start", "items-center", "items-end", "items-baseline", "items-stretch"],
  justify: [
    "justify-start",
    "justify-center",
    "justify-end",
    "justify-between",
    "justify-around",
    "justify-evenly",
  ],
  gap: [
    "gap-0",
    "gap-1",
    "gap-2",
    "gap-3",
    "gap-4",
    "gap-5",
    "gap-6",
    "gap-8",
    "gap-10",
    "gap-12",
    "gap-16"
  ],
  width: [
    "w-auto",
    "w-full",
    "w-1/2",
    "w-1/3",
    "w-2/3",
    "w-1/4",
    "w-3/4",
    "w-12",
    "w-24",
    "w-32",
    "w-48",
    "w-64",
    "w-96",
    "max-w-xs",
    "max-w-sm",
    "max-w-md",
    "max-w-lg",
    "max-w-xl",
    "max-w-2xl",
    "max-w-3xl",
    "max-w-4xl",
    "max-w-full"
  ],
  height: [
    "h-auto",
    "h-full",
    "h-12",
    "h-16",
    "h-20",
    "h-24",
    "h-32",
    "h-40",
    "h-48",
    "h-56",
    "h-64",
    "h-80",
    "h-96"
  ],
  tracking: [
    "tracking-tighter",
    "tracking-tight",
    "tracking-normal",
    "tracking-wide",
    "tracking-widest"
  ],
  leading: [
    "leading-none",
    "leading-tight",
    "leading-snug",
    "leading-normal",
    "leading-relaxed",
    "leading-loose"
  ],
  textAlign: ["text-left", "text-center", "text-right", "text-justify"],
  rounding: [
    "rounded-none",
    "rounded-sm",
    "rounded",
    "rounded-md",
    "rounded-lg",
    "rounded-xl",
    "rounded-2xl",
    "rounded-3xl",
    "rounded-full",
  ],
  borderWidth: ["border-0", "border", "border-2", "border-4", "border-8"],
  shadow: [
    "shadow-none",
    "shadow-sm",
    "shadow",
    "shadow-md",
    "shadow-lg",
    "shadow-xl",
    "shadow-2xl",
  ],
  boxSizing: ["box-border", "box-content"],
  aspectRatio: ["aspect-auto", "aspect-square", "aspect-video"],
  position: ["static", "relative", "absolute", "fixed", "sticky"],
  flexGrow: ["grow-0", "grow"],
  flexShrink: ["shrink-0", "shrink"],
  alignSelf: ["self-auto", "self-start", "self-end", "self-center", "self-stretch", "self-baseline"],
  justifyItems: ["justify-items-start", "justify-items-end", "justify-items-center", "justify-items-stretch"],
  overflow: ["overflow-auto", "overflow-hidden", "overflow-clip", "overflow-visible", "overflow-scroll"],
  overflowX: ["overflow-x-auto", "overflow-x-hidden", "overflow-x-clip", "overflow-x-visible", "overflow-x-scroll"],
  overflowY: ["overflow-y-auto", "overflow-y-hidden", "overflow-y-clip", "overflow-y-visible", "overflow-y-scroll"],
  scrollBehavior: ["scroll-auto", "scroll-smooth"],
  scrollSnapType: ["snap-none", "snap-x", "snap-y", "snap-both"]
};

// Update active style in a given Tailwind classes string by replacing items from a specific style group
export function setGroupClass(classes: string, groupKey: keyof typeof STYLE_GROUPS, newClass: string): string {
  const groupClasses = STYLE_GROUPS[groupKey];
  const currentTokens = classes.split(/\s+/).filter(Boolean);
  
  // Strip out any existing classes that belong to this group
  let filtered = currentTokens.filter((token) => !groupClasses.includes(token));
  
  if (newClass && newClass.trim()) {
    filtered.push(newClass.trim());
  }
  
  return filtered.join(" ");
}

// Check which class from a group is active in a classes string
export function getActiveGroupClass(classes: string, groupKey: keyof typeof STYLE_GROUPS): string {
  const groupClasses = STYLE_GROUPS[groupKey];
  const currentTokens = classes.split(/\s+/).filter(Boolean);
  const active = currentTokens.find((token) => groupClasses.includes(token));
  return active || "";
}

// Modify specific prefixed style properties (e.g. "py-", "px-", "mt-", "mb-") by replacing matching prefixes
export function setPrefixedClass(classes: string, prefix: string, valueClass: string): string {
  const currentTokens = classes.split(/\s+/).filter(Boolean);
  
  // Filter out any token that starts with the target prefix
  let filtered = currentTokens.filter((token) => !token.startsWith(prefix));
  
  // Clean matching conflicting shorthand padding class so PX and PY take predictive effect
  if (prefix === "px-" || prefix === "py-") {
    filtered = filtered.filter((token) => {
      if (token.startsWith("px-") || token.startsWith("py-")) {
        return true;
      }
      return !token.startsWith("p-");
    });
  }

  // Clean matching conflicting margin shorthand
  if (prefix === "mb-") {
    filtered = filtered.filter((token) => {
      if (token.startsWith("ml-") || token.startsWith("mr-") || token.startsWith("mt-") || token.startsWith("mb-")) {
        return true;
      }
      return !token.startsWith("m-");
    });
  }
  
  if (valueClass && valueClass.trim()) {
    filtered.push(valueClass.trim());
  }
  
  return filtered.join(" ");
}

// Get active class value starting with a specific prefix
export function getPrefixedClass(classes: string, prefix: string): string {
  const currentTokens = classes.split(/\s+/).filter(Boolean);
  const token = currentTokens.find((token) => token.startsWith(prefix));
  return token || "";
}

// Handle colors precisely (bg-*, text-*, border-*) without breaking typography sizing classes like 'text-lg'
export function setColorClass(classes: string, prefix: "bg-" | "text-" | "border-", newColorClass: string): string {
  const currentTokens = classes.split(/\s+/).filter(Boolean);
  
  let filtered = currentTokens.filter((token) => {
    if (prefix === "text-") {
      // Don't strip out text sizes
      if (STYLE_GROUPS.textSize.includes(token)) return true;
      // Skip alignment or wrapping
      if (STYLE_GROUPS.textAlign.includes(token)) return true;
      // Strip only text colors (like text-stone-900, text-white, text-amber-500)
      return !token.startsWith("text-");
    }
    
    if (prefix === "border-") {
      // Don't strip out border widths
      if (STYLE_GROUPS.borderWidth.includes(token)) return true;
      // Don't strip styles like border-dashed or border-double
      if (["border-dashed", "border-dotted", "border-double", "border-none"].includes(token)) return true;
      return !token.startsWith("border-");
    }
    
    return !token.startsWith(prefix);
  });
  
  if (newColorClass && newColorClass.trim()) {
    filtered.push(newColorClass.trim());
  }
  
  return filtered.join(" ");
}

// Export nested element compiled down into clean formatted indented HTML with Tailwind
export function compileTreeToHtml(element: any, indentLevel: number = 0): string {
  const indent = "  ".repeat(indentLevel);
  const tag = element.tag || "div";
  const classAttr = element.classes ? ` class="${element.classes}"` : "";
  
  if (element.type === "image") {
    const src = element.content || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";
    return `${indent}<img src="${src}" alt="Visual visual element" class="${element.classes || ""}" />`;
  }
  
  // Self closing tag if no content and no children
  const hasContent = element.content !== undefined && element.content !== null && element.content !== "";
  const hasChildren = element.children && element.children.length > 0;
  
  if (!hasContent && !hasChildren) {
    return `${indent}<${tag}${classAttr}></${tag}>`;
  }
  
  if (hasContent && !hasChildren) {
    return `${indent}<${tag}${classAttr}>${element.content}</${tag}>`;
  }
  
  // Else, recursively wrap children
  let html = `${indent}<${tag}${classAttr}>\n`;
  if (hasContent) {
    html += `${indent}  ${element.content}\n`;
  }
  
  if (element.children) {
    element.children.forEach((child: any) => {
      html += compileTreeToHtml(child, indentLevel + 1) + "\n";
    });
  }
  
  html += `${indent}</${tag}>`;
  return html;
}
