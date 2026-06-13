import { Package } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import OrderHistoryView from "@/components/orders/OrderHistoryView";
import {
	getSessionToken,
	getUserProfileFromToken,
	requireAuthenticatedUser,
} from "@/lib/auth/session";
import { getUserOrders } from "@/services/order.service";
import type { Order } from "@/models/order.model";

export default async function OrdersPage() {
	const user = await requireAuthenticatedUser();
	const jwt = (await getSessionToken()) ?? "";

	let orders: Order[] = [];

	try {
		if (jwt) {
			orders = await getUserOrders(jwt);
		}
	} catch (error) {
		console.error("Error cargando las órdenes de usuario:", error);
	}

	// Refrescamos el perfil para asegurar datos al día (best-effort)
	let displayUser = {
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
	};
	try {
		if (jwt) {
			const fresh = await getUserProfileFromToken(jwt);
			if (fresh) {
				displayUser = {
					firstName: fresh.firstName,
					lastName: fresh.lastName,
					email: fresh.email,
				};
			}
		}
	} catch {
		// Si falla el refresh, seguimos con el user del guard
	}

	return (
		<main className="min-h-screen">
			<Navbar />
			<section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
				<div className="mb-6">
					<p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
						<Package className="h-3.5 w-3.5" />
						Historial
					</p>
					<h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
						Mis pedidos
					</h1>
					<p className="mt-2 text-sm text-slate-600">
						Revisa el historial y estado de tus compras post-transacción
					</p>
				</div>
				<OrderHistoryView orders={orders} user={displayUser} />
			</section>
		</main>
	);
}
