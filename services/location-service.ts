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

export async function getLocations() {
  try {
    const config = await getAxiosConfig();

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/locations`,
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

export async function createLocation(locationData: any) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/locations`,
      locationData,
      config
    );
    return data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    console.log(error.response?.data)
    throw error?.response?.data.message || error;
  }
}

export async function updateLocation(id: string, locationData: any) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/locations/${id}`,
      locationData,
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

export async function getBasicLocationInfo() {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/locations/get/basic-info`,
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

export async function deleteLocation(id: string) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/locations/${id}`,
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
