"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { EditPopup } from "./EditPopup";
import { DeleteAlert } from "./DeleteAlert";
import { Product } from "@/models/product.model";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: number) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="relative h-24 w-24 hidden sm:inline">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            unoptimized
            sizes="(max-width: 760px)"
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold">{product.title}</h3>
        </div>

        <div className="w-24">
          <strong>Cantidad</strong><br />
          {product.quantity}
        </div>

        <div className="flex gap-2">
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
