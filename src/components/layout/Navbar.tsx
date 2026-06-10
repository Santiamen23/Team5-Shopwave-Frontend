"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Shield, ShoppingCart, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/products", label: "Productos" },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  pathname,
  mobile = false,
}: {
  href: string;
  label: string;
  pathname: string;
  mobile?: boolean;
}) {
  const active = isActivePath(pathname, href);

  return (
    <Link
      className={cn(
        "text-sm font-medium transition-colors",
        mobile
          ? "rounded-2xl px-4 py-3"
          : "rounded-full px-4 py-2",
        active
          ? "bg-slate-100 text-slate-950"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      )}
      href={href}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const userNavItems = isAuthenticated
    ? [
        { href: "/orders", label: "Mis pedidos" },
        { href: "/profile", label: "Perfil" },
      ]
    : [];
  const adminNavItems = user?.role === "ROLE_ADMIN" ? [{ href: "/admin", label: "Admin" }] : [];

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
          {[...navItems, ...userNavItems, ...adminNavItems].map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} pathname={pathname} />
          ))}
          {isAuthenticated ? (
            <div className="ml-2 flex items-center gap-2">
              <div className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 lg:block">
                {user?.firstName} {user?.lastName}
              </div>
              <Button size="icon" variant="outline" className="rounded-full" aria-label="Ir al carrito" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="icon" variant="outline" className="rounded-full" aria-label="Cerrar sesión" onClick={() => void logout()}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : !isLoading ? (
            <Button className="ml-2 rounded-full" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
          ) : null}
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
                {[...navItems, ...userNavItems, ...adminNavItems].map((item) => (
                  <NavLink key={item.href} href={item.href} label={item.label} pathname={pathname} mobile />
                ))}
                {isAuthenticated ? (
                  <div className="mt-2 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <NavLink href="/cart" label="Carrito" pathname={pathname} mobile />
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-950">
                      <User className="h-4 w-4" />
                      <span>{user?.firstName} {user?.lastName}</span>
                    </div>
                    {user?.role === "ROLE_ADMIN" ? (
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                        <Shield className="h-4 w-4" />
                        <span>Administrador</span>
                      </div>
                    ) : null}
                    <Button className="w-full" variant="outline" onClick={() => void logout()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </Button>
                  </div>
                ) : !isLoading ? (
                  <div className="mt-2 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <Button className="w-full" asChild>
                      <Link href="/login">Entrar</Link>
                    </Button>
                    <Button className="w-full" variant="outline" asChild>
                      <Link href="/register">Crear cuenta</Link>
                    </Button>
                  </div>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
