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

    const { html } = (await context.request.json()) as any;
    if (!html) {
      return new Response(JSON.stringify({ error: "No component HTML provided for responsive audit." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
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
    return new Response(JSON.stringify({ error: error.message || "Failed to execute responsive styling audit." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
