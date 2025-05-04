"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Filter, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { fetchTickets } from "@/lib/api"
import { TicketDetail } from "@/components/ticket-detail"
import type { Ticket } from "@/lib/types"

export function TicketManagement() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true)
        setError(null)

        const ticketsData = await fetchTickets()
        setTickets(ticketsData)
        setFilteredTickets(ticketsData)

        // Select the first ticket by default if available
        if (ticketsData.length > 0) {
          setSelectedTicketId(ticketsData[0].id)
        }
      } catch (err) {
        console.error("Failed to load tickets:", err)
        setError("Failed to load tickets. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load tickets. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadTickets()
  }, [toast])

  useEffect(() => {
    // Apply filters and search
    let filtered = [...tickets]

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((ticket) => ticket.listingType === filterType)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (ticket) =>
          ticket.productName.toLowerCase().includes(term) ||
          ticket.vendorId.toString().includes(term) ||
          ticket.tourId.toString().includes(term),
      )
    }

    setFilteredTickets(filtered)

    // If the currently selected ticket is no longer in the filtered list, select the first one
    if (filtered.length > 0 && !filtered.some((ticket) => ticket.id === selectedTicketId)) {
      setSelectedTicketId(filtered[0].id)
    }
  }, [tickets, filterType, searchTerm, selectedTicketId])

  const handleSelectTicket = (id: number) => {
    setSelectedTicketId(id)
  }

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId) || null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Tickets</CardTitle>
            <CardDescription>Manage tour tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="new_listing">New Listing</SelectItem>
                    <SelectItem value="multi_variant">Multi-Variant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : filteredTickets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No tickets found</div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`p-3 rounded-md border cursor-pointer transition-colors ${
                        selectedTicketId === ticket.id ? "bg-primary/5 border-primary/20" : "hover:bg-muted"
                      }`}
                      onClick={() => handleSelectTicket(ticket.id)}
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
              )}

              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create New Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {selectedTicket ? (
          <TicketDetail ticket={selectedTicket} />
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center min-h-[300px] text-muted-foreground">
              {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : <p>Select a ticket to view details</p>}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
