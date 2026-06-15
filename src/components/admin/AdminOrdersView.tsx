"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
	AlertTriangle,
	CalendarDays,
	Inbox,
	MapPin,
	MoreHorizontal,
	Package,
	PackageCheck,
	Search,
	Truck,
} from "lucide-react";

import type { Order, OrderItem, OrderStatus } from "@/models/order.model";
import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/currency.util";
import { cn } from "@/lib/utils";
import * as adminOrderService from "@/services/admin-order.service";
import { CustomerAvatar } from "@/components/orders/CustomerAvatar";
import { SearchBar } from "@/components/ui/search-bar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const FILTER_OPTIONS: Array<{
	value: OrderStatus | "ALL";
	label: string;
}> = [
	{ value: "ALL", label: "Todas" },
	{ value: "PENDING", label: "Pendientes" },
	{ value: "PLACED", label: "Recibidas" },
	{ value: "CONFIRMED", label: "Confirmadas" },
	{ value: "SHIPPED", label: "Enviadas" },
	{ value: "DELIVERED", label: "Entregadas" },
	{ value: "CANCELLED", label: "Canceladas" },
];

interface AdminOrdersViewProps {
	initialOrders: Order[];
	jwt: string;
}

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

export default function AdminOrdersView({ initialOrders, jwt }: AdminOrdersViewProps) {
	const [orders, setOrders] = useState<Order[]>(
		Array.isArray(initialOrders) ? initialOrders : [],
	);
	const [loadingId, setLoadingId] = useState<number | null>(null);
	const [query, setQuery] = useState("");
	const [activeFilter, setActiveFilter] = useState<OrderStatus | "ALL">("ALL");
	const deferredQuery = useDeferredValue(query);

	const filteredOrders = useMemo(() => {
		const q = deferredQuery.trim().toLowerCase();
		return orders.filter((order) => {
			if (activeFilter !== "ALL" && order.orderStatus !== activeFilter) {
				return false;
			}
			if (!q) return true;
			const orderCode = `#${order.orderId || order.id}`.toLowerCase();
			const customerName = order.shippingAddress
				? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.toLowerCase()
				: "";
			return orderCode.includes(q) || customerName.includes(q);
		});
	}, [orders, activeFilter, deferredQuery]);

	const filterCounts = useMemo(() => {
		const counts: Record<OrderStatus | "ALL", number> = {
			ALL: orders.length,
			PENDING: 0,
			PLACED: 0,
			CONFIRMED: 0,
			SHIPPED: 0,
			DELIVERED: 0,
			CANCELLED: 0,
		};
		for (const order of orders) {
			counts[order.orderStatus] = (counts[order.orderStatus] ?? 0) + 1;
		}
		return counts;
	}, [orders]);

	const handleUpdateStatus = async (
		id: number,
		action: "confirm" | "ship" | "deliver" | "cancel",
	) => {
		setLoadingId(id);
		try {
			let updatedOrder: Order;
			if (action === "confirm")
				updatedOrder = await adminOrderService.confirmAdminOrder(id, jwt);
			else if (action === "ship")
				updatedOrder = await adminOrderService.shipAdminOrder(id, jwt);
			else if (action === "deliver")
				updatedOrder = await adminOrderService.deliverAdminOrder(id, jwt);
			else updatedOrder = await adminOrderService.cancelAdminOrder(id, jwt);

			setOrders((prev) => prev.map((o) => (o.id === id ? updatedOrder : o)));
		} catch (error) {
			alert("No se pudo actualizar el estado de la orden. Inténtalo de nuevo.");
			console.error(error);
		} finally {
			setLoadingId(null);
		}
	};

	const handleDeleteOrder = async (id: number) => {
		if (
			!confirm(
				"¿Estás seguro que deseas eliminar permanentemente esta orden del sistema?",
			)
		)
			return;
		setLoadingId(id);
		try {
			await adminOrderService.deleteAdminOrder(id, jwt);
			setOrders((prev) => prev.filter((o) => o.id !== id));
		} catch (error) {
			alert("Error al intentar eliminar la orden.");
			console.error(error);
		} finally {
			setLoadingId(null);
		}
	};

	return (
		<div className="space-y-4">
			<Card className="border-slate-200 bg-white">
				<CardContent className="space-y-3 p-4 sm:p-5">
					<SearchBar
						label="Buscar orden"
						placeholder="Buscar por código o nombre del cliente"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						resultText={`${filteredOrders.length} de ${orders.length} órdenes`}
					/>
					<div className="flex flex-wrap gap-2">
						{FILTER_OPTIONS.map((option) => {
							const isActive = activeFilter === option.value;
							const count = filterCounts[option.value] ?? 0;
							return (
								<button
									key={option.value}
									type="button"
									onClick={() => setActiveFilter(option.value)}
									className={cn(
										"inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
										isActive
											? "border-brand-600 bg-brand-600 text-white"
											: "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700",
									)}
								>
									{option.label}
									<span
										className={cn(
											"rounded-full px-1.5 text-[0.65rem] font-bold",
											isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500",
										)}
									>
										{count}
									</span>
								</button>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{filteredOrders.length === 0 ? (
				<Card className="border-slate-200 bg-white">
					<CardContent className="flex flex-col items-center gap-3 p-10 text-center">
						<div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-500">
							{orders.length === 0 ? (
								<Inbox className="h-6 w-6" />
							) : (
								<Search className="h-6 w-6" />
							)}
						</div>
						<div>
							<p className="text-sm font-semibold text-slate-700">
								{orders.length === 0
									? "No hay órdenes registradas."
									: "No hay órdenes que coincidan con tu búsqueda."}
							</p>
							<p className="mt-1 text-xs text-slate-500">
								{orders.length === 0
									? "Las nuevas órdenes aparecerán aquí."
									: "Prueba con otro estado o limpia el término de búsqueda."}
							</p>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-3">
					{filteredOrders.map((order) => {
						const statusConfig =
							STATUS_MAP[order.orderStatus] || {
								label: order.orderStatus,
								variant: "secondary" as const,
							};
						const orderTotal = getOrderTotal(order);
						const itemCount = getOrderItemCount(order);
						const isBusy = loadingId === order.id;
						const canCancel =
							order.orderStatus !== "DELIVERED" &&
							order.orderStatus !== "CANCELLED";
						const items = Array.isArray(order.orderItems) ? order.orderItems : [];

						return (
							<Card key={order.id} className="border-slate-200 bg-white">
								<CardContent className="space-y-3 p-4 sm:p-5">
									<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
										<div className="flex flex-wrap items-center gap-3">
											<div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
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
												{formatCurrency(orderTotal)}
											</span>
											<span className="text-xs text-slate-500">
												· {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
											</span>
										</div>
									</div>

									{order.shippingAddress ? (
										<div className="flex items-center gap-2 text-xs text-slate-600">
											<CustomerAvatar
												firstName={order.shippingAddress.firstName}
												lastName={order.shippingAddress.lastName}
												email={order.shippingAddress.mobile}
												role="ROLE_USER"
												size="sm"
											/>
										</div>
									) : null}

									<Separator className="bg-slate-100" />

									<ul className="space-y-2">
										{items.map((item) => (
											<AdminOrderItemRow key={item.id} item={item} />
										))}
									</ul>

									<div className="flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
										<div className="flex items-center gap-2 text-xs text-slate-500">
											<MapPin className="h-3.5 w-3.5 text-slate-400" />
											{order.shippingAddress
												? `${order.shippingAddress.streetAddress}, ${order.shippingAddress.city}`
												: "Sin dirección asignada"}
										</div>
										<div className="flex items-center gap-2">
											<Button
												size="sm"
												variant="outline"
												disabled={isBusy}
												onClick={() => handleUpdateStatus(order.id, "ship")}
												className="text-xs"
											>
												<Truck className="h-3.5 w-3.5" />
												Enviar
											</Button>
											<Button
												size="sm"
												variant="outline"
												disabled={isBusy}
												onClick={() => handleUpdateStatus(order.id, "deliver")}
												className="text-xs"
											>
												<PackageCheck className="h-3.5 w-3.5" />
												Entregar
											</Button>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon-sm"
														aria-label="Más acciones"
														disabled={isBusy}
													>
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
													{order.orderStatus === "PENDING" ? (
														<DropdownMenuItem
															onClick={() =>
																handleUpdateStatus(order.id, "confirm")
															}
														>
															<Package className="h-4 w-4" />
															Confirmar
														</DropdownMenuItem>
													) : null}
													<DropdownMenuItem
														onClick={() => handleUpdateStatus(order.id, "ship")}
													>
														<Truck className="h-4 w-4" />
														Marcar como enviada
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleUpdateStatus(order.id, "deliver")}
													>
														<PackageCheck className="h-4 w-4" />
														Marcar como entregada
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													{canCancel ? (
														<DropdownMenuItem
															onClick={() => handleUpdateStatus(order.id, "cancel")}
														>
															<AlertTriangle className="h-4 w-4" />
															Cancelar orden
														</DropdownMenuItem>
													) : null}
													<DropdownMenuItem
														variant="destructive"
														onClick={() => handleDeleteOrder(order.id)}
													>
														<AlertTriangle className="h-4 w-4" />
														Eliminar permanentemente
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}

function AdminOrderItemRow({ item }: { item: OrderItem }) {
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
