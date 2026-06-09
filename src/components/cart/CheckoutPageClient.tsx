"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, CreditCard, ShoppingBag } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/utils/currency.util";

export default function CheckoutPageClient() {
  const { user } = useAuth();
  const { cart, isLoading, checkout } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<{ orderNumber: string; totalItems: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function handleCheckout() {
    setError(null);
    setStatusMessage(null);
    setIsProcessing(true);

    try {
      const checkoutReceipt = await checkout();
      setReceipt({
        orderNumber: checkoutReceipt.orderNumber,
        totalItems: checkoutReceipt.totalItems,
      });
      setStatusMessage("Compra simulada completada y carrito vaciado correctamente.");
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
            <h1 className="text-3xl font-semibold text-slate-950">Checkout simulado</h1>
            <p className="mt-2 text-sm text-slate-600">Confirma el pedido y finaliza una compra de prueba.</p>
          </div>

          {receipt ? (
            <Card className="border-emerald-200 bg-emerald-50/80">
              <CardContent className="flex flex-col gap-4 p-6">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                <div>
                  <h2 className="text-2xl font-semibold text-emerald-950">Compra confirmada</h2>
                  <p className="mt-2 text-sm text-emerald-900">
                    Tu orden simulada <span className="font-semibold">{receipt.orderNumber}</span> fue generada correctamente.
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
              <CardTitle>Datos del pedido</CardTitle>
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
                <CreditCard className="h-5 w-5 text-slate-500" />
                <p>Pago simulado con confirmación instantánea.</p>
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
                disabled={isProcessing || cart.cartItems.length === 0 || Boolean(receipt)}
              >
                {isProcessing ? "Procesando..." : receipt ? "Compra realizada" : "Confirmar compra"}
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
