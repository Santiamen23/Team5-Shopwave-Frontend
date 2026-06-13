"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { SearchBar } from "@/components/ui/search-bar";
import { ProductFiltersSheet } from "./ProductFiltersSheet";
import { SortMenu } from "./SortMenu";
import {
	EMPTY_FILTERS,
	applyFilters,
	countActiveFilters,
	extractFacets,
	type CatalogProduct,
	type ProductFilters,
} from "./product-filters";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductsSectionProps {
	products: CatalogProduct[];
	title?: string;
	description?: string;
	emptyMessage?: string;
	limit?: number;
	ctaHref?: string;
	ctaLabel?: string;
	enableSearch?: boolean;
	enableFilters?: boolean;
	initialFilters?: Partial<ProductFilters>;
}

export function ProductsSection({
	products,
	title,
	description,
	emptyMessage = "No se pudieron cargar productos.",
	limit,
	ctaHref,
	ctaLabel,
	enableSearch = false,
	enableFilters = false,
	initialFilters,
}: ProductsSectionProps) {
	const [filters, setFilters] = useState<ProductFilters>(() => ({
		...EMPTY_FILTERS,
		...initialFilters,
	}));
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize, setPageSize] = useState(3);
	const deferredQuery = useDeferredValue(filters.query);

	const facets = useMemo(() => extractFacets(products), [products]);

	const filteredProducts = useMemo(() => {
		const base: ProductFilters = { ...filters, query: deferredQuery };
		return applyFilters(products, base);
	}, [products, filters, deferredQuery]);

	const activeFilters = filters;
	const activeCount = countActiveFilters(activeFilters);

	const isCarousel = Boolean(limit);
	const carouselLimit = limit ? Math.min(limit, 12) : 0;
	const visibleProducts = isCarousel
		? filteredProducts.slice(0, carouselLimit)
		: filteredProducts.slice(0, 20);
	const totalPages = isCarousel ? Math.ceil(visibleProducts.length / pageSize) : 1;
	const activePage = totalPages > 0 ? Math.min(currentPage, totalPages - 1) : 0;
	const productPages = isCarousel
		? Array.from({ length: totalPages }, (_, pageIndex) =>
				visibleProducts.slice(
					pageIndex * pageSize,
					pageIndex * pageSize + pageSize,
				),
			)
		: [];

	const showFilters = enableSearch || enableFilters;

	const effectiveEmptyMessage = (() => {
		if (filteredProducts.length === 0) {
			if (activeCount > 0 || filters.query.trim().length > 0) {
				return "No hay productos que coincidan con los filtros aplicados.";
			}
			return emptyMessage;
		}
		return emptyMessage;
	})();

	useEffect(() => {
		const updatePageSize = () => {
			if (window.innerWidth >= 1024) {
				setPageSize(3);
				return;
			}

			if (window.innerWidth >= 640) {
				setPageSize(2);
				return;
			}

			setPageSize(1);
		};

		updatePageSize();
		window.addEventListener("resize", updatePageSize);

		return () => window.removeEventListener("resize", updatePageSize);
	}, []);

	useEffect(() => {
		if (!isCarousel || totalPages <= 1) {
			return;
		}

		const intervalId = window.setInterval(() => {
			setCurrentPage((previousPage) => (previousPage + 1) % totalPages);
		}, 5000);

		return () => window.clearInterval(intervalId);
	}, [isCarousel, totalPages]);

	const handlePreviousPage = () => {
		setCurrentPage((previousPage) => (previousPage - 1 + totalPages) % totalPages);
	};

	const handleNextPage = () => {
		setCurrentPage((previousPage) => (previousPage + 1) % totalPages);
	};

	const handleClearFilters = () => {
		setFilters({ ...EMPTY_FILTERS });
	};

	return (
		<Card className="mx-auto max-w-6xl gap-0 overflow-hidden border-slate-200/80 bg-white py-0 shadow-[0_24px_60px_-42px_oklch(0.18_0.02_250_/_0.3)]">
			{title || description ? (
				<CardHeader className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-brand-700 via-brand-600 to-info-700 px-5 py-7 text-white sm:px-7 sm:py-9 lg:px-9">
					<div className="bg-grid-faint absolute inset-0 opacity-30" />
					<div className="absolute -top-16 -right-12 h-44 w-44 rounded-full bg-white/15 blur-3xl" />
					<div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-info-500/30 blur-3xl" />
					<div className="relative space-y-2">
						{title ? (
							<CardTitle className="text-2xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-3xl lg:text-4xl">
								{title}
							</CardTitle>
						) : null}
						{description ? (
							<CardDescription className="max-w-2xl text-sm text-brand-100/90 sm:text-base">
								{description}
							</CardDescription>
						) : null}
					</div>
				</CardHeader>
			) : null}

			<CardContent className="space-y-6 p-4 sm:p-6 lg:p-8">
				{showFilters ? (
					<div className="space-y-4">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
							{enableSearch ? (
								<div className="flex-1">
									<SearchBar
										label="Buscar producto"
										value={filters.query}
										onChange={(event) =>
											setFilters((prev) => ({ ...prev, query: event.target.value }))
										}
										placeholder="Busca por nombre, marca o color"
										resultText={`${filteredProducts.length} de ${products.length} ${
											filteredProducts.length === 1 ? "resultado" : "resultados"
										}`}
									/>
								</div>
							) : (
								<div className="flex-1 text-sm text-slate-600">
									<span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-700">
										Resultados
									</span>
									<p className="mt-1 text-base font-semibold text-slate-900">
										{filteredProducts.length} de {products.length} productos
									</p>
								</div>
							)}
							{enableFilters ? (
								<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
									<SortMenu
										value={filters.sort}
										onChange={(sort) =>
											setFilters((prev) => ({ ...prev, sort }))
										}
									/>
									<ProductFiltersSheet
										filters={filters}
										facets={facets}
										onChange={setFilters}
										onClear={handleClearFilters}
										activeCount={activeCount}
									/>
								</div>
							) : null}
						</div>

						{enableFilters && activeCount > 0 ? (
							<ActiveFilterChips
								filters={filters}
								onChange={setFilters}
							/>
						) : null}
					</div>
				) : null}

				{visibleProducts.length > 0 ? (
					isCarousel ? (
						<section className="space-y-4">
							<div className="overflow-hidden">
								<div
									className="flex transition-transform duration-500 ease-out"
									style={{ transform: `translateX(-${activePage * 100}%)` }}
								>
									{productPages.map((page, pageIndex) => (
										<div key={pageIndex} className="w-full shrink-0">
											<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
												{page.map((product) => (
													<ProductCard
														key={product.id}
														product={product}
													/>
												))}
											</div>
										</div>
									))}
								</div>
							</div>

							{totalPages > 1 ? (
								<div className="flex items-center justify-between gap-3">
									<Button
										type="button"
										variant="outline"
										onClick={handlePreviousPage}
										className="h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm"
									>
										Anterior
									</Button>
									<span className="flex-1 text-center text-sm font-semibold text-slate-500">
										{activePage + 1} / {totalPages}
									</span>
									<Button
										type="button"
										variant="outline"
										onClick={handleNextPage}
										className="h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm"
									>
										Siguiente
									</Button>
								</div>
							) : null}
						</section>
					) : (
						<section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
							{visibleProducts.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</section>
					)
				) : (
					<div className="rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-white to-brand-50/40 p-8 text-center text-sm text-slate-600">
						{effectiveEmptyMessage}
					</div>
				)}

				{ctaHref && ctaLabel ? (
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<Button asChild variant="secondary" className="w-full sm:w-auto">
							<Link href={ctaHref}>{ctaLabel}</Link>
						</Button>
					</div>
				) : null}
			</CardContent>
		</Card>
	);
}

function ActiveFilterChips({
	filters,
	onChange,
}: {
	filters: ProductFilters;
	onChange: (filters: ProductFilters) => void;
}) {
	function removeFromArray<T>(arr: T[], value: T) {
		return arr.filter((v) => v !== value);
	}

	const chips: Array<{ key: string; label: string; onRemove: () => void }> = [];

	if (filters.stock !== "all") {
		const stockLabel: Record<string, string> = {
			in_stock: "En stock",
			low_stock: "Stock bajo",
			out_of_stock: "Sin stock",
			on_sale: "En oferta",
		};
		chips.push({
			key: `stock-${filters.stock}`,
			label: `Disponibilidad: ${stockLabel[filters.stock] ?? filters.stock}`,
			onRemove: () => onChange({ ...filters, stock: "all" }),
		});
	}
	for (const cat of filters.categories) {
		chips.push({
			key: `cat-${cat}`,
			label: `Categoría: ${cat}`,
			onRemove: () =>
				onChange({ ...filters, categories: removeFromArray(filters.categories, cat) }),
		});
	}
	for (const brand of filters.brands) {
		chips.push({
			key: `brand-${brand}`,
			label: `Marca: ${brand}`,
			onRemove: () =>
				onChange({ ...filters, brands: removeFromArray(filters.brands, brand) }),
		});
	}
	for (const color of filters.colors) {
		chips.push({
			key: `color-${color}`,
			label: `Color: ${color}`,
			onRemove: () =>
				onChange({ ...filters, colors: removeFromArray(filters.colors, color) }),
		});
	}
	if (filters.priceRange !== "any") {
		chips.push({
			key: `price-${filters.priceRange}`,
			label: `Precio: ${
				filters.priceRange === "under_1000"
					? "menos de Bs 1.000"
					: filters.priceRange === "1000_5000"
						? "Bs 1.000 — 5.000"
						: "más de Bs 5.000"
			}`,
			onRemove: () => onChange({ ...filters, priceRange: "any" }),
		});
	}

	if (chips.length === 0) return null;

	return (
		<div className="flex flex-wrap items-center gap-2">
			<span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
				Activos
			</span>
			{chips.map((chip) => (
				<button
					key={chip.key}
					type="button"
					onClick={chip.onRemove}
					className={cn(
						"inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 transition-colors",
						"hover:bg-brand-100",
					)}
				>
					{chip.label}
					<X className="h-3 w-3" />
				</button>
			))}
		</div>
	);
}
