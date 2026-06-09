"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });
      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
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
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-sm text-slate-600">
            Ingresa tus datos para acceder a tu cuenta
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 placeholder-slate-400 outline-none transition-all focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:opacity-50"
                  placeholder="ejemplo@correo.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 placeholder-slate-400 outline-none transition-all focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:opacity-50"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>

          <div className="border-t border-slate-100 pt-2 text-center text-sm">
            <span className="text-slate-600">¿No tienes una cuenta? </span>
            <Link href="/register" className="font-medium text-blue-600 hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
