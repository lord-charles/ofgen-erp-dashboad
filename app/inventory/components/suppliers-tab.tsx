"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Star,
  Truck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from "@/services/inventory-service";
import { useRouter } from "next/navigation";

interface Supplier {
  _id: string;
  companyName: string;
  supplierType: string;
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  country: string;
  paymentTerms: string;
  rating: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface SupplierFormData {
  companyName: string;
  supplierType: string;
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
  city: string;
  country: string;
  paymentTerms: string;
  rating: number;
  notes: string;
}

const supplierTypes = [
  "Manufacturer",
  "Distributor",
  "International Supplier",
  "Service Provider",
];

const paymentTermsOptions = [
  "Net 15 days",
  "Net 30 days",
  "Net 45 days",
  "Net 60 days",
  "Cash on Delivery",
  "Prepaid",
];

export function SuppliersTab({ suppliers }: { suppliers: Supplier[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<SupplierFormData>({
    companyName: "",
    supplierType: "",
    contactPerson: "",
    email: "",
    phone: "",
    alternatePhone: "",
    address: "",
    city: "",
    country: "Kenya",
    paymentTerms: "",
    rating: 5,
    notes: "",
  });
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.companyName ||
      !formData.contactPerson ||
      !formData.email ||
      !formData.phone
    ) {
      toast({
        title: "Validation Error",
        description:
          "Company name, contact person, email, and phone are required",
        variant: "destructive",
      });
      return;
    }

    try {
      let successMessage = "";
      if (editingSupplier) {
        await updateSupplier(editingSupplier._id, formData);
        successMessage = "Supplier updated successfully";
      } else {
        await createSupplier(formData);
        successMessage = "Supplier created successfully";
      }

      toast({
        title: "Success",
        description: successMessage,
      });
      setIsDialogOpen(false);
      resetForm();
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

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      companyName: supplier.companyName,
      supplierType: supplier.supplierType,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      alternatePhone: supplier.alternatePhone || "",
      address: supplier.address,
      city: supplier.city,
      country: supplier.country,
      paymentTerms: supplier.paymentTerms,
      rating: supplier.rating,
      notes: supplier.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;

    try {
      await deleteSupplier(id);
      toast({
        title: "Success",
        description: "Supplier deleted successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete supplier",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      companyName: "",
      supplierType: "",
      contactPerson: "",
      email: "",
      phone: "",
      alternatePhone: "",
      address: "",
      city: "",
      country: "Kenya",
      paymentTerms: "",
      rating: 5,
      notes: "",
    });
    setEditingSupplier(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Suppliers</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSupplier ? "Edit Supplier" : "Create New Supplier"}
              </DialogTitle>
              <DialogDescription>
                {editingSupplier
                  ? "Update the supplier information below."
                  : "Add a new supplier to your inventory system."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          companyName: e.target.value,
                        }))
                      }
                      placeholder="e.g., East African Electrical Supplies Ltd"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="supplierType">Supplier Type</Label>
                    <Select
                      value={formData.supplierType}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          supplierType: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {supplierTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contactPerson: e.target.value,
                        }))
                      }
                      placeholder="e.g., James Mwangi"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="e.g., james.mwangi@eaes.co.ke"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="e.g., +254-20-1234567"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="alternatePhone">Alternate Phone</Label>
                    <Input
                      id="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          alternatePhone: e.target.value,
                        }))
                      }
                      placeholder="e.g., +254-722-123456"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="e.g., Industrial Area, Nairobi Road, Plot 123"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      placeholder="e.g., Nairobi"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      placeholder="e.g., Kenya"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Select
                      value={formData.paymentTerms}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentTerms: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentTermsOptions.map((term) => (
                          <SelectItem key={term} value={term}>
                            {term}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Select
                      value={formData.rating.toString()}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          rating: Number.parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            {rating} Star{rating > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Additional notes about this supplier..."
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
                  {editingSupplier ? "Update" : "Create"} Supplier
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0 sm:p-6">
          {suppliers.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No suppliers found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first supplier to start managing vendor
                relationships.
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Supplier
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Payment Terms</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {supplier.companyName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {supplier.supplierType}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {supplier.contactPerson}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {supplier.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {supplier.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {supplier.city}, {supplier.country}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {renderStars(supplier.rating)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{supplier.paymentTerms}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(supplier)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(supplier._id)}
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
