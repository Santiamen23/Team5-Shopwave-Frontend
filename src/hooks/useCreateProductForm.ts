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
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const reset = () => setData(emptyProduct);

  return { data, setData, updateField, reset };
}