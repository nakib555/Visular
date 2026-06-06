export type ElementType = "container" | "text" | "button" | "badge" | "image" | "icon";

export interface VisualElement {
  id: string;
  type: ElementType;
  tag: string; // e.g., "div", "h1", "h2", "p", "button", "span", "img"
  classes: string; // All Tailwind classes applied to this element
  content?: string; // Text value, button label, icon identifier, or image source URL
  children?: VisualElement[]; // Nested elements for structural layout
}

// Layout helper templates
export interface ComponentPreset {
  name: string;
  description: string;
  category: "all" | "heroes" | "cards" | "lists" | "calls-to-action";
  root: VisualElement;
}
