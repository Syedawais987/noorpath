"use client";

import { cn } from "@/lib/utils";

function getStrength(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak" };
  if (score <= 2) return { score, label: "Fair" };
  if (score <= 3) return { score, label: "Good" };
  if (score <= 4) return { score, label: "Strong" };
  return { score, label: "Very Strong" };
}

const colorMap: Record<string, string> = {
  Weak: "bg-destructive",
  Fair: "bg-orange-400",
  Good: "bg-yellow-400",
  Strong: "bg-accent",
  "Very Strong": "bg-primary",
};

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const { score, label } = getStrength(password);

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-pill transition-colors",
              i < score ? colorMap[label] : "bg-border",
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
