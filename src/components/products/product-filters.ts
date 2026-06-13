import type { ProductCardData, ProductCategory } from "@/models/product.model";

export type CatalogProduct = ProductCardData & {
	category?: ProductCategory | null;
	createdAt?: string | null;
};

export type StockFilter = "all" | "in_stock" | "low_stock" | "out_of_stock" | "on_sale";

export type PriceRangeId = "any" | "under_1000" | "1000_5000" | "over_5000";

export type SortKey =
	| "featured"
	| "name_asc"
	| "name_desc"
	| "price_asc"
	| "price_desc"
	| "discount_desc"
	| "newest";

export interface ProductFilters {
	query: string;
	stock: StockFilter;
	categories: string[];
	brands: string[];
	colors: string[];
	priceRange: PriceRangeId;
	sort: SortKey;
}

export const EMPTY_FILTERS: ProductFilters = {
	query: "",
	stock: "all",
	categories: [],
	brands: [],
	colors: [],
	priceRange: "any",
	sort: "featured",
};

export const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
	{ value: "featured", label: "Destacados" },
	{ value: "newest", label: "Más recientes" },
	{ value: "price_asc", label: "Precio: menor a mayor" },
	{ value: "price_desc", label: "Precio: mayor a menor" },
	{ value: "discount_desc", label: "Mayor descuento" },
	{ value: "name_asc", label: "Nombre A-Z" },
	{ value: "name_desc", label: "Nombre Z-A" },
];

export const STOCK_OPTIONS: Array<{ value: StockFilter; label: string }> = [
	{ value: "all", label: "Todos" },
	{ value: "in_stock", label: "En stock" },
	{ value: "low_stock", label: "Stock bajo" },
	{ value: "out_of_stock", label: "Sin stock" },
	{ value: "on_sale", label: "En oferta" },
];

export const PRICE_RANGES: Array<{
	value: PriceRangeId;
	label: string;
	min?: number;
	max?: number;
}> = [
	{ value: "any", label: "Cualquier precio" },
	{ value: "under_1000", label: "Menos de Bs 1.000", max: 1000 },
	{ value: "1000_5000", label: "Bs 1.000 — 5.000", min: 1000, max: 5000 },
	{ value: "over_5000", label: "Más de Bs 5.000", min: 5000 },
];

export function getCategoryHierarchy(product: CatalogProduct): {
	top: string | null;
	second: string | null;
	third: string | null;
} {
	return {
		top: product.category?.parentCategory?.parentCategory?.name ?? null,
		second: product.category?.parentCategory?.name ?? null,
		third: product.category?.name ?? null,
	};
}

export function getCategoryNames(product: CatalogProduct): string[] {
	return [
		product.category?.name,
		product.category?.parentCategory?.name,
		product.category?.parentCategory?.parentCategory?.name,
	].filter(Boolean) as string[];
}

export function uniqueValues(values: Array<string | null | undefined>): string[] {
	const seen = new Set<string>();
	for (const value of values) {
		if (value === null || value === undefined) continue;
		const trimmed = String(value).trim();
		if (trimmed.length === 0) continue;
		seen.add(trimmed);
	}
	return Array.from(seen).sort((a, b) =>
		a.localeCompare(b, "es", { sensitivity: "base" }),
	);
}

function matchStockFilter(quantity: number, onSale: boolean, stock: StockFilter) {
	switch (stock) {
		case "all":
			return true;
		case "in_stock":
			return quantity > 5;
		case "low_stock":
			return quantity > 0 && quantity <= 5;
		case "out_of_stock":
			return quantity <= 0;
		case "on_sale":
			return onSale;
	}
}

function matchPriceRange(price: number, range: PriceRangeId) {
	const config = PRICE_RANGES.find((r) => r.value === range);
	if (!config || config.value === "any") return true;
	const min = config.min ?? -Infinity;
	const max = config.max ?? Infinity;
	return price >= min && price <= max;
}

export function applyFilters(
	products: CatalogProduct[],
	filters: ProductFilters,
): CatalogProduct[] {
	const q = filters.query.trim().toLowerCase();
	const categorySet = new Set(filters.categories);
	const brandSet = new Set(filters.brands);
	const colorSet = new Set(filters.colors);

	const filtered = products.filter((product) => {
		const price = product.discountedPrice;
		const onSale = product.discountedPrice < product.price;
		const haystack = [product.title, product.brand, product.color]
			.join(" ")
			.toLowerCase();

		if (q && !haystack.includes(q)) return false;
		if (!matchStockFilter(product.quantity, onSale, filters.stock)) return false;
		if (categorySet.size > 0) {
			const cats = getCategoryNames(product);
			if (!cats.some((c) => categorySet.has(c))) return false;
		}
		if (brandSet.size > 0 && !brandSet.has(product.brand)) return false;
		if (colorSet.size > 0 && !colorSet.has(product.color)) return false;
		if (!matchPriceRange(price, filters.priceRange)) return false;
		return true;
	});

	return sortProducts(filtered, filters.sort);
}

function sortProducts(
	products: CatalogProduct[],
	sort: SortKey,
): CatalogProduct[] {
	const copy = [...products];
	switch (sort) {
		case "name_asc":
			return copy.sort((a, b) =>
				a.title.localeCompare(b.title, "es", { sensitivity: "base" }),
			);
		case "name_desc":
			return copy.sort((a, b) =>
				b.title.localeCompare(a.title, "es", { sensitivity: "base" }),
			);
		case "price_asc":
			return copy.sort((a, b) => a.discountedPrice - b.discountedPrice);
		case "price_desc":
			return copy.sort((a, b) => b.discountedPrice - a.discountedPrice);
		case "discount_desc":
			return copy.sort((a, b) => b.discountPersent - a.discountPersent);
		case "newest":
			return copy.sort((a, b) => {
				const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
				const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
				return bTime - aTime;
			});
		case "featured":
		default:
			return copy;
	}
}

export function countActiveFilters(filters: ProductFilters): number {
	let count = 0;
	if (filters.query.trim().length > 0) count += 1;
	if (filters.stock !== "all") count += 1;
	count += filters.categories.length;
	count += filters.brands.length;
	count += filters.colors.length;
	if (filters.priceRange !== "any") count += 1;
	return count;
}

export function extractFacets(products: CatalogProduct[]) {
	const categories = new Set<string>();
	const brands = new Set<string>();
	const colors = new Set<string>();

	for (const product of products) {
		for (const cat of getCategoryNames(product)) categories.add(cat);
		if (product.brand) brands.add(product.brand);
		if (product.color) colors.add(product.color);
	}

	return {
		categories: Array.from(categories).sort((a, b) =>
			a.localeCompare(b, "es", { sensitivity: "base" }),
		),
		brands: Array.from(brands).sort((a, b) =>
			a.localeCompare(b, "es", { sensitivity: "base" }),
		),
		colors: Array.from(colors).sort((a, b) =>
			a.localeCompare(b, "es", { sensitivity: "base" }),
		),
	};
}
