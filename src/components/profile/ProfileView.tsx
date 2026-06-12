import type { UserProfile } from "@/models/user.model";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ProfileView({ user }: { user: UserProfile }) {
  const initials = `${user.firstName[0] || ""}${user.lastName[0] || ""}`.toUpperCase();

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 font-semibold text-white text-xl shadow-md">
            {initials}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Mi Perfil</h1>
            <p className="text-sm text-slate-500">Gestiona tu información personal y preferencias</p>
          </div>
        </div>
        <div>
          <Badge variant="secondary" className="px-3 py-1 text-sm font-medium capitalize shadow-sm">
            Rol: {user.role}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm border-slate-200/80 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Datos Personales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Nombre Completo</span>
              <p className="mt-0.5 text-sm font-medium text-slate-800">{user.firstName} {user.lastName}</p>
            </div>
            <Separator className="bg-slate-100" />
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Correo Electrónico</span>
              <p className="mt-0.5 text-sm font-medium break-all text-slate-800">{user.email}</p>
            </div>
            <Separator className="bg-slate-100" />
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Teléfono</span>
              <p className="mt-0.5 text-sm font-medium text-slate-800">{user.mobile || "No registrado"}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 md:col-span-2">
          <Card className="shadow-sm border-slate-200/80">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Direcciones de Envío</CardTitle>
            </CardHeader>
            <CardContent>
              {!user.addresses || user.addresses.length === 0 ? (
                <p className="py-2 text-sm italic text-slate-500">No tienes direcciones registradas todavía.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {user.addresses.map((addr) => (
                    <div key={addr.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm shadow-sm">
                      <p className="font-semibold text-slate-800">{addr.firstName} {addr.lastName}</p>
                      <p className="mt-1 text-slate-600">{addr.streetAddress}</p>
                      <p className="text-slate-600">{addr.city}, {addr.state} {addr.zipCode}</p>
                      <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                         {addr.mobile}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200/80">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Métodos de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              {!user.paymentInformation || user.paymentInformation.length === 0 ? (
                <p className="py-2 text-sm italic text-slate-500">No tienes métodos de pago guardados.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {user.paymentInformation.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm shadow-sm">
                      <div className="space-y-1">
                        <p className="font-medium text-slate-800">
                           •••• •••• •••• {payment.cardNumber?.slice(-4) || "0000"}
                        </p>
                        <p className="text-xs text-slate-500">Expira: {payment.expirationDate}</p>
                      </div>
                      <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Card
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
}