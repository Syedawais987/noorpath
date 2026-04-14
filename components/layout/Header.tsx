"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-section-mobile lg:px-section-desktop">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold text-primary">NoorPath</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
