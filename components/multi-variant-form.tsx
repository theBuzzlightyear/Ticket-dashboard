"use client"

import { useState, useEffect } from "react"
import type { Ticket, CancellationPolicy, Contact } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, RefreshCw, Check } from "lucide-react"
import { createVendorTour, updateCancellationPolicy, updateContact } from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CommentBox } from "@/components/comment-box"

interface MultiVariantFormProps {
  ticket: Ticket
  cancellationPolicy: CancellationPolicy | null
  contact: Contact | null
  onPolicyUpdate: (policy: CancellationPolicy) => void
  onContactUpdate: (contact: Contact) => void
}

export function MultiVariantForm({
  ticket,
  cancellationPolicy,
  contact,
  onPolicyUpdate,
  onContactUpdate,
}: MultiVariantFormProps) {
  // Vendor Tour state
  const [vendorTourCreated, setVendorTourCreated] = useState(false)
  const [vendorTourLoading, setVendorTourLoading] = useState(false)
  const [vendorTourError, setVendorTourError] = useState<string | null>(null)
  const [vendorTourRetrying, setVendorTourRetrying] = useState(false)

  // Policy state
  const [policyStatus, setPolicyStatus] = useState(cancellationPolicy?.status || "ACTIVE")
  const [cancellationMinutes, setCancellationMinutes] = useState<number | null>(
    cancellationPolicy?.cancellationBeforeMinutes || null,
  )
  const [policyLoading, setPolicyLoading] = useState(false)
  const [policyError, setPolicyError] = useState<string | null>(null)
  const [policySuccess, setPolicySuccess] = useState(false)
  const [policyRetrying, setPolicyRetrying] = useState(false)

  // Contact state
  const [phone, setPhone] = useState(contact?.phone || "")
  const [email, setEmail] = useState(contact?.email || "")
  const [contactLoading, setContactLoading] = useState(false)
  const [contactError, setContactError] = useState<string | null>(null)
  const [contactSuccess, setContactSuccess] = useState(false)
  const [contactRetrying, setContactRetrying] = useState(false)

  // Check if cancellation policy or contact exists to determine if vendor tour is created
  useEffect(() => {
    if (cancellationPolicy || contact) {
      setVendorTourCreated(true)
    }
  }, [cancellationPolicy, contact])

  // Handle vendor tour creation
  const handleCreateVendorTour = async () => {
    setVendorTourLoading(true)
    setVendorTourError(null)

    try {
      await createVendorTour(ticket.vendorId, ticket.tourId)
      setVendorTourCreated(true)
    } catch (err) {
      console.error("Failed to create vendor tour:", err)
      setVendorTourError("Failed to create vendor tour. Please try again.")
    } finally {
      setVendorTourLoading(false)
    }
  }

  // Handle policy update
  const handlePolicyUpdate = async () => {
    setPolicyLoading(true)
    setPolicyError(null)
    setPolicySuccess(false)

    try {
      const updatedPolicy = await updateCancellationPolicy(cancellationPolicy?.id || 0, {
        vendorId: ticket.vendorId,
        tourId: ticket.tourId,
        status: policyStatus,
        cancellationBeforeMinutes: cancellationMinutes,
      })

      onPolicyUpdate(updatedPolicy)
      setPolicySuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => setPolicySuccess(false), 3000)
    } catch (err) {
      console.error("Failed to update cancellation policy:", err)
      setPolicyError("Failed to update cancellation policy. Please try again.")
    } finally {
      setPolicyLoading(false)
    }
  }

  // Handle contact update
  const handleContactUpdate = async () => {
    setContactLoading(true)
    setContactError(null)
    setContactSuccess(false)

    try {
      const updatedContact = await updateContact(contact?.id || 0, {
        vendorId: ticket.vendorId,
        tourId: ticket.tourId,
        phone,
        email,
      })

      onContactUpdate(updatedContact)
      setContactSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => setContactSuccess(false), 3000)
    } catch (err) {
      console.error("Failed to update contact:", err)
      setContactError("Failed to update contact information. Please try again.")
    } finally {
      setContactLoading(false)
    }
  }

  // Handle vendor tour retry
  const handleVendorTourRetry = async () => {
    setVendorTourRetrying(true)
    try {
      await handleCreateVendorTour()
    } finally {
      setVendorTourRetrying(false)
    }
  }

  // Handle policy retry
  const handlePolicyRetry = async () => {
    setPolicyRetrying(true)
    try {
      await handlePolicyUpdate()
    } finally {
      setPolicyRetrying(false)
    }
  }

  // Handle contact retry
  const handleContactRetry = async () => {
    setContactRetrying(true)
    try {
      await handleContactUpdate()
    } finally {
      setContactRetrying(false)
    }
  }

  return (
    <div className="space-y-6">
      {!vendorTourCreated ? (
        <Card>
          <CardHeader>
            <CardTitle>Create Vendor Tour</CardTitle>
            <CardDescription>You need to create a vendor tour before you can update the details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vendor ID</Label>
                  <Input value={ticket.vendorId} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Tour ID</Label>
                  <Input value={ticket.tourId} disabled />
                </div>
              </div>

              {vendorTourError && (
                <Alert variant="destructive">
                  <AlertDescription className="flex justify-between items-center">
                    <span>{vendorTourError}</span>
                    <Button variant="outline" size="sm" onClick={handleVendorTourRetry} disabled={vendorTourRetrying}>
                      {vendorTourRetrying ? (
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
              )}

              <Button onClick={handleCreateVendorTour} disabled={vendorTourLoading} className="w-full">
                {vendorTourLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Vendor Tour"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Cancellation Policy</CardTitle>
              <CardDescription>Update the cancellation policy for this tour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policy-status">Status</Label>
                    <Select value={policyStatus} onValueChange={setPolicyStatus}>
                      <SelectTrigger id="policy-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cancellation-minutes">Cancellation Time (minutes before)</Label>
                    <Input
                      id="cancellation-minutes"
                      type="number"
                      value={cancellationMinutes || ""}
                      onChange={(e) => setCancellationMinutes(e.target.value ? Number.parseInt(e.target.value) : null)}
                      placeholder="Enter minutes"
                    />
                  </div>
                </div>

                {policyError && (
                  <Alert variant="destructive">
                    <AlertDescription className="flex justify-between items-center">
                      <span>{policyError}</span>
                      <Button variant="outline" size="sm" onClick={handlePolicyRetry} disabled={policyRetrying}>
                        {policyRetrying ? (
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
                )}

                {policySuccess && (
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Cancellation policy updated successfully.</AlertDescription>
                  </Alert>
                )}

                <Button onClick={handlePolicyUpdate} disabled={policyLoading} className="w-full">
                  {policyLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Cancellation Policy"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update the contact details for this tour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                {contactError && (
                  <Alert variant="destructive">
                    <AlertDescription className="flex justify-between items-center">
                      <span>{contactError}</span>
                      <Button variant="outline" size="sm" onClick={handleContactRetry} disabled={contactRetrying}>
                        {contactRetrying ? (
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
                )}

                {contactSuccess && (
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Contact information updated successfully.</AlertDescription>
                  </Alert>
                )}

                <Button onClick={handleContactUpdate} disabled={contactLoading} className="w-full">
                  {contactLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Contact Information"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add Comment</CardTitle>
          <CardDescription>Add a comment or note about this ticket</CardDescription>
        </CardHeader>
        <CardContent>
          <CommentBox ticketId={ticket.id} />
        </CardContent>
      </Card>
    </div>
  )
}
