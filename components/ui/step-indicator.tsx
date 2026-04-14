"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-secondary text-secondary-foreground",
                  !isCompleted && !isCurrent && "bg-border text-muted",
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  "hidden text-xs sm:block",
                  isCurrent ? "font-medium text-foreground" : "text-muted",
                )}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mb-4 hidden h-0.5 w-8 sm:block lg:w-16",
                  isCompleted ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
