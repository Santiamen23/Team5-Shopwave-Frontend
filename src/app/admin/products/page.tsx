import { ShoppingBag } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { ProductList } from "@/components/admin/ProductList";
import { ProductsProvider } from "@/context/ProductContext";
import { requireAdminUser } from "@/lib/auth/session";
import { getProducts } from "@/services/product.service";

export default async function AdminProductsPage() {
	await requireAdminUser();
	const products = await getProducts();

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
								<ShoppingBag className="h-5 w-5" />
							</div>
							<div>
								<p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-100/90">
									Administración
								</p>
								<h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
									Productos
								</h1>
							</div>
						</div>
						<p className="relative mt-2 max-w-xl text-sm text-brand-100/90 sm:text-base">
							Gestiona el catálogo: crea, edita y elimina productos del
							inventario de la tienda.
						</p>
					</div>
					<div className="px-5 py-6 sm:px-9 sm:py-8">
						<ProductsProvider initialProducts={products}>
							<ProductList />
						</ProductsProvider>
					</div>
				</div>
			</section>
		</main>
	);
}
