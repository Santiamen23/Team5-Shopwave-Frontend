"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, CreditCard, MapPin, ShoppingBag } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PaymentMethod } from "@/models/order.model";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/utils/currency.util";

const PAYMENT_METHODS: Array<{ value: PaymentMethod; label: string }> = [
	{ value: "CREDIT_CARD", label: "Tarjeta de crédito" },
	{ value: "DEBIT_CARD", label: "Tarjeta de débito" },
	{ value: "PAYPAL", label: "PayPal" },
];

interface ShippingFormState {
	firstName: string;
	lastName: string;
	streetAddress: string;
	city: string;
	state: string;
	zipCode: string;
	mobile: string;
}

interface PaymentFormState {
	method: PaymentMethod;
	cardholderName: string;
	cardNumber: string;
}

const EMPTY_SHIPPING: ShippingFormState = {
	firstName: "",
	lastName: "",
	streetAddress: "",
	city: "",
	state: "",
	zipCode: "",
	mobile: "",
};

const EMPTY_PAYMENT: PaymentFormState = {
	method: "CREDIT_CARD",
	cardholderName: "",
	cardNumber: "",
};

function isFilled(value: string) {
	return value.trim().length > 0;
}

function isValidCardNumber(value: string) {
	const digits = value.replace(/\s+/g, "");
	return /^\d{13,19}$/.test(digits);
}

export default function CheckoutPageClient() {
	const { user } = useAuth();
	const { cart, isLoading, checkout } = useCart();
	const [shipping, setShipping] = useState<ShippingFormState>(() => {
		if (!user) return EMPTY_SHIPPING;
		const saved = user.addresses?.[0];
		return {
			firstName: user.firstName ?? "",
			lastName: user.lastName ?? "",
			streetAddress: saved?.streetAddress ?? "",
			city: saved?.city ?? "",
			state: saved?.state ?? "",
			zipCode: saved?.zipCode ?? "",
			mobile: saved?.mobile ?? user.mobile ?? "",
		};
	});
	const [payment, setPayment] = useState<PaymentFormState>(EMPTY_PAYMENT);
	const [showShippingErrors, setShowShippingErrors] = useState(false);
	const [showPaymentErrors, setShowPaymentErrors] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [receipt, setReceipt] = useState<{ orderNumber: string; totalItems: number } | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [statusMessage, setStatusMessage] = useState<string | null>(null);

	const shippingErrors = useMemo(() => {
		const errors: Partial<Record<keyof ShippingFormState, string>> = {};
		if (!isFilled(shipping.firstName)) errors.firstName = "Ingresa tu nombre.";
		if (!isFilled(shipping.lastName)) errors.lastName = "Ingresa tu apellido.";
		if (!isFilled(shipping.streetAddress)) errors.streetAddress = "La dirección es obligatoria.";
		if (!isFilled(shipping.city)) errors.city = "Ingresa la ciudad.";
		if (!isFilled(shipping.state)) errors.state = "Ingresa el estado o departamento.";
		if (!isFilled(shipping.zipCode)) errors.zipCode = "Ingresa el código postal.";
		else if (!/^[\w\s-]{3,10}$/.test(shipping.zipCode.trim())) errors.zipCode = "Código postal inválido.";
		if (!isFilled(shipping.mobile)) errors.mobile = "Ingresa un celular de contacto.";
		else if (!/^\+?[\d\s-]{7,15}$/.test(shipping.mobile.trim())) errors.mobile = "Número de celular inválido.";
		return errors;
	}, [shipping]);

	const paymentErrors = useMemo(() => {
		const errors: Partial<Record<keyof PaymentFormState, string>> = {};
		if (payment.method === "CREDIT_CARD" || payment.method === "DEBIT_CARD") {
			if (!isFilled(payment.cardholderName)) errors.cardholderName = "Ingresa el titular de la tarjeta.";
			if (!isValidCardNumber(payment.cardNumber)) errors.cardNumber = "Número de tarjeta inválido (13 a 19 dígitos).";
		}
		return errors;
	}, [payment]);

	const shippingIsValid = Object.keys(shippingErrors).length === 0;
	const paymentIsValid = Object.keys(paymentErrors).length === 0;
	const canCheckout =
		cart.cartItems.length > 0 &&
		!isProcessing &&
		!receipt;

	function handleShippingChange(field: keyof ShippingFormState, value: string) {
		setShipping((prev) => ({ ...prev, [field]: value }));
	}

	function handlePaymentChange(field: keyof PaymentFormState, value: string) {
		setPayment((prev) => ({ ...prev, [field]: value as PaymentFormState[typeof field] }));
	}

	async function handleCheckout() {
		setError(null);
		setStatusMessage(null);

		if (!shippingIsValid) {
			setShowShippingErrors(true);
			setError("Completa los datos de envío antes de continuar.");
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
				shipping: {
					firstName: shipping.firstName,
					lastName: shipping.lastName,
					streetAddress: shipping.streetAddress,
					city: shipping.city,
					state: shipping.state,
					zipCode: shipping.zipCode,
					mobile: shipping.mobile,
				},
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
		<main className="min-h-screen bg-slate-50">
			<Navbar />

			<section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
				<div className="space-y-6">
					<div>
						<h1 className="text-3xl font-semibold text-slate-950">Checkout</h1>
						<p className="mt-2 text-sm text-slate-600">Confirma el pedido y finaliza tu compra.</p>
					</div>

					{receipt ? (
						<Card className="border-emerald-200 bg-emerald-50/80">
							<CardContent className="flex flex-col gap-4 p-6">
								<CheckCircle2 className="h-10 w-10 text-emerald-600" />
								<div>
									<h2 className="text-2xl font-semibold text-emerald-950">Compra confirmada</h2>
									<p className="mt-2 text-sm text-emerald-900">
										Tu orden <span className="font-semibold">{receipt.orderNumber}</span> fue generada correctamente.
									</p>
									<p className="mt-1 text-sm text-emerald-900">Productos procesados: {receipt.totalItems}</p>
								</div>
								<Button asChild className="w-fit">
									<Link href="/products">Seguir comprando</Link>
								</Button>
							</CardContent>
						</Card>
					) : null}

					{error ? (
						<div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
					) : null}

					{statusMessage ? (
						<div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
							{statusMessage}
						</div>
					) : null}

					<Card className="border-slate-200/70 bg-white/95">
						<CardHeader>
							<CardTitle>Datos de envío</CardTitle>
							<CardDescription>Estos campos se enviarán al backend en la orden.</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
							<Field
								id="firstName"
								label="Nombre"
								value={shipping.firstName}
								error={showShippingErrors ? shippingErrors.firstName : undefined}
								onChange={(value) => handleShippingChange("firstName", value)}
							/>
							<Field
								id="lastName"
								label="Apellido"
								value={shipping.lastName}
								error={showShippingErrors ? shippingErrors.lastName : undefined}
								onChange={(value) => handleShippingChange("lastName", value)}
							/>
							<Field
								id="streetAddress"
								label="Dirección"
								value={shipping.streetAddress}
								error={showShippingErrors ? shippingErrors.streetAddress : undefined}
								onChange={(value) => handleShippingChange("streetAddress", value)}
								className="sm:col-span-2"
							/>
							<Field
								id="city"
								label="Ciudad"
								value={shipping.city}
								error={showShippingErrors ? shippingErrors.city : undefined}
								onChange={(value) => handleShippingChange("city", value)}
							/>
							<Field
								id="state"
								label="Estado / Departamento"
								value={shipping.state}
								error={showShippingErrors ? shippingErrors.state : undefined}
								onChange={(value) => handleShippingChange("state", value)}
							/>
							<Field
								id="zipCode"
								label="Código postal"
								value={shipping.zipCode}
								error={showShippingErrors ? shippingErrors.zipCode : undefined}
								onChange={(value) => handleShippingChange("zipCode", value)}
							/>
							<Field
								id="mobile"
								label="Celular"
								value={shipping.mobile}
								error={showShippingErrors ? shippingErrors.mobile : undefined}
								onChange={(value) => handleShippingChange("mobile", value)}
								type="tel"
							/>
						</CardContent>
					</Card>

					<Card className="border-slate-200/70 bg-white/95">
						<CardHeader>
							<CardTitle>Método de pago</CardTitle>
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
											className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
												isActive
													? "border-slate-900 bg-slate-900 text-white"
													: "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
											}`}
										>
											{option.label}
										</button>
									);
								})}
							</div>

							{payment.method === "CREDIT_CARD" || payment.method === "DEBIT_CARD" ? (
								<div className="grid gap-4 sm:grid-cols-2">
									<Field
										id="cardholderName"
										label="Titular de la tarjeta"
										value={payment.cardholderName}
										error={showPaymentErrors ? paymentErrors.cardholderName : undefined}
										onChange={(value) => handlePaymentChange("cardholderName", value)}
									/>
									<Field
										id="cardNumber"
										label="Número de tarjeta"
										value={payment.cardNumber}
										error={showPaymentErrors ? paymentErrors.cardNumber : undefined}
										onChange={(value) => handlePaymentChange("cardNumber", value)}
										placeholder="4111 1111 1111 1111"
										inputMode="numeric"
									/>
								</div>
							) : (
								<div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
									<CreditCard className="h-5 w-5 text-slate-500" />
									<p>Serás redirigido a {payment.method === "PAYPAL" ? "PayPal" : "la pasarela"} para completar el pago.</p>
								</div>
							)}
						</CardContent>
					</Card>

					<Card className="border-slate-200/70 bg-white/95">
						<CardHeader>
							<CardTitle>Datos del cliente</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4 text-sm text-slate-600">
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
									<p className="text-xs uppercase tracking-[0.24em] text-slate-500">Cliente</p>
									<p className="mt-1 font-medium text-slate-950">{user?.firstName} {user?.lastName}</p>
								</div>
								<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
									<p className="text-xs uppercase tracking-[0.24em] text-slate-500">Correo</p>
									<p className="mt-1 font-medium text-slate-950">{user?.email}</p>
								</div>
							</div>

							<div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
								<MapPin className="h-5 w-5 text-slate-500" />
								<p>
									{shippingIsValid
										? "La dirección ingresada se enviará al backend en el payload de la orden."
										: "Completa los datos de envío para habilitar el botón de compra."}
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
					<Card className="sticky top-24 border-slate-200/70 bg-white/95">
						<CardHeader>
							<CardTitle>Total a pagar</CardTitle>
							<CardDescription>Confirmación final del pedido.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3 text-sm text-slate-600">
								<div className="flex items-center justify-between">
									<span>Subtotal</span>
									<span className="font-medium text-slate-950">{formatCurrency(cart.totalPrice)}</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Descuento</span>
									<span className="font-medium text-emerald-600">- {formatCurrency(cart.discounte)}</span>
								</div>
								<div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base">
									<span className="font-semibold text-slate-950">Total final</span>
									<span className="font-semibold text-slate-950">{formatCurrency(cart.totalDiscountedPrice)}</span>
								</div>
							</div>

							<Button
								type="button"
								className="w-full"
								onClick={() => void handleCheckout()}
								disabled={!canCheckout}
							>
								{isProcessing
									? "Procesando..."
									: receipt
										? "Compra realizada"
										: shippingIsValid && paymentIsValid
											? "Confirmar compra"
											: "Completa el formulario"}
							</Button>

							<Button asChild variant="outline" className="w-full">
								<Link href="/cart">Volver al carrito</Link>
							</Button>
						</CardContent>
					</Card>
				</aside>
			</section>
		</main>
	);
}

interface FieldProps {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	error?: string;
	type?: string;
	placeholder?: string;
	inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
	className?: string;
}

function Field({ id, label, value, onChange, error, type = "text", placeholder, inputMode, className }: FieldProps) {
	const hasError = Boolean(error);
	return (
		<div className={className}>
			<label htmlFor={id} className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
				{label}
			</label>
			<input
				id={id}
				type={type}
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				inputMode={inputMode}
				className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-all focus:ring-1 disabled:opacity-50 ${
					hasError
						? "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
						: "border-slate-200 focus:border-slate-900 focus:ring-slate-900"
				}`}
			/>
			{hasError ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
		</div>
	);
}
