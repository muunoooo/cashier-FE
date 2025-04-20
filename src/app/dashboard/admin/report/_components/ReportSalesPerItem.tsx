"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { getWithDateQuery } from "@/api/report";
import ItemDailySales from "./ItemDaily";
import ItemMonthlySales from "./ItemMonthly";
import ItemYearlySales from "./ItemYearly";
import { IReportItem } from "@/types/reportV2";

const ReportSalesPerItem = () => {
  const today = new Date();
  const [activeTab, setActiveTab] = useState("daily");

  const [selectedDate, setSelectedDate] = useState<string>(
    today.toISOString().split("T")[0]
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

  const [salesPerItem, setSalesPerItem] = useState<IReportItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cache, setCache] = useState<Record<string, IReportItem[]>>({});
  const page: number = 1;

  const fetchSalesData = useCallback(
    async (type: string, dateKey: string) => {
      const cacheKey = `${type}-${dateKey}`;
      const cachedData = cache[cacheKey];

      if (cachedData) {
        setSalesPerItem(cachedData);
        return;
      }

      setLoading(true);
      try {
        const data = await getWithDateQuery(type, dateKey, page);
        setSalesPerItem(data);

        setCache((prev) => ({
          ...prev,
          [cacheKey]: data,
        }));
      } catch (error) {
        console.error("Error fetching sales data", error);
        setSalesPerItem(null);
      } finally {
        setLoading(false);
      }
    },
    [cache, page] 
  );

  useEffect(() => {
    if (activeTab === "daily") {
      fetchSalesData("daily-sales/items", selectedDate);
    } else if (activeTab === "monthly") {
      const dateKey = `${selectedYear}-${(selectedMonth + 1)
        .toString()
        .padStart(2, "0")}`;
      fetchSalesData("monthly-sales/items", dateKey);
    } else if (activeTab === "yearly") {
      fetchSalesData("yearly-sales/items", `${selectedYear}`);
    }
  }, [activeTab, selectedDate, selectedMonth, selectedYear, fetchSalesData]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(e.target.value, 10));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Item Report
      </h2>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
        <TabsContent value="daily">
          {loading ? (
            <p className="text-center text-gray-500">Loading daily data...</p>
          ) : (
            <ItemDailySales
              selectedDate={selectedDate}
              salesPerItem={salesPerItem}
              handleDateChange={handleDateChange}
            />
          )}
        </TabsContent>
        <TabsContent value="monthly">
          {loading ? (
            <p className="text-center text-gray-500">Loading monthly data...</p>
          ) : (
            <ItemMonthlySales
              selectedMonth={selectedMonth}
              salesPerItem={salesPerItem}
              handleMonthChange={handleMonthChange}
            />
          )}
        </TabsContent>
        <TabsContent value="yearly">
          {loading ? (
            <p className="text-center text-gray-500">Loading yearly data...</p>
          ) : (
            <ItemYearlySales
              selectedYear={selectedYear}
              salesPerItem={salesPerItem}
              handleYearChange={handleYearChange}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportSalesPerItem;
