"use server";

import axios, { AxiosError } from "axios";
import { User } from "@/types/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export async function handleUnauthorized() {
  "use server";
  redirect("/unauthorized");
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

export async function getAllEmployees(
  page: number = 1,
  limit: number = 1000000
) {
  try {
    const config = await getAxiosConfig();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users?page=${page}&limit=${limit}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    return { data: [], total: 0, page: 1, limit };
  }
}

export async function getContractorBasicInfo() {
  try {
    const config = await getAxiosConfig();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/basic-info`,
      config
    );
    return response.data.users || [];
  } catch (error: any) {
    console.error("Failed to fetch employees:", error);
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    throw error?.response?.data.message || error;
  }
}




export async function getEmployeeById(id: string): Promise<User | null> {
  try {
    const config = await getAxiosConfig();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${id}`,
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

export async function registerEmployee(
  employee: User
): Promise<User | null> {
  try {
    const config = await getAxiosConfig();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      employee,
      config
    );
    return response.data;
  } catch (error: any) {
    console.log(error?.response?.data)
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    throw error?.response?.data.message || error;
  }
}

export async function updateEmployee(
  id: string,
  employee: any
): Promise<User | null> {
  try {
    const config = await getAxiosConfig();
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${id}`,
      employee,
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

export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    const config = await getAxiosConfig();
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, config);
    return true;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    throw error?.response?.data.message || error;
  }
}

export async function getProfile(): Promise<User[]> {
  try {
    const config = await getAxiosConfig();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
      config
    );
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }

    console.error("Failed to fetch user profile:", error);
    throw error?.response?.data.message || error;
  }
}
