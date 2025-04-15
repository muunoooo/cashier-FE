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
import { fetchUsers } from "@/app/api/user";
import { useSession } from "next-auth/react";
import { User } from "@/types/user";
import DeleteDialog from "./_components/DeleteDialog";
import UpdateUserDialog from "./_components/UpdateUserDialog";
import { showToast } from "@/utils/toast-handler";
import Loading from "@/components/loading";
import SearchBarDebounce from "@/components/ui/searchBarDebounce";
import { formatDateToDate } from "@/utils/dateTime";
import PaginationDashboard from "@/components/PaginationDashboard";
import { toTitleCase } from "@/utils/toTitleCase";

const UserPage = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 20;

  const fetchUserData = useCallback(
    (page = 1) => {
      if (session?.user?.accessToken) {
        setIsLoading(true);
        fetchUsers(session.user.accessToken, page, limit)
          .then((response) => {
            setUsers(response.data);
            setFilteredUsers(response.data);
            setTotalPages(response.meta.total_pages);
          })
          .catch(() => {
            showToast("Gagal mengambil pengguna", "error");
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    },
    [session?.user?.accessToken, limit]
  );

  useEffect(() => {
    fetchUserData(currentPage);
  }, [fetchUserData, currentPage]);

  const refreshUsers = () => fetchUserData(currentPage);

  const handleSearch = (
    query: string,
    event?: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event && event.key !== "Enter") return;

    if (!query) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.full_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const userSuggestions = users.map((user) => user.full_name);

  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-2 text-start justify-between items-center p-4 border rounded-lg shadow-sm bg-white">
          {/* Header */}
          <div className="w-full text-start">
            <section className="border-b">
              <h1 className="text-xl font-bold text-gray-800">
                Daftar Pengguna
              </h1>
              <h2 className="text-base text-gray-600">
                Akun - Daftar Pengguna
              </h2>
            </section>
          </div>

          {isLoading ? (
            <Loading />
          ) : (
            <>
              {/* Filter, Pencarian, dan Tombol Buat Pengguna */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
                {/* <CreateUserDialog onUserCreated={refreshUsers} /> */}
                <div className="max-w-xs w-full sm:w-auto">
                  <SearchBarDebounce
                    onSearch={handleSearch}
                    suggestions={userSuggestions}
                    placeholder="Cari Nama User"
                  />
                </div>
              </div>

              {/* Tabel Pengguna */}
              <div className="w-full shadow rounded-md border border-gray-200">
                <Table className="w-full p-2">
                  <TableHeader>
                    <TableRow className="text-sm">
                      <TableHead className="text-center">No.</TableHead>
                      <TableHead>Nama Lengkap</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Peran</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Tanggal Terdaftar
                      </TableHead>
                      {/* Sembunyikan di Mobile */}
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-gray-50 text-sm"
                      >
                        <TableCell className="text-center">
                          {(currentPage - 1) * limit + index + 1}
                        </TableCell>
                        <TableCell>{toTitleCase(user.full_name)}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.roles.join(", ")}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {formatDateToDate(user.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <UpdateUserDialog
                              user={user}
                              onUserUpdated={refreshUsers}
                            />
                            <DeleteDialog
                              userId={user.id}
                              userName={user.full_name}
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
