import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Star } from "lucide-react"

export function ResourceManagement({ subcontractors, projects }: { subcontractors: any[]; projects: any[] }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Subcontractor Performance
          </CardTitle>
          <CardDescription>Active subcontractors and their performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subcontractors?.map((contractor) => (
              <div key={contractor?.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{contractor?.name || "Unknown Contractor"}</h4>
                    <p className="text-sm text-muted-foreground">
                      {contractor?.specialty || "N/A"} • {contractor?.location || "Unknown"}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={contractor?.status === "active" ? "default" : "secondary"}>
                      {contractor?.status || "inactive"}
                    </Badge>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{contractor?.rating || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Projects Assigned:</span>
                    <span className="font-medium ml-2">{contractor?.projectsAssigned || 0}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Completion Rate:</span>
                    <span className="font-medium ml-2">{contractor?.completionRate || 0}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Performance Score</span>
                    <span>{contractor?.completionRate || 0}%</span>
                  </div>
                  <Progress value={contractor?.completionRate || 0} className="h-2" />
                </div>
              </div>
            )) || <p className="text-center text-muted-foreground py-8">No subcontractors found</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Allocation</CardTitle>
          <CardDescription>Current team distribution across projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Civil Works Teams</span>
                <span>24/30 allocated</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Electrical Teams</span>
                <span>18/24 allocated</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Project Managers</span>
                <span>8/10 allocated</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Equipment Units</span>
                <span>42/50 deployed</span>
              </div>
              <Progress value={84} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
