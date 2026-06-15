"use client";

import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminCreateProductPayload } from "@/models/product.model";
import { useState } from "react";
import { useProductForm } from "@/hooks/useCreateProductForm";
import { CreateProductForm, validateCreateProduct } from "./CreateProductForm";

interface CreatePopupProps {
	onCreate?: (payload: AdminCreateProductPayload) => Promise<unknown> | unknown;
}

export function CreatePopup({ onCreate }: CreatePopupProps) {
	const [createOpen, setCreateOpen] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { data, updateField, reset } = useProductForm();

	const handleCreateProduct = async () => {
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
			await onCreate?.(payload);
			reset();
			setCreateOpen(false);
		} catch (err) {
			setSubmitError(
				err instanceof Error ? err.message : "No se pudo crear el producto.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={createOpen} onOpenChange={(open) => {
			if (!open) {
				setSubmitError(null);
			}
			setCreateOpen(open);
		}}>
			<DialogTrigger asChild>
				<Button>
					<Plus />
					<span>Agregar Producto</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="w-[min(92vw,32rem)]">
				<div className="rounded-xl bg-gradient-to-br from-brand-50 to-white px-4 py-3">
					<DialogTitle>Crear nuevo producto</DialogTitle>
					<DialogDescription>
						Completa los datos del producto, incluyendo al menos una talla con
						stock.
					</DialogDescription>
				</div>
				<div className="max-h-[70vh] overflow-y-auto pr-1">
					<CreateProductForm
						data={data}
						onChange={updateField}
						onSubmit={() => void handleCreateProduct()}
						submitLabel={isSubmitting ? "Guardando..." : "Guardar producto"}
						externalError={submitError}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
