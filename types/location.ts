export interface Location {
  _id: string;
  name: string;
  county: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  siteType: 'outdoor' | 'indoor' | 'rooftop' | 'ground';
  siteId: string;
  systemSiteId: string;
  status: 'active' | 'inactive' | 'maintenance' | 'pending';
}

export interface LocationStats {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
  counties: number;
  outdoorSites: number;
  indoorSites: number;
}
