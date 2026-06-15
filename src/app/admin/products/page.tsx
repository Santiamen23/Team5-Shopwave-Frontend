import { ShoppingBag } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { ProductList } from "@/components/admin/ProductList";
import { ProductsProvider } from "@/context/ProductContext";
import { requireAdminUser } from "@/lib/auth/session";
import { getProducts } from "@/services/product.service";
import { Separator } from "@/components/ui/separator";

export default async function AdminProductsPage() {
	await requireAdminUser();
	const products = await getProducts();

	return (
		<main className="min-h-screen">
			<Navbar />
			<section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
				<div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/95 shadow-[0_24px_60px_-36px_oklch(0.18_0.02_250_/_0.35)]">
					<div className="relative overflow-hidden bg-brand-700 px-7 py-6 text-white sm:px-9">
						<div className="relative">
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-100/90">
								Administración
							</p>
							<h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
								Productos administrativos
							</h1>
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
