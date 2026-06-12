"use client";

import { ProductCard } from "./ProductCard";
import { CreatePopup } from "./CreatePopup";
import { useProducts } from "@/hooks/useProducts";

export function ProductList() {
  const {
    products, createProduct, updateProduct, deleteProduct, error,
  } = useProducts();
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventario</h2>
        <CreatePopup onCreate={createProduct} />
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-2">
        {products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron productos.
          </div>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={updateProduct}
              onDelete={() => deleteProduct(product.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
