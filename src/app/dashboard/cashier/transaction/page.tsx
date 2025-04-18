"use client";

import React from "react";
import ProductGrid from "./_components/ProductGrid";
import CartSidebar from "./_components/CartSidebar";
import ClientLayout from "@/components/ClientLayout";

export default function CashierPage() {
  return (
    <ClientLayout>
      <div className="flex h-screen overflow-hidden">
        <div className="flex flex-1">
          <div className="w-2/3 border-r overflow-y-auto p-4">
            <ProductGrid />
          </div>

          <div className="w-1/3 p-4 bg-gray-50 overflow-y-auto">
            <CartSidebar />
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
