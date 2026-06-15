'use client';

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormField, Input, Textarea } from "@/components/ui/input";
import { AdminCreateProductPayload, ProductSize } from "@/models/product.model";
import { validateCreateProduct } from "@/utils/product.validation";

interface ProductFormProps {
	data: AdminCreateProductPayload;
	onChange: <K extends keyof AdminCreateProductPayload>(
		field: K,
		value: AdminCreateProductPayload[K],
	) => void;
	onSubmit: () => void;
	submitLabel?: string;
	externalError?: string | null;
}

export function CreateProductForm({
	data,
	onChange,
	onSubmit,
	submitLabel = "Agregar Producto",
	externalError,
}: ProductFormProps) {
	const errors = validateCreateProduct(data);
	const hasErrors = Object.values(errors).some(Boolean);
	const sizes = data.size ?? [];

	function handleAddSize() {
		const newSizes: ProductSize[] = [
			...sizes,
			{ name: "", quantity: 1 },
		];
		onChange("size", newSizes);
	}

	function handleRemoveSize(index: number) {
		const next = sizes.filter((_, idx) => idx !== index);
		onChange("size", next);
	}

	function handleUpdateSize(
		index: number,
		field: keyof ProductSize,
		value: string | number,
	) {
		const next = sizes.map((size, idx) =>
			idx === index
				? {
						...size,
						[field]: field === "quantity"
							? Number(value) || 0
							: String(value),
					}
				: size,
		);
		onChange("size", next);
	}

	return (
		<div className="space-y-4">
			<FormField id="title" label="Nombre" required error={errors.title}>
				<Input
					id="title"
					type="text"
					value={data.title}
					onChange={(e) => onChange("title", e.target.value)}
					placeholder="Título del producto"
					invalid={Boolean(errors.title)}
				/>
			</FormField>

			<FormField
				id="description"
				label="Descripción"
				required
				error={errors.description}
				hint="Mínimo 10 caracteres. Describe brevemente el producto."
			>
				<Textarea
					id="description"
					value={data.description}
					onChange={(e) => onChange("description", e.target.value)}
					placeholder="Descripción del producto"
					rows={3}
					invalid={Boolean(errors.description)}
				/>
			</FormField>

			<div className="grid grid-cols-2 gap-3">
				<FormField id="price" label="Precio" required error={errors.price}>
					<Input
						id="price"
						type="number"
						min="0.01"
						step="0.01"
						value={data.price}
						onChange={(e) => onChange("price", Number(e.target.value) || 0)}
						placeholder="0.00"
						invalid={Boolean(errors.price)}
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
						min="0"
						max="100"
						step="1"
						value={data.discountPersent}
						onChange={(e) =>
							onChange("discountPersent", Number(e.target.value) || 0)
						}
						placeholder="0"
						invalid={Boolean(errors.discountPersent)}
					/>
				</FormField>
			</div>

			<FormField
				id="discountedPrice"
				label="Precio con descuento"
				required
				error={errors.discountedPrice}
			>
				<Input
					id="discountedPrice"
					type="number"
					min="0"
					step="0.01"
					value={data.discountedPrice}
					onChange={(e) =>
						onChange("discountedPrice", Number(e.target.value) || 0)
					}
					placeholder="0.00"
					invalid={Boolean(errors.discountedPrice)}
				/>
			</FormField>

			<FormField id="quantity" label="Cantidad" required error={errors.quantity}>
				<Input
					id="quantity"
					type="number"
					min="1"
					step="1"
					value={data.quantity}
					onChange={(e) => onChange("quantity", Number(e.target.value) || 0)}
					placeholder="0"
					invalid={Boolean(errors.quantity)}
				/>
			</FormField>

			<FormField id="brand" label="Marca" required error={errors.brand}>
				<Input
					id="brand"
					type="text"
					value={data.brand}
					onChange={(e) => onChange("brand", e.target.value)}
					placeholder="Marca"
					invalid={Boolean(errors.brand)}
				/>
			</FormField>

			<FormField id="color" label="Color" required error={errors.color}>
				<Input
					id="color"
					type="text"
					value={data.color}
					onChange={(e) => onChange("color", e.target.value)}
					placeholder="Color"
					invalid={Boolean(errors.color)}
				/>
			</FormField>

			<FormField
				id="imageUrl"
				label="URL de imagen"
				required
				error={errors.imageUrl}
				hint="Usa una URL válida con http:// o https://"
			>
				<Input
					id="imageUrl"
					type="text"
					value={data.imageUrl}
					onChange={(e) => onChange("imageUrl", e.target.value)}
					placeholder="https://..."
					invalid={Boolean(errors.imageUrl)}
				/>
			</FormField>

			<FormField
				id="topLevelCategory"
				label="Categoría principal"
				required
				error={errors.topLevelCategory}
			>
				<Input
					id="topLevelCategory"
					type="text"
					value={data.topLevelCategory}
					onChange={(e) => onChange("topLevelCategory", e.target.value)}
					placeholder="Categoría"
					invalid={Boolean(errors.topLevelCategory)}
				/>
			</FormField>

			<FormField
				id="secondLevelCategory"
				label="Categoría secundaria"
				required
				error={errors.secondLevelCategory}
			>
				<Input
					id="secondLevelCategory"
					type="text"
					value={data.secondLevelCategory}
					onChange={(e) => onChange("secondLevelCategory", e.target.value)}
					placeholder="Categoría"
					invalid={Boolean(errors.secondLevelCategory)}
				/>
			</FormField>

			<FormField
				id="thirdLevelCategory"
				label="Categoría terciaria"
				required
				error={errors.thirdLevelCategory}
			>
				<Input
					id="thirdLevelCategory"
					type="text"
					value={data.thirdLevelCategory}
					onChange={(e) => onChange("thirdLevelCategory", e.target.value)}
					placeholder="Categoría"
					invalid={Boolean(errors.thirdLevelCategory)}
				/>
			</FormField>

			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
							Tallas <span className="ml-1 text-danger-600">*</span>
						</p>
						<p className="text-xs text-slate-500">
							Agrega al menos una talla con su stock disponible.
						</p>
					</div>
					<Button
						type="button"
						size="sm"
						variant="secondary"
						onClick={handleAddSize}
					>
						<Plus className="h-4 w-4" />
						<span>Agregar talla</span>
					</Button>
				</div>

				{sizes.length === 0 ? (
					<div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4 text-center text-xs text-slate-500">
						Todavía no agregaste tallas. Necesitas al menos una para vender el
						producto.
					</div>
				) : (
					<div className="space-y-2">
						{sizes.map((size, index) => (
							<div
								key={`size-${index}`}
								className="flex items-end gap-2 rounded-xl border border-slate-200 bg-white p-3"
							>
								<div className="flex-1">
									<FormField id={`size-name-${index}`} label="Nombre">
										<Input
											id={`size-name-${index}`}
											type="text"
											value={size.name}
											onChange={(e) =>
												handleUpdateSize(index, "name", e.target.value)
											}
											placeholder="Ej: S, M, 256GB"
										/>
									</FormField>
								</div>
								<div className="w-28">
									<FormField id={`size-qty-${index}`} label="Cantidad">
										<Input
											id={`size-qty-${index}`}
											type="number"
											min="1"
											step="1"
											value={size.quantity}
											onChange={(e) =>
												handleUpdateSize(index, "quantity", e.target.value)
											}
											placeholder="0"
										/>
									</FormField>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									aria-label="Eliminar talla"
									className="text-danger-600 hover:bg-danger-50 hover:text-danger-700"
									onClick={() => handleRemoveSize(index)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						))}
					</div>
				)}

				{errors.sizes ? (
					<p className="mt-1.5 text-xs font-medium text-danger-600">
						{errors.sizes}
					</p>
				) : null}
			</div>

			{externalError ? (
				<div className="rounded-2xl border border-danger-500/30 bg-danger-50 p-3 text-sm text-danger-700">
					{externalError}
				</div>
			) : null}

			<Button
				type="button"
				onClick={onSubmit}
				className="w-full"
				size="lg"
				disabled={hasErrors}
			>
				{submitLabel}
			</Button>

			{hasErrors ? (
				<p className="text-center text-xs text-slate-500">
					Revisa los campos marcados antes de guardar el producto.
				</p>
			) : null}
		</div>
	);
}
