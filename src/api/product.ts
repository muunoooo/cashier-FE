import {
  IProduct,
  IProductPagination,
  IProductQueryParams,
} from "@/types/product";
import axios from "axios";
import { toast } from "react-toastify";

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export async function getAllProducts(
  params: IProductQueryParams = {}
): Promise<IProductPagination> {
  try {
    const query = new URLSearchParams();

    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.search) query.append("search", params.search);
    if (params.category) query.append("category", params.category);
    if (params.sortBy) query.append("sortBy", params.sortBy);
    if (params.order) query.append("order", params.order);

    const res = await axios.get(
      `${base_url}/product?${query.toString()}`,
      getAuthHeader()
    );

    return {
      data: res.data.data,
      pagination: res.data.pagination,
    };
  } catch (err) {
    console.error("Failed to fetch products:", err);
    throw err;
  }
}

export async function getProductById(id: string): Promise<IProduct> {
  try {
    const res = await axios.get(`${base_url}/product/${id}`, getAuthHeader());
    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch product:", err);
    toast.error("Failed to fetch product:");
    throw err;
  }
}

export async function createProduct(data: FormData): Promise<IProduct> {
  try {
    const res = await axios.post(`${base_url}/product`, data, getAuthHeader());
    return res.data.data;
  } catch (err) {
    console.error("Failed to create product:", err);
    toast.error("Failed to create product");
    throw err;
  }
}

export async function updateProduct(
  id: string,
  data: FormData
): Promise<IProduct> {
  try {
    const res = await axios.put(`${base_url}/product/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.updatedProduct || res.data.data;
  } catch (err) {
    console.error("Failed to update product:", err);
    toast.error("Failed to update product.");
    throw err;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await axios.delete(`${base_url}/product/${id}`, getAuthHeader());
    toast.success("Product Deleted");
  } catch (err) {
    console.error("Failed to delete product:", err);
    toast.error("Failed to delete product.");
    throw err;
  }
}
