"use client";

import Image from "next/image";
import { useState } from "react";

import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/models/product.model";
import { formatCurrency } from "@/utils/currency.util";

interface ProductFlipCardProps {
  product: Product;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
}

export function ProductFlipCard({ product, onAddToCart, onBuyNow }: ProductFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const hasDiscount = product.discountedPrice < product.price;
  const remainingStock = Math.max(product.quantity, 0);
  const availableSizes = product.sizes ?? [];

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Flip Container */}
      <div
        className="flip-container h-[500px] sm:h-[550px] cursor-pointer"
        onClick={toggleFlip}
      >
        <div className={`flip-inner ${isFlipped ? "flipped" : ""}`}>
          {/* Front - Imagen + Título + Botón */}
          <div className="flip-front">
            <Card className="h-full overflow-hidden border-slate-200/70 bg-white/95 flex flex-col">
              <div className="flex-1 aspect-[4/3] bg-gradient-to-br from-slate-100 via-white to-blue-50 p-4 sm:p-6 flex items-center justify-center">
                <div className="relative w-full h-full overflow-hidden rounded-[1.5rem] bg-white/80 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.35)] sm:rounded-[2rem]">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    unoptimized
                    sizes="100%"
                    className="object-cover"
                  />
                </div>
              </div>
              
              <CardContent className="flex flex-col gap-4 p-5 sm:p-6 lg:p-7 border-t border-slate-200/70">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold leading-tight text-slate-950 sm:text-3xl line-clamp-2">
                    {product.title}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {product.brand} · {product.color}
                  </p>
                </div>
                
                <Button
                  type="button"
                  size="lg"
                  className="w-full group"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFlip();
                  }}
                >
                  Más detalles
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Back - Información Completa */}
          <div className="flip-back">
            <Card className="h-full overflow-hidden border-slate-200/70 bg-white/95 flex flex-col">
              <CardHeader className="space-y-3 p-5 sm:p-6 lg:p-7 border-b border-slate-200/70 flex-shrink-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent">Producto destacado</Badge>
                  {product.category ? <Badge variant="secondary">{product.category.name}</Badge> : null}
                  <Badge variant={remainingStock > 0 ? "outline" : "secondary"}>
                    {remainingStock > 0 ? `${remainingStock} disponibles` : "Sin stock"}
                  </Badge>
                </div>
                <CardTitle className="text-2xl leading-tight text-slate-950 sm:text-3xl">
                  {product.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto space-y-6 p-5 sm:p-6 lg:p-7">
                {/* Precios */}
                <div className="flex flex-wrap items-end gap-3 sm:gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 sm:text-sm">
                      Precio actual
                    </p>
                    <p className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                      {formatCurrency(product.discountedPrice)}
                    </p>
                  </div>
                  {hasDiscount ? (
                    <div className="space-y-1 pb-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 sm:text-sm">
                        Antes
                      </p>
                      <p className="text-sm text-slate-500 line-through sm:text-base">
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

                {/* Información Ampliada */}
                <div className="space-y-3">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold">
                      Descripción
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-950">
                      {product.description}
                    </p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold">
                        Marca
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-950">{product.brand}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold">
                        Color
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-950">{product.color}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold">
                        Valoraciones
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-950">
                        {product.numRatings} opiniones
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold">
                        Existencias
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-950">
                        {product.quantity} unidades
                      </p>
                    </div>
                  </div>
                </div>

                {/* Talles */}
                {availableSizes.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 sm:text-sm">
                      Talles disponibles
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <Badge
                          key={size.name}
                          variant={size.quantity > 0 ? "outline" : "secondary"}
                          className="text-xs"
                        >
                          {size.name} {size.quantity <= 0 ? "(agotado)" : ""}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CardContent>

              {/* Botones de Acción */}
              <div className="flex-shrink-0 border-t border-slate-200/70 p-5 sm:p-6 lg:p-7">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    type="button"
                    size="lg"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart?.();
                    }}
                  >
                    Agregar al carrito
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="secondary"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBuyNow?.();
                    }}
                  >
                    Comprar ahora
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
