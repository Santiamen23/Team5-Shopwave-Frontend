"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.replace(`/login?next=${encodeURIComponent(pathname)}`);
		}
	}, [isAuthenticated, isLoading, pathname, router]);

	if (isLoading) {
		return <main className="p-6 text-sm text-slate-600">Verificando sesión...</main>;
	}

	if (!isAuthenticated) {
		return null;
	}

	return <>{children}</>;
}
