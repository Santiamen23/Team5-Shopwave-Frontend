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
			<section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				<div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/95 shadow-[0_24px_60px_-36px_oklch(0.18_0.02_250_/_0.35)]">
					<div className="relative overflow-hidden bg-brand-700 px-7 py-6 text-white sm:px-9">
						<div className="bg-grid-faint absolute inset-0 opacity-25" />
						<div className="absolute -top-16 -right-12 h-44 w-44 rounded-full bg-white/15 blur-3xl" />
						<div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-info-500/30 blur-3xl" />
						<div className="relative flex items-center gap-3">
							<div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-white">
								<Package className="h-5 w-5" />
							</div>
							<div>
								<p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-100/90">
									Historial
								</p>
								<h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
									Mis pedidos
								</h1>
							</div>
						</div>
						<p className="relative mt-2 max-w-xl text-sm text-brand-100/90 sm:text-base">
							Revisa el historial y estado de tus compras post-transacción.
						</p>
					</div>
					<div className="px-5 py-6 sm:px-9 sm:py-8">
						<OrderHistoryView orders={orders} user={displayUser} />
					</div>
				</div>
			</section>
		</main>
	);
}
