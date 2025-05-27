import type { Location } from "@/lib/types/location"

export const mockLocations: Location[] = [
  {
    id: "1",
    name: "Nairobi North Solar Farm",
    county: "Nairobi",
    address: "123 Solar Lane, Kasarani, Nairobi North",
    coordinates: { lat: -1.2921, lng: 36.8219 },
    siteType: "outdoor",
    siteId: "NRB-001",
    systemSiteId: "OFGEN-20250523-NRB001",
    status: "active",
  },
  {
    id: "2",
    name: "Mombasa Port Solar Installation",
    county: "Mombasa",
    address: "Port Reitz Road, Mombasa Port Authority",
    coordinates: { lat: -4.0435, lng: 39.6682 },
    siteType: "rooftop",
    siteId: "MSA-002",
    systemSiteId: "OFGEN-20250520-MSA002",
    status: "active",
  },
  {
    id: "3",
    name: "Kisumu Industrial Solar Hub",
    county: "Kisumu",
    address: "Industrial Area, Kisumu",
    coordinates: { lat: -0.0917, lng: 34.768 },
    siteType: "ground",
    siteId: "KSM-003",
    systemSiteId: "OFGEN-20250518-KSM003",
    status: "maintenance",
  },
  {
    id: "4",
    name: "Nakuru Agricultural Solar",
    county: "Nakuru",
    address: "Nakuru-Eldoret Highway, Nakuru",
    coordinates: { lat: -0.3031, lng: 36.08 },
    siteType: "outdoor",
    siteId: "NKR-004",
    systemSiteId: "OFGEN-20250515-NKR004",
    status: "active",
  },
  {
    id: "5",
    name: "Eldoret University Solar Grid",
    county: "Uasin Gishu",
    address: "University of Eldoret Campus",
    coordinates: { lat: 0.5143, lng: 35.2698 },
    siteType: "rooftop",
    siteId: "ELD-005",
    systemSiteId: "OFGEN-20250512-ELD005",
    status: "active",
  },
  {
    id: "6",
    name: "Machakos Rural Solar Project",
    county: "Machakos",
    address: "Machakos-Kitui Road, Machakos",
    coordinates: { lat: -1.5177, lng: 37.2634 },
    siteType: "ground",
    siteId: "MCK-006",
    systemSiteId: "OFGEN-20250510-MCK006",
    status: "inactive",
  },
  {
    id: "7",
    name: "Thika Industrial Complex",
    county: "Kiambu",
    address: "Thika Industrial Area, Blue Post Hotel Road",
    coordinates: { lat: -1.0332, lng: 37.0692 },
    siteType: "indoor",
    siteId: "THK-007",
    systemSiteId: "OFGEN-20250508-THK007",
    status: "pending",
  },
  {
    id: "8",
    name: "Nyeri Coffee Processing Solar",
    county: "Nyeri",
    address: "Nyeri Coffee Cooperative, Nyeri Town",
    coordinates: { lat: -0.4209, lng: 36.9476 },
    siteType: "rooftop",
    siteId: "NYR-008",
    systemSiteId: "OFGEN-20250505-NYR008",
    status: "active",
  },
  {
    id: "9",
    name: "Garissa Desert Solar Farm",
    county: "Garissa",
    address: "Garissa-Dadaab Road, Garissa County",
    coordinates: { lat: -0.4536, lng: 39.6401 },
    siteType: "outdoor",
    siteId: "GRS-009",
    systemSiteId: "OFGEN-20250502-GRS009",
    status: "active",
  },
  {
    id: "10",
    name: "Malindi Coastal Solar",
    county: "Kilifi",
    address: "Malindi-Lamu Road, Malindi",
    coordinates: { lat: -3.2194, lng: 40.1169 },
    siteType: "ground",
    siteId: "MLD-010",
    systemSiteId: "OFGEN-20250428-MLD010",
    status: "maintenance",
  },
]

// Simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getMockLocations(): Promise<Location[]> {
  await delay(800) // Simulate network delay
  return mockLocations
}

export async function createMockLocation(locationData: Omit<Location, "id">): Promise<Location> {
  await delay(1200)
  const newLocation: Location = {
    ...locationData,
    id: (mockLocations.length + 1).toString(),
  }
  mockLocations.push(newLocation)
  return newLocation
}

export async function updateMockLocation(id: string, locationData: Partial<Location>): Promise<Location> {
  await delay(1000)
  const index = mockLocations.findIndex((loc) => loc.id === id)
  if (index === -1) throw new Error("Location not found")

  mockLocations[index] = { ...mockLocations[index], ...locationData }
  return mockLocations[index]
}

export async function deleteMockLocation(id: string): Promise<void> {
  await delay(800)
  const index = mockLocations.findIndex((loc) => loc.id === id)
  if (index === -1) throw new Error("Location not found")

  mockLocations.splice(index, 1)
}
