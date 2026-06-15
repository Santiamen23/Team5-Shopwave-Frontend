export default function Footer() {
	return (
		<footer className="relative mt-12 overflow-hidden bg-slate-900 text-white">
			<div className="h-1 w-full bg-brand-600" />
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
					<div>
						<div className="mb-3 flex items-center gap-2.5">
							<span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-sm font-bold text-white">
								S
							</span>
							<h4 className="text-lg font-semibold text-white">
								ShopWave Fusion
							</h4>
						</div>
						<p className="text-sm text-slate-300">
							Tu tienda de tecnología: celulares, laptops, tablets y accesorios
							con garantía oficial.
						</p>
					</div>

					<div>
						<h5 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-brand-200">
							Contacto
						</h5>
						<ul className="space-y-2 text-sm text-slate-300">
							<li>
								<a
									href="mailto:soporte@shopwavefusion.com"
									className="transition-colors hover:text-white"
								>
									soporte@shopwavefusion.com
								</a>
							</li>
							<li>
								<a
									href="mailto:ventas@shopwavefusion.com"
									className="transition-colors hover:text-white"
								>
									ventas@shopwavefusion.com
								</a>
							</li>
							<li>Tel: +54 9 11 1234 5678</li>
						</ul>
					</div>

					<div>
						<h5 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-brand-200">
							Tiendas
						</h5>
						<ul className="space-y-2 text-sm text-slate-300">
							<li>Av. Principal 123, Ciudad</li>
							<li>Centro Comercial - Local 45</li>
							<li>Horario: Lun-Vie 10:00 - 19:00</li>
						</ul>
					</div>

					<div>
						<h5 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-brand-200">
							Redes
						</h5>
						<ul className="space-y-2 text-sm text-slate-300">
							<li>
								<a
									href="#"
									aria-label="Facebook"
									className="transition-colors hover:text-white"
								>
									Facebook
								</a>
							</li>
							<li>
								<a
									href="#"
									aria-label="Instagram"
									className="transition-colors hover:text-white"
								>
									Instagram
								</a>
							</li>
							<li>
								<a
									href="#"
									aria-label="TikTok"
									className="transition-colors hover:text-white"
								>
									TikTok
								</a>
							</li>
							<li>
								<a
									href="#"
									aria-label="X/Twitter"
									className="transition-colors hover:text-white"
								>
									X / Twitter
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
					<div className="text-sm text-slate-400">
						&copy; {new Date().getFullYear()} ShopWave Fusion. Todos los
						derechos reservados.
					</div>
					<div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
						<a href="/privacy" className="transition-colors hover:text-white">
							Política de privacidad
						</a>
						<a href="/terms" className="transition-colors hover:text-white">
							Términos y condiciones
						</a>
						<a href="/support" className="transition-colors hover:text-white">
							Soporte y garantías
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
