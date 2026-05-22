export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200/70 bg-white/70 px-4 py-10 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 sm:grid-cols-2 sm:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">ShopWave</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Ecommerce moderno con Next.js
          </h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
            Una base visual consistente para catálogo, detalle y futuras pantallas de compra.
          </p>
        </div>

        <div className="text-sm text-slate-500 sm:text-right">
          <p className="font-medium text-slate-700">© 2026 ShopWave Fusion</p>
          <p className="mt-2">Diseñado para crecer sin perder claridad en ningún dispositivo.</p>
        </div>
      </div>
    </footer>
  );
}