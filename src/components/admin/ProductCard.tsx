"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { EditPopup } from "./EditPopup";
import { DeleteAlert } from "./DeleteAlert";
import { Product } from "@/models/product.model";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => Promise<Product> | Product | void;
  onDelete?: (productId: number) => Promise<unknown> | unknown;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6">
        <div className="relative hidden h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:block">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            unoptimized
            sizes="(max-width: 760px)"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900">{product.title}</h3>
            <p className="line-clamp-2 text-sm text-slate-600">
              {product.description || "Sin descripcion disponible."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Precio: Bs {product.price}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Stock: {product.quantity}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {product.brand || "Sin marca"}
            </span>
          </div>
        </div>

        <div className="flex gap-2 self-end sm:self-center">
          <EditPopup product={product} onEdit={onEdit} />
          <DeleteAlert
            productTitle={product.title}
            onDelete={() => onDelete?.(product.id)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
