"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useProductForm } from "@/hooks/useCreateProductForm";
import { useProducts } from "@/hooks/useProducts";
import { AdminCreateProductPayload } from "@/models/product.model";
import {
	CreateProductForm,
	validateCreateProduct,
} from "./CreateProductForm";

export function CreateProductFormContainer() {
	const router = useRouter();
	const { data, updateField, reset } = useProductForm();
	const { createProduct, error } = useProducts();
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		setSubmitError(null);

		const validationErrors = validateCreateProduct(data);
		if (Object.values(validationErrors).some(Boolean)) {
			setSubmitError(
				"Completa todos los campos obligatorios antes de guardar el producto.",
			);
			return;
		}

		const payload: AdminCreateProductPayload = {
			...data,
			size: data.size
				.map((size) => ({
					name: size.name.trim(),
					quantity: Math.max(0, Math.floor(size.quantity || 0)),
				}))
				.filter((size) => size.name.length > 0 && size.quantity > 0),
		};

		setIsSubmitting(true);
		try {
			await createProduct(payload);
			reset();
			router.refresh();
		} catch (err) {
			setSubmitError(
				err instanceof Error ? err.message : "No se pudo crear el producto.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-4">
			<CreateProductForm
				data={data}
				onChange={updateField}
				onSubmit={() => void handleSubmit()}
				submitLabel={isSubmitting ? "Guardando..." : "Agregar Producto"}
				externalError={submitError ?? error}
			/>
		</div>
	);
}
