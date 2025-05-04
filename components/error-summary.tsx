"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Download } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Mock data for demonstration
const errorsByCategory = [
  { name: "Tour Info", errors: 12 },
  { name: "Pricing", errors: 8 },
  { name: "Timings", errors: 15 },
  { name: "Attractions", errors: 5 },
  { name: "Transport", errors: 10 },
]

const errorStatusData = [
  { name: "Correct", value: 40, color: "#22c55e" },
  { name: "Fixed by QA", value: 10, color: "#f59e0b" },
  { name: "Still Incorrect", value: 10, color: "#ef4444" },
]

const commonErrorTypes = [
  {
    id: 1,
    type: "Missing Information",
    count: 8,
    examples: ["Tour duration", "Group size limits", "Accessibility options"],
  },
  { id: 2, type: "Incorrect Pricing", count: 6, examples: ["Seasonal rates not updated", "Group discount errors"] },
  {
    id: 3,
    type: "Outdated Attractions",
    count: 5,
    examples: ["Closed locations", "Changed opening hours", "Temporary closures"],
  },
  {
    id: 4,
    type: "Transport Issues",
    count: 4,
    examples: ["Unavailable options", "Incorrect pickup points", "Outdated vehicle info"],
  },
  {
    id: 5,
    type: "Timing Conflicts",
    count: 3,
    examples: ["Overlapping tours", "Impossible schedules", "Seasonal variations missing"],
  },
]

export function ErrorSummary() {
  const [chartsOpen, setChartsOpen] = useState(true)
  const [detailsOpen, setDetailsOpen] = useState(true)

  const handleExportPDF = () => {
    // In a real application, this would generate a PDF report
    alert("Exporting PDF report...")
  }

  const handleExportCSV = () => {
    // In a real application, this would generate a CSV export
    alert("Exporting CSV data...")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Error Analysis</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Collapsible open={chartsOpen} onOpenChange={setChartsOpen} className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Error Distribution Charts</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {chartsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">Toggle charts</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Errors by Category</CardTitle>
                <CardDescription>Distribution of errors across different tour categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={errorsByCategory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="errors" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Field Status Overview</CardTitle>
                <CardDescription>Current status of all reviewed fields</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={errorStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {errorStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen} className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Common Error Types</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {detailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">Toggle details</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <Card>
            <CardHeader>
              <CardTitle>Common Error Types</CardTitle>
              <CardDescription>Most frequent types of errors found during QA review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonErrorTypes.map((error) => (
                  <div key={error.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{error.type}</h3>
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {error.count} occurrences
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Examples:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {error.examples.map((example, index) => (
                        <li key={index}>{example}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
