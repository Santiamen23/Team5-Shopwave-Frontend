import Navbar from "@/components/layout/Navbar";
import { getSessionToken, requireAdminUser } from "@/lib/auth/session";
import { getAdminOrders } from "@/services/admin-order.service";
import AdminOrdersView from "@/components/admin/AdminOrdersView";
import type { Order } from "@/models/order.model";

export default async function AdminOrdersPage() {
	await requireAdminUser();

	const jwt = (await getSessionToken()) ?? "";

	let orders: Order[] = [];
	let loadError: string | null = null;

	try {
		if (jwt) {
			orders = await getAdminOrders(jwt);
		} else {
			loadError = "No hay sesión activa.";
		}
	} catch (error) {
		loadError =
			error instanceof Error ? error.message : "No se pudieron cargar las órdenes.";
		console.error("Error cargando el panel de órdenes globales:", error);
	}

	return (
		<main className="min-h-screen">
			<Navbar />
			<section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
				<div className="mb-6">
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
						Operaciones
					</p>
					<h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
						Control de Órdenes Globales
					</h1>
					<p className="mt-2 text-sm text-slate-600">
						Monitorea los pedidos de la tienda, gestiona flujos de entrega y
						modifica estados en tiempo real.
					</p>
				</div>

				{loadError ? (
					<div className="mb-4 rounded-2xl border border-danger-500/30 bg-danger-50 p-4 text-sm text-danger-700">
						<p className="font-semibold">No se pudieron cargar las órdenes.</p>
						<p className="mt-1 text-xs">{loadError}</p>
					</div>
				) : null}

				<AdminOrdersView initialOrders={orders} jwt={jwt} />
			</section>
		</main>
	);
}
