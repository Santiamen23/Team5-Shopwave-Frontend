import Link from "next/link";
import { Smartphone, Tablet, Laptop, Headphones, ArrowUpRight } from "lucide-react";

import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import Navbar from "@/components/layout/Navbar";
import { ProductsSection } from "@/components/products/products-section";
import { getProducts } from "@/services/product.service";

interface CategoryTile {
	href: string;
	label: string;
	description: string;
	icon: React.ReactNode;
	gradient: string;
	ringColor: string;
}

const CATEGORIES: CategoryTile[] = [
	{
		href: "/products?category=celulares",
		label: "Celulares",
		description: "Modelos para trabajo, estudio y uso diario",
		icon: <Smartphone className="h-5 w-5" />,
		gradient: "from-brand-50 via-white to-info-50",
		ringColor: "group-hover:border-brand-300",
	},
	{
		href: "/products?category=tablets",
		label: "Tablets",
		description: "Pantalla, batería y portabilidad en equilibrio",
		icon: <Tablet className="h-5 w-5" />,
		gradient: "from-info-50 via-white to-brand-50",
		ringColor: "group-hover:border-info-300",
	},
	{
		href: "/products?category=laptops",
		label: "Laptops",
		description: "Equipos para rendimiento, clases o oficina",
		icon: <Laptop className="h-5 w-5" />,
		gradient: "from-brand-50 via-white to-brand-100/60",
		ringColor: "group-hover:border-brand-400",
	},
	{
		href: "/products?category=accesorios",
		label: "Accesorios",
		description: "Complementos para completar tu setup",
		icon: <Headphones className="h-5 w-5" />,
		gradient: "from-white via-info-50 to-brand-50",
		ringColor: "group-hover:border-info-300",
	},
];

export default async function HomePage() {
	const products = await getProducts().catch(() => []);

	return (
		<main className="min-h-screen">
			<Navbar />
			<Hero />

			<section className="px-4 pt-0 pb-8 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
				<div className="mx-auto w-full max-w-7xl">
					<ProductsSection
						products={products}
						title="Productos destacados"
						description="Una selección rápida para empezar a comprar sin recorrer todo el catálogo."
						limit={12}
						ctaHref="/products"
						ctaLabel="Ver catálogo completo"
						emptyMessage="Todavía no hay destacados cargados. Revisa el catálogo completo en unos momentos."
					/>
				</div>
			</section>

			<section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
				<div className="mx-auto w-full max-w-7xl">
					<div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
								Explora
							</p>
							<h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
								Categorías
							</h2>
						</div>
						<Link
							href="/products"
							className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-600"
						>
							Ver todo
							<ArrowUpRight className="h-4 w-4" />
						</Link>
					</div>
					<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
						{CATEGORIES.map((category) => (
							<Link
								key={category.href}
								href={category.href}
								className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-32px_oklch(0.43_0.18_245_/_0.35)] ${category.ringColor}`}
							>
								<div
									className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${category.gradient} text-brand-700 ring-1 ring-inset ring-white`}
								>
									{category.icon}
								</div>
								<div className="min-w-0 flex-1">
									<div className="text-base font-semibold text-slate-950">
										{category.label}
									</div>
									<div className="text-xs text-slate-500">
										{category.description}
									</div>
								</div>
								<ArrowUpRight className="h-4 w-4 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
							</Link>
						))}
					</div>
				</div>
			</section>

			<section className="px-4 py-10 sm:px-6 lg:px-8">
				<div className="mx-auto w-full max-w-7xl">
					<div className="rounded-[2rem] border border-dashed border-slate-300 bg-gradient-to-br from-white via-brand-50/40 to-info-50/40 p-8 text-center text-sm text-slate-600 sm:p-12">
						<p className="text-base font-semibold text-slate-800">
							Lo más buscado
						</p>
						<p className="mt-2 text-sm text-slate-500">
							Aún no hay productos destacados en esta sección. Mientras tanto,
							puedes explorar todo el catálogo.
						</p>
					</div>
				</div>
			</section>

			<Footer />
		</main>
	);
}
