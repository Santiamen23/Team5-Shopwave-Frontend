import Link from "next/link";

import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import Navbar from "@/components/layout/Navbar";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from "@/services/product.service";

export default async function HomePage() {
  const products = await getProducts().catch(() => []);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <div className="mx-auto w-full max-w-7xl">
          <Card className="overflow-hidden border-slate-200/70 bg-white/95">
            <CardHeader className="space-y-3 border-b border-slate-200/60 bg-gradient-to-r from-slate-950 to-slate-800 px-5 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl">Productos destacados</CardTitle>
              <CardDescription className="max-w-2xl text-sm text-slate-200 sm:text-base">
                Una selección inicial usando la misma tarjeta y jerarquía visual que el catálogo.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-4 sm:p-6 lg:p-8">
              {products.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {products.slice(0, 3).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">
                  No se pudieron cargar productos desde el backend en este momento.
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-7 text-slate-600">
                  El listado de inicio y el catálogo ya comparten la misma base visual.
                </p>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/products">Ver catálogo completo</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}