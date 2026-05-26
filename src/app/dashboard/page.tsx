"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { NexoLogo } from "@/components/ui/nexo-logo";
import {
  Flame,
  BookOpen,
  HelpCircle,
  Trophy,
  Upload,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/auth");
      else setUser(data.user);
    });
  }, [router]);

  if (!user) return null;

  const stats = [
    {
      label: "Current Streak",
      value: "0",
      icon: Flame,
      note: "Start learning today!",
    },
    {
      label: "Lessons Completed",
      value: "0",
      icon: BookOpen,
      note: null,
    },
    {
      label: "Quizzes Passed",
      value: "0",
      icon: HelpCircle,
      note: null,
    },
    {
      label: "Global Rank",
      value: "—",
      icon: Trophy,
      note: "Complete a lesson to rank",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14 ring-2 ring-border">
          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg">
            {user.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-heading text-2xl font-bold">
            Welcome back
            {user.user_metadata?.full_name
              ? `, ${user.user_metadata.full_name}`
              : ""}
          </h1>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Level 1 Learner</span> · 0 XP
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    {stat.note && (
                      <p className="text-xs text-muted-foreground">
                        {stat.note}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="font-heading">Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload your study materials to get started, or jump straight into AI
            chat.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/files"
              className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <Upload className="h-4 w-4" />
              Upload Files
            </Link>
            <Link
              href="/dashboard/chat"
              className="btn-outline inline-flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <MessageSquare className="h-4 w-4" />
              Start Chatting
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
