"use client";

import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ProductFiltersPanel } from "./ProductFiltersPanel";
import type { ProductFilters } from "./product-filters";

interface ProductFiltersSheetProps {
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

export function ProductFiltersSheet({
	filters,
	facets,
	onChange,
	onClear,
	activeCount,
}: ProductFiltersSheetProps) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant={activeCount > 0 ? "default" : "secondary"}
					className={cn(
						"relative w-full justify-between sm:w-auto",
						activeCount > 0 &&
							"shadow-[0_8px_24px_-12px_oklch(0.43_0.18_245_/_0.55)]",
					)}
				>
					<span className="flex items-center gap-2">
						<Filter className="h-4 w-4" />
						Filtros
					</span>
					{activeCount > 0 ? (
						<span
							className={cn(
								"ml-2 grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[0.65rem] font-bold",
								"bg-white/20 text-white",
							)}
						>
							{activeCount}
						</span>
					) : null}
				</Button>
			</SheetTrigger>
			<SheetContent
				side="right"
				className="w-[min(92vw,28rem)] gap-0 border-l-0 bg-white p-0"
			>
				<SheetHeader className="sr-only">
					<SheetTitle>Filtros de productos</SheetTitle>
					<SheetDescription>
						Filtra el catálogo por disponibilidad, categoría, marca, color y
						rango de precio.
					</SheetDescription>
				</SheetHeader>
				<ProductFiltersPanel
					filters={filters}
					facets={facets}
					onChange={onChange}
					onClear={onClear}
					activeCount={activeCount}
				/>
			</SheetContent>
		</Sheet>
	);
}
