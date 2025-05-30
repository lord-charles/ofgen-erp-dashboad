import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Activity, Zap, Building } from "lucide-react"

export function LocationsMap({ locations }: { locations: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Site Locations
        </CardTitle>
        <CardDescription>Active sites and their operational status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {locations?.map((location) => (
            <div key={location?.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{location?.name || "Unknown Location"}</h4>
                  <p className="text-sm text-muted-foreground">
                    {location?.county || "Unknown"}, {location?.region || "Unknown"} Region
                  </p>
                </div>
                <Badge variant={location?.status === "active" ? "default" : "secondary"}>
                  {location?.status || "inactive"}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Building className="w-3 h-3" />
                    <span className="font-medium">{location?.projectsCount || 0}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Projects</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span className="font-medium">{location?.capacity || "N/A"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Capacity</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Activity className="w-3 h-3" />
                    <span className="font-medium">{location?.utilization || 0}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Utilization</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Utilization Rate</span>
                  <span>{location?.utilization || 0}%</span>
                </div>
                <Progress value={location?.utilization || 0} className="h-2" />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{location?.siteType || "unknown"} site</span>
                <span>
                  Lat: {location?.coordinates?.lat?.toFixed(4) || "N/A"}, Lng:{" "}
                  {location?.coordinates?.lng?.toFixed(4) || "N/A"}
                </span>
              </div>
            </div>
          )) || <p className="text-center text-muted-foreground py-8">No locations found</p>}
        </div>
      </CardContent>
    </Card>
  )
}
