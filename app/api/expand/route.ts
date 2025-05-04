import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      system:
        "You are an expert assistant that expands brief comments into more detailed explanations. Maintain the original intent but add relevant details. Be professional and thorough without adding unnecessary content.",
      messages: [
        {
          role: "user",
          content: `Please expand this brief comment into a more detailed explanation: "${prompt}"`,
        },
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error expanding comment:", error)
    return new Response(JSON.stringify({ error: "Failed to expand comment" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
