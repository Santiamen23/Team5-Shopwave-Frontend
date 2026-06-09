import type { CartItem, UpdateCartItemPayload } from "@/models/cart.model";
import type { ApiResponse } from "@/types/api-response.type";

import { apiProtectedJsonFetch, createJsonRequestInit } from "./api.service";

export async function updateCartItem(
	cartItemId: string | number,
	payload: UpdateCartItemPayload,
	jwt: string,
): Promise<CartItem> {
	return apiProtectedJsonFetch<CartItem>(
		`/cart_items/${cartItemId}`,
		jwt,
		createJsonRequestInit("PUT", payload),
	);
}

export async function removeCartItem(
	cartItemId: string | number,
	jwt: string,
): Promise<ApiResponse> {
	return apiProtectedJsonFetch<ApiResponse>(
		`/cart_items/${cartItemId}`,
		jwt,
		{
			method: "DELETE",
		},
	);
}
