"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { QAReviewTable } from "@/components/qa-review-table"
import { TicketCreationForm } from "@/components/ticket-creation-form"
import { PlusCircle, Bell, FileText } from "lucide-react"
import { NotificationCenter } from "@/components/notification-center"
import { AIInsights } from "@/components/ai-insights"
import { TicketManagement } from "@/components/ticket-management"
import { TourList } from "@/components/tour-list"

export default function Dashboard() {
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">QA Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage tour quality assurance</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setShowTicketForm(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
            <Button variant="outline" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} />}

        <Tabs defaultValue="tours">
          <TabsList className="grid grid-cols-4 w-full md:w-[500px]">
            <TabsTrigger value="tours">Tours</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="review">QA Review</TabsTrigger>
            <TabsTrigger value="ai">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="tours" className="mt-6">
            <TourList />
          </TabsContent>

          <TabsContent value="tickets" className="mt-6">
            <TicketManagement />
          </TabsContent>

          <TabsContent value="review" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Tour Quality Review</CardTitle>
                <CardDescription>Review and correct tour information</CardDescription>
              </CardHeader>
              <CardContent>
                <QAReviewTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>Intelligent analysis of your QA data</CardDescription>
              </CardHeader>
              <CardContent>
                <AIInsights />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {showTicketForm && <TicketCreationForm onClose={() => setShowTicketForm(false)} />}
    </div>
  )
}
