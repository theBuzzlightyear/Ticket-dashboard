import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      system:
        "You are a helpful assistant that improves comments for a ticket management system. Make the comment more detailed, professional, and actionable. Keep your response concise and focused on improving the original comment without changing its core meaning.",
      messages: [
        {
          role: "user",
          content: `Please improve this comment for a tour ticket: "${prompt}"`,
        },
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error generating AI suggestion:", error)
    return new Response(JSON.stringify({ error: "Failed to generate suggestion" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
