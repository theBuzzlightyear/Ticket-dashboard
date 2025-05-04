"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Filter, CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { fetchTours, fetchCancellationPolicy } from "@/lib/api"
import Link from "next/link"

export function TourList() {
  const [tours, setTours] = useState<any[]>([])
  const [filteredTours, setFilteredTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [cancellationPolicies, setCancellationPolicies] = useState<Record<number, any>>({})
  const { toast } = useToast()

  useEffect(() => {
    const loadTours = async () => {
      try {
        setLoading(true)
        setError(null)

        const toursData = await fetchTours()

        // Add field status information to each tour
        const toursWithStatus = toursData.map((tour) => {
          // For demo purposes, we'll randomly assign status to fields
          const fields = [
            {
              name: "Tour Name",
              value: tour.name,
              status: Math.random() > 0.7 ? "incorrect" : "correct",
            },
            {
              name: "Price",
              value: `$${tour.price}`,
              status: Math.random() > 0.8 ? "fixed" : "correct",
            },
            {
              name: "Duration",
              value: tour.duration,
              status: Math.random() > 0.75 ? "incorrect" : "correct",
            },
            {
              name: "Transport",
              value: tour.transport,
              status: Math.random() > 0.85 ? "fixed" : "correct",
            },
            {
              name: "Group Size",
              value: tour.groupSize,
              status: Math.random() > 0.9 ? "incorrect" : "correct",
            },
          ]

          return {
            ...tour,
            fields,
            // Calculate stats
            stats: {
              correct: fields.filter((f) => f.status === "correct").length,
              incorrect: fields.filter((f) => f.status === "incorrect").length,
              fixed: fields.filter((f) => f.status === "fixed").length,
            },
          }
        })

        setTours(toursWithStatus)
        setFilteredTours(toursWithStatus)

        // Load cancellation policies for each tour
        const policies: Record<number, any> = {}
        for (const tour of toursData) {
          try {
            // For demo purposes, we'll use vendor ID 1 for all tours
            const policy = await fetchCancellationPolicy(1, tour.id)
            if (policy) {
              policies[tour.id] = policy
            }
          } catch (err) {
            console.error(`Failed to load policy for tour ${tour.id}:`, err)
          }
        }

        setCancellationPolicies(policies)
      } catch (err) {
        console.error("Failed to load tours:", err)
        setError("Failed to load tours. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load tours. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadTours()
  }, [toast])

  useEffect(() => {
    // Apply filters and search
    let filtered = [...tours]

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((tour) => {
        if (filterStatus === "correct") {
          return tour.stats.correct > 0
        } else if (filterStatus === "incorrect") {
          return tour.stats.incorrect > 0
        } else if (filterStatus === "fixed") {
          return tour.stats.fixed > 0
        }
        return true
      })
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (tour) => tour.name.toLowerCase().includes(term) || tour.location.toLowerCase().includes(term),
      )
    }

    setFilteredTours(filtered)
  }, [tours, filterStatus, searchTerm])

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tours</CardTitle>
          <CardDescription>Review and manage tour information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="correct">Has Correct</SelectItem>
                  <SelectItem value="incorrect">Has Incorrect</SelectItem>
                  <SelectItem value="fixed">Has Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : filteredTours.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No tours found</div>
            ) : (
              <div className="space-y-4">
                {filteredTours.map((tour) => (
                  <Card key={tour.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{tour.name}</CardTitle>
                          <CardDescription>{tour.location}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {tour.stats.correct} Correct
                          </Badge>
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {tour.stats.incorrect} Incorrect
                          </Badge>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            {tour.stats.fixed} Fixed
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Tour Fields</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {tour.fields.map((field: any, index: number) => (
                              <div key={index} className="flex items-center justify-between border rounded-md p-2">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(field.status)}
                                  <span className="text-sm font-medium">{field.name}:</span>
                                  <span className="text-sm">{field.value}</span>
                                </div>
                                {getStatusBadge(field.status)}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">Cancellation Policy</h3>
                          {cancellationPolicies[tour.id] ? (
                            <div className="border rounded-md p-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="text-sm text-muted-foreground">Status:</span>
                                  <span className="text-sm font-medium ml-2">
                                    {cancellationPolicies[tour.id].status}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Cancellation Time:</span>
                                  <span className="text-sm font-medium ml-2">
                                    {cancellationPolicies[tour.id].cancellationBeforeMinutes
                                      ? `${cancellationPolicies[tour.id].cancellationBeforeMinutes} minutes before`
                                      : "Not specified"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground border rounded-md p-3">
                              No cancellation policy found
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <Link href={`/tour/${tour.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
