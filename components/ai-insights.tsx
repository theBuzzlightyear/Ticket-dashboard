"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { BarChart3, ListChecks, Lightbulb, RefreshCw, Loader2, FileCheck } from "lucide-react"
import { fetchTours } from "@/lib/api"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export function AIInsights() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [insights, setInsights] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [processTips, setProcessTips] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch tours
        const toursData = await fetchTours()

        // Generate AI insights
        const { text: insightText } = await generateText({
          model: openai("gpt-3.5-turbo"),
          prompt:
            "Generate 3 insights about tour quality assurance processes. Focus on common issues, efficiency improvements, and data accuracy.",
          system: "You are a QA expert for tour management systems. Provide concise, actionable insights.",
        })

        const parsedInsights = insightText
          .split(/\d\./)
          .filter(Boolean)
          .map((s) => s.trim())

        setInsights(parsedInsights)

        // Generate recommendations
        const { text: recommendationsText } = await generateText({
          model: openai("gpt-3.5-turbo"),
          prompt:
            "Generate 3 specific recommendations for improving tour data quality. Focus on practical steps that QA teams can implement.",
          system: "You are a QA expert for tour management systems. Provide specific, actionable recommendations.",
        })

        const parsedRecommendations = recommendationsText
          .split(/\d\./)
          .filter(Boolean)
          .map((s) => s.trim())

        setRecommendations(parsedRecommendations)

        // Generate process tips
        const { text: tipsText } = await generateText({
          model: openai("gpt-3.5-turbo"),
          prompt:
            "Generate 3 process improvement tips for QA teams reviewing tour data. Focus on efficiency and accuracy.",
          system: "You are a process improvement expert for QA teams. Provide practical, implementable tips.",
        })

        const parsedTips = tipsText
          .split(/\d\./)
          .filter(Boolean)
          .map((s) => s.trim())

        setProcessTips(parsedTips)
      } catch (err) {
        console.error("Failed to load AI insights:", err)
        setError("Failed to load AI insights. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Analyzing data with AI...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription className="flex justify-between items-center">
          <span>{error}</span>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">
                    Insight {index + 1}
                  </Badge>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">
                    Action {index + 1}
                  </Badge>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-purple-500" />
            Process Improvement Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {processTips.map((tip, index) => (
              <li key={index} className="border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <span className="text-primary font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <p>{tip}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          <FileCheck className="h-4 w-4 mr-2" />
          Generate Full AI Report
        </Button>
      </div>
    </div>
  )
}
