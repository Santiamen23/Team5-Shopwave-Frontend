import type { AddCartItemPayload, Cart, CartItem } from "@/models/cart.model";

import { apiProtectedJsonFetch, createJsonRequestInit } from "./api.service";

export async function getCart(jwt: string): Promise<Cart> {
	return apiProtectedJsonFetch<Cart>(
		"/cart/",
		jwt,
		{
			cache: "no-store",
		},
	);
}

export async function addCartItem(payload: AddCartItemPayload, jwt: string): Promise<CartItem> {
	return apiProtectedJsonFetch<CartItem>(
		"/cart/add",
		jwt,
		createJsonRequestInit("PUT", payload),
	);
}
