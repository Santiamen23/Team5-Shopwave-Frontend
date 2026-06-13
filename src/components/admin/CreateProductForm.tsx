'use client';

import { Button } from "@/components/ui/button";
import { FormField, Input, Textarea } from "@/components/ui/input";
import { AdminCreateProductPayload } from "@/models/product.model";

interface ProductFormProps {
	data: AdminCreateProductPayload;
	onChange: <K extends keyof AdminCreateProductPayload>(
		field: K,
		value: AdminCreateProductPayload[K],
	) => void;
	onSubmit: () => void;
	submitLabel?: string;
}

export function CreateProductForm({
	data,
	onChange,
	onSubmit,
	submitLabel = "Agregar Producto",
}: ProductFormProps) {
	return (
		<div className="space-y-4">
			<FormField id="title" label="Nombre" required>
				<Input
					id="title"
					type="text"
					value={data.title}
					onChange={(e) => onChange("title", e.target.value)}
					placeholder="Título del producto"
				/>
			</FormField>
			<FormField id="description" label="Descripción" required>
				<Textarea
					id="description"
					value={data.description}
					onChange={(e) => onChange("description", e.target.value)}
					placeholder="Descripción del producto"
					rows={3}
				/>
			</FormField>
			<div className="grid grid-cols-2 gap-3">
				<FormField id="price" label="Precio" required>
					<Input
						id="price"
						type="number"
						value={data.price}
						onChange={(e) => onChange("price", Number(e.target.value) || 0)}
						placeholder="0.00"
					/>
				</FormField>
				<FormField id="discountPersent" label="Descuento %" required>
					<Input
						id="discountPersent"
						type="number"
						value={data.discountPersent}
						onChange={(e) =>
							onChange("discountPersent", Number(e.target.value) || 0)
						}
						placeholder="0"
					/>
				</FormField>
			</div>
			<FormField id="discountedPrice" label="Precio con descuento" required>
				<Input
					id="discountedPrice"
					type="number"
					value={data.discountedPrice}
					onChange={(e) =>
						onChange("discountedPrice", Number(e.target.value) || 0)
					}
					placeholder="0.00"
				/>
			</FormField>
			<FormField id="quantity" label="Cantidad" required>
				<Input
					id="quantity"
					type="number"
					value={data.quantity}
					onChange={(e) => onChange("quantity", Number(e.target.value) || 0)}
					placeholder="0"
				/>
			</FormField>
			<FormField id="brand" label="Marca" required>
				<Input
					id="brand"
					type="text"
					value={data.brand}
					onChange={(e) => onChange("brand", e.target.value)}
					placeholder="Marca"
				/>
			</FormField>
			<FormField id="color" label="Color" required>
				<Input
					id="color"
					type="text"
					value={data.color}
					onChange={(e) => onChange("color", e.target.value)}
					placeholder="Color"
				/>
			</FormField>
			<FormField id="imageUrl" label="URL de imagen" required>
				<Input
					id="imageUrl"
					type="text"
					value={data.imageUrl}
					onChange={(e) => onChange("imageUrl", e.target.value)}
					placeholder="https://..."
				/>
			</FormField>
			<FormField id="topLevelCategory" label="Categoría principal" required>
				<Input
					id="topLevelCategory"
					type="text"
					value={data.topLevelCategory}
					onChange={(e) => onChange("topLevelCategory", e.target.value)}
					placeholder="Categoría"
				/>
			</FormField>
			<FormField id="secondLevelCategory" label="Categoría secundaria" required>
				<Input
					id="secondLevelCategory"
					type="text"
					value={data.secondLevelCategory}
					onChange={(e) => onChange("secondLevelCategory", e.target.value)}
					placeholder="Categoría"
				/>
			</FormField>
			<FormField id="thirdLevelCategory" label="Categoría terciaria" required>
				<Input
					id="thirdLevelCategory"
					type="text"
					value={data.thirdLevelCategory}
					onChange={(e) => onChange("thirdLevelCategory", e.target.value)}
					placeholder="Categoría"
				/>
			</FormField>
			<Button onClick={onSubmit} className="w-full" size="lg">
				{submitLabel}
			</Button>
		</div>
	);
}
