"use client";

import React, { useEffect, useState } from "react";
import ProductGrid from "./_components/ProductGrid";
import CartSidebar from "./_components/CartSidebar";
import ClientLayout from "@/components/ClientLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkActiveShift, startShift } from "@/api/shift";
import { CartProvider } from "@/contexts/CartContext";
import { useSession } from "@/contexts/SessionContext";
import EndShiftDialog from "./_components/EndShiftDialog";
import { formatToRupiah, parseRupiahString } from "@/helpers/Currency";
import Loading from "@/components/loading";

export default function CashierPage() {
  const { isLoading: sessionLoading } = useSession();
  const [hasActiveShift, setHasActiveShift] = useState<boolean | null>(null);
  const [startCash, setStartCash] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchShift = async () => {
      try {
        const res = await checkActiveShift();
        setHasActiveShift(res.hasActiveShift);
      } catch (err) {
        console.error(err);
        
        setHasActiveShift(false);
      } finally {
        setLoading(false);
      }
    };

    if (!sessionLoading) {
      fetchShift();
    }
  }, [sessionLoading]);

  const handleStartShift = async () => {
    try {
      await startShift(startCash);
      setHasActiveShift(true);
    } catch (err) {
      console.error("Start shift error:", err);
    }
  };

  if (loading || sessionLoading) {
    return (
      <ClientLayout>
        <Loading />
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      {hasActiveShift ? (
        <CartProvider>
          <div className="flex flex-col h-screen">
            <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
              <div className="w-full md:w-2/3 border-r overflow-y-auto p-4">
                <ProductGrid />
                <EndShiftDialog onShiftEnded={() => setHasActiveShift(false)} />
              </div>
              <div className="w-full md:w-1/3 p-4 bg-gray-50 overflow-y-auto max-h-screen">
                <CartSidebar />
              </div>
            </div>
          </div>
        </CartProvider>
      ) : (
        <div className="h-screen flex items-center justify-center">
          <div className="p-6 border rounded-lg bg-white shadow-md max-w-sm w-full">
            <h3 className="text-md font-semibold mb-4">
              Ready to start working? 🐻
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Let&apos;s get to work and make today productive!
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium">Starting Cash</label>
              <Input
                type="text"
                inputMode="numeric"
                value={formatToRupiah(startCash)}
                onChange={(e) => {
                  const parsed = parseRupiahString(e.target.value);
                  setStartCash(parsed);
                }}
                placeholder="Contoh: 50.000"
                className="mt-2"
              />
            </div>
            <Button onClick={handleStartShift} className="w-full">
              Start Shift
            </Button>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
