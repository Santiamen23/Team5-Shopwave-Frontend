import type { Product } from "@/models/product.model";

import { apiFetch } from "./api.service";

async function readJsonResponse<T>(response: Response): Promise<T> {
	return response.json() as Promise<T>;
}

export async function getProducts(): Promise<Product[]> {
	const response = await apiFetch("/products", {
		cache: "no-store",
	});

	if (!response.ok) {
		throw new Error(`Failed to load products: ${response.status}`);
	}

	return readJsonResponse<Product[]>(response);
}

export async function getProductById(productId: string | number): Promise<Product | null> {
	const response = await apiFetch(`/products/${productId}`, {
		cache: "no-store",
	});

	if (response.status === 404) {
		return null;
	}

	if (!response.ok) {
		throw new Error(`Failed to load product ${productId}: ${response.status}`);
	}

	return readJsonResponse<Product>(response);
}
