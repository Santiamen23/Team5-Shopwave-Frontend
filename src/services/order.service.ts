import type { CreateOrderPayload, Order } from "@/models/order.model";

import { apiProtectedJsonFetch, createJsonRequestInit } from "./api.service";

export async function createOrder(payload: CreateOrderPayload, jwt: string): Promise<Order> {
	return apiProtectedJsonFetch<Order>(
		"/orders/",
		jwt,
		createJsonRequestInit("POST", payload),
	);
}

export async function getUserOrders(jwt: string): Promise<Order[]> {
	return apiProtectedJsonFetch<Order[]>(
		"/orders/user",
		jwt,
		{
			cache: "no-store",
		},
	);
}

export async function getOrderById(orderId: string | number, jwt: string): Promise<Order> {
	return apiProtectedJsonFetch<Order>(
		`/orders/${orderId}`,
		jwt,
		{
			cache: "no-store",
		},
	);
}
