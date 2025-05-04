"use client"

import type { Ticket } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TicketListProps {
  tickets: Ticket[]
  selectedTicketId: number | null
  onSelectTicket: (id: number) => void
}

export function TicketList({ tickets, selectedTicketId, onSelectTicket }: TicketListProps) {
  if (tickets.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No tickets found</div>
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-2">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`p-3 rounded-md border cursor-pointer transition-colors ${
              selectedTicketId === ticket.id ? "bg-primary/5 border-primary/20" : "hover:bg-muted"
            }`}
            onClick={() => onSelectTicket(ticket.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-sm">{ticket.productName}</h3>
                <p className="text-xs text-muted-foreground">
                  Vendor ID: {ticket.vendorId} | Tour ID: {ticket.tourId}
                </p>
              </div>
              <Badge variant={ticket.listingType === "new_listing" ? "default" : "secondary"}>
                {ticket.listingType === "new_listing" ? "New Listing" : "Multi-Variant"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
