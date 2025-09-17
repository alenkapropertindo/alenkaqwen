"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  // Default styling for fixed position (used on public pages)
  const defaultClassName = "fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm border border-purple-500/20 hover:bg-purple-900/50 transition-all duration-300"
  
  // Sidebar styling (used in sidebar)
  const sidebarClassName = "bg-gray-100 dark:bg-gray-800/50 border border-purple-300 dark:border-purple-500/20 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all duration-300"

  const combinedClassName = className 
    ? className 
    : defaultClassName

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className={combinedClassName}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-purple-600 dark:text-purple-400" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-purple-600 dark:text-purple-400" />
    </Button>
  )
}