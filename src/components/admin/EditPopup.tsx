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
	FieldErrors,
	validateNumber,
	validateRequired,
	validateUrl,
} from "@/utils/validation.util";

interface EditPopupProps {
	product: Product;
	onEdit?: (product: Product) => Promise<Product> | Product | void;
}

interface EditFieldErrors extends FieldErrors {
	title?: string;
	description?: string;
	price?: string;
	discountedPrice?: string;
	discountPersent?: string;
	quantity?: string;
	brand?: string;
	color?: string;
	imageUrl?: string;
}

export function EditPopup({ product, onEdit }: EditPopupProps) {
	const [editOpen, setEditOpen] = useState(false);
	const [editData, setEditData] = useState(product);
	const [saving, setSaving] = useState(false);
	const [errors, setErrors] = useState<EditFieldErrors>({});

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

	function clearFieldError(field: keyof EditFieldErrors) {
		setErrors((prev) => {
			if (!prev[field]) {
				return prev;
			}
			const next: EditFieldErrors = { ...prev };
			delete next[field];
			return next;
		});
	}

	function validate(): EditFieldErrors {
		const next: EditFieldErrors = {};

		const titleError = validateRequired(editData.title);
		if (titleError) next.title = "El nombre es obligatorio.";

		const descriptionError = validateRequired(editData.description);
		if (descriptionError) next.description = "La descripción es obligatoria.";

		const priceError = validateNumber(editData.price, "El precio", { min: 0.01 });
		if (priceError) next.price = priceError;

		const discountedError = validateNumber(
			editData.discountedPrice,
			"El precio con descuento",
			{ min: 0 },
		);
		if (discountedError) {
			next.discountedPrice = discountedError;
		} else if (editData.discountedPrice > editData.price) {
			next.discountedPrice =
				"El precio con descuento no puede ser mayor al precio original.";
		}

		const discountError = validateNumber(editData.discountPersent, "El descuento", {
			min: 0,
			max: 100,
		});
		if (discountError) next.discountPersent = discountError;

		const quantityError = validateNumber(editData.quantity, "La cantidad", {
			min: 0,
		});
		if (quantityError) next.quantity = quantityError;

		const brandError = validateRequired(editData.brand);
		if (brandError) next.brand = "La marca es obligatoria.";

		const colorError = validateRequired(editData.color);
		if (colorError) next.color = "El color es obligatorio.";

		const imageError = validateUrl(editData.imageUrl);
		if (imageError) next.imageUrl = imageError;

		return next;
	}

	const handleSaveEdit = async () => {
		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
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
				<div className="rounded-xl bg-gradient-to-br from-brand-50 to-white px-4 py-3">
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
