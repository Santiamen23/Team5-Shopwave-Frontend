"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useProductForm } from "@/hooks/useCreateProductForm";
import { useProducts } from "@/hooks/useProducts";
import { AdminCreateProductPayload } from "@/models/product.model";
import {
	sanitizeCreateVariants,
	validateCreateProduct,
} from "@/utils/product.validation";
import { CreateProductForm } from "./CreateProductForm";

export function CreateProductFormContainer() {
	const router = useRouter();
	const { data, updateField, reset } = useProductForm();
	const { createProduct, error } = useProducts();
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showErrors, setShowErrors] = useState(false);

	const handleSubmit = async () => {
		setSubmitError(null);
		setShowErrors(true);

		const validationErrors = validateCreateProduct(data);
		if (Object.values(validationErrors).some(Boolean)) {
			setSubmitError(
				"Completa todos los campos obligatorios antes de guardar el producto.",
			);
			return;
		}

		const payload: AdminCreateProductPayload = {
			...data,
			size: sanitizeCreateVariants(data.size),
		};

		setIsSubmitting(true);
		try {
			await createProduct(payload);
			reset();
			setShowErrors(false);
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
				showErrors={showErrors}
			/>
		</div>
	);
}
