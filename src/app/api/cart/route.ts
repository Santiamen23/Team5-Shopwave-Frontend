import { NextResponse } from "next/server";

import { getSessionToken } from "@/lib/auth/session";
import { getCart } from "@/services/cart.service";

export async function GET() {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: "No hay sesión activa." }, { status: 401 });
  }

  try {
    const cart = await getCart(token);
    return NextResponse.json(cart);
  } catch (error) {
    console.error("[BFF /api/cart] Error al llamar al backend:", error);
    const message = error instanceof Error ? error.message : "No se pudo cargar el carrito.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
