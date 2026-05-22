import type {
	Product,
	ProductQueryFilters,
} from "@/models/product.model";
import type { PagedResponse } from "@/types/api-response.type";

import { apiFetch, apiJsonFetch } from "./api.service";

export async function getProducts(): Promise<Product[]> {
	return apiJsonFetch<Product[]>("/products", {
		cache: "no-store",
	});
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

	return response.json() as Promise<Product>;
}

export async function getProductsSortedByDiscountedPrice(
	sort: "asc" | "desc" = "asc",
	page = 0,
	pageSize = 10,
): Promise<PagedResponse<Product>> {
	return apiJsonFetch<PagedResponse<Product>>(
		"/products/sorted",
		{
			cache: "no-store",
		},
		{ sort, page, pageSize },
	);
}

export async function getProductsByCategory(
	categoryName: string,
	page = 0,
	pageSize = 10,
): Promise<PagedResponse<Product>> {
	return apiJsonFetch<PagedResponse<Product>>(
		"/products/by-category",
		{
			cache: "no-store",
		},
		{ categoryName, page, pageSize },
	);
}

export async function getProductsByCategoryAndPriceRange(
	categoryName: string,
	options: {
		minPrice?: number;
		maxPrice?: number;
		page?: number;
		pageSize?: number;
	} = {},
): Promise<PagedResponse<Product>> {
	return apiJsonFetch<PagedResponse<Product>>(
		"/products/by-category-and-price",
		{
			cache: "no-store",
		},
		{
			categoryName,
			minPrice: options.minPrice,
			maxPrice: options.maxPrice,
			page: options.page ?? 0,
			pageSize: options.pageSize ?? 10,
		},
	);
}

export async function getFilteredProducts(
	filters: ProductQueryFilters = {},
): Promise<PagedResponse<Product>> {
	return apiJsonFetch<PagedResponse<Product>>(
		"/products/all",
		{
			cache: "no-store",
		},
		{
			category: filters.category,
			colors: filters.colors,
			sizes: filters.sizes,
			minPrice: filters.minPrice,
			maxPrice: filters.maxPrice,
			minDiscount: filters.minDiscount,
			sort: filters.sort,
			stock: filters.stock,
			pageNumber: filters.pageNumber ?? 0,
			pageSize: filters.pageSize ?? 10,
		},
	);
}

export async function searchProducts(query: string): Promise<Product[]> {
	return apiJsonFetch<Product[]>(
		"/products/products/search",
		{
			cache: "no-store",
		},
		{ q: query },
	);
}
