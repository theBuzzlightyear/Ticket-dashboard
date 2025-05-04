"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AICommentAssistant } from "@/components/ai-comment-assistant"

interface CommentBoxProps {
  ticketId: number
}

export function CommentBox({ ticketId }: CommentBoxProps) {
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<{ id: number; text: string; timestamp: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("write")

  const handleSubmit = () => {
    if (!comment.trim()) return

    setSubmitting(true)

    // Simulate API call to save comment
    setTimeout(() => {
      const newComment = {
        id: Date.now(),
        text: comment,
        timestamp: new Date().toISOString(),
      }

      setComments([...comments, newComment])
      setComment("")
      setSubmitting(false)
    }, 500)
  }

  const handleAcceptSuggestion = (text: string) => {
    setComment(text)
    setActiveTab("write")
  }

  return (
    <div className="space-y-4">
      {comments.length > 0 && (
        <div className="space-y-3 max-h-[200px] overflow-y-auto border rounded-md p-3">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b pb-2 last:border-0 last:pb-0">
              <div className="flex justify-between text-sm">
                <span className="font-medium">You</span>
                <span className="text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-sm mt-1">{comment.text}</p>
            </div>
          ))}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="write">Write Comment</TabsTrigger>
          <TabsTrigger value="ai">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="write">
          <div className="space-y-4">
            <textarea
              placeholder="Add your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] w-full border rounded-md p-2"
            />

            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={submitting || !comment.trim()}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Add Comment"
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai">
          <AICommentAssistant ticketId={ticketId} initialText={comment} onSuggestionAccept={handleAcceptSuggestion} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
