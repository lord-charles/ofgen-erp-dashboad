"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Package,
  Plus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { InventoryItemDrawer } from "./inventory-item-drawer";
import { type InventoryItem, StockStatus } from "@/lib/schemas/inventory-item";
import {
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryItemById,
} from "@/services/inventory-service";

interface InventoryItemRow {
  _id: string;
  itemName: string;
  itemCode: string;
  category: string;
  stockStatus: string;
  totalStock: number;
  totalReserved: number;
  totalAvailable: number;
  pricing: {
    standardCost: number;
    lastPurchasePrice: number;
    sellingPrice: number;
    currency: string;
  };
}

export function InventoryItemsTab({
  inventoryItems,
  warehouses,
  suppliers,
}: {
  inventoryItems: InventoryItemRow[];
  warehouses: any[];
  suppliers: any[];
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">(
    "create"
  );

  const router = useRouter();
  const { toast } = useToast();

  const fetchItemById = async (id: string) => {
    try {
      const response = await getInventoryItemById(id);

      setSelectedItem(response.data);
    } catch (error) {
      toast({
        title: "Error saving supplier",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      closeDrawer();
    }
  };

  const openCreateDrawer = () => {
    if (warehouses.length === 0) {
      toast({
        title: "No Warehouses",
        description:
          "Please create at least one warehouse before adding inventory items",
        variant: "destructive",
      });
      return;
    }

    setDrawerMode("create");
    setSelectedItem(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (id: string) => {
    setDrawerMode("edit");
    fetchItemById(id);
    setIsDrawerOpen(true);
  };

  const openViewDrawer = (id: string) => {
    setDrawerMode("view");
    fetchItemById(id);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteInventoryItem(id);
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error saving supplier",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleSaveItem = async (data: any) => {
    try {
      const payload = {
        ...data,
        alternativeCodes: Array.isArray(data.alternativeCodes)
          ? data.alternativeCodes
          : data.alternativeCodes
              ?.split(",")
              .map((code: string) => code.trim())
              .filter(Boolean) || [],
        technicalSpecs: data.technicalSpecs || {},
        qrCode: data.qrCode || data.itemCode,
      };

      if (selectedItem?._id) {
        await updateInventoryItem(selectedItem._id, payload);
      } else {
        await createInventoryItem(payload);
      }

      toast({
        title: "Success",
        description: selectedItem?._id
          ? "Item updated successfully"
          : "Item created successfully",
      });
      closeDrawer();
      router.refresh();
      return true;
    } catch (error) {
      toast({
        title: "Error saving item",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const getStockStatusBadge = (status: string) => {
    switch (status) {
      case StockStatus.IN_STOCK:
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            In Stock
          </Badge>
        );
      case StockStatus.LOW_STOCK:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Low Stock
          </Badge>
        );
      case StockStatus.OUT_OF_STOCK:
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Out of Stock
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns: ColumnDef<InventoryItemRow>[] = [
    {
      accessorKey: "itemName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Item
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.itemName}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.itemCode}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.category}</Badge>
      ),
    },
    {
      accessorKey: "stockStatus",
      header: "Status",
      cell: ({ row }) => getStockStatusBadge(row.original.stockStatus),
    },
    {
      accessorKey: "totalStock",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-end"
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <div className="font-medium">In Stock: {row.original.totalStock}</div>
          <div className="text-xs text-muted-foreground">
            Available: {row.original.totalAvailable}
          </div>
          <div className="text-xs text-muted-foreground">
            Reserved: {row.original.totalReserved}
          </div>
        </div>
      ),
    },

    {
      accessorKey: "pricing.sellingPrice",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-end"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <div className="font-medium">
            {row.original.pricing?.currency}{" "}
            {row.original.pricing?.sellingPrice?.toLocaleString() || "-"}
          </div>
          <div className="text-sm text-muted-foreground">
            Cost: {row.original.pricing?.standardCost?.toLocaleString() || "-"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openViewDrawer(row.original._id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEditDrawer(row.original._id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Inventory Items</h2>
        <Button onClick={openCreateDrawer} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      <Card>
        <div className="p-2">
          {inventoryItems.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No inventory items found
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first inventory item to start tracking stock.
              </p>
              <Button onClick={openCreateDrawer}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Item
              </Button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={inventoryItems}
              searchColumn="itemName"
              searchPlaceholder="Search items..."
            />
          )}
        </div>
      </Card>

      <InventoryItemDrawer
        open={isDrawerOpen}
        onOpenChange={(open) => {
          if (!open) closeDrawer();
        }}
        mode={drawerMode}
        item={selectedItem}
        warehouses={warehouses}
        suppliers={suppliers}
        onSave={handleSaveItem}
      />
    </div>
  );
}
