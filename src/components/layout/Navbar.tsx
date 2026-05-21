"use client";

import Link from "next/link";
import { Menu, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-950/20">
            S
          </span>
          <span>ShopWave</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <Link className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950" href="/">Inicio</Link>
          <Link className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950" href="/products">Productos</Link>
          <Link className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950" href="/cart">Carrito</Link>
          <Link className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950" href="/login">Login</Link>
          <Button size="icon" variant="outline" className="ml-2 rounded-full">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[88vw] max-w-sm">
              <SheetHeader className="border-b border-slate-200/70 pb-4">
                <SheetTitle className="text-left text-xl">ShopWave</SheetTitle>
              </SheetHeader>

              <div className="mt-2 flex flex-col gap-2 px-1">
                <Link className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950" href="/">Inicio</Link>
                <Link className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950" href="/products">Productos</Link>
                <Link className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950" href="/cart">Carrito</Link>
                <Link className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950" href="/login">Login</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}