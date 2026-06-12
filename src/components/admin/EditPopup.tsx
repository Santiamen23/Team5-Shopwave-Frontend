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
import {
  FieldErrors,
  getInputBorderClass,
  validateNumber,
  validateRequired,
  validateUrl,
} from "@/utils/validation.util";

interface EditPopupProps {
  product: Product;
  onEdit?: (product: Product) => Promise<Product> | Product | void;
}

interface EditFieldErrors extends FieldErrors {
  title?: string;
  description?: string;
  price?: string;
  discountedPrice?: string;
  discountPersent?: string;
  quantity?: string;
  brand?: string;
  color?: string;
  imageUrl?: string;
}

export function EditPopup({ product, onEdit }: EditPopupProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(product);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<EditFieldErrors>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditData(product);
    setErrors({});
  }, [product]);

  const handleNumberChange = (field: keyof Product, value: string) => {
    const parsedValue = value === "" ? 0 : Number(value);
    setEditData((current) => ({
      ...current,
      [field]: Number.isNaN(parsedValue) ? 0 : parsedValue,
    }));
  };

  function clearFieldError(field: keyof EditFieldErrors) {
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const next: EditFieldErrors = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validate(): EditFieldErrors {
    const next: EditFieldErrors = {};

    const titleError = validateRequired(editData.title);
    if (titleError) next.title = "El nombre es obligatorio.";

    const descriptionError = validateRequired(editData.description);
    if (descriptionError) next.description = "La descripción es obligatoria.";

    const priceError = validateNumber(editData.price, "El precio", { min: 0.01 });
    if (priceError) next.price = priceError;

    const discountedError = validateNumber(editData.discountedPrice, "El precio con descuento", { min: 0 });
    if (discountedError) {
      next.discountedPrice = discountedError;
    } else if (editData.discountedPrice > editData.price) {
      next.discountedPrice = "El precio con descuento no puede ser mayor al precio original.";
    }

    const discountError = validateNumber(editData.discountPersent, "El descuento", { min: 0, max: 100 });
    if (discountError) next.discountPersent = discountError;

    const quantityError = validateNumber(editData.quantity, "La cantidad", { min: 0 });
    if (quantityError) next.quantity = quantityError;

    const brandError = validateRequired(editData.brand);
    if (brandError) next.brand = "La marca es obligatoria.";

    const colorError = validateRequired(editData.color);
    if (colorError) next.color = "El color es obligatorio.";

    const imageError = validateUrl(editData.imageUrl);
    if (imageError) next.imageUrl = imageError;

    return next;
  }

  const handleSaveEdit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);
      setErrors({});
      await onEdit?.(editData);
      setEditOpen(false);
    } catch (err) {
      setErrors({
        title: err instanceof Error ? err.message : "No se pudo guardar el producto.",
      });
    } finally {
      setSaving(false);
    }
  };

  const fieldLabels: Record<keyof EditFieldErrors, string> = {
    title: "Nombre",
    description: "Descripción",
    price: "Precio",
    discountedPrice: "Precio con descuento",
    discountPersent: "Descuento %",
    quantity: "Cantidad",
    brand: "Marca",
    color: "Color",
    imageUrl: "URL de imagen",
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
            <label className="text-sm font-medium">
              {fieldLabels.title} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => {
                setEditData({ ...editData, title: e.target.value });
                clearFieldError("title");
              }}
              className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-1 ${getInputBorderClass(errors.title)}`}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "edit-title-error" : undefined}
            />
            {errors.title ? (
              <p id="edit-title-error" className="mt-1 text-xs font-medium text-red-500">
                {errors.title}
              </p>
            ) : null}
          </div>
          <div>
            <label className="text-sm font-medium">
              {fieldLabels.description} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={editData.description || ""}
              onChange={(e) => {
                setEditData({ ...editData, description: e.target.value });
                clearFieldError("description");
              }}
              rows={4}
              className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-1 ${getInputBorderClass(errors.description)}`}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? "edit-description-error" : undefined}
            />
            {errors.description ? (
              <p id="edit-description-error" className="mt-1 text-xs font-medium text-red-500">
                {errors.description}
              </p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">
                {fieldLabels.price} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={editData.price}
                onChange={(e) => {
                  handleNumberChange("price", e.target.value);
                  clearFieldError("price");
                }}
                className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-1 ${getInputBorderClass(errors.price)}`}
                aria-invalid={Boolean(errors.price)}
                aria-describedby={errors.price ? "edit-price-error" : undefined}
              />
              {errors.price ? (
                <p id="edit-price-error" className="mt-1 text-xs font-medium text-red-500">
                  {errors.price}
                </p>
              ) : null}
            </div>
            <div>
              <label className="text-sm font-medium">
                {fieldLabels.discountedPrice} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={editData.discountedPrice}
                onChange={(e) => {
                  handleNumberChange("discountedPrice", e.target.value);
                  clearFieldError("discountedPrice");
                }}
                className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-1 ${getInputBorderClass(errors.discountedPrice)}`}
                aria-invalid={Boolean(errors.discountedPrice)}
                aria-describedby={errors.discountedPrice ? "edit-discounted-price-error" : undefined}
              />
              {errors.discountedPrice ? (
                <p id="edit-discounted-price-error" className="mt-1 text-xs font-medium text-red-500">
                  {errors.discountedPrice}
                </p>
              ) : null}
            </div>
            <div>
              <label className="text-sm font-medium">
                {fieldLabels.discountPersent} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={editData.discountPersent}
                onChange={(e) => {
                  handleNumberChange("discountPersent", e.target.value);
                  clearFieldError("discountPersent");
                }}
                className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-1 ${getInputBorderClass(errors.discountPersent)}`}
                aria-invalid={Boolean(errors.discountPersent)}
                aria-describedby={errors.discountPersent ? "edit-discount-error" : undefined}
              />
              {errors.discountPersent ? (
                <p id="edit-discount-error" className="mt-1 text-xs font-medium text-red-500">
                  {errors.discountPersent}
                </p>
              ) : null}
            </div>
            <div>
              <label className="text-sm font-medium">
                {fieldLabels.quantity} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={editData.quantity}
                onChange={(e) => {
                  handleNumberChange("quantity", e.target.value);
                  clearFieldError("quantity");
                }}
                className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-1 ${getInputBorderClass(errors.quantity)}`}
                aria-invalid={Boolean(errors.quantity)}
                aria-describedby={errors.quantity ? "edit-quantity-error" : undefined}
              />
              {errors.quantity ? (
                <p id="edit-quantity-error" className="mt-1 text-xs font-medium text-red-500">
                  {errors.quantity}
                </p>
              ) : null}
            </div>
            <div>
              <label className="text-sm font-medium">
                {fieldLabels.brand} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editData.brand}
                onChange={(e) => {
                  setEditData({ ...editData, brand: e.target.value });
                  clearFieldError("brand");
                }}
                className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-1 ${getInputBorderClass(errors.brand)}`}
                aria-invalid={Boolean(errors.brand)}
                aria-describedby={errors.brand ? "edit-brand-error" : undefined}
              />
              {errors.brand ? (
                <p id="edit-brand-error" className="mt-1 text-xs font-medium text-red-500">
                  {errors.brand}
                </p>
              ) : null}
            </div>
            <div>
              <label className="text-sm font-medium">
                {fieldLabels.color} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editData.color}
                onChange={(e) => {
                  setEditData({ ...editData, color: e.target.value });
                  clearFieldError("color");
                }}
                className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-1 ${getInputBorderClass(errors.color)}`}
                aria-invalid={Boolean(errors.color)}
                aria-describedby={errors.color ? "edit-color-error" : undefined}
              />
              {errors.color ? (
                <p id="edit-color-error" className="mt-1 text-xs font-medium text-red-500">
                  {errors.color}
                </p>
              ) : null}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">
              {fieldLabels.imageUrl} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editData.imageUrl}
              onChange={(e) => {
                setEditData({ ...editData, imageUrl: e.target.value });
                clearFieldError("imageUrl");
              }}
              className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition-all focus:ring-1 ${getInputBorderClass(errors.imageUrl)}`}
              aria-invalid={Boolean(errors.imageUrl)}
              aria-describedby={errors.imageUrl ? "edit-image-error" : undefined}
            />
            {errors.imageUrl ? (
              <p id="edit-image-error" className="mt-1 text-xs font-medium text-red-500">
                {errors.imageUrl}
              </p>
            ) : null}
          </div>
          <Button
            onClick={handleSaveEdit}
            className="w-full"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
