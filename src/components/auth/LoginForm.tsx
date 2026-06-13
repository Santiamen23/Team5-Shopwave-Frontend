"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Mail, Lock, ArrowLeft } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FormField, Input } from "@/components/ui/input";
import {
	FieldErrors,
	REQUIRED_ERROR,
	validateEmail,
	validateRequired,
} from "@/utils/validation.util";

interface LoginFieldErrors extends FieldErrors {
	email?: string;
	password?: string;
}

export default function LoginForm({ nextPath }: { nextPath: string }) {
	const router = useRouter();
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<LoginFieldErrors>({});

	function validate(): LoginFieldErrors {
		const nextErrors: LoginFieldErrors = {};
		const emailError = validateEmail(email);
		const passwordError = validateRequired(password);

		if (emailError) nextErrors.email = emailError;
		if (passwordError) nextErrors.password = passwordError ?? REQUIRED_ERROR;

		return nextErrors;
	}

	function clearFieldError(field: keyof LoginFieldErrors) {
		setErrors((prev) => {
			if (!prev[field]) {
				return prev;
			}
			const next: LoginFieldErrors = { ...prev };
			delete next[field];
			return next;
		});
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setErrors({});
		setIsLoading(true);

		try {
			await login({ email: email.trim(), password });
			router.push(nextPath);
			router.refresh();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "No se pudo iniciar sesión.",
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
			<div className="mb-4 w-full max-w-md text-left">
				<Link
					href="/"
					className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-brand-700"
				>
					<ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
					Volver a la tienda
				</Link>
			</div>

			<Card className="w-full max-w-md border-slate-200/80 bg-white/95 shadow-[0_24px_60px_-32px_oklch(0.18_0.02_250_/_0.4)]">
				<CardHeader className="space-y-3 text-center">
					<div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 text-white shadow-[0_8px_24px_-8px_oklch(0.43_0.18_245_/_0.6)]">
						<LogIn className="h-5 w-5" />
					</div>
					<CardTitle className="text-3xl font-semibold tracking-tight text-slate-950">
						Iniciar Sesión
					</CardTitle>
					<CardDescription className="text-sm text-slate-600">
						Ingresa tus datos para acceder a tu cuenta
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					{error ? (
						<div className="rounded-2xl border border-danger-500/30 bg-danger-50 p-4 text-sm text-danger-700">
							{error}
						</div>
					) : null}

					<form className="space-y-5" onSubmit={handleSubmit} noValidate>
						<FormField id="email" label="Correo Electrónico" required error={errors.email}>
							<div className="relative">
								<Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<Input
									id="email"
									type="email"
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
										clearFieldError("email");
									}}
									className="pl-10"
									placeholder="ejemplo@correo.com"
									disabled={isLoading}
									invalid={Boolean(errors.email)}
								/>
							</div>
						</FormField>

						<FormField id="password" label="Contraseña" required error={errors.password}>
							<div className="relative">
								<Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => {
										setPassword(e.target.value);
										clearFieldError("password");
									}}
									className="pl-10"
									placeholder="••••••••"
									disabled={isLoading}
									invalid={Boolean(errors.password)}
								/>
							</div>
						</FormField>

						<Button
							type="submit"
							size="lg"
							className="w-full"
							disabled={isLoading}
						>
							{isLoading ? "Ingresando..." : "Ingresar"}
						</Button>
					</form>

					<div className="border-t border-slate-100 pt-4 text-center text-sm">
						<span className="text-slate-600">¿No tienes una cuenta? </span>
						<Link
							href="/register"
							className="font-semibold text-brand-700 transition-colors hover:text-brand-600"
						>
							Regístrate aquí
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
