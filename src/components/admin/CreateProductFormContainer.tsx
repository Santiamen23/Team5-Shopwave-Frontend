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
			setSubmitError(
				err instanceof Error ? err.message : "No se pudo crear el producto.",
			);
		}
	};

	return (
		<div className="space-y-4">
			{submitError || error ? (
				<div className="rounded-2xl border border-danger-500/30 bg-danger-50 p-4 text-sm text-danger-700">
					{submitError ?? error}
				</div>
			) : null}
			<CreateProductForm data={data} onChange={updateField} onSubmit={handleSubmit} />
		</div>
	);
}
