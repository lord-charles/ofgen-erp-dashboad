import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, PieChart, BarChart3 } from "lucide-react"

export function FinancialAnalytics({ data }: { data: any }) {
  const totalExpenses = Object.values(data.expenses).reduce((sum: number, value: any) => sum + value, 0)

  return (
    <div className="space-y-6">
      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Revenue Performance
          </CardTitle>
          <CardDescription>Monthly revenue vs targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.monthlyRevenue.map((month: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{month.month}</span>
                  <div className="text-right">
                    <span className="font-semibold">KES {(month.revenue / 1000000).toFixed(1)}M</span>
                    <span className="text-muted-foreground ml-2">/ {(month.target / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
                <Progress value={(month.revenue / month.target) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Values */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Project Portfolio Value
          </CardTitle>
          <CardDescription>Contract values by project status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.projectValues.map((item: any, index: number) => {
              const total = data.projectValues.reduce((sum: number, p: any) => sum + p.value, 0)
              const percentage = (item.value / total) * 100

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.status}</span>
                    <span className="font-semibold">
                      KES {(item.value / 1000000).toFixed(1)}M ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Expense Breakdown
          </CardTitle>
          <CardDescription>Current expense distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(data.expenses).map(([category, amount]: [string, any], index) => {
              const percentage = (amount / totalExpenses) * 100

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{category}</span>
                    <span className="font-semibold">
                      KES {(amount / 1000000).toFixed(1)}M ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between font-semibold">
              <span>Total Expenses</span>
              <span>KES {(totalExpenses / 1000000).toFixed(1)}M</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
