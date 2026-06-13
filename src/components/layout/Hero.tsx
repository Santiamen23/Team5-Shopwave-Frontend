"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, Zap, ShieldCheck, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Hero() {
	const { isAuthenticated, isLoading } = useAuth();

	return (
		<section className="px-4 pt-6 pb-4 sm:px-6 sm:pt-8 sm:pb-8 lg:px-8 lg:pt-10 lg:pb-12">
			<div className="mx-auto max-w-7xl">
				<div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/85 px-5 py-8 shadow-[0_28px_70px_-42px_oklch(0.18_0.02_250_/_0.22)] backdrop-blur sm:rounded-[2.5rem] sm:px-8 sm:py-10 lg:px-10 lg:py-14">
					<div className="bg-grid-faint absolute inset-0 -z-10 opacity-60" />
					<div className="absolute -top-32 -right-24 -z-10 h-72 w-72 rounded-full bg-gradient-to-br from-brand-400/40 to-info-500/30 blur-3xl" />
					<div className="absolute -bottom-32 -left-24 -z-10 h-72 w-72 rounded-full bg-gradient-to-tr from-info-500/30 to-brand-300/40 blur-3xl" />

					<div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
						<div className="max-w-2xl space-y-6 sm:space-y-8">
							<div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm">
								<Sparkles className="h-4 w-4" />
								<span>Tecnología seleccionada para comprar sin fricción</span>
							</div>

							<div className="space-y-5">
								<h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl xl:text-[4.5rem] xl:leading-[1.05]">
									Todo lo que necesitas en{" "}
									<span className="text-gradient-brand">tecnología</span>, en una
									tienda clara, rápida y lista para cualquier pantalla.
								</h1>

								<p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
									Explora celulares, laptops, tablets y accesorios con fichas
									claras, precios visibles y una experiencia responsive que
									mantiene los detalles importantes a mano desde mobile, tablet
									o desktop.
								</p>
							</div>

							<div className="flex flex-col gap-3 sm:flex-row">
								<Button
									size="xl"
									className="w-full rounded-full sm:w-auto"
									asChild
								>
									<Link href="/products">
										<Zap className="h-4 w-4" />
										Ver catálogo
									</Link>
								</Button>

								{!isLoading && !isAuthenticated ? (
									<Button
										variant="outline"
										size="xl"
										className="w-full rounded-full sm:w-auto"
										asChild
									>
										<Link href="/register">Crear cuenta</Link>
									</Button>
								) : null}
							</div>

							<div className="grid gap-3 pt-2 sm:grid-cols-3">
								<FeatureTile
									icon={<Zap className="h-4 w-4" />}
									label="Catalogo"
									value="Marcas y equipos en un solo lugar"
								/>
								<FeatureTile
									icon={<Truck className="h-4 w-4" />}
									label="Compra"
									value="Precios visibles y decisión más rápida"
								/>
								<FeatureTile
									icon={<ShieldCheck className="h-4 w-4" />}
									label="Soporte"
									value="Garantía y atención para cada compra"
								/>
							</div>
						</div>

						<div className="relative">
							<div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-700 via-brand-600 to-info-700 opacity-95 shadow-[0_35px_90px_-40px_oklch(0.28_0.11_245_/_0.6)]" />
							<div className="rounded-[2rem] border border-white/15 bg-white/10 p-4 sm:p-5">
								<div className="relative overflow-hidden rounded-[1.5rem] border border-white/15">
									<Image
										src="https://cdn.thewirecutter.com/wp-content/media/2026/03/BG-IPHONE-5334-2X1.jpg?width=2048&quality=75&crop=2:1&auto=webp"
										alt="Productos destacados"
										width={1200}
										height={900}
										unoptimized
										sizes="(max-width: 1024px) 100vw, 45vw"
										className="h-72 w-full object-cover sm:h-80 lg:h-[28rem]"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/10 to-transparent" />
									<div className="absolute left-4 right-4 bottom-4 rounded-2xl border border-white/15 bg-slate-950/55 px-4 py-3 text-white backdrop-blur-sm">
										<p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-200">
											ShopWave
										</p>
										<p className="mt-1 text-sm text-slate-100">
											Compra tecnología con una interfaz más clara y directa.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function FeatureTile({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) {
	return (
		<div className="group rounded-2xl border border-slate-200 bg-white/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_18px_40px_-22px_oklch(0.51_0.19_245_/_0.45)]">
			<div className="flex items-center gap-2">
				<span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100">
					{icon}
				</span>
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
					{label}
				</p>
			</div>
			<p className="mt-2 text-sm font-medium text-slate-800 sm:text-base">
				{value}
			</p>
		</div>
	);
}
