"use client";

import React, { useCallback, useEffect, useState } from "react";
import ClientLayout from "@/components/ClientLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationDashboard from "@/components/PaginationDashboard";
import { formatDateToDate } from "@/helpers/Date";
import { getAllTransactions } from "@/api/transaction";
import { toast } from "react-toastify";
import { PacmanLoader } from "react-spinners";
import { useSession } from "@/contexts/SessionContext";
import { ITransactionPagination } from "@/types/transcation";
import TransactionDetailDialog from "./_components/TransactionDetailDialog";
import { formatRupiah } from "@/helpers/Currency";

const TransactionPage = () => {
  const { isLoading: sessionLoading } = useSession();
  const [transactions, setTransactions] =
    useState<ITransactionPagination | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const limit = 5;

  const fetchTransactionData = useCallback(
    (page = 1, query = "") => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setIsLoading(true);
      const isSearching = query.trim() !== "";

      const effectiveLimit = isSearching ? 100 : limit;

      getAllTransactions(page, effectiveLimit, query)
        .then((response) => {
          setTransactions({
            data: response.data,
            pagination: response.pagination,
          });
          setTotalPages(response.pagination.totalPages);
        })
        .catch(() => {
          toast.error("Error Fetching Transactions");
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [limit]
  );

  useEffect(() => {
    if (!sessionLoading) {
      fetchTransactionData(currentPage, searchQuery);
    }
  }, [sessionLoading, currentPage, searchQuery]);

  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-2 text-start justify-between items-center p-4 border rounded-lg shadow-sm bg-white">
          <div className="w-full text-start">
            <section className="border-b">
              <h1 className="text-xl font-bold text-gray-800">
                Transaction List
              </h1>
              <h2 className="text-base text-gray-600">
                Content - Transaction List
              </h2>
            </section>
          </div>

          {isLoading ? (
            <PacmanLoader />
          ) : (
            <>
              <div className="w-full shadow rounded-md border border-gray-200">
                <Table className="w-full p-2">
                  <TableHeader>
                    <TableRow className="text-sm">
                      <TableHead className="text-center">#</TableHead>
                      <TableHead>DATE</TableHead>
                      <TableHead>CASHIER</TableHead>
                      <TableHead>TOTAL PRICE</TableHead>
                      <TableHead>PAYMENT METHOD</TableHead>
                      <TableHead>DATE</TableHead>
                      <TableHead>ACTION</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions?.data?.map((transaction, index) => (
                      <TableRow
                        key={transaction.id}
                        className="hover:bg-gray-50 text-sm"
                      >
                        <TableCell className="text-center">
                          {(currentPage - 1) * limit + index + 1}
                        </TableCell>
                        <TableCell>
                          {formatDateToDate(transaction.createdAt)}
                        </TableCell>
                        <TableCell>{transaction.cashier.name}</TableCell>
                        <TableCell>{formatRupiah(transaction.totalPrice)}</TableCell>
                        <TableCell>{transaction.paymentMethod}</TableCell>
                        <TableCell>
                          {formatDateToDate(transaction.createdAt)}
                        </TableCell>
                        <TableCell>
                          <TransactionDetailDialog
                            transactionId={transaction.id}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <PaginationDashboard
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

export default TransactionPage;
