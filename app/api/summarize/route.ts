import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      system:
        "You are an assistant that summarizes longer comments into concise, clear summaries. Maintain the key points while reducing length. Be professional and direct.",
      messages: [
        {
          role: "user",
          content: `Please summarize this comment to be more concise: "${prompt}"`,
        },
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error summarizing comment:", error)
    return new Response(JSON.stringify({ error: "Failed to summarize comment" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
