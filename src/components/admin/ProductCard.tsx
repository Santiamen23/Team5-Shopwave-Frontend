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
			<CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
				<div className="relative h-28 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 to-white sm:h-24 sm:w-24 sm:shrink-0">
					<Image
						src={product.imageUrl}
						alt={product.title}
						fill
						unoptimized
						sizes="(max-width: 760px) 100vw, 96px"
						className="object-cover"
					/>
					{onSale ? (
						<Badge
							variant="success"
							className="absolute top-2 left-2 shadow-md"
						>
							-{product.discountPersent}%
						</Badge>
					) : null}
				</div>

				<div className="min-w-0 flex-1 space-y-2.5">
					<div className="space-y-1">
						<div className="flex flex-wrap items-center gap-2">
							<Badge variant="brand">{product.brand || "Sin marca"}</Badge>
							{product.color ? (
								<span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
									{product.color}
								</span>
							) : null}
						</div>
						<h3 className="line-clamp-1 text-base font-semibold text-slate-900">
							{product.title}
						</h3>
						<p className="line-clamp-2 text-xs text-slate-500">
							{product.description || "Sin descripción disponible."}
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<div className="flex items-baseline gap-2">
							<span className="text-base font-semibold tracking-tight text-slate-950">
								{formatCurrency(product.discountedPrice)}
							</span>
							{onSale ? (
								<span className="text-xs text-slate-400 line-through">
									{formatCurrency(product.price)}
								</span>
							) : null}
						</div>
						<Badge variant={stockState.tone} className="gap-1">
							<stockState.icon className="h-3 w-3" />
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
