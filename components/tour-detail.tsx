"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { fetchTour, fetchVendor, fetchCancellationPolicy } from "@/lib/api"
import { CancellationPolicyManager } from "@/components/cancellation-policy-manager"
import { CommentBox } from "@/components/comment-box"

interface TourDetailProps {
  tourId: number
}

export function TourDetail({ tourId }: TourDetailProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tour, setTour] = useState<any | null>(null)
  const [vendor, setVendor] = useState<any | null>(null)
  const [cancellationPolicy, setCancellationPolicy] = useState<any | null>(null)
  const [retrying, setRetrying] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  // Mock field status for demonstration
  const fieldStatuses = [
    { name: "Tour Name", value: "", status: "correct" },
    { name: "Price", value: "", status: "incorrect" },
    { name: "Duration", value: "", status: "fixed" },
    { name: "Transport", value: "", status: "correct" },
    { name: "Group Size", value: "", status: "incorrect" },
  ]

  const loadTourDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch tour data
      const tourData = await fetchTour(tourId)
      setTour(tourData)

      // Update field values from tour data
      fieldStatuses[0].value = tourData.name
      fieldStatuses[1].value = `$${tourData.price}`
      fieldStatuses[2].value = tourData.duration
      fieldStatuses[3].value = tourData.transport
      fieldStatuses[4].value = tourData.groupSize

      // For demo purposes, we'll use vendor ID 1
      const vendorId = 1
      const vendorData = await fetchVendor(vendorId)
      setVendor(vendorData)

      // Fetch cancellation policy
      try {
        const policyData = await fetchCancellationPolicy(vendorId, tourId)
        setCancellationPolicy(policyData)
      } catch (err) {
        console.error("Failed to load cancellation policy:", err)
        // We don't set the main error here, just leave cancellationPolicy as null
      }
    } catch (err) {
      console.error("Failed to load tour details:", err)
      setError("Failed to load tour details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTourDetails()
  }, [tourId])

  const handleRetry = async () => {
    setRetrying(true)
    try {
      await loadTourDetails()
    } finally {
      setRetrying(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "correct":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "incorrect":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "fixed":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "correct":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Correct
          </Badge>
        )
      case "incorrect":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Incorrect
          </Badge>
        )
      case "fixed":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Fixed by QA
          </Badge>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Tour Details</CardTitle>
          <CardDescription>Please wait while we load the tour information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>There was a problem loading the tour details</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex justify-between items-center">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={handleRetry} disabled={retrying}>
                {retrying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </>
                )}
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{tour?.name}</CardTitle>
            <CardDescription>
              {vendor?.name} | {tour?.location}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              2 Correct
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              2 Incorrect
            </Badge>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              1 Fixed
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">Tour Details</TabsTrigger>
            <TabsTrigger value="cancellation">Cancellation Policy</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Field Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {fieldStatuses.map((field, index) => (
                  <div key={index} className="flex items-center justify-between border rounded-md p-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(field.status)}
                      <span className="text-sm font-medium">{field.name}:</span>
                      <span className="text-sm">{field.value}</span>
                    </div>
                    {getStatusBadge(field.status)}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Additional Information</h3>
                <div className="border rounded-md p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Places to Visit:</span>
                      <span className="text-sm font-medium ml-2">{tour?.places?.join(", ")}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Timings:</span>
                      <span className="text-sm font-medium ml-2">{tour?.timings}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cancellation">
            <CancellationPolicyManager
              vendorId={vendor?.id || 1}
              tourId={tourId}
              onPolicyUpdate={(policy) => setCancellationPolicy(policy)}
            />
          </TabsContent>

          <TabsContent value="comments">
            <CommentBox ticketId={tourId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
