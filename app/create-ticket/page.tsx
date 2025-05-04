"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Sparkles } from "lucide-react"
import { fetchTours, fetchTour } from "@/lib/api"
import { AICommentAssistant } from "@/components/ai-comment-assistant"

export default function CreateTicketPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  const [assignee, setAssignee] = useState("")
  const [includeErrorSummary, setIncludeErrorSummary] = useState(true)
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [useAI, setUseAI] = useState(false)
  const [tours, setTours] = useState<any[]>([])
  const [selectedTour, setSelectedTour] = useState("")
  const [tourFields, setTourFields] = useState<any[]>([])
  const [loadingFields, setLoadingFields] = useState(false)

  // Mock data for demonstration
  const teamMembers = [
    { id: "user1", name: "John Doe" },
    { id: "user2", name: "Jane Smith" },
    { id: "user3", name: "Alex Johnson" },
    { id: "user4", name: "Sarah Williams" },
  ]

  useEffect(() => {
    const loadTours = async () => {
      try {
        const toursData = await fetchTours()
        setTours(toursData)
      } catch (error) {
        console.error("Failed to load tours:", error)
      }
    }

    loadTours()
  }, [])

  useEffect(() => {
    const loadTourFields = async () => {
      if (!selectedTour) {
        setTourFields([])
        return
      }

      try {
        setLoadingFields(true)
        const tourId = Number.parseInt(selectedTour)
        const tour = await fetchTour(tourId)

        // Create fields from tour data
        const fields = [
          { id: `${tourId}-name`, name: "Tour Name", value: tour.name },
          { id: `${tourId}-price`, name: "Entry Fee", value: `$${tour.price || "N/A"}` },
          { id: `${tourId}-timings`, name: "Timings", value: tour.timings || "9:00 AM - 5:00 PM" },
          { id: `${tourId}-places`, name: "Places to Visit", value: tour.places?.join(", ") || "Main attractions" },
          { id: `${tourId}-transport`, name: "Mode of Transport", value: tour.transport || "Walking tour" },
          { id: `${tourId}-duration`, name: "Duration", value: tour.duration || "3 hours" },
          { id: `${tourId}-groupSize`, name: "Group Size", value: tour.groupSize || "Up to 15 people" },
        ]

        setTourFields(fields)
      } catch (error) {
        console.error("Failed to load tour fields:", error)
        toast({
          title: "Error",
          description: "Failed to load tour fields. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoadingFields(false)
      }
    }

    loadTourFields()
  }, [selectedTour, toast])

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a ticket title",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // Simulate API call to create ticket
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Ticket created",
        description: "The ticket has been created successfully and assigned to the team.",
      })

      router.push("/")
    } catch (err) {
      console.error("Failed to create ticket:", err)
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptSuggestion = (text: string) => {
    setDescription(text)
    setUseAI(false)
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Ticket</h1>
          <p className="text-muted-foreground">Create a new ticket for QA review</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
            <CardDescription>Enter the details for the new ticket</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Ticket Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="description">Description</Label>
                  <Button variant="outline" size="sm" className="h-7" onClick={() => setUseAI(!useAI)}>
                    <Sparkles className="h-3 w-3 mr-1" />
                    {useAI ? "Write Manually" : "Use AI Assistant"}
                  </Button>
                </div>

                {useAI ? (
                  <AICommentAssistant
                    ticketId={0}
                    initialText={description}
                    onSuggestionAccept={handleAcceptSuggestion}
                  />
                ) : (
                  <Textarea
                    id="description"
                    placeholder="Describe the issues that need to be fixed"
                    className="min-h-[100px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tour">Select Tour</Label>
                  <Select value={selectedTour} onValueChange={setSelectedTour}>
                    <SelectTrigger id="tour">
                      <SelectValue placeholder="Select a tour" />
                    </SelectTrigger>
                    <SelectContent>
                      {tours.map((tour) => (
                        <SelectItem key={tour.id} value={tour.id.toString()}>
                          {tour.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select value={assignee} onValueChange={setAssignee}>
                    <SelectTrigger id="assignee">
                      <SelectValue placeholder="Assign to team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notification">Notification Method</Label>
                  <Select defaultValue="email">
                    <SelectTrigger id="notification">
                      <SelectValue placeholder="Select notification method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="slack">Slack</SelectItem>
                      <SelectItem value="both">Both Email & Slack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedTour && (
                <>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="include-summary"
                      checked={includeErrorSummary}
                      onCheckedChange={(checked) => setIncludeErrorSummary(checked as boolean)}
                    />
                    <Label htmlFor="include-summary">Include error summary in ticket</Label>
                  </div>

                  <div className="grid gap-2">
                    <Label>Select fields with issues to include</Label>
                    {loadingFields ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="border rounded-md p-4 space-y-2">
                        {tourFields.map((field) => (
                          <div key={field.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={field.id}
                              checked={selectedFields.includes(field.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedFields([...selectedFields, field.id])
                                } else {
                                  setSelectedFields(selectedFields.filter((id) => id !== field.id))
                                }
                              }}
                            />
                            <Label htmlFor={field.id}>
                              {field.name}: {field.value}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => router.push("/")}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={loading || !title.trim() || !description.trim()}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Ticket"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
