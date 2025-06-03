"use client";

import { Button } from "@/components/ui/button";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BadgeDollarSign,
  BarChart3,
  CircleDollarSign,
  ClipboardList,
  DollarSign,
  ExternalLink,
  Info,
  Loader2,
  Package,
  PackageCheck,
  PackageOpen,
  PackageX,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface DashboardData {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  monthlyTransactions: number;
  inventoryHealth: {
    healthyStockItems: number;
    lowStockItems: number;
    outOfStockItems: number;
    overStockedItems: number;
    reservedStockItems: number;
    inventoryHealthScore: number;
  };
  financialMetrics: {
    totalInventoryValue: number;
    averageItemValue: number;
    highValueItems: Array<{
      itemId: string;
      itemCode: string;
      itemName: string;
      category: string;
      totalValue: number;
      quantity: number;
    }>;
    transactionValueByType: Array<any>;
    totalTransactionValue: number;
  };
  transactionMetrics: {
    currentMonthTransactions: number;
    previousMonthTransactions: number;
    transactionGrowth: number;
    dailyTransactions: Array<{
      _id: string;
      count: number;
      totalQuantity: number;
      totalValue: number;
    }>;
  };
  inventoryDistribution: {
    byCategory: Array<{
      itemCount: number;
      totalStock: number;
      totalValue: number;
      category: string;
      percentageOfTotal: number;
    }>;
    byLocation: Array<{
      totalStock: number;
      itemCount: number;
      lowStockCount: number;
      outOfStockCount: number;
      locationId: string;
      locationName: string;
    }>;
  };
  operationalInsights: {
    inventoryInsights: Array<{
      type: string;
      message: string;
    }>;
  };
  topCategories: Array<{
    transactionCount: number;
    totalQuantity: number;
    totalValue: number;
    category: string;
  }>;
  recentAlerts: Array<{
    _id: string;
    itemId: string;
    itemName: string;
    itemCode: string;
    category: string;
    currentStock: number;
    minimumLevel: number;
    maximumLevel: number;
    standardCost: number;
    daysToStockout: number;
    location: string;
    alertType: string;
    alertSeverity: string;
    estimatedValue: number;
  }>;
  recentTransactions: Array<{
    _id: string;
    inventoryItem: {
      _id: string;
      itemName: string;
      itemCode: string;
      category: string;
    };
    transactionType: string;
    quantity: number;
    fromLocation: {
      _id: string;
      name: string;
    };
    performedBy: {
      _id: string;
    };
    notes: string;
    transactionDate: string;
    createdAt: string;
    updatedAt: string;
    transactionRef: string;
  }>;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];
export function DashboardTab({ dashboardStats }: { dashboardStats: any }) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    dashboardStats
  );
  const [activeTab, setActiveTab] = useState("overview");

  if (!dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-64">
        <AlertCircle className="h-8 w-8 text-destructive mb-4" />
        <p className="text-muted-foreground">
          Failed to load dashboard statistics
        </p>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date

  // Prepare data for charts
  const inventoryHealthData = [
    {
      name: "Healthy",
      value: dashboardData.inventoryHealth?.healthyStockItems || 0,
    },
    {
      name: "Low Stock",
      value: dashboardData.inventoryHealth?.lowStockItems || 0,
    },
    {
      name: "Out of Stock",
      value: dashboardData.inventoryHealth?.outOfStockItems || 0,
    },
    {
      name: "Overstocked",
      value: dashboardData.inventoryHealth?.overStockedItems || 0,
    },
  ].filter((item) => item.value > 0);

  const categoryDistributionData =
    dashboardData.inventoryDistribution?.byCategory.map((category) => ({
      name: category?.category || "-",
      value: category?.totalValue || 0,
      percentage: category?.percentageOfTotal || 0,
    }));

  const locationDistributionData =
    dashboardData.inventoryDistribution?.byLocation.map((location) => ({
      name: location?.locationName || "-",
      total: location?.totalStock || 0,
      items: location?.itemCount || 0,
      lowStock: location?.lowStockCount || 0,
      outOfStock: location?.outOfStockCount || 0,
    }));

  const dailyTransactionsData =
    dashboardData.transactionMetrics?.dailyTransactions.map((day) => ({
      date: day._id,
      count: day.count,
      quantity: day.totalQuantity,
      value: day.totalValue,
    }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <Badge variant="outline" className="text-sm">
          Last updated: {new Date().toLocaleTimeString()}
        </Badge>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4" />
            <span>Financial</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span>Transactions</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Inventory Value
                </CardTitle>
                <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(dashboardData.totalValue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.totalItems} items in inventory
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Inventory Health
                </CardTitle>
                <div
                  className={`rounded-full p-1 ${
                    dashboardData.inventoryHealth?.inventoryHealthScore > 80
                      ? "bg-green-100"
                      : dashboardData.inventoryHealth?.inventoryHealthScore > 50
                      ? "bg-yellow-100"
                      : "bg-red-100"
                  }`}
                >
                  {dashboardData.inventoryHealth?.inventoryHealthScore > 80 ? (
                    <PackageCheck className="h-4 w-4 text-green-600" />
                  ) : dashboardData.inventoryHealth?.inventoryHealthScore >
                    50 ? (
                    <PackageOpen className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <PackageX className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.inventoryHealth?.inventoryHealthScore}%
                </div>
                <div className="mt-2">
                  <Progress
                    value={dashboardData.inventoryHealth?.inventoryHealthScore}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Low Stock Items
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.lowStockItems || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData?.outOfStockItems || 0} items out of stock
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Transactions
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.transactionMetrics
                    ?.currentMonthTransactions || 0}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {dashboardData?.transactionMetrics?.transactionGrowth > 0 ? (
                    <>
                      <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500">
                        {dashboardData?.transactionMetrics?.transactionGrowth}%
                      </span>
                    </>
                  ) : dashboardData?.transactionMetrics?.transactionGrowth <
                    0 ? (
                    <>
                      <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                      <span className="text-red-500">
                        {Math.abs(
                          dashboardData?.transactionMetrics
                            ?.transactionGrowth || 0
                        )}
                        %
                      </span>
                    </>
                  ) : (
                    <span>No change</span>
                  )}
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights and Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Operational Insights</CardTitle>
                <CardDescription>
                  Key insights and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData?.operationalInsights?.inventoryInsights?.map(
                  (insight, index) => (
                    <div
                      key={index}
                      className={`flex p-3 rounded-lg ${
                        insight.type === "warning"
                          ? "bg-amber-50 border-l-4 border-amber-500"
                          : insight.type === "danger"
                          ? "bg-red-50 border-l-4 border-red-500"
                          : "bg-blue-50 border-l-4 border-blue-500"
                      }`}
                    >
                      <div className="mr-3">
                        {insight.type === "warning" ? (
                          <AlertCircle className="h-5 w-5 text-amber-500" />
                        ) : insight.type === "danger" ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <Info className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="text-sm">{insight.message}</div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Items requiring attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData?.recentAlerts?.length > 0 ? (
                  dashboardData?.recentAlerts?.map((alert) => (
                    <div
                      key={alert._id}
                      className="border rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            alert.alertSeverity === "high"
                              ? "destructive"
                              : "outline"
                          }
                          className="capitalize"
                        >
                          {alert.alertType.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {alert.location}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">
                          {alert.itemName}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {alert.itemCode}
                        </p>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>
                          Stock: {alert.currentStock}/{alert.minimumLevel}
                        </span>
                        <span className="font-medium">
                          {alert.daysToStockout}{" "}
                          {alert.daysToStockout === 1 ? "day" : "days"} to
                          stockout
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No alerts to display
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest inventory movements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData?.recentTransactions
                    .slice(0, 5)
                    .map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell>
                          {formatDate(transaction.transactionDate)}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {transaction.inventoryItem?.itemName || "-"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.inventoryItem?.itemCode || "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transaction?.transactionType?.includes(
                                "Adjustment Out"
                              ) ||
                              transaction?.transactionType?.includes("Return")
                                ? "destructive"
                                : "default"
                            }
                            className="whitespace-nowrap"
                          >
                            {transaction.transactionType}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction?.quantity || "-"}</TableCell>
                        <TableCell>
                          {transaction?.fromLocation?.name || "-"}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {transaction?.transactionRef || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inventory Health Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Health Distribution</CardTitle>
                <CardDescription>
                  Distribution of items by stock status
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={inventoryHealthData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {inventoryHealthData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} items`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Inventory by Location */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory by Location</CardTitle>
                <CardDescription>
                  Stock distribution across warehouses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locationDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" name="Total Stock" fill="#0088FE" />
                    <Bar dataKey="lowStock" name="Low Stock" fill="#FFBB28" />
                    <Bar
                      dataKey="outOfStock"
                      name="Out of Stock"
                      fill="#FF8042"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Inventory by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory by Category</CardTitle>
              <CardDescription>
                Value distribution by product category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.inventoryDistribution.byCategory.map(
                  (category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          ></div>
                          <span className="font-medium">
                            {category.category}
                          </span>
                        </div>
                        <div className="text-sm font-medium">
                          {formatCurrency(category.totalValue)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={category.percentageOfTotal}
                          className="h-2"
                        />
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {category.percentageOfTotal.toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{category.itemCount} items</span>
                        <span>{category.totalStock} units</span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* High Value Items */}
          <Card>
            <CardHeader>
              <CardTitle>High Value Items</CardTitle>
              <CardDescription>
                Items with the highest inventory value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.financialMetrics.highValueItems.map((item) => (
                    <TableRow key={item.itemId}>
                      <TableCell>
                        <div className="font-medium">{item.itemName}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.itemCode}
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.totalValue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Inventory Value
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    dashboardData.financialMetrics.totalInventoryValue
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Item Value
                </CardTitle>
                <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    dashboardData.financialMetrics.averageItemValue
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Transaction Value
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    dashboardData.financialMetrics.totalTransactionValue
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Value Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Category Value Distribution</CardTitle>
              <CardDescription>
                Financial breakdown by product category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatCurrency(value as number), ""]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* High Value Items */}
          <Card>
            <CardHeader>
              <CardTitle>High Value Items</CardTitle>
              <CardDescription>
                Items with the highest inventory value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Unit Value</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.financialMetrics.highValueItems.map((item) => (
                    <TableRow key={item.itemId}>
                      <TableCell>
                        <div className="font-medium">{item.itemName}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.itemCode}
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        {formatCurrency(item.totalValue / item.quantity)}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.totalValue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          {/* Transaction Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Month
                </CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.transactionMetrics.currentMonthTransactions}
                </div>
                <p className="text-xs text-muted-foreground">transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Previous Month
                </CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.transactionMetrics.previousMonthTransactions}
                </div>
                <p className="text-xs text-muted-foreground">transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Growth</CardTitle>
                {dashboardData.transactionMetrics.transactionGrowth > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : dashboardData.transactionMetrics.transactionGrowth < 0 ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    dashboardData.transactionMetrics.transactionGrowth > 0
                      ? "text-green-500"
                      : dashboardData.transactionMetrics.transactionGrowth < 0
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  {dashboardData.transactionMetrics.transactionGrowth > 0
                    ? "+"
                    : ""}
                  {dashboardData.transactionMetrics.transactionGrowth}%
                </div>
                <p className="text-xs text-muted-foreground">
                  from previous month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Daily Transactions Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Transactions</CardTitle>
              <CardDescription>
                Transaction count and quantity by day
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTransactionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="count"
                    name="Transaction Count"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="quantity"
                    name="Total Quantity"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Top Categories by Transaction</CardTitle>
              <CardDescription>
                Categories with the most transaction activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Transaction Count</TableHead>
                    <TableHead>Total Quantity</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.topCategories.map((category, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {category.category}
                      </TableCell>
                      <TableCell>{category.transactionCount}</TableCell>
                      <TableCell>{category.totalQuantity}</TableCell>
                      <TableCell className="text-right">
                        {category.totalValue > 0
                          ? formatCurrency(category.totalValue)
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest inventory movements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData?.recentTransactions?.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>
                        {transaction?.transactionDate ? formatDate(transaction.transactionDate) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {transaction?.inventoryItem?.itemName || '-'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {transaction?.inventoryItem?.itemCode || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.transactionType.includes(
                              "Adjustment Out"
                            ) || transaction.transactionType.includes("Return")
                              ? "destructive"
                              : "default"
                          }
                          className="whitespace-nowrap"
                        >
                          {transaction.transactionType}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction?.quantity || '-'}</TableCell>
                      <TableCell>
                        {transaction?.fromLocation?.name || '-'}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {transaction.transactionRef}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                View All Transactions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
