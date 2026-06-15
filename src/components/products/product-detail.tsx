"use client";

import Image from "next/image";
import { useState } from "react";

import { Minus, Plus, ShoppingCart, Truck, ShieldCheck, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/models/product.model";
import { formatCurrency } from "@/utils/currency.util";

interface ProductDetailProps {
	product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
	const availableSizes = product.sizes ?? [];
	const [selectedSize, setSelectedSize] = useState(availableSizes[0]?.name ?? "");
	const [quantity, setQuantity] = useState(1);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { addItem, isLoading: isCartLoading } = useCart();

	function getStockForSize(sizeName: string) {
		return Math.max(
			availableSizes.find((size) => size.name === sizeName)?.quantity ??
				product.quantity,
			0,
		);
	}

	const hasDiscount = product.discountedPrice < product.price;
	const remainingStock = getStockForSize(selectedSize);

	function clampQuantity(value: number) {
		return Math.min(Math.max(value, 1), Math.max(remainingStock, 1));
	}

	function decrementQuantity() {
		setQuantity((current) => Math.max(1, current - 1));
	}

	function incrementQuantity() {
		setQuantity((current) => clampQuantity(current + 1));
	}

	function handleSelectSize(sizeName: string) {
		const nextStock = getStockForSize(sizeName);
		setSelectedSize(sizeName);
		setQuantity((current) => Math.min(Math.max(current, 1), Math.max(nextStock, 1)));
	}

	async function handleAddToCart() {
		setSubmitError(null);
		setSubmitSuccess(null);

		if (!selectedSize) {
			setSubmitError("Selecciona un talle antes de agregar el producto.");
			return;
		}

		if (remainingStock <= 0) {
			setSubmitError("Este talle no tiene stock disponible.");
			return;
		}

		setIsSubmitting(true);

		try {
			await addItem({
				product,
				size: selectedSize,
				quantity: clampQuantity(quantity),
			});
			setSubmitSuccess("Producto agregado al carrito correctamente.");
		} catch (error) {
			setSubmitError(
				error instanceof Error ? error.message : "No se pudo agregar el producto.",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	const isAddDisabled = isCartLoading || isSubmitting || remainingStock <= 0;
	const isIncreaseDisabled = remainingStock <= 0 || quantity >= remainingStock;

	return (
		<section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
			<div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
				<Card className="overflow-hidden border-slate-200/80 bg-white/95 xl:sticky xl:top-24">
					<div className="relative aspect-[4/3] bg-slate-50 p-4 sm:p-6 lg:p-8">
						{hasDiscount ? (
							<Badge
								variant="success"
								className="absolute top-4 right-4 z-10 shadow-md"
							>
								-{product.discountPersent}%
							</Badge>
						) : null}
						<div className="relative flex h-full min-h-[18rem] items-center justify-center overflow-hidden rounded-[1.5rem] bg-white/80 shadow-[0_20px_70px_-35px_oklch(0.18_0.02_250_/_0.35)] sm:min-h-[24rem] lg:rounded-[2rem]">
							<Image
								src={product.imageUrl}
								alt={product.title}
								fill
								unoptimized
								sizes="(max-width: 1024px) 100vw, 55vw"
								className="object-cover"
							/>
						</div>
					</div>
				</Card>

				<div className="space-y-6 lg:space-y-8">
					<Card className="border-slate-200/80 bg-white/95">
						<CardHeader className="space-y-4 p-5 sm:p-6 lg:p-7">
							<div className="flex flex-wrap items-center gap-2">
								<Badge variant="brand">{product.brand}</Badge>
								{product.category ? (
									<Badge variant="secondary">{product.category.name}</Badge>
								) : null}
								<Badge variant={remainingStock > 0 ? "success" : "danger"}>
									{remainingStock > 0
										? `${remainingStock} disponibles`
										: "Sin stock"}
								</Badge>
							</div>
							<div className="space-y-3">
								<CardTitle className="text-3xl leading-tight tracking-tight text-slate-950 sm:text-4xl">
									{product.title}
								</CardTitle>
								<CardDescription className="text-base leading-7 text-slate-600">
									{product.brand} · {product.color}
								</CardDescription>
							</div>
						</CardHeader>

						<CardContent className="space-y-6 p-5 sm:p-6 lg:p-7">
							<div className="flex flex-wrap items-end gap-3 sm:gap-4">
								<div className="space-y-1">
									<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-sm">
										Precio actual
									</p>
									<p className="text-3xl font-semibold tracking-tight text-brand-700 sm:text-4xl">
										{formatCurrency(product.discountedPrice)}
									</p>
								</div>
								{hasDiscount ? (
									<div className="space-y-1 pb-1">
										<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-sm">
											Antes
										</p>
										<p className="text-base text-slate-400 line-through sm:text-lg">
											{formatCurrency(product.price)}
										</p>
									</div>
								) : null}
							</div>

							<div className="grid gap-3 sm:grid-cols-3">
								<PerkItem icon={<Truck className="h-4 w-4" />} label="Envío 24-48h" />
								<PerkItem
									icon={<ShieldCheck className="h-4 w-4" />}
									label="Garantía oficial"
								/>
								<PerkItem
									icon={<RotateCcw className="h-4 w-4" />}
									label="Devolución 30d"
								/>
							</div>

							<Separator />

							<div className="space-y-4">
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-sm">
									Talles
								</p>
								<div className="flex flex-wrap gap-2 sm:gap-3">
									{availableSizes.length > 0 ? (
										availableSizes.map((size) => {
											const isSelected = selectedSize === size.name;
											const isDisabled = size.quantity <= 0;

											return (
												<Button
													key={size.name}
													type="button"
													variant={isSelected ? "default" : "secondary"}
													size="sm"
													disabled={isDisabled}
													onClick={() => handleSelectSize(size.name)}
													className="min-w-14 rounded-full sm:min-w-16"
												>
													{size.name}
												</Button>
											);
										})
									) : (
										<p className="text-sm text-slate-500">
											Este producto no tiene detalles cargados.
										</p>
									)}
								</div>
							</div>

							<div className="space-y-4">
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-sm">
									Cantidad
								</p>
								<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
									<div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1">
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											onClick={decrementQuantity}
											aria-label="Disminuir cantidad"
										>
											<Minus className="h-4 w-4" />
										</Button>
										<span className="min-w-12 px-2 text-center text-sm font-semibold text-slate-900">
											{quantity}
										</span>
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											onClick={incrementQuantity}
											disabled={isIncreaseDisabled}
											aria-label="Aumentar cantidad"
										>
											<Plus className="h-4 w-4" />
										</Button>
									</div>
									<p className="text-sm text-slate-500">
										Seleccionado:{" "}
										<span className="font-semibold text-slate-700">
											{selectedSize || "sin talle"}
										</span>
									</p>
								</div>
							</div>

							<div>
								<Button
									type="button"
									size="lg"
									className="w-full"
									onClick={() => void handleAddToCart()}
									disabled={isAddDisabled}
								>
									<ShoppingCart className="h-4 w-4" />
									{isSubmitting ? "Agregando..." : "Agregar al carrito"}
								</Button>
							</div>

							{submitError ? (
								<div className="rounded-2xl border border-danger-200 bg-danger-50 p-3 text-sm font-medium text-danger-700">
									{submitError}
								</div>
							) : null}

							{submitSuccess ? (
								<div className="rounded-2xl border border-success-500/30 bg-success-50 p-3 text-sm font-medium text-success-700">
									{submitSuccess}
								</div>
							) : null}
						</CardContent>
					</Card>

					<Card className="border-slate-200/80 bg-white/95">
						<CardHeader className="p-3 sm:p-4 lg:p-5">
							<CardTitle className="text-xl tracking-tight text-slate-950 sm:text-2xl">
								Información del producto
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4 p-2 text-sm leading-7 text-slate-600 sm:p-3 lg:p-4">
							<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
									Descripcion
								</p>
								<p className="mt-1 font-medium text-slate-900">
									{product.description}
								</p>
							</div>
							<div className="grid gap-3 sm:grid-cols-2">
								<InfoCell label="Marca" value={product.brand} />
								<InfoCell label="Color" value={product.color} />
								<InfoCell
									label="Valoraciones"
									value={`${product.numRatings} opiniones`}
								/>
								<InfoCell
									label="Existencias"
									value={`${product.quantity} unidades`}
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}

function PerkItem({ icon, label }: { icon: React.ReactNode; label: string }) {
	return (
		<div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
			<span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-50 text-brand-600">
				{icon}
			</span>
			{label}
		</div>
	);
}

function InfoCell({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-2xl border border-slate-200 bg-white p-4">
			<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
				{label}
			</p>
			<p className="mt-1 font-medium text-slate-900">{value}</p>
		</div>
	);
}
