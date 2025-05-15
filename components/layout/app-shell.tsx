"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  FlaskConical, 
  BookOpen, 
  Wrench, 
  User, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  Moon,
  Sun
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Experimente", href: "/experiments", icon: FlaskConical },
    { name: "Bio-Tools", href: "/tools", icon: Wrench },
    { name: "Ausbildung", href: "/training", icon: BookOpen },
  ]

  const userNavigation = [
    { name: "Profil", href: "#", icon: User },
    { name: "Einstellungen", href: "#", icon: Settings },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar for mobile */}
      <div className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card">
          <div className="flex items-center justify-between px-4 h-16 border-b">
            <span className="font-semibold text-primary text-xl">LabnoteX</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="px-2 py-4">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    pathname.startsWith(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="mt-10">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Benutzer
              </p>
              <nav className="mt-2 space-y-1">
                {userNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                ))}
                <button
                  className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                  Abmelden
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex w-64 flex-col">
          <div className="flex min-h-0 flex-1 flex-col border-r bg-card">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <span className="font-semibold text-primary text-xl">LabnoteX</span>
              </div>
              <nav className="mt-5 flex-1 space-y-1 px-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      pathname.startsWith(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex flex-shrink-0 border-t p-4">
              <div className="flex flex-1 items-center">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium">Max Mustermann</p>
                  <p className="text-xs text-muted-foreground">Labor Biologie</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="relative z-10 flex h-16 flex-shrink-0 border-b bg-background">
          <button
            type="button"
            className="border-r px-4 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Sidebar öffnen</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1"></div>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleTheme}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                <div className="relative ml-3">
                  <div className="flex rounded-full bg-primary text-primary-foreground">
                    <Button variant="default" size="sm">
                      <LogOut className="h-4 w-4 mr-2" />
                      Abmelden
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex flex-1 overflow-hidden">
          <div className="flex flex-1 flex-col overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
