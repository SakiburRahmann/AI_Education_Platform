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

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/chat", label: "AI Chat", icon: "💬" },
  { href: "/dashboard/files", label: "My Files", icon: "📁" },
  { href: "/dashboard/lessons", label: "Lessons", icon: "📖" },
  { href: "/dashboard/quizzes", label: "Quizzes", icon: "✍️" },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: "🏆" },
  { href: "/dashboard/community", label: "Community", icon: "🌐" },
  { href: "/dashboard/profile", label: "Profile", icon: "👤" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
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
      <Link href="/dashboard" className="px-4 mb-6">
        <span className="text-xl font-bold">
          Edu<span className="text-primary">AI</span>
        </span>
      </Link>
      <nav className="flex-1 space-y-1 px-3">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      <Separator className="my-4" />
      <div className="px-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={handleSignOut}
        >
          <Avatar className="h-6 w-6">
            <AvatarFallback>
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
      <aside className="hidden w-64 border-r bg-background md:block">
        <SidebarContent />
      </aside>

      <Sheet>
        <SheetTrigger
          className="fixed left-4 top-4 z-50 md:hidden"
        >
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
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
