"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  links: SidebarLink[];
}

export function Sidebar({ links }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border lg:bg-surface">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="font-display text-xl font-bold text-primary">NoorPath</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-card px-3 py-2 text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-primary text-primary-foreground"
                : "text-muted hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
