import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-2xl space-y-8">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
            Ecommerce moderno con navegación profunda
          </div>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl">
              Compra tecnología de última generación con una experiencia clara y rápida.
            </h1>

            <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              ShopWave Fusion combina catálogo, detalle y carrito en una interfaz consistente,
              lista para crecer sin perder legibilidad en móvil, tablet o desktop.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto">
              Comprar ahora
            </Button>

            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Ver productos
            </Button>
          </div>

          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
              <p className="text-sm text-slate-500">Entrega</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">Rápida</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
              <p className="text-sm text-slate-500">Detalle</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">Completo</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
              <p className="text-sm text-slate-500">Responsive</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">100%</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 opacity-95 shadow-[0_30px_120px_-45px_rgba(15,23,42,0.65)]" />
          <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-6">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10">
              <Image
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
                alt="Productos destacados"
                width={1200}
                height={900}
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="h-64 w-full object-cover sm:h-72 lg:h-80"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4 text-white">
                <p className="text-sm text-white/70">Catálogo</p>
                <p className="mt-1 text-xl font-semibold">Listas de productos fluidas</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 text-white">
                <p className="text-sm text-white/70">Detalle</p>
                <p className="mt-1 text-xl font-semibold">Información ampliada y clara</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}