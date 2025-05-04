"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  ListChecks,
  Lightbulb,
  RefreshCw,
  Loader2,
  BookOpen,
  LineChart,
  FileCheck,
  Calendar,
  AlertTriangle,
} from "lucide-react"
import { fetchTickets, analyzeTickets } from "@/lib/api"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Ticket } from "@/lib/types"

export default function AIInsights() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("insights")
  const [processTips, setProcessTips] = useState<string[]>([])
  const [weeklyReport, setWeeklyReport] = useState<string>("")
  const [generatingReport, setGeneratingReport] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch tickets
        const ticketsData = await fetchTickets()
        setTickets(ticketsData)

        // Get AI analysis
        const analysisData = await analyzeTickets(ticketsData)
        setAnalysis(analysisData)

        // Generate process improvement tips
        await generateProcessTips(ticketsData)
      } catch (err) {
        console.error("Failed to load AI insights:", err)
        setError("Failed to load AI insights. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const generateProcessTips = async (ticketData: Ticket[]) => {
    try {
      const ticketSummary = ticketData
        .map((t) => `ID: ${t.id}, Name: ${t.productName}, Type: ${t.listingType}`)
        .join("\n")

      const { text } = await generateText({
        model: openai("gpt-3.5-turbo"),
        prompt: `Based on these tickets:\n${ticketSummary}\n\nProvide 5 specific process improvement tips for managing these types of tickets more efficiently. Each tip should be actionable and specific.`,
        system: "You are a process improvement expert specialized in ticket management systems.",
      })

      // Parse the response into separate tips
      const parsedTips = text
        .split(/\d\./)
        .filter(Boolean)
        .map((s) => s.trim())
      setProcessTips(parsedTips)
    } catch (err) {
      console.error("Failed to generate process tips:", err)
    }
  }

  const generateWeeklyReport = async () => {
    setGeneratingReport(true)
    try {
      const ticketSummary = tickets.map((t) => `ID: ${t.id}, Name: ${t.productName}, Type: ${t.listingType}`).join("\n")

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Based on these tickets:\n${ticketSummary}\n\nGenerate a comprehensive weekly report summarizing:
        1. Overall ticket status and distribution
        2. Key issues identified
        3. Progress on resolving tickets
        4. Recommendations for the coming week
        
        Format it as a professional weekly report with sections and bullet points.`,
        system: "You are a professional project manager creating weekly status reports.",
      })

      setWeeklyReport(text)
    } catch (err) {
      console.error("Failed to generate weekly report:", err)
    } finally {
      setGeneratingReport(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Analyzing ticket data with AI...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">AI-Powered Insights</h1>
          <p className="text-muted-foreground">Using AI to analyze your ticket data and provide actionable insights</p>
        </div>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Analysis
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="insights">
            <Lightbulb className="h-4 w-4 mr-2" />
            Key Insights
          </TabsTrigger>
          <TabsTrigger value="improvements">
            <ListChecks className="h-4 w-4 mr-2" />
            Process Improvements
          </TabsTrigger>
          <TabsTrigger value="report">
            <FileCheck className="h-4 w-4 mr-2" />
            Weekly Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  AI Insights
                </CardTitle>
                <CardDescription>Key observations from your ticket data</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis?.insights.map((insight: string, index: number) => (
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
                <CardDescription>AI-suggested actions based on the analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis?.recommendations.map((rec: string, index: number) => (
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
                <LineChart className="h-5 w-5 text-green-500" />
                Ticket Distribution Analysis
              </CardTitle>
              <CardDescription>Analysis of your ticket types and statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4 text-center">
                  <p className="text-4xl font-bold mb-2">
                    {tickets.filter((t) => t.listingType === "new_listing").length}
                  </p>
                  <p className="text-sm text-muted-foreground">New Listings</p>
                </div>
                <div className="border rounded-md p-4 text-center">
                  <p className="text-4xl font-bold mb-2">
                    {tickets.filter((t) => t.listingType === "multi_variant").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Multi-Variants</p>
                </div>
                <div className="border rounded-md p-4 text-center">
                  <p className="text-4xl font-bold mb-2">{tickets.length}</p>
                  <p className="text-sm text-muted-foreground">Total Tickets</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-purple-500" />
                Process Improvement Suggestions
              </CardTitle>
              <CardDescription>AI-generated tips to improve your ticket management process</CardDescription>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Workflow Optimization
                </CardTitle>
                <CardDescription>Suggested workflow improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-100 p-1 rounded text-blue-600">1</div>
                    <p className="text-sm">Implement a triage system to categorize tickets by complexity</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-100 p-1 rounded text-blue-600">2</div>
                    <p className="text-sm">Set up automatic notifications for stalled tickets</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-100 p-1 rounded text-blue-600">3</div>
                    <p className="text-sm">Create predefined templates for common ticket responses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Common Bottlenecks
                </CardTitle>
                <CardDescription>Identified bottlenecks in your workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="bg-amber-100 p-1 rounded text-amber-600">1</div>
                    <p className="text-sm">Missing contact information causing delays in vendor communication</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-amber-100 p-1 rounded text-amber-600">2</div>
                    <p className="text-sm">Duplication of effort when creating multi-variant tickets</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-amber-100 p-1 rounded text-amber-600">3</div>
                    <p className="text-sm">Inconsistent policy application across similar ticket types</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="report">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-500" />
                Weekly Ticket Report
              </CardTitle>
              <CardDescription>AI-generated report summarizing ticket status and progress</CardDescription>
            </CardHeader>
            <CardContent>
              {weeklyReport ? (
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: weeklyReport.replace(/\n/g, "<br/>") }} />
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">
                    Generate a comprehensive weekly report based on your ticket data
                  </p>
                  <Button onClick={generateWeeklyReport} disabled={generatingReport}>
                    {generatingReport ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating report...
                      </>
                    ) : (
                      <>
                        <FileCheck className="h-4 w-4 mr-2" />
                        Generate Weekly Report
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
