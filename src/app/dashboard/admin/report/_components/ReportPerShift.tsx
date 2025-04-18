"use client";

import React, { useState, useEffect } from "react";
import { getSalesPerShift } from "@/api/report";
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

const ReportPerShift = () => {
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "DEBIT">("CASH");
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Ambil data laporan per shift
  const fetchReportData = async () => {
    setLoading(true);
    try {
      const data = await getSalesPerShift(date);
      setReportData(data);
    } catch (error) {
      toast.error("Gagal mengambil data laporan.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReportByPaymentMethod = async () => {
    setLoading(true);
    try {
      const data = await getSalesPerShift(date);
      setReportData(data);
    } catch (error) {
      toast.error("Gagal mengambil data laporan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [date]);

  useEffect(() => {
    fetchReportByPaymentMethod();
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
        ) : (
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left border-b">Shift</th>
                <th className="px-4 py-2 text-left border-b">Kasir</th>
                <th className="px-4 py-2 text-left border-b">
                  Jumlah Transaksi
                </th>
                <th className="px-4 py-2 text-left border-b">
                  Total Penjualan
                </th>
              </tr>
            </thead>
            <tbody>
              {reportData?.map((shift: any, index: number) => (
                <tr key={shift.id}>
                  <td className="px-4 py-2 border-b">{shift.shiftName}</td>
                  <td className="px-4 py-2 border-b">{shift.cashier}</td>
                  <td className="px-4 py-2 border-b">
                    {shift.totalTransactions}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {formatRupiah(shift.totalSales)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportPerShift;
