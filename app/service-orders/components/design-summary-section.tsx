"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Settings } from "lucide-react"
import { DesignSummaryField } from "./schemas"

interface DesignSummarySectionProps {
  designSummary: Record<string, any>
  onChange: (designSummary: Record<string, any>) => void
}

export function DesignSummarySection({ designSummary, onChange }: DesignSummarySectionProps) {
  const [fields, setFields] = useState<DesignSummaryField[]>(() => {
    return Object.entries(designSummary).map(([key, value]) => ({
      key,
      value: String(value),
    }))
  })

  const addField = () => {
    const newFields = [...fields, { key: "", value: "" }]
    setFields(newFields)
  }

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index)
    setFields(newFields)
    updateDesignSummary(newFields)
  }

  const updateField = (index: number, field: "key" | "value", value: string) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], [field]: value }
    setFields(newFields)
    updateDesignSummary(newFields)
  }

  const updateDesignSummary = (currentFields: DesignSummaryField[]) => {
    const summary: Record<string, any> = {}
    currentFields.forEach((field) => {
      if (field.key.trim()) {
        summary[field.key.trim()] = field.value
      }
    })
    onChange(summary)
  }

  // Common design summary fields for quick add
  const commonFields = [
    "Existing Power Supply",
    "Daily Energy Demand",
    "Solar Capacity",
    "Battery Capacity",
    "Rectifier Capacity",
    "Solar Penetration",
    "Monthly Production",
    "Generator Comment",
  ]

  const addCommonField = (fieldName: string) => {
    const newFields = [...fields, { key: fieldName, value: "" }]
    setFields(newFields)
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-base">
            <Settings className="w-4 h-4 mr-2" />
            Design Summary
          </CardTitle>
          <div className="flex space-x-2">
            <Button type="button" variant="outline" size="sm" onClick={addField}>
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Add Common Fields */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Quick Add Common Fields</Label>
          <div className="flex flex-wrap gap-2">
            {commonFields.map((field) => (
              <Button
                key={field}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addCommonField(field)}
                className="text-xs"
              >
                {field}
              </Button>
            ))}
          </div>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No design summary fields added yet.</p>
            <p className="text-sm">Use quick add buttons or "Add Field" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <Card key={index} className="border-dashed">
                <CardContent className="pt-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-1 space-y-2">
                      <Label>Field Name</Label>
                      <Input
                        placeholder="Enter field name"
                        value={field.key}
                        onChange={(e) => updateField(index, "key", e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Value</Label>
                      <Input
                        placeholder="Enter value"
                        value={field.value}
                        onChange={(e) => updateField(index, "value", e.target.value)}
                      />
                    </div>
                    <div className="pt-6">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
