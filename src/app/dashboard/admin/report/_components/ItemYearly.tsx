"use client";

import { IReportItem } from "@/types/reportV2";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface YearlySalesProps {
  selectedYear: number;
  salesPerItem: IReportItem[] | null;
  handleYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ItemYearlySales: React.FC<YearlySalesProps> = ({
  selectedYear,
  salesPerItem,
  handleYearChange,
}) => (
  <div className="flex flex-col items-center gap-4">
    <div>
      <label htmlFor="year" className="text-lg font-medium text-gray-700">
        Select Year:
      </label>
      <select
        id="year"
        value={selectedYear}
        onChange={handleYearChange}
        className="ml-2 border border-gray-300 p-2 rounded-md"
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
          No transactions for this year
        </p>
      )}
    </div>
  </div>
);

export default ItemYearlySales;
