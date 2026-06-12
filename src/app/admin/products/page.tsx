import Navbar from "@/components/layout/Navbar";
import { ProductList } from "@/components/admin/ProductList";
import { ProductsProvider } from "@/context/ProductContext";
import { requireAdminUser } from "@/lib/auth/session";
import { getProducts } from "@/services/product.service";

export default async function AdminProductsPage() {
  await requireAdminUser();
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-950">Productos administrativos</h1>
          <ProductsProvider initialProducts={products}>
            <ProductList/>
          </ProductsProvider>
        </div>
      </section>
    </main>
  );
}
