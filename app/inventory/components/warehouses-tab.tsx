"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, MapPin, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "@/services/inventory-service";
import { useRouter } from "next/navigation";

interface Warehouse {
  _id: string;
  name: string;
  address: string;
  city: string;
  county: string;
  createdAt: string;
  updatedAt: string;
}

interface WarehouseFormData {
  name: string;
  address: string;
  city: string;
  county: string;
}

export function WarehousesTab({ warehouses }: { warehouses: Warehouse[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null
  );
  const [formData, setFormData] = useState<WarehouseFormData>({
    name: "",
    address: "",
    city: "",
    county: "",
  });
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.address ||
      !formData.city ||
      !formData.county
    ) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingWarehouse) {
        await updateWarehouse(editingWarehouse._id, formData);
      } else {
        await createWarehouse(formData);
      }

      toast({
        title: "Success",
        description: editingWarehouse
          ? "Warehouse updated successfully"
          : "Warehouse created successfully",
      });
      setIsDialogOpen(false);
      resetForm();
      router.refresh();
    } catch (error) {
      toast({
        title: "Error saving warehouse",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      address: warehouse.address,
      city: warehouse.city,
      county: warehouse.county,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this warehouse?")) return;

    try {
      await deleteWarehouse(id);
      toast({
        title: "Success",
        description: "Warehouse deleted successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete warehouse",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      county: "",
    });
    setEditingWarehouse(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Warehouses</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Warehouse
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingWarehouse ? "Edit Warehouse" : "Create New Warehouse"}
              </DialogTitle>
              <DialogDescription>
                {editingWarehouse
                  ? "Update the warehouse information below."
                  : "Add a new warehouse location to your inventory system."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Warehouse Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Nairobi Main Warehouse"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="e.g., Industrial Area, Lusaka Road, Warehouse Block C"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    placeholder="e.g., Nairobi"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="county">County *</Label>
                  <Input
                    id="county"
                    value={formData.county}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        county: e.target.value,
                      }))
                    }
                    placeholder="e.g., Nairobi County"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingWarehouse ? "Update" : "Create"} Warehouse
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0 sm:p-6">
          {warehouses.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No warehouses found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first warehouse to start managing inventory
                locations.
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Warehouse
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouses.map((warehouse) => (
                  <TableRow key={warehouse._id}>
                    <TableCell className="font-medium">
                      {warehouse.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>
                            {warehouse.city}, {warehouse.county}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {warehouse.address}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(warehouse.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(warehouse)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(warehouse._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
