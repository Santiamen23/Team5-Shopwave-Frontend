"use client";

import type { Product } from "@/models/product.model";
import { ProductFlipCard } from "./product-flip-card";

interface ProductDetailProps {
  product: Product;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
}

export function ProductDetail({ product, onAddToCart, onBuyNow }: ProductDetailProps) {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <ProductFlipCard product={product} onAddToCart={onAddToCart} onBuyNow={onBuyNow} />
    </section>
  );
}
