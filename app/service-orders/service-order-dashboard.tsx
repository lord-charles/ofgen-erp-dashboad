"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Plus, Sparkles } from "lucide-react"
import { ServiceOrderForm } from "./components/service-order-form"
import { StatCards } from "./components/stat-cards"
import type { ServiceOrderFormData } from "./components/schemas"
import type { ServiceOrder } from "./types/service-order"
import ServiceOrderTable from "./service-table/service-order"
import { useToast } from "@/hooks/use-toast";

interface ServiceOrderDashboardProps {
  serviceOrders: ServiceOrder[]
}

export default function ServiceOrderDashboard({ serviceOrders }: ServiceOrderDashboardProps) {
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  const { toast } = useToast();

  async function handleCreateOrder(data: ServiceOrderFormData) {
    setLoadingCreate(true);
    setCreateError(null);
    setCreateSuccess(null);
    try {
      const { createServiceOrder } = await import("@/services/service-order-service");
      await createServiceOrder(data);
      setCreateSuccess("Service order created successfully");
      setIsAddDrawerOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      setCreateError(error?.message || "Failed to create service order");
      toast({ title: "Failed", description: error?.message || "Failed to create service order", variant: "destructive" });
    } finally {
      setLoadingCreate(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex flex-col space-y-4">
        {/* Stats Cards */}
        <StatCards serviceOrders={serviceOrders} />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Service Orders
            </h2>
            <p className="text-muted-foreground text-md">Manage and monitor all your service orders</p>
          </div>
          <Drawer open={isAddDrawerOpen} onOpenChange={setIsAddDrawerOpen}>
            <DrawerTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200 text-white">
                <Plus className="mr-2 h-4 w-4 text-white" />
                Add Service Order
                <Sparkles className="ml-2 h-4 w-4 text-white" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[96vh]">
              {/* Feedback */}
              {createError && <div className="mb-4 text-red-600 text-sm">{createError}</div>}
              {createSuccess && <div className="mb-4 text-green-600 text-sm">{createSuccess}</div>}
              <ServiceOrderForm onSubmit={handleCreateOrder} onCancel={() => setIsAddDrawerOpen(false)} loading={loadingCreate} />
            </DrawerContent>
          </Drawer>
        </div>
        {/* Service Orders Table */}
        <ServiceOrderTable data={serviceOrders} />
      </div>
    </div>
  );
}
