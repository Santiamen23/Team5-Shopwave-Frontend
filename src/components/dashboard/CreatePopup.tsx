"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { AdminCreateProductPayload } from "@/models/product.model";

interface CreatePopupProps {
  onCreate?: (payload: AdminCreateProductPayload) => void;
}

const emptyProduct: AdminCreateProductPayload = {
  title: "",
  description: "",
  price: 0,
  discountedPrice: 0,
  discountPersent: 0,
  quantity: 0,
  brand: "",
  color: "",
  size: [],
  imageUrl: "",
  topLevelCategory: "",
  secondLevelCategory: "",
  thirdLevelCategory: "",
};

export function CreatePopup({ onCreate }: CreatePopupProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [createData, setCreateData] = useState<AdminCreateProductPayload>(emptyProduct);

  const handleCreateProduct = () => {
    onCreate?.(createData);
    setCreateData(emptyProduct);
    setCreateOpen(false);
  };

  return (
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          <span className="sr-only sm:inline">Agregar Producto</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-80">
        <DialogTitle>Crear nuevo producto</DialogTitle>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <div>
            <label className="text-sm font-medium">Nombre</label>
            <input
              type="text"
              value={createData.title}
              onChange={(e) =>
                setCreateData({ ...createData, title: e.target.value })
              }
              className="w-full border rounded px-2 py-1 text-sm mt-1"
              placeholder="Product title"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descripción</label>
            <textarea
              value={createData.description}
              onChange={(e) =>
                setCreateData({ ...createData, description: e.target.value })
              }
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
                value={createData.price}
                onChange={(e) =>
                  setCreateData({
                    ...createData,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-full border rounded px-2 py-1 text-sm mt-1"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descuento %</label>
              <input
                type="number"
                value={createData.discountPersent}
                onChange={(e) =>
                  setCreateData({
                    ...createData,
                    discountPersent: parseFloat(e.target.value),
                  })
                }
                className="w-full border rounded px-2 py-1 text-sm mt-1"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Precio con descuento</label>
            <input
              type="number"
              value={createData.discountedPrice}
              onChange={(e) =>
                setCreateData({
                  ...createData,
                  discountedPrice: parseFloat(e.target.value),
                })
              }
              className="w-full border rounded px-2 py-1 text-sm mt-1"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Cantidad</label>
            <input
              type="number"
              value={createData.quantity}
              onChange={(e) =>
                setCreateData({
                  ...createData,
                  quantity: parseInt(e.target.value),
                })
              }
              className="w-full border rounded px-2 py-1 text-sm mt-1"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Marca</label>
            <input
              type="text"
              value={createData.brand}
              onChange={(e) =>
                setCreateData({ ...createData, brand: e.target.value })
              }
              className="w-full border rounded px-2 py-1 text-sm mt-1"
              placeholder="Brand"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Color</label>
            <input
              type="text"
              value={createData.color}
              onChange={(e) =>
                setCreateData({ ...createData, color: e.target.value })
              }
              className="w-full border rounded px-2 py-1 text-sm mt-1"
              placeholder="Color"
            />
          </div>
          <div>
            <label className="text-sm font-medium">URL de imagen</label>
            <input
              type="text"
              value={createData.imageUrl}
              onChange={(e) =>
                setCreateData({ ...createData, imageUrl: e.target.value })
              }
              className="w-full border rounded px-2 py-1 text-sm mt-1"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Categoria principal
            </label>
            <input
              type="text"
              value={createData.topLevelCategory}
              onChange={(e) =>
                setCreateData({
                  ...createData,
                  topLevelCategory: e.target.value,
                })
              }
              className="w-full border rounded px-2 py-1 text-sm mt-1"
              placeholder="Category"
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Categoria secundaria
            </label>
            <input
              type="text"
              value={createData.secondLevelCategory}
              onChange={(e) =>
                setCreateData({
                  ...createData,
                  secondLevelCategory: e.target.value,
                })
              }
              className="w-full border rounded px-2 py-1 text-sm mt-1"
              placeholder="Category"
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Categoria terciaria
            </label>
            <input
              type="text"
              value={createData.thirdLevelCategory}
              onChange={(e) =>
                setCreateData({
                  ...createData,
                  thirdLevelCategory: e.target.value,
                })
              }
              className="w-full border rounded px-2 py-1 text-sm mt-1"
              placeholder="Category"
            />
          </div>
          <Button onClick={handleCreateProduct} className="w-full">
            Agregar Producto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
