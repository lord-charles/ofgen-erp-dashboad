"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Package, ChevronsUpDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { BillOfMaterialsItem } from "../types/service-order";
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

interface BillOfMaterialsSectionProps {
  items: BillOfMaterialsItem[];
  onChange: (items: BillOfMaterialsItem[]) => void;
  inventoryItems: InventoryItemFromAPI[];
}

const ComboboxSelect = ({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: { value: string; label: string }[];
  value: string | undefined;
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
            ? options.find((option) => option.value === value)?.label
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
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const selectedOption = options.find(
                      (opt) =>
                        opt.value.toLowerCase() === currentValue.toLowerCase()
                    );
                    if (selectedOption) {
                      onChange(
                        selectedOption.value === value
                          ? ""
                          : selectedOption.value
                      );
                    }
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

export function BillOfMaterialsSection({
  items,
  onChange,
  inventoryItems,
}: BillOfMaterialsSectionProps) {
  const addItem = () => {
    const newItem: BillOfMaterialsItem = {
      item: "",
      specs: "",
      unitOfMeasure: "",
      quantity: 0,
      rate: undefined,
      total: undefined,
      notes: "",
    };
    onChange([...items, newItem]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const updateItemField = (
    index: number,
    field: keyof BillOfMaterialsItem,
    value: any
  ) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;

    // Auto-calculate total if rate and quantity are provided
    if (field === "rate" || field === "quantity") {
      const item = newItems[index];
      if (typeof item.rate === "number" && typeof item.quantity === "number") {
        newItems[index].total = item.rate * item.quantity;
      } else {
        newItems[index].total = undefined;
      }
    }
    onChange(newItems);
  };

  const handleInventoryItemChange = (
    index: number,
    selectedInventoryItemId: string
  ) => {
    const selectedInvItem = inventoryItems.find(
      (inv) => inv._id === selectedInventoryItemId
    );
    const newItems = [...items];

    if (selectedInvItem) {
      newItems[index] = {
        ...newItems[index],
        item: selectedInvItem.itemName,
        specs:
          selectedInvItem.description ||
          selectedInvItem.technicalSpecs?.specifications ||
          "",
        unitOfMeasure: selectedInvItem.unitOfMeasure,
        rate:
          selectedInvItem.pricing?.sellingPrice ??
          selectedInvItem.pricing?.standardCost ??
          0,
      };
      // Recalculate total
      if (
        typeof newItems[index].rate === "number" &&
        typeof newItems[index].quantity === "number"
      ) {
        newItems[index].total =
          (newItems[index].rate as number) *
          (newItems[index].quantity as number);
      } else {
        newItems[index].total = undefined;
      }
    } else {
      newItems[index] = {
        ...newItems[index],
        item: "",
        specs: "",
        unitOfMeasure: "",
        rate: undefined,
        total: undefined,
      };
    }
    onChange(newItems);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-base">
            <Package className="w-4 h-4 mr-2" />
            Bill of Materials
          </CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No items added yet. Click "Add Item" to get started.</p>
          </div>
        ) : (
          items.map((item, index) => (
            <Card key={index} className="border-dashed">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-sm font-medium">Item {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Item Name *</Label>
                    <ComboboxSelect
                      options={inventoryItems.map((invItem) => ({
                        value: invItem._id,
                        label: `${invItem.itemName} (${invItem.itemCode})`,
                      }))}
                      value={item.item}
                      onChange={(selectedValue) =>
                        handleInventoryItemChange(index, selectedValue)
                      }
                      placeholder="Select an inventory item"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Specifications *</Label>
                    <Input
                      placeholder="Auto-filled or enter specifications"
                      value={item.specs}
                      onChange={(e) =>
                        updateItemField(index, "specs", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Unit of Measure *</Label>
                    <Input
                      placeholder="Auto-filled or e.g., Pcs, Kg"
                      value={item.unitOfMeasure}
                      onChange={(e) =>
                        updateItemField(index, "unitOfMeasure", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        updateItemField(
                          index,
                          "quantity",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Rate per Unit (KES)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={item.rate || ""}
                      onChange={(e) =>
                        updateItemField(index, "rate", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Total (KES)</Label>
                    <Input
                      type="number"
                      placeholder="Auto-calculated"
                      value={item.total || ""}
                      readOnly // Total should be read-only
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Additional notes for this item"
                    value={item.notes || ""}
                    onChange={(e) =>
                      updateItemField(index, "notes", e.target.value)
                    }
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}
