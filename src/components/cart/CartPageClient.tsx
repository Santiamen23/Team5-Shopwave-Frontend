"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      showSuccess(nextQuantity <= 0 ? "Producto eliminado del carrito." : "Cantidad actualizada correctamente.");
    } catch (updateError) {
      showError(updateError instanceof Error ? updateError.message : "No se pudo actualizar la cantidad.");
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
      showError(removeError instanceof Error ? removeError.message : "No se pudo eliminar el producto.");
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
      showError(clearError instanceof Error ? clearError.message : "No se pudo vaciar el carrito.");
    } finally {
      setIsClearing(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">Carrito</h1>
            <p className="mt-2 text-sm text-slate-600">Revisa tus productos antes de continuar al checkout.</p>
          </div>

          {error ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              {error}
            </div>
          ) : null}

          {statusMessage ? (
            <div
              className={
                statusTone === "success"
                  ? "rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
                  : "rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
              }
            >
              {statusMessage}
            </div>
          ) : null}

          {isLoading ? (
            <Card className="border-slate-200/70 bg-white/95">
              <CardContent className="p-6 text-sm text-slate-600">Cargando carrito...</CardContent>
            </Card>
          ) : hasItems ? (
            <div className="space-y-4">
              {cart.cartItems.map((item) => (
                (() => {
                  const availableQuantity = getAvailableItemQuantity(item);
                  const isIncreaseDisabled = busyItemId === item.id || availableQuantity <= 0 || item.quantity >= availableQuantity;

                  return (
                <Card key={item.id} className="border-slate-200/70 bg-white/95">
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
                    <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-24 sm:w-24 sm:shrink-0">
                      <Image src={item.product.imageUrl} alt={item.product.title} fill className="object-cover" unoptimized />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.product.brand}</p>
                        <h2 className="text-lg font-semibold text-slate-950">{item.product.title}</h2>
                      </div>
                      <p className="text-sm text-slate-600">Talle: {item.size}</p>
                      <p className="text-sm text-slate-600">{formatCurrency(item.discountedPrice ?? 0)} · {item.quantity} unidades</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:items-end">
                      <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={() => void handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={busyItemId === item.id}
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="min-w-10 px-3 text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={() => void handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={isIncreaseDisabled}
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold text-slate-950">{formatCurrency(item.discountedPrice ?? 0)}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => void handleRemoveItem(item.id)}
                          disabled={busyItemId === item.id}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {busyItemId === item.id ? "Procesando..." : "Eliminar"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                  );
                })()
              ))}
            </div>
          ) : (
            <Card className="border-slate-200/70 bg-white/95">
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                <ShoppingBag className="h-12 w-12 text-slate-400" />
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">Tu carrito está vacío</h2>
                  <p className="mt-2 text-sm text-slate-600">Agrega productos desde el catálogo para empezar.</p>
                </div>
                <Button asChild>
                  <Link href="/products">Ir al catálogo</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <aside className="w-full lg:max-w-sm">
          <Card className="sticky top-24 border-slate-200/70 bg-white/95">
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
              <CardDescription>Totales calculados sobre el carrito actual.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <dt>Productos</dt>
                  <dd className="font-medium text-slate-950">{cart.totalItem}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Total</dt>
                  <dd className="font-medium text-slate-950">{formatCurrency(cart.totalPrice)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Descuento</dt>
                  <dd className="font-medium text-emerald-600">- {formatCurrency(cart.discounte)}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base">
                  <dt className="font-semibold text-slate-950">Total final</dt>
                  <dd className="font-semibold text-slate-950">{formatCurrency(cart.totalDiscountedPrice)}</dd>
                </div>
              </dl>

              <div className="space-y-3">
                <Button asChild className="w-full" disabled={!hasItems}>
                  <Link href="/checkout">Ir al checkout</Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
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
