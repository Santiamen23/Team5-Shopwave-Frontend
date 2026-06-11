"use server";

import { getSessionToken } from "@/lib/auth/session";
import {
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "@/services/admin-product.service";
import {
  AdminCreateProductPayload,
  Product,
} from "@/models/product.model";

export async function serverCreateProduct(
  payload: AdminCreateProductPayload
): Promise<Product> {
  const token = await getSessionToken();
  if (!token) {
    throw new Error("Unauthorized");
  }
  return await createAdminProduct(payload, token);
}

export async function serverUpdateProduct(product: Product): Promise<Product> {
  const token = await getSessionToken();
  if (!token) {
    throw new Error("Unauthorized");
  }
  return await updateAdminProduct(product.id, product, token);
}

export async function serverDeleteProduct(productId: number): Promise<void> {
  const token = await getSessionToken();
  if (!token) {
    throw new Error("Unauthorized");
  }
  await deleteAdminProduct(productId, token);
}
