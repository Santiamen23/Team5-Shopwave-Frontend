"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function HomeCTA() {
	const { isAuthenticated, isLoading, user } = useAuth();
	const firstName = user?.firstName;

	return (
		<section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
			<div className="mx-auto w-full max-w-7xl">
				<div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-brand-700 px-6 py-10 text-white sm:px-10 sm:py-12">
					<div className="absolute -top-24 -right-16 h-60 w-60 rounded-full bg-white/15 blur-3xl" />
					<div className="absolute -bottom-24 -left-16 h-60 w-60 rounded-full bg-info-500/30 blur-3xl" />

					<div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
						<div className="max-w-2xl space-y-3">
							<span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-100 backdrop-blur">
								<Sparkles className="h-3.5 w-3.5" />
								Tu próxima compra
							</span>
							<h2 className="text-2xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-3xl lg:text-4xl">
								{isLoading
									? "Cargando tu experiencia..."
									: isAuthenticated
										? `Hola ${firstName ?? "de nuevo"}, seguí explorando el catálogo.`
										: "Creá tu cuenta y empezá a comprar en minutos."}
							</h2>
							<p className="text-sm text-brand-100/90 sm:text-base">
								{isAuthenticated
									? "Retomá tu última selección, mirá ofertas personalizadas y gestioná tus pedidos desde tu cuenta."
									: "Acceso a tu historial, seguimiento de pedidos y notificaciones de ofertas para tus marcas favoritas."}
							</p>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
							{!isLoading && !isAuthenticated ? (
								<>
									<Button
										asChild
										size="xl"
										className="bg-white text-brand-700 shadow-[0_8px_24px_-8px_oklch(0.18_0.02_250_/_0.55)] hover:bg-brand-50 hover:text-brand-700"
									>
										<Link href="/register">
											Crear cuenta gratis
											<ArrowRight className="h-4 w-4" />
										</Link>
									</Button>
									<Button
										asChild
										size="xl"
										variant="outline"
										className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
									>
										<Link href="/login">Ya tengo cuenta</Link>
									</Button>
								</>
							) : (
								<Button
									asChild
									size="xl"
									className="bg-white text-brand-700 shadow-[0_8px_24px_-8px_oklch(0.18_0.02_250_/_0.55)] hover:bg-brand-50 hover:text-brand-700"
								>
									<Link href="/products">
										Explorar catálogo
										<ArrowRight className="h-4 w-4" />
									</Link>
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
