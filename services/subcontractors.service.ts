"use server";

import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PaginatedResponse } from "./employees.service";

export interface Subcontractor {
  _id: string;
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
  specialty: string;
  skills: string[];
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  rating:number 
}

export interface CreateSubcontractorDto {
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
  specialty: string;
  skills: string[];
  isActive: boolean;
  notes?: string;
}

export interface PaginatedSubcontractors extends PaginatedResponse<Subcontractor> {}

export interface SubcontractorBasicInfo {
  _id: string;
  isCompany: boolean;
  email: string;
  phone: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
}

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

export async function getAllSubcontractors(
  page: number = 1,
  limit: number = 1000000
) {
  try {
    const config = await getAxiosConfig();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/subcontractors?page=${page}&limit=${limit}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch subcontractors:", error);
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    return { data: [], total: 0, page: 1, limit };
  }
}

export async function getSubcontractorById(id: string): Promise<Subcontractor | null> {
  try {
    const config = await getAxiosConfig();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/subcontractors/${id}`,
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

export async function createSubcontractor(
  subcontractor: CreateSubcontractorDto
): Promise<Subcontractor | null> {
  try {
    const config = await getAxiosConfig();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/subcontractors`,
      subcontractor,
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

export async function updateSubcontractor(
  id: string,
  subcontractor: CreateSubcontractorDto
): Promise<Subcontractor | null> {
  try {
    const config = await getAxiosConfig();
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/subcontractors/${id}`,
      subcontractor,
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

export async function deleteSubcontractor(id: string): Promise<boolean> {
  try {
    const config = await getAxiosConfig();
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/subcontractors/${id}`,
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

export async function getSubcontractorsBasicInfo(): Promise<SubcontractorBasicInfo[]> {
  try {
    const config = await getAxiosConfig();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/subcontractors/get/basic-info`,
      config
    );
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    console.error("Failed to fetch subcontractors basic info:", error);
    throw error?.response?.data.message || error;
  }
}

export async function addSubcontractorToProject(
  projectId: string,
  subcontractorId: string
): Promise<boolean> {
  try {
    const config = await getAxiosConfig();
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/subcontractors/projects/${projectId}/subcontractors/${subcontractorId}`,
      {},
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

export async function removeSubcontractorFromProject(
  projectId: string,
  subcontractorId: string
): Promise<boolean> {
  try {
    const config = await getAxiosConfig();
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/subcontractors/projects/${projectId}/subcontractors/${subcontractorId}`,
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
