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
			<div className="relative aspect-square bg-slate-50 p-1.5 sm:p-2">
				{onSale ? (
					<Badge
						variant="success"
						className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0 text-[0.55rem] shadow-sm"
					>
						Oferta
					</Badge>
				) : null}
				<div className="relative h-full w-full overflow-hidden rounded-lg bg-white/80">
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
			<CardContent className="space-y-1.5 p-2 sm:p-2.5">
				<div className="flex items-start justify-between gap-1.5">
					<Badge variant="brand" className="px-1.5 py-0 text-[0.6rem]">
						{product.brand}
					</Badge>
					<span className="text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
						{product.color}
					</span>
				</div>
				<div className="space-y-1">
					<h3 className="line-clamp-2 text-[0.7rem] font-semibold leading-tight text-slate-950 sm:text-xs">
						{product.title}
					</h3>
					<div className="flex flex-wrap items-baseline gap-1">
						<span className="text-sm font-semibold tracking-tight text-slate-950 sm:text-base">
							{formatCurrency(product.discountedPrice)}
						</span>
						{onSale ? (
							<span className="text-[0.6rem] text-slate-400 line-through sm:text-[0.65rem]">
								{formatCurrency(product.price)}
							</span>
						) : null}
					</div>
				</div>
				<Button asChild size="sm" className="h-7 w-full text-[0.7rem] sm:h-8 sm:text-xs">
					<Link href={`/products/${product.id}`}>Ver detalle</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
