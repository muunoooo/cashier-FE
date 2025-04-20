"use client";

import { IShiftReportResponse } from "@/types/reportV2";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatIndonesianDateTime } from "@/helpers/Date";

interface ShiftMonthlyReportProps {
  selectedMonth: number;
  selectedYear: number;
  shiftData: IShiftReportResponse | null;
  handleMonthChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ShiftMonthlyReport: React.FC<ShiftMonthlyReportProps> = ({
  selectedMonth,
  selectedYear,
  shiftData,
  handleMonthChange,
}) => {
  const shifts = Array.isArray(shiftData) ? shiftData : shiftData?.data || [];

  return (
    <div className="flex flex-col items-center gap-4">
      <div>
        <label htmlFor="month" className="text-lg font-medium text-gray-700">
          Select Month:
        </label>
        <select
          id="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="ml-2 border border-gray-300 p-2 rounded-md"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(selectedYear, i).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full max-w-6xl mt-4">
        {shifts.length > 0 ? (
          <>
            {/* Card view for mobile */}
            <div className="block md:hidden space-y-4">
              {shifts.map((shift) => (
                <div
                  key={shift.shiftId}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <p>
                    <span className="font-semibold">Cashier:</span>{" "}
                    {shift.cashier.name}
                  </p>
                  <p>
                    <span className="font-semibold">Start Time:</span>{" "}
                    {formatIndonesianDateTime(shift.startedAt)}
                  </p>
                  <p>
                    <span className="font-semibold">End Time:</span>{" "}
                    {shift.endedAt
                      ? formatIndonesianDateTime(shift.endedAt)
                      : "Active"}
                  </p>
                  <p>
                    <span className="font-semibold">Start Cash:</span> Rp{" "}
                    {shift.startCash.toLocaleString("id-ID")}
                  </p>
                  <p>
                    <span className="font-semibold">End Cash:</span>{" "}
                    {shift.endCash
                      ? `Rp ${shift.endCash.toLocaleString("id-ID")}`
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Total Transaction:</span> Rp{" "}
                    {shift.totalTransaction.toLocaleString("id-ID")}
                  </p>
                  <p>
                    <span className="font-semibold">Total Debit:</span> Rp{" "}
                    {shift.totalDebit.toLocaleString("id-ID")}
                  </p>
                  <p>
                    <span className="font-semibold">Total Cash:</span> Rp{" "}
                    {shift.totalCash.toLocaleString("id-ID")}
                  </p>
                  <p className="font-semibold">
                    Status:{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded-md text-sm font-medium
                        ${
                          shift.isActive
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {shift.isActive ? "Active" : "Ended"}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            {/* Table view for desktop */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cashier</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Start Cash</TableHead>
                    <TableHead>End Cash</TableHead>
                    <TableHead>Total Transaction</TableHead>
                    <TableHead>Total Debit</TableHead>
                    <TableHead>Total Cash</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shifts.map((shift) => (
                    <TableRow key={shift.shiftId}>
                      <TableCell>{shift.cashier.name}</TableCell>
                      <TableCell>
                        {formatIndonesianDateTime(shift.startedAt)}
                      </TableCell>
                      <TableCell>
                        {shift.endedAt
                          ? formatIndonesianDateTime(shift.endedAt)
                          : "Active"}
                      </TableCell>
                      <TableCell>
                        Rp {shift.startCash.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        {shift.endCash
                          ? `Rp ${shift.endCash.toLocaleString("id-ID")}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        Rp {shift.totalTransaction.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        Rp {shift.totalDebit.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        Rp {shift.totalCash.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-2 py-1 rounded-md text-sm font-medium
                            ${
                              shift.isActive
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                        >
                          {shift.isActive ? "Active" : "Ended"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center mt-4">
            No shift data available for this month.
          </p>
        )}
      </div>
    </div>
  );
};

export default ShiftMonthlyReport;
