import Link from "next/link";
import { ArrowRight, LayoutDashboard, ShoppingBag } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { ProductList } from "@/components/admin/ProductList";
import { requireAdminUser } from "@/lib/auth/session";
import { getProducts } from "@/services/product.service";
import { Separator } from "@/components/ui/separator";
import { ProductsProvider } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
	await requireAdminUser();
	const products = await getProducts();

	return (
		<main className="min-h-screen">
			<Navbar />
			<section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
				<div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/95 shadow-[0_24px_60px_-36px_oklch(0.18_0.02_250_/_0.35)]">
					<div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-info-700 px-7 py-6 text-white sm:px-9">
						<div className="bg-grid-faint absolute inset-0 opacity-25" />
						<div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
						<div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-100/90">
									Administración
								</p>
								<h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
									Panel administrativo
								</h1>
							</div>
							<Button
								asChild
								size="lg"
								className="bg-white text-brand-700 shadow-[0_8px_24px_-8px_oklch(0.18_0.02_250_/_0.55)] hover:bg-brand-50 hover:text-brand-700"
							>
								<Link href="/admin/orders">
									<LayoutDashboard className="h-4 w-4" />
									Control de Órdenes
									<ArrowRight className="h-4 w-4" />
								</Link>
							</Button>
						</div>
					</div>

					<div className="px-7 py-6 sm:px-9">
						<div className="mb-4 flex items-center gap-2">
							<ShoppingBag className="h-4 w-4 text-brand-600" />
							<h2 className="text-lg font-semibold tracking-tight text-slate-900">
								Inventario
							</h2>
						</div>
						<Separator className="mb-5 bg-slate-100" />
						<ProductsProvider initialProducts={products}>
							<ProductList />
						</ProductsProvider>
					</div>
				</div>
			</section>
		</main>
	);
}
