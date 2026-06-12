"use client";

import { useState } from "react";
import type { Order, OrderStatus } from "@/models/order.model";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/currency.util";
import * as adminOrderService from "@/services/admin-order.service";

const STATUS_MAP: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "outline" }> = {
  PENDING: { label: "Pendiente", variant: "outline" },
  PLACED: { label: "Recibido", variant: "secondary" },
  CONFIRMED: { label: "Confirmado", variant: "secondary" },
  SHIPPED: { label: "Enviado", variant: "default" },
  DELIVERED: { label: "Entregado", variant: "default" },
  CANCELLED: { label: "Cancelado", variant: "outline" },
};

interface AdminOrdersViewProps {
  initialOrders: Order[];
  jwt: string;
}

export default function AdminOrdersView({ initialOrders, jwt }: AdminOrdersViewProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const toggleOrder = (id: number) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleUpdateStatus = async (id: number, action: "confirm" | "ship" | "deliver" | "cancel") => {
    setLoadingId(id);
    try {
      let updatedOrder: Order;
      if (action === "confirm") updatedOrder = await adminOrderService.confirmAdminOrder(id, jwt);
      else if (action === "ship") updatedOrder = await adminOrderService.shipAdminOrder(id, jwt);
      else if (action === "deliver") updatedOrder = await adminOrderService.deliverAdminOrder(id, jwt);
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
    if (!confirm("¿Estás seguro de que deseas eliminar permanentemente esta orden del sistema?")) return;
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
      <div className="text-center py-12 bg-white border rounded-2xl">
        <p className="text-sm italic text-slate-500">No hay ninguna orden registrada en la plataforma actualmente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const isExpanded = expandedOrderId === order.id;
        const statusConfig = STATUS_MAP[order.orderStatus] || { label: order.orderStatus, variant: "outline" };
        const clientName = order.shippingAddress 
          ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
          : "Usuario Desconocido";

        return (
          <Card key={order.id} className="overflow-hidden border-slate-200/80 shadow-sm">
            <CardHeader className="bg-slate-50/50 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                
                <div className="grid grid-cols-2 gap-4 md:flex md:gap-8 text-left">
                  <div>
                    <span className="block text-xs font-medium uppercase tracking-wider text-slate-400">Pedido</span>
                    <span className="text-sm font-semibold text-slate-800">#{order.orderId || order.id}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium uppercase tracking-wider text-slate-400">Cliente</span>
                    <span className="text-sm font-semibold text-blue-600 truncate max-w-[150px] block" title={clientName}>
                      {clientName}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium uppercase tracking-wider text-slate-400">Total</span>
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(order.totalPrice ?? 0)}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium uppercase tracking-wider text-slate-400">Estado</span>
                    <Badge variant={statusConfig.variant} className="mt-0.5 px-2 py-0 text-[11px] font-semibold">
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-end">
                  {order.orderStatus === "PENDING" && (
                    <Button size="sm" variant="secondary" className="h-8 text-xs cursor-pointer" disabled={loadingId === order.id} onClick={() => handleUpdateStatus(order.id, "confirm")}>
                      Confirmar
                    </Button>
                  )}
                  {(order.orderStatus === "PLACED" || order.orderStatus === "CONFIRMED") && (
                    <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" disabled={loadingId === order.id} onClick={() => handleUpdateStatus(order.id, "ship")}>
                      Marcar Envío
                    </Button>
                  )}
                  {order.orderStatus === "SHIPPED" && (
                    <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white cursor-pointer" disabled={loadingId === order.id} onClick={() => handleUpdateStatus(order.id, "deliver")}>
                      Entregado
                    </Button>
                  )}
                  {order.orderStatus !== "DELIVERED" && order.orderStatus !== "CANCELLED" && (
                    <Button size="sm" variant="outline" className="h-8 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 cursor-pointer" disabled={loadingId === order.id} onClick={() => handleUpdateStatus(order.id, "cancel")}>
                      Cancelar
                    </Button>
                  )}
                  
                  <Button size="sm" variant="ghost" className="h-8 text-xs text-slate-500 cursor-pointer" onClick={() => toggleOrder(order.id)}>
                    {isExpanded ? "Ocultar" : "Detalles"}
                  </Button>

                  <Button size="sm" variant="ghost" className="h-8 px-2 text-slate-400 hover:text-rose-600 cursor-pointer" disabled={loadingId === order.id} onClick={() => handleDeleteOrder(order.id)}>
                    🗑️
                  </Button>
                </div>

              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="border-t border-slate-100 p-5 bg-white space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Artículos comprados</h4>
                  <div className="space-y-2">
                    {order.orderItems?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0">
                        <span className="text-slate-700 font-medium">{item.product?.title || "Producto"} (x{item.quantity})</span>
                        <span className="font-semibold text-slate-900">{formatCurrency((item.discountedPrice ?? item.price ?? 0) * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Destinatario y Dirección</h4>
                    {order.shippingAddress ? (
                      <p className="text-slate-600 text-xs">
                        {order.shippingAddress.streetAddress}, {order.shippingAddress.city}. Telf: {order.shippingAddress.mobile}
                      </p>
                    ) : (
                      <p className="text-slate-400 italic text-xs">Sin dirección guardada.</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Pasarela de Pago</h4>
                    <p className="text-slate-600 text-xs">
                      Método: <span className="font-medium">{order.paymentDetails?.paymentMethod || "No especificado"}</span> | Estado:{" "}
                      <span className={`font-semibold ${order.paymentDetails?.status === "COMPLETED" ? "text-green-600" : "text-amber-500"}`}>
                        {order.paymentDetails?.status === "COMPLETED" ? "Acreditado" : "Pendiente"}
                      </span>
                    </p>
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