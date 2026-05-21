import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductNotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full border-slate-200/70 bg-white/95 text-center">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-950">Producto no encontrado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-slate-600">
          <p>El identificador solicitado no devolvió un producto válido desde el backend.</p>
          <Button asChild>
            <Link href="/products">Volver al catálogo</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}