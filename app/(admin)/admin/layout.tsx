import {
  Home, Users, Calendar, TrendingUp, BookOpenCheck, CreditCard,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
  { href: "/admin/students", label: "Students", icon: <Users className="h-5 w-5" /> },
  { href: "/admin/schedule", label: "Schedule", icon: <Calendar className="h-5 w-5" /> },
  { href: "/admin/progress", label: "Progress", icon: <TrendingUp className="h-5 w-5" /> },
  { href: "/admin/assignments", label: "Assignments", icon: <BookOpenCheck className="h-5 w-5" /> },
  { href: "/admin/payments", label: "Payments", icon: <CreditCard className="h-5 w-5" /> },
];

const bottomNavLinks = navLinks.slice(0, 5);

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || session.user.role !== "TEACHER") redirect("/login");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar links={navLinks} />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-secondary/30 bg-primary/5 px-4 backdrop-blur-sm lg:px-8">
          <Link href="/admin" className="font-display text-lg font-bold text-primary lg:hidden">
            NoorPath
          </Link>
          <span className="hidden text-sm font-medium text-primary lg:block">
            Admin Panel — {session.user.name}
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
