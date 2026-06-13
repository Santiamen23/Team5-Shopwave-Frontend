import Navbar from "@/components/layout/Navbar";
import { getSessionToken, requireAdminUser } from "@/lib/auth/session";
import { getAdminOrders } from "@/services/admin-order.service";
import AdminOrdersView from "@/components/admin/AdminOrdersView";
import type { Order } from "@/models/order.model";

export default async function AdminOrdersPage() {
  await requireAdminUser();

  const jwt = (await getSessionToken()) ?? "";

  let orders: Order[] = []; 
  
  try {
    if (jwt) {
      orders = await getAdminOrders(jwt);
    }
  } catch (error) {
    console.error("Error cargando el panel de órdenes globales:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50/50">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Control de Órdenes Globales
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitorea los pedidos de la tienda, gestiona flujos de entrega y modifica estados en tiempo real.
          </p>
        </div>
      
        <AdminOrdersView initialOrders={orders} jwt={jwt} />
      </section>
    </main>
  );
}