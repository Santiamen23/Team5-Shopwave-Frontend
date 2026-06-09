"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
	const { user, isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isLoading) {
			return;
		}

		if (!isAuthenticated) {
			router.replace("/login");
			return;
		}

		if (user?.role !== "ROLE_ADMIN") {
			router.replace("/");
		}
	}, [isAuthenticated, isLoading, router, user?.role]);

	if (isLoading) {
		return <main className="p-6 text-sm text-slate-600">Verificando permisos...</main>;
	}

	if (!isAuthenticated || user?.role !== "ROLE_ADMIN") {
		return null;
	}

	return <>{children}</>;
}
