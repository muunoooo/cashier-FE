"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getTransactionById } from "@/api/transaction"; // Pastikan fungsi API sudah ada
import { Button } from "@/components/ui/button";
import { formatDateToDate } from "@/helpers/Date";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupiah } from "@/helpers/Currency";
import { GiMoneyStack } from "react-icons/gi";
import { ITransaction } from "@/types/transcation";

interface TransactionDetailDialogProps {
  transactionId: string;
}

const TransactionDetailDialog: React.FC<TransactionDetailDialogProps> = ({
  transactionId,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transaction, setTransaction] = useState<ITransaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactionDetail = async () => {
    setIsLoading(true);
    try {
      const data = await getTransactionById(transactionId);
      setTransaction(data);
    } catch (err) {
      setTransaction(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isDialogOpen) {
      fetchTransactionDetail();
    }
  }, [isDialogOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-blue-500 hover:text-white hover:bg-blue-500 hover:shadow-lg transition-all duration-200 px-4 py-2 rounded-lg"
        >
          <GiMoneyStack className="text-xl" />
          <span>See Details</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[420px] md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Transaction Details
          </DialogTitle>
          <DialogDescription>
            Complete information about the transaction
          </DialogDescription>
        </DialogHeader>

        {isLoading || !transaction ? (
          <div className="space-y-3 mt-4">
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-full h-5" />
          </div>
        ) : (
          <div className="mt-4 flex flex-col md:flex-row gap-4 text-sm">
            <div className="flex-1 space-y-2">
              <div>
                <strong>Transaction ID:</strong> {transaction.id}
              </div>
              <div>
                <strong>Payment Method:</strong> {transaction.paymentMethod}
              </div>
              <div>
                <strong>Total Price:</strong>{" "}
                {formatRupiah(transaction.totalPrice)}
              </div>
              <div>
                <strong>Cash Paid:</strong>{" "}
                {transaction.cashPaid
                  ? formatRupiah(transaction.cashPaid)
                  : "-"}
              </div>
              <div>
                <strong>Change:</strong>{" "}
                {transaction.change ? formatRupiah(transaction.change) : "-"}
              </div>
              <div>
                <strong>Created At:</strong>{" "}
                {formatDateToDate(transaction.createdAt)}
              </div>
              <div>
                <strong>Cashier:</strong> {transaction.cashier.name}
              </div>
              <div>
                <strong>Shift:</strong> {transaction.shift.id}
              </div>
              <div>
                <strong>Items:</strong>
                <ul className="list-disc pl-5">
                  {transaction.items.map((item) => (
                    <li key={item.id}>
                      {item.productName} - {item.quantity} x{" "}
                      {formatRupiah(item.price)} = {formatRupiah(item.subtotal)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsDialogOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailDialog;
