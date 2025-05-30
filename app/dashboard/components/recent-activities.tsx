import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  FileText,
} from "lucide-react";

export function RecentActivities({ activities }: { activities: any[] }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project_update":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "risk_identified":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "service_order":
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activities
        </CardTitle>
        <CardDescription>Latest updates and system activities</CardDescription>
      </CardHeader>
      <div className="p-2">
        <div className="space-y-2">
          {activities?.map((activity) => (
            <div
              key={activity?.id}
              className="flex items-start gap-3 p-3 border rounded-lg"
            >
              <div className="mt-0.5">
                {getActivityIcon(activity?.type || "")}
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-sm font-medium">
                  {activity?.title || "Unknown Activity"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {activity?.description || "No description available"}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="w-3 h-3" />
                    {activity?.user || "Unknown User"}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {activity?.timestamp
                      ? getTimeAgo(activity.timestamp)
                      : "Unknown time"}
                  </div>
                  {activity?.priority === "high" && (
                    <Badge variant="destructive" className="text-xs">
                      High Priority
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )) || (
            <p className="text-center text-muted-foreground py-8">
              No recent activities
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
