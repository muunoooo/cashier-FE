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

export const getWithDateQuery = async (
  endpoint: string,
  date: string,
  page: number
) => {
  try {
    const res = await axios.get(
      `${base_url}/report/${endpoint}?date=${date}&page=${page}`, 
      getAuthHeader()
    );
    return res.data;
  } catch (err) {
    toast.error("Failed to fetch report");
    console.error(err);
    throw err;
  }
};
