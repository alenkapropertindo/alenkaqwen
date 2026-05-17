"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/generated/prisma";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  User as UserIcon, 
  Contact, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  LogOut,
  X
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    title: "Customers",
    href: "/customers",
    icon: <Contact className="h-5 w-5" />
  },
  {
    title: "Products",
    href: "/products",
    icon: <Package className="h-5 w-5" />
  },
  {
    title: "Users",
    href: "/users",
    icon: <Users className="h-5 w-5" />
  },
  {
    title: "Account",
    href: "/account",
    icon: <UserIcon className="h-5 w-5" />
  }
];

const userNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    title: "Customers",
    href: "/customers",
    icon: <Contact className="h-5 w-5" />
  },
  {
    title: "Products",
    href: "/products",
    icon: <Package className="h-5 w-5" />
  },
  {
    title: "Account",
    href: "/account",
    icon: <UserIcon className="h-5 w-5" />
  }
];

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export function CollapsibleSidebar({ user }: { user: User }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message || "Something went wrong");
    } else {
      toast.success("Signed out successfully");
      router.push("/");
    }
  };

  const navItems = user.role === "ADMIN" ? adminNavItems : userNavItems;

  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden sticky top-0 z-50 w-full bg-[#c4ebf2]/80 backdrop-blur-md border-b border-white/40 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="clay-card-yellow w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-[#63490b] font-extrabold">A</span>
            </div>
            <span className="text-xl font-extrabold clay-text-title">
              Alenka
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="clay-text-title hover:bg-white/40 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-full left-0 right-0 overflow-hidden bg-[#aae4ee] border-b border-white/40 shadow-lg"
            >
              <nav className="p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                          <div
                            className={`flex items-center rounded-[20px] px-3 py-3 transition-all duration-200 ${
                              isActive
                                ? "clay-btn-primary"
                                : "clay-text-title hover:bg-white/40"
                            }`}
                          >
                            <span className={isActive ? "text-[#731b31]" : "clay-text-muted"}>
                              {item.icon}
                            </span>
                            <span className="ml-3 font-medium">{item.title}</span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                  <li className="pt-2 mt-2 border-t border-white/40">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full rounded-[20px] px-3 py-3 transition-all duration-200 clay-text-title hover:bg-white/40"
                    >
                      <LogOut className="h-5 w-5 clay-text-muted" />
                      <span className="ml-3 font-medium">Sign-Out</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        className={`hidden md:flex h-screen sticky top-0 flex-col bg-[#aae4ee] border-r border-white/40 shadow-[4px_0_12px_rgba(120,190,205,0.3)] z-50`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-white/40">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <div className="clay-card-yellow w-8 h-8 rounded-lg flex items-center justify-center">
                  <span className="text-[#63490b] font-extrabold">A</span>
                </div>
                <span className="text-xl font-extrabold clay-text-title">
                  Alenka
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="clay-text-title hover:bg-white/40 rounded-lg"
            >
              {isCollapsed ? (
                <Menu className="h-6 w-6" />
              ) : (
                <ChevronLeft className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <div
                      className={`flex items-center rounded-[20px] px-3 py-2 transition-all duration-200 ${
                        isActive
                          ? "clay-btn-primary"
                          : "clay-text-title hover:bg-white/40"
                      }`}
                    >
                      <span className={`${isActive ? "text-[#731b31]" : "clay-text-muted"}`}>
                        {item.icon}
                      </span>
                      
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="ml-3 text-sm font-medium whitespace-nowrap overflow-hidden"
                          >
                            {item.title}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar footer - Logout button */}
        <div className="p-4 border-t border-white/40">
          <button
            onClick={handleSignOut}
            className={`flex items-center w-full rounded-[20px] px-3 py-2 transition-all duration-200 clay-text-title hover:bg-white/40 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="h-5 w-5" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-3 text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  Sign-Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}