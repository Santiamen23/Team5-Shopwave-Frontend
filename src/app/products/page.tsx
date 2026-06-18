import Navbar from "@/components/layout/Navbar";
import { ProductsSection } from "@/components/products/products-section";
import { getProducts } from "@/services/product.service";
import type { ProductFilters } from "@/components/products/product-filters";

interface ProductsPageProps {
	searchParams: Promise<{ category?: string; q?: string }>;
}

function buildInitialFilters(params: {
	category?: string;
	q?: string;
}): Partial<ProductFilters> {
	const initial: Partial<ProductFilters> = {};
	if (params.category) {
		initial.categories = [params.category];
	}
	if (params.q) {
		initial.query = params.q;
	}
	return initial;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
	const params = await searchParams;
	let products = [];
	try {
		products = await getProducts();
	} catch (error) {
		console.error("[ProductsPage] Error cargando productos:", error);
	}
	const initialFilters = buildInitialFilters(params);

	return (
		<main className="min-h-screen">
			<Navbar />
			<div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
				<div className="mx-auto">
					<ProductsSection
						products={products}
						eyebrow="Tienda"
						title="Catálogo de productos"
						description="Filtra por stock, categoría, marca, color o rango de precio, y ordena como prefieras."
						enableSearch
						enableFilters
						initialFilters={initialFilters}
					/>
				</div>
			</div>
		</main>
	);
}
