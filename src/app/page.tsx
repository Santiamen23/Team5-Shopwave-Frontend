import Link from "next/link";
import { Smartphone, Tablet, Laptop, Headphones, ArrowUpRight } from "lucide-react";

import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import Navbar from "@/components/layout/Navbar";
import { ProductsSection } from "@/components/products/products-section";
import { TrustStats } from "@/components/home/trust-stats";
import { HomeCTA } from "@/components/home/home-cta";
import { getProducts } from "@/services/product.service";
import type { CatalogProduct } from "@/components/products/product-filters";
import type { Product } from "@/models/product.model";

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

function toCatalog(products: Product[]): CatalogProduct[] {
	return products.map((product) => ({
		id: product.id,
		title: product.title,
		price: product.price,
		discountedPrice: product.discountedPrice,
		discountPersent: product.discountPersent,
		imageUrl: product.imageUrl,
		brand: product.brand,
		color: product.color,
		quantity: product.quantity,
		category: product.category,
		createdAt: product.createdAt,
	}));
}

function sortByCreatedDesc(products: CatalogProduct[]) {
	return [...products].sort((a, b) => {
		const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
		const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
		return bTime - aTime;
	});
}

export default async function HomePage() {
	const products = (await getProducts().catch(() => [])) as Product[];

	const catalogProducts = toCatalog(products);
	const newestProducts = sortByCreatedDesc(catalogProducts);
	const onSaleCount = catalogProducts.filter(
		(product) => product.discountedPrice < product.price,
	).length;
	const totalBrands = new Set(
		catalogProducts.map((product) => product.brand).filter(Boolean),
	).size;
	const totalCategories = new Set(
		catalogProducts
			.map((product) => product.category?.parentCategory?.parentCategory?.name)
			.filter(Boolean),
	).size;

	return (
		<main className="min-h-screen">
			<Navbar />
			<Hero />

			<TrustStats
				totalProducts={catalogProducts.length}
				totalBrands={totalBrands}
				totalCategories={Math.max(totalCategories, 1)}
				onSaleCount={onSaleCount}
			/>

			<section className="px-4 pt-0 pb-8 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
				<div className="mx-auto w-full max-w-7xl">
					<ProductsSection
						products={newestProducts}
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

			<HomeCTA />

			<Footer />
		</main>
	);
}
