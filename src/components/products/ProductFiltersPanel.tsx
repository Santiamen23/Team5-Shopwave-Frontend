"use client";

import { Check, Filter, Palette, Tag, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	PRICE_RANGES,
	STOCK_OPTIONS,
	type PriceRangeId,
	type ProductFilters,
	type StockFilter,
} from "./product-filters";

interface ProductFiltersPanelProps {
	filters: ProductFilters;
	facets: {
		categories: string[];
		brands: string[];
		colors: string[];
	};
	onChange: (filters: ProductFilters) => void;
	onClear: () => void;
	activeCount: number;
}

export function ProductFiltersPanel({
	filters,
	facets,
	onChange,
	onClear,
	activeCount,
}: ProductFiltersPanelProps) {
	function toggleArrayValue<T>(arr: T[], value: T): T[] {
		return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
	}

	function patch(next: Partial<ProductFilters>) {
		onChange({ ...filters, ...next });
	}

	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
				<div className="flex items-center gap-2">
					<span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600">
						<Filter className="h-4 w-4" />
					</span>
					<div>
						<p className="text-sm font-semibold tracking-tight text-slate-900">
							Filtros
						</p>
						<p className="text-xs text-slate-500">
							{activeCount === 0
								? "Sin filtros aplicados"
								: `${activeCount} ${activeCount === 1 ? "filtro" : "filtros"} activos`}
						</p>
					</div>
				</div>
				{activeCount > 0 ? (
					<Button
						variant="ghost"
						size="sm"
						onClick={onClear}
						className="text-xs font-semibold text-brand-700 hover:bg-brand-50"
					>
						Limpiar
					</Button>
				) : null}
			</div>

			<div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
				<FilterSection
					icon={<Truck className="h-4 w-4 text-brand-600" />}
					title="Disponibilidad"
				>
					<div className="flex flex-wrap gap-2">
						{STOCK_OPTIONS.map((option) => {
							const isActive = filters.stock === option.value;
							return (
								<button
									key={option.value}
									type="button"
									onClick={() => patch({ stock: option.value as StockFilter })}
									className={cn(
										"inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
										isActive
											? "border-transparent bg-brand-600 text-white"
											: "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
									)}
								>
									{option.label}
								</button>
							);
						})}
					</div>
				</FilterSection>

				<FilterSection
					icon={<Tag className="h-4 w-4 text-brand-600" />}
					title="Categoría"
					hint={
						filters.categories.length > 0
							? `${filters.categories.length} seleccionadas`
							: undefined
					}
				>
					{facets.categories.length === 0 ? (
						<p className="text-xs italic text-slate-500">
							No hay categorías en el catálogo.
						</p>
					) : (
						<div className="flex flex-wrap gap-2">
							{facets.categories.map((category) => {
								const isActive = filters.categories.includes(category);
								return (
									<button
										key={category}
										type="button"
										onClick={() =>
											patch({ categories: toggleArrayValue(filters.categories, category) })
										}
										className={cn(
											"inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
											isActive
												? "border-transparent bg-brand-600 text-white"
												: "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
										)}
									>
										{isActive ? <Check className="h-3 w-3" /> : null}
										{category}
									</button>
								);
							})}
						</div>
					)}
				</FilterSection>

				<FilterSection
					icon={<Tag className="h-4 w-4 text-brand-600" />}
					title="Marca"
					hint={
						filters.brands.length > 0
							? `${filters.brands.length} seleccionadas`
							: undefined
					}
				>
					{facets.brands.length === 0 ? (
						<p className="text-xs italic text-slate-500">
							No hay marcas en el catálogo.
						</p>
					) : (
						<div className="grid grid-cols-2 gap-2">
							{facets.brands.map((brand) => {
								const isActive = filters.brands.includes(brand);
								return (
									<button
										key={brand}
										type="button"
										onClick={() =>
											patch({ brands: toggleArrayValue(filters.brands, brand) })
										}
										className={cn(
											"inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all",
											isActive
												? "border-transparent bg-brand-600 text-white"
												: "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
										)}
									>
										{isActive ? <Check className="h-3 w-3" /> : null}
										<span className="truncate">{brand}</span>
									</button>
								);
							})}
						</div>
					)}
				</FilterSection>

				<FilterSection
					icon={<Palette className="h-4 w-4 text-brand-600" />}
					title="Color"
					hint={
						filters.colors.length > 0
							? `${filters.colors.length} seleccionados`
							: undefined
					}
				>
					{facets.colors.length === 0 ? (
						<p className="text-xs italic text-slate-500">
							No hay colores en el catálogo.
						</p>
					) : (
						<div className="flex flex-wrap gap-2">
							{facets.colors.map((color) => {
								const isActive = filters.colors.includes(color);
								return (
									<button
										key={color}
										type="button"
										onClick={() =>
											patch({ colors: toggleArrayValue(filters.colors, color) })
										}
										className={cn(
											"inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-all",
											isActive
												? "border-transparent bg-brand-600 text-white"
												: "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
										)}
									>
										{isActive ? <Check className="h-3 w-3" /> : null}
										{color}
									</button>
								);
							})}
						</div>
					)}
				</FilterSection>

				<FilterSection
					icon={<Tag className="h-4 w-4 text-brand-600" />}
					title="Precio"
				>
					<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
						{PRICE_RANGES.map((range) => {
							const isActive = filters.priceRange === range.value;
							return (
								<button
									key={range.value}
									type="button"
									onClick={() => patch({ priceRange: range.value as PriceRangeId })}
									className={cn(
										"rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all",
										isActive
											? "border-transparent bg-brand-600 text-white"
											: "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
									)}
								>
									{range.label}
								</button>
							);
						})}
					</div>
				</FilterSection>
			</div>

			<div className="border-t border-slate-200 bg-slate-50/60 px-5 py-4">
				<Button
					variant="outline"
					className="w-full"
					onClick={onClear}
					disabled={activeCount === 0}
				>
					Limpiar todos los filtros
				</Button>
			</div>
		</div>
	);
}

function FilterSection({
	icon,
	title,
	hint,
	children,
}: {
	icon: React.ReactNode;
	title: string;
	hint?: string;
	children: React.ReactNode;
}) {
	return (
		<section className="space-y-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{icon}
					<h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-600">
						{title}
					</h3>
				</div>
				{hint ? (
					<Badge variant="brand" className="text-[0.6rem]">
						{hint}
					</Badge>
				) : null}
			</div>
			{children}
		</section>
	);
}
