import type { UserProfile } from "@/models/user.model";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, CreditCard } from "lucide-react";

export default function ProfileView({ user }: { user: UserProfile }) {
	const initials = `${user.firstName[0] || ""}${user.lastName[0] || ""}`.toUpperCase();
	const roleName =
		user.role === "ROLE_ADMIN"
			? "Administrador"
			: user.role === "ROLE_USER"
				? "Cliente"
				: user.role;
	const badgeVariant =
		user.role === "ROLE_ADMIN" ? "default" : "brand";

	return (
		<section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-4">
					<div className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 text-xl font-bold text-white shadow-[0_12px_30px_-12px_oklch(0.43_0.18_245_/_0.6)]">
						<span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(1_0_0_/_0.45),transparent_60%)]" />
						<span className="relative">{initials}</span>
					</div>
					<div>
						<h1 className="text-3xl font-semibold tracking-tight text-slate-950">
							Mi Perfil
						</h1>
						<p className="text-sm text-slate-500">
							Gestiona tu información personal y preferencias
						</p>
					</div>
				</div>
				<Badge variant={badgeVariant} className="px-3 py-1 text-sm font-semibold shadow-sm">
					{roleName}
				</Badge>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				<Card className="border-slate-200/80 shadow-[0_18px_50px_-36px_oklch(0.18_0.02_250_/_0.35)] md:col-span-1">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg text-slate-900">
							<User className="h-4 w-4 text-brand-600" />
							Datos Personales
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-700">
								Nombre Completo
							</span>
							<p className="mt-0.5 text-sm font-semibold text-slate-800">
								{user.firstName} {user.lastName}
							</p>
						</div>
						<Separator className="bg-slate-100" />
						<div>
							<span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-700">
								Correo Electrónico
							</span>
							<p className="mt-0.5 text-sm font-medium break-all text-slate-800">
								{user.email}
							</p>
						</div>
						<Separator className="bg-slate-100" />
						<div>
							<span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-700">
								Teléfono
							</span>
							<p className="mt-0.5 text-sm font-medium text-slate-800">
								{user.mobile || "No registrado"}
							</p>
						</div>
					</CardContent>
				</Card>

				<div className="space-y-6 md:col-span-2">
					<Card className="border-slate-200/80 shadow-[0_18px_50px_-36px_oklch(0.18_0.02_250_/_0.35)]">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg text-slate-900">
								<MapPin className="h-4 w-4 text-brand-600" />
								Direcciones de Envío
							</CardTitle>
						</CardHeader>
						<CardContent>
							{!user.addresses || user.addresses.length === 0 ? (
								<p className="py-2 text-sm italic text-slate-500">
									No tienes direcciones registradas todavía.
								</p>
							) : (
								<div className="grid gap-4 sm:grid-cols-2">
									{user.addresses.map((addr) => (
										<div
											key={addr.id}
											className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-brand-50/40 p-4 text-sm shadow-sm transition-shadow hover:shadow-md"
										>
											<p className="font-semibold text-slate-800">
												{addr.firstName} {addr.lastName}
											</p>
											<p className="mt-1 text-slate-600">
												{addr.streetAddress}
											</p>
											<p className="text-slate-600">
												{addr.city}, {addr.state} {addr.zipCode}
											</p>
											<p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
												{addr.mobile}
											</p>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					<Card className="border-slate-200/80 shadow-[0_18px_50px_-36px_oklch(0.18_0.02_250_/_0.35)]">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg text-slate-900">
								<CreditCard className="h-4 w-4 text-brand-600" />
								Métodos de Pago
							</CardTitle>
						</CardHeader>
						<CardContent>
							{!user.paymentInformation || user.paymentInformation.length === 0 ? (
								<p className="py-2 text-sm italic text-slate-500">
									No tienes métodos de pago guardados.
								</p>
							) : (
								<div className="grid gap-4 sm:grid-cols-2">
									{user.paymentInformation.map((payment, index) => (
										<div
											key={index}
											className="flex items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-br from-white to-brand-50/40 p-4 text-sm shadow-sm"
										>
											<div className="space-y-1">
												<p className="font-medium text-slate-800">
													•••• •••• ••••{" "}
													{payment.cardNumber?.slice(-4) || "0000"}
												</p>
												<p className="text-xs text-slate-500">
													Expira: {payment.expirationDate}
												</p>
											</div>
											<span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
												Card
											</span>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
