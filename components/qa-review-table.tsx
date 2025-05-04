"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Edit, Save, MessageSquare, RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { fetchTours, fetchVendors } from "@/lib/api"
import { AICommentAssistant } from "@/components/ai-comment-assistant"

// Tour-specific field types
type TourField = {
  id: number
  name: string
  value: string
  status: "correct" | "incorrect" | "fixed"
  editable: boolean
  comments: Comment[]
  auditOptions?: string[]
  selectedAudit?: string
}

type Comment = {
  id: number
  text: string
  author: string
  timestamp: string
}

export function QAReviewTable() {
  const [fields, setFields] = useState<TourField[]>([])
  const [editingField, setEditingField] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [currentFieldId, setCurrentFieldId] = useState<number | null>(null)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryingField, setRetryingField] = useState<number | null>(null)
  const [useAI, setUseAI] = useState(false)
  const { toast } = useToast()

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch tours and vendors data
        const [tours, vendors] = await Promise.all([fetchTours(), fetchVendors()])

        // Transform the data into our field format
        const tourFields: TourField[] = []

        tours.forEach((tour) => {
          // Add tour name
          tourFields.push({
            id: tour.id * 100 + 1,
            name: "Tour Name",
            value: tour.name,
            status: "correct",
            editable: true,
            comments: [],
            auditOptions: ["Correct", "Name is misleading", "Name is too generic", "Name is too specific"],
          })

          // Add entry fee
          tourFields.push({
            id: tour.id * 100 + 2,
            name: "Entry Fee",
            value: `$${tour.price || "N/A"}`,
            status: "correct",
            editable: true,
            comments: [],
            auditOptions: ["Correct", "Price is outdated", "Price range is incorrect", "Missing seasonal pricing"],
          })

          // Add timings
          tourFields.push({
            id: tour.id * 100 + 3,
            name: "Timings",
            value: tour.timings || "9:00 AM - 5:00 PM",
            status: "correct",
            editable: true,
            comments: [],
            auditOptions: ["Correct", "Timings are outdated", "Missing holiday hours", "Missing seasonal hours"],
          })

          // Add places to visit
          tourFields.push({
            id: tour.id * 100 + 4,
            name: "Places to Visit",
            value: tour.places?.join(", ") || "Main attractions included in tour",
            status: "correct",
            editable: true,
            comments: [],
            auditOptions: ["Correct", "Missing key attractions", "Contains closed attractions", "Needs updating"],
          })

          // Add mode of transport
          tourFields.push({
            id: tour.id * 100 + 5,
            name: "Mode of Transport",
            value: tour.transport || "Walking tour",
            status: Math.random() > 0.7 ? "incorrect" : "correct",
            editable: true,
            comments: [],
            auditOptions: [
              "Correct",
              "Transport option unavailable",
              "Needs accessibility options",
              "Information outdated",
            ],
          })

          // Add duration
          tourFields.push({
            id: tour.id * 100 + 6,
            name: "Duration",
            value: tour.duration || "3 hours",
            status: Math.random() > 0.8 ? "incorrect" : "correct",
            editable: false,
            comments: [],
            auditOptions: ["Correct", "Duration is inaccurate", "Varies by season", "Needs clarification"],
          })

          // Add group size
          tourFields.push({
            id: tour.id * 100 + 7,
            name: "Group Size",
            value: tour.groupSize || "Up to 15 people",
            status: Math.random() > 0.9 ? "fixed" : "correct",
            editable: true,
            comments: [],
            auditOptions: ["Correct", "Group size is incorrect", "Missing private tour options", "Needs updating"],
          })
        })

        setFields(tourFields)
      } catch (err) {
        console.error("Failed to load data:", err)
        setError("Failed to load tour data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredFields = fields.filter((field) => {
    // Apply status filter
    if (filter !== "all" && field.status !== filter) return false

    // Apply search filter
    if (
      searchTerm &&
      !field.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !field.value.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false

    return true
  })

  const handleEdit = (id: number, value: string) => {
    setEditingField(id)
    setEditValue(value)
  }

  const handleSave = async (id: number) => {
    try {
      // Simulate API call to update the field
      // In a real app, you would call your API here
      await new Promise((resolve) => setTimeout(resolve, 500))

      setFields(fields.map((field) => (field.id === id ? { ...field, value: editValue, status: "fixed" } : field)))
      setEditingField(null)

      toast({
        title: "Field updated",
        description: "The field has been successfully updated.",
      })
    } catch (err) {
      console.error("Failed to save field:", err)
      toast({
        title: "Update failed",
        description: "Failed to update the field. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    try {
      // Simulate API call to update status
      await new Promise((resolve) => setTimeout(resolve, 500))

      setFields(
        fields.map((field) =>
          field.id === id ? { ...field, status: status as "correct" | "incorrect" | "fixed" } : field,
        ),
      )

      toast({
        title: "Status updated",
        description: `Field marked as ${status}.`,
      })
    } catch (err) {
      console.error("Failed to update status:", err)
      toast({
        title: "Status update failed",
        description: "Failed to update the field status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAuditValueChange = async (id: number, value: string) => {
    try {
      // Simulate API call to update audit value
      await new Promise((resolve) => setTimeout(resolve, 500))

      setFields(fields.map((field) => (field.id === id ? { ...field, selectedAudit: value } : field)))

      // If the audit value is "Correct", also update the status
      if (value === "Correct") {
        setFields(fields.map((field) => (field.id === id ? { ...field, status: "correct" } : field)))
      } else {
        setFields(fields.map((field) => (field.id === id ? { ...field, status: "incorrect" } : field)))
      }

      toast({
        title: "Audit value updated",
        description: `Audit value set to "${value}".`,
      })
    } catch (err) {
      console.error("Failed to update audit value:", err)
      toast({
        title: "Update failed",
        description: "Failed to update the audit value. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openCommentDialog = (id: number) => {
    setCurrentFieldId(id)
    setCommentDialogOpen(true)
    setUseAI(false)
  }

  const saveComment = async () => {
    if (!comment.trim() || !currentFieldId) return

    try {
      // Simulate API call to save comment
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newComment = {
        id: Date.now(),
        text: comment,
        author: "Current User",
        timestamp: new Date().toISOString(),
      }

      setFields(
        fields.map((field) =>
          field.id === currentFieldId ? { ...field, comments: [...field.comments, newComment] } : field,
        ),
      )

      setCommentDialogOpen(false)
      setComment("")

      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      })
    } catch (err) {
      console.error("Failed to save comment:", err)
      toast({
        title: "Comment failed",
        description: "Failed to add your comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const retryOperation = async (id: number) => {
    setRetryingField(id)
    try {
      // Simulate retrying the failed operation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the field after successful retry
      setFields(fields.map((field) => (field.id === id ? { ...field, status: "fixed" } : field)))

      toast({
        title: "Operation successful",
        description: "The retry was successful.",
      })
    } catch (err) {
      console.error("Retry failed:", err)
      toast({
        title: "Retry failed",
        description: "The operation failed again. Please try later.",
        variant: "destructive",
      })
    } finally {
      setRetryingField(null)
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

  const handleAcceptSuggestion = (text: string) => {
    setComment(text)
    setUseAI(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex justify-between items-center">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Input
            placeholder="Search fields..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-[250px]"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              <SelectItem value="correct">Correct</SelectItem>
              <SelectItem value="incorrect">Incorrect</SelectItem>
              <SelectItem value="fixed">Fixed by QA</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredFields.length} of {fields.length} fields
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Field Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Audit Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFields.length > 0 ? (
              filteredFields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">{field.id}</TableCell>
                  <TableCell>{field.name}</TableCell>
                  <TableCell>
                    {editingField === field.id ? (
                      <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full" />
                    ) : (
                      <div className="flex items-center gap-2">
                        {field.value}
                        {field.status === "incorrect" && (
                          <span className="text-xs text-red-500">(Needs correction)</span>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(field.status)}
                      {getStatusBadge(field.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {field.auditOptions && (
                      <Select
                        value={field.selectedAudit || ""}
                        onValueChange={(value) => handleAuditValueChange(field.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select audit value" />
                        </SelectTrigger>
                        <SelectContent>
                          {field.auditOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {editingField === field.id ? (
                        <Button size="sm" variant="outline" onClick={() => handleSave(field.id)}>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      ) : field.editable && field.status !== "correct" ? (
                        <Button size="sm" variant="outline" onClick={() => handleEdit(field.id, field.value)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      ) : null}

                      <Button size="sm" variant="ghost" onClick={() => openCommentDialog(field.id)}>
                        <MessageSquare className="h-4 w-4" />
                        {field.comments.length > 0 && <span className="ml-1 text-xs">{field.comments.length}</span>}
                      </Button>

                      {field.status !== "correct" && (
                        <Select value={field.status} onValueChange={(value) => handleStatusChange(field.id, value)}>
                          <SelectTrigger className="w-[130px] h-8">
                            <SelectValue placeholder="Set status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="correct">Mark Correct</SelectItem>
                            <SelectItem value="incorrect">Mark Incorrect</SelectItem>
                            <SelectItem value="fixed">Mark Fixed</SelectItem>
                          </SelectContent>
                        </Select>
                      )}

                      {retryingField === field.id ? (
                        <Button size="sm" variant="outline" disabled>
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          Retrying...
                        </Button>
                      ) : field.status === "incorrect" && !field.editable ? (
                        <Button size="sm" variant="outline" onClick={() => retryOperation(field.id)}>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Retry
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>
              Add a comment about this field to help the development team understand the issue.
            </DialogDescription>
          </DialogHeader>

          {currentFieldId && (
            <div className="space-y-4">
              {fields.find((f) => f.id === currentFieldId)?.comments.length ? (
                <div className="space-y-3 max-h-[200px] overflow-y-auto border rounded-md p-3">
                  {fields
                    .find((f) => f.id === currentFieldId)
                    ?.comments.map((comment) => (
                      <div key={comment.id} className="border-b pb-2 last:border-0 last:pb-0">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm mt-1">{comment.text}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              )}

              <div className="flex gap-2">
                <Button
                  variant={useAI ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseAI(true)}
                  className="flex-1"
                >
                  Use AI Assistant
                </Button>
                <Button
                  variant={!useAI ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseAI(false)}
                  className="flex-1"
                >
                  Write Manually
                </Button>
              </div>

              {useAI ? (
                <AICommentAssistant
                  ticketId={currentFieldId}
                  initialText={comment}
                  onSuggestionAccept={handleAcceptSuggestion}
                />
              ) : (
                <Textarea
                  placeholder="Type your comment here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px]"
                />
              )}
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={saveComment} disabled={!comment.trim()}>
              Add Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
