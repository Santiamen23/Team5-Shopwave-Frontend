"use client";

import Image from "next/image";
import { useState } from "react";

import { Check, Minus, Plus, ShoppingCart, ShieldCheck, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/models/product.model";
import { formatCurrency } from "@/utils/currency.util";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const availableSizes = product.sizes ?? [];
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]?.name ?? "");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const hasDiscount = product.discountedPrice < product.price;
  const remainingStock = Math.max(product.quantity, 0);

  function handleAddToCart() {
    setAddedToCart(true);
    window.setTimeout(() => setAddedToCart(false), 2200);
  }

  function decrementQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function incrementQuantity() {
    setQuantity((current) => Math.min(Math.max(remainingStock, 1), current + 1));
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-slate-200/70 bg-white/95">
          <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 via-white to-blue-50 p-5 sm:p-8">
            <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[2rem] bg-white/80 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.35)]">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-200/70 bg-white/95">
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent">Producto destacado</Badge>
                {product.category ? <Badge variant="secondary">{product.category.name}</Badge> : null}
                <Badge variant={remainingStock > 0 ? "outline" : "secondary"}>
                  {remainingStock > 0 ? `${remainingStock} disponibles` : "Sin stock"}
                </Badge>
              </div>
              <div className="space-y-3">
                <CardTitle className="text-3xl leading-tight text-slate-950 sm:text-4xl">
                  {product.title}
                </CardTitle>
                <CardDescription className="text-base leading-7 text-slate-600">
                  {product.brand} · {product.color}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-1">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Precio actual</p>
                  <p className="text-4xl font-semibold tracking-tight text-slate-950">
                    {formatCurrency(product.discountedPrice)}
                  </p>
                </div>
                {hasDiscount ? (
                  <div className="space-y-1 pb-1">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Antes</p>
                    <p className="text-lg text-slate-500 line-through">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                ) : null}
                {hasDiscount ? (
                  <Badge variant="accent" className="bg-emerald-600">
                    -{product.discountPersent}%
                  </Badge>
                ) : null}
              </div>

              <Separator />

              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Talles
                </p>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.length > 0 ? (
                    availableSizes.map((size) => {
                      const isSelected = selectedSize === size.name;
                      const isDisabled = size.quantity <= 0;

                      return (
                        <Button
                          key={size.name}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          disabled={isDisabled}
                          onClick={() => setSelectedSize(size.name)}
                          className="min-w-16 rounded-full"
                        >
                          {size.name}
                        </Button>
                      );
                    })
                  ) : (
                    <p className="text-sm text-slate-500">Este producto no tiene talles cargados.</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Cantidad
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={decrementQuantity}
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-12 px-2 text-center text-sm font-semibold text-slate-900">
                      {quantity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={incrementQuantity}
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500">
                    Seleccionado: {selectedSize || "sin talle"}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button type="button" size="lg" className="w-full" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4" />
                  Agregar al carrito
                </Button>
                <Button type="button" size="lg" variant="secondary" className="w-full">
                  Comprar ahora
                </Button>
              </div>

              <div
                className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm transition-colors ${
                  addedToCart
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                <Check className="h-4 w-4" />
                {addedToCart
                  ? "Producto listo para sincronizarse con el carrito global."
                  : "El botón ya está preparado para conectarse al estado global del carrito."}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/70 bg-white/95">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">Información ampliada</CardTitle>
              <CardDescription>Todo lo que el detalle necesita para la navegación profunda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
              <p>{product.description}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Marca</p>
                  <p className="mt-1 font-medium text-slate-950">{product.brand}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Color</p>
                  <p className="mt-1 font-medium text-slate-950">{product.color}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Valoraciones</p>
                  <p className="mt-1 font-medium text-slate-950">{product.numRatings} opiniones</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Existencias</p>
                  <p className="mt-1 font-medium text-slate-950">{product.quantity} unidades</p>
                </div>
              </div>

              <div className="grid gap-3 text-slate-600 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-600" />
                  <span>Detalle preparado para integrarse con autenticación, reseñas y stock real.</span>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <Truck className="mt-0.5 h-4 w-4 text-blue-600" />
                  <span>La estructura ya queda lista para conectar envío, carrito y compra posterior.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}