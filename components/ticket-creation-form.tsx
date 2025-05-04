"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Sparkles } from "lucide-react"
import { AICommentAssistant } from "@/components/ai-comment-assistant"

interface TicketCreationFormProps {
  onClose: () => void
}

export function TicketCreationForm({ onClose }: TicketCreationFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  const [assignee, setAssignee] = useState("")
  const [includeErrorSummary, setIncludeErrorSummary] = useState(true)
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retrying, setRetrying] = useState(false)
  const [useAI, setUseAI] = useState(false)
  const { toast } = useToast()

  // Mock data for demonstration
  const teamMembers = [
    { id: "user1", name: "John Doe" },
    { id: "user2", name: "Jane Smith" },
    { id: "user3", name: "Alex Johnson" },
    { id: "user4", name: "Sarah Williams" },
  ]

  const errorFields = [
    { id: "field3", name: "Entry Fee" },
    { id: "field6", name: "Duration" },
    { id: "field9", name: "Transport Options" },
  ]

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Please enter a ticket title")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Simulate API call to create ticket
      // In a real app, you would call your API here
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Randomly simulate an error for demonstration purposes
      if (Math.random() > 0.7) {
        throw new Error("Failed to create ticket. Server error.")
      }

      toast({
        title: "Ticket created",
        description: "The ticket has been created successfully and assigned to the team.",
      })

      onClose()
    } catch (err) {
      console.error("Failed to create ticket:", err)
      setError("Failed to create ticket. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = async () => {
    setRetrying(true)
    try {
      // Simulate retrying the failed operation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Ticket created",
        description: "The ticket has been created successfully on retry.",
      })

      onClose()
    } catch (err) {
      console.error("Retry failed:", err)
      setError("Retry failed. Please try again later.")
    } finally {
      setRetrying(false)
    }
  }

  const handleAcceptSuggestion = (text: string) => {
    setDescription(text)
    setUseAI(false)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
          <DialogDescription>Create a ticket to notify the team about issues that need to be fixed.</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription className="flex justify-between items-center">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={handleRetry} disabled={retrying}>
                {retrying ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
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
        )}

        <div className="grid gap-4 py-4">
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
              <AICommentAssistant ticketId={0} initialText={description} onSuggestionAccept={handleAcceptSuggestion} />
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

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="include-summary"
              checked={includeErrorSummary}
              onCheckedChange={(checked) => setIncludeErrorSummary(checked as boolean)}
            />
            <Label htmlFor="include-summary">Include error summary in ticket</Label>
          </div>

          <div className="grid gap-2">
            <Label>Select fields with errors to include</Label>
            <div className="border rounded-md p-4 space-y-2">
              {errorFields.map((field) => (
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
                  <Label htmlFor={field.id}>{field.name}</Label>
                </div>
              ))}
            </div>
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !title.trim() || !description.trim()}>
            {loading ? "Creating..." : "Create Ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
