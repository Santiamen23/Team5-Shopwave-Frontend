import Image from "next/image";
import Link from "next/link";

import type { ProductCardData } from "@/models/product.model";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { formatCurrency } from "@/utils/currency.util";

interface ProductCardProps {
	product: ProductCardData;
}

export function ProductCard({ product }: ProductCardProps) {
	const onSale = product.discountedPrice < product.price;

	return (
		<Card className="group overflow-hidden border-slate-200/80 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_28px_60px_-32px_oklch(0.43_0.18_245_/_0.45)]">
			<div className="relative aspect-[4/5] bg-slate-50 p-4 sm:aspect-square sm:p-5 lg:p-6">
				{onSale ? (
					<Badge
						variant="success"
						className="absolute top-3 left-3 z-10 shadow-sm"
					>
						Oferta
					</Badge>
				) : null}
				<div className="relative h-full w-full overflow-hidden rounded-2xl bg-white/80">
					<Image
						src={product.imageUrl}
						alt={product.title}
						fill
						unoptimized
						sizes="(max-width: 1280px) 50vw, 33vw"
						className="object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				</div>
			</div>
			<CardContent className="space-y-4 p-4 sm:p-5">
				<div className="flex items-start justify-between gap-3">
					<Badge variant="brand">{product.brand}</Badge>
					<span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
						{product.color}
					</span>
				</div>
				<div className="space-y-2">
					<h3 className="line-clamp-2 text-sm font-semibold text-slate-950 sm:text-base">
						{product.title}
					</h3>
					<div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
						<span className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
							{formatCurrency(product.discountedPrice)}
						</span>
						{onSale ? (
							<span className="text-xs text-slate-400 line-through sm:text-sm">
								{formatCurrency(product.price)}
							</span>
						) : null}
					</div>
				</div>
				<Button asChild className="w-full">
					<Link href={`/products/${product.id}`}>Ver detalle</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
