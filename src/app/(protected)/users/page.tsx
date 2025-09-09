import { getServerSession } from "@/lib/get-session";
import { UserRole } from "@/generated/prisma";
import UsersClientPage from "./users-client";

export default async function UsersPage() {
  const session = await getServerSession();
  const user = session?.user;

  // If no user or not admin, show access denied
  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Users
          </h1>
        </div>
        <div className="bg-gray-800/50 border border-purple-900/50 rounded-xl p-8 shadow-lg">
          <p className="text-red-400 text-xl font-semibold">Access Denied: Admin Only</p>
          <p className="text-gray-300 mt-2">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return <UsersClientPage />;
}
