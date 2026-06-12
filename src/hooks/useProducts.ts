'use client'

import { useState } from "react";

import {
  Product,
  AdminCreateProductPayload,
} from "@/models/product.model";
import { useProductsContext } from "@/context/ProductContext";

export function useProducts() {
  const { products, setProducts } = useProductsContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (
    payload: AdminCreateProductPayload
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setProducts(prev => [...prev, data]);

      return data as Product;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Error al crear el producto";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (
    product: Product
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setProducts((prev) =>
        prev.map((p) =>
          p.id === data.id ? data : p
        )
      );

      return data as Product;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Error al actualizar el producto";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (
    id: number
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setProducts((prev) =>
        prev.filter((p) => p.id !== id)
      );

      return data;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Error al eliminar el producto";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    setProducts,
  };
}