export const onRequest = async (context: { env: { GEMINI_API_KEY?: string } }): Promise<Response> => {
  const apiKey = context.env.GEMINI_API_KEY || "";
  return new Response(
    JSON.stringify({
      status: "ok",
      hasApiKey: !!apiKey
    }),
    {
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
};
