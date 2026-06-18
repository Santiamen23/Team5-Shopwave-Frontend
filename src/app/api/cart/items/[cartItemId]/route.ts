import { NextResponse } from "next/server";

import type { CartItem } from "@/models/cart.model";
import { getSessionToken } from "@/lib/auth/session";
import { ApiError } from "@/services/api.service";
import { getCart } from "@/services/cart.service";
import { removeCartItem, updateCartItem } from "@/services/cart-item.service";

interface RouteParams {
  params: Promise<{ cartItemId: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: "No hay sesión activa." }, { status: 401 });
  }

  try {
    const { cartItemId } = await params;
    const payload = (await request.json()) as CartItem;
    await updateCartItem(cartItemId, payload, token);
    const cart = await getCart(token);
    return NextResponse.json(cart);
  } catch (error) {
    console.error("[BFF /api/cart/items/:id PUT] Error al llamar al backend:", error);
    const message = error instanceof Error ? error.message : "No se pudo actualizar el carrito.";
    const status = error instanceof ApiError ? error.status : 500;
    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: "No hay sesión activa." }, { status: 401 });
  }

  try {
    const { cartItemId } = await params;
    await removeCartItem(cartItemId, token);
    const cart = await getCart(token);
    return NextResponse.json(cart);
  } catch (error) {
    console.error("[BFF /api/cart/items/:id DELETE] Error al llamar al backend:", error);
    const message = error instanceof Error ? error.message : "No se pudo eliminar el artículo.";
    const status = error instanceof ApiError ? error.status : 500;
    return NextResponse.json({ message }, { status });
  }
}
