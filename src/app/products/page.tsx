import Navbar from "@/components/layout/Navbar";
import { ProductsSection } from "@/components/products/products-section";
import { getProducts } from "@/services/product.service";

export default async function ProductsPage() {
  const products = await getProducts().catch(() => []);

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto">
          <ProductsSection products={products} title="Catálogo de productos" />
        </div>
      </div>
    </main>
  );
}
