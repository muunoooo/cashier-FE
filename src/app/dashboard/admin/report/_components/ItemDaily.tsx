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

interface DailySalesProps {
  selectedDate: string;
  salesPerItem: IReportItem[] | null;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ItemDailySales: React.FC<DailySalesProps> = ({
  selectedDate,
  salesPerItem,
  handleDateChange,
}) => (
  <div className="flex flex-col items-center gap-4">
    <div>
      <label htmlFor="day" className="text-lg font-medium text-gray-700">
        Select Date:
      </label>
      <input
        type="date"
        id="day"
        value={selectedDate}
        onChange={handleDateChange}
        className="ml-2 border border-gray-300 p-2 rounded-md"
      />
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
          No transactions for this date
        </p>
      )}
    </div>
  </div>
);

export default ItemDailySales;
