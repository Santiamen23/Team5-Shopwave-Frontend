"use client";

import { useState } from "react";
import type { Order, OrderStatus } from "@/models/order.model";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/currency.util";

const STATUS_MAP: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "outline" }> = {
  PENDING: { label: "Pendiente", variant: "outline" },
  PLACED: { label: "Recibido", variant: "secondary" },
  CONFIRMED: { label: "Confirmado", variant: "secondary" },
  SHIPPED: { label: "Enviado", variant: "default" },
  DELIVERED: { label: "Entregado", variant: "default" },
  CANCELLED: { label: "Cancelado", variant: "outline" },
};

export default function OrderHistoryView({ orders }: { orders: Order[] }) {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const toggleOrder = (id: number) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const formatPrice = (value: number | null) => {
    if (value === null) return "—";
    return formatCurrency(value);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "No disponible";
    return new Date(dateStr).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm italic text-slate-500">Aún no has realizado ningún pedido.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const isExpanded = expandedOrderId === order.id;
        const statusConfig = STATUS_MAP[order.orderStatus] || { label: order.orderStatus, variant: "outline" };

        return (
          <Card key={order.id} className="overflow-hidden border-slate-200/80 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="bg-slate-50/50 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="grid grid-cols-2 gap-4 sm:flex sm:gap-8">
                  <div>
                    <span className="block text-xs font-medium uppercase tracking-wider text-slate-400">Código de Pedido</span>
                    <span className="text-sm font-semibold text-slate-800">#{order.orderId || order.id}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium uppercase tracking-wider text-slate-400">Fecha de Compra</span>
                    <span className="text-sm font-medium text-slate-700">{formatDate(order.orderDate || order.createdAt)}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium uppercase tracking-wider text-slate-400">Total</span>
                    <span className="text-sm font-bold text-slate-900">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <Badge variant={statusConfig.variant} className="px-2.5 py-0.5 text-xs font-semibold shadow-sm">
                    {statusConfig.label}
                  </Badge>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleOrder(order.id)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    {isExpanded ? "Ocultar detalles" : "Ver detalles"}
                  </Button>
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="border-t border-slate-100 p-5 sm:p-6 bg-white space-y-6 animate-in fade-in duration-200">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Artículos del Pedido</h4>
                  <div className="divide-y divide-slate-100">
                    {order.orderItems?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                            <img
                              src={item.product?.imageUrl || "/favicon.ico"} 
                              alt={item.product?.title || "Producto"}
                              className="h-full w-full object-cover object-center"
                              onError={(e) => { (e.target as HTMLImageElement).src = "/favicon.ico" }}
                            />
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-slate-900">{item.product?.title || "Producto sin título"}</h5>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Talla: <span className="font-medium text-slate-700">{item.size || "Única"}</span> • Cantidad: <span className="font-medium text-slate-700">{item.quantity}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-slate-900">
                            {formatPrice((item.discountedPrice ?? item.price ?? 0) * item.quantity)}
                          </span>
                          {item.discountedPrice && item.price && item.discountedPrice < item.price && (
                            <span className="block text-xs text-slate-400 line-through">
                              {formatPrice(item.price * item.quantity)}
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
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Dirección de Entrega</h4>
                    {order.shippingAddress ? (
                      <div className="text-sm text-slate-600 space-y-0.5">
                        <p className="font-medium text-slate-800">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                        <p>{order.shippingAddress.streetAddress}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                        <p className="text-xs text-slate-400 mt-1"> {order.shippingAddress.mobile}</p>
                      </div>
                    ) : (
                      <p className="text-sm italic text-slate-400">No hay dirección asignada.</p>
                    )}
                  </div>


                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Método de Pago</h4>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p className="font-medium text-slate-800">
                        {order.paymentDetails?.paymentMethod?.replace("_", " ") || "No especificado"}
                      </p>
                      <p className="text-xs">
                        Estado del pago:{" "}
                        <span className={`font-semibold ${order.paymentDetails?.status === "COMPLETED" ? "text-green-600" : "text-amber-600"}`}>
                          {order.paymentDetails?.status === "COMPLETED" ? "Pagado" : "Procesando / Pendiente"}
                        </span>
                      </p>
                      {order.deliveryDate && (
                        <p className="text-xs text-slate-500 pt-1">
                          Entregado el: {formatDate(order.deliveryDate)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}