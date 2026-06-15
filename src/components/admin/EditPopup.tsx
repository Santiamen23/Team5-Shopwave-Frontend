"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Input, Textarea } from "@/components/ui/input";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { Product } from "@/models/product.model";
import {
	EditProductFieldErrors,
	validateEditProduct,
} from "@/utils/product.validation";

interface EditPopupProps {
	product: Product;
	onEdit?: (product: Product) => Promise<Product> | Product | void;
}

export function EditPopup({ product, onEdit }: EditPopupProps) {
	const [editOpen, setEditOpen] = useState(false);
	const [editData, setEditData] = useState(product);
	const [saving, setSaving] = useState(false);
	const [errors, setErrors] = useState<EditProductFieldErrors>({});

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setEditData(product);
		setErrors({});
	}, [product]);

	const handleNumberChange = (field: keyof Product, value: string) => {
		const parsedValue = value === "" ? 0 : Number(value);
		setEditData((current) => ({
			...current,
			[field]: Number.isNaN(parsedValue) ? 0 : parsedValue,
		}));
	};

	function clearFieldError(field: keyof EditProductFieldErrors) {
		setErrors((prev) => {
			if (!prev[field]) {
				return prev;
			}
			const next: EditProductFieldErrors = { ...prev };
			delete next[field];
			return next;
		});
	}

	const handleSaveEdit = async () => {
		const validationErrors = validateEditProduct(editData);
		if (Object.values(validationErrors).some(Boolean)) {
			setErrors(validationErrors);
			return;
		}

		try {
			setSaving(true);
			setErrors({});
			await onEdit?.(editData);
			setEditOpen(false);
		} catch (err) {
			setErrors({
				title: err instanceof Error ? err.message : "No se pudo guardar el producto.",
			});
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog open={editOpen} onOpenChange={setEditOpen}>
			<DialogTrigger asChild>
				<Button size="sm" variant="secondary">
					<Edit />
					<span className="sr-only sm:not-sr-only sm:ml-1">Editar</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-[85vh] w-[min(92vw,36rem)] overflow-y-auto">
				<div className="rounded-xl bg-slate-50 px-4 py-3">
					<DialogTitle>Editar Producto</DialogTitle>
					<DialogDescription>
						Modifica la información principal del producto y guarda los cambios.
					</DialogDescription>
				</div>
				<div className="space-y-4">
					<FormField id="title" label="Nombre" required error={errors.title}>
						<Input
							id="title"
							type="text"
							value={editData.title}
							onChange={(e) => {
								setEditData({ ...editData, title: e.target.value });
								clearFieldError("title");
							}}
							invalid={Boolean(errors.title)}
						/>
					</FormField>
					<FormField id="description" label="Descripción" required error={errors.description}>
						<Textarea
							id="description"
							value={editData.description || ""}
							onChange={(e) => {
								setEditData({ ...editData, description: e.target.value });
								clearFieldError("description");
							}}
							rows={4}
							invalid={Boolean(errors.description)}
						/>
					</FormField>
					<div className="grid gap-4 sm:grid-cols-2">
						<FormField id="price" label="Precio" required error={errors.price}>
							<Input
								id="price"
								type="number"
								step="0.01"
								value={editData.price}
								onChange={(e) => {
									handleNumberChange("price", e.target.value);
									clearFieldError("price");
								}}
								invalid={Boolean(errors.price)}
							/>
						</FormField>
						<FormField
							id="discountedPrice"
							label="Precio con descuento"
							required
							error={errors.discountedPrice}
						>
							<Input
								id="discountedPrice"
								type="number"
								step="0.01"
								value={editData.discountedPrice}
								onChange={(e) => {
									handleNumberChange("discountedPrice", e.target.value);
									clearFieldError("discountedPrice");
								}}
								invalid={Boolean(errors.discountedPrice)}
							/>
						</FormField>
						<FormField
							id="discountPersent"
							label="Descuento %"
							required
							error={errors.discountPersent}
						>
							<Input
								id="discountPersent"
								type="number"
								step="0.01"
								value={editData.discountPersent}
								onChange={(e) => {
									handleNumberChange("discountPersent", e.target.value);
									clearFieldError("discountPersent");
								}}
								invalid={Boolean(errors.discountPersent)}
							/>
						</FormField>
						<FormField
							id="quantity"
							label="Cantidad"
							required
							error={errors.quantity}
						>
							<Input
								id="quantity"
								type="number"
								value={editData.quantity}
								onChange={(e) => {
									handleNumberChange("quantity", e.target.value);
									clearFieldError("quantity");
								}}
								invalid={Boolean(errors.quantity)}
							/>
						</FormField>
						<FormField id="brand" label="Marca" required error={errors.brand}>
							<Input
								id="brand"
								type="text"
								value={editData.brand}
								onChange={(e) => {
									setEditData({ ...editData, brand: e.target.value });
									clearFieldError("brand");
								}}
								invalid={Boolean(errors.brand)}
							/>
						</FormField>
						<FormField id="color" label="Color" required error={errors.color}>
							<Input
								id="color"
								type="text"
								value={editData.color}
								onChange={(e) => {
									setEditData({ ...editData, color: e.target.value });
									clearFieldError("color");
								}}
								invalid={Boolean(errors.color)}
							/>
						</FormField>
					</div>
					<FormField
						id="imageUrl"
						label="URL de imagen"
						required
						error={errors.imageUrl}
					>
						<Input
							id="imageUrl"
							type="text"
							value={editData.imageUrl}
							onChange={(e) => {
								setEditData({ ...editData, imageUrl: e.target.value });
								clearFieldError("imageUrl");
							}}
							invalid={Boolean(errors.imageUrl)}
						/>
					</FormField>
					<Button
						onClick={handleSaveEdit}
						className="w-full"
						size="lg"
						disabled={saving}
					>
						{saving ? "Guardando..." : "Guardar Cambios"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
