import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Activity, TreePine, TrendingUp, AlertTriangle, Zap } from "lucide-react"
import type { LocationStats } from "@/types/location"

interface LocationStatsProps {
  stats: LocationStats & { locations?: any[] }
}

function getMonthYear(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function calculateTrends(locations: any[], now: Date) {
  // Group by month-year
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const lastMonthDate = new Date(now)
  lastMonthDate.setMonth(now.getMonth() - 1)
  const lastMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`

  const thisMonthLocs = locations.filter(l => getMonthYear(l.createdAt) === thisMonth)
  const lastMonthLocs = locations.filter(l => getMonthYear(l.createdAt) === lastMonth)

  // Total
  const totalNow = locations.length
  const totalLast = locations.filter(l => getMonthYear(l.createdAt) <= lastMonth).length
  const totalTrend = totalLast === 0 ? '0% from last month' : `${((totalNow - totalLast) / totalLast * 100).toFixed(1)}% from last month`

  // Active
  const activeNow = locations.filter(l => l.status === 'active').length
  const activeLast = locations.filter(l => l.status === 'active' && getMonthYear(l.createdAt) <= lastMonth).length
  const activeTrend = activeLast === 0 ? '0% from last month' : `${((activeNow - activeLast) / activeLast * 100).toFixed(1)}% from last month`

  // Outdoor
  const outdoorNow = locations.filter(l => l.siteType === 'outdoor').length
  const outdoorLast = locations.filter(l => l.siteType === 'outdoor' && getMonthYear(l.createdAt) <= lastMonth).length
  const outdoorTrend = outdoorLast === 0 ? '0% from last month' : `${((outdoorNow - outdoorLast) / outdoorLast * 100).toFixed(1)}% from last month`

  // Maintenance
  const maintNow = locations.filter(l => l.status === 'maintenance').length
  const maintLast = locations.filter(l => l.status === 'maintenance' && getMonthYear(l.createdAt) <= lastMonth).length
  const maintTrend = maintLast === 0 ? (maintNow > 0 ? `+${maintNow}` : '0% from last month') : `${maintNow - maintLast > 0 ? '+' : ''}${maintNow - maintLast} from last month`

  return { totalTrend, activeTrend, outdoorTrend, maintTrend }
}

export function LocationStats({ stats }: LocationStatsProps) {
  // Accepts stats.locations (array) for trend calculation. If not present, fallback to N/A.
  const now = new Date();
  const trends = stats.locations ? calculateTrends(stats.locations, now) : {
    totalTrend: 'N/A',
    activeTrend: 'N/A',
    outdoorTrend: 'N/A',
    maintTrend: 'N/A',
  };
  const statCards = [
    {
      title: "Total Locations",
      value: stats.total,
      description: `Across ${stats.counties} counties`,
      icon: MapPin,
      trend: trends.totalTrend,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconBg: "bg-blue-500",
      borderColor: "border-blue-200",
    },
    {
      title: "Active Sites",
      value: stats.active,
      description: `${((stats.active / stats.total) * 100).toFixed(1)}% operational`,
      icon: Zap,
      trend: trends.activeTrend,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      iconBg: "bg-emerald-500",
      borderColor: "border-emerald-200",
    },
    {
      title: "Outdoor Sites",
      value: stats.outdoorSites,
      description: `${stats.indoorSites} indoor/rooftop`,
      icon: TreePine,
      trend: trends.outdoorTrend,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      iconBg: "bg-green-500",
      borderColor: "border-green-200",
    },
    {
      title: "Maintenance",
      value: stats.maintenance,
      description: `${stats.inactive} inactive sites`,
      icon: AlertTriangle,
      trend: trends.maintTrend,
      color: stats.maintenance > 0 ? "text-amber-600" : "text-emerald-600",
      bgColor:
        stats.maintenance > 0
          ? "bg-gradient-to-br from-amber-50 to-amber-100"
          : "bg-gradient-to-br from-emerald-50 to-emerald-100",
      iconBg: stats.maintenance > 0 ? "bg-amber-500" : "bg-emerald-500",
      borderColor: stats.maintenance > 0 ? "border-amber-200" : "border-emerald-200",
    },
  ]

  return (
    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card
          key={index}
          className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${stat.bgColor} ${stat.borderColor} border`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">{stat.title}</CardTitle>
            <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-3">
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              {index === 1 && (
                <Badge variant="secondary" className="text-xs bg-white/80 text-emerald-700 border-emerald-200">
                  <Activity className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2 font-medium">{stat.description}</p>
            <div className="flex items-center mt-3">
              <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
              <span className={`text-xs font-semibold ${stat.color}`}>{stat.trend}</span>
            </div>
          </CardContent>

          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full" />
        </Card>
      ))}
    </div>
  )
}
