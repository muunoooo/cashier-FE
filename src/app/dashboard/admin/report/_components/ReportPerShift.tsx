"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getWithDateQuery } from "@/api/report";
import { IShiftReportResponse } from "@/types/reportV2";
import ShiftDailyReport from "./ShiftDaily";
import ShiftMonthlyReport from "./ShiftMonthly";
import ShiftYearlyReport from "./ShiftYearly";
import PaginationDashboard from "@/components/PaginationDashboard";

const ReportShift = () => {
  const today = new Date();
  const [activeTab, setActiveTab] = useState("daily");
  const [selectedDate, setSelectedDate] = useState<string>(
    today.toISOString().split("T")[0]
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

  const [shiftDataDaily, setShiftDataDaily] =
    useState<IShiftReportResponse | null>(null);
  const [shiftDataMonthly, setShiftDataMonthly] =
    useState<IShiftReportResponse | null>(null);
  const [shiftDataYearly, setShiftDataYearly] =
    useState<IShiftReportResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [currentPageDaily, setCurrentPageDaily] = useState(1);
  const [currentPageMonthly, setCurrentPageMonthly] = useState(1);
  const [currentPageYearly, setCurrentPageYearly] = useState(1);

  const [totalPagesDaily, setTotalPagesDaily] = useState(1);
  const [totalPagesMonthly, setTotalPagesMonthly] = useState(1);
  const [totalPagesYearly, setTotalPagesYearly] = useState(1);

  const fetchShiftData = async (
    type: string,
    dateKey: string,
    page: number
  ) => {
    setLoading(true);
    try {
      const response = await getWithDateQuery(type, dateKey, page);
      const { data, pagination } = response;

      if (type === "daily-sales/shift") {
        setShiftDataDaily(data);
        setTotalPagesDaily(pagination.totalPages);
      } else if (type === "monthly-sales/shift") {
        setShiftDataMonthly(data);
        setTotalPagesMonthly(pagination.totalPages);
      } else if (type === "yearly-sales/shift") {
        setShiftDataYearly(data);
        setTotalPagesYearly(pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching shift data", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (activeTab === "daily") {
      setCurrentPageDaily(page);
    } else if (activeTab === "monthly") {
      setCurrentPageMonthly(page);
    } else if (activeTab === "yearly") {
      setCurrentPageYearly(page);
    }
  };

  useEffect(() => {
    if (activeTab === "daily") {
      fetchShiftData("daily-sales/shift", selectedDate, currentPageDaily);
    } else if (activeTab === "monthly") {
      const dateKey = `${selectedYear}-${(selectedMonth + 1)
        .toString()
        .padStart(2, "0")}`;
      fetchShiftData("monthly-sales/shift", dateKey, currentPageMonthly);
    } else if (activeTab === "yearly") {
      fetchShiftData(
        "yearly-sales/shift",
        `${selectedYear}`,
        currentPageYearly
      );
    }
  }, [
    activeTab,
    selectedDate,
    selectedMonth,
    selectedYear,
    currentPageDaily,
    currentPageMonthly,
    currentPageYearly,
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Shift Report
      </h2>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          {loading ? (
            <div className="w-full max-w-4xl mx-auto">
              <p className="text-center text-gray-500">Loading daily data...</p>
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto">
              <ShiftDailyReport
                selectedDate={selectedDate}
                shiftData={shiftDataDaily}
                handleDateChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="monthly">
          {loading ? (
            <div className="w-full max-w-4xl mx-auto">
              <p className="text-center text-gray-500">
                Loading monthly data...
              </p>
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto">
              <ShiftMonthlyReport
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                shiftData={shiftDataMonthly}
                handleMonthChange={(e) =>
                  setSelectedMonth(parseInt(e.target.value, 10))
                }
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="yearly">
          {loading ? (
            <div className="w-full max-w-4xl mx-auto">
              <p className="text-center text-gray-500">
                Loading yearly data...
              </p>
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto">
              <ShiftYearlyReport
                selectedYear={selectedYear}
                shiftData={shiftDataYearly}
                handleYearChange={(e) =>
                  setSelectedYear(parseInt(e.target.value, 10))
                }
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
      {activeTab === "daily" && (
        <PaginationDashboard
          currentPage={currentPageDaily}
          totalPages={totalPagesDaily}
          onPageChange={handlePageChange}
        />
      )}
      {activeTab === "monthly" && (
        <PaginationDashboard
          currentPage={currentPageMonthly}
          totalPages={totalPagesMonthly}
          onPageChange={handlePageChange}
        />
      )}
      {activeTab === "yearly" && (
        <PaginationDashboard
          currentPage={currentPageYearly}
          totalPages={totalPagesYearly}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ReportShift;
