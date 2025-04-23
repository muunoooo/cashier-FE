"use client";

import React, { useCallback, useEffect, useState } from "react";
import ClientLayout from "@/components/ClientLayout";
import PaginationDashboard from "@/components/PaginationDashboard";
import { getAllProducts } from "@/api/product";
import { toast } from "react-toastify";
import { useSession } from "@/contexts/SessionContext";
import { IProductPagination } from "@/types/product";
import CreateProductDialog from "./_components/CreateProductDialog";
import { categoryLabel } from "@/helpers/CategoryLabel";
import SearchBarDebounce from "@/components/SearchDebounce";
import Loading from "@/components/loading";
import ProductTable from "./_components/ProductTable";
import { useRouter, useSearchParams } from "next/navigation";

const categoryOptions: ("ALL" | "FOOD" | "DRINK")[] = ["ALL", "FOOD", "DRINK"];
const limit = 10;

const ProductList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading: sessionLoading } = useSession();

  const [products, setProducts] = useState<IProductPagination | null>(null);
  const [allProducts, setAllProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentPage = parseInt(searchParams.get("page") || "1");
  const selectedCategory = (searchParams.get("category")?.toUpperCase() ||
    "ALL") as "ALL" | "FOOD" | "DRINK";
  const searchQuery = searchParams.get("search") || "";
  const [totalPages, setTotalPages] = useState(1);

  const updateParams = (params: {
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
  };

  const fetchProductData = useCallback(() => {
    setIsLoading(true);
    getAllProducts({
      page: currentPage,
      limit,
      category: selectedCategory !== "ALL" ? selectedCategory : undefined,
      search: searchQuery,
    })
      .then((res) => {
        setProducts(res);
        setTotalPages(res.pagination.totalPages);
      })
      .catch(() => toast.error("Failed to fetch products"))
      .finally(() => setIsLoading(false));
  }, [currentPage, selectedCategory, searchQuery]);

  useEffect(() => {
    if (!sessionLoading) fetchProductData();
  }, [sessionLoading, fetchProductData]);

  const handleTyping = async (query: string) => {
    const token = localStorage.getItem("token");
    if (!token || query.trim() === "") {
      setAllProducts([]);
      return;
    }

    try {
      const res = await getAllProducts({
        page: 1,
        limit: 1000,
        search: query,
      });
      const names = res.data.map((product) => product.name);
      setAllProducts(names);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (query: string) => {
    updateParams({ search: query, page: 1 });
  };

  const refreshProducts = () => fetchProductData();

  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-white">
          <section className="border-b mb-2">
            <h1 className="text-xl font-bold text-gray-800">Product List</h1>
            <p className="text-base text-gray-600">Content - Product List</p>
          </section>

          {isLoading ? (
            <Loading />
          ) : (
            <>
              <SearchBarDebounce
                onSearch={handleSearch}
                onTyping={handleTyping}
                suggestions={allProducts}
                placeHolder="Search products..."
              />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-4 gap-3">
                <div className="flex gap-2 flex-wrap">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateParams({ category: cat, page: 1 })}
                      className={`px-4 py-2 rounded-md border text-sm font-medium ${
                        selectedCategory === cat
                          ? "bg-[#ACC572] text-white border-[#ACC572]"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                    >
                      {cat === "ALL" ? "All" : categoryLabel[cat]}
                    </button>
                  ))}
                </div>
                <CreateProductDialog onProductCreated={refreshProducts} />
              </div>

              <ProductTable
                products={products}
                currentPage={currentPage}
                onRefresh={refreshProducts}
              />

              <PaginationDashboard
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => updateParams({ page })}
              />
            </>
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

export default ProductList;
