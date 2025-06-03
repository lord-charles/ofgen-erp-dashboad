"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Settings,
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adjustStock, updateReservedStock } from "@/services/inventory-service";
import { useRouter } from "next/navigation";

interface InventoryItem {
  _id: string;
  itemName: string;
  itemCode: string;
  stockLevels: Array<{
    location: {
      _id: string;
      name: string;
      city: string;
    };
    currentStock: number;
    reservedStock: number;
    availableStock: number;
  }>;
}

interface Warehouse {
  _id: string;
  name: string;
  city: string;
}

interface StockAdjustmentData {
  itemId: string;
  locationId: string;
  adjustmentQuantity: number;
  reason: string;
  performedBy: string;
  documentRef: string;
}

interface StockReservationData {
  inventoryItem: string;
  location: string;
  action: "increase" | "decrease";
  quantity: number;
  performedBy: string;
  notes: string;
}

const adjustmentReasons = [
  "Damaged items removed from inventory",
  "Found additional stock during audit",
  "Theft or loss",
  "Expired items disposal",
  "Quality control rejection",
  "Inventory count correction",
  "Return to supplier",

  "Other",
];

export function StockOperationsTab({ items }: { items: InventoryItem[] }) {
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false);
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const router = useRouter();

  const [adjustmentData, setAdjustmentData] = useState<StockAdjustmentData>({
    itemId: "",
    locationId: "",
    adjustmentQuantity: 0,
    reason: "",
    performedBy: "682744c89098dd573f307f39", // Current user ID from token
    documentRef: "",
  });

  const [reservationData, setReservationData] = useState<StockReservationData>({
    inventoryItem: "",
    location: "",
    action: "increase",
    quantity: 0,
    performedBy: "682744c89098dd573f307f39", // Current user ID from token
    notes: "",
  });

  const { toast } = useToast();

  const handleStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !adjustmentData.itemId ||
      !adjustmentData.locationId ||
      !adjustmentData.reason
    ) {
      toast({
        title: "Validation Error",
        description: "Item, location, and reason are required",
        variant: "destructive",
      });
      return;
    }

    if (adjustmentData.adjustmentQuantity === 0) {
      toast({
        title: "Validation Error",
        description: "Adjustment quantity cannot be zero",
        variant: "destructive",
      });
      return;
    }

    try {
      await adjustStock(adjustmentData);

      toast({
        title: "Success",
        description: "Stock adjustment completed successfully",
      });
      setIsAdjustmentDialogOpen(false);
      resetAdjustmentForm();
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to adjust stock",
        variant: "destructive",
      });
    }
  };

  const handleStockReservation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !reservationData.inventoryItem ||
      !reservationData.location ||
      reservationData.quantity <= 0
    ) {
      toast({
        title: "Validation Error",
        description: "Item, location, and valid quantity are required",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateReservedStock(reservationData);

      toast({
        title: "Success",
        description: `Stock reservation ${reservationData.action}d successfully`,
      });
      setIsReservationDialogOpen(false);
      resetReservationForm();
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update stock reservation",
        variant: "destructive",
      });
    }
  };

  const resetAdjustmentForm = () => {
    setAdjustmentData({
      itemId: "",
      locationId: "",
      adjustmentQuantity: 0,
      reason: "",
      performedBy: "682744c89098dd573f307f39",
      documentRef: "",
    });
    setSelectedItem(null);
    setSelectedLocation("");
  };

  const resetReservationForm = () => {
    setReservationData({
      inventoryItem: "",
      location: "",
      action: "increase",
      quantity: 0,
      performedBy: "682744c89098dd573f307f39",
      notes: "",
    });
    setSelectedItem(null);
    setSelectedLocation("");
  };

  const openAdjustmentDialog = () => {
    if (items.length === 0) {
      toast({
        title: "No Items",
        description:
          "Please create inventory items before making stock adjustments",
        variant: "destructive",
      });
      return;
    }
    resetAdjustmentForm();
    setIsAdjustmentDialogOpen(true);
  };

  const openReservationDialog = () => {
    if (items.length === 0) {
      toast({
        title: "No Items",
        description:
          "Please create inventory items before managing reservations",
        variant: "destructive",
      });
      return;
    }
    resetReservationForm();
    setIsReservationDialogOpen(true);
  };

  const handleItemSelection = (itemId: string, isAdjustment = true) => {
    const item = items.find((i) => i._id === itemId);
    setSelectedItem(item || null);

    if (isAdjustment) {
      setAdjustmentData((prev) => ({ ...prev, itemId }));
    } else {
      setReservationData((prev) => ({ ...prev, inventoryItem: itemId }));
    }
  };

  const handleLocationSelection = (locationId: string, isAdjustment = true) => {
    setSelectedLocation(locationId);

    if (isAdjustment) {
      setAdjustmentData((prev) => ({ ...prev, locationId }));
    } else {
      setReservationData((prev) => ({ ...prev, location: locationId }));
    }
  };

  const getCurrentStock = () => {
    if (!selectedItem || !selectedLocation) return 0;
    const stockLevel = selectedItem.stockLevels.find(
      (sl) => sl.location._id === selectedLocation
    );
    return stockLevel?.currentStock || 0;
  };

  const getAvailableStock = () => {
    if (!selectedItem || !selectedLocation) return 0;
    const stockLevel = selectedItem.stockLevels.find(
      (sl) => sl.location._id === selectedLocation
    );
    return stockLevel?.availableStock || 0;
  };

  const getReservedStock = () => {
    if (!selectedItem || !selectedLocation) return 0;
    const stockLevel = selectedItem.stockLevels.find(
      (sl) => sl.location._id === selectedLocation
    );
    return stockLevel?.reservedStock || 0;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Stock Operations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Stock Adjustments
            </CardTitle>
            <CardDescription>
              Adjust inventory levels for damaged, lost, or found items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog
              open={isAdjustmentDialogOpen}
              onOpenChange={setIsAdjustmentDialogOpen}
            >
              <DialogTrigger asChild>
                <Button onClick={openAdjustmentDialog} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  New Stock Adjustment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Stock Adjustment</DialogTitle>
                  <DialogDescription>
                    Adjust stock levels for inventory corrections, damage, or
                    other reasons.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleStockAdjustment}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="adjustmentItem">Inventory Item *</Label>
                      <Select
                        value={adjustmentData.itemId}
                        onValueChange={(value) =>
                          handleItemSelection(value, true)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {items.map((item) => (
                            <SelectItem key={item._id} value={item._id}>
                              {item.itemName} ({item.itemCode})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedItem && (
                      <div className="grid gap-2">
                        <Label htmlFor="adjustmentLocation">Location *</Label>
                        <Select
                          value={adjustmentData.locationId}
                          onValueChange={(value) =>
                            handleLocationSelection(value, true)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedItem.stockLevels.map((level) => (
                              <SelectItem
                                key={level.location._id}
                                value={level.location._id}
                              >
                                {level.location.name} - Current:{" "}
                                {level.currentStock}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {selectedLocation && (
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-sm font-medium mb-2">
                          Current Stock Information
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <div className="text-muted-foreground">Total</div>
                            <div className="font-medium">
                              {getCurrentStock()}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">
                              Available
                            </div>
                            <div className="font-medium text-green-600">
                              {getAvailableStock()}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">
                              Reserved
                            </div>
                            <div className="font-medium text-orange-600">
                              {getReservedStock()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid gap-2">
                      <Label htmlFor="adjustmentQuantity">
                        Adjustment Quantity *
                      </Label>
                      <Input
                        id="adjustmentQuantity"
                        type="number"
                        value={adjustmentData.adjustmentQuantity}
                        onChange={(e) =>
                          setAdjustmentData((prev) => ({
                            ...prev,
                            adjustmentQuantity:
                              Number.parseInt(e.target.value) || 0,
                          }))
                        }
                        placeholder="Use negative numbers to reduce stock"
                        required
                      />
                      <div className="text-xs text-muted-foreground">
                        Positive numbers increase stock, negative numbers
                        decrease stock
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="adjustmentReason">Reason *</Label>
                      <Select
                        value={adjustmentData.reason}
                        onValueChange={(value) =>
                          setAdjustmentData((prev) => ({
                            ...prev,
                            reason: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {adjustmentReasons.map((reason) => (
                            <SelectItem key={reason} value={reason}>
                              {reason}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="documentRef">Document Reference</Label>
                      <Input
                        id="documentRef"
                        value={adjustmentData.documentRef}
                        onChange={(e) =>
                          setAdjustmentData((prev) => ({
                            ...prev,
                            documentRef: e.target.value,
                          }))
                        }
                        placeholder="e.g., DAMAGE-REPORT-2024-001"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAdjustmentDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Apply Adjustment</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Stock Reservations
            </CardTitle>
            <CardDescription>
              Manage reserved stock for orders and allocations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog
              open={isReservationDialogOpen}
              onOpenChange={setIsReservationDialogOpen}
            >
              <DialogTrigger asChild>
                <Button onClick={openReservationDialog} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Reservations
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Stock Reservation</DialogTitle>
                  <DialogDescription>
                    Increase or decrease reserved stock for specific items and
                    locations.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleStockReservation}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="reservationItem">Inventory Item *</Label>
                      <Select
                        value={reservationData.inventoryItem}
                        onValueChange={(value) =>
                          handleItemSelection(value, false)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {items.map((item) => (
                            <SelectItem key={item._id} value={item._id}>
                              {item.itemName} ({item.itemCode})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedItem && (
                      <div className="grid gap-2">
                        <Label htmlFor="reservationLocation">Location *</Label>
                        <Select
                          value={reservationData.location}
                          onValueChange={(value) =>
                            handleLocationSelection(value, false)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedItem.stockLevels.map((level) => (
                              <SelectItem
                                key={level.location._id}
                                value={level.location._id}
                              >
                                {level.location.name} - Available:{" "}
                                {level.availableStock}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {selectedLocation && (
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-sm font-medium mb-2">
                          Current Stock Information
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <div className="text-muted-foreground">Total</div>
                            <div className="font-medium">
                              {getCurrentStock()}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">
                              Available
                            </div>
                            <div className="font-medium text-green-600">
                              {getAvailableStock()}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">
                              Reserved
                            </div>
                            <div className="font-medium text-orange-600">
                              {getReservedStock()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="reservationAction">Action *</Label>
                        <Select
                          value={reservationData.action}
                          onValueChange={(value: "increase" | "decrease") =>
                            setReservationData((prev) => ({
                              ...prev,
                              action: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="increase">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Increase Reservation
                              </div>
                            </SelectItem>
                            <SelectItem value="decrease">
                              <div className="flex items-center gap-2">
                                <TrendingDown className="h-4 w-4" />
                                Decrease Reservation
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="reservationQuantity">Quantity *</Label>
                        <Input
                          id="reservationQuantity"
                          type="number"
                          min="1"
                          value={reservationData.quantity}
                          onChange={(e) =>
                            setReservationData((prev) => ({
                              ...prev,
                              quantity: Number.parseInt(e.target.value) || 0,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="reservationNotes">Notes</Label>
                      <Textarea
                        id="reservationNotes"
                        value={reservationData.notes}
                        onChange={(e) =>
                          setReservationData((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        placeholder="Reason for reservation change..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsReservationDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {reservationData.action === "increase"
                        ? "Increase"
                        : "Decrease"}{" "}
                      Reservation
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Stock Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Overview</CardTitle>
          <CardDescription>
            Current stock levels across all items and locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No inventory items</h3>
              <p className="text-muted-foreground">
                Create inventory items to view stock operations.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item._id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{item.itemName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.itemCode}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {item.stockLevels.map((level) => (
                      <div
                        key={level.location._id}
                        className="border rounded-lg p-3"
                      >
                        <div className="font-medium text-sm mb-2">
                          {level.location.name}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <div className="text-muted-foreground">Total</div>
                            <div className="font-medium">
                              {level.currentStock}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">
                              Available
                            </div>
                            <div className="font-medium text-green-600">
                              {level.availableStock}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">
                              Reserved
                            </div>
                            <div className="font-medium text-orange-600">
                              {level.reservedStock}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
