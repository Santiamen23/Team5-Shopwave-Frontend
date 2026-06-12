import { NextResponse } from "next/server";
import { getSessionToken } from "@/lib/auth/session";
import {
  AdminCreateProductPayload,
  AdminUpdateProductPayload,
} from "@/models/product.model";
import {
  createAdminProduct,
  createAdminProducts,
  deleteAdminProduct,
  updateAdminProduct,
} from "@/services/admin-product.service";
import { ApiError } from "@/services/api.service";

function createErrorResponse(error: unknown, fallbackMessage: string) {
  const status = error instanceof ApiError ? error.status : 500;
  const message = error instanceof Error ? error.message : fallbackMessage;

  return NextResponse.json({ message }, { status });
}

export async function POST(request: Request) {
  const jwt = await getSessionToken();

  if (!jwt) {
    return NextResponse.json({ message: "No hay sesión activa." }, { status: 401 });
  }

  try {
    const payload = await request.json();

    if (Array.isArray(payload)) {
      const products = await createAdminProducts(payload as AdminCreateProductPayload[], jwt);
      return NextResponse.json(products);
    }

    const product = await createAdminProduct(payload as AdminCreateProductPayload, jwt);
    return NextResponse.json(product);
  } catch (error) {
    return createErrorResponse(error, "Parametros incompletos o servidor caido.");
  }
}

export async function PATCH(request: Request) {
  const jwt = await getSessionToken();

  if (!jwt) {
    return NextResponse.json({ message: "No hay sesión activa." }, { status: 401 });
  }

  try {
    const payload = await (request.json()) as AdminUpdateProductPayload;
    const product = await updateAdminProduct(payload.id, payload, jwt);
    return NextResponse.json(product);
  } catch (error) {
    return createErrorResponse(error, "Parametros incompletos o servidor caido.");
  }
}

export async function DELETE(request: Request) {
  const jwt = await getSessionToken();

  if (!jwt) {
    return NextResponse.json({ message: "No hay sesión activa." }, { status: 401 });
  }

  try {
    const payload = await (request.json()) as number;
    const reponse = await deleteAdminProduct(payload, jwt);
    return NextResponse.json(reponse);
  } catch (error) {
    return createErrorResponse(error, "Producto no encontrado o servidor caido.");
  }
}
