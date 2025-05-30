import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Calendar,
  Users,
  AlertTriangle,
  Eye,
  MoreHorizontal,
  MapPin,
  DollarSign,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ProjectsOverview({
  projects,
  detailed = false,
}: {
  projects: any[];
  detailed?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Projects Overview
            </CardTitle>
            <CardDescription>
              {detailed
                ? "Detailed project information and status"
                : "Current active projects and their progress"}
            </CardDescription>
          </div>
          {!detailed && (
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className=" h-[820px]">
          {projects?.map((project) => (
            <div
              key={project?.id}
              className="border rounded-lg p-4 space-y-4 hover:shadow-md transition-shadow mt-2"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{project?.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {project?.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      KES {((project?.contractValue || 0) / 1000000).toFixed(1)}
                      M
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {project?.team || 0} members
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(project?.status || "")}>
                    {project?.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getPriorityColor(project?.priority || "")}
                  >
                    {project?.priority}
                  </Badge>
                  {detailed && (
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Progress Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Progress</span>
                  <span>{project?.progress || 0}%</span>
                </div>
                <Progress value={project?.progress || 0} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Started:{" "}
                    {project?.actualStart
                      ? new Date(project.actualStart).toLocaleDateString()
                      : "Not started"}
                  </span>
                  <span>
                    Target:{" "}
                    {project?.targetCompletion
                      ? new Date(project.targetCompletion).toLocaleDateString()
                      : "TBD"}
                  </span>
                </div>
              </div>

              {/* Additional Details for Detailed View */}
              {detailed && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {project?.completedMilestones || 0}/
                      {project?.milestones || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Milestones</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {project?.capacity || "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground">Capacity</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {project?.client || "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground">Client</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {(project?.risks || 0) > 0 && (
                        <AlertTriangle className="w-3 h-3 text-yellow-500" />
                      )}
                      <p className="text-sm font-medium">
                        {project?.risks || 0}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active Risks
                    </p>
                  </div>
                </div>
              )}

              {/* Project Leader */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">
                      {project?.projectLeader
                        ?.split(" ")
                        ?.map((n: string) => n[0])
                        ?.join("") || "N/A"}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {project?.projectLeader || "Unassigned"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Project Leader
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {project?.type || "N/A"}
                </div>
              </div>
            </div>
          )) || (
            <p className="text-center text-muted-foreground py-8">
              No projects found
            </p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
      return "default";
    case "in progress":
      return "default";
    case "planning":
      return "secondary";
    case "on hold":
      return "destructive";
    default:
      return "outline";
  }
}

function getPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
      return "border-red-500 text-red-600";
    case "medium":
      return "border-yellow-500 text-yellow-600";
    case "low":
      return "border-green-500 text-green-600";
    default:
      return "";
  }
}
