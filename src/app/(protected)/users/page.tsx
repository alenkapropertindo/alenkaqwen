import { getServerSession } from "@/lib/get-session";
import { UserRole } from "@/generated/prisma";
import UsersClientPage from "./users-client";

export default async function UsersPage() {
  const session = await getServerSession();
  const user = session?.user;

  // If no user or not admin, show access denied
  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="px-4 sm:px-6 py-8 container mx-auto w-full space-y-8">
        <div className="space-y-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold clay-text-title">
            Users
          </h1>
        </div>
        <div className="clay-panel p-6 sm:p-8">
          <p className="text-[#d64560] text-xl font-extrabold">Access Denied: Admin Only</p>
          <p className="clay-text-muted font-bold mt-2">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return <UsersClientPage />;
}
