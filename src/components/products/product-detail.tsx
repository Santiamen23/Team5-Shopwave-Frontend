"use client";

import Image from "next/image";
import { useState } from "react";

import { Minus, Plus, ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/models/product.model";
import { formatCurrency } from "@/utils/currency.util";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const availableSizes = product.sizes ?? [];
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]?.name ?? "");
  const [quantity, setQuantity] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addItem, isLoading: isCartLoading } = useCart();

  const hasDiscount = product.discountedPrice < product.price;
  const remainingStock = Math.max(
    availableSizes.find((size) => size.name === selectedSize)?.quantity ?? product.quantity,
    0,
  );

  function clampQuantity(value: number) {
    return Math.min(Math.max(remainingStock, 1), value);
  }

  function decrementQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function incrementQuantity() {
    setQuantity((current) => clampQuantity(current + 1));
  }

  async function handleAddToCart() {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!selectedSize) {
      setSubmitError("Selecciona un talle antes de agregar el producto.");
      return;
    }

    if (remainingStock <= 0) {
      setSubmitError("Este talle no tiene stock disponible.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addItem({
        product,
        size: selectedSize,
        quantity: clampQuantity(quantity),
      });
      setSubmitSuccess("Producto agregado al carrito correctamente.");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No se pudo agregar el producto.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isAddDisabled = isCartLoading || isSubmitting || remainingStock <= 0;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden border-slate-200/70 bg-white/95 xl:sticky xl:top-24">
          <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
            <div className="relative flex h-full min-h-[18rem] items-center justify-center overflow-hidden rounded-[1.5rem] bg-white/80 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.35)] sm:min-h-[24rem] lg:rounded-[2rem]">
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

        <div className="space-y-6 lg:space-y-8">
          <Card className="border-slate-200/70 bg-white/95">
            <CardHeader className="space-y-4 p-5 sm:p-6 lg:p-7">
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

            <CardContent className="space-y-6 p-5 sm:p-6 lg:p-7">
              <div className="flex flex-wrap items-end gap-3 sm:gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 sm:text-sm">Precio actual</p>
                  <p className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    {formatCurrency(product.discountedPrice)}
                  </p>
                </div>
                {hasDiscount ? (
                  <div className="space-y-1 pb-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 sm:text-sm">Antes</p>
                    <p className="text-base text-slate-500 line-through sm:text-lg">
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
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 sm:text-sm">
                  Talles
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
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
                          className="min-w-14 rounded-full sm:min-w-16"
                        >
                          {size.name}
                        </Button>
                      );
                    })
                  ) : (
                    <p className="text-sm text-slate-500">Este producto no tiene detalles cargados.</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 sm:text-sm">
                  Cantidad
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                <Button
                  type="button"
                  size="lg"
                  className="w-full"
                  onClick={() => void handleAddToCart()}
                  disabled={isAddDisabled}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {isSubmitting ? "Agregando..." : "Agregar al carrito"}
                </Button>
                <Button type="button" size="lg" variant="secondary" className="w-full">
                  Comprar ahora
                </Button>
              </div>

              {submitError ? (
                <p className="text-sm font-medium text-red-600">{submitError}</p>
              ) : null}

              {submitSuccess ? (
                <p className="text-sm font-medium text-emerald-700">{submitSuccess}</p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-slate-200/70 bg-white/95">
            <CardHeader className="p-3 sm:p-4 lg:p-5">
              <CardTitle className="text-xl text-slate-950 sm:text-2xl">Información ampliada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-2 text-sm leading-7 text-slate-600 sm:p-3 lg:p-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Descripcion</p>
                <p className="mt-1 font-medium text-slate-950">{product.description}</p>
              </div>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
