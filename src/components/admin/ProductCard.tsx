"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EditPopup } from "./EditPopup";
import { DeleteAlert } from "./DeleteAlert";
import type { Product } from "@/models/product.model";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/utils/currency.util";

interface ProductCardProps {
	product: Product;
	onEdit?: (product: Product) => Promise<Product> | Product | void;
	onDelete?: (productId: number) => Promise<unknown> | unknown;
}

function getStockState(quantity: number) {
	if (quantity <= 0) {
		return { label: "Sin stock", tone: "danger" as const, icon: AlertTriangle };
	}
	if (quantity <= 5) {
		return { label: "Stock bajo", tone: "warning" as const, icon: AlertTriangle };
	}
	return { label: "En stock", tone: "success" as const, icon: CheckCircle2 };
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
	const onSale = product.discountPersent > 0;
	const stockState = getStockState(product.quantity);

	return (
		<Card className="overflow-hidden border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-[0_18px_40px_-24px_oklch(0.43_0.18_245_/_0.35)]">
			<CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
				<div className="relative h-24 w-full overflow-hidden rounded-xl bg-slate-50 sm:h-20 sm:w-20 sm:shrink-0">
					<Image
						src={product.imageUrl}
						alt={product.title}
						fill
						unoptimized
						sizes="(max-width: 760px) 100vw, 80px"
						className="object-cover"
					/>
					{onSale ? (
						<Badge
							variant="success"
							className="absolute top-1.5 left-1.5 text-[0.65rem] shadow-md"
						>
							-{product.discountPersent}%
						</Badge>
					) : null}
				</div>

				<div className="min-w-0 flex-1 space-y-1.5">
					<div className="space-y-1">
						<div className="flex flex-wrap items-center gap-1.5">
							<Badge variant="brand" className="text-[0.65rem]">
								{product.brand || "Sin marca"}
							</Badge>
							{product.color ? (
								<span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
									{product.color}
								</span>
							) : null}
						</div>
						<h3 className="line-clamp-1 text-sm font-semibold text-slate-900 sm:text-base">
							{product.title}
						</h3>
						<p className="line-clamp-2 text-[0.7rem] leading-4 text-slate-500 sm:text-xs">
							{product.description || "Sin descripción disponible."}
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-2 pt-0.5">
						<div className="flex items-baseline gap-1.5">
							<span className="text-sm font-semibold tracking-tight text-slate-950 sm:text-base">
								{formatCurrency(product.discountedPrice)}
							</span>
							{onSale ? (
								<span className="text-[0.7rem] text-slate-400 line-through">
									{formatCurrency(product.price)}
								</span>
							) : null}
						</div>
						<Badge variant={stockState.tone} className="gap-1 text-[0.6rem]">
							<stockState.icon className="h-2.5 w-2.5" />
							{stockState.label} · {product.quantity}
						</Badge>
					</div>
				</div>

				<div className="flex gap-2 self-end sm:self-center">
					<EditPopup product={product} onEdit={onEdit} />
					<DeleteAlert
						productTitle={product.title}
						onDelete={() => onDelete?.(product.id)}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
