"use client";

import React, { useState, useEffect } from "react";
import { getDailySales } from "@/api/report";
import { PacmanLoader } from "react-spinners";
import { formatRupiah } from "@/helpers/Currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToastContainer, toast } from "react-toastify";

// Untuk membuat dropdown pilihan metode pembayaran
const PaymentMethodFilter = ({
  onFilterChange,
}: {
  onFilterChange: (method: "CASH" | "DEBIT") => void;
}) => (
  <Select onValueChange={onFilterChange}>
    <SelectTrigger className="w-40">
      <SelectValue placeholder="Pilih Metode Pembayaran" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="CASH">Cash</SelectItem>
      <SelectItem value="DEBIT">Debit</SelectItem>
    </SelectContent>
  </Select>
);

const ReportSales = () => {
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "DEBIT">("CASH");
  const [salesData, setSalesData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Ambil data laporan penjualan
  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const data = await getDailySales(date);
      setSalesData(data);
    } catch (error) {
      toast.error("Gagal mengambil data laporan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [date]);

  useEffect(() => {
    // Filter data berdasarkan metode pembayaran (jika diperlukan)
    // Biasanya akan dikirim dengan query parameter di backend, sesuaikan dengan logika API
    fetchSalesData();
  }, [paymentMethod]);

  return (
    <div className="p-4">
      <ToastContainer />

      <div className="flex items-center gap-4">
        <label htmlFor="date" className="font-medium">
          Pilih Tanggal:
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded-md"
        />

        <PaymentMethodFilter onFilterChange={setPaymentMethod} />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center">
            <PacmanLoader size={30} />
          </div>
        ) : Array.isArray(salesData) && salesData.length > 0 ? (
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left border-b">Kasir</th>
                <th className="px-4 py-2 text-left border-b">
                  Jumlah Transaksi
                </th>
                <th className="px-4 py-2 text-left border-b">
                  Total Penjualan
                </th>
                <th className="px-4 py-2 text-left border-b">
                  Metode Pembayaran
                </th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale: any) => (
                <tr key={sale.id}>
                  <td className="px-4 py-2 border-b">{sale.cashier}</td>
                  <td className="px-4 py-2 border-b">
                    {sale.totalTransactions}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {formatRupiah(sale.totalSales)}
                  </td>
                  <td className="px-4 py-2 border-b">{sale.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Tidak ada data untuk ditampilkan</p>
        )}
      </div>
    </div>
  );
};

export default ReportSales;
