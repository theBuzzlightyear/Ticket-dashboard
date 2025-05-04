"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Check, RefreshCw } from "lucide-react"
import { fetchCancellationPolicy, updateCancellationPolicy } from "@/lib/api"
import type { CancellationPolicy } from "@/lib/types"

interface CancellationPolicyManagerProps {
  vendorId: number
  tourId: number
  onPolicyUpdate?: (policy: CancellationPolicy) => void
}

export function CancellationPolicyManager({ vendorId, tourId, onPolicyUpdate }: CancellationPolicyManagerProps) {
  const [policy, setPolicy] = useState<CancellationPolicy | null>(null)
  const [policyStatus, setPolicyStatus] = useState("ACTIVE")
  const [cancellationMinutes, setCancellationMinutes] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [policyLoading, setPolicyLoading] = useState(false)
  const [policyError, setPolicyError] = useState<string | null>(null)
  const [policySuccess, setPolicySuccess] = useState(false)
  const [policyRetrying, setPolicyRetrying] = useState(false)

  useEffect(() => {
    const loadPolicy = async () => {
      try {
        setLoading(true)
        setPolicyError(null)

        const policyData = await fetchCancellationPolicy(vendorId, tourId)
        setPolicy(policyData)

        if (policyData) {
          setPolicyStatus(policyData.status)
          setCancellationMinutes(policyData.cancellationBeforeMinutes)
        }
      } catch (err) {
        console.error("Failed to load cancellation policy:", err)
        setPolicyError("Failed to load cancellation policy. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadPolicy()
  }, [vendorId, tourId])

  // Handle policy update
  const handlePolicyUpdate = async () => {
    setPolicyLoading(true)
    setPolicyError(null)
    setPolicySuccess(false)

    try {
      const updatedPolicy = await updateCancellationPolicy(policy?.id || 0, {
        vendorId,
        tourId,
        status: policyStatus,
        cancellationBeforeMinutes: cancellationMinutes,
      })

      setPolicy(updatedPolicy)
      if (onPolicyUpdate) {
        onPolicyUpdate(updatedPolicy)
      }
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

  // Handle policy retry
  const handlePolicyRetry = async () => {
    setPolicyRetrying(true)
    try {
      await handlePolicyUpdate()
    } finally {
      setPolicyRetrying(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cancellation Policy</CardTitle>
          <CardDescription>Loading policy information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
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
  )
}
