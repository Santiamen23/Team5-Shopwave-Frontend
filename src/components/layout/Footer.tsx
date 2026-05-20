export default function Footer() {
  return (
    <footer className="border-t py-10 mt-24">

      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between gap-6">

        <div>

          <h2 className="text-2xl font-bold">
            ShopWave
          </h2>

          <p className="text-muted-foreground mt-2">
            Ecommerce moderno con Next.js
          </p>

        </div>

        <div className="text-muted-foreground">
          © 2026 ShopWave Fusion
        </div>

      </div>

    </footer>
  );
}