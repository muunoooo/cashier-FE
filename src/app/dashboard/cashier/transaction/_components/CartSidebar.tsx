"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function CartSidebar() {
  const dummyCart = [
    { id: "1", name: "Espresso", price: 15000, qty: 2 },
    { id: "2", name: "Latte", price: 20000, qty: 1 },
  ];

  const total = dummyCart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4">Cart</h2>
      <div className="flex-1 space-y-3">
        {dummyCart.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b py-2">
            <div>
              <div className="text-sm">{item.name}</div>
              <div className="text-xs text-gray-500">x{item.qty}</div>
            </div>
            <div className="text-sm">Rp {(item.price * item.qty).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="flex justify-between font-semibold text-sm mb-3">
          <span>Total</span>
          <span>Rp {total.toLocaleString()}</span>
        </div>
        <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Pay Now</Button>
      </div>
    </div>
  );
}
