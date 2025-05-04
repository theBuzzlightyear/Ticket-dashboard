"use client"

import { useState, useEffect } from "react"
import type { Ticket, CancellationPolicy, Contact, Vendor, Tour } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { NewListingForm } from "@/components/new-listing-form"
import { MultiVariantForm } from "@/components/multi-variant-form"
import { fetchVendor, fetchTour, fetchCancellationPolicy, fetchContact } from "@/lib/api"
import { CancellationPolicyManager } from "@/components/cancellation-policy-manager"

interface TicketDetailProps {
  ticket: Ticket
}

export function TicketDetail({ ticket }: TicketDetailProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [tour, setTour] = useState<Tour | null>(null)
  const [cancellationPolicy, setCancellationPolicy] = useState<CancellationPolicy | null>(null)
  const [contact, setContact] = useState<Contact | null>(null)
  const [retrying, setRetrying] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  const loadTicketDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch vendor and tour information in parallel
      const [vendorData, tourData] = await Promise.all([fetchVendor(ticket.vendorId), fetchTour(ticket.tourId)])

      setVendor(vendorData)
      setTour(tourData)

      // For both listing types, we'll try to fetch cancellation policy and contact
      try {
        const policyData = await fetchCancellationPolicy(ticket.vendorId, ticket.tourId)
        setCancellationPolicy(policyData)
      } catch (err) {
        console.error("Failed to load cancellation policy:", err)
        // We don't set the main error here, just leave cancellationPolicy as null
      }

      try {
        const contactData = await fetchContact(ticket.vendorId, ticket.tourId)
        setContact(contactData)
      } catch (err) {
        console.error("Failed to load contact:", err)
        // We don't set the main error here, just leave contact as null
      }
    } catch (err) {
      console.error("Failed to load ticket details:", err)
      setError("Failed to load ticket details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTicketDetails()
  }, [ticket])

  const handleRetry = async () => {
    setRetrying(true)
    try {
      await loadTicketDetails()
    } finally {
      setRetrying(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Ticket Details</CardTitle>
          <CardDescription>Please wait while we load the ticket information</CardDescription>
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
          <CardDescription>There was a problem loading the ticket details</CardDescription>
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
            <CardTitle>{ticket.productName}</CardTitle>
            <CardDescription>
              {vendor?.name} | {tour?.name} | {tour?.location}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Cancellation Policy Manager */}
          <CancellationPolicyManager
            vendorId={ticket.vendorId}
            tourId={ticket.tourId}
            onPolicyUpdate={(policy) => setCancellationPolicy(policy)}
          />

          {/* Ticket Form based on listing type */}
          {ticket.listingType === "new_listing" ? (
            <NewListingForm
              ticket={ticket}
              cancellationPolicy={cancellationPolicy}
              contact={contact}
              onPolicyUpdate={(policy) => setCancellationPolicy(policy)}
              onContactUpdate={(contact) => setContact(contact)}
            />
          ) : (
            <MultiVariantForm
              ticket={ticket}
              cancellationPolicy={cancellationPolicy}
              contact={contact}
              onPolicyUpdate={(policy) => setCancellationPolicy(policy)}
              onContactUpdate={(contact) => setContact(contact)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
