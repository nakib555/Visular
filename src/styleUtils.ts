// Tailwind class group utility mappings for clean mutually-exclusive swaps
export const STYLE_GROUPS = {
  fontFamily: ["font-sans", "font-serif", "font-mono"],
  fontWeight: [
    "font-light",
    "font-normal",
    "font-medium",
    "font-semibold",
    "font-bold",
  ],
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
  display: [
    "block",
    "inline-block",
    "inline",
    "flex",
    "inline-flex",
    "grid",
    "inline-grid",
    "flow-root",
    "contents",
    "table",
    "table-row",
    "table-cell",
    "list-item",
    "hidden",
  ],
  flexDirection: [
    "flex-row",
    "flex-row-reverse",
    "flex-col",
    "flex-col-reverse",
  ],
  flexWrap: ["flex-nowrap", "flex-wrap", "flex-wrap-reverse"],
  alignment: [
    "items-start",
    "items-center",
    "items-end",
    "items-baseline",
    "items-stretch",
    "items-normal",
  ],
  justify: [
    "justify-start",
    "justify-center",
    "justify-end",
    "justify-between",
    "justify-around",
    "justify-evenly",
    "justify-normal",
    "justify-stretch",
    "justify-items-left",
    "justify-items-right",
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
    "gap-16",
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
    "max-w-full",
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
    "h-96",
  ],
  tracking: [
    "tracking-tighter",
    "tracking-tight",
    "tracking-normal",
    "tracking-wide",
    "tracking-widest",
  ],
  leading: [
    "leading-none",
    "leading-tight",
    "leading-snug",
    "leading-normal",
    "leading-relaxed",
    "leading-loose",
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
  alignSelf: [
    "self-auto",
    "self-normal",
    "self-stretch",
    "self-start",
    "self-end",
    "self-center",
    "self-baseline",
  ],
  placeSelf: [
    "place-self-auto",
    "place-self-start",
    "place-self-end",
    "place-self-center",
    "place-self-stretch",
  ],
  justifyItems: [
    "justify-items-legacy",
    "justify-items-normal",
    "justify-items-stretch",
    "justify-items-start",
    "justify-items-end",
    "justify-items-center",
    "justify-items-self-start",
    "justify-items-self-end",
    "justify-items-left",
    "justify-items-right",
  ],
  justifySelf: [
    "justify-self-auto",
    "justify-self-normal",
    "justify-self-stretch",
    "justify-self-start",
    "justify-self-end",
    "justify-self-center",
  ],
  alignContent: [
    "content-normal",
    "content-center",
    "content-start",
    "content-end",
    "content-between",
    "content-around",
    "content-evenly",
    "content-baseline",
    "content-stretch",
  ],
  placeContent: [
    "place-content-center",
    "place-content-start",
    "place-content-end",
    "place-content-between",
    "place-content-around",
    "place-content-evenly",
    "place-content-baseline",
    "place-content-stretch",
  ],
  placeItems: [
    "place-items-start",
    "place-items-end",
    "place-items-center",
    "place-items-baseline",
    "place-items-stretch",
  ],
  gridAutoFlow: [
    "auto-flow-row",
    "auto-flow-col",
    "auto-flow-dense",
    "auto-flow-row-dense",
    "auto-flow-col-dense",
  ],
  overflow: [
    "overflow-auto",
    "overflow-hidden",
    "overflow-clip",
    "overflow-visible",
    "overflow-scroll",
  ],
  overflowX: [
    "overflow-x-auto",
    "overflow-x-hidden",
    "overflow-x-clip",
    "overflow-x-visible",
    "overflow-x-scroll",
  ],
  overflowY: [
    "overflow-y-auto",
    "overflow-y-hidden",
    "overflow-y-clip",
    "overflow-y-visible",
    "overflow-y-scroll",
  ],
  scrollBehavior: ["scroll-auto", "scroll-smooth"],
  scrollSnapType: ["snap-none", "snap-x", "snap-y", "snap-both"],
  columns: [
    "columns-1",
    "columns-2",
    "columns-3",
    "columns-4",
    "columns-5",
    "columns-6",
    "columns-7",
    "columns-8",
    "columns-9",
    "columns-10",
    "columns-11",
    "columns-12",
    "columns-auto",
    "columns-3xs",
    "columns-2xs",
    "columns-xs",
    "columns-sm",
    "columns-md",
    "columns-lg",
    "columns-xl",
    "columns-2xl",
    "columns-3xl",
    "columns-4xl",
    "columns-5xl",
    "columns-6xl",
    "columns-7xl",
  ],
  float: [
    "float-right",
    "float-left",
    "float-none",
    "float-start",
    "float-end",
  ],
  clear: [
    "clear-left",
    "clear-right",
    "clear-both",
    "clear-none",
    "clear-start",
    "clear-end",
  ],
  isolation: ["isolate", "isolation-auto"],
  objectFit: [
    "object-contain",
    "object-cover",
    "object-fill",
    "object-none",
    "object-scale-down",
  ],
  objectPosition: [
    "object-bottom",
    "object-center",
    "object-left",
    "object-left-bottom",
    "object-left-top",
    "object-right",
    "object-right-bottom",
    "object-right-top",
    "object-top",
  ],
  overscrollBehavior: [
    "overscroll-auto",
    "overscroll-contain",
    "overscroll-none",
    "overscroll-y-auto",
    "overscroll-y-contain",
    "overscroll-y-none",
    "overscroll-x-auto",
    "overscroll-x-contain",
    "overscroll-x-none",
  ],
  visibility: ["visible", "invisible", "collapse"],
};

// Update active style in a given Tailwind classes string by replacing items from a specific style group
export function setGroupClass(
  classes: string,
  groupKey: keyof typeof STYLE_GROUPS,
  newClass: string,
): string {
  const groupClasses = STYLE_GROUPS[groupKey];
  const currentTokens = classes.split(/\s+/).filter(Boolean);

  // Strip out any existing classes that belong to this group (including responsive/state prefixes like md:, hover:, etc.)
  let filtered = currentTokens.filter((token) => {
    const cleanToken = token.includes(":") ? token.split(":").pop()! : token;
    return !groupClasses.includes(cleanToken);
  });

  if (newClass && newClass.trim()) {
    filtered.push(newClass.trim());
  }

  return filtered.join(" ");
}

// Check which class from a group is active in a classes string
export function getActiveGroupClass(
  classes: string,
  groupKey: keyof typeof STYLE_GROUPS,
): string {
  const groupClasses = STYLE_GROUPS[groupKey];
  const currentTokens = classes.split(/\s+/).filter(Boolean);
  // Optional: currently we just return the base active class, not caring about breakpoints for the inspector
  const active = currentTokens.find((token) => groupClasses.includes(token));
  return active || "";
}

// Modify specific prefixed style properties (e.g. "py-", "px-", "mt-", "mb-") by replacing matching prefixes
export function setPrefixedClass(
  classes: string,
  prefix: string,
  valueClass: string,
): string {
  const currentTokens = classes.split(/\s+/).filter(Boolean);

  // Filter out any token that starts with the target prefix (including responsive/state prefixes)
  let filtered = currentTokens.filter((token) => {
    const cleanToken = token.includes(":") ? token.split(":").pop()! : token;
    if (cleanToken.startsWith(prefix)) {
      return false; // strip it
    }

    // Clean matching conflicting shorthand padding class so PX and PY take predictive effect
    if ((prefix === "px-" || prefix === "py-") && cleanToken.startsWith("p-")) {
      return false;
    }

    // Clean matching conflicting margin shorthand
    if (prefix === "mb-" && cleanToken.startsWith("m-")) {
      return false;
    }

    return true;
  });

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
export function setColorClass(
  classes: string,
  prefix: "bg-" | "text-" | "border-",
  newColorClass: string,
): string {
  const currentTokens = classes.split(/\s+/).filter(Boolean);

  let filtered = currentTokens.filter((token) => {
    const cleanToken = token.includes(":") ? token.split(":").pop()! : token;

    if (prefix === "text-") {
      // Don't strip out text sizes
      if (STYLE_GROUPS.textSize.includes(cleanToken)) return true;
      // Skip alignment or wrapping
      if (STYLE_GROUPS.textAlign.includes(cleanToken)) return true;
      // Strip only text colors (like text-stone-900, text-white, text-amber-500)
      return !cleanToken.startsWith("text-");
    }

    if (prefix === "border-") {
      // Don't strip out border widths
      if (STYLE_GROUPS.borderWidth.includes(cleanToken)) return true;
      // Don't strip styles like border-dashed or border-double
      if (
        [
          "border-dashed",
          "border-dotted",
          "border-double",
          "border-none",
        ].includes(cleanToken)
      )
        return true;
      return !cleanToken.startsWith("border-");
    }

    return !cleanToken.startsWith(prefix);
  });

  if (newColorClass && newColorClass.trim()) {
    filtered.push(newColorClass.trim());
  }

  return filtered.join(" ");
}

// Export nested element compiled down into clean formatted indented HTML with Tailwind
export function compileTreeToHtml(
  element: any,
  indentLevel: number = 0,
): string {
  const indent = "  ".repeat(indentLevel);
  const tag = element.tag || "div";

  // Parse bracket styles to real styles, and filter from export classes
  let inlineStyles: string[] = [];
  let cleanClasses = element.classes || "";
  
  if (element.classes) {
    const matches = Array.from(element.classes.matchAll(/\[([a-zA-Z0-9-]+):([^\]]+)\]/g)) as RegExpMatchArray[];
    for (const match of matches) {
      const propName = match[1];
      const propVal = match[2].replace(/_/g, " ");
      inlineStyles.push(`${propName}: ${propVal}`);
      cleanClasses = cleanClasses.replace(match[0], "");
    }
    cleanClasses = cleanClasses.replace(/\s+/g, " ").trim();
  }

  const styleAttr = inlineStyles.length > 0 ? ` style="${inlineStyles.join("; ")}"` : "";
  const classAttr = cleanClasses ? ` class="${cleanClasses}"` : "";

  if (element.type === "image") {
    const src =
      element.content ||
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";
    return `${indent}<img src="${src}" alt="Visual visual element"${classAttr}${styleAttr} />`;
  }

  // Self closing tag if no content and no children
  const hasContent =
    element.content !== undefined &&
    element.content !== null &&
    element.content !== "";
  const hasChildren = element.children && element.children.length > 0;

  if (!hasContent && !hasChildren) {
    return `${indent}<${tag}${classAttr}${styleAttr}></${tag}>`;
  }

  if (hasContent && !hasChildren) {
    return `${indent}<${tag}${classAttr}${styleAttr}>${element.content}</${tag}>`;
  }

  // Else, recursively wrap children
  let html = `${indent}<${tag}${classAttr}${styleAttr}>\n`;
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
