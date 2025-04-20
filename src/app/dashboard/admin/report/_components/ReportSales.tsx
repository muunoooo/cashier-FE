"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { getWithDateQuery } from "@/api/report";
import { DailySalesResponse } from "@/types/reportV2";
import { Plus } from "lucide-react";

const ReportSales = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<string>(
    today.toISOString().split("T")[0]
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

  const [dailySales, setDailySales] = useState<DailySalesResponse | null>(null);
  const [monthlySales, setMonthlySales] = useState<DailySalesResponse | null>(
    null
  );
  const [yearlySales, setYearlySales] = useState<DailySalesResponse | null>(
    null
  );
  const page: number = 1;
  const fetchSalesData = async (type: string, date: string) => {
    try {
      const data = await getWithDateQuery(type, date, page);
      if (type === "daily-sales") setDailySales(data);
      if (type === "monthly-sales") setMonthlySales(data);
      if (type === "yearly-sales") setYearlySales(data);
    } catch (error) {
      console.error("Error fetching sales data", error);
    }
  };

  useEffect(() => {
    fetchSalesData("daily-sales", selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    fetchSalesData(
      "monthly-sales",
      `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, "0")}`
    );
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchSalesData("yearly-sales", `${selectedYear}`);
  }, [selectedYear]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(e.target.value, 10);
    setSelectedMonth(month);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value, 10);
    setSelectedYear(year);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Sales Report
      </h2>
      <div className="md:flex md:justify-between">
        <div className="mb-6 flex justify-center">
          <div className="flex flex-col items-center">
            <label htmlFor="day" className="text-lg font-medium text-gray-700">
              Daily
            </label>
            <input
              type="date"
              id="day"
              value={selectedDate}
              onChange={handleDateChange}
              className="border-2 border-gray-300 p-2 rounded-md"
            />
            <div className="mt-4">
              {dailySales && dailySales._sum.totalPrice ? (
                <div className="inline-flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-lg">
                  <Plus className="w-5 h-5" />
                  Rp. {dailySales._sum.totalPrice.toLocaleString()}
                </div>
              ) : (
                <p className="text-gray-500">No transactions for this date</p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="flex flex-col items-center">
            <label
              htmlFor="month"
              className="text-lg font-medium text-gray-700"
            >
              Monthly
            </label>
            <select
              id="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border-2 border-gray-300 p-2 rounded-md"
            >
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index} value={index}>
                  {format(new Date(2021, index), "MMMM")}
                </option>
              ))}
            </select>
            <div className="mt-4">
              {monthlySales && monthlySales._sum.totalPrice ? (
                <div className="inline-flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-lg">
                  <Plus className="w-5 h-5" />
                  Rp. {monthlySales._sum.totalPrice.toLocaleString()}
                </div>
              ) : (
                <p className="text-gray-500">No transactions for this month</p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="flex flex-col items-center">
            <label htmlFor="year" className="text-lg font-medium text-gray-700">
              Yearly
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={handleYearChange}
              className="border-2 border-gray-300 p-2 rounded-md"
            >
              {Array.from({ length: 6 }, (_, index) => {
                const year = new Date().getFullYear() - index;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
            <div className="mt-4">
              {yearlySales && yearlySales._sum.totalPrice ? (
                <div className="inline-flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-lg">
                  <Plus className="w-5 h-5" />
                  Rp. {yearlySales._sum.totalPrice.toLocaleString()}
                </div>
              ) : (
                <p className="text-gray-500">No transactions for this year</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSales;
