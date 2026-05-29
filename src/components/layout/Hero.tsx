"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Hero() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <section className="px-4 pt-6 pb-4 sm:px-6 sm:pt-8 sm:pb-8 lg:px-8 lg:pt-10 lg:pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white px-5 py-8 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.22)] sm:rounded-[2.5rem] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="max-w-2xl space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                Tecnología seleccionada para comprar sin fricción
              </div>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl xl:text-[4.5rem] xl:leading-[1]">
                  Todo lo que necesitas en tecnología, en una tienda clara, rápida y lista para cualquier pantalla.
                </h1>

                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  Explora celulares, laptops, tablets y accesorios con fichas claras, precios visibles
                  y una experiencia responsive que mantiene los detalles importantes a mano desde mobile,
                  tablet o desktop.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="w-full rounded-full px-7 sm:w-auto" asChild>
                  <Link href="/products">Ver catálogo</Link>
                </Button>

                {!isLoading && !isAuthenticated ? (
                  <Button variant="outline" size="lg" className="w-full rounded-full border-slate-300 bg-white px-7 sm:w-auto" asChild>
                    <Link href="/register">Crear cuenta</Link>
                  </Button>
                ) : null}
              </div>

              <div className="grid gap-3 pt-2 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Catalogo</p>
                  <p className="mt-2 text-base text-slate-950 sm:text-lg">Marcas y equipos en un solo lugar</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Compra</p>
                  <p className="mt-2 text-base text-slate-950 sm:text-lg">Precios visibles y decisión más rápida</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Soporte</p>
                  <p className="mt-2 text-base text-slate-950 sm:text-lg">Garantía y atención para cada compra</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 opacity-95 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.6)]" />
              <div className="rounded-[2rem] border border-white/10 bg-white/8 p-4 sm:p-5">
                <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10">
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
                    <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-cyan-200/80">ShopWave</p>
                    <p className="mt-1 text-sm text-slate-100">Compra tecnología con una interfaz más clara y directa.</p>
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
