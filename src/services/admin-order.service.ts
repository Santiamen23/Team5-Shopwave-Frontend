import type { Order } from "@/models/order.model";
import type { ApiResponse } from "@/types/api-response.type";

import { apiProtectedJsonFetch } from "./api.service";

export async function getAdminOrders(jwt: string): Promise<Order[]> {
	return apiProtectedJsonFetch<Order[]>(
		"/admin/orders/",
		jwt,
		{
			cache: "no-store",
		},
	);
}

export async function confirmAdminOrder(orderId: string | number, jwt: string): Promise<Order> {
	return apiProtectedJsonFetch<Order>(
		`/admin/orders/${orderId}/confirmed`,
		jwt,
		{
			method: "PUT",
		},
	);
}

export async function shipAdminOrder(orderId: string | number, jwt: string): Promise<Order> {
	return apiProtectedJsonFetch<Order>(
		`/admin/orders/${orderId}/ship`,
		jwt,
		{
			method: "PUT",
		},
	);
}

export async function deliverAdminOrder(orderId: string | number, jwt: string): Promise<Order> {
	return apiProtectedJsonFetch<Order>(
		`/admin/orders/${orderId}/deliver`,
		jwt,
		{
			method: "PUT",
		},
	);
}

export async function cancelAdminOrder(orderId: string | number, jwt: string): Promise<Order> {
	return apiProtectedJsonFetch<Order>(
		`/admin/orders/${orderId}/cancel`,
		jwt,
		{
			method: "PUT",
		},
	);
}

export async function deleteAdminOrder(
	orderId: string | number,
	jwt: string,
): Promise<ApiResponse> {
	return apiProtectedJsonFetch<ApiResponse>(
		`/admin/orders/${orderId}/delete`,
		jwt,
		{
			method: "DELETE",
		},
	);
}
