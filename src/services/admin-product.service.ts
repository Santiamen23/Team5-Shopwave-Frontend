import type {
	AdminCreateProductPayload,
	AdminUpdateProductPayload,
	Product,
} from "@/models/product.model";
import type { ApiResponse } from "@/types/api-response.type";

import { apiProtectedJsonFetch, createJsonRequestInit } from "./api.service";

export async function createAdminProduct(
	payload: AdminCreateProductPayload,
	jwt: string,
): Promise<Product> {
	return apiProtectedJsonFetch<Product>(
		"/admin/products/",
		jwt,
		createJsonRequestInit("POST", payload),
	);
}

export async function createAdminProducts(
	payload: AdminCreateProductPayload[],
	jwt: string,
): Promise<ApiResponse> {
	return apiProtectedJsonFetch<ApiResponse>(
		"/admin/products/creates",
		jwt,
		createJsonRequestInit("POST", payload),
	);
}

export async function updateAdminProduct(
	productId: string | number,
	payload: AdminUpdateProductPayload,
	jwt: string,
): Promise<Product> {
	return apiProtectedJsonFetch<Product>(
		`/admin/products/${productId}/update`,
		jwt,
		createJsonRequestInit("PUT", payload),
	);
}

export async function deleteAdminProduct(
	productId: string | number,
	jwt: string,
): Promise<ApiResponse> {
	return apiProtectedJsonFetch<ApiResponse>(
		`/admin/products/${productId}/delete`,
		jwt,
		{
			method: "DELETE",
		},
	);
}
