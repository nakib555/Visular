export const onRequest = async (context: {
  request: Request;
  env: { GEMINI_API_KEY?: string };
}): Promise<Response> => {
  // CORS & Options handling
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

    const { text, goal } = (await context.request.json()) as any;
    if (!text) {
      return new Response(JSON.stringify({ error: "No text provided to enhance." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `You are a world-class micro-copywriter and aesthetic visual designer.
Optimize the following user interface text to be more premium, punchy, elegant, and modern.
Keep it extremely concise and tailored to its context.

Existing text: "${text}"
Copy goals/context: ${goal || "Make it sound more premium and engaging."}

Respond with ONLY the optimized text. Do not include markdown quotes, explanations, or labels. Respond with just the single best line of copy.`;

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
    const optimized = resData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || text;

    return new Response(JSON.stringify({ result: optimized }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Failed to process copywriting." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
