import Image from "next/image";
import Link from "next/link";

import type { ProductCardData } from "@/models/product.model";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { formatCurrency } from "@/utils/currency.util";

interface ProductCardProps {
  product: ProductCardData;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden border-slate-200/70 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_90px_-35px_rgba(15,23,42,0.4)]">
      <div className="relative aspect-[4/5] p-4 sm:aspect-square sm:p-5 lg:p-6">
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white/70">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            unoptimized
            sizes="(max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      </div>
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {product.brand}
          </Badge>
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-slate-500 sm:text-xs">
            {product.color}
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-950 sm:text-base">
            {product.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-base font-semibold text-slate-950 sm:text-lg">
              {formatCurrency(product.discountedPrice)}
            </span>
            {product.discountedPrice < product.price ? (
              <span className="text-xs text-slate-500 line-through sm:text-sm">
                {formatCurrency(product.price)}
              </span>
            ) : null}
          </div>
        </div>
        <Button asChild className="w-full">
          <Link href={`/products/${product.id}`}>Ver detalle</Link>
        </Button>
      </CardContent>
    </Card>
  );
}