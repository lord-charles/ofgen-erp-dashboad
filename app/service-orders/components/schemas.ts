import { z } from "zod"

const contactInfoSchema = z.object({
  name: z.string().min(1, "Contact name is required"),
  telephone: z.string().min(1, "Telephone is required"),
  email: z.string().email("Invalid email address"),
  physicalAddress: z.string().min(1, "Physical address is required"),
})

const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90, "Invalid latitude"),
  longitude: z.number().min(-180).max(180, "Invalid longitude"),
})

const locationInfoSchema = z.object({
  region: z.string().min(1, "Region is required"),
  subRegion: z.string().min(1, "Sub region is required"),
  coordinates: coordinatesSchema,
})

const siteDetailsSchema = z.object({
  siteId: z.string().min(1, "Site ID is required"),
  siteType: z.string().optional(),
  siteClassification: z.string().optional(),
})

const billOfMaterialsItemSchema = z.object({
  item: z.string().min(1, "Item name is required"),
  specs: z.string().min(1, "Specifications are required"),
  unitOfMeasure: z.string().min(1, "Unit of measure is required"),
  quantity: z.number().min(0, "Quantity must be positive"),
  rate: z.number().min(0, "Rate must be positive").optional(),
  total: z.number().min(0, "Total must be positive").optional(),
  notes: z.string().optional(),
})

const approvalSchema = z.object({
  approvedBy: z.string().min(1, "Approved by is required"),
  approvedDate: z.string().min(1, "Approval date is required"),
  approvalComments: z.string().optional(),
})

export const serviceOrderSchema = z.object({
  issuedBy: z.string().min(1, "Issued by is required"),
  issuedTo: z.string().min(1, "Issued to is required"),
  serviceOrderDate: z.string().min(1, "Service order date is required"),
  contactInfo: contactInfoSchema,
  locationInfo: locationInfoSchema,
  siteDetails: siteDetailsSchema,
  designSummary: z.record(z.string(), z.any()).default({}),
  billOfMaterials: z.array(billOfMaterialsItemSchema).default([]),
  status: z.enum(["draft", "pending", "approved", "rejected", "completed"]).default("draft"),
  totalValue: z.number().min(0, "Total value must be positive").optional(),
  comments: z.string().optional(),
  approval: approvalSchema.optional(),
})

export type ServiceOrderFormData = z.infer<typeof serviceOrderSchema>
export type BillOfMaterialsItem = z.infer<typeof billOfMaterialsItemSchema>
export type DesignSummaryField = { key: string; value: string }
