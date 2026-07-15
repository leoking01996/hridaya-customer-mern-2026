import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  _id: number;
  user_id: number;
  product_variant_id: number;
  image: string;
  qty: number;
  price: number;
  created_at: string;
  name: string;
  size: number;
  fragrance: string;
  color: string;
}

interface CartContextType {
  cartCount: number;
  cartList: CartItem[];
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartList, setCartList] = useState<CartItem[]>([]);

  const refreshCart = async () => {
    try {
      const userData = sessionStorage.getItem("user");

      if (!userData) {
        setCartCount(0);
        setCartList([]);
        return;
      }

      const userId = JSON.parse(userData).id;

      const res = await fetch(
        `https://hridaya-customer-backend-production.up.railway.app/api/auth/getCartList/${userId}`
      );

      const data = await res.json();

      console.log("Cart Response:", data);

      if (data.success) {
        const formattedCart = data.data.map((item: any) => ({
          ...item,
          qty: Number(item.quantity),
          price: Number(item.amount),
          image: `https://hridaya-customer-backend-production.up.railway.app/uploads/${item.image}`,
        }));

        setCartList(formattedCart);
        setCartCount(formattedCart.length);
      } else {
        setCartList([]);
        setCartCount(0);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartList([]);
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        cartList,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};