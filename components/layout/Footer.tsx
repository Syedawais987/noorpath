import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-content px-section-mobile py-12 lg:px-section-desktop">
        <div className="flex flex-col items-center gap-4 text-center">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-display text-xl font-bold">NoorPath</span>
          </Link>
          <p className="text-sm text-primary-foreground/70">
            Quran Teaching Platform by Alma E Deen
          </p>
          <p className="text-xs text-primary-foreground/50">
            &copy; {new Date().getFullYear()} NoorPath. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
