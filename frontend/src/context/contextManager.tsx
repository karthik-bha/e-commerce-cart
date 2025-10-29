import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ProductContextType {
  products: Product[];
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  refreshProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);


export const ProductProvider = ({ children }: { children: ReactNode }) => {

  const [products, setProducts] = useState<Product[]>([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchData();
  }, [])
  const fetchData = async () => {
    try {
      const [prodRes, cartRes] = await Promise.all([
        fetch(`${backendUrl}/api/products`),
        fetch(`${backendUrl}/api/cart`)
      ]);

      const prodData = await prodRes.json();
      const cartData = await cartRes.json();

      const updatedProducts = prodData.products.map((p: Product) => {
        const cartItem = cartData.cart?.find((item: any) => item.product._id === p._id);
        return { ...p, quantity: cartItem ? cartItem.quantity : 0 };
      });

      setProducts(updatedProducts);
    } catch (err) {
      console.error(err);
    }
  };

  const increaseQuantity = async (id: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/cart/${id}`, { method: "POST" });
      if (response.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Remove product from cart
  const decreaseQuantity = async (id: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/cart/${id}`, { method: "DELETE" });
      if (response.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <ProductContext.Provider
      value={{ products, increaseQuantity, decreaseQuantity, refreshProducts: fetchData }}>
      {children}
    </ProductContext.Provider>
  );
};


export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
