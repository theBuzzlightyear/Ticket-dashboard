"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorSummary } from "@/components/error-summary"

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Error analysis and reporting</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Error Analysis</CardTitle>
            <CardDescription>Summary of errors found during QA review</CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorSummary />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
