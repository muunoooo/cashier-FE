"use client";

import React, { useEffect, useState } from "react";
import { getAllProducts } from "@/api/product";
import { IProduct } from "@/types/product";
import { formatRupiah } from "@/helpers/Currency";
import { ToTitleCase } from "@/helpers/ToTitleCase";

export default function ProductGrid() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    getAllProducts({ page: 1, limit: 100 }) 
      .then((res) => {
        setProducts(res.data);
      })
      .catch(() => {
        console.error("Failed to load product list");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Menu</h2>

      {isLoading ? (
        <p className="text-gray-600">Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <button
              key={product.id}
              className="p-4 rounded-lg bg-white shadow hover:bg-gray-100 border text-left"
            >
              <div className="text-sm font-medium">{ToTitleCase(product.name)}</div>
              <div className="text-xs text-gray-600">
                {formatRupiah(product.price)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
