import Link from "next/link";
import { ArrowRight, ClipboardList, Package, ShoppingBag } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { requireAdminUser, getSessionToken } from "@/lib/auth/session";
import { getProducts } from "@/services/product.service";
import { getAdminOrders } from "@/services/admin-order.service";

export default async function AdminPage() {
	await requireAdminUser();

	const jwt = (await getSessionToken()) ?? "";

	let ordersCount = 0;
	try {
		if (jwt) {
			const orders = await getAdminOrders(jwt);
			ordersCount = Array.isArray(orders) ? orders.length : 0;
		}
	} catch {
		ordersCount = 0;
	}

	const products = await getProducts();
	const productsCount = Array.isArray(products) ? products.length : 0;

	return (
		<main className="min-h-screen">
			<Navbar />
			<section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				<div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/95 shadow-[0_24px_60px_-36px_oklch(0.18_0.02_250_/_0.35)]">
					<div className="relative overflow-hidden bg-brand-700 px-7 py-6 text-white sm:px-9">
						<div className="bg-grid-faint absolute inset-0 opacity-25" />
						<div className="absolute -top-16 -right-12 h-44 w-44 rounded-full bg-white/15 blur-3xl" />
						<div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-info-500/30 blur-3xl" />
						<div className="relative flex items-center gap-3">
							<div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-white">
								<Package className="h-5 w-5" />
							</div>
							<div>
								<p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-100/90">
									Administración
								</p>
								<h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
									Panel administrativo
								</h1>
							</div>
						</div>
						<p className="relative mt-2 max-w-xl text-sm text-brand-100/90 sm:text-base">
							Selecciona un módulo para gestionar el inventario o supervisar
							los pedidos de la tienda.
						</p>
					</div>

					<div className="px-5 py-6 sm:px-9 sm:py-8">
						<div className="grid gap-5 sm:grid-cols-2">
							<ModuleCard
								href="/admin/products"
								icon={<ShoppingBag className="h-6 w-6" />}
								eyebrow="Catálogo"
								title="Productos"
								description="Crea, edita y elimina productos del inventario de la tienda."
								stat={{
									label: "Productos registrados",
									value: productsCount,
								}}
								tone="brand"
							/>
							<ModuleCard
								href="/admin/orders"
								icon={<ClipboardList className="h-6 w-6" />}
								eyebrow="Operaciones"
								title="Órdenes"
								description="Monitorea los pedidos, gestiona entregas y modifica estados."
								stat={{
									label: "Órdenes totales",
									value: ordersCount,
								}}
								tone="info"
							/>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

function ModuleCard({
	href,
	icon,
	eyebrow,
	title,
	description,
	stat,
	tone,
}: {
	href: string;
	icon: React.ReactNode;
	eyebrow: string;
	title: string;
	description: string;
	stat: { label: string; value: number };
	tone: "brand" | "info";
}) {
	const iconWrap =
		tone === "brand"
			? "bg-brand-50 text-brand-700 ring-brand-100"
			: "bg-info-50 text-info-700 ring-info-500/20";
	const statTone =
		tone === "brand"
			? "text-brand-700"
			: "text-info-700";

	return (
		<Link
			href={href}
			className="group flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_18px_40px_-24px_oklch(0.43_0.18_245_/_0.35)] sm:p-6"
		>
			<div className="flex items-start justify-between gap-4">
				<span
					className={`grid h-12 w-12 place-items-center rounded-xl bg-white ring-1 ${iconWrap}`}
				>
					{icon}
				</span>
				<ArrowRight className="h-5 w-5 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-600" />
			</div>

			<div className="space-y-1.5">
				<p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
					{eyebrow}
				</p>
				<h2 className="text-xl font-semibold tracking-tight text-slate-900">
					{title}
				</h2>
				<p className="text-sm leading-5 text-slate-500">{description}</p>
			</div>

			<div className="mt-auto flex items-baseline gap-2 border-t border-slate-100 pt-4">
				<span className={`text-2xl font-semibold tracking-tight ${statTone}`}>
					{stat.value}
				</span>
				<span className="text-xs text-slate-500">{stat.label}</span>
			</div>
		</Link>
	);
}
