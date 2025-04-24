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
import { useSession } from "@/contexts/SessionContext";
import { ITransactionPagination } from "@/types/transcation";
import TransactionDetailDialog from "./_components/TransactionDetailDialog";
import { formatRupiah } from "@/helpers/Currency";
import Loading from "@/components/loading";
import { useRouter, useSearchParams } from "next/navigation";

const limit = 10;

const TransacionHistoryList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading: sessionLoading } = useSession();

  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [transactions, setTransactions] =
    useState<ITransactionPagination | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateParams = useCallback(
    (params: {
      page?: number;
      category?: "ALL" | "FOOD" | "DRINK";
      search?: string;
    }) => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (params.page !== undefined)
        newParams.set("page", params.page.toString());
      if (params.category !== undefined)
        newParams.set("category", params.category);
      if (params.search !== undefined) newParams.set("search", params.search);

      router.replace(`?${newParams.toString()}`);
    },
    [searchParams, router]
  );

  const fetchTransactionData = useCallback(async (page = 1, query = "") => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);

    try {
      const response = await getAllTransactions(page, limit, query);
      setTransactions({
        data: response.data,
        pagination: response.pagination,
      });
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Error Fetching Transactions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!sessionLoading) {
      fetchTransactionData(currentPage);
    }
  }, [sessionLoading, currentPage, fetchTransactionData]);

  useEffect(() => {
    if (currentPage > 0) {
      updateParams({ page: currentPage });
    }
  }, [currentPage, updateParams]);

  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-4 text-start justify-between items-center p-4 border rounded-lg shadow-sm bg-white">
          <div className="w-full text-start">
            <section className="border-b pb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Transaction List
              </h1>
              <h2 className="text-sm sm:text-base text-gray-600">
                Content - Transaction List
              </h2>
            </section>
          </div>

          {isLoading ? (
            <Loading />
          ) : (
            <>
              <div className="hidden md:block w-full overflow-x-auto">
                <div className="min-w-[700px] shadow rounded-md border border-gray-200">
                  <Table className="w-full">
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
                          <TableCell>
                            {formatRupiah(transaction.totalPrice)}
                          </TableCell>
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
              </div>

              <div className="md:hidden flex flex-col gap-4 w-full">
                {transactions?.data?.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className="border rounded-lg shadow p-4 bg-white text-sm"
                  >
                    <div className="flex justify-between mb-2 text-gray-500 font-medium">
                      <span>#{(currentPage - 1) * limit + index + 1}</span>
                      <span>{formatDateToDate(transaction.createdAt)}</span>
                    </div>
                    <div className="text-gray-700">
                      <p>
                        <span className="font-semibold">Cashier: </span>
                        {transaction.cashier.name}
                      </p>
                      <p>
                        <span className="font-semibold">Total: </span>
                        {formatRupiah(transaction.totalPrice)}
                      </p>
                      <p>
                        <span className="font-semibold">Payment: </span>
                        {transaction.paymentMethod}
                      </p>
                    </div>
                    <div className="mt-3 text-right">
                      <TransactionDetailDialog transactionId={transaction.id} />
                    </div>
                  </div>
                ))}
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

export default TransacionHistoryList;
