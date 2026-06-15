import { Plus } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { requireAdminUser } from "@/lib/auth/session";
import { CreateProductFormContainer } from "@/components/admin/CreateProductFormContainer";
import { ProductsProvider } from "@/context/ProductContext";
import { Separator } from "@/components/ui/separator";

export default async function AdminCreateProductPage() {
	await requireAdminUser();

	return (
		<main className="min-h-screen">
			<Navbar />
			<section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
				<div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/95 shadow-[0_24px_60px_-36px_oklch(0.18_0.02_250_/_0.35)]">
					<div className="relative overflow-hidden bg-brand-700 px-7 py-6 text-white sm:px-9">
						<div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
						<div className="relative flex items-center gap-3">
							<span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
								<Plus className="h-5 w-5" />
							</span>
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-100/90">
									Nuevo producto
								</p>
								<h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
									Crear producto
								</h1>
							</div>
						</div>
					</div>
					<div className="px-7 py-6 sm:px-9">
						<Separator className="mb-5 bg-slate-100" />
						<ProductsProvider>
							<CreateProductFormContainer />
						</ProductsProvider>
					</div>
				</div>
			</section>
		</main>
	);
}
