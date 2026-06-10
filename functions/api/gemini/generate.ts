export const onRequest = async (context: {
  request: Request;
  env: { GEMINI_API_KEY?: string };
}): Promise<Response> => {
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (context.request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const apiKey = context.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Cloudflare: GEMINI_API_KEY is missing or not configured in your environment bindings." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { description, accentColor } = (await context.request.json()) as any;
    if (!description) {
      return new Response(JSON.stringify({ error: "Please enter a design description." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const geminiResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      throw new Error(`Gemini API returned status ${geminiResponse.status}: ${errText}`);
    }

    const resData: any = await geminiResponse.json();
    let rawHtml = resData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean potential markdown triple-backtick block wrapping just in case
    rawHtml = rawHtml.replace(/^```html\s*/i, "").replace(/```$/, "").trim();

    return new Response(JSON.stringify({ html: rawHtml }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Failed to generate design block." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
