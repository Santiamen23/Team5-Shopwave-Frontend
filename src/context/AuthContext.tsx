"use client";

import { createContext, useEffect, useState, startTransition, useCallback } from "react";
import { useRouter } from "next/navigation";

import type { SignInPayload } from "@/models/auth.model";
import type { UserProfile } from "@/models/user.model";
import { getSession, signIn, signOut } from "@/services/auth.service";

export interface AuthContextValue {
	user: UserProfile | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (payload: SignInPayload) => Promise<UserProfile>;
	logout: () => Promise<void>;
	refreshSession: () => Promise<UserProfile | null>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [user, setUser] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const refreshSession = useCallback(async () => {
		try {
			const session = await getSession();
			setUser(session.user);
			return session.user;
		} catch (error) {
			console.warn("No se pudo refrescar la sesión:", error);
			setUser(null);
			return null;
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		void refreshSession();
	}, [refreshSession]);

	async function login(payload: SignInPayload) {
		const session = await signIn(payload);

		if (!session.user) {
			throw new Error("No se pudo iniciar sesión.");
		}

		setUser(session.user);
		startTransition(() => {
			router.refresh();
		});

		return session.user;
	}

	async function logout() {
		await signOut();
		setUser(null);
		startTransition(() => {
			router.push("/login");
			router.refresh();
		});
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: user !== null,
				isLoading,
				login,
				logout,
				refreshSession,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
