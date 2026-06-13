"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";

import type { ProductCardData } from "@/models/product.model";

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

interface ProductsSectionProps {
	products: ProductCardData[];
	title?: string;
	description?: string;
	emptyMessage?: string;
	limit?: number;
	ctaHref?: string;
	ctaLabel?: string;
	enableSearch?: boolean;
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
}: ProductsSectionProps) {
	const [query, setQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize, setPageSize] = useState(3);
	const deferredQuery = useDeferredValue(query);
	const normalizedQuery = deferredQuery.trim().toLowerCase();

	const filteredProducts = enableSearch
		? products.filter((product) => {
				const searchableText = [product.title, product.brand, product.color]
					.join(" ")
					.toLowerCase();
				return searchableText.includes(normalizedQuery);
			})
		: products;

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
	const effectiveEmptyMessage =
		enableSearch && normalizedQuery
			? "No hay productos que coincidan con tu búsqueda."
			: emptyMessage;

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
				{enableSearch ? (
					<SearchBar
						label="Buscar producto"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Busca por nombre, marca o color"
						resultText={`${filteredProducts.length} resultado${filteredProducts.length === 1 ? "" : "s"}`}
					/>
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
													<ProductCard key={product.id} product={product} />
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
