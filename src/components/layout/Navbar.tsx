"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Home,
	LogOut,
	Menu,
	Package,
	Shield,
	ShoppingBag,
	ShoppingCart,
	User,
} from "lucide-react";

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
import { useCart } from "@/hooks/useCart";

type NavIcon = React.ComponentType<{ className?: string }>;

type NavItem = {
	href: string;
	label: string;
	icon: NavIcon;
};

const publicNavItems: NavItem[] = [
	{ href: "/", label: "Inicio", icon: Home },
	{ href: "/products", label: "Productos", icon: Package },
];

function isActivePath(pathname: string, href: string) {
	if (href === "/") {
		return pathname === href;
	}
	return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
	href,
	label,
	icon: Icon,
	pathname,
	mobile = false,
}: {
	href: string;
	label: string;
	icon: NavIcon;
	pathname: string;
	mobile?: boolean;
}) {
	const active = isActivePath(pathname, href);
	return (
		<Link
			className={cn(
				"relative flex items-center gap-2.5 text-sm font-medium transition-colors",
				mobile ? "rounded-2xl px-4 py-3" : "rounded-full px-4 py-2",
				active
					? "bg-brand-50 text-brand-700"
					: "text-slate-600 hover:bg-brand-50/60 hover:text-brand-700",
			)}
			href={href}
		>
			<Icon className={cn(mobile ? "h-5 w-5" : "h-4 w-4")} />
			<span>{label}</span>
			{active && !mobile ? (
				<span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-500" />
			) : null}
		</Link>
	);
}

function CartIconButton() {
	const { cart } = useCart();
	const itemCount = cart?.cartItems?.reduce(
		(sum, item) => sum + (item.quantity ?? 0),
		0,
	) ?? 0;
	return (
		<Button
			asChild
			size="icon"
			variant="ghost"
			aria-label={`Ir al carrito (${itemCount} productos)`}
			className="relative"
		>
			<Link href="/cart">
				<ShoppingCart className="h-5 w-5" />
				{itemCount > 0 ? (
					<span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-[1rem] place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white ring-2 ring-white">
						{itemCount > 99 ? "99+" : itemCount}
					</span>
				) : null}
			</Link>
		</Button>
	);
}

function MobileCartLink() {
	const { cart } = useCart();
	const itemCount = cart?.cartItems?.reduce(
		(sum, item) => sum + (item.quantity ?? 0),
		0,
	) ?? 0;
	return (
		<Link
			href="/cart"
			className="relative flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-50/60 hover:text-brand-700"
		>
			<ShoppingCart className="h-5 w-5" />
			<span>Carrito</span>
			{itemCount > 0 ? (
				<span className="ml-auto grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-brand-600 px-1.5 text-[11px] font-semibold text-white">
					{itemCount > 99 ? "99+" : itemCount}
				</span>
			) : null}
		</Link>
	);
}

export default function Navbar() {
	const pathname = usePathname();
	const { user, isAuthenticated, isLoading, logout } = useAuth();

	const userNavItems: NavItem[] = isAuthenticated
		? [{ href: "/orders", label: "Mis pedidos", icon: ShoppingBag }]
		: [];
	const adminNavItems: NavItem[] =
		user?.role === "ROLE_ADMIN"
			? [{ href: "/admin", label: "Admin", icon: Shield }]
			: [];

	const allNavItems = [...publicNavItems, ...userNavItems, ...adminNavItems];

	return (
		<nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl supports-[backdrop-filter]:bg-white/65">
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
				<Link
					href="/"
					className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl"
				>
					<span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-sm font-bold text-white">
						S
					</span>
					<span className="text-brand-700">ShopWave</span>
				</Link>

				<div className="hidden items-center gap-1 md:flex">
					{allNavItems.map((item) => (
						<NavLink
							key={item.href}
							href={item.href}
							label={item.label}
							icon={item.icon}
							pathname={pathname}
						/>
					))}
					<div className="ml-2 flex items-center gap-1">
						<CartIconButton />
						{isAuthenticated ? (
							<>
								<Button
									asChild
									variant="ghost"
									className="hidden gap-2 rounded-full lg:inline-flex"
									aria-label="Ir a mi perfil"
								>
									<Link href="/profile">
										<User className="h-4 w-4" />
										<span className="text-sm font-medium">
											{user?.firstName} {user?.lastName}
										</span>
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
							</>
						) : !isLoading ? (
							<Button className="ml-2 rounded-full" asChild>
								<Link href="/login">Entrar</Link>
							</Button>
						) : null}
					</div>
				</div>

				<div className="flex items-center gap-1 md:hidden">
					<Sheet>
						<SheetTrigger asChild>
							<Button size="icon" variant="ghost" aria-label="Abrir menú">
								<Menu className="h-5 w-5" />
							</Button>
						</SheetTrigger>

						<SheetContent
							side="right"
							className="w-[88vw] max-w-sm border-l-0 bg-white"
						>
							<SheetHeader className="border-b border-slate-200/70 pb-4">
								<SheetTitle className="text-left text-xl">
									<span className="text-brand-700">ShopWave</span>
								</SheetTitle>
							</SheetHeader>

							<div className="mt-2 flex flex-col gap-1 px-1">
								{allNavItems.map((item) => (
									<NavLink
										key={item.href}
										href={item.href}
										label={item.label}
										icon={item.icon}
										pathname={pathname}
										mobile
									/>
								))}

								<MobileCartLink />

								{isAuthenticated ? (
									<div className="mt-3 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
										<Link
											href="/profile"
											className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white"
										>
											<div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
												<User className="h-5 w-5" />
											</div>
											<div className="min-w-0 flex-1">
												<p className="truncate text-sm font-semibold text-slate-900">
													{user?.firstName} {user?.lastName}
												</p>
												<p className="text-xs text-slate-500">
													Ver mi perfil
												</p>
											</div>
										</Link>
										{user?.role === "ROLE_ADMIN" ? (
											<div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700">
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
									<div className="mt-3 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
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
