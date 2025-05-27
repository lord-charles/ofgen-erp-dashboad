"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });

interface MapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lat: number;
  lng: number;
  name: string;
}

export function MapModal({ open, onOpenChange, lat, lng, name }: MapModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Location Map: {name}</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className="w-full" style={{ height: '60vh', minHeight: 600, maxHeight: 600 }}>
          {open && (
            <MapContainer
              center={[lat, lng]}
              zoom={12}
              style={{ height: "100%", width: "100%", borderRadius: 12 }}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
              />
              <Marker position={[lat, lng]} />
            </MapContainer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
