"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Location } from "@/types/location";

interface DataTableRowActionsProps<TData> {
  row: Row<Location>;
}

import React, { useState } from "react";
import { MapModal } from "./MapModal";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { LocationUpdateDialog } from "./LocationUpdateDialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { deleteLocation } from "@/services/location-service";
import { useToast } from "@/hooks/use-toast";

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [mapOpen, setMapOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { toast } = useToast();
  const location = row.original;
  const lat = location.coordinates?.lat;
  const lng = location.coordinates?.lng;
  const name = location.name;

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await deleteLocation(location._id);
      toast({ title: "Deleted", description: "Location deleted", variant: "default" });
      setDeleteOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error instanceof Error ? error.message : "Failed to delete location",
        variant: "destructive",
      });
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setMapOpen(true)}>
            <MapPin className="h-5 w-5" />
            View on Map
            <DropdownMenuShortcut>Ctrl+V</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setUpdateOpen(true)}>
            <Pencil className="h-5 w-5" />
            Update
            <DropdownMenuShortcut>Ctrl+U</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-red-600 focus:text-red-700" onSelect={e => e.preventDefault()}>
                <Trash2 className="h-5 w-5" />
                Delete
                <DropdownMenuShortcut>Del</DropdownMenuShortcut>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Location</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete <b>{name}</b>? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={loadingDelete}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={loadingDelete} className="bg-red-600 hover:bg-red-700 text-white">
                  {loadingDelete ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
      <MapModal
        open={mapOpen}
        onOpenChange={setMapOpen}
        lat={lat}
        lng={lng}
        name={name}
      />
      <LocationUpdateDialog
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        location={location}
        onUpdated={() => window.location.reload()}
      />
    </>
  );
}

