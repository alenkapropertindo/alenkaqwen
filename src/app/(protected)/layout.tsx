import { CollapsibleSidebar } from "@/components/collapsible-sidebar";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect("/auth/login");
  
  if (user.role === "PENDING") {
    redirect("/auth/login?pending=true");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <CollapsibleSidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="hidden md:block border-b border-white/40 dark:border-white/10 bg-[#e6e8ec]/80 dark:bg-[#1e222b]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div></div> {/* Spacer for alignment */}
            <div className="flex items-center space-x-4">
              {/* User dropdown is now in the sidebar */}
            </div>
          </div>
        </header>
        <main className="flex-1 clay-bg min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
