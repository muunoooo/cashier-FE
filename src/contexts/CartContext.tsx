// context/CartContext.tsx
import { ICartItem } from "@/types/cart";
import { createContext, useContext, useState } from "react";

// Mengubah CartItem untuk menggunakan id bertipe string
type CartItem = ICartItem & { quantity: number };

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ICartItem) => void;
  removeFromCart: (productId: string) => void;  // ubah productId ke string
  clearCart: () => void;
  increaseQty: (productId: string) => void;  // ubah productId ke string
  decreaseQty: (productId: string) => void;  // ubah productId ke string
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: ICartItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {  // ubah productId ke string
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const increaseQty = (productId: string) => {  // ubah productId ke string
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (productId: string) => {  // ubah productId ke string
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0) // Menghapus item jika quantity <= 0
    );
  };
  

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQty,
        decreaseQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
