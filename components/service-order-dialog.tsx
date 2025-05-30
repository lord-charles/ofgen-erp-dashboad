import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { ServiceOrderForm } from "@/app/service-orders/components/service-order-form";
import { useToast } from "@/hooks/use-toast";
import type { ServiceOrderFormData } from "@/app/service-orders/components/schemas";

interface ServiceOrderDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ServiceOrderDialog({
  open,
  setOpen,
}: ServiceOrderDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { toast } = useToast();

  async function handleCreateOrder(data: ServiceOrderFormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { createServiceOrder } = await import(
        "@/services/service-order-service"
      );
      await createServiceOrder(data);
      setSuccess("Service order created successfully");
      setTimeout(() => {
        setOpen(false);
        setSuccess(null);
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      setError(error?.message || "Failed to create service order");
      toast({
        title: "Failed",
        description: error?.message || "Failed to create service order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[96vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Service Order
          </DrawerTitle>
          <DrawerDescription>
            Create a new service order for your team
          </DrawerDescription>
        </DrawerHeader>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        {success && (
          <div className="mb-4 text-green-600 text-sm">{success}</div>
        )}
        <ServiceOrderForm
          onSubmit={handleCreateOrder}
          onCancel={() => setOpen(false)}
          loading={loading}
        />
      </DrawerContent>
    </Drawer>
  );
}
