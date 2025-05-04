// API functions for fetching and updating data

const API_BASE_URL = "https://my-json-server.typicode.com/neelbakshi94/test-plc"

// Function to fetch all tours
export async function fetchTours(): Promise<any[]> {
  try {
    // For demo purposes, we'll use mock data to ensure consistent results
    const mockTours = [
      {
        id: 1,
        name: "Paris City Tour",
        price: 49.99,
        timings: "9:00 AM - 5:00 PM",
        places: ["Eiffel Tower", "Louvre Museum", "Notre Dame"],
        transport: "Bus",
        duration: "8 hours",
        groupSize: "Up to 20 people",
      },
      {
        id: 2,
        name: "London Walking Tour",
        price: 29.99,
        timings: "10:00 AM - 2:00 PM",
        places: ["Big Ben", "Buckingham Palace", "Tower Bridge"],
        transport: "Walking",
        duration: "4 hours",
        groupSize: "Up to 15 people",
      },
      {
        id: 3,
        name: "Rome Historical Sites",
        price: 39.99,
        timings: "8:30 AM - 4:30 PM",
        places: ["Colosseum", "Roman Forum", "Vatican City"],
        transport: "Walking and Bus",
        duration: "6 hours",
        groupSize: "Up to 18 people",
      },
      {
        id: 4,
        name: "New York City Bus Tour",
        price: 59.99,
        timings: "9:00 AM - 6:00 PM",
        places: ["Times Square", "Central Park", "Empire State Building"],
        transport: "Bus",
        duration: "9 hours",
        groupSize: "Up to 25 people",
      },
      {
        id: 5,
        name: "Tokyo Cultural Experience",
        price: 69.99,
        timings: "10:00 AM - 5:00 PM",
        places: ["Senso-ji Temple", "Meiji Shrine", "Tokyo Tower"],
        transport: "Subway and Walking",
        duration: "7 hours",
        groupSize: "Up to 12 people",
      },
    ]

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return mockTours
  } catch (error) {
    console.error("Error fetching tours:", error)
    throw error
  }
}

// Function to fetch all vendors
export async function fetchVendors(): Promise<any[]> {
  try {
    // Mock vendor data
    const mockVendors = [
      { id: 1, name: "Paris Tours Inc." },
      { id: 2, name: "London Experience" },
      { id: 3, name: "Rome Adventures" },
      { id: 4, name: "NYC Guide Co." },
      { id: 5, name: "Tokyo Travels" },
    ]

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    return mockVendors
  } catch (error) {
    console.error("Error fetching vendors:", error)
    throw error
  }
}

// Function to fetch all tickets
export async function fetchTickets(): Promise<any[]> {
  try {
    // Mock data since the API endpoint may not exist
    const mockTickets = [
      {
        id: 1,
        vendorId: 1,
        tourId: 1,
        productName: "Paris City Tour",
        listingType: "new_listing",
      },
      {
        id: 2,
        vendorId: 2,
        tourId: 2,
        productName: "London Walking Tour",
        listingType: "multi_variant",
      },
      {
        id: 3,
        vendorId: 3,
        tourId: 3,
        productName: "Rome Historical Sites",
        listingType: "new_listing",
      },
      {
        id: 4,
        vendorId: 4,
        tourId: 4,
        productName: "New York City Bus Tour",
        listingType: "multi_variant",
      },
      {
        id: 5,
        vendorId: 5,
        tourId: 5,
        productName: "Tokyo Cultural Experience",
        listingType: "new_listing",
      },
    ]

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    return mockTickets
  } catch (error) {
    console.error("Error fetching tickets:", error)
    throw error
  }
}

// Function to fetch a specific vendor
export async function fetchVendor(vendorId: number): Promise<any> {
  try {
    // Mock data
    const mockVendors = {
      1: { id: 1, name: "Paris Tours Inc." },
      2: { id: 2, name: "London Experience" },
      3: { id: 3, name: "Rome Adventures" },
      4: { id: 4, name: "NYC Guide Co." },
      5: { id: 5, name: "Tokyo Travels" },
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    return mockVendors[vendorId as keyof typeof mockVendors] || null
  } catch (error) {
    console.error(`Error fetching vendor ${vendorId}:`, error)
    throw error
  }
}

// Function to fetch a specific tour
export async function fetchTour(tourId: number): Promise<any> {
  try {
    // Mock data
    const mockTours = {
      1: { id: 1, name: "Paris City Tour", location: "Paris, France" },
      2: { id: 2, name: "London Walking Tour", location: "London, UK" },
      3: { id: 3, name: "Rome Historical Sites", location: "Rome, Italy" },
      4: { id: 4, name: "NYC Bus Tour", location: "New York, USA" },
      5: { id: 5, name: "Tokyo Cultural Experience", location: "Tokyo, Japan" },
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    return mockTours[tourId as keyof typeof mockTours] || null
  } catch (error) {
    console.error(`Error fetching tour ${tourId}:`, error)
    throw error
  }
}

// Function to fetch cancellation policy
export async function fetchCancellationPolicy(vendorId: number, tourId: number): Promise<any> {
  try {
    // Mock data
    const mockPolicies = [
      { id: 1, vendorId: 1, tourId: 1, status: "ACTIVE", cancellationBeforeMinutes: 1440 },
      { id: 2, vendorId: 2, tourId: 2, status: "ACTIVE", cancellationBeforeMinutes: 720 },
      { id: 3, vendorId: 3, tourId: 3, status: "INACTIVE", cancellationBeforeMinutes: null },
    ]

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 400))

    return mockPolicies.find((p) => p.vendorId === vendorId && p.tourId === tourId) || null
  } catch (error) {
    console.error(`Error fetching cancellation policy:`, error)
    throw error
  }
}

// Function to fetch contact information
export async function fetchContact(vendorId: number, tourId: number): Promise<any> {
  try {
    // Mock data
    const mockContacts = [
      { id: 1, vendorId: 1, tourId: 1, phone: "+33123456789", email: "paris@example.com" },
      { id: 2, vendorId: 2, tourId: 2, phone: "+44987654321", email: "london@example.com" },
      { id: 3, vendorId: 3, tourId: 3, phone: "+39555123456", email: "rome@example.com" },
    ]

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    return mockContacts.find((c) => c.vendorId === vendorId && c.tourId === tourId) || null
  } catch (error) {
    console.error(`Error fetching contact:`, error)
    throw error
  }
}

// Function to create a vendor tour
export async function createVendorTour(vendorId: number, tourId: number): Promise<any> {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simulate response
    return { id: Date.now(), vendorId, tourId }
  } catch (error) {
    console.error(`Error creating vendor tour:`, error)
    throw error
  }
}

// Function to update cancellation policy
export async function updateCancellationPolicy(policyId: number, data: any): Promise<any> {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simulate response
    return { id: policyId || Date.now(), ...data }
  } catch (error) {
    console.error(`Error updating cancellation policy:`, error)
    throw error
  }
}

// Function to update contact information
export async function updateContact(contactId: number, data: any): Promise<any> {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simulate response
    return { id: contactId || Date.now(), ...data }
  } catch (error) {
    console.error(`Error updating contact:`, error)
    throw error
  }
}

// Function for AI ticket analysis
export async function analyzeTickets(tickets: any[]): Promise<any> {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Simulate AI analysis
    return {
      insights: [
        "60% of tickets are for new listings requiring detailed review",
        "20% of tour information has discrepancies that need further verification",
        "Most tickets need updates to cancellation policies",
      ],
      recommendations: [
        "Prioritize new listing reviews to clear backlog",
        "Standardize contact information formats",
        "Create templates for common verification processes",
      ],
    }
  } catch (error) {
    console.error(`Error analyzing tickets:`, error)
    throw error
  }
}
