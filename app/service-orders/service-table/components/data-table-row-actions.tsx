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

import * as React from "react";
import { useState } from "react";

import { Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ServiceOrder } from "../../types/service-order";
import { ServiceOrderForm } from "../../components/service-order-form";
import { ViewServiceOrder } from "../../components/view-service-order";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { deleteServiceOrder, updateServiceOrder } from "@/services/service-order-service";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ViewServiceOrderForm from "./service-form";

interface DataTableRowActionsProps<TData> {
  row: Row<ServiceOrder>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [viewForm, setViewForm] = useState(false)
  const { toast } = useToast();
  const order = row.original as ServiceOrder;

  const getEditFormData = (order: ServiceOrder) => ({
    issuedBy: order.issuedBy,
    issuedTo: order.issuedTo,
    serviceOrderDate: order.serviceOrderDate?.split("T")[0],
    contactInfo: order.contactInfo,
    locationInfo: order.locationInfo,
    siteDetails: order.siteDetails,
    designSummary: order.designSummary || {},
    billOfMaterials: order.billOfMaterials || [],
    status: order.status,
    totalValue: order.totalValue,
    comments: order.comments,
    approval: order.approval,
  });

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await deleteServiceOrder(order._id);
      toast({ title: "Deleted", description: "Service Order deleted successfully", variant: "default" });
      setIsViewDrawerOpen(false);
      setIsEditDrawerOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error?.message || "Failed to delete service order",
        variant: "destructive",
      });
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleUpdateOrder = async (data: any) => {
    setLoadingUpdate(true);
    try {
      await updateServiceOrder(order._id, data);
      toast({ title: "Updated", description: "Service Order updated successfully", variant: "default" });
      setIsEditDrawerOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error?.message || "Failed to update service order",
        variant: "destructive",
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleViewOrder = () => setIsViewDrawerOpen(true);
  const handleEditOrder = () => setIsEditDrawerOpen(true);
  const handleViewForm = () => { localStorage.setItem('selectedServiceOrder', JSON.stringify(order)); setViewForm(true) }



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
          <DropdownMenuItem onClick={handleViewOrder}>
            <Pencil className="h-5 w-5" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleViewForm}>
            <Pencil className="h-5 w-5" />
            View Form
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditOrder}>
            <Pencil className="h-5 w-5" />
            Edit
            <DropdownMenuShortcut>Ctrl+E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-red-600 focus:text-red-700" onSelect={e => e.preventDefault()}>
                <Trash2 className="h-5 w-5" />
                Delete
                <DropdownMenuShortcut>Del</DropdownMenuShortcut>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Service Order</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete <b>{order.locationInfo?.region || order.issuedBy}</b>? This action cannot be undone.
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

      {/* Edit Service Order Drawer */}
      <Drawer open={isEditDrawerOpen} onOpenChange={setIsEditDrawerOpen}>
        <DrawerContent className="max-h-[96vh]">
          <ServiceOrderForm
            onSubmit={handleUpdateOrder}
            onCancel={() => setIsEditDrawerOpen(false)}
            defaultValues={getEditFormData(order)}
            isEditing={true}
            loading={loadingUpdate}
          />
        </DrawerContent>
      </Drawer>

      {/* View Service Order Drawer */}
      <Drawer open={isViewDrawerOpen} onOpenChange={setIsViewDrawerOpen}>
        <DrawerContent className="max-h-[96vh]">
          <DrawerHeader>
            <DrawerTitle>Service Order Details</DrawerTitle>
            <DrawerDescription>Complete information about the selected service order</DrawerDescription>
          </DrawerHeader>
          <ViewServiceOrder order={order} />
        </DrawerContent>
      </Drawer>

      <Drawer open={viewForm} onOpenChange={setViewForm}>
        <DrawerContent className="max-h-[96vh]">
          <ViewServiceOrderForm />
        </DrawerContent>
      </Drawer>


    </>
  );
}

