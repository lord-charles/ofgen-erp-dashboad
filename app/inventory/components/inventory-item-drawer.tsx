"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Package,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

import {
  inventoryItemSchema,
  type InventoryItem,
  ItemCategory,
  UnitOfMeasure,
  ItemCondition,
} from "@/lib/schemas/inventory-item";
import { FormField } from "@/components/ui/form-field";

interface InventoryItemDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit" | "view";
  item: InventoryItem | null;
  warehouses: any[];
  suppliers: any[];
  onSave: (data: InventoryItem) => Promise<boolean>;
}

export function InventoryItemDrawer({
  open,
  onOpenChange,
  mode,
  item,
  warehouses,
  suppliers,
  onSave,
}: InventoryItemDrawerProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [saving, setSaving] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  // Form setup with React Hook Form and Zod validation
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
    watch,
    setValue,
    trigger,
  } = useForm<InventoryItem>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      itemName: "",
      itemCode: "",
      alternativeCodes: [],
      description: "",
      category: undefined,
      unitOfMeasure: undefined,
      manufacturer: "",
      modelNumber: "",
      serialNumber: "",
      batchNumber: "",
      condition: ItemCondition.NEW,
      supplier: "",
      stockLevels: [
        {
          location: "",
          currentStock: 0,
          minimumLevel: 0,
          maximumLevel: 100,
          reorderPoint: 10,
        },
      ],
      pricing: {
        standardCost: 0,
        lastPurchasePrice: 0,
        sellingPrice: 0,
        currency: "KES",
      },
      isActive: true,
      isSerialized: false,
      isService: false,
      isConsumable: false,
      shelfLifeDays: 365,
      warrantyMonths: 12,
      storageRequirements: "",
      safetyInfo: "",
      notes: "",
    },
    mode: "onChange",
  });

  // Stock levels field array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "stockLevels",
  });

  // Reset form when item changes
  useEffect(() => {
    if (item) {
      // Format the item data to match form structure
      const formattedItem = {
        ...item,
        alternativeCodes: Array.isArray(item.alternativeCodes)
          ? item.alternativeCodes
          : [],
        stockLevels:
          item.stockLevels?.map((level) => ({
            ...level,
            location: level.location || level.location,
          })) || [],
        pricing: item.pricing || {
          standardCost: 0,
          lastPurchasePrice: 0,
          sellingPrice: 0,
          currency: "KES",
        },
      };
      reset(formattedItem);
    } else {
      reset({
        itemName: "",
        itemCode: "",
        alternativeCodes: [],
        description: "",
        category: undefined,
        unitOfMeasure: undefined,
        manufacturer: "",
        modelNumber: "",
        serialNumber: "",
        batchNumber: "",
        condition: ItemCondition.NEW,
        supplier: "",
        stockLevels: [
          {
            location: "",
            currentStock: 0,
            minimumLevel: 0,
            maximumLevel: 100,
            reorderPoint: 10,
          },
        ],
        pricing: {
          standardCost: 0,
          lastPurchasePrice: 0,
          sellingPrice: 0,
          currency: "KES",
        },
        isActive: true,
        isSerialized: false,
        isService: false,
        isConsumable: false,
        shelfLifeDays: 365,
        warrantyMonths: 12,
        storageRequirements: "",
        safetyInfo: "",
        notes: "",
      });
    }
  }, [item, reset]);

  // Calculate form progress
  useEffect(() => {
    // Define required fields by section
    const basicFields = ["itemName", "itemCode", "category", "unitOfMeasure"];
    const stockFields = ["stockLevels"];
    const pricingFields = ["pricing.standardCost"];

    // Watch all required fields
    const formValues = watch();

    // Check if sections are valid
    const basicValid = basicFields.every((field) => {
      const value = field.includes(".")
        ? field
            .split(".")
            .reduce(
              (obj, key) =>
                obj ? (obj as Record<string, any>)[key] : undefined,
              formValues as Record<string, any>
            )
        : (formValues as Record<string, any>)[field];
      return value !== undefined && value !== "";
    });

    const stockValid =
      formValues.stockLevels?.length > 0 &&
      formValues.stockLevels.every((level) => level.location);

    const pricingValid = pricingFields.every((field) => {
      const value = field.includes(".")
        ? field.split(".").reduce(
            (obj, key) => (obj ? (obj as Record<string, any>)[key] : undefined),
            formValues as Record<string, any>
          )
        : (formValues as Record<string, any>)[field];
      return value !== undefined;
    });

    // Calculate progress percentage
    let progress = 0;
    if (basicValid) progress += 40;
    if (stockValid) progress += 40;
    if (pricingValid) progress += 20;

    setFormProgress(progress);
  }, [watch()]);

  const onSubmit = async (data: InventoryItem) => {
    setSaving(true);
    try {
      const success = await onSave(data);
      if (success) {
        reset();
      }
    } finally {
      setSaving(false);
    }
  };

  const addStockLevel = () => {
    append({
      location: "",
      currentStock: 0,
      reservedStock: 0,
      availableStock: 0,
      minimumLevel: 0,
      maximumLevel: 100,
      reorderPoint: 10,
    });
  };

  const isReadOnly = mode === "view";

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] max-h-[85vh]">
        <div className="mx-auto w-full max-w-7xl">
          <DrawerHeader className="px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-6 w-6" />
                <DrawerTitle>
                  {mode === "create"
                    ? "Add New Inventory Item"
                    : mode === "edit"
                    ? "Edit Inventory Item"
                    : "View Inventory Item"}
                </DrawerTitle>
              </div>
              {mode !== "view" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {formProgress}% Complete
                  </span>
                  <Progress value={formProgress} className="w-24" />
                </div>
              )}
            </div>
            <DrawerDescription>
              {mode === "create"
                ? "Add a new item to your inventory. Required fields are marked with *"
                : mode === "edit"
                ? "Edit the details of this inventory item"
                : "View the details of this inventory item"}
            </DrawerDescription>
          </DrawerHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="sticky top-0 z-10 bg-background pt-2 pb-4 border-b">
                  <TabsList className="grid w-full grid-cols-4 h-10">
                    <TabsTrigger
                      value="basic"
                      className="flex items-center gap-1"
                    >
                      Basic Info
                      {Object.keys(errors).some((key) =>
                        [
                          "itemName",
                          "itemCode",
                          "category",
                          "unitOfMeasure",
                        ].includes(key)
                      ) && <AlertCircle className="h-3 w-3 text-destructive" />}
                    </TabsTrigger>
                    <TabsTrigger
                      value="stock"
                      className="flex items-center gap-1"
                    >
                      Stock Levels
                      {errors.stockLevels && (
                        <AlertCircle className="h-3 w-3 text-destructive" />
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="technical"
                      className="flex items-center gap-1"
                    >
                      Technical Specs
                    </TabsTrigger>
                    <TabsTrigger
                      value="additional"
                      className="flex items-center gap-1"
                    >
                      Additional Info
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="overflow-y-auto max-h-[calc(85vh-220px)] py-6">
                  <TabsContent value="basic" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Item Name"
                        htmlFor="itemName"
                        required
                        tooltip="The full name or title of the inventory item"
                        error={errors.itemName?.message}
                      >
                        <Input
                          id="itemName"
                          placeholder="e.g., Schneider Electric Circuit Breaker 63A"
                          {...register("itemName")}
                          disabled={isReadOnly}
                        />
                      </FormField>

                      <FormField
                        label="Item Code"
                        htmlFor="itemCode"
                        required
                        tooltip="A unique identifier or SKU for this item"
                        error={errors.itemCode?.message}
                      >
                        <Input
                          id="itemCode"
                          placeholder="e.g., SCH-CB63-001"
                          {...register("itemCode")}
                          disabled={isReadOnly}
                        />
                      </FormField>
                    </div>

                    <FormField
                      label="Description"
                      htmlFor="description"
                      tooltip="Detailed description of the item"
                      error={errors.description?.message}
                    >
                      <Textarea
                        id="description"
                        placeholder="Detailed description of the item..."
                        className="min-h-24"
                        {...register("description")}
                        disabled={isReadOnly}
                      />
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Category"
                        htmlFor="category"
                        required
                        tooltip="The category this item belongs to"
                        error={errors.category?.message}
                      >
                        <Controller
                          control={control}
                          name="category"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isReadOnly}
                            >
                              <SelectTrigger id="category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent className="max-h-80">
                                <div className="grid grid-cols-2 gap-2 p-2">
                                  <div>
                                    <h4 className="mb-2 text-sm font-medium">
                                      Power & Energy
                                    </h4>
                                    <div className="space-y-1">
                                      {[
                                        ItemCategory.GENERATOR,
                                        ItemCategory.RECTIFIER,
                                        ItemCategory.INVERTER,
                                        ItemCategory.BATTERY,
                                        ItemCategory.BATTERY_CABINET,
                                      ].map((category) => (
                                        <SelectItem
                                          key={category}
                                          value={category}
                                        >
                                          {category}
                                        </SelectItem>
                                      ))}
                                    </div>

                                    <h4 className="mt-4 mb-2 text-sm font-medium">
                                      Solar & Renewable
                                    </h4>
                                    <div className="space-y-1">
                                      {[
                                        ItemCategory.SOLAR_PANEL,
                                        ItemCategory.PV_CONTROLLER,
                                        ItemCategory.SOLAR_STRUCTURE,
                                        ItemCategory.SOLAR_SYSTEM,
                                      ].map((category) => (
                                        <SelectItem
                                          key={category}
                                          value={category}
                                        >
                                          {category}
                                        </SelectItem>
                                      ))}
                                    </div>

                                    <h4 className="mt-4 mb-2 text-sm font-medium">
                                      Cables & Electrical
                                    </h4>
                                    <div className="space-y-1">
                                      {[
                                        ItemCategory.POWER_CABLE,
                                        ItemCategory.CONTROL_CABLE,
                                        ItemCategory.FLEX_CABLE,
                                        ItemCategory.EARTHING_CABLE,
                                      ].map((category) => (
                                        <SelectItem
                                          key={category}
                                          value={category}
                                        >
                                          {category}
                                        </SelectItem>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="mb-2 text-sm font-medium">
                                      Installation Materials
                                    </h4>
                                    <div className="space-y-1">
                                      {[
                                        ItemCategory.CONDUIT,
                                        ItemCategory.CABLE_TRAY,
                                        ItemCategory.DUCTING,
                                        ItemCategory.EARTHING_ROD,
                                      ].map((category) => (
                                        <SelectItem
                                          key={category}
                                          value={category}
                                        >
                                          {category}
                                        </SelectItem>
                                      ))}
                                    </div>

                                    <h4 className="mt-4 mb-2 text-sm font-medium">
                                      Hardware & Accessories
                                    </h4>
                                    <div className="space-y-1">
                                      {[
                                        ItemCategory.CONNECTOR,
                                        ItemCategory.BREAKER,
                                        ItemCategory.CABLE_LUG,
                                        ItemCategory.INSULATION,
                                        ItemCategory.MOUNTING_HARDWARE,
                                      ].map((category) => (
                                        <SelectItem
                                          key={category}
                                          value={category}
                                        >
                                          {category}
                                        </SelectItem>
                                      ))}
                                    </div>

                                    <h4 className="mt-4 mb-2 text-sm font-medium">
                                      Other Categories
                                    </h4>
                                    <div className="space-y-1">
                                      {[
                                        ItemCategory.SPARE_PART,
                                        ItemCategory.CONSUMABLE,
                                        ItemCategory.OTHER,
                                      ].map((category) => (
                                        <SelectItem
                                          key={category}
                                          value={category}
                                        >
                                          {category}
                                        </SelectItem>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FormField>

                      <FormField
                        label="Unit of Measure"
                        htmlFor="unitOfMeasure"
                        required
                        tooltip="The unit used to measure this item"
                        error={errors.unitOfMeasure?.message}
                      >
                        <Controller
                          control={control}
                          name="unitOfMeasure"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isReadOnly}
                            >
                              <SelectTrigger id="unitOfMeasure">
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                              <SelectContent className="max-h-80">
                                <div className="grid grid-cols-2 gap-2 p-2">
                                  <div>
                                    <h4 className="mb-2 text-sm font-medium">
                                      Quantity Units
                                    </h4>
                                    <div className="space-y-1">
                                      {[
                                        UnitOfMeasure.PIECES,
                                        UnitOfMeasure.SETS,
                                        UnitOfMeasure.UNITS,
                                      ].map((unit) => (
                                        <SelectItem key={unit} value={unit}>
                                          {unit}
                                        </SelectItem>
                                      ))}
                                    </div>

                                    <h4 className="mt-4 mb-2 text-sm font-medium">
                                      Length Units
                                    </h4>
                                    <div className="space-y-1">
                                      {[
                                        UnitOfMeasure.METERS,
                                        UnitOfMeasure.KILOMETERS,
                                        UnitOfMeasure.FEET,
                                      ].map((unit) => (
                                        <SelectItem key={unit} value={unit}>
                                          {unit}
                                        </SelectItem>
                                      ))}
                                    </div>

                                    <h4 className="mt-4 mb-2 text-sm font-medium">
                                      Area & Volume
                                    </h4>
                                    <div className="space-y-1">
                                      {[
                                        UnitOfMeasure.SQUARE_METERS,
                                        UnitOfMeasure.SQUARE_FEET,
                                        UnitOfMeasure.CUBIC_METERS,
                                        UnitOfMeasure.CUBIC_FEET,
                                        UnitOfMeasure.LITERS,
                                      ].map((unit) => (
                                        <SelectItem key={unit} value={unit}>
                                          {unit}
                                        </SelectItem>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="mb-2 text-sm font-medium">
                                      Weight Units
                                    </h4>
                                    <div className="space-y-1">
                                      {[
                                        UnitOfMeasure.KILOGRAMS,
                                        UnitOfMeasure.TONNES,
                                        UnitOfMeasure.POUNDS,
                                      ].map((unit) => (
                                        <SelectItem key={unit} value={unit}>
                                          {unit}
                                        </SelectItem>
                                      ))}
                                    </div>

                                    <h4 className="mt-4 mb-2 text-sm font-medium">
                                      Power Units
                                    </h4>
                                    <div className="space-y-1">
                                      {[
                                        UnitOfMeasure.KILOWATTS,
                                        UnitOfMeasure.KWP,
                                        UnitOfMeasure.KVA,
                                        UnitOfMeasure.AMPERE_HOURS,
                                        UnitOfMeasure.WATTS,
                                        UnitOfMeasure.VOLTS,
                                      ].map((unit) => (
                                        <SelectItem key={unit} value={unit}>
                                          {unit}
                                        </SelectItem>
                                      ))}
                                    </div>

                                    <h4 className="mt-4 mb-2 text-sm font-medium">
                                      Other Units
                                    </h4>
                                    <div className="space-y-1">
                                      {[
                                        UnitOfMeasure.HOURS,
                                        UnitOfMeasure.DAYS,
                                        UnitOfMeasure.MANHOURS,
                                        UnitOfMeasure.ROLLS,
                                        UnitOfMeasure.BOXES,
                                        UnitOfMeasure.PACKETS,
                                      ].map((unit) => (
                                        <SelectItem key={unit} value={unit}>
                                          {unit}
                                        </SelectItem>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        label="Manufacturer"
                        htmlFor="manufacturer"
                        tooltip="The manufacturer or brand of this item"
                        error={errors.manufacturer?.message}
                      >
                        <Input
                          id="manufacturer"
                          placeholder="e.g., Schneider Electric"
                          {...register("manufacturer")}
                          disabled={isReadOnly}
                        />
                      </FormField>

                      <FormField
                        label="Model Number"
                        htmlFor="modelNumber"
                        tooltip="The specific model number from the manufacturer"
                        error={errors.modelNumber?.message}
                      >
                        <Input
                          id="modelNumber"
                          placeholder="e.g., NSX100F-63A"
                          {...register("modelNumber")}
                          disabled={isReadOnly}
                        />
                      </FormField>

                      <FormField
                        label="Condition"
                        htmlFor="condition"
                        tooltip="The current condition of the item"
                        error={errors.condition?.message}
                      >
                        <Controller
                          control={control}
                          name="condition"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isReadOnly}
                            >
                              <SelectTrigger id="condition">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(ItemCondition).map(
                                  (condition) => (
                                    <SelectItem
                                      key={condition}
                                      value={condition}
                                    >
                                      {condition}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FormField>
                    </div>

                    <FormField
                      label="Supplier"
                      htmlFor="supplier"
                      tooltip="The supplier for this item (optional)"
                      error={errors.supplier?.message}
                    >
                      <Controller
                        control={control}
                        name="supplier"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isReadOnly}
                          >
                            <SelectTrigger id="supplier">
                              <SelectValue placeholder="Select supplier (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              {suppliers.map((supplier) => (
                                <SelectItem
                                  key={supplier._id}
                                  value={supplier.companyName}
                                >
                                  {supplier.companyName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <FormField
                        label="Standard Cost"
                        htmlFor="standardCost"
                        tooltip="The standard cost price for this item"
                        error={errors.pricing?.standardCost?.message}
                      >
                        <Input
                          id="standardCost"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          {...register("pricing.standardCost", {
                            valueAsNumber: true,
                          })}
                          disabled={isReadOnly}
                        />
                      </FormField>

                      <FormField
                        label="Last Purchase Price"
                        htmlFor="lastPurchasePrice"
                        tooltip="The last purchase price for this item"
                        error={errors.pricing?.lastPurchasePrice?.message}
                      >
                        <Input
                          id="lastPurchasePrice"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          {...register("pricing.lastPurchasePrice", {
                            valueAsNumber: true,
                          })}
                          disabled={isReadOnly}
                        />
                      </FormField>

                      <FormField
                        label="Selling Price"
                        htmlFor="sellingPrice"
                        tooltip="The selling price for this item"
                        error={errors.pricing?.sellingPrice?.message}
                      >
                        <Input
                          id="sellingPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          {...register("pricing.sellingPrice", {
                            valueAsNumber: true,
                          })}
                          disabled={isReadOnly}
                        />
                      </FormField>

                      <FormField
                        label="Currency"
                        htmlFor="currency"
                        tooltip="The currency for pricing"
                        error={errors.pricing?.currency?.message}
                      >
                        <Controller
                          control={control}
                          name="pricing.currency"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isReadOnly}
                            >
                              <SelectTrigger id="currency">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="KES">KES</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FormField>
                    </div>
                  </TabsContent>

                  <TabsContent value="stock" className="space-y-6 mt-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">
                          Stock Levels by Location
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Configure stock levels for each warehouse location
                        </p>
                      </div>
                      {!isReadOnly && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addStockLevel}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Location
                        </Button>
                      )}
                    </div>

                    {fields.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                        <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                          No stock locations added
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Add at least one warehouse location
                        </p>
                      </div>
                    )}

                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <Card key={field.id} className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">
                              Location {index + 1}
                            </h4>
                            {!isReadOnly && fields.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField
                              label="Warehouse"
                              htmlFor={`stockLevels.${index}.location`}
                              required
                              tooltip="Select the warehouse location for this stock level"
                              error={
                                errors.stockLevels?.[index]?.location?.message
                              }
                              className="md:col-span-2 lg:col-span-3"
                            >
                              <Controller
                                control={control}
                                name={`stockLevels.${index}.location`}
                                render={({ field }) => (
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={isReadOnly}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select warehouse" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {warehouses.map((warehouse) => (
                                        <SelectItem
                                          key={warehouse._id}
                                          value={warehouse._id}
                                        >
                                          {warehouse.name} - {warehouse.city}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </FormField>

                            <FormField
                              label="Current Stock"
                              htmlFor={`stockLevels.${index}.currentStock`}
                              tooltip="The current quantity in stock at this location"
                              error={
                                errors.stockLevels?.[index]?.currentStock
                                  ?.message
                              }
                            >
                              <Input
                                type="number"
                                min="0"
                                {...register(
                                  `stockLevels.${index}.currentStock`,
                                  { valueAsNumber: true }
                                )}
                                disabled={isReadOnly}
                              />
                            </FormField>

                            <FormField
                              label="Minimum Level"
                              htmlFor={`stockLevels.${index}.minimumLevel`}
                              tooltip="The minimum stock level before reordering"
                              error={
                                errors.stockLevels?.[index]?.minimumLevel
                                  ?.message
                              }
                            >
                              <Input
                                type="number"
                                min="0"
                                {...register(
                                  `stockLevels.${index}.minimumLevel`,
                                  { valueAsNumber: true }
                                )}
                                disabled={isReadOnly}
                              />
                            </FormField>

                            <FormField
                              label="Maximum Level"
                              htmlFor={`stockLevels.${index}.maximumLevel`}
                              tooltip="The maximum stock level for this location"
                              error={
                                errors.stockLevels?.[index]?.maximumLevel
                                  ?.message
                              }
                            >
                              <Input
                                type="number"
                                min="0"
                                {...register(
                                  `stockLevels.${index}.maximumLevel`,
                                  { valueAsNumber: true }
                                )}
                                disabled={isReadOnly}
                              />
                            </FormField>

                            <FormField
                              label="Reorder Point"
                              htmlFor={`stockLevels.${index}.reorderPoint`}
                              tooltip="The stock level at which to trigger reordering"
                              error={
                                errors.stockLevels?.[index]?.reorderPoint
                                  ?.message
                              }
                            >
                              <Input
                                type="number"
                                min="0"
                                {...register(
                                  `stockLevels.${index}.reorderPoint`,
                                  { valueAsNumber: true }
                                )}
                                disabled={isReadOnly}
                              />
                            </FormField>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="technical" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Technical Specifications
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Add technical specifications for this item (all fields
                        are optional)
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Power Rating"
                        htmlFor="powerRating"
                        tooltip="Power rating for electrical items (e.g., 50kW)"
                        error={errors.technicalSpecs?.powerRating?.message}
                      >
                        <Input
                          id="powerRating"
                          placeholder="e.g., 50kW"
                          {...register("technicalSpecs.powerRating")}
                          disabled={isReadOnly}
                        />
                      </FormField>

                      <FormField
                        label="Voltage"
                        htmlFor="voltage"
                        tooltip="Voltage rating (e.g., 415V AC)"
                        error={errors.technicalSpecs?.voltage?.message}
                      >
                        <Input
                          id="voltage"
                          placeholder="e.g., 415V AC"
                          {...register("technicalSpecs.voltage")}
                          disabled={isReadOnly}
                        />
                      </FormField>

                      <FormField
                        label="Current"
                        htmlFor="current"
                        tooltip="Current rating (e.g., 75A)"
                        error={errors.technicalSpecs?.current?.message}
                      >
                        <Input
                          id="current"
                          placeholder="e.g., 75A"
                          {...register("technicalSpecs.current")}
                          disabled={isReadOnly}
                        />
                      </FormField>

                      <FormField
                        label="Frequency"
                        htmlFor="frequency"
                        tooltip="Frequency rating (e.g., 50Hz)"
                        error={errors.technicalSpecs?.frequency?.message}
                      >
                        <Input
                          id="frequency"
                          placeholder="e.g., 50Hz"
                          {...register("technicalSpecs.frequency")}
                          disabled={isReadOnly}
                        />
                      </FormField>

                      <FormField
                        label="Dimensions"
                        htmlFor="dimensions"
                        tooltip="Physical dimensions (L x W x H)"
                        error={errors.technicalSpecs?.dimensions?.message}
                      >
                        <Input
                          id="dimensions"
                          placeholder="e.g., 600mm x 400mm x 200mm"
                          {...register("technicalSpecs.dimensions")}
                          disabled={isReadOnly}
                        />
                      </FormField>

                      <FormField
                        label="Weight"
                        htmlFor="weight"
                        tooltip="Weight of the item"
                        error={errors.technicalSpecs?.weight?.message}
                      >
                        <Input
                          id="weight"
                          placeholder="e.g., 25kg"
                          {...register("technicalSpecs.weight")}
                          disabled={isReadOnly}
                        />
                      </FormField>

                      <FormField
                        label="Temperature Range"
                        htmlFor="temperatureRange"
                        tooltip="Operating temperature range"
                        error={errors.technicalSpecs?.temperatureRange?.message}
                      >
                        <Input
                          id="temperatureRange"
                          placeholder="e.g., -10°C to +50°C"
                          {...register("technicalSpecs.temperatureRange")}
                          disabled={isReadOnly}
                        />
                      </FormField>

                      <FormField
                        label="IP Rating"
                        htmlFor="ipRating"
                        tooltip="Ingress Protection rating for outdoor equipment"
                        error={errors.technicalSpecs?.ipRating?.message}
                      >
                        <Input
                          id="ipRating"
                          placeholder="e.g., IP65"
                          {...register("technicalSpecs.ipRating")}
                          disabled={isReadOnly}
                        />
                      </FormField>

                      <FormField
                        label="Efficiency"
                        htmlFor="efficiency"
                        tooltip="Efficiency rating"
                        error={errors.technicalSpecs?.efficiency?.message}
                      >
                        <Input
                          id="efficiency"
                          placeholder="e.g., 95%"
                          {...register("technicalSpecs.efficiency")}
                          disabled={isReadOnly}
                        />
                      </FormField>

                      <FormField
                        label="Cross Section"
                        htmlFor="crossSection"
                        tooltip="Cable cross-section for cables"
                        error={errors.technicalSpecs?.crossSection?.message}
                      >
                        <Input
                          id="crossSection"
                          placeholder="e.g., 16mm²"
                          {...register("technicalSpecs.crossSection")}
                          disabled={isReadOnly}
                        />
                      </FormField>

                      <FormField
                        label="Material"
                        htmlFor="material"
                        tooltip="Material composition"
                        error={errors.technicalSpecs?.material?.message}
                      >
                        <Input
                          id="material"
                          placeholder="e.g., Copper, PVC insulated"
                          {...register("technicalSpecs.material")}
                          disabled={isReadOnly}
                        />
                      </FormField>

                      <FormField
                        label="Color"
                        htmlFor="color"
                        tooltip="Color or finish"
                        error={errors.technicalSpecs?.color?.message}
                      >
                        <Input
                          id="color"
                          placeholder="e.g., RAL 7035 Light Grey"
                          {...register("technicalSpecs.color")}
                          disabled={isReadOnly}
                        />
                      </FormField>
                    </div>
                  </TabsContent>

                  <TabsContent value="additional" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Additional Information
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Additional details and settings for this item
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Shelf Life (Days)"
                        htmlFor="shelfLifeDays"
                        tooltip="Shelf life in days for items with expiry"
                        error={errors.shelfLifeDays?.message}
                      >
                        <Input
                          id="shelfLifeDays"
                          type="number"
                          min="0"
                          {...register("shelfLifeDays", {
                            valueAsNumber: true,
                          })}
                          disabled={isReadOnly}
                        />
                      </FormField>

                      <FormField
                        label="Warranty (Months)"
                        htmlFor="warrantyMonths"
                        tooltip="Warranty period in months"
                        error={errors.warrantyMonths?.message}
                      >
                        <Input
                          id="warrantyMonths"
                          type="number"
                          min="0"
                          {...register("warrantyMonths", {
                            valueAsNumber: true,
                          })}
                          disabled={isReadOnly}
                        />
                      </FormField>
                    </div>

                    <FormField
                      label="Storage Requirements"
                      htmlFor="storageRequirements"
                      tooltip="Special storage conditions or requirements"
                      error={errors.storageRequirements?.message}
                    >
                      <Textarea
                        id="storageRequirements"
                        placeholder="e.g., Store in dry place, temperature 5-35°C, protect from moisture"
                        className="min-h-20"
                        {...register("storageRequirements")}
                        disabled={isReadOnly}
                      />
                    </FormField>

                    <FormField
                      label="Safety Information"
                      htmlFor="safetyInfo"
                      tooltip="Safety precautions and warnings"
                      error={errors.safetyInfo?.message}
                    >
                      <Textarea
                        id="safetyInfo"
                        placeholder="e.g., Electrical hazard - handle with appropriate PPE"
                        className="min-h-20"
                        {...register("safetyInfo")}
                        disabled={isReadOnly}
                      />
                    </FormField>

                    <FormField
                      label="Notes"
                      htmlFor="notes"
                      tooltip="Additional notes or comments"
                      error={errors.notes?.message}
                    >
                      <Textarea
                        id="notes"
                        placeholder="Additional notes about this item..."
                        className="min-h-20"
                        {...register("notes")}
                        disabled={isReadOnly}
                      />
                    </FormField>

                    <Separator />

                    <div>
                      <h4 className="text-base font-medium mb-4">
                        Item Properties
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Controller
                            control={control}
                            name="isActive"
                            render={({ field }) => (
                              <Checkbox
                                id="isActive"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isReadOnly}
                              />
                            )}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="isActive"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Active Item
                            </label>
                            <p className="text-xs text-muted-foreground">
                              Whether this item is currently active in the
                              system
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Controller
                            control={control}
                            name="isSerialized"
                            render={({ field }) => (
                              <Checkbox
                                id="isSerialized"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isReadOnly}
                              />
                            )}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="isSerialized"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Serialized Item
                            </label>
                            <p className="text-xs text-muted-foreground">
                              Whether this item is tracked individually by
                              serial number
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Controller
                            control={control}
                            name="isService"
                            render={({ field }) => (
                              <Checkbox
                                id="isService"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isReadOnly}
                              />
                            )}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="isService"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Service Item
                            </label>
                            <p className="text-xs text-muted-foreground">
                              Whether this is a service rather than a physical
                              item
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Controller
                            control={control}
                            name="isConsumable"
                            render={({ field }) => (
                              <Checkbox
                                id="isConsumable"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isReadOnly}
                              />
                            )}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="isConsumable"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Consumable Item
                            </label>
                            <p className="text-xs text-muted-foreground">
                              Whether this item is consumed during use
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            <DrawerFooter className="px-6">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {Object.keys(errors).length > 0 && (
                    <>
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span>
                        {Object.keys(errors).length} validation error(s)
                      </span>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>

                  {mode !== "view" && (
                    <Button
                      type="submit"
                      disabled={saving || !isValid}
                      className="min-w-24"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {mode === "create" ? "Create Item" : "Update Item"}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
