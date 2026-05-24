import Navbar from "@/components/layout/Navbar";
import { requireAuthenticatedUser } from "@/lib/auth/session";

export default async function ProfilePage() {
  const user = await requireAuthenticatedUser();

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-950">Perfil</h1>
          <dl className="mt-6 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-slate-950">Nombre</dt>
              <dd>{user.firstName} {user.lastName}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-950">Correo</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-950">Teléfono</dt>
              <dd>{user.mobile}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-950">Rol</dt>
              <dd>{user.role}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
