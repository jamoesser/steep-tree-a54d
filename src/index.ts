export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve HTML page when visiting the root
    if (url.pathname === "/") {
      return new Response(
        `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Image Generator</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; margin: 50px; }
                input { padding: 10px; width: 300px; font-size: 16px; }
                button { padding: 10px 20px; font-size: 16px; margin-left: 10px; cursor: pointer; }
                img { display: block; margin-top: 20px; max-width: 100%; }
            </style>
        </head>
        <body>
            <h1>AI Image Generator</h1>
            <input type="text" id="prompt" placeholder="Enter your image prompt..." />
            <button onclick="generateImage()">Generate</button>
            <img id="outputImage" style="display: none;" />
            <script>
                async function generateImage() {
                    const prompt = document.getElementById("prompt").value;
                    if (!prompt) {
                        alert("Please enter a prompt!");
                        return;
                    }

                    const response = await fetch("/generate?prompt=" + encodeURIComponent(prompt));
                    if (!response.ok) {
                        alert("Error generating image. Please try again.");
                        return;
                    }

                    const blob = await response.blob();
                    const imageUrl = URL.createObjectURL(blob);
                    const imgElement = document.getElementById("outputImage");
                    imgElement.src = imageUrl;
                    imgElement.style.display = "block";
                }
            </script>
        </body>
        </html>`,
        { headers: { "content-type": "text/html" } }
      );
    }

    // Handle image generation request
    if (url.pathname === "/generate") {
      const prompt = url.searchParams.get("prompt");
      if (!prompt) {
        return new Response("Prompt is required", { status: 400 });
      }

      const inputs = { prompt };
      const response = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        inputs
      );

      return new Response(response, { headers: { "content-type": "image/png" } });
    }

    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
