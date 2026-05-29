import React from "react";
import { ProductFlipCard } from "@/components/products/product-flip-card";
import type { Product } from "@/models/product.model";

const mockProduct: Product = {
  id: 999,
  title: "Zapatillas Demo X",
  description: "Zapatillas deportivas de prueba con detalle flip 3D.",
  price: 150.0,
  discountedPrice: 120.0,
  discountPersent: 20,
  quantity: 42,
  brand: "DemoBrand",
  color: "Negro",
  sizes: [
    { name: "S", quantity: 5 },
    { name: "M", quantity: 10 },
    { name: "L", quantity: 0 },
  ],
  imageUrl: "https://images.unsplash.com/photo-1600180758890-8b0b6f3d1e7d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=demo",
  numRatings: 128,
  category: { id: 1, name: "Calzado", level: 1, parentCategory: null },
  createdAt: new Date().toISOString(),
};

export default function ProductTestPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <ProductFlipCard product={mockProduct} />
    </main>
  );
}
