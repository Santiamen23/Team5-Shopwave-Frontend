"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { Product } from "@/models/product.model";

interface EditPopupProps {
  product: Product;
  onEdit?: (product: Product) => Promise<Product> | Product | void;
}

export function EditPopup({ product, onEdit }: EditPopupProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(product);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditData(product);
  }, [product]);

  const handleNumberChange = (field: keyof Product, value: string) => {
    const parsedValue = value === "" ? 0 : Number(value);
    setEditData((current) => ({
      ...current,
      [field]: Number.isNaN(parsedValue) ? 0 : parsedValue,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      await onEdit?.(editData);
      setEditOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit />
          <span className="sr-only sm:inline">Editar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] w-[min(92vw,36rem)] overflow-y-auto">
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogDescription>
          Modifica la informacion principal del producto y guarda los cambios.
        </DialogDescription>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nombre</label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descripción</label>
            <textarea
              value={editData.description || ""}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              rows={4}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Precio</label>
              <input
                type="number"
                step="0.01"
                value={editData.price}
                onChange={(e) => handleNumberChange("price", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Precio con descuento</label>
              <input
                type="number"
                step="0.01"
                value={editData.discountedPrice}
                onChange={(e) =>
                  handleNumberChange("discountedPrice", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descuento %</label>
              <input
                type="number"
                step="0.01"
                value={editData.discountPersent}
                onChange={(e) =>
                  handleNumberChange("discountPersent", e.target.value)
                }
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Cantidad</label>
              <input
                type="number"
                value={editData.quantity}
                onChange={(e) => handleNumberChange("quantity", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Marca</label>
              <input
                type="text"
                value={editData.brand}
                onChange={(e) =>
                  setEditData({ ...editData, brand: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Color</label>
              <input
                type="text"
                value={editData.color}
                onChange={(e) =>
                  setEditData({ ...editData, color: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">URL de imagen</label>
            <input
              type="text"
              value={editData.imageUrl}
              onChange={(e) =>
                setEditData({ ...editData, imageUrl: e.target.value })
              }
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <Button onClick={handleSaveEdit} className="w-full" disabled={saving}>
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
