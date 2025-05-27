"use server";

import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

export async function getServiceOrders() {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/service-orders`,
      config
    );
    return data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error?.response?.data.message || error;
  }
}

export async function createServiceOrder(serviceOrderData: any) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/service-orders`,
      serviceOrderData,
      config
    );
    return data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error?.response?.data.message || error;
  }
}

export async function updateServiceOrder(id: string, serviceOrderData: any) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/service-orders/${id}`,
      serviceOrderData,
      config
    );
    return data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error?.response?.data.message || error;
  }
}

export async function deleteServiceOrder(id: string) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/service-orders/${id}`,
      config
    );
    return data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error?.response?.data.message || error;
  }
}

export async function approveServiceOrder(id: string) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/service-orders/${id}/approve`,
      {},
      config
    );
    return data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error?.response?.data.message || error;
  }
}
