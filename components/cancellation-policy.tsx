"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Check, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { fetchCancellationPolicy, updateCancellationPolicy } from "@/lib/api"

interface CancellationPolicyProps {
  vendorId: number
  tourId: number
}

export function CancellationPolicy({ vendorId, tourId }: CancellationPolicyProps) {
  const [policy, setPolicy] = useState<any>(null)
  const [status, setStatus] = useState("ACTIVE")
  const [cancellationMinutes, setCancellationMinutes] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadPolicy = async () => {
      try {
        setLoading(true)
        setError(null)

        const policyData = await fetchCancellationPolicy(vendorId, tourId)
        setPolicy(policyData)

        if (policyData) {
          setStatus(policyData.status)
          setCancellationMinutes(policyData.cancellationBeforeMinutes)
        }
      } catch (err) {
        console.error("Failed to load cancellation policy:", err)
        setError("Failed to load cancellation policy. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadPolicy()
  }, [vendorId, tourId])

  const handleUpdate = async () => {
    try {
      setUpdating(true)
      setError(null)
      setSuccess(false)

      const updatedPolicy = await updateCancellationPolicy(policy?.id || 0, {
        vendorId,
        tourId,
        status,
        cancellationBeforeMinutes: cancellationMinutes,
      })

      setPolicy(updatedPolicy)
      setSuccess(true)

      toast({
        title: "Policy updated",
        description: "Cancellation policy has been updated successfully.",
      })

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error("Failed to update cancellation policy:", err)
      setError("Failed to update cancellation policy. Please try again.")
    } finally {
      setUpdating(false)
    }
  }

  const handleRetry = async () => {
    setRetrying(true)
    try {
      await handleUpdate()
    } finally {
      setRetrying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cancellation Policy</CardTitle>
        <CardDescription>Manage the cancellation policy for this tour</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="policy-status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
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

          {error && (
            <Alert variant="destructive">
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
          )}

          {success && (
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>Cancellation policy updated successfully.</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleUpdate} disabled={updating} className="w-full">
            {updating ? (
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
