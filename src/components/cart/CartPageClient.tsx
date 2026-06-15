"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/utils/currency.util";

export default function CartPageClient() {
	const { cart, isLoading, error, updateQuantity, removeItem, clearCart } = useCart();
	const [statusMessage, setStatusMessage] = useState<string | null>(null);
	const [statusTone, setStatusTone] = useState<"success" | "error" | null>(null);
	const [busyItemId, setBusyItemId] = useState<number | null>(null);
	const [isClearing, setIsClearing] = useState(false);

	const hasItems = cart.cartItems.length > 0;

	function getAvailableItemQuantity(item: typeof cart.cartItems[number]) {
		const sizeEntry = item.product.sizes?.find((size) => size.name === item.size);
		return sizeEntry?.quantity ?? item.product.quantity;
	}

	function showSuccess(message: string) {
		setStatusTone("success");
		setStatusMessage(message);
	}

	function showError(message: string) {
		setStatusTone("error");
		setStatusMessage(message);
	}

	async function handleUpdateQuantity(cartItemId: number, nextQuantity: number) {
		setBusyItemId(cartItemId);
		setStatusMessage(null);

		try {
			await updateQuantity(cartItemId, nextQuantity);
			showSuccess(
				nextQuantity <= 0
					? "Producto eliminado del carrito."
					: "Cantidad actualizada correctamente.",
			);
		} catch (updateError) {
			showError(
				updateError instanceof Error
					? updateError.message
					: "No se pudo actualizar la cantidad.",
			);
		} finally {
			setBusyItemId(null);
		}
	}

	async function handleRemoveItem(cartItemId: number) {
		setBusyItemId(cartItemId);
		setStatusMessage(null);

		try {
			await removeItem(cartItemId);
			showSuccess("Producto eliminado del carrito.");
		} catch (removeError) {
			showError(
				removeError instanceof Error
					? removeError.message
					: "No se pudo eliminar el producto.",
			);
		} finally {
			setBusyItemId(null);
		}
	}

	async function handleClearCart() {
		setIsClearing(true);
		setStatusMessage(null);

		try {
			await clearCart();
			showSuccess("Carrito vaciado correctamente.");
		} catch (clearError) {
			showError(
				clearError instanceof Error
					? clearError.message
					: "No se pudo vaciar el carrito.",
			);
		} finally {
			setIsClearing(false);
		}
	}

	return (
		<main className="min-h-screen">
			<Navbar />
			<section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
				<div className="flex-1 space-y-6">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
							Tu selección
						</p>
						<h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
							Carrito
						</h1>
						<p className="mt-2 text-sm text-slate-600">
							Revisa tus productos antes de continuar al checkout.
						</p>
					</div>

							{error ? (
								<div className="rounded-2xl border border-warning-500/30 bg-warning-50 p-4 text-sm text-warning-700">
									{error}
								</div>
							) : null}

					{statusMessage ? (
						<div
							className={
								statusTone === "success"
									? "rounded-2xl border border-success-500/30 bg-success-50 p-4 text-sm text-success-700"
									: "rounded-2xl border border-danger-500/30 bg-danger-50 p-4 text-sm text-danger-700"
							}
						>
							{statusMessage}
						</div>
					) : null}

					{isLoading ? (
						<Card className="border-slate-200/80 bg-white/95">
							<CardContent className="p-6 text-sm text-slate-600">
								Cargando carrito...
							</CardContent>
						</Card>
					) : hasItems ? (
						<div className="space-y-4">
							{cart.cartItems.map((item) => {
								const availableQuantity = getAvailableItemQuantity(item);
								const isIncreaseDisabled =
									busyItemId === item.id ||
									availableQuantity <= 0 ||
									item.quantity >= availableQuantity;

								return (
									<Card
										key={item.id}
										className="border-slate-200/80 bg-white/95 transition-shadow hover:shadow-[0_18px_40px_-24px_oklch(0.43_0.18_245_/_0.35)]"
									>
										<CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
											<div className="relative h-28 w-full overflow-hidden rounded-2xl bg-slate-50 sm:h-24 sm:w-24 sm:shrink-0">
												<Image
													src={item.product.imageUrl}
													alt={item.product.title}
													fill
													className="object-cover"
													unoptimized
												/>
											</div>

											<div className="flex-1 space-y-2">
												<div>
													<p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
														{item.product.brand}
													</p>
													<h2 className="text-base font-semibold text-slate-950 sm:text-lg">
														{item.product.title}
													</h2>
												</div>
												<p className="text-sm text-slate-500">
													Talle:{" "}
													<span className="font-semibold text-slate-700">
														{item.size}
													</span>
												</p>
												<p className="text-sm text-slate-600">
													<span className="font-semibold text-slate-900">
														{formatCurrency(item.discountedPrice ?? 0)}
													</span>{" "}
													· {item.quantity} unidades
												</p>
											</div>

											<div className="flex flex-col gap-3 sm:items-end">
												<div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1">
													<Button
														type="button"
														variant="ghost"
														size="icon-sm"
														onClick={() =>
															void handleUpdateQuantity(
																item.id,
																item.quantity - 1,
															)
														}
														disabled={busyItemId === item.id}
														aria-label="Disminuir cantidad"
													>
														<Minus className="h-4 w-4" />
													</Button>
													<span className="min-w-10 px-3 text-center text-sm font-semibold text-slate-900">
														{item.quantity}
													</span>
													<Button
														type="button"
														variant="ghost"
														size="icon-sm"
														onClick={() =>
															void handleUpdateQuantity(
																item.id,
																item.quantity + 1,
															)
														}
														disabled={isIncreaseDisabled}
														aria-label="Aumentar cantidad"
													>
														<Plus className="h-4 w-4" />
													</Button>
												</div>

												<div className="flex items-center gap-3">
													<p className="text-sm font-semibold text-slate-950">
														{formatCurrency(item.discountedPrice ?? 0)}
													</p>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														className="text-danger-600 hover:bg-danger-50 hover:text-danger-700"
														onClick={() => void handleRemoveItem(item.id)}
														disabled={busyItemId === item.id}
													>
														<Trash2 className="mr-2 h-4 w-4" />
														{busyItemId === item.id
															? "Procesando..."
															: "Eliminar"}
													</Button>
												</div>
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>
					) : (
						<Card className="border-slate-200/80 bg-white">
							<CardContent className="flex flex-col items-center gap-4 p-8 text-center">
								<div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
									<ShoppingBag className="h-7 w-7" />
								</div>
								<div>
									<h2 className="text-xl font-semibold tracking-tight text-slate-950">
										Tu carrito está vacío
									</h2>
									<p className="mt-2 text-sm text-slate-600">
										Agrega productos desde el catálogo para empezar.
									</p>
								</div>
								<Button asChild>
									<Link href="/products">Ir al catálogo</Link>
								</Button>
							</CardContent>
						</Card>
					)}
				</div>

				<aside className="w-full lg:max-w-sm">
					<Card className="sticky top-24 border-brand-700 bg-brand-700 text-white">
						<div className="border-b border-white/15 px-5 py-4">
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-100">
								Resumen
							</p>
							<p className="mt-1 text-sm text-brand-100/90">
								Totales calculados sobre el carrito actual.
							</p>
						</div>
						<CardContent className="space-y-4 p-5">
							<dl className="space-y-3 text-sm text-brand-100">
								<div className="flex items-center justify-between">
									<dt>Productos</dt>
									<dd className="font-semibold text-white">
										{cart.totalItem}
									</dd>
								</div>
								<div className="flex items-center justify-between">
									<dt>Subtotal</dt>
									<dd className="font-medium text-white">
										{formatCurrency(cart.totalPrice)}
									</dd>
								</div>
								<div className="flex items-center justify-between">
									<dt>Descuento</dt>
									<dd className="font-semibold text-white">
										- {formatCurrency(cart.discounte)}
									</dd>
								</div>
								<div className="flex items-center justify-between border-t border-white/15 pt-3 text-base">
									<dt className="font-semibold text-white">Total final</dt>
									<dd className="text-lg font-semibold tracking-tight text-white">
										{formatCurrency(cart.totalDiscountedPrice)}
									</dd>
								</div>
							</dl>

							<div className="space-y-3">
								<Button
									asChild
									size="lg"
									className="w-full bg-white text-brand-700 hover:bg-brand-50 hover:text-brand-700"
									disabled={!hasItems}
								>
									<Link href="/checkout">
										Ir al checkout
										<ArrowRight className="h-4 w-4" />
									</Link>
								</Button>
								<Button
									type="button"
									size="lg"
									variant="outline"
									className="w-full border-white bg-slate-100 text-slate-900 hover:bg-white hover:text-brand-700"
									onClick={() => void handleClearCart()}
									disabled={!hasItems || isClearing}
								>
									{isClearing ? "Vaciando..." : "Vaciar carrito"}
								</Button>
							</div>
						</CardContent>
					</Card>
				</aside>
			</section>
		</main>
	);
}
