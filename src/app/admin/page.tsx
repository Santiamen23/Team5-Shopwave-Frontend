import Navbar from "@/components/layout/Navbar";
import { ProductDashboard } from "@/components/dashboard/ProductDashboard";
import { requireAdminUser } from "@/lib/auth/session";
import { getProducts } from "@/services/product.service";
import { Separator } from "@/components/ui/separator";
import {
  serverCreateProduct,
  serverUpdateProduct,
  serverDeleteProduct,
} from "./actions";

export default async function AdminPage() {
  const user = await requireAdminUser();
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-950">
            Panel administrativo
          </h1>

          <Separator />
          
          <ProductDashboard
            products={products}
            onCreateProduct={serverCreateProduct}
            onEditProduct={serverUpdateProduct}
            onDeleteProduct={serverDeleteProduct}
          />
        </div>
      </section>
    </main>
  );
}
