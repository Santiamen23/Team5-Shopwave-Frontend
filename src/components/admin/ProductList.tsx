"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
	AlertTriangle,
	Banknote,
	Filter,
	Package,
	PackageX,
	Search,
	Sparkles,
} from "lucide-react";

import { ProductCard } from "./ProductCard";
import { CreatePopup } from "./CreatePopup";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/models/product.model";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/ui/search-bar";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/currency.util";

type StockFilter = "all" | "in_stock" | "low_stock" | "out_of_stock" | "on_sale";

const STOCK_FILTERS: Array<{
	value: StockFilter;
	label: string;
}> = [
	{ value: "all", label: "Todos" },
	{ value: "in_stock", label: "En stock" },
	{ value: "low_stock", label: "Stock bajo" },
	{ value: "out_of_stock", label: "Sin stock" },
	{ value: "on_sale", label: "En oferta" },
];

interface ProductStats {
	total: number;
	onSale: number;
	lowStock: number;
	outOfStock: number;
	totalValue: number;
}

function computeStats(products: Product[]): ProductStats {
	let onSale = 0;
	let lowStock = 0;
	let outOfStock = 0;
	let totalValue = 0;
	for (const product of products) {
		if (product.discountPersent > 0) onSale += 1;
		if (product.quantity <= 0) outOfStock += 1;
		else if (product.quantity <= 5) lowStock += 1;
		totalValue += product.discountedPrice * product.quantity;
	}
	return {
		total: products.length,
		onSale,
		lowStock,
		outOfStock,
		totalValue,
	};
}

export function ProductList() {
	const { products, createProduct, updateProduct, deleteProduct, error } =
		useProducts();
	const [query, setQuery] = useState("");
	const [stockFilter, setStockFilter] = useState<StockFilter>("all");
	const deferredQuery = useDeferredValue(query);

	const stats = useMemo(() => computeStats(products), [products]);
	const stockCounts = useMemo(() => {
		const counts: Record<StockFilter, number> = {
			all: products.length,
			in_stock: 0,
			low_stock: 0,
			out_of_stock: 0,
			on_sale: 0,
		};
		for (const product of products) {
			if (product.quantity <= 0) {
				counts.out_of_stock += 1;
			} else if (product.quantity <= 5) {
				counts.low_stock += 1;
			} else {
				counts.in_stock += 1;
			}
			if (product.discountPersent > 0) {
				counts.on_sale += 1;
			}
		}
		return counts;
	}, [products]);

	const filteredProducts = useMemo(() => {
		const q = deferredQuery.trim().toLowerCase();
		return products.filter((product) => {
			if (stockFilter === "in_stock" && product.quantity <= 5) return false;
			if (stockFilter === "low_stock" && (product.quantity <= 0 || product.quantity > 5))
				return false;
			if (stockFilter === "out_of_stock" && product.quantity > 0) return false;
			if (stockFilter === "on_sale" && product.discountPersent <= 0) return false;
			if (!q) return true;
			const haystack = [product.title, product.brand, product.color]
				.join(" ")
				.toLowerCase();
			return haystack.includes(q);
		});
	}, [products, stockFilter, deferredQuery]);

	return (
		<div className="space-y-6">
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				<StatTile
					icon={<Package className="h-4 w-4" />}
					label="Total productos"
					value={stats.total}
					tone="brand"
				/>
				<StatTile
					icon={<Sparkles className="h-4 w-4" />}
					label="En oferta"
					value={stats.onSale}
					tone="warning"
				/>
				<StatTile
					icon={<AlertTriangle className="h-4 w-4" />}
					label="Stock bajo"
					value={stats.lowStock}
					tone="warning"
				/>
				<StatTile
					icon={<Banknote className="h-4 w-4" />}
					label="Valor inventario"
					value={formatCurrency(stats.totalValue)}
					tone="brand"
				/>
			</div>

			<Card className="border-slate-200/80 bg-white/95 shadow-[0_18px_50px_-36px_oklch(0.18_0.02_250_/_0.35)]">
				<CardContent className="space-y-4 p-4 sm:p-5">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<SearchBar
							label="Buscar producto"
							placeholder="Buscar por título, marca o color"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							resultText={`${filteredProducts.length} de ${products.length} productos`}
							wrapperClassName="flex-1"
						/>
						<CreatePopup onCreate={createProduct} />
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
							<Filter className="h-3.5 w-3.5" />
							Filtros
						</span>
						{STOCK_FILTERS.map((option) => {
							const isActive = stockFilter === option.value;
							const count = stockCounts[option.value] ?? 0;
							return (
								<button
									key={option.value}
									type="button"
									onClick={() => setStockFilter(option.value)}
									className={cn(
										"inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
										isActive
											? "border-transparent bg-brand-600 text-white"
											: "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
									)}
								>
									{option.label}
									<span
										className={cn(
											"rounded-full px-1.5 text-[0.65rem] font-bold",
											isActive
												? "bg-white/20 text-white"
												: "bg-slate-100 text-slate-500",
										)}
									>
										{count}
									</span>
								</button>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{error ? (
				<div className="rounded-2xl border border-danger-500/30 bg-danger-50 p-4 text-sm text-danger-700">
					{error}
				</div>
			) : null}

			{filteredProducts.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
					<div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-500">
						{products.length === 0 ? (
							<PackageX className="h-5 w-5" />
						) : (
							<Search className="h-5 w-5" />
						)}
					</div>
					<p className="mt-4 text-sm font-semibold text-slate-700">
						{products.length === 0
							? "Aún no hay productos en el inventario."
							: "Ningún producto coincide con tu búsqueda."}
					</p>
					<p className="mt-1 text-xs text-slate-500">
						{products.length === 0
							? "Crea el primero con el botón «Agregar Producto»."
							: "Prueba con otro término o cambia el filtro."}
					</p>
				</div>
			) : (
				<div className="space-y-2">
					{filteredProducts.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							onEdit={updateProduct}
							onDelete={() => deleteProduct(product.id)}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function StatTile({
	icon,
	label,
	value,
	tone,
}: {
	icon: React.ReactNode;
	label: string;
	value: string | number;
	tone: "brand" | "warning";
}) {
	const toneClasses: Record<typeof tone, string> = {
		brand: "bg-brand-50 text-brand-700",
		warning: "bg-warning-50 text-warning-700",
	};
	return (
		<div
			className={cn(
				"flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 transition-shadow hover:shadow-md",
				toneClasses[tone],
			)}
		>
			<span
				className={cn(
					"grid h-10 w-10 place-items-center rounded-xl bg-white ring-1",
					tone === "brand" && "text-brand-600 ring-brand-100",
					tone === "warning" && "text-warning-600 ring-warning-500/20",
				)}
			>
				{icon}
			</span>
			<div>
				<p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] opacity-80">
					{label}
				</p>
				<p className="text-lg font-semibold tracking-tight">{value}</p>
			</div>
		</div>
	);
}
