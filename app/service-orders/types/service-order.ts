export interface ContactInfo {
  name: string;
  telephone: string;
  email: string;
  physicalAddress: string;
}

export interface LocationInfo {
  region: string;
  subRegion: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface SiteDetails {
  siteId: string;
  siteType?: string;
  siteClassification?: string;
}

export interface BillOfMaterialsItem {
  item: string;
  specs: string;
  unitOfMeasure: string;
  quantity: number;
  rate?: number;
  total?: number;
  notes?: string;
}

export interface ApprovalInfo {
  approvedBy: string;
  approvedDate: string;
  approvalComments?: string;
}

export interface ServiceOrder {
  _id: string;
  issuedBy: string;
  issuedTo: string;
  serviceOrderDate: string;
  contactInfo: ContactInfo;
  locationInfo: LocationInfo;
  siteDetails: SiteDetails;
  designSummary: Record<string, any>;
  billOfMaterials: BillOfMaterialsItem[];
  status?: string;
  totalValue?: number;
  comments?: string;
  approval?: ApprovalInfo;
  createdAt: string;
  updatedAt: string;
}
