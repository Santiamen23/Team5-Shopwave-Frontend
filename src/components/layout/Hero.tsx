import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="px-4 pt-8 pb-2 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div className="max-w-2xl space-y-6 sm:space-y-8">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
            Tecnología seleccionada para comprar sin fricción
          </div>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl">
              Todo lo que necesitas en tecnología, en una tienda clara, rápida y lista para cualquier pantalla.
            </h1>

            <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Explora celulares, laptops, tablets y accesorios con fichas claras, precios visibles
              y una experiencia responsive que mantiene los detalles importantes a mano desde mobile,
              tablet o desktop.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/products">Ver catálogo</Link>
            </Button>

            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/register">Crear cuenta</Link>
            </Button>
          </div>

          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
              <p className="text-sm text-slate-500">Catálogo</p>
              <p className="mt-1 text-base text-slate-950 sm:text-lg">Marcas y equipos en un solo lugar</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
              <p className="text-sm text-slate-500">Compra</p>
              <p className="mt-1 text-base text-slate-950 sm:text-lg">Precios visibles y decisión más rápida</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
              <p className="text-sm text-slate-500">Soporte</p>
              <p className="mt-1 text-base text-slate-950 sm:text-lg">Garantía y atención para cada compra</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 opacity-95 shadow-[0_30px_120px_-45px_rgba(15,23,42,0.65)]" />
          <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-6">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10">
              <Image
                src="https://cdn.thewirecutter.com/wp-content/media/2026/03/BG-IPHONE-5334-2X1.jpg?width=2048&quality=75&crop=2:1&auto=webp"
                alt="Productos destacados"
                width={1200}
                height={900}
                unoptimized
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="h-64 w-full object-cover sm:h-72 lg:h-80"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
