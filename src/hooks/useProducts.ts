'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  AdminCreateProductPayload,
  AdminUpdateProductPayload,
  Product,
} from "@/models/product.model";
import { useProductsContext } from "@/context/ProductContext";

function isForeignKeyError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("foreign key") ||
    message.includes("constraint") ||
    message.includes("cart_item") ||
    message.includes("could not execute statement")
  );
}

function friendlyDeleteError(error: unknown) {
  if (isForeignKeyError(error)) {
    return "No se puede eliminar el producto porque forma parte de uno o más carritos activos. Vacía los carritos que lo contienen o desactívalo en el backend antes de reintentar.";
  }

  return error instanceof Error
    ? error.message
    : "Error al eliminar el producto";
}

function getCategoryHierarchy(product: Product) {
  const thirdLevelCategory = product.category?.name ?? "";
  const secondLevelCategory = product.category?.parentCategory?.name ?? "";
  const topLevelCategory =
    product.category?.parentCategory?.parentCategory?.name ?? "";

  return {
    topLevelCategory,
    secondLevelCategory,
    thirdLevelCategory,
  };
}

function createUpdatePayload(product: Product): AdminUpdateProductPayload {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    discountedPrice: product.discountedPrice,
    discountPersent: product.discountPersent,
    quantity: product.quantity,
    brand: product.brand,
    color: product.color,
    imageUrl: product.imageUrl,
    ...getCategoryHierarchy(product),
  };
}

export function useProducts() {
  const router = useRouter();
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
      router.refresh();

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
      const payload = createUpdatePayload(product);
      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
      router.refresh();

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
      router.refresh();

      return data;
    } catch (err) {
      const message = friendlyDeleteError(err);

      setError(message);
      throw new Error(message);
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
