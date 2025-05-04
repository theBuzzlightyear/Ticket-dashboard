"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, MessageSquare, ThumbsUp, ThumbsDown, RefreshCw, Sparkles } from "lucide-react"
import { useCompletion } from "ai/react"

interface AICommentAssistantProps {
  ticketId: number
  initialText?: string
  onSuggestionAccept?: (text: string) => void
}

export function AICommentAssistant({ ticketId, initialText = "", onSuggestionAccept }: AICommentAssistantProps) {
  const [input, setInput] = useState(initialText)
  const [activeTab, setActiveTab] = useState("improve")

  const improveCompletion = useCompletion({
    api: "/api/ai-suggestions",
    id: `improve-${ticketId}`,
    onFinish: (result) => {
      // Optional callback
    },
  })

  const summarizeCompletion = useCompletion({
    api: "/api/summarize",
    id: `summarize-${ticketId}`,
  })

  const expandCompletion = useCompletion({
    api: "/api/expand",
    id: `expand-${ticketId}`,
  })

  useEffect(() => {
    setInput(initialText)
  }, [initialText])

  const handleImprove = () => {
    if (input.trim()) {
      improveCompletion.complete(input)
    }
  }

  const handleSummarize = () => {
    if (input.trim()) {
      summarizeCompletion.complete(input)
    }
  }

  const handleExpand = () => {
    if (input.trim()) {
      expandCompletion.complete(input)
    }
  }

  const handleAcceptSuggestion = () => {
    if (activeTab === "improve" && improveCompletion.completion) {
      setInput(improveCompletion.completion)
      if (onSuggestionAccept) onSuggestionAccept(improveCompletion.completion)
    } else if (activeTab === "summarize" && summarizeCompletion.completion) {
      setInput(summarizeCompletion.completion)
      if (onSuggestionAccept) onSuggestionAccept(summarizeCompletion.completion)
    } else if (activeTab === "expand" && expandCompletion.completion) {
      setInput(expandCompletion.completion)
      if (onSuggestionAccept) onSuggestionAccept(expandCompletion.completion)
    }
  }

  const getCurrentCompletion = () => {
    switch (activeTab) {
      case "improve":
        return improveCompletion
      case "summarize":
        return summarizeCompletion
      case "expand":
        return expandCompletion
      default:
        return improveCompletion
    }
  }

  const completion = getCurrentCompletion()

  return (
    <div className="space-y-4">
      <div>
        <Textarea
          placeholder="Type your comment here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[100px] mb-2"
        />
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!input.trim() || completion.isLoading}
              onClick={() => setInput("")}
            >
              Clear
            </Button>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="grid grid-cols-3 h-8">
              <TabsTrigger value="improve" className="text-xs px-2">
                Improve
              </TabsTrigger>
              <TabsTrigger value="summarize" className="text-xs px-2">
                Summarize
              </TabsTrigger>
              <TabsTrigger value="expand" className="text-xs px-2">
                Expand
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="default"
          size="sm"
          disabled={!input.trim() || completion.isLoading}
          onClick={() => {
            if (activeTab === "improve") handleImprove()
            else if (activeTab === "summarize") handleSummarize()
            else if (activeTab === "expand") handleExpand()
          }}
        >
          {completion.isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              {activeTab === "improve"
                ? "Improve with AI"
                : activeTab === "summarize"
                  ? "Summarize with AI"
                  : "Expand with AI"}
            </>
          )}
        </Button>
      </div>

      {completion.completion && !completion.isLoading && (
        <Card>
          <CardContent className="p-3">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1 text-primary" />
                <span className="text-sm font-medium">AI Suggestion</span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleAcceptSuggestion}>
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    // Reset the completion
                    if (activeTab === "improve") improveCompletion.complete("")
                    else if (activeTab === "summarize") summarizeCompletion.complete("")
                    else if (activeTab === "expand") expandCompletion.complete("")
                  }}
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    if (activeTab === "improve") handleImprove()
                    else if (activeTab === "summarize") handleSummarize()
                    else if (activeTab === "expand") handleExpand()
                  }}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <p className="text-sm whitespace-pre-wrap">{completion.completion}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
