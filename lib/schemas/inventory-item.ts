import { z } from "zod";

// Enums
export enum ItemCategory {
  // Power & Energy Systems
  GENERATOR = "Generator",
  RECTIFIER = "Rectifier System",
  INVERTER = "Inverter",
  BATTERY = "Battery",
  BATTERY_CABINET = "Battery Cabinet",

  // Solar & Renewable Energy
  SOLAR_PANEL = "Solar Panel",
  PV_CONTROLLER = "PV Controller",
  SOLAR_STRUCTURE = "Solar Structure",
  SOLAR_SYSTEM = "Solar PV System",

  // Cables & Electrical
  POWER_CABLE = "Power Cable",
  CONTROL_CABLE = "Control Cable",
  FLEX_CABLE = "Flex Cable",
  EARTHING_CABLE = "Earthing Cable",

  // Installation Materials
  CONDUIT = "Conduit",
  CABLE_TRAY = "Cable Tray",
  DUCTING = "Ducting",
  EARTHING_ROD = "Earthing Rod",

  // Hardware & Accessories
  CONNECTOR = "Connector",
  BREAKER = "Circuit Breaker",
  CABLE_LUG = "Cable Lug",
  INSULATION = "Insulation Material",
  MOUNTING_HARDWARE = "Mounting Hardware",

  // Construction Materials
  CONCRETE = "Concrete",
  EXCAVATION = "Excavation Work",
  SLAB_WORK = "Slab Work",

  // Tools & Equipment
  INSTALLATION_TOOL = "Installation Tool",
  TESTING_EQUIPMENT = "Testing Equipment",

  // Services
  INSTALLATION_SERVICE = "Installation Service",
  COMMISSIONING_SERVICE = "Commissioning Service",
  MAINTENANCE_SERVICE = "Maintenance Service",

  SPARE_PART = "Spare Part",
  CONSUMABLE = "Consumable",
  OTHER = "Other",
}

export enum UnitOfMeasure {
  // Quantity Units
  PIECES = "Pcs",
  SETS = "Sets",
  UNITS = "Units",

  // Length Units
  METERS = "Meters",
  KILOMETERS = "Kilometers",
  FEET = "Feet",

  // Area Units
  SQUARE_METERS = "M²",
  SQUARE_FEET = "Ft²",

  // Volume Units
  CUBIC_METERS = "M³",
  CUBIC_FEET = "Ft³",
  LITERS = "Liters",

  // Weight Units
  KILOGRAMS = "Kg",
  TONNES = "Tonnes",
  POUNDS = "Lbs",

  // Power Units
  KILOWATTS = "kW",
  KWP = "KWp",
  KVA = "kVA",
  AMPERE_HOURS = "AH",
  WATTS = "W",
  VOLTS = "V",

  // Service Units
  HOURS = "Hours",
  DAYS = "Days",
  MANHOURS = "Man-hours",

  // Others
  ROLLS = "Rolls",
  BOXES = "Boxes",
  PACKETS = "Packets",
}

export enum StockStatus {
  IN_STOCK = "In Stock",
  LOW_STOCK = "Low Stock",
  OUT_OF_STOCK = "Out of Stock",
  ON_ORDER = "On Order",
  DISCONTINUED = "Discontinued",
  QUARANTINED = "Quarantined",
}

export enum ItemCondition {
  NEW = "New",
  REFURBISHED = "Refurbished",
  USED_GOOD = "Used - Good",
  USED_FAIR = "Used - Fair",
  DAMAGED = "Damaged",
  FOR_REPAIR = "For Repair",
}

// Zod schemas
export const stockLevelSchema = z.object({
  location: z.string().min(1, "Location is required"),
  currentStock: z.number().min(0, "Stock cannot be negative"),
  reservedStock: z
    .number()
    .min(0, "Reserved stock cannot be negative")
    .optional()
    .default(0),
  availableStock: z
    .number()
    .min(0, "Available stock cannot be negative")
    .optional()
    .default(0),
  minimumLevel: z.number().min(0, "Minimum level cannot be negative"),
  maximumLevel: z
    .number()
    .min(0, "Maximum level cannot be negative")
    .optional(),
  reorderPoint: z.number().min(0, "Reorder point cannot be negative"),
});

export const pricingInfoSchema = z.object({
  standardCost: z.number().min(0, "Cost cannot be negative"),
  lastPurchasePrice: z.number().min(0, "Price cannot be negative"),
  sellingPrice: z.number().min(0, "Price cannot be negative").optional(),
  currency: z.string().default("KES"),
});

export const technicalSpecsSchema = z.object({
  powerRating: z.string().optional(),
  voltage: z.string().optional(),
  current: z.string().optional(),
  frequency: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  temperatureRange: z.string().optional(),
  ipRating: z.string().optional(),
  efficiency: z.string().optional(),
  crossSection: z.string().optional(),
  material: z.string().optional(),
  color: z.string().optional(),
  additionalSpecs: z.record(z.string()).optional(),
});

export const inventoryItemSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  itemCode: z.string().min(1, "Item code is required"),
  alternativeCodes: z.array(z.string()).optional().default([]),
  description: z.string().optional(),
  category: z.nativeEnum(ItemCategory, {
    errorMap: () => ({ message: "Category is required" }),
  }),
  unitOfMeasure: z.nativeEnum(UnitOfMeasure, {
    errorMap: () => ({ message: "Unit of measure is required" }),
  }),
  manufacturer: z.string().optional(),
  modelNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  batchNumber: z.string().optional(),
  condition: z.nativeEnum(ItemCondition).default(ItemCondition.NEW),
  technicalSpecs: technicalSpecsSchema.optional(),
  supplier: z.string().optional(),
  stockLevels: z
    .array(stockLevelSchema)
    .min(1, "At least one stock location is required"),
  pricing: pricingInfoSchema.optional(),
  stockStatus: z.nativeEnum(StockStatus).default(StockStatus.IN_STOCK),
  isActive: z.boolean().default(true),
  isSerialized: z.boolean().default(false),
  isService: z.boolean().default(false),
  isConsumable: z.boolean().default(false),
  shelfLifeDays: z.number().min(0).optional(),
  warrantyMonths: z.number().min(0).optional(),
  storageRequirements: z.string().optional(),
  safetyInfo: z.string().optional(),
  imageUrls: z.array(z.string()).optional().default([]),
  attachments: z.array(z.string()).optional().default([]),
  qrCode: z.string().optional(),
  barcode: z.string().optional(),
  notes: z.string().optional(),
  _id: z.string().optional(),
});

export type StockLevel = z.infer<typeof stockLevelSchema>;
export type PricingInfo = z.infer<typeof pricingInfoSchema>;
export type TechnicalSpecs = z.infer<typeof technicalSpecsSchema>;
export type InventoryItem = z.infer<typeof inventoryItemSchema>;
