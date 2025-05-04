"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, Edit, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { fetchTour } from "@/lib/api"
import { TourDetail } from "@/components/tour-detail"

interface TourPageProps {
  params: {
    id: string
  }
}

export default function TourPage({ params }: TourPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tourExists, setTourExists] = useState(false)

  useEffect(() => {
    const checkTourExists = async () => {
      try {
        setLoading(true)
        setError(null)

        const tourId = Number.parseInt(params.id)
        const tourData = await fetchTour(tourId)

        if (tourData) {
          setTourExists(true)
        } else {
          setError("Tour not found")
        }
      } catch (err) {
        console.error("Failed to load tour data:", err)
        setError("Failed to load tour data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    checkTourExists()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !tourExists) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <Alert variant="destructive">
          <AlertDescription>{error || "Tour not found"}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/")} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Tour
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          </div>
        </div>

        <TourDetail tourId={Number.parseInt(params.id)} />
      </div>
    </div>
  )
}
