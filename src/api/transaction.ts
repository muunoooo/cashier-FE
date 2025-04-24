import axios from "axios";
import { toast } from "react-toastify";
import { ITransaction, ITransactionPagination } from "@/types/transcation";

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export async function getAllTransactions(
  page = 1,
  limit = 10,
  query: string
): Promise<ITransactionPagination> {
  try {
    const res = await axios.get(
      `${base_url}/transaction?page=${page}&limit=${limit}&query=${query}`,
      getAuthHeader()
    );
    return res.data as ITransactionPagination;
  } catch (err) {
    console.error("Failed to fetch all transactions:", err);
    toast.error("Failed to fetch all transactions.");
    throw err;
  }
}

export async function getTransactionById(id: string): Promise<ITransaction> {
  try {
    const res = await axios.get(
      `${base_url}/transaction/${id}`,
      getAuthHeader()
    );
    return res.data.data as ITransaction;
  } catch (err) {
    console.error(`Failed to fetch transaction with ID ${id}:`, err);
    toast.error(`Failed to fetch transaction with ID ${id}.`);
    throw err;
  }
}

export async function createTransaction(
  id: string,
  transactionData: ITransaction
): Promise<ITransaction> {
  try {
    const res = await axios.post(
      `${base_url}/transaction/${id}`,
      transactionData,
      getAuthHeader()
    );
    return res.data.transaction as ITransaction;
  } catch (err) {
    console.error("Failed to create transaction:", err);
    throw err;
  }
}
