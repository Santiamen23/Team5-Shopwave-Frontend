"use client";

import { ProductCard } from "./ProductCard";
import { CreatePopup } from "./CreatePopup";
import { Product, AdminCreateProductPayload } from "@/models/product.model";

interface ProductDashboardProps {
  products: Product[];
  onCreateProduct?: (payload: AdminCreateProductPayload) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: number) => void;
}

export function ProductDashboard({
  products,
  onCreateProduct,
  onEditProduct,
  onDeleteProduct,
}: ProductDashboardProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventario</h2>
        <CreatePopup onCreate={onCreateProduct} />
      </div>

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
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
            />
          ))
        )}
      </div>
    </div>
  );
}
