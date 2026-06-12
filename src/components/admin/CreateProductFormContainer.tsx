"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useProductForm } from "@/hooks/useCreateProductForm";
import { useProducts } from "@/hooks/useProducts";
import { CreateProductForm } from "./CreateProductForm";

export function CreateProductFormContainer() {
  const router = useRouter();
  const { data, updateField, reset } = useProductForm();
  const { createProduct, error } = useProducts();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitError(null);
    try {
      await createProduct(data);
      reset();
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "No se pudo crear el producto.");
    }
  };

  return (
    <div className="space-y-3">
      {submitError || error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError ?? error}
        </div>
      ) : null}
      <CreateProductForm data={data} onChange={updateField} onSubmit={handleSubmit} />
    </div>
  );
}
