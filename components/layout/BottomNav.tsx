"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface BottomNavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavProps {
  links: BottomNavLink[];
}

export function BottomNav({ links }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface lg:hidden">
      <div className="flex items-center justify-around">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
              pathname === link.href
                ? "text-primary"
                : "text-muted hover:text-primary",
            )}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
