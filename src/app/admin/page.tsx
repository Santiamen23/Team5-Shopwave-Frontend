import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { ProductList } from "@/components/admin/ProductList";
import { requireAdminUser } from "@/lib/auth/session";
import { getProducts } from "@/services/product.service";
import { Separator } from "@/components/ui/separator";
import { ProductsProvider } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  await requireAdminUser();
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
            <h1 className="text-3xl font-semibold text-slate-950">
              Panel administrativo
            </h1>
            <Link href="/admin/orders" passHref>
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 rounded-xl px-4 h-9 shadow-sm transition-colors cursor-pointer">
                Control de Órdenes
              </Button>
            </Link>
          </div>

          <Separator />

          <ProductsProvider initialProducts={products}>
            <ProductList />
          </ProductsProvider>
        </div>
      </section>
    </main>
  );
}