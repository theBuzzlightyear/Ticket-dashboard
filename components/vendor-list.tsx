"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Building, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { fetchVendors, fetchTours } from "@/lib/api"
import Link from "next/link"

export function VendorList() {
  const [vendors, setVendors] = useState<any[]>([])
  const [vendorTours, setVendorTours] = useState<Record<number, any[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const loadVendorsAndTours = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch vendors and tours in parallel
        const [vendorsData, toursData] = await Promise.all([fetchVendors(), fetchTours()])
        setVendors(vendorsData)

        // Group tours by vendor ID
        const toursByVendor: Record<number, any[]> = {}
        toursData.forEach((tour) => {
          // For demo purposes, assign tours to vendors based on a simple pattern
          const vendorId = (tour.id % vendorsData.length) + 1

          if (!toursByVendor[vendorId]) {
            toursByVendor[vendorId] = []
          }
          toursByVendor[vendorId].push(tour)
        })

        setVendorTours(toursByVendor)
      } catch (err) {
        console.error("Failed to load vendors and tours:", err)
        setError("Failed to load vendors and tours. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load vendors and tours. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadVendorsAndTours()
  }, [toast])

  const filteredVendors = vendors.filter((vendor) => vendor.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendors</CardTitle>
        <CardDescription>Manage tour vendors and their tours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No vendors found</div>
          ) : (
            <div className="space-y-4">
              {filteredVendors.map((vendor) => (
                <div key={vendor.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="font-medium">{vendor.name}</h3>
                    </div>
                    <Badge variant="outline">ID: {vendor.id}</Badge>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Tours:</h4>
                    {vendorTours[vendor.id]?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {vendorTours[vendor.id].map((tour) => (
                          <Link href={`/tour/${tour.id}`} key={tour.id} className="no-underline">
                            <div className="border rounded p-2 hover:bg-muted flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium">{tour.name}</p>
                                <p className="text-xs text-muted-foreground">{tour.location}</p>
                              </div>
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No tours available</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
