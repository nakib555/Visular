import { VisualElement } from "../../../types";

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

export function encodeArbitraryValue(prefix: string, value: string): string {
  if (!value || !value.trim()) return "";
  return `${prefix}[${value.trim().replace(/\s+/g, "_")}]`;
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
    filtered.push(encodeArbitraryValue(prefix, value));
  }
  updateTree((n) => ({ classes: filtered.join(" ") }));
}
