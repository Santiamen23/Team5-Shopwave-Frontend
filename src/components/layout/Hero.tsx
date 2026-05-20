import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="py-28">

      <div className="container mx-auto px-4">

        <div className="max-w-3xl">

          <p className="text-primary font-semibold mb-4">
            Ecommerce moderno
          </p>

          <h1 className="text-6xl md:text-7xl font-bold leading-tight">

            Compra tecnología
            de última generación

          </h1>

          <p className="mt-6 text-xl text-muted-foreground">

            ShopWave Fusion combina
            diseño moderno, velocidad
            y una experiencia de compra
            increíble.

          </p>

          <div className="flex gap-4 mt-10">

            <Button size="lg">
              Comprar ahora
            </Button>

            <Button
              variant="outline"
              size="lg"
            >
              Ver productos
            </Button>

          </div>

        </div>

      </div>

    </section>
  );
}