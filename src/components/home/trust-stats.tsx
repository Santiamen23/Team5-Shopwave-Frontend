import {
	Banknote,
	Package,
	Sparkles,
	Truck,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TrustStatsProps {
	totalProducts: number;
	totalBrands: number;
	totalCategories: number;
	onSaleCount: number;
}

export function TrustStats({
	totalProducts,
	totalBrands,
	totalCategories,
	onSaleCount,
}: TrustStatsProps) {
	const stats: Array<{
		icon: React.ReactNode;
		value: string;
		label: string;
		emphasis?: string;
	}> = [
		{
			icon: <Package className="h-4 w-4" />,
			value: `${totalProducts}+`,
			label: "Productos",
			emphasis: "Catálogo en constante crecimiento",
		},
		{
			icon: <Sparkles className="h-4 w-4" />,
			value: `${totalBrands}`,
			label: "Marcas",
			emphasis: "Solo tecnología seleccionada",
		},
		{
			icon: <Banknote className="h-4 w-4" />,
			value: `${onSaleCount}`,
			label: "En oferta",
			emphasis: "Descuentos activos hoy",
		},
		{
			icon: <Truck className="h-4 w-4" />,
			value: `${totalCategories}`,
			label: "Categorías",
			emphasis: "De celulares a accesorios",
		},
	];

	return (
		<section className="px-4 pt-2 pb-6 sm:px-6 sm:pt-4 sm:pb-8 lg:px-8 lg:pt-6 lg:pb-10">
			<div className="mx-auto w-full max-w-7xl">
				<Card className="grid grid-cols-2 gap-2 border-slate-200/80 bg-white p-3 sm:grid-cols-4 sm:gap-0 sm:p-0">
					{stats.map((stat, index) => (
						<div
							key={stat.label}
							className={cn(
								"flex items-center gap-3 rounded-2xl px-4 py-3 sm:py-4",
								index !== 0 && "sm:border-l sm:border-slate-200/80",
							)}
						>
							<span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
								{stat.icon}
							</span>
							<div className="min-w-0">
								<p className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
									{stat.value}
								</p>
								<p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-700">
									{stat.label}
								</p>
								<p className="hidden text-xs text-slate-500 sm:block">
									{stat.emphasis}
								</p>
							</div>
						</div>
					))}
				</Card>
			</div>
		</section>
	);
}
