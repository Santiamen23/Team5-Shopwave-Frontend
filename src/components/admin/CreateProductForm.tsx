'use client'

import { Button } from "@/components/ui/button";
import { AdminCreateProductPayload } from "@/models/product.model";

interface ProductFormProps {
  data: AdminCreateProductPayload;
  onChange: <K extends keyof AdminCreateProductPayload>(
    field: K,
    value: AdminCreateProductPayload[K]
  ) => void;
  onSubmit: () => void;
  submitLabel?: string;
}

export function CreateProductForm({
  data,
  onChange,
  onSubmit,
  submitLabel = "Agregar Producto",
}: ProductFormProps) {
  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      <div>
        <label className="text-sm font-medium">Nombre</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange("title", e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm mt-1"
          placeholder="Product title"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Descripción</label>
        <textarea
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm mt-1"
          placeholder="Product description"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm font-medium">Precio</label>
          <input
            type="number"
            value={data.price}
            onChange={(e) => onChange("price", Number(e.target.value) || 0)}
            className="w-full border rounded px-2 py-1 text-sm mt-1"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Descuento %</label>
          <input
            type="number"
            value={data.discountPersent}
            onChange={(e) => onChange("discountPersent", Number(e.target.value) || 0)}
            className="w-full border rounded px-2 py-1 text-sm mt-1"
            placeholder="0"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Precio con descuento</label>
        <input
          type="number"
          value={data.discountedPrice}
          onChange={(e) => onChange("discountedPrice", Number(e.target.value) || 0)}
          className="w-full border rounded px-2 py-1 text-sm mt-1"
          placeholder="0.00"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Cantidad</label>
        <input
          type="number"
          value={data.quantity}
          onChange={(e) => onChange("quantity", Number(e.target.value) || 0)}
          className="w-full border rounded px-2 py-1 text-sm mt-1"
          placeholder="0"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Marca</label>
        <input
          type="text"
          value={data.brand}
          onChange={(e) => onChange("brand", e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm mt-1"
          placeholder="Brand"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Color</label>
        <input
          type="text"
          value={data.color}
          onChange={(e) => onChange("color", e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm mt-1"
          placeholder="Color"
        />
      </div>
      <div>
        <label className="text-sm font-medium">URL de imagen</label>
        <input
          type="text"
          value={data.imageUrl}
          onChange={(e) => onChange("imageUrl", e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm mt-1"
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="text-sm font-medium">Categoria principal</label>
        <input
          type="text"
          value={data.topLevelCategory}
          onChange={(e) => onChange("topLevelCategory", e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm mt-1"
          placeholder="Category"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Categoria secundaria</label>
        <input
          type="text"
          value={data.secondLevelCategory}
          onChange={(e) => onChange("secondLevelCategory", e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm mt-1"
          placeholder="Category"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Categoria terciaria</label>
        <input
          type="text"
          value={data.thirdLevelCategory}
          onChange={(e) => onChange("thirdLevelCategory", e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm mt-1"
          placeholder="Category"
        />
      </div>
      <Button onClick={onSubmit} className="w-full">
        <span>{submitLabel}</span>
      </Button>
    </div>
  );
}
