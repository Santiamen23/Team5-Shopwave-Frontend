"use client";

import { useState } from "react";
import {
	Banknote,
	CalendarDays,
	ChevronDown,
	CreditCard,
	MapPin,
	Package,
	PackageCheck,
	ReceiptText,
	ShoppingBag,
	Truck,
} from "lucide-react";

import type { Order, OrderStatus } from "@/models/order.model";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { OrderStatusStepper } from "./OrderStatusStepper";
import { CustomerAvatar } from "./CustomerAvatar";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/currency.util";
import type { BadgeProps } from "@/components/ui/badge";

const STATUS_MAP: Record<
	OrderStatus,
	{ label: string; variant: NonNullable<BadgeProps["variant"]> }
> = {
	PENDING: { label: "Pendiente", variant: "warning" },
	PLACED: { label: "Recibido", variant: "info" },
	CONFIRMED: { label: "Confirmado", variant: "info" },
	SHIPPED: { label: "Enviado", variant: "info" },
	DELIVERED: { label: "Entregado", variant: "success" },
	CANCELLED: { label: "Cancelado", variant: "danger" },
};

function calculateOrderTotal(order: Order): number {
	return order.orderItems.reduce((sum, item) => {
		const unitPrice = item.discountedPrice ?? item.price ?? 0;
		return sum + unitPrice * item.quantity;
	}, 0);
}

function getOrderItemCount(order: Order): number {
	return order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
}

function formatDate(dateStr: string | null) {
	if (!dateStr) return "No disponible";
	return new Date(dateStr).toLocaleDateString("es-ES", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function formatPrice(value: number | null) {
	if (value === null) return "—";
	return formatCurrency(value);
}

interface OrderHistoryViewProps {
	orders: Order[];
	user?: { firstName: string; lastName: string; email: string } | null;
}

export default function OrderHistoryView({ orders, user }: OrderHistoryViewProps) {
	const safeOrders = Array.isArray(orders) ? orders : [];
	const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

	const toggleOrder = (id: number) => {
		setExpandedOrderId(expandedOrderId === id ? null : id);
	};

	const stats = computeStats(safeOrders);

	if (!safeOrders || safeOrders.length === 0) {
		return (
			<div className="space-y-4">
				{user ? (
					<Card className="border-slate-200/80 bg-white/95 shadow-[0_18px_50px_-36px_oklch(0.18_0.02_250_/_0.35)]">
						<CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
							<CustomerAvatar
								firstName={user.firstName}
								lastName={user.lastName}
								email={user.email}
								size="lg"
							/>
							<div className="flex items-center gap-2 text-sm text-slate-500">
								<ReceiptText className="h-4 w-4 text-brand-600" />
								Aún no tienes pedidos registrados.
							</div>
						</CardContent>
					</Card>
				) : null}
				<div className="rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-white to-brand-50/40 p-12 text-center">
					<div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
						<ShoppingBag className="h-7 w-7" />
					</div>
					<p className="mt-4 text-sm font-semibold text-slate-700">
						Aún no has realizado ningún pedido.
					</p>
					<p className="mt-1 text-xs text-slate-500">
						Cuando completes una compra aparecerá aquí con su estado y seguimiento.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{user ? <ProfileSummary user={user} stats={stats} /> : null}
			<StatsRow stats={stats} />

			<div className="space-y-4">
				{safeOrders.map((order) => {
					const isExpanded = expandedOrderId === order.id;
					const statusConfig =
						STATUS_MAP[order.orderStatus] || {
							label: order.orderStatus,
							variant: "secondary" as const,
						};
					const orderTotal = calculateOrderTotal(order);
					const itemCount = getOrderItemCount(order);

					return (
						<Card
							key={order.id}
							className={cn(
								"overflow-hidden border-slate-200/80 shadow-sm transition-all duration-200",
								"hover:border-brand-200 hover:shadow-[0_24px_60px_-36px_oklch(0.43_0.18_245_/_0.4)]",
								isExpanded && "border-brand-200 shadow-[0_24px_60px_-36px_oklch(0.43_0.18_245_/_0.4)]",
							)}
						>
							<CardHeader className="bg-gradient-to-br from-white via-white to-brand-50/40 p-5 sm:p-6">
								<div className="flex flex-col gap-5">
									<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
										<div className="space-y-1.5">
											<div className="flex flex-wrap items-center gap-2">
												<span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-700">
													Pedido
												</span>
												<Badge variant={statusConfig.variant}>
													{statusConfig.label}
												</Badge>
											</div>
											<p className="text-2xl font-semibold tracking-tight text-slate-950">
												#{order.orderId || order.id}
											</p>
											<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
												<span className="inline-flex items-center gap-1">
													<CalendarDays className="h-3.5 w-3.5" />
													{formatDate(order.orderDate || order.createdAt)}
												</span>
												<span className="inline-flex items-center gap-1">
													<Package className="h-3.5 w-3.5" />
													{itemCount} {itemCount === 1 ? "artículo" : "artículos"}
												</span>
											</div>
										</div>

										<div className="flex flex-col items-end gap-1">
											<span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-700">
												Total
											</span>
											<span className="text-2xl font-semibold tracking-tight text-gradient-brand sm:text-3xl">
												{formatPrice(orderTotal)}
											</span>
										</div>
									</div>

									<div className="rounded-2xl border border-slate-100 bg-white/80 p-3 sm:p-4">
										<OrderStatusStepper status={order.orderStatus} />
									</div>

									<div className="flex items-center justify-end">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => toggleOrder(order.id)}
											className="text-xs font-semibold text-brand-700 hover:bg-brand-50"
										>
											{isExpanded ? "Ocultar detalles" : "Ver detalles"}
											<ChevronDown
												className={cn(
													"h-4 w-4 transition-transform",
													isExpanded && "rotate-180",
												)}
											/>
										</Button>
									</div>
								</div>
							</CardHeader>

							{isExpanded ? (
								<CardContent className="space-y-6 border-t border-slate-100 bg-white p-5 sm:p-6">
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
												Artículos del Pedido
											</h4>
											<span className="text-xs text-slate-500">
												{order.orderItems?.length ?? 0}{" "}
												{order.orderItems?.length === 1 ? "línea" : "líneas"}
											</span>
										</div>
										<div className="divide-y divide-slate-100">
											{order.orderItems?.map((item) => (
												<div
													key={item.id}
													className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
												>
													<div className="flex min-w-0 items-center gap-4">
														<div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-brand-50 to-white">
															<img
																src={
																	item.product?.imageUrl || "/favicon.ico"
																}
																alt={item.product?.title || "Producto"}
																className="h-full w-full object-cover"
																onError={(e) => {
																	(e.target as HTMLImageElement).src =
																		"/favicon.ico";
																}}
															/>
														</div>
														<div className="min-w-0">
															<h5 className="truncate text-sm font-semibold text-slate-900">
																{item.product?.title ||
																	"Producto sin título"}
															</h5>
															<p className="mt-0.5 text-xs text-slate-500">
																Talla:{" "}
																<span className="font-medium text-slate-700">
																	{item.size || "Única"}
																</span>{" "}
																· Cantidad:{" "}
																<span className="font-medium text-slate-700">
																	{item.quantity}
																</span>
															</p>
														</div>
													</div>
													<div className="text-right">
														<span className="text-sm font-semibold text-slate-900">
															{formatPrice(
																(item.discountedPrice ?? item.price ?? 0) *
																	item.quantity,
															)}
														</span>
														{item.discountedPrice &&
															item.price &&
															item.discountedPrice < item.price && (
																<span className="block text-xs text-slate-400 line-through">
																	{formatPrice(
																		item.price * item.quantity,
																	)}
																</span>
															)}
													</div>
												</div>
											))}
										</div>
									</div>

									<Separator className="bg-slate-100" />

									<div className="grid gap-6 sm:grid-cols-2">
										<div className="space-y-2">
											<h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
												<MapPin className="h-3.5 w-3.5 text-brand-600" />
												Dirección de Entrega
											</h4>
											{order.shippingAddress ? (
												<div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-brand-50/30 p-4 text-sm text-slate-600">
													<p className="font-semibold text-slate-800">
														{order.shippingAddress.firstName}{" "}
														{order.shippingAddress.lastName}
													</p>
													<p>{order.shippingAddress.streetAddress}</p>
													<p>
														{order.shippingAddress.city},{" "}
														{order.shippingAddress.state}{" "}
														{order.shippingAddress.zipCode}
													</p>
													<p className="text-xs text-slate-500">
														{order.shippingAddress.mobile}
													</p>
												</div>
											) : (
												<p className="text-sm italic text-slate-400">
													No hay dirección asignada.
												</p>
											)}
										</div>

										<div className="space-y-2">
											<h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
												<CreditCard className="h-3.5 w-3.5 text-brand-600" />
												Método de Pago
											</h4>
											<div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-brand-50/30 p-4 text-sm text-slate-600">
												<p className="font-semibold text-slate-800">
													{order.paymentDetails?.paymentMethod?.replace(
														"_",
														" ",
													) || "No especificado"}
												</p>
												<p className="text-xs">
													Estado del pago:{" "}
													<span
														className={cn(
															"font-semibold",
															order.paymentDetails?.status ===
																"COMPLETED"
																? "text-success-700"
																: "text-warning-700",
														)}
													>
														{order.paymentDetails?.status === "COMPLETED"
															? "Pagado"
															: "Procesando / Pendiente"}
													</span>
												</p>
												{order.deliveryDate ? (
													<p className="pt-1 text-xs text-slate-500">
														Entregado el: {formatDate(order.deliveryDate)}
													</p>
												) : null}
											</div>
										</div>
									</div>
								</CardContent>
							) : null}
						</Card>
					);
				})}
			</div>
		</div>
	);
}

interface OrderStats {
	total: number;
	inProgress: number;
	delivered: number;
	cancelled: number;
	totalSpent: number;
}

function computeStats(orders: Order[]): OrderStats {
	let inProgress = 0;
	let delivered = 0;
	let cancelled = 0;
	let totalSpent = 0;
	for (const order of orders) {
		if (order.orderStatus === "CANCELLED") {
			cancelled += 1;
			continue;
		}
		if (order.orderStatus === "DELIVERED") {
			delivered += 1;
		} else {
			inProgress += 1;
		}
		totalSpent += calculateOrderTotal(order);
	}
	return {
		total: orders.length,
		inProgress,
		delivered,
		cancelled,
		totalSpent,
	};
}

function ProfileSummary({
	user,
	stats,
}: {
	user: { firstName: string; lastName: string; email: string };
	stats: OrderStats;
}) {
	const initials =
		`${(user.firstName || "").trim()[0] || ""}${(
			user.lastName || ""
		).trim()[0] || ""}`.toUpperCase() || "U";

	return (
		<div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-brand-600 to-info-700 px-5 py-6 shadow-[0_24px_60px_-32px_oklch(0.28_0.11_245_/_0.5)] sm:px-7 sm:py-7">
			<div className="bg-grid-faint absolute inset-0 opacity-25" />
			<div className="absolute -top-16 -right-12 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
			<div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-info-400/30 blur-3xl" />

			<div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-4">
					<div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white/15 text-base font-bold text-white ring-1 ring-white/25 backdrop-blur sm:h-16 sm:w-16 sm:text-lg">
						<span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(1_0_0_/_0.35),transparent_60%)]" />
						<span className="relative">{initials}</span>
					</div>
					<div className="min-w-0">
						<p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-100/90">
							Hola de nuevo
						</p>
						<p className="truncate text-xl font-semibold tracking-tight text-white sm:text-2xl">
							{user.firstName} {user.lastName}
						</p>
						<p className="truncate text-sm text-brand-100/80">{user.email}</p>
					</div>
				</div>

				<div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur sm:text-right">
					<p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-100/90">
						Tu actividad
					</p>
					<p className="mt-0.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
						{stats.total}
						<span className="ml-1.5 text-sm font-normal text-brand-100/80">
							{stats.total === 1 ? "pedido" : "pedidos"}
						</span>
					</p>
				</div>
			</div>
		</div>
	);
}

function StatsRow({ stats }: { stats: OrderStats }) {
	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			<StatTile
				icon={<Truck className="h-4 w-4" />}
				label="En proceso"
				value={stats.inProgress}
				tone="brand"
			/>
			<StatTile
				icon={<PackageCheck className="h-4 w-4" />}
				label="Entregados"
				value={stats.delivered}
				tone="success"
			/>
			<StatTile
				icon={<Banknote className="h-4 w-4" />}
				label="Total gastado"
				value={formatCurrency(stats.totalSpent)}
				tone="brand"
			/>
			<StatTile
				icon={<ShoppingBag className="h-4 w-4" />}
				label="Cancelados"
				value={stats.cancelled}
				tone="danger"
			/>
		</div>
	);
}

function StatTile({
	icon,
	label,
	value,
	tone,
}: {
	icon: React.ReactNode;
	label: string;
	value: string | number;
	tone: "brand" | "success" | "danger";
}) {
	const toneClasses: Record<typeof tone, string> = {
		brand: "from-brand-50 to-white text-brand-700",
		success: "from-success-50 to-white text-success-700",
		danger: "from-danger-50 to-white text-danger-700",
	};
	return (
		<div
			className={cn(
				"flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-gradient-to-br p-4 shadow-sm transition-shadow hover:shadow-md",
				toneClasses[tone],
			)}
		>
			<span
				className={cn(
					"grid h-10 w-10 place-items-center rounded-xl",
					tone === "brand" && "bg-white text-brand-600 ring-1 ring-brand-100",
					tone === "success" && "bg-white text-success-600 ring-1 ring-success-500/20",
					tone === "danger" && "bg-white text-danger-600 ring-1 ring-danger-500/20",
				)}
			>
				{icon}
			</span>
			<div>
				<p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] opacity-80">
					{label}
				</p>
				<p className="text-lg font-semibold tracking-tight">{value}</p>
			</div>
		</div>
	);
}
