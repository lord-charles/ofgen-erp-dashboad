"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Building2, Package, Truck, BarChart3, BarChart } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WarehousesTab } from "./components/warehouses-tab";
import { SuppliersTab } from "./components/suppliers-tab";
import { InventoryItemsTab } from "./components/inventory-items-tab";
import { StockOperationsTab } from "./components/stock-operations-tab";
import { DashboardTab } from "./components/dashboard-tab";
import { PageHeader } from "./components/page-header";

export function InventoryDashboard({
  warehouses,
  inventoryItems,
  suppliers,
  dashboardStats,
}: {
  warehouses: any;
  inventoryItems: any;
  suppliers: any;
  dashboardStats: any;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get the current tab from URL or default to "items"
  const currentTab = searchParams.get("tab") || "dashboard";

  // Update URL when tab changes
  const setTab = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("tab", tab);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Validate tab parameter
  useEffect(() => {
    const validTabs = [
      "dashboard",
      "warehouses",
      "suppliers",
      "items",
      "operations",
    ];
    if (!validTabs.includes(currentTab)) {
      setTab("dashboard");
    }
  }, [currentTab, setTab]);

  return (
    <div>
      <PageHeader
        title="Inventory Management"
        description="Manage your warehouses, suppliers, inventory items, and stock operations"
      />

      <Tabs value={currentTab} onValueChange={setTab} className="space-y-6">
        <div className="sticky top-0 z-10 bg-background pt-2 pb-4 border-b">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 text-base"
            >
              <BarChart className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="warehouses"
              className="flex items-center gap-2 text-base"
            >
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Warehouses</span>
              <span className="sm:hidden">Warehouses</span>
            </TabsTrigger>
            <TabsTrigger
              value="suppliers"
              className="flex items-center gap-2 text-base"
            >
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">Suppliers</span>
              <span className="sm:hidden">Suppliers</span>
            </TabsTrigger>
            <TabsTrigger
              value="items"
              className="flex items-center gap-2 text-base"
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Inventory Items</span>
              <span className="sm:hidden">Items</span>
            </TabsTrigger>
            <TabsTrigger
              value="operations"
              className="flex items-center gap-2 text-base"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Stock Operations</span>
              <span className="sm:hidden">Operations</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="mt-6">
          <DashboardTab dashboardStats={dashboardStats} />
        </TabsContent>

        <TabsContent value="warehouses" className="mt-6">
          <WarehousesTab warehouses={warehouses} />
        </TabsContent>

        <TabsContent value="suppliers" className="mt-6">
          <SuppliersTab suppliers={suppliers} />
        </TabsContent>

        <TabsContent value="items" className="mt-6">
          <InventoryItemsTab
            inventoryItems={inventoryItems}
            warehouses={warehouses}
            suppliers={suppliers}
          />
        </TabsContent>

        <TabsContent value="operations" className="mt-6">
          <StockOperationsTab items={inventoryItems} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
