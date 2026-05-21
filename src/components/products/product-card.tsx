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
    <Card className="overflow-hidden border-slate-200/70 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_24px_90px_-35px_rgba(15,23,42,0.4)]">
      <div className="relative aspect-square bg-gradient-to-br from-slate-100 via-white to-slate-50 p-6">
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
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {product.brand}
          </Badge>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            {product.color}
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-base font-semibold text-slate-950">
            {product.title}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-slate-950">
              {formatCurrency(product.discountedPrice)}
            </span>
            {product.discountedPrice < product.price ? (
              <span className="text-sm text-slate-500 line-through">
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