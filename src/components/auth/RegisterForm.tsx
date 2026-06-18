"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	AlertCircle,
	ArrowLeft,
	CheckCircle2,
	Lock,
	Mail,
	Phone,
	User,
	UserPlus,
} from "lucide-react";

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

interface RegisterFormState {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	mobile: string;
}

const EMPTY_FORM: RegisterFormState = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	confirmPassword: "",
	mobile: "",
};

const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿñÑ' -]{2,40}$/;
const MOBILE_REGEX = /^\+?[0-9]{8,15}$/;
const EMAIL_REGEX =
	/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

type FieldErrors = Partial<Record<keyof RegisterFormState, string>>;

function validateField(
	field: keyof RegisterFormState,
	value: string,
	form: RegisterFormState,
): string | null {
	const trimmed = value.trim();

	switch (field) {
		case "firstName":
		case "lastName": {
			if (!trimmed) {
				return field === "firstName" ? "Ingresa tu nombre." : "Ingresa tu apellido.";
			}
			if (trimmed.length < 2) {
				return "Debe tener al menos 2 caracteres.";
			}
			if (trimmed.length > 40) {
				return "No puede tener más de 40 caracteres.";
			}
			if (!NAME_REGEX.test(trimmed)) {
				return "Solo se permiten letras, espacios, acentos y guiones.";
			}
			return null;
		}

		case "email": {
			if (!trimmed) return "Ingresa tu correo electrónico.";
			if (trimmed.length > 100) return "El correo es demasiado largo.";
			if (!EMAIL_REGEX.test(trimmed)) {
				return "El formato del correo no es válido (ejemplo: nombre@dominio.com).";
			}
			return null;
		}

		case "mobile": {
			if (!trimmed) return "Ingresa tu número de celular.";
			if (!MOBILE_REGEX.test(trimmed)) {
				return "Solo dígitos, 8 a 15 caracteres. Puedes agregar + al inicio.";
			}
			return null;
		}

		case "password": {
			if (!value) return "Ingresa una contraseña.";
			if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
			if (value.length > 64) return "La contraseña es demasiado larga (máx. 64).";
			if (!/[A-Z]/.test(value)) {
				return "Debe incluir al menos una letra mayúscula.";
			}
			if (!/[a-z]/.test(value)) {
				return "Debe incluir al menos una letra minúscula.";
			}
			if (!/[0-9]/.test(value)) {
				return "Debe incluir al menos un número.";
			}
			return null;
		}

		case "confirmPassword": {
			if (!value) return "Confirma tu contraseña.";
			if (value !== form.password) return "Las contraseñas no coinciden.";
			return null;
		}

		default:
			return null;
	}
}

function getPasswordChecks(password: string) {
	return [
		{ label: "Mínimo 8 caracteres", ok: password.length >= 8 },
		{ label: "Una mayúscula", ok: /[A-Z]/.test(password) },
		{ label: "Una minúscula", ok: /[a-z]/.test(password) },
		{ label: "Un número", ok: /[0-9]/.test(password) },
	];
}

export default function RegisterForm() {
	const router = useRouter();
	const [formData, setFormData] = useState<RegisterFormState>(EMPTY_FORM);
	const [errors, setErrors] = useState<FieldErrors>({});
	const [touched, setTouched] = useState<Partial<Record<keyof RegisterFormState, boolean>>>({});
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const passwordChecks = useMemo(() => getPasswordChecks(formData.password), [formData.password]);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { id, value } = e.target;
		const field = id as keyof RegisterFormState;
		setFormData((prev) => ({ ...prev, [field]: value }));

		if (touched[field]) {
			setErrors((prev) => {
				const next = { ...prev };
				const error = validateField(field, value, { ...formData, [field]: value });
				if (error) next[field] = error;
				else delete next[field];

				if (field === "password" && touched.confirmPassword) {
					const confirmError = validateField(
						"confirmPassword",
						formData.confirmPassword,
						{ ...formData, password: value },
					);
					if (confirmError) next.confirmPassword = confirmError;
					else delete next.confirmPassword;
				}

				return next;
			});
		}
	}

	function handleBlur(field: keyof RegisterFormState) {
		setTouched((prev) => ({ ...prev, [field]: true }));
		const error = validateField(field, formData[field], formData);
		setErrors((prev) => {
			const next = { ...prev };
			if (error) next[field] = error;
			else delete next[field];
			return next;
		});
	}

	function validateAll(): FieldErrors {
		const next: FieldErrors = {};
		(Object.keys(EMPTY_FORM) as Array<keyof RegisterFormState>).forEach((field) => {
			const error = validateField(field, formData[field], formData);
			if (error) next[field] = error;
		});
		return next;
	}

	const formHasErrors = Object.keys(errors).length > 0;

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setSubmitError(null);

		const allErrors = validateAll();
		setErrors(allErrors);
		setTouched({
			firstName: true,
			lastName: true,
			email: true,
			password: true,
			confirmPassword: true,
			mobile: true,
		});

		if (Object.keys(allErrors).length > 0) {
			setSubmitError("Revisa los campos marcados antes de continuar.");
			return;
		}

		setIsLoading(true);

		try {
			await signUp({
				firstName: formData.firstName.trim(),
				lastName: formData.lastName.trim(),
				email: formData.email.trim(),
				password: formData.password,
				mobile: formData.mobile.trim(),
			});
			router.push("/login");
		} catch (err) {
			setSubmitError(
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
					<div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-600 text-white">
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
					{submitError ? (
						<div className="flex items-start gap-2 rounded-2xl border border-danger-500/30 bg-danger-50 p-4 text-sm text-danger-700">
							<AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
							<span>{submitError}</span>
						</div>
					) : null}

					<form className="space-y-4" onSubmit={handleSubmit} noValidate>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								id="firstName"
								label="Nombre"
								required
								error={touched.firstName ? errors.firstName : undefined}
							>
								<div className="relative">
									<User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
									<Input
										id="firstName"
										type="text"
										value={formData.firstName}
										onChange={handleChange}
										onBlur={() => handleBlur("firstName")}
										invalid={Boolean(touched.firstName && errors.firstName)}
										autoComplete="given-name"
										className="pl-10"
										placeholder="Ej: Juan"
										disabled={isLoading}
									/>
								</div>
							</FormField>
							<FormField
								id="lastName"
								label="Apellido"
								required
								error={touched.lastName ? errors.lastName : undefined}
							>
								<Input
									id="lastName"
									type="text"
									value={formData.lastName}
									onChange={handleChange}
									onBlur={() => handleBlur("lastName")}
									invalid={Boolean(touched.lastName && errors.lastName)}
									autoComplete="family-name"
									placeholder="Ej: Pérez"
									disabled={isLoading}
								/>
							</FormField>
						</div>

						<FormField
							id="mobile"
							label="Teléfono Celular"
							required
							hint="Solo dígitos, 8 a 15 caracteres (puedes agregar + al inicio)."
							error={touched.mobile ? errors.mobile : undefined}
						>
							<div className="relative">
								<Phone className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<Input
									id="mobile"
									type="tel"
									value={formData.mobile}
									onChange={handleChange}
									onBlur={() => handleBlur("mobile")}
									invalid={Boolean(touched.mobile && errors.mobile)}
									autoComplete="tel"
									inputMode="numeric"
									className="pl-10"
									placeholder="Ej: 77123456"
									disabled={isLoading}
								/>
							</div>
						</FormField>

						<FormField
							id="email"
							label="Correo Electrónico"
							required
							error={touched.email ? errors.email : undefined}
						>
							<div className="relative">
								<Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<Input
									id="email"
									type="email"
									value={formData.email}
									onChange={handleChange}
									onBlur={() => handleBlur("email")}
									invalid={Boolean(touched.email && errors.email)}
									autoComplete="email"
									className="pl-10"
									placeholder="correo@ejemplo.com"
									disabled={isLoading}
								/>
							</div>
						</FormField>

						<FormField
							id="password"
							label="Contraseña"
							required
							error={touched.password ? errors.password : undefined}
						>
							<div className="relative">
								<Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<Input
									id="password"
									type="password"
									value={formData.password}
									onChange={handleChange}
									onBlur={() => handleBlur("password")}
									invalid={Boolean(touched.password && errors.password)}
									autoComplete="new-password"
									className="pl-10"
									placeholder="Crea una contraseña segura"
									disabled={isLoading}
								/>
							</div>
							{touched.password && formData.password.length > 0 ? (
								<ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
									{passwordChecks.map((check) => (
										<li
											key={check.label}
											className={
												check.ok
													? "flex items-center gap-1.5 text-success-700"
													: "flex items-center gap-1.5 text-slate-400"
											}
										>
											{check.ok ? (
												<CheckCircle2 className="h-3.5 w-3.5" />
											) : (
												<AlertCircle className="h-3.5 w-3.5" />
											)}
											{check.label}
										</li>
									))}
								</ul>
							) : null}
						</FormField>

						<FormField
							id="confirmPassword"
							label="Confirmar contraseña"
							required
							error={touched.confirmPassword ? errors.confirmPassword : undefined}
						>
							<div className="relative">
								<Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<Input
									id="confirmPassword"
									type="password"
									value={formData.confirmPassword}
									onChange={handleChange}
									onBlur={() => handleBlur("confirmPassword")}
									invalid={Boolean(touched.confirmPassword && errors.confirmPassword)}
									autoComplete="new-password"
									className="pl-10"
									placeholder="Vuelve a escribir tu contraseña"
									disabled={isLoading}
								/>
							</div>
						</FormField>

						<Button
							type="submit"
							size="lg"
							className="mt-2 w-full"
							disabled={isLoading || (formHasErrors && Object.keys(touched).length > 0)}
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
