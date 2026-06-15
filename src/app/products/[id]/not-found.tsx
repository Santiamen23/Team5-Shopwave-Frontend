import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function ProductNotFound() {
	return (
		<main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-12 sm:px-6 lg:px-8">
			<Card className="w-full border-slate-200/80 bg-white/95 text-center shadow-[0_24px_60px_-36px_oklch(0.18_0.02_250_/_0.35)]">
				<CardHeader className="p-5 sm:p-6">
					<div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-600 text-white">
						<Search className="h-5 w-5" />
					</div>
					<CardTitle className="text-2xl text-slate-950 sm:text-3xl">
						Producto no encontrado
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6 p-5 text-slate-600 sm:p-6">
					<p>No pudimos encontrar el producto que buscas.</p>
					<Button asChild size="lg">
						<Link href="/products">Volver al catálogo</Link>
					</Button>
				</CardContent>
			</Card>
		</main>
	);
}
