import { NextResponse } from "next/server";

import type { AddCartItemPayload } from "@/models/cart.model";
import { getSessionToken } from "@/lib/auth/session";
import { addCartItem, getCart } from "@/services/cart.service";

export async function POST(request: Request) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: "No hay sesión activa." }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as AddCartItemPayload;
    await addCartItem(payload, token);
    const cart = await getCart(token);
    return NextResponse.json(cart);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo agregar el producto al carrito.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
