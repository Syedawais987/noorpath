import {
  Home, Calendar, TrendingUp, BookOpenCheck, CreditCard, UserCircle,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { href: "/dashboard", label: "Home", icon: <Home className="h-5 w-5" /> },
  { href: "/dashboard/schedule", label: "Schedule", icon: <Calendar className="h-5 w-5" /> },
  { href: "/dashboard/progress", label: "Progress", icon: <TrendingUp className="h-5 w-5" /> },
  { href: "/dashboard/assignments", label: "Tasks", icon: <BookOpenCheck className="h-5 w-5" /> },
  { href: "/dashboard/payments", label: "Payments", icon: <CreditCard className="h-5 w-5" /> },
  { href: "/dashboard/profile", label: "Profile", icon: <UserCircle className="h-5 w-5" /> },
];

const bottomNavLinks = navLinks.slice(0, 5);

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar links={navLinks} />

      <div className="flex flex-1 flex-col">
        {/* Top bar (mobile + desktop) */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-sm lg:px-8">
          <Link href="/dashboard" className="font-display text-lg font-bold text-primary lg:hidden">
            NoorPath
          </Link>
          <span className="hidden text-sm text-muted lg:block">
            Welcome, {session.user.name}
          </span>
          <NotificationBell />
        </header>

        <main className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      <BottomNav links={bottomNavLinks} />
    </div>
  );
}
