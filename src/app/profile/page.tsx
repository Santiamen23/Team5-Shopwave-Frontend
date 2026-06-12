import Navbar from "@/components/layout/Navbar";
import ProfileView from "@/components/profile/ProfileView";
import { requireAuthenticatedUser } from "@/lib/auth/session";

export default async function ProfilePage() {
  const user = await requireAuthenticatedUser();

  return (
    <main className="min-h-screen bg-slate-50/50">
      <Navbar />
      <ProfileView user={user} />
    </main>
  );
}