"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, Phone, User, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FormField, Input } from "@/components/ui/input";
import { signUp } from "@/services/auth.service";

export default function RegisterForm() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		mobile: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			await signUp(formData);
			router.push("/login");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "No se pudo completar el registro.",
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
						<UserPlus className="h-5 w-5" />
					</div>
					<CardTitle className="text-3xl font-semibold tracking-tight text-slate-950">
						Crear Cuenta
					</CardTitle>
					<CardDescription className="text-sm text-slate-600">
						Completa tus datos para registrarte en la tienda
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-5">
					{error ? (
						<div className="rounded-2xl border border-danger-500/30 bg-danger-50 p-4 text-sm text-danger-700">
							{error}
						</div>
					) : null}

					<form className="space-y-4" onSubmit={handleSubmit} noValidate>
						<div className="grid grid-cols-2 gap-4">
							<FormField id="firstName" label="Nombre" required>
								<div className="relative">
									<User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
									<Input
										id="firstName"
										type="text"
										required
										value={formData.firstName}
										onChange={handleChange}
										className="pl-10"
										placeholder="Ej: Juan"
										disabled={isLoading}
									/>
								</div>
							</FormField>
							<FormField id="lastName" label="Apellido" required>
								<Input
									id="lastName"
									type="text"
									required
									value={formData.lastName}
									onChange={handleChange}
									placeholder="Ej: Pérez"
									disabled={isLoading}
								/>
							</FormField>
						</div>

						<FormField id="mobile" label="Teléfono Celular" required>
							<div className="relative">
								<Phone className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<Input
									id="mobile"
									type="tel"
									required
									value={formData.mobile}
									onChange={handleChange}
									className="pl-10"
									placeholder="Ej: 77123456"
									disabled={isLoading}
								/>
							</div>
						</FormField>

						<FormField id="email" label="Correo Electrónico" required>
							<div className="relative">
								<Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<Input
									id="email"
									type="email"
									required
									value={formData.email}
									onChange={handleChange}
									className="pl-10"
									placeholder="correo@ejemplo.com"
									disabled={isLoading}
								/>
							</div>
						</FormField>

						<FormField id="password" label="Contraseña" required>
							<div className="relative">
								<Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<Input
									id="password"
									type="password"
									required
									value={formData.password}
									onChange={handleChange}
									className="pl-10"
									placeholder="Mínimo 6 caracteres"
									disabled={isLoading}
								/>
							</div>
						</FormField>

						<Button
							type="submit"
							size="lg"
							className="mt-2 w-full"
							disabled={isLoading}
						>
							{isLoading ? "Registrando..." : "Registrarse"}
						</Button>
					</form>

					<div className="border-t border-slate-100 pt-4 text-center text-sm">
						<span className="text-slate-600">¿Ya tienes una cuenta? </span>
						<Link
							href="/login"
							className="font-semibold text-brand-700 transition-colors hover:text-brand-600"
						>
							Inicia sesión
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
