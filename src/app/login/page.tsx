"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn({ email, password });
      
      if (result.jwt) {
        localStorage.setItem("token", result.jwt);
        router.push("/");
        router.refresh();
      } else {
        setError("Error en el servidor: No se recibió el token de acceso.");
      }
    } catch (err: any) {
      setError("Credenciales incorrectas. Por favor, verifica tu correo y contraseña.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-slate-200/70 bg-white/95 shadow-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-950">
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-sm text-slate-600">
            Ingresa tus datos para acceder a tu cuenta
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
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
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
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

          <div className="text-center text-sm pt-2 border-t border-slate-100">
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