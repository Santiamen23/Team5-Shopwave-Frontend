import Navbar from "@/components/layout/Navbar";
import { requireAuthenticatedUser } from "@/lib/auth/session";

export default async function CartPage() {
  const user = await requireAuthenticatedUser();

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-950">Carrito</h1>
        </div>
      </section>
    </main>
  );
}
