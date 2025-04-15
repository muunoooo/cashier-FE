import axios from "axios";
import { toast } from "react-toastify";
import { IUser, IUserPagination } from "@/types/user";

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export async function getAllUsers(
  page = 1,
  limit = 10,
  token: string
): Promise<IUserPagination> {
  try {
    const res = await axios.get(
      `${base_url}/user?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` }, 
      }
    );
    return {
      data: res.data.data,
      pagination: res.data.pagination,
    };
  } catch (err) {
    console.error("Failed to fetch all users:", err);
    toast.error("Gagal mengambil data user.");
    throw err;
  }
}

export async function getUserById(id: string): Promise<IUser> {
  try {
    const res = await axios.get(`${base_url}/user/${id}`, getAuthHeader());
    return res.data.user;
  } catch (err) {
    console.error(`Failed to fetch user with ID ${id}:`, err);
    toast.error("Gagal mengambil data user.");
    throw err;
  }
}

export async function updateUser(
  id: string,
  values: Partial<IUser>
): Promise<IUser> {
  try {
    const res = await axios.put(
      `${base_url}/user/${id}`,
      values,
      getAuthHeader()
    );
    toast.success("User updated successfully!");
    return res.data.updatedUser;
  } catch (err) {
    console.error("Failed to update user:", err);
    toast.error("Gagal mengupdate user.");
    throw err;
  }
}

export async function softDeleteUser(id: string): Promise<void> {
  try {
    await axios.delete(`${base_url}/user/${id}`, getAuthHeader());
    toast.success("User berhasil dihapus.");
  } catch (err) {
    console.error("Failed to delete user:", err);
    toast.error("Gagal menghapus user.");
    throw err;
  }
}
