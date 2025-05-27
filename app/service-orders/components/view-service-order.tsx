"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Phone, MapPin, Building, Zap, FileText } from "lucide-react"

interface ViewServiceOrderProps {
  order: any
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200"
    case "rejected":
      return "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200"
  }
}

export function ViewServiceOrder({ order }: ViewServiceOrderProps) {
  return (
    <ScrollArea className="h-[96vh]">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{order.siteDetails.siteId}</h3>
            <p className="text-sm text-muted-foreground">
              {order.issuedBy} → {order.issuedTo}
            </p>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date:</span>
                <span className="text-sm">{formatDate(order.serviceOrderDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Value:</span>
                <span className="text-sm font-medium">{formatCurrency(order.totalValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created:</span>
                <span className="text-sm">{formatDate(order.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="text-sm">{order.contactInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Phone:</span>
                <span className="text-sm">{order.contactInfo.telephone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="text-sm">{order.contactInfo.email}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Region:</span>
                <span className="text-sm">{order.locationInfo.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sub Region:</span>
                <span className="text-sm">{order.locationInfo.subRegion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Coordinates:</span>
                <span className="text-sm">
                  {order.locationInfo.coordinates.latitude.toFixed(4)},{" "}
                  {order.locationInfo.coordinates.longitude.toFixed(4)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Site Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type:</span>
                <span className="text-sm">{order.siteDetails.siteType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Classification:</span>
                <span className="text-sm">{order.siteDetails.siteClassification}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Design Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.designSummary && Object.keys(order.designSummary).length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Power Supply:</span>
                      <span className="text-sm">{order.designSummary?.existingPowerSupply ?? "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Daily Demand:</span>
                      <span className="text-sm">{order.designSummary?.sitePowerDemandDailyEnergyDemand ?? "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Solar Capacity:</span>
                      <span className="text-sm">{order.designSummary?.proposedSolarCapacity ?? "-"}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Battery Capacity:</span>
                      <span className="text-sm">{order.designSummary?.proposedBatteryCapacity ?? "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Solar Penetration:</span>
                      <span className="text-sm">{order.designSummary?.solarPenetration ?? "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Production:</span>
                      <span className="text-sm">{order.designSummary?.estimatedSolarProductionPerMonth ?? "-"}</span>
                    </div>
                  </div>
                </div>
                {order.designSummary?.generatorComment && (
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">Generator Comment:</p>
                    <p className="text-sm">{order.designSummary.generatorComment}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No design summary data available.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Bill of Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {order.billOfMaterials.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <div>
                    <p className="text-sm font-medium">{item.item}</p>
                    <p className="text-xs text-muted-foreground">{item.specs}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {item.quantity} {item.unitOfMeasure}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {order.comments && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{order.comments}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  )
}
