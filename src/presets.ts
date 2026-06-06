import { ComponentPreset, VisualElement } from "./types";

// Helper function to generate unique IDs when importing templates
export function generateId(): string {
  return "elem_" + Math.random().toString(36).substring(2, 11);
}

// Deep clone a VisualElement tree and assign fresh unique IDs to avoid selection conflict.
export function cloneTreeWithNewIds(element: VisualElement): VisualElement {
  return {
    ...element,
    id: generateId(),
    children: element.children ? element.children.map(cloneTreeWithNewIds) : undefined,
  };
}

export const COMPONENT_PRESETS: ComponentPreset[] = [
  {
    name: "Aesthetic Newsletter Premium Box",
    description: "A gorgeous luxury-branding opt-in card styled with delicate typography and centered layout.",
    category: "cards",
    root: {
      id: "preset_news_root",
      type: "container",
      tag: "div",
      classes: "p-5 sm:p-8 md:p-12 bg-stone-900 text-stone-100 rounded-3xl shadow-2xl max-w-xl mx-auto text-center border border-stone-800/80 relative overflow-hidden",
      children: [
        {
          id: "news_badge_span",
          type: "badge",
          tag: "span",
          classes: "inline-flex px-3 py-1 text-xs tracking-widest uppercase bg-stone-800 text-stone-400 rounded-full border border-stone-700/50 mb-6 font-mono",
          content: "WEEKLY DESIGNS",
        },
        {
          id: "news_title_h2",
          type: "text",
          tag: "h2",
          classes: "text-2xl md:text-3xl font-serif text-stone-100 font-medium tracking-tight mb-3 leading-tight",
          content: "Curated aesthetic structures",
        },
        {
          id: "news_desc_p",
          type: "text",
          tag: "p",
          classes: "text-stone-400 text-sm md:text-base max-w-md mx-auto mb-8 font-light leading-relaxed",
          content: "Receive a single elegant component blueprint in your inbox each Friday. Minimal styling, maximum impact.",
        },
        {
          id: "news_form_div",
          type: "container",
          tag: "div",
          classes: "flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto",
          children: [
            {
              id: "news_input_div",
              type: "container",
              tag: "div",
              classes: "relative w-full",
              children: [
                {
                  id: "news_input_tag",
                  type: "text",
                  tag: "div",
                  classes: "w-full px-4 py-3 bg-stone-950 border border-stone-800 text-stone-200 rounded-xl text-sm font-sans placeholder-stone-600 focus:outline-none focus:border-stone-700 hover:border-stone-800 transition",
                  content: "your@email.com",
                }
              ]
            },
            {
              id: "news_btn_tag",
              type: "button",
              tag: "button",
              classes: "w-full sm:w-auto px-6 py-3 bg-stone-100 text-stone-950 font-medium rounded-xl text-sm hover:bg-stone-200 transition whitespace-nowrap shadow-md",
              content: "Subscribe",
            },
          ],
        },
        {
          id: "news_footer_span",
          type: "text",
          tag: "span",
          classes: "block text-xs text-stone-600 mt-6 font-mono",
          content: "No tracking. Single opt-out link.",
        },
      ],
    },
  },
  {
    name: "Minimalist Bento Card",
    description: "An elegant feature presentation block showcasing numbers, key titles, and visual alignment.",
    category: "cards",
    root: {
      id: "preset_bento_root",
      type: "container",
      tag: "div",
      classes: "p-5 sm:p-8 bg-white border border-stone-150 rounded-3xl shadow-sm text-left max-w-sm hover:shadow-md transition duration-300",
      children: [
        {
          id: "bento_badge",
          type: "badge",
          tag: "span",
          classes: "text-xs font-mono tracking-wider font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md mb-6 inline-block uppercase",
          content: "Performance v3",
        },
        {
          id: "bento_stat",
          type: "text",
          tag: "h3",
          classes: "text-5xl sm:text-6xl font-light tracking-tighter text-stone-900 font-sans mt-2 mb-2",
          content: "99.8%",
        },
        {
          id: "bento_title",
          type: "text",
          tag: "h4",
          classes: "text-lg font-medium text-stone-800 mb-2 mt-4 tracking-tight",
          content: "Synchronized Core Latency",
        },
        {
          id: "bento_desc",
          type: "text",
          tag: "p",
          classes: "text-stone-500 text-xs leading-relaxed font-normal",
          content: "Fully serverless event processing loops optimized for instant asset updates without page-blocking refreshes.",
        },
        {
          id: "bento_btn",
          type: "button",
          tag: "a",
          classes: "inline-flex items-center gap-1.5 text-xs font-medium text-stone-900 mt-6 hover:text-stone-600 transition",
          content: "Analyze metrics →",
        },
      ],
    },
  },
  {
    name: "Modular Swiss Feature Grid",
    description: "A multi-column flex layout featuring clean horizontal rows, structured spacing, and light colors.",
    category: "lists",
    root: {
      id: "preset_swiss_root",
      type: "container",
      tag: "div",
      classes: "p-5 sm:p-10 bg-stone-50 border border-stone-200 rounded-3xl max-w-2xl mx-auto",
      children: [
        {
          id: "swiss_heading",
          type: "text",
          tag: "h3",
          classes: "text-xl font-medium text-stone-900 tracking-tight mb-8 border-b border-stone-200 pb-4 font-sans",
          content: "Platform Core Principles",
        },
        {
          id: "swiss_list_container",
          type: "container",
          tag: "div",
          classes: "space-y-6",
          children: [
            {
              id: "swiss_row_1",
              type: "container",
              tag: "div",
              classes: "flex gap-4 items-start pb-6 border-b border-stone-150",
              children: [
                {
                  id: "swiss_row1_num",
                  type: "text",
                  tag: "span",
                  classes: "text-sm font-mono text-stone-400 font-bold",
                  content: "01",
                },
                {
                  id: "swiss_row1_content",
                  type: "container",
                  tag: "div",
                  classes: "flex-1",
                  children: [
                    {
                      id: "swiss_row1_title",
                      type: "text",
                      tag: "h4",
                      classes: "text-sm font-semibold text-stone-800 mb-1",
                      content: "Strict Typographic Hierarchy",
                    },
                    {
                      id: "swiss_row1_desc",
                      type: "text",
                      tag: "p",
                      classes: "text-xs text-stone-500 leading-relaxed",
                      content: "Ensuring visual focus naturally flows from structured headers to lightweight body segments.",
                    }
                  ],
                },
              ],
            },
            {
              id: "swiss_row_2",
              type: "container",
              tag: "div",
              classes: "flex gap-4 items-start pb-6 border-b border-stone-150",
              children: [
                {
                  id: "swiss_row2_num",
                  type: "text",
                  tag: "span",
                  classes: "text-sm font-mono text-stone-400 font-bold",
                  content: "02",
                },
                {
                  id: "swiss_row2_content",
                  type: "container",
                  tag: "div",
                  classes: "flex-1",
                  children: [
                    {
                      id: "swiss_row2_title",
                      type: "text",
                      tag: "h4",
                      classes: "text-sm font-semibold text-stone-800 mb-1",
                      content: "Deliberate Contrast Pairing",
                    },
                    {
                      id: "swiss_row2_desc",
                      type: "text",
                      tag: "p",
                      classes: "text-xs text-stone-500 leading-relaxed",
                      content: "Juxtaposing pristine white backdrops against textured obsidian headers for a deeply refined feel.",
                    }
                  ],
                },
              ],
            },
            {
              id: "swiss_row_3",
              type: "container",
              tag: "div",
              classes: "flex gap-4 items-start",
              children: [
                {
                  id: "swiss_row3_num",
                  type: "text",
                  tag: "span",
                  classes: "text-sm font-mono text-stone-400 font-bold",
                  content: "03",
                },
                {
                  id: "swiss_row3_content",
                  type: "container",
                  tag: "div",
                  classes: "flex-1",
                  children: [
                    {
                      id: "swiss_row3_title",
                      type: "text",
                      tag: "h4",
                      classes: "text-sm font-semibold text-stone-800 mb-1",
                      content: "Asymmetrical Padding Rhythm",
                    },
                    {
                      id: "swiss_row3_desc",
                      type: "text",
                      tag: "p",
                      classes: "text-xs text-stone-500 leading-relaxed",
                      content: "Varying inner layouts to keep the workspace inviting and visually non-robotic.",
                    }
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: "Editorial Hero Cover",
    description: "A luxurious layout for branding headers, combining dramatic serif headers and action buttons.",
    category: "heroes",
    root: {
      id: "preset_hero_root",
      type: "container",
      tag: "div",
      classes: "py-10 px-5 sm:py-16 sm:px-8 bg-zinc-950 text-stone-100 rounded-3xl max-w-3xl mx-auto shadow-2xl text-center border border-zinc-800 relative overflow-hidden",
      children: [
        {
          id: "hero_overhead",
          type: "badge",
          tag: "span",
          classes: "text-xs tracking-widest font-mono text-amber-500 uppercase mb-4 inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full",
          content: "INTRODUCING THE COMPOSER",
        },
        {
          id: "hero_header",
          type: "text",
          tag: "h1",
          classes: "text-3xl sm:text-5xl lg:text-6xl font-serif tracking-tight font-normal text-white mt-2 mb-6 max-w-2xl mx-auto leading-[1.1]",
          content: "Elegance lives in fine detail.",
        },
        {
          id: "hero_sub",
          type: "text",
          tag: "p",
          classes: "text-zinc-400 text-sm md:text-base max-w-lg mx-auto mb-10 leading-relaxed font-light",
          content: "Build visual identities that translate the craftsmanship of your product. Responsive frameworks designed with Swiss guidelines.",
        },
        {
          id: "hero_btns",
          type: "container",
          tag: "div",
          classes: "flex gap-4 justify-center items-center flex-wrap",
          children: [
            {
              id: "hero_btn_act",
              type: "button",
              tag: "button",
              classes: "px-6 py-3 bg-white text-zinc-950 rounded-xl font-medium text-sm hover:bg-stone-200 transition shadow-lg",
              content: "Start Creating Now",
            },
            {
              id: "hero_btn_sec",
              type: "button",
              tag: "button",
              classes: "px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium text-sm hover:bg-zinc-800 transition border border-zinc-800",
              content: "Read Design Book",
            }
          ],
        },
      ],
    },
  },
  {
    name: "Luxury Testimonial Block",
    description: "An elegant serif-quote component featuring refined reviewer metadata and profile badge alignment.",
    category: "cards",
    root: {
      id: "preset_testimonial_root",
      type: "container",
      tag: "div",
      classes: "p-5 sm:p-8 max-w-md mx-auto bg-stone-900 text-stone-100 rounded-2xl border border-stone-800 shadow-xl",
      children: [
        {
          id: "testm_quotes",
          type: "text",
          tag: "span",
          classes: "text-stone-700 text-6xl font-serif leading-none select-none block h-4",
          content: "“",
        },
        {
          id: "testm_text",
          type: "text",
          tag: "p",
          classes: "text-stone-300 font-serif italic text-base leading-relaxed tracking-wide mb-6 relative z-10",
          content: "The attention to typographical spacing transforms complex dashboard layouts into beautiful, relaxing reading experiences.",
        },
        {
          id: "testm_meta",
          type: "container",
          tag: "div",
          classes: "flex items-center gap-3 pt-4 border-t border-stone-800",
          children: [
            {
              id: "testm_avatar",
              type: "container",
              tag: "div",
              classes: "w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center font-mono text-stone-300 font-bold text-xs ring-1 ring-stone-700",
              content: "LH",
            },
            {
              id: "testm_writer_container",
              type: "container",
              tag: "div",
              classes: "text-left",
              children: [
                {
                  id: "testm_writer_name",
                  type: "text",
                  tag: "h5",
                  classes: "text-xs font-medium text-stone-200",
                  content: "Livia Haurwitz",
                },
                {
                  id: "testm_writer_role",
                  type: "text",
                  tag: "p",
                  classes: "text-[10px] font-mono text-stone-500 uppercase tracking-widest mt-0.5",
                  content: "Lead Curator at NeueDesk",
                }
              ],
            },
          ],
        },
      ],
    },
  },
];
