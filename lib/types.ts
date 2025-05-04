// Type definitions for the application

export interface Ticket {
  id: number
  vendorId: number
  tourId: number
  productName: string
  listingType: "new_listing" | "multi_variant"
}

export interface Vendor {
  id: number
  name: string
}

export interface Tour {
  id: number
  name: string
  location: string
}

export interface CancellationPolicy {
  id: number
  vendorId: number
  tourId: number
  status: string
  cancellationBeforeMinutes: number | null
}

export interface Contact {
  id: number
  vendorId: number
  tourId: number
  phone: string
  email: string
}

export interface VendorTour {
  id: number
  vendorId: number
  tourId: number
}
