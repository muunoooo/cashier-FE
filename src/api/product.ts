import { IProduct, IProductPagination } from "@/types/product";
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
  page = 1,
  limit = 10
): Promise<IProductPagination> {
  try {
    const res = await axios.get(
      `${base_url}/product?page=${page}&limit=${limit}`,
      getAuthHeader()
    );

    return {
      data: res.data.data,
      pagination: res.data.pagination,
    };
  } catch (err) {
    console.error("Failed to fetch products:", err)
    throw err;
  }
}

export async function getProductById(id: string): Promise<IProduct> {
  try {
    const res = await axios.get(`${base_url}/product/${id}`, getAuthHeader());
    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch product:", err);
    toast.error("Gagal mengambil detail produk.");
    throw err;
  }
}

export async function createProduct(data: FormData): Promise<IProduct> {
  try {
    const res = await axios.post(`${base_url}/product`, data, getAuthHeader());
    toast.success("Produk berhasil ditambahkan!");
    return res.data.data;
  } catch (err) {
    console.error("Failed to create product:", err);
    toast.error("Gagal menambahkan produk.");
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

    toast.success("Produk berhasil diperbarui!");
    return res.data.updatedProduct || res.data.data;
  } catch (err) {
    console.error("Failed to update product:", err);
    toast.error("Gagal memperbarui produk.");
    throw err;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await axios.delete(`${base_url}/product/${id}`, getAuthHeader());
    toast.success("Produk berhasil dihapus.");
  } catch (err) {
    console.error("Failed to delete product:", err);
    toast.error("Gagal menghapus produk.");
    throw err;
  }
}
