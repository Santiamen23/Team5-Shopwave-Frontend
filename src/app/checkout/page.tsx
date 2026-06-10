import CheckoutPageClient from "@/components/cart/CheckoutPageClient";
import { requireAuthenticatedUser } from "@/lib/auth/session";

export default async function CheckoutPage() {
  await requireAuthenticatedUser();

  return <CheckoutPageClient />;
}
