"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import { Product } from "@/models/product.model";

interface ProductsContextValue {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(
  undefined
);

interface ProductsProviderProps {
  children: ReactNode;
  initialProducts?: Product[];
}

export function ProductsProvider({
  children,
  initialProducts = [],
}: ProductsProviderProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  return (
    <ProductsContext.Provider
      value={{
        products,
        setProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsContext() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error(
      "useProductsContext must be used within a ProductsProvider"
    );
  }

  return context;
}