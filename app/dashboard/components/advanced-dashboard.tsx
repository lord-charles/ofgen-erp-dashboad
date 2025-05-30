"use client";

import type React from "react";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GreetingHeader } from "./greeting-header";
import {
  Building2,
  MapPin,
  Users,
  FileText,
  AlertTriangle,
  DollarSign,
  Target,
  Search,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  BarChart3,
  Shield,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { MetricsGrid } from "./metrics-grid";
import { ProjectsOverview } from "./projects-overview";
import { LocationsMap } from "./locations-map";
import { ResourceManagement } from "./resource-management";
import { FinancialAnalytics } from "./financial-analytics";
import { RiskManagement } from "./risk-management";
import { RecentActivities } from "./recent-activities";
import { useToast } from "@/hooks/use-toast";

export default function AdvancedDashboard({
  dashboardData,
}: {
  dashboardData: any;
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();
  const handleRefresh = async () => {
    window.location.reload();
  };

  // --- CSV Export Helpers ---
  // Flattens nested objects for CSV compatibility
  function flattenObject(obj: any, prefix = ""): Record<string, any> {
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? prefix + "." : "";
      if (
        typeof obj[k] === "object" &&
        obj[k] !== null &&
        !Array.isArray(obj[k])
      ) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {} as Record<string, any>);
  }

  function arrayToCSV(arr: any[], columns?: string[]): string {
    if (!arr || arr.length === 0) return "";
    // Flatten all rows
    const flatArr = arr.map(flattenObject);
    const keys =
      columns ||
      Array.from(new Set(flatArr.flatMap((row) => Object.keys(row))));
    const escape = (val: any) => `"${String(val ?? "").replace(/"/g, '""')}"`;
    const rows = [
      keys.join(","),
      ...flatArr.map((row) => keys.map((k) => escape(row[k])).join(",")),
    ];
    return rows.join("\n");
  }

  function objectToCSV(obj: any): string {
    const flat = flattenObject(obj);
    const keys = Object.keys(flat);
    const escape = (val: any) => `"${String(val ?? "").replace(/"/g, '""')}"`;
    return [keys.join(","), keys.map((k) => escape(flat[k])).join(",")].join(
      "\n"
    );
  }

  function downloadCSV(filename: string, csv: string) {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleExport() {
    const csvSections: string[] = [];
    // Overview (single row)
    if (dashboardData.overview) {
      csvSections.push("--- Overview ---");
      csvSections.push(objectToCSV(dashboardData.overview));
      csvSections.push("");
    }
    // Projects
    if (dashboardData.projects && dashboardData.projects.length > 0) {
      csvSections.push("--- Projects ---");
      csvSections.push(arrayToCSV(dashboardData.projects));
      csvSections.push("");
    }
    // Locations (flatten coordinates)
    if (dashboardData.locations && dashboardData.locations.length > 0) {
      csvSections.push("--- Locations ---");
      csvSections.push(arrayToCSV(dashboardData.locations));
      csvSections.push("");
    }
    // Service Orders
    if (dashboardData.serviceOrders && dashboardData.serviceOrders.length > 0) {
      csvSections.push("--- Service Orders ---");
      csvSections.push(arrayToCSV(dashboardData.serviceOrders));
      csvSections.push("");
    }
    // Subcontractors
    if (
      dashboardData.subcontractors &&
      dashboardData.subcontractors.length > 0
    ) {
      csvSections.push("--- Subcontractors ---");
      csvSections.push(arrayToCSV(dashboardData.subcontractors));
      csvSections.push("");
    }
    // Risks
    if (dashboardData.risks && dashboardData.risks.length > 0) {
      csvSections.push("--- Risks ---");
      csvSections.push(arrayToCSV(dashboardData.risks));
      csvSections.push("");
    }
    // Activities
    if (dashboardData.activities && dashboardData.activities.length > 0) {
      csvSections.push("--- Activities ---");
      csvSections.push(arrayToCSV(dashboardData.activities));
      csvSections.push("");
    }
    // Financials (monthlyRevenue, projectValues, expenses)
    if (dashboardData.financials) {
      if (
        dashboardData.financials.monthlyRevenue &&
        dashboardData.financials.monthlyRevenue.length > 0
      ) {
        csvSections.push("--- Financials: Monthly Revenue ---");
        csvSections.push(arrayToCSV(dashboardData.financials.monthlyRevenue));
        csvSections.push("");
      }
      if (
        dashboardData.financials.projectValues &&
        dashboardData.financials.projectValues.length > 0
      ) {
        csvSections.push("--- Financials: Project Values ---");
        csvSections.push(arrayToCSV(dashboardData.financials.projectValues));
        csvSections.push("");
      }
      if (dashboardData.financials.expenses) {
        csvSections.push("--- Financials: Expenses ---");
        csvSections.push(objectToCSV(dashboardData.financials.expenses));
        csvSections.push("");
      }
    }
    // Timestamped filename
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-");
    const filename = `dashboard-export-${timestamp}.csv`;
    const csv = csvSections.join("\n");
    downloadCSV(filename, csv);
  }

  const filteredProjects = useMemo(() => {
    return dashboardData.projects.filter((project: any) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" ||
        project.status.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus]);

  return (
    <div className="min-h-screen">
      <div className="p-1 space-y-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <GreetingHeader />

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className={`w-4 h-4 mr-2`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast({
                  title: "Settings",
                  description: "Settings feature coming soon!",
                });
              }}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <QuickStat
            label="Active Projects"
            value={dashboardData.overview.activeProjects}
            change={+12}
            icon={<Building2 className="w-4 h-4" />}
          />
          <QuickStat
            label="Total Revenue"
            value={`${(dashboardData.overview.monthlyRevenue / 1000000).toFixed(
              1
            )}M`}
            change={+8.5}
            icon={<DollarSign className="w-4 h-4" />}
          />
          <QuickStat
            label="Completion Rate"
            value={`${dashboardData.overview.completionRate}%`}
            change={+2.3}
            icon={<Target className="w-4 h-4" />}
          />
          <QuickStat
            label="Active Sites"
            value={dashboardData.overview.totalLocations}
            change={0}
            icon={<MapPin className="w-4 h-4" />}
          />
          <QuickStat
            label="Team Members"
            value={dashboardData.overview.activeSubcontractors}
            change={+4}
            icon={<Users className="w-4 h-4" />}
          />
          <QuickStat
            label="Open Risks"
            value={
              dashboardData.risks.filter((r: any) => r.status === "Open").length
            }
            change={-1}
            icon={<AlertTriangle className="w-4 h-4" />}
          />
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mt-3">
            <TabsList className="grid max-w-3xl grid-cols-6 mb-3 h-auto -space-x-px bg-background p-0 shadow-sm shadow-black/5 rtl:space-x-reverse">
              <TabsTrigger
                value="overview"
                className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
              >
                <BarChart3
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
              >
                <Building2
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Projects</span>
              </TabsTrigger>
              <TabsTrigger
                value="operations"
                className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
              >
                <Briefcase
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Operations</span>
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
              >
                <Users
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Resources</span>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
              >
                <TrendingUp
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger
                value="risks"
                className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
              >
                <Shield
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Risks</span>
              </TabsTrigger>
            </TabsList>

            {/* Search and Filter */}
            <div className="flex items-center space-x-2">
              {/* <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects, clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-48 md:w-64"
                />
              </div> */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32 md:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-2">
            <div className="grid gap-2 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-2">
                <MetricsGrid data={dashboardData} />
                <ProjectsOverview projects={filteredProjects} />
              </div>
              <div className="space-y-2">
                <RecentActivities activities={dashboardData.activities} />
                <RiskManagement risks={dashboardData.risks} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-2">
            <ProjectsOverview projects={filteredProjects} detailed={true} />
          </TabsContent>

          <TabsContent value="operations" className="space-y-2">
            <div className="grid gap-2 lg:grid-cols-2">
              <LocationsMap locations={dashboardData.locations} />
              <ServiceOrdersOverview orders={dashboardData.serviceOrders} />
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-2">
            <ResourceManagement
              subcontractors={dashboardData.subcontractors}
              projects={dashboardData.projects}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-2">
            <FinancialAnalytics data={dashboardData.financials} />
          </TabsContent>

          <TabsContent value="risks" className="space-y-2">
            <RiskManagement risks={dashboardData.risks} detailed={true} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function QuickStat({
  label,
  value,
  change,
  icon,
}: {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
        <div className="flex flex-col items-end space-y-1">
          {icon}
          <div className="flex items-center text-xs">
            {!isNeutral &&
              (isPositive ? (
                <ArrowUpRight className="w-3 h-3 text-green-600" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-red-600" />
              ))}
            {isNeutral && <Minus className="w-3 h-3 text-gray-400" />}
            <span
              className={`ml-1 ${
                isPositive
                  ? "text-green-600"
                  : isNeutral
                  ? "text-gray-400"
                  : "text-red-600"
              }`}
            >
              {isNeutral ? "0%" : `${Math.abs(change)}%`}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ServiceOrdersOverview({ orders }: { orders: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Service Orders
        </CardTitle>
        <CardDescription>
          Current service orders and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{order.issuedBy}</h4>
                  <p className="text-sm text-muted-foreground">
                    {order.region} Region
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      order.status === "approved" ? "default" : "secondary"
                    }
                  >
                    {order.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    KES {(order.totalValue / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Due: {new Date(order.dueDate).toLocaleDateString()}</span>
                <Badge
                  variant="outline"
                  className={
                    order.priority === "High"
                      ? "border-red-500 text-red-600"
                      : order.priority === "Medium"
                      ? "border-yellow-500 text-yellow-600"
                      : "border-green-500 text-green-600"
                  }
                >
                  {order.priority} Priority
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
