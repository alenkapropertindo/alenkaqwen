import { getServerSession } from "@/lib/get-session";

export default async function page() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Customers</h1>
      </div>
      <div className="bg-gray-800/50 border border-purple-900/50 rounded-xl p-6">
        <p className="text-purple-200">Manage your customers here.</p>
      </div>
    </div>
  );
}
