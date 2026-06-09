import CartPageClient from "@/components/cart/CartPageClient";
import { requireAuthenticatedUser } from "@/lib/auth/session";

export default async function CartPage() {
  await requireAuthenticatedUser();

  return <CartPageClient />;
}
