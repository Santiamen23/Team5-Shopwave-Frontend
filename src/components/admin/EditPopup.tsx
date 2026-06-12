"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { Product } from "@/models/product.model";

interface EditPopupProps {
  product: Product;
  onEdit?: (product: Product) => void;
}

export function EditPopup({ product, onEdit }: EditPopupProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(product);

  const handleSaveEdit = () => {
    onEdit?.(editData);
    setEditOpen(false);
  };

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit />
          <span className="sr-only sm:inline">Editar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-80">
        <DialogTitle>Editar Producto</DialogTitle>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Descripción</label>
            <input
              type="text"
              value={editData.description || ""}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              className="w-full border rounded px-2 py-1 text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Cantidad</label>
            <input
              type="number"
              value={editData.quantity}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  quantity: parseInt(e.target.value),
                })
              }
              className="w-full border rounded px-2 py-1 text-sm mt-1"
            />
          </div>
          <Button onClick={handleSaveEdit} className="w-full">
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
