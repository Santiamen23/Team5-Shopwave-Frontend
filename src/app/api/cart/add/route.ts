import { NextResponse } from "next/server";

import type { AddCartItemPayload, Cart } from "@/models/cart.model";
import { getSessionToken } from "@/lib/auth/session";
import { addCartItem, getCart } from "@/services/cart.service";

export async function POST(request: Request) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: "No hay sesión activa." }, { status: 401 });
  }

  let payload: AddCartItemPayload;

  try {
    payload = (await request.json()) as AddCartItemPayload;
  } catch {
    return NextResponse.json({ message: "El cuerpo de la solicitud no es JSON válido." }, { status: 400 });
  }

  try {
    const cart: Cart = await addCartItem(payload, token);
    return NextResponse.json(cart);
  } catch (error) {
    const isCartNotInitialized =
      error instanceof Error &&
      error.message.toLowerCase().includes("cart") &&
      error.message.toLowerCase().includes("null");

    if (isCartNotInitialized) {
      try {
        await getCart(token);
        const cart: Cart = await addCartItem(payload, token);
        return NextResponse.json(cart);
      } catch (retryError) {
        console.error("[BFF /api/cart/add] Error al reintentar addCartItem:", retryError);
        const message = retryError instanceof Error ? retryError.message : "No se pudo agregar el producto al carrito.";
        return NextResponse.json({ message }, { status: 500 });
      }
    }

    console.error("[BFF /api/cart/add] Error al llamar al backend:", error);
    const message = error instanceof Error ? error.message : "No se pudo agregar el producto al carrito.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
