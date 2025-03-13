export default {
  async fetch(request, env) {
    let prompt = "cyberpunk cat"; // Default prompt

    try {
      const url = new URL(request.url);
      
      // Try getting the prompt from query parameters (e.g., ?prompt=your_text)
      if (url.searchParams.has("prompt")) {
        prompt = url.searchParams.get("prompt");
      } else if (request.method === "POST") {
        // If request is POST, try getting the prompt from JSON body
        const body = await request.json();
        if (body.prompt) {
          prompt = body.prompt;
        }
      }
    } catch (error) {
      return new Response("Invalid request format", { status: 400 });
    }

    const inputs = { prompt };

    const response = await env.AI.run(
      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      inputs
    );

    return new Response(response, {
      headers: { "content-type": "image/png" },
    });
  },
} satisfies ExportedHandler<Env>;
