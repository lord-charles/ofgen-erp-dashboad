"use server";

import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PaginatedResponse } from "./employees.service";

export interface ProjectTask {
  name: string;
  description: string;
  assignedSubcontractor: string;
  status: string;
  priority: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  progress: number;
  notes?: string;
}

export interface ProjectMilestone {
  name: string;
  description: string;
  dueDate: string;
  completedDate?: string;
  progress: number;
  tasks: ProjectTask[];
  deliverables: string[];
}

export interface ProjectRisk {
  title: string;
  description: string;
  severity: string;
  probability: number;
  impact: number;
  mitigationPlan: string;
  owner: string;
  status: string;
  identifiedDate: string;
  targetResolutionDate: string;
  notes?: string;
}

export interface ProjectLeader {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  status: string;
  dateOfBirth: string;
  roles: string[];
  employeeId: string;
  position: string;
  employmentEndDate?: string;
  employmentType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subcontractor {
  isCompany: boolean;
  email: string;
  phone: string;
  address: string;
  companyName?: string;
  registrationNumber?: string;
  taxPin?: string;
  contactPerson?: string;
  firstName?: string;
  lastName?: string;
  nationalId?: string;
  specialty?: string;
  skills?: string[];
  isActive: boolean;
  notes?: string;
}

export interface LocationCoordinates {
  lat?: number;
  lng?: number;
}

export interface Location {
  _id: string;
  name: string;
  county?: string;
  address?: string;
  coordinates?: LocationCoordinates;
  siteType?: string;
  siteId?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  systemSiteId?: string;
  __v?: number;
}

export interface ContactInfo {
  name?: string;
  telephone?: string;
  email?: string;
  physicalAddress?: string;
  _id?: string;
}

export interface ServiceOrderLocationInfo {
  region?: string;
  subRegion?: string;
  coordinates?: { latitude: number; longitude: number; _id?: string };
  _id?: string;
}

export interface SiteDetails {
  siteId?: string;
  siteType?: string;
  siteClassification?: string;
  _id?: string;
}

export interface ServiceOrder {
  _id: string;
  issuedBy?: string;
  issuedTo?: string;
  serviceOrderDate?: string;
  contactInfo?: ContactInfo;
  locationInfo?: ServiceOrderLocationInfo;
  siteDetails?: SiteDetails;
  designSummary?: any;
  billOfMaterials?: any[];
  status?: string;
  totalValue?: number;
  comments?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Project {
  _id: string;
  name: string;
  serviceOrder: ServiceOrder;
  projectLeader: ProjectLeader;
  subcontractors: Subcontractor[];
  location: Location;
  capacity: string;
  projectType: string;
  status: string;
  plannedStartDate: string;
  targetCompletionDate: string;
  actualStartDate?: string;
  actualCompletionDate?: string;
  progress: number;
  milestones: ProjectMilestone[];
  risks: ProjectRisk[];
  priority: string;
  contractValue: number;
  description: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  serviceOrder: ServiceOrder;
  projectLeader: ProjectLeader;
  subcontractors: Subcontractor[];
  location: Location;
  capacity: string;
  projectType: string;
  status: string;
  plannedStartDate: string;
  targetCompletionDate: string;
  actualStartDate?: string;
  actualCompletionDate?: string;
  progress: number;
  milestones: ProjectMilestone[];
  risks: ProjectRisk[];
  priority: string;
  contractValue: number;
  description: string;
  notes?: string;
  isActive: boolean;
}

export interface PaginatedProjects extends PaginatedResponse<Project> {}

const getAxiosConfig = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token.value}` : "",
      "Content-Type": "application/json",
    },
  };
};

export async function handleUnauthorized() {
  "use server";
  redirect("/unauthorized");
}

export async function getAllProjects(page: number = 1, limit: number = 1000000) {
  try {
    const config = await getAxiosConfig();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/projects?page=${page}&limit=${limit}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    return { data: [], total: 0, page: 1, limit };
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const config = await getAxiosConfig();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
      config
    );
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error?.response?.data.message || error;
  }
}

export async function createProject(
  project: CreateProjectDto
): Promise<Project | null> {
  try {
    const config = await getAxiosConfig();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/projects`,
      project,
      config
    );
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error?.response?.data.message || error;
  }
}

export async function updateProject(
  id: string,
  project: CreateProjectDto
): Promise<Project | null> {
  try {
    const config = await getAxiosConfig();
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
      project,
      config
    );
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error?.response?.data.message || error;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const config = await getAxiosConfig();
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
      config
    );
    return true;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error?.response?.data.message || error;
  }
}
