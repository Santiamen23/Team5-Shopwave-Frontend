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
import { CreateProductForm } from "./CreateProductForm";

interface CreatePopupProps {
	onCreate?: (payload: AdminCreateProductPayload) => Promise<unknown> | unknown;
}

export function CreatePopup({ onCreate }: CreatePopupProps) {
	const [createOpen, setCreateOpen] = useState(false);
	const { data, updateField, reset } = useProductForm();

	const handleCreateProduct = async () => {
		await onCreate?.(data);
		reset();
		setCreateOpen(false);
	};

	return (
		<Dialog open={createOpen} onOpenChange={setCreateOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus />
					<span>Agregar Producto</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="w-[min(92vw,28rem)]">
				<div className="rounded-xl bg-gradient-to-br from-brand-50 to-white px-4 py-3">
					<DialogTitle>Crear nuevo producto</DialogTitle>
					<DialogDescription>
						Completa los datos base para registrar un producto en el inventario.
					</DialogDescription>
				</div>
				<div className="max-h-[70vh] overflow-y-auto pr-1">
					<CreateProductForm
						data={data}
						onChange={updateField}
						onSubmit={handleCreateProduct}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
