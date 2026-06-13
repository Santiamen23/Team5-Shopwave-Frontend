"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Shield, ShoppingCart, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
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
				"relative text-sm font-medium transition-colors",
				mobile
					? "rounded-2xl px-4 py-3"
					: "rounded-full px-4 py-2",
				active
					? "bg-brand-50 text-brand-700"
					: "text-slate-600 hover:bg-brand-50/60 hover:text-brand-700",
			)}
			href={href}
		>
			{label}
			{active && !mobile ? (
				<span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-500" />
			) : null}
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
	const adminNavItems =
		user?.role === "ROLE_ADMIN" ? [{ href: "/admin", label: "Admin" }] : [];

	return (
		<nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl supports-[backdrop-filter]:bg-white/65">
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link
					href="/"
					className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl"
				>
					<span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 text-sm font-bold text-white shadow-[0_8px_24px_-8px_oklch(0.43_0.18_245_/_0.6)]">
						<span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(1_0_0_/_0.45),transparent_60%)]" />
						<span className="relative">S</span>
					</span>
					<span className="text-gradient-brand">ShopWave</span>
				</Link>

				<div className="hidden items-center gap-1 md:flex">
					{[...navItems, ...userNavItems, ...adminNavItems].map((item) => (
						<NavLink
							key={item.href}
							href={item.href}
							label={item.label}
							pathname={pathname}
						/>
					))}
					{isAuthenticated ? (
						<div className="ml-2 flex items-center gap-2">
							<div className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 lg:block">
								{user?.firstName} {user?.lastName}
							</div>
							<Button
								size="icon"
								variant="ghost"
								aria-label="Ir al carrito"
								asChild
							>
								<Link href="/cart">
									<ShoppingCart className="h-5 w-5" />
								</Link>
							</Button>
							<Button
								size="icon"
								variant="ghost"
								aria-label="Cerrar sesión"
								onClick={() => void logout()}
							>
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
							<Button size="icon" variant="ghost" aria-label="Abrir menú">
								<Menu className="h-5 w-5" />
							</Button>
						</SheetTrigger>

						<SheetContent
							side="left"
							className="w-[88vw] max-w-sm border-r-0 bg-white"
						>
							<SheetHeader className="border-b border-slate-200/70 pb-4">
								<SheetTitle className="text-left text-xl">
									<span className="text-gradient-brand">ShopWave</span>
								</SheetTitle>
							</SheetHeader>

							<div className="mt-2 flex flex-col gap-1 px-1">
								{[...navItems, ...userNavItems, ...adminNavItems].map((item) => (
									<NavLink
										key={item.href}
										href={item.href}
										label={item.label}
										pathname={pathname}
										mobile
									/>
								))}
								{isAuthenticated ? (
									<div className="mt-2 space-y-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-4">
										<NavLink
											href="/cart"
											label="Carrito"
											pathname={pathname}
											mobile
										/>
										<div className="flex items-center gap-2 text-sm font-medium text-slate-950">
											<User className="h-4 w-4 text-brand-600" />
											<span>
												{user?.firstName} {user?.lastName}
											</span>
										</div>
										{user?.role === "ROLE_ADMIN" ? (
											<div className="flex items-center gap-2 text-xs uppercase tracking-wide text-brand-700">
												<Shield className="h-4 w-4" />
												<span>Administrador</span>
											</div>
										) : null}
										<Button
											className="w-full"
											variant="outline"
											onClick={() => void logout()}
										>
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
