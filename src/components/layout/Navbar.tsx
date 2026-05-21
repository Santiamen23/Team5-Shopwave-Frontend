"use client";

import Link from "next/link";
import { Menu, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  return (
    <nav className="border-b sticky top-0 z-50 bg-background/90 backdrop-blur">

      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        <Link
          href="/"
          className="text-2xl font-bold"
        >
          ShopWave
        </Link>

        <div className="hidden md:flex items-center gap-6">

          <Link href="/">Inicio</Link>

          <Link href="/products">
            Productos
          </Link>

          <Link href="/cart">
            Carrito
          </Link>

          <Link href="/login">
            Login
          </Link>

          <Button size="icon" variant="outline">
            <ShoppingCart className="h-5 w-5" />
          </Button>

        </div>

        <div className="md:hidden">

          <Sheet>

            <SheetTrigger asChild>

              <Button size="icon" variant="outline">
                <Menu />
              </Button>

            </SheetTrigger>

            <SheetContent side="left">

              <div className="flex flex-col gap-6 mt-10">

                <Link href="/">
                  Inicio
                </Link>

                <Link href="/products">
                  Productos
                </Link>

                <Link href="/cart">
                  Carrito
                </Link>

                <Link href="/login">
                  Login
                </Link>

              </div>

            </SheetContent>

          </Sheet>

        </div>

      </div>

    </nav>
  );
}