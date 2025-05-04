"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QAReviewTable } from "@/components/qa-review-table"

export default function QAReviewPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold">QA Review</h1>
          <p className="text-muted-foreground">Review and correct tour information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tour Quality Review</CardTitle>
            <CardDescription>Review and correct tour information fields</CardDescription>
          </CardHeader>
          <CardContent>
            <QAReviewTable />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
