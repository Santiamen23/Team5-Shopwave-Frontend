'use client'

import { useState } from "react";
import { AdminCreateProductPayload } from "@/models/product.model";

export const emptyProduct: AdminCreateProductPayload = {
  title: "",
  description: "",
  price: 0,
  discountedPrice: 0,
  discountPersent: 0,
  quantity: 0,
  brand: "",
  color: "",
  size: [],
  imageUrl: "",
  topLevelCategory: "",
  secondLevelCategory: "",
  thirdLevelCategory: "",
};

export function useProductForm(initialData: AdminCreateProductPayload = emptyProduct) {
  const [data, setData] = useState<AdminCreateProductPayload>(initialData);

  const updateField = <K extends keyof AdminCreateProductPayload>(
    field: K,
    value: AdminCreateProductPayload[K]
  ) => {
    setData((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "price" || field === "discountPersent") {
        const price = field === "price" ? Number(value) || 0 : prev.price;
        const rawDiscount = field === "discountPersent" ? Number(value) || 0 : prev.discountPersent;
        const safeDiscount = Math.max(0, Math.min(100, rawDiscount));
        next.discountedPrice = Math.round(price * (1 - safeDiscount / 100) * 100) / 100;
      }

      return next;
    });
  };

  const reset = () => setData(emptyProduct);

  return { data, setData, updateField, reset };
}