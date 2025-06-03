export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Warehouse {
  _id: string;
  name: string;
  address: string;
  city: string;
  county: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  _id: string;
  companyName: string;
  supplierType: string;
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  country: string;
  paymentTerms: string;
  rating: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockLevel {
  location: {
    _id: string;
    name: string;
    address: string;
    city: string;
  };
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minimumLevel: number;
  maximumLevel: number;
  reorderPoint: number;
}

export interface InventoryItem {
  _id: string;
  itemName: string;
  itemCode: string;
  alternativeCodes: string[];
  description: string;
  category: string;
  unitOfMeasure: string;
  manufacturer: string;
  modelNumber: string;
  serialNumber: string;
  batchNumber: string;
  condition: string;
  technicalSpecs: Record<string, any>;
  supplier: string;
  stockLevels: StockLevel[];
  pricing: {
    standardCost: number;
    lastPurchasePrice: number;
    sellingPrice: number;
    currency: string;
  };
  stockStatus: string;
  isActive: boolean;
  isSerialized: boolean;
  isService: boolean;
  isConsumable: boolean;
  shelfLifeDays: number;
  warrantyMonths: number;
  storageRequirements: string;
  safetyInfo: string;
  imageUrls: string[];
  attachments: string[];
  qrCode: string;
  barcode: string;
  notes: string;
  createdDate: string;
  lastModified: string;
  createdAt: string;
  updatedAt: string;
  totalStock: number;
  totalReserved: number;
  totalAvailable: number;
}
