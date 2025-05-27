"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Package } from "lucide-react"
import type { BillOfMaterialsItem } from "../types/service-order"

interface BillOfMaterialsSectionProps {
  items: BillOfMaterialsItem[]
  onChange: (items: BillOfMaterialsItem[]) => void
}

export function BillOfMaterialsSection({ items, onChange }: BillOfMaterialsSectionProps) {
  const addItem = () => {
    const newItem: BillOfMaterialsItem = {
      item: "",
      specs: "",
      unitOfMeasure: "",
      quantity: 0,
      rate: undefined,
      total: undefined,
      notes: "",
    }
    onChange([...items, newItem])
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onChange(newItems)
  }

  const updateItem = (index: number, field: keyof BillOfMaterialsItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Auto-calculate total if rate and quantity are provided
    if (field === "rate" || field === "quantity") {
      const item = newItems[index]
      if (item.rate && item.quantity) {
        newItems[index].total = item.rate * item.quantity
      }
    }

    onChange(newItems)
  }

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
                    <Input
                      placeholder="Enter item name"
                      value={item.item}
                      onChange={(e) => updateItem(index, "item", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Specifications *</Label>
                    <Input
                      placeholder="Enter specifications"
                      value={item.specs}
                      onChange={(e) => updateItem(index, "specs", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Unit of Measure *</Label>
                    <Input
                      placeholder="e.g., Pcs, Kg, Meters"
                      value={item.unitOfMeasure}
                      onChange={(e) => updateItem(index, "unitOfMeasure", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={item.quantity || ""}
                      onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Rate per Unit (KES)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={item.rate || ""}
                      onChange={(e) => updateItem(index, "rate", Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Total (KES)</Label>
                    <Input
                      type="number"
                      placeholder="Auto-calculated"
                      value={item.total || ""}
                      onChange={(e) => updateItem(index, "total", Number(e.target.value))}
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Additional notes for this item"
                    value={item.notes || ""}
                    onChange={(e) => updateItem(index, "notes", e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  )
}
