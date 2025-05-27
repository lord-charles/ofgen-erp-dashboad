"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Download, Upload, MoreVertical, MapPin, FileSpreadsheet, Sparkles, Loader2 } from "lucide-react"
import { createLocation } from "@/services/location-service"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/ui/spinner"
import { useToast } from "@/hooks/use-toast"

export function LocationActions() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleCreateLocation = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const locationData = {
        name: formData.get("name") as string,
        county: formData.get("county") as string,
        address: formData.get("address") as string,
        coordinates: {
          lat: Number.parseFloat(formData.get("lat") as string),
          lng: Number.parseFloat(formData.get("lng") as string),
        },
        siteType: formData.get("siteType") as "outdoor" | "indoor" | "rooftop" | "ground",
        siteId: formData.get("siteId") as string,
        status: formData.get("status") as "active" | "inactive" | "maintenance" | "pending",
      }

      await createLocation(locationData)

      toast({
        title: "Success",
        description: "Location created successfully",
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsCreateDialogOpen(false)
        setIsLoading(false)
        router.refresh()
      }, 2000)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200 text-white">
            <Plus className="mr-2 h-4 w-4 text-white" />
            Add Location
            <Sparkles className="ml-2 h-4 w-4 text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
              Add New Location
            </DialogTitle>
            <DialogDescription className="text-base">
              Create a new solar installation site location with comprehensive details
            </DialogDescription>
          </DialogHeader>
          <form action={handleCreateLocation} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Location Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Nairobi North Solar Farm"
                  required
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="county" className="text-sm font-semibold">
                  County
                </Label>
                <Input
                  id="county"
                  name="county"
                  placeholder="e.g., Nairobi"
                  required
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="address" className="text-sm font-semibold">
                Full Address
              </Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Complete address of the installation site"
                required
                className="border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label htmlFor="lat" className="text-sm font-semibold">
                  Latitude
                </Label>
                <Input
                  id="lat"
                  name="lat"
                  type="number"
                  step="any"
                  placeholder="-1.2921"
                  required
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lng" className="text-sm font-semibold">
                  Longitude
                </Label>
                <Input
                  id="lng"
                  name="lng"
                  type="number"
                  step="any"
                  placeholder="36.8219"
                  required
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="siteId" className="text-sm font-semibold">
                  Site ID (optional)
                </Label>
                <Input
                  id="siteId"
                  name="siteId"
                  placeholder="e.g., NRB-001"
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="siteType" className="text-sm font-semibold">
                  Site Type *
                </Label>
                <Select name="siteType" required>
                  <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Select site type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outdoor">🌳 Outdoor</SelectItem>
                    <SelectItem value="indoor">🏢 Indoor</SelectItem>
                    <SelectItem value="rooftop">🏠 Rooftop</SelectItem>
                    <SelectItem value="ground">🌍 Ground</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="status" className="text-sm font-semibold">
                  Status *
                </Label>
                <Select name="status" required>
                  <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">⚡ Active</SelectItem>
                    <SelectItem value="inactive">⭕ Inactive</SelectItem>
                    <SelectItem value="maintenance">🔧 Maintenance</SelectItem>
                    <SelectItem value="pending">⏳ Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>



            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="px-6">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 text-white"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4 text-white" />
                    Create Location
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="shadow-sm hover:shadow-md transition-shadow">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-semibold">Bulk Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export to Excel
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <Upload className="mr-2 h-4 w-4" />
            Import Locations
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <MapPin className="mr-2 h-4 w-4" />
            View All on Map
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
