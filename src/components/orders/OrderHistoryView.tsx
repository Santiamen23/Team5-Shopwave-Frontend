"use client";

import { useState } from "react";
import {
	CalendarDays,
	Inbox,
	MapPin,
	ReceiptText,
} from "lucide-react";

import type { Order, OrderItem, OrderStatus } from "@/models/order.model";
import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/currency.util";

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

function getOrderTotal(order: Order): number {
	return order.orderItems.reduce((sum, item) => {
		const unitPrice = item.discountedPrice ?? item.price ?? 0;
		return sum + unitPrice * item.quantity;
	}, 0);
}

function getOrderItemCount(order: Order): number {
	return order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
}

function formatDate(dateStr: string | null) {
	if (!dateStr) return "Sin fecha";
	return new Date(dateStr).toLocaleDateString("es-ES", {
		year: "numeric",
		month: "short",
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

	if (safeOrders.length === 0) {
		return (
			<Card className="border-slate-200 bg-white">
				<CardContent className="flex flex-col items-center gap-3 p-10 text-center">
					<div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-500">
						<Inbox className="h-6 w-6" />
					</div>
					<div>
						<p className="text-sm font-semibold text-slate-700">
							Aún no tienes pedidos registrados.
						</p>
						<p className="mt-1 text-xs text-slate-500">
							Cuando completes una compra aparecerá aquí con sus productos.
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-3">
			{safeOrders.map((order) => {
				const statusConfig =
					STATUS_MAP[order.orderStatus] || {
						label: order.orderStatus,
						variant: "secondary" as const,
					};
				const orderTotal = getOrderTotal(order);
				const itemCount = getOrderItemCount(order);
				const isExpanded = expandedOrderId === order.id;
				const items = Array.isArray(order.orderItems) ? order.orderItems : [];

				return (
					<Card
						key={order.id}
						className="border-slate-200 bg-white"
					>
						<CardContent className="p-4 sm:p-5">
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex flex-wrap items-center gap-3">
									<div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
										<ReceiptText className="h-4 w-4 text-slate-400" />
										Pedido #{order.orderId || order.id}
									</div>
									<Badge variant={statusConfig.variant}>
										{statusConfig.label}
									</Badge>
									<span className="inline-flex items-center gap-1 text-xs text-slate-500">
										<CalendarDays className="h-3.5 w-3.5" />
										{formatDate(order.orderDate || order.createdAt)}
									</span>
								</div>
								<div className="flex items-baseline gap-2">
									<span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Total
									</span>
									<span className="text-lg font-semibold text-slate-950">
										{formatPrice(orderTotal)}
									</span>
									<span className="text-xs text-slate-500">
										· {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
									</span>
								</div>
							</div>

							<Separator className="my-3 bg-slate-100" />

							<ul className="space-y-2">
								{items.map((item) => (
									<OrderItemRow key={item.id} item={item} />
								))}
							</ul>

							<div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
								<Button
									variant="ghost"
									size="sm"
									onClick={() =>
										setExpandedOrderId(isExpanded ? null : order.id)
									}
									className="self-start text-xs font-semibold text-slate-600 hover:text-brand-700"
								>
									{isExpanded ? "Ocultar envío" : "Ver envío y pago"}
								</Button>
								<div className="flex items-center gap-2 text-xs text-slate-500">
									<MapPin className="h-3.5 w-3.5 text-slate-400" />
									{order.shippingAddress
										? `${order.shippingAddress.city}, ${order.shippingAddress.state}`
										: "Sin dirección asignada"}
								</div>
							</div>

							{isExpanded ? (
								<div className="mt-3 grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-2">
									<div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
										<p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
											Envío
										</p>
										{order.shippingAddress ? (
											<div className="mt-1 space-y-0.5">
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
												<p className="text-slate-500">
													{order.shippingAddress.mobile}
												</p>
											</div>
										) : (
											<p className="mt-1 italic text-slate-400">
												No hay dirección asignada.
											</p>
										)}
									</div>
									<div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
										<p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
											Pago
										</p>
										<div className="mt-1 space-y-0.5">
											<p>
												Método:{" "}
												<span className="font-semibold text-slate-800">
													{order.paymentDetails?.paymentMethod?.replace(
														"_",
														" ",
													) || "No especificado"}
												</span>
											</p>
											<p>
												Estado:{" "}
												<span
													className={cn(
														"font-semibold",
														order.paymentDetails?.status === "COMPLETED"
															? "text-success-700"
															: "text-warning-700",
													)}
												>
													{order.paymentDetails?.status === "COMPLETED"
														? "Pagado"
														: "Pendiente"}
												</span>
											</p>
											{order.deliveryDate ? (
												<p className="text-slate-500">
													Entregado el {formatDate(order.deliveryDate)}
												</p>
											) : null}
										</div>
									</div>
								</div>
							) : null}
						</CardContent>
					</Card>
				);
			})}

			{user ? (
				<p className="pt-2 text-center text-xs text-slate-500">
					{user.firstName}, aquí tienes el resumen de tus pedidos.
				</p>
			) : null}
		</div>
	);
}

function OrderItemRow({ item }: { item: OrderItem }) {
	const unitPrice = item.discountedPrice ?? item.price ?? 0;
	const hasDiscount =
		!!item.discountedPrice && !!item.price && item.discountedPrice < item.price;
	const image = item.product?.imageUrl || "/favicon.ico";

	return (
		<li className="flex items-center gap-3">
			<div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
				<img
					src={image}
					alt={item.product?.title || "Producto"}
					className="h-full w-full object-cover"
					onError={(e) => {
						(e.target as HTMLImageElement).src = "/favicon.ico";
					}}
				/>
			</div>
			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-semibold text-slate-900">
					{item.product?.title || "Producto"}
				</p>
				<p className="text-xs text-slate-500">
					Talla {item.size || "—"} · Cantidad {item.quantity}
				</p>
			</div>
			<div className="text-right">
				<p className="text-sm font-semibold text-slate-900">
					{formatCurrency(unitPrice * item.quantity)}
				</p>
				{hasDiscount ? (
					<p className="text-xs text-slate-400 line-through">
						{formatCurrency((item.price ?? 0) * item.quantity)}
					</p>
				) : null}
			</div>
		</li>
	);
}
