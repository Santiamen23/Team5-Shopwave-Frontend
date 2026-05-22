export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="mb-3 text-lg font-semibold">ShopWave Fusion</h4>
            <p className="text-sm text-slate-300">Tu tienda de tecnología: celulares, laptops, tablets y accesorios con garantía oficial.</p>
          </div>

          <div>
            <h5 className="mb-3 font-medium">Contacto</h5>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="mailto:soporte@shopwavefusion.com">soporte@shopwavefusion.com</a></li>
              <li><a href="mailto:ventas@shopwavefusion.com">ventas@shopwavefusion.com</a></li>
              <li>Tel: +54 9 11 1234 5678</li>
            </ul>
          </div>

          <div>
            <h5 className="mb-3 font-medium">Tiendas</h5>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Av. Principal 123, Ciudad</li>
              <li>Centro Comercial - Local 45</li>
              <li>Horario: Lun-Vie 10:00 - 19:00</li>
            </ul>
          </div>

          <div>
            <h5 className="mb-3 font-medium">Redes</h5>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" aria-label="Facebook">Facebook</a></li>
              <li><a href="#" aria-label="Instagram">Instagram</a></li>
              <li><a href="#" aria-label="TikTok">TikTok</a></li>
              <li><a href="#" aria-label="X/Twitter">X / Twitter</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-700 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-slate-400">&copy; {new Date().getFullYear()} ShopWave Fusion. Todos los derechos reservados.</div>
          <div className="flex items-center gap-6 text-sm">
            <a href="/privacy" className="text-slate-300">Política de privacidad</a>
            <a href="/terms" className="text-slate-300">Términos y condiciones</a>
            <a href="/support" className="text-slate-300">Soporte y garantías</a>
          </div>
        </div>
      </div>
    </footer>
  );
}