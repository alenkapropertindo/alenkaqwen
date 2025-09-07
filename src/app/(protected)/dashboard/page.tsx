import { getServerSession } from "@/lib/get-session";

export default async function page() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 border border-purple-900/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome Back</h2>
          <p className="text-purple-200">This is your dashboard overview.</p>
        </div>
      </div>
    </div>
  );
}
