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
import { formatRupiah } from "@/helpers/Currency";

interface ShiftDailyReportProps {
  selectedDate: string;
  shiftData: IShiftReportResponse | null;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ShiftDailyReport: React.FC<ShiftDailyReportProps> = ({
  selectedDate,
  shiftData,
  handleDateChange,
}) => {
  const shifts = Array.isArray(shiftData) ? shiftData : shiftData?.data || [];

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="w-full max-w-md px-4">
        <label htmlFor="day" className="text-lg font-medium text-gray-700">
          Select Date:
        </label>
        <input
          type="date"
          id="day"
          value={selectedDate}
          onChange={handleDateChange}
          className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
        />
      </div>

      <div className="w-full max-w-6xl mt-4">
        {shifts.length > 0 ? (
          <>
            <div className="block md:hidden space-y-4">
              {shifts.map((shift) => (
                <div
                  key={shift.shiftId}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <p>
                    <span className="font-semibold">Cashier:</span>
                    {shift.cashier.name}
                  </p>
                  <p>
                    <span className="font-semibold">Start Time:</span>
                    {formatIndonesianDateTime(shift.startedAt)}
                  </p>
                  <p>
                    <span className="font-semibold">End Time:</span>
                    {shift.endedAt
                      ? formatIndonesianDateTime(shift.endedAt)
                      : "Active"}
                  </p>

                  <p>
                    <span className="font-semibold">Total Transaction:</span>
                    {formatRupiah(shift.totalTransaction)}
                  </p>
                  <p>
                    <span className="font-semibold">Total Debit:</span>
                    {formatRupiah(shift.totalDebit)}
                  </p>
                  <p>
                    <span className="font-semibold">Total Cash:</span>
                    {formatRupiah(shift.totalCash)}
                  </p>
                  <p>
                    <span className="font-semibold">Start Cash:</span>
                    {formatRupiah(shift.startCash)}
                  </p>
                  <p>
                    <span className="font-semibold">End Cash:</span>
                    {shift.endCash ? (
                      <span
                        className={`font-semibold ${
                          shift.endCash === shift.startCash + shift.totalCash
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatRupiah(shift.endCash)}
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </p>
                  <p className="font-semibold">
                    Status:
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

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cashier</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Total Transaction</TableHead>
                    <TableHead>Total Debit</TableHead>
                    <TableHead>Total Cash</TableHead>
                    <TableHead>Start Cash</TableHead>
                    <TableHead>End Cash</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shifts.map((shift) => {
                    const isEndCashCorrect =
                      shift.endCash === shift.startCash + shift.totalCash;
                    return (
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
                          {formatRupiah(shift.totalTransaction)}
                        </TableCell>
                        <TableCell>{formatRupiah(shift.totalDebit)}</TableCell>
                        <TableCell>{formatRupiah(shift.totalCash)}</TableCell>
                        <TableCell>{formatRupiah(shift.startCash)}</TableCell>
                        <TableCell>
                          {shift.endCash ? (
                            <span
                              className={`font-semibold text-sm rounded-md ${
                                isEndCashCorrect
                                  ? " text-green-600"
                                  : " text-red-600"
                              }`}
                            >
                              {formatRupiah(shift.endCash)}
                            </span>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${
                              shift.isActive
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {shift.isActive ? "Active" : "Ended"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center mt-4">
            No shift data available for this year.
          </p>
        )}
      </div>
    </div>
  );
};

export default ShiftDailyReport;
