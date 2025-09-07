import { CollapsibleSidebar } from "@/components/collapsible-sidebar";
import { getServerSession } from "@/lib/get-session";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <CollapsibleSidebar user={user} />
      <div className="flex-1 flex flex-col">
        <header className="border-b border-purple-900 bg-gray-900/50 sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div></div> {/* Spacer for alignment */}
            <div className="flex items-center space-x-4">
              {/* User dropdown is now in the sidebar */}
            </div>
          </div>
        </header>
        <main className="flex-1 bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  );
}
