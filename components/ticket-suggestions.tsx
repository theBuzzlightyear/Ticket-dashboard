"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Lightbulb } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Ticket } from "@/lib/types"

interface TicketSuggestionsProps {
  tickets: Ticket[]
}

export function TicketSuggestions({ tickets }: TicketSuggestionsProps) {
  const [loading, setLoading] = useState(true)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const generateSuggestions = async () => {
      if (tickets.length === 0) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Format tickets for AI prompt
        const ticketData = tickets
          .slice(0, 5)
          .map((t) => `ID: ${t.id}, Name: ${t.productName}, Type: ${t.listingType}`)
          .join("\n")

        const { text } = await generateText({
          model: openai("gpt-3.5-turbo"),
          prompt: `Based on these tickets:\n${ticketData}\n\nProvide 3 actionable insights or suggestions for managing these tickets effectively. Keep each suggestion to one sentence.`,
          system:
            "You are a helpful assistant specialized in ticket management systems. Provide brief, actionable suggestions.",
        })

        // Parse the response into separate suggestions
        const parsedSuggestions = text
          .split(/\d\./)
          .filter(Boolean)
          .map((s) => s.trim())
        setSuggestions(parsedSuggestions)
      } catch (err) {
        console.error("Failed to generate suggestions:", err)
        setError("Failed to load AI suggestions")
      } finally {
        setLoading(false)
      }
    }

    generateSuggestions()
  }, [tickets])

  if (loading) {
    return (
      <div className="p-2 text-center">
        <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">Generating insights...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-2 text-center">
        <p className="text-xs text-muted-foreground">{error}</p>
        <Button variant="ghost" size="sm" className="mt-1 h-7 text-xs">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2 p-1">
      {suggestions.map((suggestion, index) => (
        <Card key={index} className="bg-muted/40">
          <CardContent className="p-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
              <p className="text-xs">{suggestion}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
