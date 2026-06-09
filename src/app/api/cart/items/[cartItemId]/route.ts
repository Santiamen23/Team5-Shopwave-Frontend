import { NextResponse } from "next/server";

import type { CartItem } from "@/models/cart.model";
import { getSessionToken } from "@/lib/auth/session";
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
    const message = error instanceof Error ? error.message : "No se pudo actualizar el carrito.";
    return NextResponse.json({ message }, { status: 500 });
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
    const message = error instanceof Error ? error.message : "No se pudo eliminar el artículo.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
