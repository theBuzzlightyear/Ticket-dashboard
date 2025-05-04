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
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Check } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ReportDialogProps {
  open: boolean
  onClose: () => void
  tickets: any[]
}

export function ReportDialog({ open, onClose, tickets }: ReportDialogProps) {
  const [recipients, setRecipients] = useState("")
  const [subject, setSubject] = useState("Tour Ticket Report")
  const [message, setMessage] = useState("")
  const [includeAllTickets, setIncludeAllTickets] = useState(true)
  const [selectedTickets, setSelectedTickets] = useState<number[]>([])
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [reportFormat, setReportFormat] = useState("detailed")

  const handleSendReport = async () => {
    setSending(true)

    // Simulate sending report
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setSending(false)
    setSent(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setSent(false)
      onClose()
    }, 3000)
  }

  const toggleTicket = (ticketId: number) => {
    setSelectedTickets((prev) => (prev.includes(ticketId) ? prev.filter((id) => id !== ticketId) : [...prev, ticketId]))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Send Report to Team</DialogTitle>
          <DialogDescription>Create and send a report about the current tickets to your team</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recipients" className="text-right">
              Recipients
            </Label>
            <Input
              id="recipients"
              placeholder="email@example.com, email2@example.com"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="format" className="text-right">
              Report Format
            </Label>
            <Select value={reportFormat} onValueChange={setReportFormat}>
              <SelectTrigger id="format" className="col-span-3">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
                <SelectItem value="csv">CSV Export</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Include Tickets</Label>
            <div className="col-span-3 space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-all"
                  checked={includeAllTickets}
                  onCheckedChange={(checked) => {
                    setIncludeAllTickets(!!checked)
                    if (checked) {
                      setSelectedTickets([])
                    }
                  }}
                />
                <Label htmlFor="include-all">Include all tickets</Label>
              </div>

              {!includeAllTickets && (
                <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={`ticket-${ticket.id}`}
                        checked={selectedTickets.includes(ticket.id)}
                        onCheckedChange={() => toggleTicket(ticket.id)}
                      />
                      <Label htmlFor={`ticket-${ticket.id}`}>
                        {ticket.productName} ({ticket.listingType})
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="message" className="text-right pt-2">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Add a message to the report..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="col-span-3"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <div className="text-right pt-2">
              <Label>Preview</Label>
            </div>
            <div className="col-span-3 border rounded-md p-3 max-h-[200px] overflow-y-auto">
              <h3 className="font-medium mb-2">Ticket Report</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.id}</TableCell>
                      <TableCell>{ticket.productName}</TableCell>
                      <TableCell>{ticket.listingType}</TableCell>
                      <TableCell>
                        {ticket.listingType === "new_listing" ? "Ready for update" : "Needs vendor tour"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSendReport} disabled={sending || sent || !recipients.trim()}>
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : sent ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Sent!
              </>
            ) : (
              "Send Report"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
