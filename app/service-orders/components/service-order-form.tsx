"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { serviceOrderSchema } from "./schemas";
import type { ServiceOrder } from "../types/service-order";
export type ServiceOrderFormData = Omit<
  ServiceOrder,
  "_id" | "createdAt" | "updatedAt"
>;
import { BillOfMaterialsSection } from "./bill-of-materials-section";
import { DesignSummarySection } from "./design-summary-section";
import {
  Building,
  MapPin,
  Phone,
  User,
  FileText,
  CheckCircle,
  List,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/ui/spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getBasicLocationInfo } from "@/services/location-service";
import { useEffect, useState } from "react";
import { getInventoryItems } from "@/services/inventory-service"; // Adjust path if necessary
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface LocationBasicInfo {
  name: string;
  siteId?: string;
  systemSiteId?: string;
}

export interface InventoryItemFromAPI {
  _id: string;
  itemName: string;
  itemCode: string;
  description?: string;
  unitOfMeasure: string;
  technicalSpecs?: {
    specifications?: string;
    [key: string]: any;
  };
  pricing?: {
    standardCost?: number;
    sellingPrice?: number;
    currency?: string;
  };
}

interface ServiceOrderFormProps {
  onSubmit: (data: any) => void | Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<ServiceOrderFormData>;
  isEditing?: boolean;
  loading?: boolean;
}

export function ServiceOrderForm({
  onSubmit,
  onCancel,
  defaultValues,
  isEditing = false,
  loading,
}: ServiceOrderFormProps) {
  const [inventoryItems, setInventoryItems] = useState<InventoryItemFromAPI[]>(
    []
  );
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [locations, setLocations] = useState<LocationBasicInfo[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        const data = await getBasicLocationInfo();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();

    const fetchInvItems = async () => {
      setLoadingInventory(true);
      try {
        const itemsData = await getInventoryItems();
        setInventoryItems(itemsData || []);
      } catch (error) {
        console.error("Failed to fetch inventory items:", error);
      } finally {
        setLoadingInventory(false);
      }
    };
    fetchInvItems();
  }, []);

  const form = useForm<ServiceOrderFormData>({
    resolver: zodResolver(serviceOrderSchema),
    defaultValues: defaultValues || {
      issuedBy: "",
      issuedTo: "",
      serviceOrderDate: "",
      contactInfo: {
        name: "",
        telephone: "",
        email: "",
        physicalAddress: "",
      },
      locationInfo: {
        region: "",
        subRegion: "",
        coordinates: {
          latitude: 0,
          longitude: 0,
        },
      },
      siteDetails: {
        siteId: "",
        siteType: "",
        siteClassification: "",
      },
      designSummary: {},
      billOfMaterials: [],
      status: "draft",
      totalValue: undefined,
      comments: "",
      approval: undefined,
    },
  });

  const handleSubmit = (data: ServiceOrderFormData) => {
    onSubmit(data);
  };

  const watchedStatus = form.watch("status");

  // Helper function to get validation status for each tab
  const getTabValidationStatus = (fields: string[]) => {
    const errors = form.formState.errors;
    return fields.some((field) => {
      const fieldPath = field.split(".");
      let current: any = errors;
      for (const path of fieldPath) {
        if (current && typeof current === "object" && path in current) {
          current = current[path];
        } else {
          return false;
        }
      }
      return current !== undefined;
    });
  };

  const basicInfoHasErrors = getTabValidationStatus([
    "issuedBy",
    "issuedTo",
    "serviceOrderDate",
  ]);
  const contactHasErrors = getTabValidationStatus([
    "contactInfo.name",
    "contactInfo.telephone",
    "contactInfo.email",
    "contactInfo.physicalAddress",
  ]);
  const locationHasErrors = getTabValidationStatus([
    "locationInfo.region",
    "locationInfo.subRegion",
    "locationInfo.coordinates.latitude",
    "locationInfo.coordinates.longitude",
  ]);
  const siteHasErrors = getTabValidationStatus([
    "siteDetails.siteId",
    "siteDetails.siteType",
    "siteDetails.siteClassification",
  ]);

  const ComboboxSelect = ({
    options,
    value,
    onChange,
    placeholder,
  }: {
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }) => {
    const [open, setOpen] = useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white dark:bg-gray-800"
          >
            {value
              ? options.find(
                  (option: { value: string; label: string }) =>
                    option.value === value
                )?.label
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput
              placeholder={`Search ${placeholder.toLowerCase()}...`}
            />
            <CommandList>
              <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {options.map((option: { value: string; label: string }) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };
  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold  mb-2">
                {isEditing ? "Edit Service Order" : "Create Service Order"}
              </h1>
              <p>
                {isEditing
                  ? "Update the service order details below"
                  : "Fill in the details to create a new service order"}
              </p>
            </div>
            <Badge
              variant={watchedStatus === "approved" ? "default" : "secondary"}
              className="text-sm px-3 py-1"
            >
              Status: {watchedStatus?.toUpperCase() || "DRAFT"}
            </Badge>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <Tabs defaultValue="basic" className="w-full">
              <div className=" rounded-lg shadow-sm border border-slate-200">
                {/* Tab Navigation */}
                <div className="border-b border-slate-200 rounded-t-lg">
                  <TabsList className="grid w-full grid-cols-7 h-auto p-2 bg-transparent">
                    <TabsTrigger
                      value="basic"
                      className="flex flex-col items-center gap-2 py-4 px-3 data-[state=active]: data-[state=active]:shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {basicInfoHasErrors && (
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </div>
                      <span className="text-xs font-medium">Basic Info</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="contact"
                      className="flex flex-col items-center gap-2 py-4 px-3 data-[state=active]: data-[state=active]:shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {contactHasErrors && (
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </div>
                      <span className="text-xs font-medium">Contact</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="location"
                      className="flex flex-col items-center gap-2 py-4 px-3 data-[state=active]: data-[state=active]:shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {locationHasErrors && (
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </div>
                      <span className="text-xs font-medium">Location</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="site"
                      className="flex flex-col items-center gap-2 py-4 px-3 data-[state=active]: data-[state=active]:shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        {siteHasErrors && (
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </div>
                      <span className="text-xs font-medium">Site Details</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="design"
                      className="flex flex-col items-center gap-2 py-4 px-3 data-[state=active]: data-[state=active]:shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium">Design</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="bom"
                      className="flex flex-col items-center gap-2 py-4 px-3 data-[state=active]: data-[state=active]:shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <List className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium">BOM</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="status"
                      className="flex flex-col items-center gap-2 py-4 px-3 data-[state=active]: data-[state=active]:shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium">Status</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {/* Basic Information Tab */}
                  <TabsContent value="basic" className="m-0 space-y-6">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold  mb-2">
                          Basic Information
                        </h2>
                        <p className="text-sm">
                          Enter the fundamental details of the service order
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="issuedBy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Issued By *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter issuing organization"
                                  {...field}
                                  className="h-11 focus:ring-2 focus:ring-blue-500/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="issuedTo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Issued To *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter receiving organization"
                                  {...field}
                                  className="h-11 focus:ring-2 focus:ring-blue-500/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="serviceOrderDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Service Order Date *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  {...field}
                                  className="h-11 focus:ring-2 focus:ring-blue-500/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Contact Information Tab */}
                  <TabsContent value="contact" className="m-0 space-y-6">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold  mb-2">
                          Contact Information
                        </h2>
                        <p className="text-sm">
                          Contact details for the service order
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="contactInfo.name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Contact Name *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter contact person name"
                                  {...field}
                                  className="h-11 focus:ring-2 focus:ring-green-500/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="contactInfo.telephone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Telephone *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter phone number"
                                  {...field}
                                  className="h-11 focus:ring-2 focus:ring-green-500/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="contactInfo.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Email *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="Enter email address"
                                  {...field}
                                  className="h-11 focus:ring-2 focus:ring-green-500/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="contactInfo.physicalAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Physical Address *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter physical address"
                                  {...field}
                                  className="h-11 focus:ring-2 focus:ring-green-500/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Location Information Tab */}
                  <TabsContent value="location" className="m-0 space-y-6">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold  mb-2">
                          Location Information
                        </h2>
                        <p className="text-sm">
                          Geographic location and coordinates
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="locationInfo.region"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Region *
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11 focus:ring-2 focus:ring-purple-500/20">
                                    <SelectValue placeholder="Select region" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="CENTRAL">
                                    CENTRAL
                                  </SelectItem>
                                  <SelectItem value="COAST">COAST</SelectItem>
                                  <SelectItem value="EASTERN">
                                    EASTERN
                                  </SelectItem>
                                  <SelectItem value="NORTH EASTERN">
                                    NORTH EASTERN
                                  </SelectItem>
                                  <SelectItem value="NYANZA">NYANZA</SelectItem>
                                  <SelectItem value="RIFT VALLEY">
                                    RIFT VALLEY
                                  </SelectItem>
                                  <SelectItem value="WESTERN">
                                    WESTERN
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="locationInfo.subRegion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Sub Region *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter sub region"
                                  {...field}
                                  className="h-11 focus:ring-2 focus:ring-purple-500/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="locationInfo.coordinates.latitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Latitude *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="any"
                                  placeholder="Enter latitude"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  className="h-11 focus:ring-2 focus:ring-purple-500/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="locationInfo.coordinates.longitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Longitude *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="any"
                                  placeholder="Enter longitude"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  className="h-11 focus:ring-2 focus:ring-purple-500/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Site Details Tab */}
                  <TabsContent value="site" className="m-0 space-y-6">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold  mb-2">
                          Site Details
                        </h2>
                        <p className="text-sm">
                          Site identification and classification
                        </p>
                      </div>

                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="siteDetails.siteId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Site ID *
                              </FormLabel>
                              <ComboboxSelect
                                options={locations.map((loc) => ({
                                  value: (loc?.siteId ||
                                    loc?.systemSiteId) as string,
                                  label: `${loc?.name}-(${
                                    loc?.siteId || loc?.systemSiteId
                                  })`,
                                }))}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select a site"
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="siteDetails.siteType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">
                                  Site Type
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-11 focus:ring-2 focus:ring-orange-500/20">
                                      <SelectValue placeholder="Select site type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Green Field">
                                      Green Field
                                    </SelectItem>
                                    <SelectItem value="Rooftop">
                                      Rooftop
                                    </SelectItem>
                                    <SelectItem value="Ground Mount">
                                      Ground Mount
                                    </SelectItem>
                                    <SelectItem value="Indoor">
                                      Indoor
                                    </SelectItem>
                                    <SelectItem value="Outdoor">
                                      Outdoor
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="siteDetails.siteClassification"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">
                                  Site Classification
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-11 focus:ring-2 focus:ring-orange-500/20">
                                      <SelectValue placeholder="Select classification" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Hub">Hub</SelectItem>
                                    <SelectItem value="OLT">OLT</SelectItem>
                                    <SelectItem value="Collocation">
                                      Collocation
                                    </SelectItem>
                                    <SelectItem value="Last Mile">
                                      Last Mile
                                    </SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Design  */}
                  <TabsContent value="design" className="m-0 space-y-6">
                    <ScrollArea className="space-y-2 h-[50vh]">
                      <div>
                        <h2 className="text-xl font-semibold  mb-1">
                          Design Summary
                        </h2>
                      </div>

                      {/* Design Summary */}
                      <FormField
                        control={form.control}
                        name="designSummary"
                        render={({ field }) => (
                          <FormItem>
                            <DesignSummarySection
                              designSummary={field.value}
                              onChange={field.onChange}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </ScrollArea>
                  </TabsContent>

                  {/* Bill of Materials Tab */}
                  <TabsContent value="bom" className="m-0 space-y-6">
                    <ScrollArea className="space-y-2 h-[50vh]">
                      <div>
                        <h2 className="text-xl font-semibold  mb-1">
                          Bill of Materials
                        </h2>
                      </div>

                      {/* Bill of Materials */}
                      <FormField
                        control={form.control}
                        name="billOfMaterials"
                        render={({ field }) => (
                          <FormItem>
                            <BillOfMaterialsSection
                              items={field.value}
                              onChange={field.onChange}
                              inventoryItems={inventoryItems}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </ScrollArea>
                  </TabsContent>

                  {/* Status Tab */}
                  <TabsContent value="status" className="m-0 space-y-6">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold  mb-2">
                          Status & Additional Information
                        </h2>
                        <p className="text-sm">
                          Order status and additional comments
                        </p>
                      </div>

                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Status *
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11 focus:ring-2 focus:ring-indigo-500/20">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="draft">Draft</SelectItem>
                                  <SelectItem value="pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="approved">
                                    Approved
                                  </SelectItem>
                                  <SelectItem value="rejected">
                                    Rejected
                                  </SelectItem>
                                  <SelectItem value="completed">
                                    Completed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="comments"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Comments
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter any additional comments"
                                  {...field}
                                  rows={4}
                                  className="focus:ring-2 focus:ring-indigo-500/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Approval Section - Only show if status is approved */}
                        {watchedStatus === "approved" && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <h3 className="text-lg font-medium text-green-900">
                                Approval Information
                              </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="approval.approvedBy"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                      Approved By
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter approver name"
                                        {...field}
                                        className="h-11 "
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="approval.approvedDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                      Approval Date
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="date"
                                        {...field}
                                        className="h-11 "
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={form.control}
                              name="approval.approvalComments"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium">
                                    Approval Comments
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Enter approval comments"
                                      {...field}
                                      rows={3}
                                      className=""
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </div>

                {/* Form Actions - Always Visible at Bottom */}
                <div className="border-t border-slate-200 rounded-b-lg px-6 py-4">
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                      className="px-6 h-11"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200 text-white"
                    >
                      {isEditing ? (
                        <div>
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <Spinner /> <span>Updating...</span>
                            </div>
                          ) : (
                            "Update"
                          )}
                        </div>
                      ) : (
                        <div>
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <Spinner /> <span>Creating...</span>
                            </div>
                          ) : (
                            "Create Order"
                          )}
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Tabs>
          </form>
        </Form>
      </div>
    </div>
  );
}
