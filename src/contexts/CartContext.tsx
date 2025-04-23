// context/CartContext.tsx
import { ICartItem } from "@/types/cart";
import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

type CartItem = ICartItem & { quantity: number };

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ICartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  increaseQty: (productId: string) => void;
  decreaseQty: (productId: string) => void;
  triggerProductRefresh: () => void;
  productShouldRefresh: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productShouldRefresh, setProductShouldRefresh] = useState(false);

  const addToCart = (product: ICartItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        if (existing.quantity + 1 > product.stock) {
          toast.warning("You've reached the maximum available stock.");
          return prev;
        }

        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      if (product.stock < 1) {
        toast.error("This product is out of stock.");
        return prev;
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const increaseQty = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (productId: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const triggerProductRefresh = () => {
    setProductShouldRefresh(true);
    setTimeout(() => setProductShouldRefresh(false), 100);
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
        triggerProductRefresh,
        productShouldRefresh,
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
