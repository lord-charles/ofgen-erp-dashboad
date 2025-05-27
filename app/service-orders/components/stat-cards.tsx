"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, FileText, CheckCircle, Clock } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease"
    period: string
  }
  icon: React.ReactNode
  description?: string
  trend?: "up" | "down" | "neutral"
}

function StatCard({ title, value, change, icon, description, trend }: StatCardProps) {
  // Determine color classes based on stat type or trend
  let color = "text-blue-600";
  let bgColor = "bg-gradient-to-br from-blue-50 to-blue-100";
  let iconBg = "bg-blue-500";
  let borderColor = "border-blue-200";
  let trendIcon = <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />;
  if (trend === "down") {
    color = "text-rose-600";
    bgColor = "bg-gradient-to-br from-rose-50 to-rose-100";
    iconBg = "bg-rose-500";
    borderColor = "border-rose-200";
    trendIcon = <TrendingDown className="h-3 w-3 mr-1 text-rose-500" />;
  } else if (trend === "up") {
    color = "text-emerald-600";
    bgColor = "bg-gradient-to-br from-emerald-50 to-emerald-100";
    iconBg = "bg-emerald-500";
    borderColor = "border-emerald-200";
    trendIcon = <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />;
  }
  return (
    <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${bgColor} ${borderColor} border`}>
      <CardContent>
        <div className="flex flex-row items-center justify-between space-y-0 pb-3 mt-2">
          <div>
            <p className="text-sm font-semibold text-gray-700">{title}</p>
          </div>
          <div className={`p-2 rounded-xl ${iconBg} shadow-lg`}>
            {icon}
          </div>
        </div>
        <div className="flex items-baseline space-x-3">
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          {change && (
            <Badge
              variant="secondary"
              className={`text-xs bg-white/80 ${trend === "up" ? "text-emerald-700 border-emerald-200" : trend === "down" ? "text-rose-700 border-rose-200" : "text-blue-700 border-blue-200"}`}
            >
              {trendIcon}
              {change.value}%
            </Badge>
          )}
        </div>
        {description && <p className="text-sm text-gray-600 mt-2 font-medium">{description}</p>}
        <div className="flex items-center mt-3">
          {trendIcon}
          <span className={`text-xs font-semibold ${color}`}>{change ? `vs ${change.period}` : ""}</span>
        </div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full" />
      </CardContent>
    </Card>
  )
}

import type { ServiceOrder } from "../types/service-order";

interface StatCardsProps {
  serviceOrders: ServiceOrder[]
}

export function StatCards({ serviceOrders }: StatCardsProps) {
  // Calculate statistics
  const totalOrders = serviceOrders.length
  const totalValue = serviceOrders.reduce((sum, order) => sum + (order.totalValue || 0), 0)
  const approvedOrders = serviceOrders.filter((order) => order.status === "approved").length
  const pendingOrders = serviceOrders.filter((order) => order.status === "pending").length
  const completedOrders = serviceOrders.filter((order) => order.status === "completed").length

  // Calculate approval rate
  const approvalRate = totalOrders > 0 ? (approvedOrders / totalOrders) * 100 : 0

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate average order value
  const avgOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0

  return (
    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Service Orders"
        value={totalOrders}
        change={{
          value: 12,
          type: "increase",
          period: "last month",
        }}
        icon={<FileText className="h-5 w-5" />}
        description={`${completedOrders} completed orders`}
        trend="up"
      />

      <StatCard
        title="Portfolio Value"
        value={formatCurrency(totalValue)}
        change={{
          value: 8,
          type: "increase",
          period: "last month",
        }}
        icon={<DollarSign className="h-5 w-5" />}
        description={`Avg: ${formatCurrency(avgOrderValue)}`}
        trend="up"
      />

      <StatCard
        title="Pending Review"
        value={pendingOrders}
        change={{
          value: 3,
          type: "decrease",
          period: "last week",
        }}
        icon={<Clock className="h-5 w-5" />}
        description="Awaiting approval"
        trend="down"
      />
    </div>
  )
}
