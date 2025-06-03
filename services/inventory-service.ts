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

// ========================= WAREHOUSE/LOCATION ENDPOINTS =========================

export async function createWarehouse(warehouseData: any) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/warehouses`,
      warehouseData,
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

export async function getWarehouseById(id: string) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/warehouses/${id}`,
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

export async function getAllWarehouses() {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/warehouses`,
      config
    );
    return data.data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error?.response?.data.message || error;
  }
}

export async function updateWarehouse(id: string, warehouseData: any) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/warehouses/${id}`,
      warehouseData,
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

export async function deleteWarehouse(id: string) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/warehouses/${id}`,
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

// ========================= INVENTORY ITEM ENDPOINTS =========================

export async function createInventoryItem(itemData: any) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/items`,
      itemData,
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

export async function getInventoryItems(queryParams: any = {}) {
  try {
    const config = await getAxiosConfig();

    // Convert query params to URL search params
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const url = `${process.env.NEXT_PUBLIC_API_URL}/inventory/items${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const { data } = await axios.get(url, config);
    return data.data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error?.response?.data.message || error;
  }
}

export async function getInventoryItemById(id: string) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/items/${id}`,
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

export async function updateInventoryItem(id: string, itemData: any) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/items/${id}`,
      itemData,
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

export async function deleteInventoryItem(id: string) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/items/${id}`,
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

// ========================= TRANSACTION ENDPOINTS =========================

export async function createTransaction(transactionData: any) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/transactions`,
      transactionData,
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

export async function getTransactions(queryParams: any = {}) {
  try {
    const config = await getAxiosConfig();

    // Convert query params to URL search params
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const url = `${process.env.NEXT_PUBLIC_API_URL}/inventory/transactions${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const { data } = await axios.get(url, config);
    return data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error?.response?.data.message || error;
  }
}

// ========================= SUPPLIER ENDPOINTS =========================

export async function createSupplier(supplierData: any) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/suppliers`,
      supplierData,
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

export async function getSuppliers(
  page?: number,
  limit?: number,
  search?: string
) {
  try {
    const config = await getAxiosConfig();

    // Build query parameters
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (search) params.append("search", search);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/inventory/suppliers${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const { data } = await axios.get(url, config);
    return data.data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error?.response?.data.message || error;
  }
}

export async function getSupplierById(id: string) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/suppliers/${id}`,
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

export async function updateSupplier(id: string, supplierData: any) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/suppliers/${id}`,
      supplierData,
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

export async function deleteSupplier(id: string) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/suppliers/${id}`,
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

// ========================= STOCK MANAGEMENT ENDPOINTS =========================

export async function adjustStock(adjustmentData: any) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/stock/adjust`,
      adjustmentData,
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

export async function bulkUpdateStock(bulkUpdateData: any) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/stock/bulk-update`,
      bulkUpdateData,
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

export async function updateReservedStock(reservedStockData: any) {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/stock/reserved`,
      reservedStockData,
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

// ========================= REPORTING ENDPOINTS =========================

export async function getStockReport(reportParams: any = {}) {
  try {
    const config = await getAxiosConfig();

    // Convert query params to URL search params
    const params = new URLSearchParams();
    Object.entries(reportParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const url = `${process.env.NEXT_PUBLIC_API_URL}/inventory/reports/stock${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const { data } = await axios.get(url, config);
    return data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error?.response?.data.message || error;
  }
}

export async function getMovementReport(reportParams: any = {}) {
  try {
    const config = await getAxiosConfig();

    // Convert query params to URL search params
    const params = new URLSearchParams();
    Object.entries(reportParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const url = `${
      process.env.NEXT_PUBLIC_API_URL
    }/inventory/reports/movements${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const { data } = await axios.get(url, config);
    return data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error?.response?.data.message || error;
  }
}

export async function getInventoryValuation() {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/reports/valuation`,
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

export async function getDashboardStats() {
  try {
    const config = await getAxiosConfig();
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/inventory-stats`,

      config
    );
    return data.data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      await handleUnauthorized();
    }
    throw error?.response?.data.message || error;
  }
}
