import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Target, Building2, CheckCircle } from "lucide-react";

export function MetricsGrid({ data }: { data: any }) {
  const metrics = [
    {
      title: "Project Portfolio",
      value: `${data.overview.totalProjects} Projects`,
      description: `${data.overview.activeProjects} active, ${data.overview.completedProjects} completed`,
      icon: <Building2 className="w-5 h-5" />,
      progress:
        (data.overview.completedProjects / data.overview.totalProjects) * 100,
      trend: "+12%",
    },
    {
      title: "Revenue",
      value: `KES ${(data.overview.totalContractValue / 1000000).toFixed(1)}M`,
      description: `Monthly: KES ${(
        data.overview.monthlyRevenue / 1000000
      ).toFixed(1)}M`,
      icon: <DollarSign className="w-5 h-5" />,
      progress: 78,
      trend: "+8.5%",
    },
    {
      title: "Delivery Excellence Performance",
      value: `${data.overview.completionRate}%`,
      description: `Avg duration: ${data.overview.avgProjectDuration} days`,
      icon: <Target className="w-5 h-5" />,
      progress: data.overview.completionRate,
      trend: "+2.3%",
    },
  ];

  return (
    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              {metric.icon}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{metric.value}</span>
              <Badge
                variant="outline"
                className="text-green-600 border-green-200"
              >
                {metric.trend}
              </Badge>
            </div>
            <div className="space-y-2">
              <Progress value={metric.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
