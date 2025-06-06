import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { createTransaction } from "@/api/transaction";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { getShift } from "@/api/shift";
import { useSession } from "@/contexts/SessionContext";
import { formatToRupiah } from "@/helpers/Currency";

export default function CartSidebar() {
  const { user } = useSession();
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    triggerProductRefresh,
  } = useCart();
  const resetPaymentForm = () => {
    setCashPaid(0);
    setFormattedCashPaid("");
    setDebitCardNo("");
    setPaymentMethod("CASH");
  };

  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "DEBIT">("CASH");
  const [cashPaid, setCashPaid] = useState<number>(0);
  const [debitCardNo, setDebitCardNo] = useState<string>("");

  const [shiftId, setShiftId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formattedCashPaid, setFormattedCashPaid] = useState<string>("");

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [change, setChange] = useState<number>(0);

  useEffect(() => {
    const fetchActiveShift = async () => {
      setLoading(true);
      try {
        const shiftData = await getShift();

        if (shiftData && shiftData.data) {
          const activeShiftId = shiftData.data.id;

          if (shiftData.message === "Active shift found" && activeShiftId) {
            setShiftId(activeShiftId);
          } else {
            toast.error("No active shift found.");
          }
        } else {
          toast.error("No shift data found.");
        }
      } catch (error) {
        console.error("Error fetching active shift:", error);
        toast.error("Failed to fetch active shift.");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveShift();
  }, []);

  useEffect(() => {
    if (cashPaid >= total) {
      const calculatedChange = cashPaid - total;
      setChange(calculatedChange);
    } else {
      setChange(0);
    }
  }, [cashPaid, total]);

  const handlePayment = async () => {
    if (paymentMethod === "CASH" && cashPaid < total) {
      toast.error("Insufficient cash paid!");
      return;
    }

    if (paymentMethod === "DEBIT" && !debitCardNo.trim()) {
      toast.error("Debit card number is required!");
      return;
    }

    if (!shiftId) {
      toast.error("Shift not found!");
      return;
    }

    const items = cart.map((item) => ({
      id: uuidv4(),
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }));

    const change =
      paymentMethod === "CASH" && cashPaid > total ? cashPaid - total : 0;

    setChange(change);

    const cashier = {
      id: user ? user.id : "default-cashier-id",
      name: user ? user.name : "Default Cashier",
    };

    const transactionData = {
      id: uuidv4(),
      paymentMethod,
      totalPrice: total,
      change: change,
      cashier,
      shift: {
        id: shiftId,
        startedAt: new Date().toISOString(),
        endedAt: null,
      },
      cashPaid: paymentMethod === "CASH" ? cashPaid : null,
      debitCardNo: paymentMethod === "DEBIT" ? debitCardNo : null,
      items,
      total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLoading(true);

    try {
      await createTransaction(shiftId, transactionData);
      toast.success("Transaction created successfully!");
      resetPaymentForm();
      clearCart();
      triggerProductRefresh();
    } catch (err) {
      console.error("Error creating transaction:", err);
      toast.error("Failed to create transaction.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleaned = rawValue.replace(/[^\d]/g, "");
    const numericValue = parseInt(cleaned, 10) || 0;
    setCashPaid(numericValue);
    setFormattedCashPaid(formatToRupiah(numericValue));
  };

  return (
    <div className="flex flex-col h-full p-4 sm:px-6 lg:px-8">
      <h2 className="text-lg font-semibold mb-4 text-center sm:text-left">
        Cart
      </h2>
      <div className="flex-1 space-y-3 ">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center py-2 border-b"
          >
            <div>
              <div className="text-sm">{item.name}</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  ➖
                </button>
                {item.quantity}
                <button
                  onClick={() => increaseQty(item.id)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  ➕
                </button>
              </div>
            </div>
            <div className="text-sm">
              Rp {(item.price * item.quantity).toLocaleString()}
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="flex justify-between font-semibold text-sm mb-3">
          <span>Total</span>
          <span>Rp {total.toLocaleString()}</span>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">
            Payment Method:
            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value as "CASH" | "DEBIT")
              }
              className="ml-2 p-2 border rounded w-full sm:w-auto"
            >
              <option value="CASH">Cash</option>
              <option value="DEBIT">Debit</option>
            </select>
          </label>
        </div>

        {paymentMethod === "CASH" && (
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Cash Paid:
              <input
                type="text"
                value={formattedCashPaid}
                onChange={handleChange}
                className="ml-2 p-2 border rounded w-full sm:w-auto"
                placeholder="Enter amount"
              />
            </label>
          </div>
        )}

        {paymentMethod === "DEBIT" && (
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Debit Card No:
              <input
                type="text"
                value={debitCardNo}
                onChange={(e) => setDebitCardNo(e.target.value)}
                className="ml-2 p-2 border rounded w-full sm:w-auto"
                placeholder="Enter card number"
              />
            </label>
          </div>
        )}

        {paymentMethod === "CASH" && change > 0 && (
          <div className="mt-2 text-sm text-green-500">
            <span>Change: Rp {change.toLocaleString()}</span>
          </div>
        )}

        <Button
          onClick={handlePayment}
          disabled={loading}
          className="mt-4 w-full sm:w-auto"
        >
          {loading ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </div>
  );
}
