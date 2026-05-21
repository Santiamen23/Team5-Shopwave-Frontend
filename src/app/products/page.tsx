import { ProductCard } from "@/components/products/product-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from "@/services/product.service";

export default async function ProductsPage() {
  const products = await getProducts().catch(() => []);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Card className="mb-8 overflow-hidden border-slate-200/70 bg-white/95">
        <CardHeader className="space-y-3 border-b border-slate-200/60 bg-gradient-to-r from-slate-950 to-slate-800 px-5 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl">Catálogo de productos</CardTitle>
          <CardDescription className="max-w-2xl text-sm text-slate-200 sm:text-base">
            La ruta dinámica de detalle ya quedó conectada al backend. Desde aquí puedes navegar
            a cada producto cuando el listado se cargue con datos reales.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-5 text-sm leading-7 text-slate-600 sm:p-6 lg:p-8">
          <p>
            Esta pantalla sirve como entrada al catálogo y deja la navegación profunda lista para
            la siguiente iteración.
          </p>
        </CardContent>
      </Card>

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
    </main>
  );
}
