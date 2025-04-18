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

// Helper untuk GET dengan query date
const getWithDateQuery = async (endpoint: string, date: string) => {
  try {
    const res = await axios.get(`${base_url}/report/${endpoint}?date=${date}`, getAuthHeader());
    return res.data;
  } catch (err) {
    toast.error("Gagal mengambil data laporan.");
    console.error(err);
    throw err;
  }
};

// 🔽 Berikut fungsi-fungsi pemanggil API report

export const getDailySales = async (date: string) => {
  return getWithDateQuery("daily-sales", date);
};

export const getDailySalesPerItem = async (date: string) => {
  return getWithDateQuery("daily-sales/items", date);
};

export const getSalesPerShift = async (date: string) => {
  return getWithDateQuery("daily-sales/shift", date);
};

export const getSalesPerCashier = async (date: string) => {
  return getWithDateQuery("daily-sales/cashier", date);
};

export const getSalesPerCashierAndItem = async (date: string) => {
  return getWithDateQuery("daily-sales/cashier-items", date);
};

export const getSalesByPaymentMethod = async (date: string) => {
  return getWithDateQuery("daily-sales/payment-method", date);
};

export const getCashFlowPerShift = async (date: string) => {
  return getWithDateQuery("daily-sales/cash-flow", date);
};
