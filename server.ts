import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Google GenAI SDK.
const apiKey = process.env.GEMINI_API_KEY || "";
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

app.use(express.json());

// API: Health probe
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!apiKey,
  });
});

// API: Gemini Copywriter Helper
app.post("/api/gemini/enhance", async (req, res) => {
  try {
    if (!ai) {
      return res.status(400).json({ error: "Gemini API key is missing or not configured." });
    }

    const { text, goal } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided to enhance." });
    }

    const prompt = `You are a world-class micro-copywriter and aesthetic visual designer.
Optimize the following user interface text to be more premium, punchy, elegant, and modern.
Keep it extremely concise and tailored to its context.

Existing text: "${text}"
Copy goals/context: ${goal || "Make it sound more premium and engaging."}

Respond with ONLY the optimized text. Do not include markdown quotes, explanations, or labels. Respond with just the single best line of copy.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const optimized = response.text?.trim() || text;
    res.json({ result: optimized });
  } catch (error: any) {
    console.error("Gemini copywriter error:", error);
    res.status(500).json({ error: error.message || "Failed to process copywriting enhancement." });
  }
});

// API: Gemini Interactive Layout Generator
app.post("/api/gemini/generate", async (req, res) => {
  try {
    if (!ai) {
      return res.status(400).json({ error: "Gemini API key is missing or not configured." });
    }

    const { description, accentColor } = req.body;
    if (!description) {
      return res.status(400).json({ error: "Please enter a design description." });
    }

    const prompt = `You are a world-class HTML & Tailwind UI developer renowned for "Aesthetic Swiss Minimalism", "Elegant Tech-Noir", and warm neutral editorial layouts.
Create a beautiful, fully visual component representing: "${description}".

Design Guidelines to follow:
- **Style Archetype**: Modern, clean, with generous negative space, high contrast, balanced font sizing, and refined borders.
- **Color Palette**: Use soft off-whites, neutral slate/stone grays, and subtle sophisticated color accents (recommended accent: ${accentColor || "indigo-600"}). Avoid harsh neon colors, saturated primary colors, and cheap default gradients.
- **Spacing**: Use elegant, asymmetric spacing (e.g., margins, paddings, gap utilities) instead of uniform blocks.
- **Elements**: Use structural blocks (divs), beautiful icons (represented as emojis or simple placeholders, or simple vector outlines inside spans), elegant typography, buttons, and badges.
- **Completeness**: Produce a SINGLE parent HTML wrapper enclosing the entire component. You should include all necessary nested grids, cards, titles, helper paragraphs, or action buttons so it looks complete, responsive, and gorgeous.
- **Restrictions**: Do NOT write any markdown wrapping, do NOT write \`\`\`html or \`\`\`, do NOT write any custom CSS, JavaScript, or imports. Write raw, valid HTML utilizing only full standard Tailwind classes. For images, use beautiful placeholder illustrations from unsplash (e.g. photos of architecture, desks, abstract, or landscapes) or minimal SVG paths.

Respond with ONLY the raw HTML code containing inline Tailwind classes. Ensure the HTML is perfectly correct, closed, and valid.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    let rawHtml = response.text || "";
    // Clean potential markdown triple-backtick block wrapping just in case
    rawHtml = rawHtml.replace(/^```html\s*/i, "").replace(/```$/, "").trim();

    res.json({ html: rawHtml });
  } catch (error: any) {
    console.error("Gemini layout generator error:", error);
    res.status(500).json({ error: error.message || "Failed to generate design block." });
  }
});

// API: Gemini Responsive Layout Audit Specialist
app.post("/api/gemini/responsive-audit", async (req, res) => {
  try {
    if (!ai) {
      return res.status(400).json({ error: "Gemini API key is missing or not configured." });
    }

    const { html } = req.body;
    if (!html) {
      return res.status(400).json({ error: "No component HTML provided for responsive audit." });
    }

    const prompt = `You are a world-class Tailwind UI layout engineering specialist.
Analyze the following HTML component and rewrite its Tailwind classes to ensure outstanding, perfect visual responsiveness across mobile, tablet, and desktop screens.

Input HTML:
${html}

Requirements:
1. Ensure all grid blocks use stackable mobile designs (e.g., convert "grid-cols-3" to "grid-cols-1 md:grid-cols-3" or "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3").
2. Ensure flex containers wrap properly on small screens or use column directions (e.g., "flex-row" to "flex-col sm:flex-row").
3. Make all wide custom static width classes responsive (e.g., instead of "w-[600px]" or "w-128", use "w-full max-w-xl" or similar).
4. Reduce extreme padding/margin scales on small screens (e.g., "p-16" should be "p-5 sm:p-10 md:p-16").
5. Make oversized display headings adapt beautifully (e.g., "text-6xl" becomes "text-3xl sm:text-5xl md:text-6xl").
6. Keep the existing HTML nodes, text content, and elements exactly the same. Only optimize the utility classes for flawless multi-device presentation.
7. Do NOT include any markdown block quotes or wrapper formatting (\`\`\`html or similar). Respond with ONLY the raw compiled updated HTML.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    let rawHtml = response.text || "";
    // Clean potential markdown triple-backtick block wrapping just in case
    rawHtml = rawHtml.replace(/^```html\s*/i, "").replace(/```$/, "").trim();

    res.json({ html: rawHtml });
  } catch (error: any) {
    console.error("Responsive audit error:", error);
    res.status(500).json({ error: error.message || "Failed to execute responsive styling audit." });
  }
});

// API: Gemini Dynamic Expert CSS Reference Generator
app.post("/api/gemini/css-reference", async (req, res) => {
  try {
    if (!ai) {
      return res.status(400).json({ error: "Gemini API key is missing or not configured." });
    }

    const { property } = req.body;
    if (!property) {
      return res.status(400).json({ error: "Please specify a CSS property to analyze." });
    }

    const prompt = `You are a world-class CSS architect, layout engineer, and technical educator.
Analyze the following CSS property: "${property}".
Generate a structured, highly technical JSON reference object that matches the following TypeScript interfaces:

interface ExpertCSSData {
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

Ensure the output is 100% syntactically valid JSON. Avoid explaining anything outside of the JSON block. Do not prepend "markdown" or \`\`\`json wrappers. Just output the raw JSON object itself. Ensure all strings are correctly escaped and valid. Make the guidance extremely rich, expert-level, and accurate. Give realistic production advice and interactive examples.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    let rawText = response.text || "";
    // Clean any potential markdown code blocks
    rawText = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/, "").trim();

    try {
      const parsedData = JSON.parse(rawText);
      res.json({ success: true, data: parsedData });
    } catch (parseError) {
      console.error("Failed to parse Gemini CSS reference response as JSON. Raw text was:", rawText);
      res.status(500).json({ error: "Failed to compile structured CSS data. Please try again." });
    }
  } catch (error: any) {
    console.error("CSS reference API error:", error);
    res.status(500).json({ error: error.message || "Failed to generate CSS Reference guide." });
  }
});

// Mount Vite middleware in development or static path in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
