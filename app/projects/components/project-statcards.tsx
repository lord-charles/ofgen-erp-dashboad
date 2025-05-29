
"use client"

import { useState, useEffect } from "react"
import { BarChart, Calendar, Clock, DollarSign, Layers, Users, FileText, AlertTriangle, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PaginatedResponse } from "@/services/employees.service";
import { Project } from "@/services/project.service"

interface ProjectStatsProps {
  projectData: PaginatedResponse<Project>;
}

export default function ProjectStats({ projectData }: ProjectStatsProps) {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalBudget: 0,
    avgProgress: 0,
    completedProjects: 0,
    inProgressProjects: 0,
    plannedProjects: 0,
    highRiskProjects: 0,
    totalCapacity: 0,
    projectTypes: new Map(),
    counties: new Set(),
    avgProjectValue: 0,
    totalRisks: 0,
  })

  useEffect(() => {
    try {
      const projects = Array.isArray(projectData) ? projectData : [];
      const totalProjects = projects.length;
      let totalBudget = 0;
      let totalProgress = 0;
      let completedProjects = 0;
      let inProgressProjects = 0;
      let plannedProjects = 0;
      let highRiskProjects = 0;
      let totalCapacity = 0;
      let totalRisks = 0;
      const projectTypes = new Map();
      const counties = new Set<string>();

      projects.forEach((project) => {
        if (!project) return;

        // Budget calculation
        const projectBudget = Number(project?.contractValue ?? project?.serviceOrder?.totalValue ?? 0);
        if (!isNaN(projectBudget)) totalBudget += projectBudget;

        // Progress tracking
        const progress = Number(project?.progress ?? 0);
        totalProgress += progress;

        // Status tracking
        const status = project?.status?.toLowerCase();
        if (status === 'completed') completedProjects++;
        else if (status === 'in progress') inProgressProjects++;
        else plannedProjects++;

        // Risk assessment
        if (Array.isArray(project?.risks)) {
          totalRisks += project.risks.length;
          const hasHighRisk = project.risks.some((risk: any) => 
            risk?.severity?.toLowerCase() === 'high' || 
            (risk?.probability ?? 0) * (risk?.impact ?? 0) > 6
          );
          if (hasHighRisk) highRiskProjects++;
        }

        // Capacity calculation (extract numbers from capacity string)
        if (project?.capacity) {
          const capacityMatch = project.capacity.match(/(\d+(\.\d+)?)/);
          if (capacityMatch) {
            totalCapacity += parseFloat(capacityMatch[1]);
          }
        }

        // Project types
        if (project?.projectType) {
          const type = project.projectType;
          projectTypes.set(type, (projectTypes.get(type) || 0) + 1);
        }

        // Counties
        if (project?.location?.county) {
          counties.add(project.location.county);
        }
      });

      const avgProgress = totalProjects > 0 ? totalProgress / totalProjects : 0;
      const avgProjectValue = totalProjects > 0 ? totalBudget / totalProjects : 0;

      setStats({
        totalProjects,
        totalBudget,
        avgProgress,
        completedProjects,
        inProgressProjects,
        plannedProjects,
        highRiskProjects,
        totalCapacity,
        projectTypes,
        counties,
        avgProjectValue,
        totalRisks,
      });
    } catch (error) {
      console.error("Error calculating project stats:", error);
    }
  }, [projectData]);

  const formatCurrency = (amount: number) => {
    try {
      if (isNaN(amount)) return "KES 0";
      return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (error) {
      console.error("Error formatting currency:", error);
      return "KES 0";
    }
  };

  const formatCapacity = (capacity: number) => {
    if (capacity >= 1000) {
      return `${(capacity / 1000).toFixed(1)} MW`;
    }
    return `${capacity.toFixed(1)} kW`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      {/* Project Portfolio Overview */}
      <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            Project Portfolio
          </CardTitle>
          <CardDescription>Overall project status overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-700">{stats.totalProjects}</p>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-green-600">{stats.completedProjects}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span className="font-medium">{Math.round(stats.avgProgress)}%</span>
              </div>
              <Progress value={stats.avgProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">In Progress:</span>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {stats.inProgressProjects}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Planned:</span>
                <Badge variant="outline" className="bg-slate-100 text-slate-700">
                  {stats.plannedProjects}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Performance */}
      <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            Financial Performance
          </CardTitle>
          <CardDescription>Budget and value metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-bold text-emerald-700">
                {formatCurrency(stats.totalBudget)}
              </p>
              <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average Project Value</span>
                <span className="font-medium">{formatCurrency(stats.avgProjectValue)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Completed Value</span>
                <span className="font-medium text-green-600">
                  {formatCurrency((stats.totalBudget * stats.completedProjects) / (stats.totalProjects || 1))}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capacity & Technology */}
      <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart className="h-5 w-5 text-violet-600" />
            Capacity & Technology
          </CardTitle>
          <CardDescription>Installation capacity and project types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-violet-700">
                  {formatCapacity(stats.totalCapacity)}
                </p>
                <p className="text-sm text-muted-foreground">Total Capacity</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">{stats.projectTypes.size}</p>
                <p className="text-xs text-muted-foreground">Project Types</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Project Distribution</p>
              {Array.from(stats.projectTypes.entries()).slice(0, 2).map(([type, count], i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="truncate max-w-[120px]" title={type}>{type}</span>
                  <Badge variant="outline" className="bg-violet-100 text-violet-700">
                    {count as number}
                  </Badge>
                </div>
              ))}
              {stats.projectTypes.size > 2 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Others</span>
                  <Badge variant="outline" className="bg-slate-100 text-slate-600">
                    +{stats.projectTypes.size - 2}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk & Timeline Analysis */}
      <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-800/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Risk & Timeline
          </CardTitle>
          <CardDescription>Project risks and schedule analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-amber-700">{stats.totalRisks}</p>
                <p className="text-sm text-muted-foreground">Total Risks</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-red-600">{stats.highRiskProjects}</p>
                <p className="text-xs text-muted-foreground">High Risk</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Risk Coverage</span>
                <span className="font-medium">
                  {stats.totalProjects > 0 ? Math.round((stats.totalRisks / stats.totalProjects) * 100) / 100 : 0} avg/project
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Project Health</span>
                  <Badge 
                    variant={stats.highRiskProjects === 0 ? "default" : stats.highRiskProjects < stats.totalProjects * 0.3 ? "secondary" : "destructive"}
                    className={stats.highRiskProjects === 0 ? "bg-green-100 text-green-800" : ""}
                  >
                    {stats.highRiskProjects === 0 ? "Healthy" : 
                     stats.highRiskProjects < stats.totalProjects * 0.3 ? "Monitor" : "Critical"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{Math.round((stats.completedProjects / (stats.totalProjects || 1)) * 100)}% completion rate</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
