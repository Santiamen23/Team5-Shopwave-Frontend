import Navbar from "@/components/layout/Navbar";
import { ProductCard } from "@/components/products/product-card";
import { Card, CardContent } from "@/components/ui/card";
import { getProducts } from "@/services/product.service";

export default async function ProductsPage() {
  const products = await getProducts().catch(() => []);

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="mb-8 rounded-[2rem] bg-gradient-to-r from-slate-950 to-slate-800 px-5 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
          <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">Catálogo de productos</h1>
        </section>

        {products.length > 0 ? (
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ) : (
          <Card className="border-slate-200/70 bg-white/95">
            <CardContent className="p-6 text-sm leading-7 text-slate-600">
              No se pudieron cargar productos desde el backend por ahora.
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
