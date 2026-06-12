"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminCreateProductPayload } from "@/models/product.model";
import { useState } from "react";
import { useProductForm } from "@/hooks/useCreateProductForm";
import { CreateProductForm } from "./CreateProductForm";

interface CreatePopupProps {
  onCreate?: (payload: AdminCreateProductPayload) => void;
}

export function CreatePopup({ onCreate }: CreatePopupProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const { data, updateField, reset } = useProductForm();

  const handleCreateProduct = () => {
    onCreate?.(data);
    reset();
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
        <CreateProductForm  />
      </DialogContent>
    </Dialog>
  );
}
