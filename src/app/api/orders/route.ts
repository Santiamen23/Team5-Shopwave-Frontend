import { NextResponse } from "next/server";

import type { CreateOrderPayload, Order } from "@/models/order.model";
import { getSessionToken } from "@/lib/auth/session";
import { createOrder } from "@/services/order.service";

export async function POST(request: Request) {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: "No hay sesión activa." }, { status: 401 });
  }

  let payload: CreateOrderPayload;

  try {
    payload = (await request.json()) as CreateOrderPayload;
  } catch {
    return NextResponse.json(
      { message: "El cuerpo de la solicitud no es JSON válido." },
      { status: 400 },
    );
  }

  try {
    const order: Order = await createOrder(payload, token);
    return NextResponse.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo crear la orden.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
