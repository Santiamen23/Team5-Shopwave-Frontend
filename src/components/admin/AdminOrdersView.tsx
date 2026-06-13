"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
	AlertTriangle,
	Banknote,
	CalendarDays,
	ChevronDown,
	CreditCard,
	Inbox,
	MapPin,
	MoreHorizontal,
	Package,
	PackageCheck,
	Search,
	Truck,
} from "lucide-react";

import type { Order, OrderStatus } from "@/models/order.model";
import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/currency.util";
import { cn } from "@/lib/utils";
import * as adminOrderService from "@/services/admin-order.service";
import { OrderStatusStepper } from "@/components/orders/OrderStatusStepper";
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
	variant: "brand" | "warning" | "info" | "success" | "danger" | "secondary";
}> = [
	{ value: "ALL", label: "Todas", variant: "brand" },
	{ value: "PENDING", label: "Pendientes", variant: "warning" },
	{ value: "PLACED", label: "Recibidas", variant: "info" },
	{ value: "CONFIRMED", label: "Confirmadas", variant: "info" },
	{ value: "SHIPPED", label: "Enviadas", variant: "info" },
	{ value: "DELIVERED", label: "Entregadas", variant: "success" },
	{ value: "CANCELLED", label: "Canceladas", variant: "danger" },
];

interface AdminOrdersViewProps {
	initialOrders: Order[];
	jwt: string;
}

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
	if (!dateStr) return "—";
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
	const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
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

	const stats = useMemo(() => computeStats(orders), [orders]);
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

	const toggleOrder = (id: number) => {
		setExpandedOrderId(expandedOrderId === id ? null : id);
	};

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

	if (!orders || orders.length === 0) {
		return (
			<div className="rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-white to-brand-50/40 p-12 text-center">
				<div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
					<Inbox className="h-7 w-7" />
				</div>
				<p className="mt-4 text-sm font-semibold text-slate-700">
					No hay ninguna orden registrada en la plataforma.
				</p>
				<p className="mt-1 text-xs text-slate-500">
					Las nuevas órdenes aparecerán aquí en tiempo real.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<StatsRow stats={stats} />

			<Card className="border-slate-200/80 bg-white/95 shadow-[0_18px_50px_-36px_oklch(0.18_0.02_250_/_0.35)]">
				<CardContent className="space-y-4 p-4 sm:p-5">
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
										"inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
										isActive
											? "border-transparent bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-[0_8px_24px_-12px_oklch(0.43_0.18_245_/_0.55)]"
											: "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
									)}
								>
									{option.label}
									<span
										className={cn(
											"rounded-full px-1.5 text-[0.65rem] font-bold",
											isActive
												? "bg-white/20 text-white"
												: "bg-slate-100 text-slate-500",
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
				<div className="rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-white to-brand-50/40 p-12 text-center">
					<div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-500">
						<Search className="h-5 w-5" />
					</div>
					<p className="mt-4 text-sm font-semibold text-slate-700">
						No hay órdenes que coincidan con tu búsqueda.
					</p>
					<p className="mt-1 text-xs text-slate-500">
						Prueba con otro estado o limpia el término de búsqueda.
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{filteredOrders.map((order) => {
						const isExpanded = expandedOrderId === order.id;
						const statusConfig =
							STATUS_MAP[order.orderStatus] || {
								label: order.orderStatus,
								variant: "secondary" as const,
							};
						const clientName = order.shippingAddress
							? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
							: "Sin nombre";
						void clientName;
						const clientEmail = order.shippingAddress?.mobile
							? order.shippingAddress.mobile
							: "";
						const orderTotal = calculateOrderTotal(order);
						const itemCount = getOrderItemCount(order);
						const isBusy = loadingId === order.id;
						const canCancel =
							order.orderStatus !== "DELIVERED" &&
							order.orderStatus !== "CANCELLED";

						return (
							<Card
								key={order.id}
								className={cn(
									"overflow-hidden border-slate-200/80 shadow-sm transition-all duration-200",
									"hover:border-brand-200 hover:shadow-[0_24px_60px_-36px_oklch(0.43_0.18_245_/_0.4)]",
									isExpanded &&
										"border-brand-200 shadow-[0_24px_60px_-36px_oklch(0.43_0.18_245_/_0.4)]",
								)}
							>
								<CardHeader className="bg-gradient-to-br from-white via-white to-brand-50/40 p-5 sm:p-6">
									<div className="flex flex-col gap-5">
										<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
											<div className="space-y-3">
												<div className="flex flex-wrap items-center gap-2">
													<span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-700">
														Pedido
													</span>
													<Badge variant={statusConfig.variant}>
														{statusConfig.label}
													</Badge>
												</div>
												<div className="flex flex-wrap items-center gap-3">
													<p className="text-2xl font-semibold tracking-tight text-slate-950">
														#{order.orderId || order.id}
													</p>
													<span className="text-xs text-slate-400">·</span>
													<span className="inline-flex items-center gap-1 text-xs text-slate-500">
														<CalendarDays className="h-3.5 w-3.5" />
														{formatDate(order.orderDate || order.createdAt)}
													</span>
													<span className="text-xs text-slate-400">·</span>
													<span className="inline-flex items-center gap-1 text-xs text-slate-500">
														<Package className="h-3.5 w-3.5" />
														{itemCount} {itemCount === 1 ? "artículo" : "artículos"}
													</span>
												</div>
												<CustomerAvatar
													firstName={
														order.shippingAddress?.firstName ?? "Sin"
													}
													lastName={order.shippingAddress?.lastName ?? "nombre"}
													email={clientEmail}
													role="ROLE_USER"
												/>
											</div>

											<div className="flex items-start gap-2 sm:flex-col sm:items-end">
												<div className="text-right">
													<span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-700">
														Total
													</span>
													<p className="text-2xl font-semibold tracking-tight text-gradient-brand sm:text-3xl">
														{formatCurrency(orderTotal)}
													</p>
												</div>
											</div>
										</div>

										<div className="rounded-2xl border border-slate-100 bg-white/80 p-3 sm:p-4">
											<OrderStatusStepper status={order.orderStatus} />
										</div>

										<div className="flex items-center justify-between gap-2">
											{canCancel ? (
												<Button
													size="sm"
													variant="destructive"
													disabled={isBusy}
													onClick={() =>
														handleUpdateStatus(order.id, "cancel")
													}
												>
													<AlertTriangle className="h-4 w-4" />
													Cancelar orden
												</Button>
											) : (
												<span className="text-xs text-slate-500">
													Orden {statusConfig.label.toLowerCase()}
												</span>
											)}

											<div className="flex items-center gap-2">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => toggleOrder(order.id)}
													className="text-xs font-semibold text-brand-700 hover:bg-brand-50"
												>
													{isExpanded ? "Ocultar" : "Detalles"}
													<ChevronDown
														className={cn(
															"h-4 w-4 transition-transform",
															isExpanded && "rotate-180",
														)}
													/>
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
																Confirmar orden
															</DropdownMenuItem>
														) : null}
														{order.orderStatus === "PLACED" ||
														order.orderStatus === "CONFIRMED" ? (
															<DropdownMenuItem
																onClick={() =>
																	handleUpdateStatus(order.id, "ship")
																}
															>
																<Truck className="h-4 w-4" />
																Marcar como enviada
															</DropdownMenuItem>
														) : null}
														{order.orderStatus === "SHIPPED" ? (
															<DropdownMenuItem
																onClick={() =>
																	handleUpdateStatus(order.id, "deliver")
																}
															>
																<PackageCheck className="h-4 w-4" />
																Marcar como entregada
															</DropdownMenuItem>
														) : null}
														{order.orderStatus === "DELIVERED" ? (
															<DropdownMenuItem disabled>
																<PackageCheck className="h-4 w-4" />
																Orden ya entregada
															</DropdownMenuItem>
														) : null}
														<DropdownMenuSeparator />
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
									</div>
								</CardHeader>

								{isExpanded ? (
									<CardContent className="space-y-6 border-t border-slate-100 bg-white p-5 sm:p-6">
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
													Artículos comprados
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
															<div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-brand-50 to-white">
																<img
																	src={
																		item.product?.imageUrl ||
																		"/favicon.ico"
																	}
																	alt={
																		item.product?.title || "Producto"
																	}
																	className="h-full w-full object-cover"
																	onError={(e) => {
																		(e.target as HTMLImageElement).src =
																			"/favicon.ico";
																	}}
																/>
															</div>
															<div className="min-w-0">
																<p className="truncate text-sm font-semibold text-slate-800">
																	{item.product?.title || "Producto"}
																</p>
																<p className="text-xs text-slate-500">
																	x{item.quantity} · {formatCurrency(
																		item.discountedPrice ?? item.price ?? 0,
																	)} c/u
																</p>
															</div>
														</div>
														<span className="text-sm font-semibold text-slate-900">
															{formatCurrency(
																(item.discountedPrice ?? item.price ?? 0) *
																	item.quantity,
															)}
														</span>
													</div>
												))}
											</div>
										</div>

										<Separator className="bg-slate-100" />

										<div className="grid gap-4 sm:grid-cols-2">
											<div className="space-y-2">
												<h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
													<MapPin className="h-3.5 w-3.5 text-brand-600" />
													Destinatario y Dirección
												</h4>
												{order.shippingAddress ? (
													<div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-brand-50/30 p-4 text-xs text-slate-600">
														<p className="font-semibold text-slate-800">
															{order.shippingAddress.firstName}{" "}
															{order.shippingAddress.lastName}
														</p>
														<p className="mt-0.5">
															{order.shippingAddress.streetAddress}
														</p>
														<p>
															{order.shippingAddress.city},{" "}
															{order.shippingAddress.state}{" "}
															{order.shippingAddress.zipCode}
														</p>
														<p className="mt-1 text-slate-500">
															Telf: {order.shippingAddress.mobile}
														</p>
													</div>
												) : (
													<p className="text-xs italic text-slate-400">
														Sin dirección guardada.
													</p>
												)}
											</div>
											<div className="space-y-2">
												<h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
													<CreditCard className="h-3.5 w-3.5 text-brand-600" />
													Pasarela de Pago
												</h4>
												<div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-brand-50/30 p-4 text-xs text-slate-600">
													<p>
														Método:{" "}
														<span className="font-semibold text-slate-800">
															{order.paymentDetails?.paymentMethod ||
																"No especificado"}
														</span>
													</p>
													<p className="mt-1">
														Estado:{" "}
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
																? "Acreditado"
																: "Pendiente"}
														</span>
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								) : null}
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}

interface AdminOrderStats {
	total: number;
	pending: number;
	inTransit: number;
	delivered: number;
	cancelled: number;
	totalRevenue: number;
}

function computeStats(orders: Order[]): AdminOrderStats {
	let pending = 0;
	let inTransit = 0;
	let delivered = 0;
	let cancelled = 0;
	let totalRevenue = 0;
	for (const order of orders) {
		switch (order.orderStatus) {
			case "PENDING":
			case "PLACED":
				pending += 1;
				break;
			case "CONFIRMED":
			case "SHIPPED":
				inTransit += 1;
				break;
			case "DELIVERED":
				delivered += 1;
				totalRevenue += calculateOrderTotal(order);
				break;
			case "CANCELLED":
				cancelled += 1;
				break;
		}
	}
	return {
		total: orders.length,
		pending,
		inTransit,
		delivered,
		cancelled,
		totalRevenue,
	};
}

function StatsRow({ stats }: { stats: AdminOrderStats }) {
	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			<AdminStatTile
				icon={<AlertTriangle className="h-4 w-4" />}
				label="Por confirmar"
				value={stats.pending}
				tone="warning"
			/>
			<AdminStatTile
				icon={<Truck className="h-4 w-4" />}
				label="En tránsito"
				value={stats.inTransit}
				tone="info"
			/>
			<AdminStatTile
				icon={<PackageCheck className="h-4 w-4" />}
				label="Entregadas"
				value={stats.delivered}
				tone="success"
			/>
			<AdminStatTile
				icon={<Banknote className="h-4 w-4" />}
				label="Ingresos"
				value={formatCurrency(stats.totalRevenue)}
				tone="brand"
			/>
		</div>
	);
}

function AdminStatTile({
	icon,
	label,
	value,
	tone,
}: {
	icon: React.ReactNode;
	label: string;
	value: string | number;
	tone: "brand" | "warning" | "info" | "success";
}) {
	const toneClasses: Record<typeof tone, string> = {
		brand: "from-brand-50 to-white text-brand-700",
		warning: "from-warning-50 to-white text-warning-700",
		info: "from-info-50 to-white text-info-700",
		success: "from-success-50 to-white text-success-700",
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
					"grid h-10 w-10 place-items-center rounded-xl bg-white ring-1",
					tone === "brand" && "text-brand-600 ring-brand-100",
					tone === "warning" && "text-warning-600 ring-warning-500/20",
					tone === "info" && "text-info-700 ring-info-500/20",
					tone === "success" && "text-success-600 ring-success-500/20",
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
