"use client";

import React from "react";
import { AppSidebar } from "./app-sidebar";

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-shrink-0">
        <AppSidebar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-full md:w-2/3 lg:w-3/5 overflow-y-auto p-4 border-r">
          <div className="text-xl font-semibold mb-2">Menu</div>
          {children}
        </div>

        {/* Kanan: Daftar Produk + Pembayaran */}
        <div className="w-full md:w-1/3 lg:w-2/5 overflow-y-auto p-4 bg-gray-50">
          <div className="text-xl font-semibold mb-2">Cart & Payment</div>
          {/* Kamu bisa isi komponen <Cart /> di sini */}
        </div>
      </div>
    </div>
  );
}
