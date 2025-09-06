import { UserDropdown } from "@/components/user-dropdown";
import { auth } from "@/lib/auth";
import { getServerSession } from "@/lib/get-session";
import { headers } from "next/headers";

export default async function page() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <div className="px-8 py-16 container mx-autommax-w-screen-lg space-y-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>
      <UserDropdown user={user} />
      <pre className="text-sm overflow-clip">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}
