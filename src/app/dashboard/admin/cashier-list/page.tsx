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
import { IUserPagination } from "@/types/user";
import PaginationDashboard from "@/components/PaginationDashboard";
import { ToTitleCase } from "@/helpers/ToTitleCase";
import { formatDateToDate } from "@/helpers/Date";
import { getAllUsers } from "@/api/user";
import { toast } from "react-toastify";
import CreateUserDialog from "./_components/CreateCashierDialog";
import UpdateUserDialog from "./_components/UpdateCashierDialog";
import DeleteUserDialog from "./_components/DeleteCashierDialog";
import { useSession } from "@/contexts/SessionContext";
import SearchBarDebounce from "@/components/SearchDebounce";
import Loading from "@/components/loading";

const UserPage = () => {
  const { isLoading: sessionLoading } = useSession();
  const [users, setUsers] = useState<IUserPagination | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [allNames, setAllNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const limit = 5;

  const fetchUserData = useCallback(
    (page = 1, query = "") => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setIsLoading(true);
      const isSearching = query.trim() !== "";

      const effectiveLimit = isSearching ? 100 : limit;

      getAllUsers(page, effectiveLimit, query)
        .then((response) => {
          setUsers({
            data: response.data,
            pagination: response.pagination,
          });
          setTotalPages(response.pagination.totalPages);
        })
        .catch(() => {
          toast.error("Error Fetching User");
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [limit]
  );

  useEffect(() => {
    if (!sessionLoading) {
      fetchUserData(currentPage, searchQuery);
    }
  }, [sessionLoading, currentPage, searchQuery, fetchUserData]);

  const refreshUsers = () => fetchUserData(currentPage, searchQuery);

  const handleSearch = (query: string) => {
    setCurrentPage(1);
    setSearchQuery(query);
  };

  const handleTyping = async (query: string) => {
    const token = localStorage.getItem("token");
    if (!token || query.trim() === "") {
      setAllNames([]);
      return;
    }

    try {
      const res = await getAllUsers(1, 1000, query);
      const names = res.data.map((user) => user.name);
      setAllNames(names);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-2 text-start justify-between items-center p-4 border rounded-lg shadow-sm bg-white">
          <div className="w-full text-start">
            <section className="border-b">
              <h1 className="text-xl font-bold text-gray-800">Cashier List</h1>
              <h2 className="text-base text-gray-600">
                Content - Cashier List
              </h2>
            </section>
          </div>

          {isLoading ? (
            <Loading />
          ) : (
            <>
              <SearchBarDebounce
                onSearch={handleSearch}
                onTyping={handleTyping}
                suggestions={allNames}
                placeHolder="Search cashiers..."
              />

              <div className="flex flex-col sm:flex-row justify-end w-full">
                <CreateUserDialog onUserCreated={refreshUsers} />
              </div>

              <div className="w-full shadow rounded-md border border-gray-200">
                <Table className="w-full p-2">
                  <TableHeader>
                    <TableRow className="text-sm">
                      <TableHead className="text-center">#</TableHead>
                      <TableHead>NAME</TableHead>
                      <TableHead>EMAIL</TableHead>
                      <TableHead>ROLE</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        REGISTERED DATE
                      </TableHead>
                      <TableHead>ACTION</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.data?.map((user, index) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-gray-50 text-sm"
                      >
                        <TableCell className="text-center">
                          {(currentPage - 1) * limit + index + 1}
                        </TableCell>
                        <TableCell>{ToTitleCase(user.name)}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {formatDateToDate(user.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <UpdateUserDialog
                              user={user}
                              onUserUpdated={refreshUsers}
                            />
                            <DeleteUserDialog
                              userId={user.id}
                              name={user.name}
                              onUserDeleted={refreshUsers}
                            />
                          </div>
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

export default UserPage;
