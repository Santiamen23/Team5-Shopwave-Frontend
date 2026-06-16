"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, CreditCard, MapPin, ShoppingBag, Lock } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, Input } from "@/components/ui/input";
import type { PaymentMethod } from "@/models/order.model";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/utils/currency.util";
import { validatePaymentDetails } from "@/utils/checkout.validation";
import {
	ShippingAddressSelector,
	type AddressSelection,
} from "./ShippingAddressSelector";

const PAYMENT_METHODS: Array<{ value: PaymentMethod; label: string }> = [
	{ value: "CREDIT_CARD", label: "Tarjeta de crédito" },
	{ value: "DEBIT_CARD", label: "Tarjeta de débito" },
	{ value: "PAYPAL", label: "PayPal" },
];

interface PaymentFormState {
	method: PaymentMethod;
	cardholderName: string;
	cardNumber: string;
}

const EMPTY_PAYMENT: PaymentFormState = {
	method: "CREDIT_CARD",
	cardholderName: "",
	cardNumber: "",
};

export default function CheckoutPageClient() {
	const { user } = useAuth();
	const { cart, isLoading, checkout } = useCart();
	const [addressSelection, setAddressSelection] = useState<AddressSelection>(null);
	const [payment, setPayment] = useState<PaymentFormState>(EMPTY_PAYMENT);
	const [showShippingErrors, setShowShippingErrors] = useState(false);
	const [showPaymentErrors, setShowPaymentErrors] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [receipt, setReceipt] = useState<{ orderNumber: string; totalItems: number } | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [statusMessage, setStatusMessage] = useState<string | null>(null);

	const handleAddressChange = useCallback((selection: AddressSelection) => {
		setAddressSelection(selection);
	}, []);

	const paymentErrors = useMemo(
		() => validatePaymentDetails(payment.method, payment.cardholderName, payment.cardNumber),
		[payment.method, payment.cardholderName, payment.cardNumber],
	);

	const shippingIsValid = addressSelection !== null;
	const paymentIsValid = Object.keys(paymentErrors).length === 0;
	const canCheckout =
		cart.cartItems.length > 0 &&
		!isProcessing &&
		!receipt;

	function handlePaymentChange(field: keyof PaymentFormState, value: string) {
		setPayment((prev) => ({ ...prev, [field]: value as PaymentFormState[typeof field] }));
	}

	async function handleCheckout() {
		setError(null);
		setStatusMessage(null);

		if (!addressSelection) {
			setShowShippingErrors(true);
			setError("Selecciona o agrega una dirección de envío antes de continuar.");
			return;
		}

		if (!paymentIsValid) {
			setShowPaymentErrors(true);
			setError("Completa los datos de pago antes de continuar.");
			return;
		}

		setIsProcessing(true);

		try {
			const checkoutReceipt = await checkout({
				shipping: addressSelection.address,
				addressId:
					addressSelection.type === "existing"
						? addressSelection.addressId
						: undefined,
				paymentMethod: payment.method,
				cardholderName: payment.cardholderName,
				cardNumber: payment.cardNumber.replace(/\s+/g, ""),
			});
			setReceipt({
				orderNumber: checkoutReceipt.orderNumber,
				totalItems: checkoutReceipt.totalItems,
			});
			setStatusMessage("Compra completada y carrito vaciado correctamente.");
		} catch (checkoutError) {
			setError(checkoutError instanceof Error ? checkoutError.message : "No se pudo completar la compra.");
		} finally {
			setIsProcessing(false);
		}
	}

	return (
		<main className="min-h-screen">
			<Navbar />

			<section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
				<div className="space-y-6">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
							Pago seguro
						</p>
						<h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
							Checkout
						</h1>
						<p className="mt-2 text-sm text-slate-600">
							Confirma el pedido y finaliza tu compra.
						</p>
					</div>

					{receipt ? (
						<Card className="border-success-500/30 bg-success-50/80 shadow-[0_18px_50px_-36px_oklch(0.58_0.16_155_/_0.5)]">
							<CardContent className="flex flex-col gap-4 p-6">
								<div className="grid h-12 w-12 place-items-center rounded-2xl bg-success-500 text-white shadow-[0_8px_24px_-8px_oklch(0.58_0.16_155_/_0.6)]">
									<CheckCircle2 className="h-6 w-6" />
								</div>
								<div>
									<h2 className="text-2xl font-semibold tracking-tight text-success-700">Compra confirmada</h2>
									<p className="mt-2 text-sm text-success-700">
										Tu orden <span className="font-semibold">{receipt.orderNumber}</span> fue generada correctamente.
									</p>
									<p className="mt-1 text-sm text-success-700/90">Productos procesados: {receipt.totalItems}</p>
								</div>
								<Button asChild className="w-fit">
									<Link href="/products">Seguir comprando</Link>
								</Button>
							</CardContent>
						</Card>
					) : null}

					{error ? (
						<div className="rounded-2xl border border-danger-500/30 bg-danger-50 p-4 text-sm text-danger-700">{error}</div>
					) : null}

					{statusMessage ? (
						<div className="rounded-2xl border border-success-500/30 bg-success-50 p-4 text-sm text-success-700">
							{statusMessage}
						</div>
					) : null}

					<Card className="border-slate-200/80 bg-white/95 shadow-[0_18px_50px_-36px_oklch(0.18_0.02_250_/_0.35)]">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<MapPin className="h-4 w-4 text-brand-600" />
								Datos de envío
							</CardTitle>
							<CardDescription>
								{user?.addresses?.length
									? "Selecciona una dirección guardada o agrega una nueva."
									: "Agrega la dirección donde quieres recibir tu pedido."}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ShippingAddressSelector
								addresses={user?.addresses ?? []}
								userFirstName={user?.firstName}
								userLastName={user?.lastName}
								userMobile={user?.mobile}
								onChange={handleAddressChange}
								showErrors={showShippingErrors}
							/>
						</CardContent>
					</Card>

					<Card className="border-slate-200/80 bg-white/95 shadow-[0_18px_50px_-36px_oklch(0.18_0.02_250_/_0.35)]">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CreditCard className="h-4 w-4 text-brand-600" />
								Método de pago
							</CardTitle>
							<CardDescription>Selecciona cómo quieres pagar.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4 text-sm text-slate-600">
							<div className="grid gap-2 sm:grid-cols-3">
								{PAYMENT_METHODS.map((option) => {
									const isActive = payment.method === option.value;
									return (
										<button
											key={option.value}
											type="button"
											onClick={() => handlePaymentChange("method", option.value)}
											className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
												isActive
													? "border-transparent bg-brand-600 text-white"
													: "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
											}`}
										>
											{option.label}
										</button>
									);
								})}
							</div>

							{payment.method === "CREDIT_CARD" || payment.method === "DEBIT_CARD" ? (
								<div className="grid gap-4 sm:grid-cols-2">
									<FormField id="cardholderName" label="Titular de la tarjeta" required error={showPaymentErrors ? paymentErrors.cardholderName : undefined}>
										<Input
											id="cardholderName"
											value={payment.cardholderName}
											onChange={(event) => handlePaymentChange("cardholderName", event.target.value)}
											invalid={Boolean(showPaymentErrors && paymentErrors.cardholderName)}
										/>
									</FormField>
									<FormField id="cardNumber" label="Número de tarjeta" required error={showPaymentErrors ? paymentErrors.cardNumber : undefined}>
										<Input
											id="cardNumber"
											value={payment.cardNumber}
											onChange={(event) => handlePaymentChange("cardNumber", event.target.value)}
											placeholder="4111 1111 1111 1111"
											inputMode="numeric"
											invalid={Boolean(showPaymentErrors && paymentErrors.cardNumber)}
										/>
									</FormField>
								</div>
							) : (
								<div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
									<CreditCard className="h-5 w-5 text-brand-600" />
									<p>Serás redirigido a {payment.method === "PAYPAL" ? "PayPal" : "la pasarela"} para completar el pago.</p>
								</div>
							)}
						</CardContent>
					</Card>

					<Card className="border-slate-200/80 bg-white/95 shadow-[0_18px_50px_-36px_oklch(0.18_0.02_250_/_0.35)]">
						<CardHeader>
							<CardTitle>Datos del cliente</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4 text-sm text-slate-600">
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
									<p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-700">Cliente</p>
									<p className="mt-1 font-semibold text-slate-950">{user?.firstName} {user?.lastName}</p>
								</div>
								<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
									<p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-700">Correo</p>
									<p className="mt-1 font-semibold text-slate-950">{user?.email}</p>
								</div>
							</div>

							<div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
								<MapPin className="h-5 w-5 text-brand-600" />
								<p>
									{addressSelection
										? addressSelection.type === "existing"
											? "Usarás una dirección guardada. No se creará una nueva."
											: "Esta dirección se usará solo para este pedido."
										: "Selecciona o agrega una dirección de envío para habilitar el botón de compra."}
								</p>
							</div>

							{isLoading ? (
								<p className="text-sm text-slate-600">Cargando carrito...</p>
							) : cart.cartItems.length === 0 ? (
								<div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
									<ShoppingBag className="h-5 w-5 text-slate-500" />
									<div>
										<p className="font-medium text-slate-950">No hay productos para pagar.</p>
										<p className="text-sm text-slate-600">Regresa al catálogo y agrega artículos primero.</p>
									</div>
								</div>
							) : (
								<div className="grid gap-3 sm:grid-cols-2">
									{cart.cartItems.slice(0, 2).map((item) => (
										<div key={item.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
											<div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
												<Image src={item.product.imageUrl} alt={item.product.title} fill className="object-cover" unoptimized />
											</div>
											<div className="min-w-0">
												<p className="truncate text-sm font-medium text-slate-950">{item.product.title}</p>
												<p className="text-xs text-slate-600">Talle {item.size} · {item.quantity} und.</p>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				<aside className="w-full">
					<Card className="sticky top-24 overflow-hidden border-brand-700 bg-brand-700 text-white">
						<div className="border-b border-white/15 px-5 py-4">
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-100">Total a pagar</p>
							<p className="mt-1 text-sm text-brand-100/90">Confirmación final del pedido.</p>
						</div>
						<CardContent className="space-y-4 p-5">
							<div className="space-y-3 text-sm text-brand-100">
								<div className="flex items-center justify-between">
									<span>Subtotal</span>
									<span className="font-medium text-white">{formatCurrency(cart.totalPrice)}</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Descuento</span>
									<span className="font-semibold text-white">- {formatCurrency(cart.discounte)}</span>
								</div>
								<div className="flex items-center justify-between border-t border-white/15 pt-3 text-base">
									<span className="font-semibold text-white">Total final</span>
									<span className="text-lg font-semibold tracking-tight text-white">{formatCurrency(cart.totalDiscountedPrice)}</span>
								</div>
							</div>

							<Button
								type="button"
								size="lg"
								className="w-full bg-white text-brand-700 hover:bg-brand-50 hover:text-brand-700"
								onClick={() => void handleCheckout()}
								disabled={!canCheckout}
							>
								<Lock className="h-4 w-4" />
								{isProcessing
									? "Procesando..."
									: receipt
										? "Compra realizada"
										: shippingIsValid && paymentIsValid
											? "Confirmar compra"
											: "Completa el formulario"}
							</Button>

							<Button
								asChild
								size="lg"
								variant="outline"
								className="w-full border-white bg-slate-100 text-slate-900 hover:bg-white hover:text-brand-700"
							>
								<Link href="/cart">Volver al carrito</Link>
							</Button>
						</CardContent>
					</Card>
				</aside>
			</section>
		</main>
	);
}
