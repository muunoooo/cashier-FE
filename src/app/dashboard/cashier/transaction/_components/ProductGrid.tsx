import React, { useCallback, useEffect, useState } from "react";
import { getAllProducts } from "@/api/product";
import { IProduct } from "@/types/product";
import { formatRupiah } from "@/helpers/Currency";
import { ToTitleCase } from "@/helpers/ToTitleCase";
import Image from "next/image";
import PaginationDashboard from "@/components/PaginationDashboard";
import { useCart } from "@/contexts/CartContext";
import Loading from "@/components/loading";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBarDebounce from "@/components/SearchDebounce";

const limit = 12;

export default function ProductGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [allProducts, setAllProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);

  const currentPage = parseInt(searchParams.get("page") || "1");
  const selectedCategory = (searchParams.get("category")?.toUpperCase() ||
    "ALL") as "ALL" | "FOOD" | "DRINK";
  const searchQuery = searchParams.get("search") || "";

  const { addToCart,productShouldRefresh } = useCart();

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
    const filterCategory =
      selectedCategory === "ALL" ? undefined : selectedCategory;

    getAllProducts({
      page: currentPage,
      limit,
      category: filterCategory,
      search: searchQuery,
    })
      .then((response) => {
        setProducts(response.data);
        setTotalPages(response.pagination.totalPages);
      })
      .catch(() => {
        console.error("Failed to load product list");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentPage, selectedCategory, searchQuery]);

  useEffect(() => {
    fetchProductData();
  }, [currentPage, selectedCategory, searchQuery, fetchProductData]);

  useEffect(() => {
    if (productShouldRefresh) {
      fetchProductData();
    }
  }, [productShouldRefresh, fetchProductData]);

  const handleCategoryChange = (category: "ALL" | "FOOD" | "DRINK") => {
    updateParams({ category, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateParams({ page });
  };

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

  return (
    <div>
      <section>
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Menu</h2>
        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between mb-6">
          <SearchBarDebounce
            onSearch={handleSearch}
            onTyping={handleTyping}
            suggestions={allProducts}
            placeHolder="Search products..."
          />

          <div className="flex gap-4">
            {["ALL", "FOOD", "DRINK"].map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  handleCategoryChange(cat as "FOOD" | "DRINK" | "ALL")
                }
                className={`px-6 py-3 rounded-xl text-sm font-medium transition duration-300 
            ${
              selectedCategory === cat
                ? "bg-[#ACC572] text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-[#f1f1f1] focus:outline-none focus:ring-2 focus:ring-[#ACC572]"
            }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => {
            const isOutOfStock = product.stock === 0;

            return (
              <button
                key={product.id}
                onClick={() =>
                  !isOutOfStock &&
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    qty: 1,
                  })
                }
                disabled={isOutOfStock}
                className={`p-4 rounded-lg shadow text-left border transition duration-300 ${
                  isOutOfStock
                    ? "bg-gray-100 cursor-not-allowed opacity-70"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <div className="w-full h-32 relative mb-2">
                  <Image
                    src={product.imageUrl || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {isOutOfStock && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      Stok Habis
                    </div>
                  )}
                </div>

                <div className="text-sm font-medium">
                  {ToTitleCase(product.name)}
                </div>
                <div className="text-xs text-gray-600">
                  {formatRupiah(product.price)}
                </div>
                <div className="text-xs text-gray-600">
                  Stock {product.stock}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <PaginationDashboard
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
