"use client";

import { IReportItem } from "@/types/reportV2";
import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MonthlySalesProps {
  selectedMonth: number;
  salesPerItem: IReportItem[] | null;
  handleMonthChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ItemMonthlySales: React.FC<MonthlySalesProps> = ({
  selectedMonth,
  salesPerItem,
  handleMonthChange,
}) => (
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
        {Array.from({ length: 12 }, (_, index) => (
          <option key={index} value={index}>
            {format(new Date(2021, index), "MMMM")}
          </option>
        ))}
      </select>
    </div>

    <div className="w-full max-w-3xl">
      {salesPerItem && salesPerItem.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesPerItem.map((item) => (
              <TableRow key={item.productId}>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.quantity} pcs</TableCell>
                <TableCell>
                  Rp. {item.subtotal.toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-gray-500 text-center mt-4">
          No transactions for this month
        </p>
      )}
    </div>
  </div>
);

export default ItemMonthlySales;
