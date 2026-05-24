"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      setError(err instanceof Error ? err.message : "No se pudo completar el registro.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-4 w-full max-w-md text-left">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 group"
        >
          <svg
            className="h-4 w-4 transform transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la tienda
        </Link>
      </div>

      <Card className="w-full max-w-md border-slate-200/70 bg-white/95 shadow-sm">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-950">
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-sm text-slate-600">
            Completa tus datos para registrarte en la tienda
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Nombre
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-all focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:opacity-50"
                  placeholder="Ej: Juan"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Apellido
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-all focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:opacity-50"
                  placeholder="Ej: Pérez"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="mobile" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Teléfono Celular
              </label>
              <input
                id="mobile"
                type="tel"
                required
                value={formData.mobile}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 placeholder-slate-400 outline-none transition-all focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:opacity-50"
                placeholder="Ej: 77123456"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 placeholder-slate-400 outline-none transition-all focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:opacity-50"
                placeholder="correo@ejemplo.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 placeholder-slate-400 outline-none transition-all focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:opacity-50"
                placeholder="Mínimo 6 caracteres"
                disabled={isLoading}
              />
            </div>

            <Button type="submit" size="lg" className="mt-2 w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>

          <div className="border-t border-slate-100 pt-2 text-center text-sm">
            <span className="text-slate-600">¿Ya tienes una cuenta? </span>
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
