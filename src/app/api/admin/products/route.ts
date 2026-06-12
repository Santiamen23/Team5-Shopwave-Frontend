import { NextResponse } from "next/server";
import { getSessionToken } from "@/lib/auth/session";
import { AdminCreateProductPayload, Product } from "@/models/product.model";
import {
  createAdminProduct,
  createAdminProducts,
  deleteAdminProduct,
  updateAdminProduct,
} from "@/services/admin-product.service";

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
    const message = error instanceof Error ? error.message : "Parametros incompletos o servidor caido.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const jwt = await getSessionToken();

  if (!jwt) {
    return NextResponse.json({ message: "No hay sesión activa." }, { status: 401 });
  }

  try {
    const payload = await (request.json()) as Product;
    const product = await updateAdminProduct(payload.id, payload, jwt);
    return NextResponse.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Parametros incompletos o servidor caido.";
    return NextResponse.json({ message }, { status: 500 });
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
    const message = error instanceof Error ? error.message : "Producto no encontrado o servidor caido.";
    return NextResponse.json({ message }, { status: 500 });
  }
}