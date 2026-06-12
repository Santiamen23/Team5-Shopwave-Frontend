import { cookies } from "next/headers";
import Navbar from "@/components/layout/Navbar";
import OrderHistoryView from "@/components/orders/OrderHistoryView";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { getUserOrders } from "@/services/order.service";
import type { Order } from "@/models/order.model";

export default async function OrdersPage() {
  await requireAuthenticatedUser();

  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value || ""; 

  let orders: Order[] = []; 
  
  try {
    if (jwt) {
      orders = await getUserOrders(jwt);
    }
  } catch (error) {
    console.error("Error cargando las órdenes de usuario:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50/50">
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Mis pedidos</h1>
          <p className="text-sm text-slate-500 mt-1">
            Revisa el historial y estado de tus compras post-transacción
          </p>
        </div>
        <OrderHistoryView orders={orders} />
      </section>
    </main>
  );
}