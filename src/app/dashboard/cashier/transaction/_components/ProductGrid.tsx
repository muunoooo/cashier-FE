// ProductGrid.tsx
import React, { useCallback, useEffect, useState } from "react";
import { getAllProducts } from "@/api/product";
import { IProduct } from "@/types/product";
import { formatRupiah } from "@/helpers/Currency";
import { ToTitleCase } from "@/helpers/ToTitleCase";
import Image from "next/image";
import PaginationDashboard from "@/components/PaginationDashboard";
import { useCart } from "@/contexts/CartContext";
import { PacmanLoader } from "react-spinners";

export default function ProductGrid() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    "FOOD" | "DRINK" | "ALL"
  >("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const limit = 12;
  const { addToCart } = useCart();

  const fetchProductData = useCallback(
    (page = 1, category: "FOOD" | "DRINK" | "ALL" = "ALL") => {
      setIsLoading(true);

      const filterCategory = category === "ALL" ? undefined : category;

      getAllProducts({
        page,
        limit,
        category: filterCategory,
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
    },
    [limit]
  );

  useEffect(() => {
    fetchProductData(currentPage, selectedCategory);
  }, [fetchProductData, currentPage, selectedCategory]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Menu</h2>

      <div className="flex gap-2 mb-4">
        {["ALL", "FOOD", "DRINK"].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat as "FOOD" | "DRINK" | "ALL");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg border ${
              selectedCategory === cat
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <PacmanLoader/>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  qty: 1, 
                })
              }
              className="p-4 rounded-lg bg-white shadow hover:bg-gray-100 border text-left"
            >
              <div className="w-full h-32 relative mb-2">
                <Image
                  src={product.imageUrl || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                />
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
          ))}
        </div>
      )}

      <PaginationDashboard
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
