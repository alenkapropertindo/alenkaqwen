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
      <div className="md:hidden sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-purple-200 dark:border-purple-900 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="bg-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Alenka
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800 hover:text-purple-900 dark:hover:text-purple-100 rounded-lg"
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
              className="absolute top-full left-0 right-0 overflow-hidden bg-white dark:bg-gray-900 border-b border-purple-200 dark:border-purple-900 shadow-lg"
            >
              <nav className="p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                          <div
                            className={`flex items-center rounded-lg px-3 py-3 transition-all duration-200 ${
                              isActive
                                ? "bg-purple-600 dark:bg-purple-900 text-white dark:text-purple-100 shadow-md shadow-purple-500/20"
                                : "text-gray-700 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-800/50"
                            }`}
                          >
                            <span className={isActive ? "text-white dark:text-purple-200" : "text-purple-600 dark:text-purple-400"}>
                              {item.icon}
                            </span>
                            <span className="ml-3 font-medium">{item.title}</span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                  <li className="pt-2 mt-2 border-t border-purple-100 dark:border-purple-800/50">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full rounded-lg px-3 py-3 transition-all duration-200 text-gray-700 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-800/50"
                    >
                      <LogOut className="h-5 w-5 text-purple-600 dark:text-purple-400" />
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
        className={`hidden md:flex h-screen sticky top-0 flex-col bg-white dark:bg-gray-900 border-r border-purple-200 dark:border-purple-900 z-50`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-200 dark:border-purple-900">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <div className="bg-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
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
              className="text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800 hover:text-purple-900 dark:hover:text-purple-100 rounded-lg"
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
                      className={`flex items-center rounded-lg px-3 py-2 transition-all duration-200 ${
                        isActive
                          ? "bg-purple-600 dark:bg-purple-900 text-white dark:text-purple-100 shadow-lg shadow-purple-500/20 dark:shadow-purple-900/50"
                          : "text-gray-700 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-800/50 hover:text-purple-900 dark:hover:text-purple-50"
                      }`}
                    >
                      <span className={`${isActive ? "text-white dark:text-purple-200" : "text-purple-600 dark:text-purple-400"}`}>
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
        <div className="p-4 border-t border-purple-200 dark:border-purple-900">
          <button
            onClick={handleSignOut}
            className={`flex items-center w-full rounded-lg px-3 py-2 transition-all duration-200 text-gray-700 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-800/50 hover:text-purple-900 dark:hover:text-purple-50 ${
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