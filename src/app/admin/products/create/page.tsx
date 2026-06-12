import Navbar from "@/components/layout/Navbar";
import { requireAdminUser } from "@/lib/auth/session";
import { CreateProductFormContainer } from "@/components/admin/CreateProductFormContainer";
import { ProductsProvider } from "@/context/ProductContext";

export default async function AdminCreateProductPage() {
  await requireAdminUser();

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-950">Crear producto</h1>
          <ProductsProvider>
            <CreateProductFormContainer />
          </ProductsProvider>
        </div>
      </section>
    </main>
  );
}
