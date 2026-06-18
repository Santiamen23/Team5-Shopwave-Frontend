import { ClipboardList } from "lucide-react";

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
			<section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				<div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/95 shadow-[0_24px_60px_-36px_oklch(0.18_0.02_250_/_0.35)]">
					<div className="relative overflow-hidden bg-brand-700 px-7 py-6 text-white sm:px-9">
						<div className="bg-grid-faint absolute inset-0 opacity-25" />
						<div className="absolute -top-16 -right-12 h-44 w-44 rounded-full bg-white/15 blur-3xl" />
						<div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-info-500/30 blur-3xl" />
						<div className="relative flex items-center gap-3">
							<div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-white">
								<ClipboardList className="h-5 w-5" />
							</div>
							<div>
								<p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-100/90">
									Operaciones
								</p>
								<h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
									Control de Órdenes Globales
								</h1>
							</div>
						</div>
						<p className="relative mt-2 max-w-xl text-sm text-brand-100/90 sm:text-base">
							Monitorea los pedidos de la tienda, gestiona flujos de entrega y
							modifica estados en tiempo real.
						</p>
					</div>
					<div className="px-5 py-6 sm:px-9 sm:py-8">
						{loadError ? (
							<div className="mb-4 rounded-2xl border border-danger-500/30 bg-danger-50 p-4 text-sm text-danger-700">
								<p className="font-semibold">No se pudieron cargar las órdenes.</p>
								<p className="mt-1 text-xs">{loadError}</p>
							</div>
						) : null}

						<AdminOrdersView initialOrders={orders} jwt={jwt} />
					</div>
				</div>
			</section>
		</main>
	);
}
