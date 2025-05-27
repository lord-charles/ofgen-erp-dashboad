"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Eye, Edit } from "lucide-react"

interface ServiceOrderTableProps {
  serviceOrders: any[]
  onView: (order: any) => void
  onEdit: (order: any) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200"
    case "rejected":
      return "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200"
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function ServiceOrderTable({ serviceOrders, onView, onEdit }: ServiceOrderTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrders = serviceOrders.filter(
    (order) =>
      order.siteDetails.siteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.issuedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.issuedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.locationInfo.region.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Service Orders</CardTitle>
            <CardDescription>Manage and track all service orders across your organization</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Site ID</TableHead>
                <TableHead className="font-semibold">Issued By</TableHead>
                <TableHead className="font-semibold">Issued To</TableHead>
                <TableHead className="font-semibold">Region</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Value</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{order.siteDetails.siteId}</TableCell>
                  <TableCell>{order.issuedBy}</TableCell>
                  <TableCell>{order.issuedTo}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {order.locationInfo.region}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(order.serviceOrderDate)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(order.totalValue)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(order)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
