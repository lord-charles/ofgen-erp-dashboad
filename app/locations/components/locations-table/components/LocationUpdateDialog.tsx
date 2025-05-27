"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { updateLocation } from "@/services/location-service";
import { Location } from "@/types/location";

interface LocationUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: Location;
  onUpdated?: () => void;
}

export function LocationUpdateDialog({ open, onOpenChange, location, onUpdated }: LocationUpdateDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: location.name,
    county: location.county,
    address: location.address,
    lat: location.coordinates.lat,
    lng: location.coordinates.lng,
    siteType: location.siteType,
    siteId: location.siteId || "",
    status: location.status,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateLocation(location._id, {
        name: form.name,
        county: form.county,
        address: form.address,
        coordinates: { lat: Number(form.lat), lng: Number(form.lng) },
        siteType: form.siteType,
        siteId: form.siteId,
        status: form.status,
      });
      toast({ title: "Success", description: "Location updated", variant: "default" });
      onOpenChange(false);
      onUpdated?.();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold">Update Location</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Location Name</Label>
              <Input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="county">County</Label>
              <Input name="county" value={form.county} onChange={handleChange} required />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="address">Full Address</Label>
            <Textarea name="address" value={form.address} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label htmlFor="lat">Latitude</Label>
              <Input name="lat" type="number" step="any" value={form.lat} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lng">Longitude</Label>
              <Input name="lng" type="number" step="any" value={form.lng} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="siteId">Site ID (optional)</Label>
              <Input name="siteId" value={form.siteId} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="siteType">Site Type *</Label>
              <Select value={form.siteType} onValueChange={val => handleSelect("siteType", val)} name="siteType" required>
                <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Select site type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outdoor">🌳 Outdoor</SelectItem>
                  <SelectItem value="indoor">🏢 Indoor</SelectItem>
                  <SelectItem value="rooftop">🏠 Rooftop</SelectItem>
                  <SelectItem value="ground">🌍 Ground</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="status">Status *</Label>
              <Select value={form.status} onValueChange={val => handleSelect("status", val)} name="status" required>
                <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">⚡ Active</SelectItem>
                  <SelectItem value="inactive">⭕ Inactive</SelectItem>
                  <SelectItem value="maintenance">🔧 Maintenance</SelectItem>
                  <SelectItem value="pending">⏳ Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="px-6">Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 text-white">
              {isLoading ? <div className="flex items-center gap-2"><span>Updating</span> <Spinner /></div> : "Update Location"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
