"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";

import type { ProductCardData } from "@/models/product.model";

import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBar } from "@/components/ui/search-bar";

interface ProductsSectionProps {
  products: ProductCardData[];
  title?: string;
  description?: string;
  emptyMessage?: string;
  limit?: number;
  ctaHref?: string;
  ctaLabel?: string;
  enableSearch?: boolean;
}

export function ProductsSection({
  products,
  title,
  description,
  emptyMessage = "No se pudieron cargar productos.",
  limit,
  ctaHref,
  ctaLabel,
  enableSearch = false,
}: ProductsSectionProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filteredProducts = enableSearch
    ? products.filter((product) => {
        const searchableText = [product.title, product.brand, product.color].join(" ").toLowerCase();
        return searchableText.includes(normalizedQuery);
      })
    : products;

  const visibleProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts.slice(0, 20);
  const effectiveEmptyMessage = enableSearch && normalizedQuery
    ? "No hay productos que coincidan con tu búsqueda."
    : emptyMessage;

  return (
    <Card className="mx-auto max-w-6xl gap-0 overflow-hidden border border-slate-300/80 bg-slate-100/90 py-0 shadow-sm">
      {title || description ? (
        <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-slate-950 to-slate-800 px-5 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
          {title ? (
            <CardTitle className="text-2xl sm:text-3xl lg:text-4xl">{title}</CardTitle>
          ) : null}
          {description ? (
            <CardDescription className="max-w-2xl text-sm text-slate-200 sm:text-base">
              {description}
            </CardDescription>
          ) : null}
        </CardHeader>
      ) : null}

      <CardContent className="space-y-6 p-4 sm:p-6 lg:p-8">
        {enableSearch ? (
          <SearchBar
            label="Buscar producto"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busca por nombre, marca o color"
            resultText={`${filteredProducts.length} resultado${filteredProducts.length === 1 ? "" : "s"}`}
          />
        ) : null}

        {visibleProducts.length > 0 ? (
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
            {effectiveEmptyMessage}
          </div>
        )}

        {ctaHref && ctaLabel ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
