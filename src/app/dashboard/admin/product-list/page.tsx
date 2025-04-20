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
import { getAllProducts } from "@/api/product";
import { toast } from "react-toastify";
import { useSession } from "@/contexts/SessionContext";
import { IProductPagination } from "@/types/product";
import CreateProductDialog from "./_components/CreateProductDialog";
import { formatRupiah } from "@/helpers/Currency";
import UpdateProductDialog from "./_components/UpdateProductDialog";
import DeleteProductDialog from "./_components/DeleteProductDialog";
import ProductDetailDialog from "./_components/ProductDetailDialog";
import { categoryLabel } from "@/helpers/CategoryLabel";
import { ToTitleCase } from "@/helpers/ToTitleCase";
import SearchBarDebounce from "@/components/SearchDebounce";
import Loading from "@/components/loading";

const ProductListPage = () => {
  const { isLoading: sessionLoading } = useSession();
  const [products, setProducts] = useState<IProductPagination | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    "FOOD" | "DRINK" | "ALL"
  >("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const limit = 10;

  const fetchProductData = useCallback(
    (
      page = 1,
      options?: {
        search?: string;
        category?: "FOOD" | "DRINK";
        sortBy?: "name" | "price" | "stock" | "createdAt";
        order?: "asc" | "desc";
      }
    ) => {
      setIsLoading(true);
      getAllProducts({ page, limit, ...options })
        .then((response) => {
          setProducts(response);
          setTotalPages(response.pagination.totalPages);
        })
        .catch(() => {
          toast.error("Failed to fetch products");
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [limit]
  );

  useEffect(() => {
    if (!sessionLoading) {
      fetchProductData(currentPage, {
        category: selectedCategory !== "ALL" ? selectedCategory : undefined,
        search: searchQuery,
      });
    }
  }, [
    fetchProductData,
    currentPage,
    selectedCategory,
    sessionLoading,
    searchQuery,
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const refreshProducts = () => fetchProductData(currentPage);

  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-2 text-start justify-between items-center p-4 border rounded-lg shadow-sm bg-white">
          <div className="w-full text-start">
            <section className="border-b">
              <h1 className="text-xl font-bold text-gray-800">Product List</h1>
              <h2 className="text-base text-gray-600">
                Content - Product List
              </h2>
            </section>
          </div>

          {isLoading ? (
            <Loading />
          ) : (
            <>
              <SearchBarDebounce
                onSearch={handleSearch}
                suggestions={[]}
                placeHolder="Search products..."
              />

              <div className="flex flex-col sm:flex-row justify-end w-full">
                <div className="w-full mb-4 flex gap-3">
                  {["ALL", "FOOD", "DRINK"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() =>
                        setSelectedCategory(cat as typeof selectedCategory)
                      }
                      className={`px-4 py-2 rounded-md border text-sm font-medium ${
                        selectedCategory === cat
                          ? "bg-[#ACC572] text-white border-[#ACC572]"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                    >
                      {cat === "ALL"
                        ? "All"
                        : categoryLabel[cat as "FOOD" | "DRINK"]}
                    </button>
                  ))}
                </div>
                <CreateProductDialog onProductCreated={refreshProducts} />
              </div>

              <div className="w-full shadow rounded-md border border-gray-200">
                <Table className="w-full p-2">
                  <TableHeader>
                    <TableRow className="text-sm">
                      <TableHead className="text-center">#</TableHead>
                      <TableHead>PRODUCT</TableHead>
                      <TableHead>PRICE</TableHead>
                      <TableHead>STOCK</TableHead>
                      <TableHead>CATEGORY</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        CREATED
                      </TableHead>
                      <TableHead>ACTION</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products?.data?.map((product, index) => (
                      <TableRow
                        key={product.id}
                        className="hover:bg-gray-50 text-sm"
                      >
                        <TableCell className="text-center">
                          {(currentPage - 1) * limit + index + 1}
                        </TableCell>
                        <TableCell>{ToTitleCase(product.name)}</TableCell>
                        <TableCell>{formatRupiah(product.price)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {formatDateToDate(product.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <ProductDetailDialog productId={product.id} />
                            <UpdateProductDialog
                              product={product}
                              onProductUpdated={refreshProducts}
                            />
                            <DeleteProductDialog
                              productId={product.id}
                              name={product.name}
                              onProductDeleted={refreshProducts}
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

export default ProductListPage;
