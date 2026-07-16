"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { LubbLogo } from "@/components/ui/lubb-logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  HelpCircle,
  Trophy,
  Users,
  UserCircle,
  Settings,
} from "lucide-react";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/dashboard/lessons", label: "Lessons", icon: BookOpen },
  { href: "/dashboard/quizzes", label: "Quizzes", icon: HelpCircle },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/dashboard/community", label: "Community", icon: Users },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col py-4">
      <div className="flex items-center justify-between px-4 mb-6">
        <Link href="/dashboard">
          <LubbLogo showText textSize="sm" />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-500",
                pathname === link.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <Separator className="my-4" />
      <div className="px-3 space-y-2">
        <div className="flex justify-center">
          <ThemeSwitcher />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-sm">{user?.email}</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 border-r bg-sidebar md:block lg:w-64">
        <SidebarContent />
      </aside>

      <Sheet>
        <SheetTrigger className="fixed left-2 top-3 z-50 md:hidden">
          <Button variant="ghost" size="icon">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 md:p-6 pt-16 md:pt-6">{children}</div>
      </main>
    </div>
  );
}
