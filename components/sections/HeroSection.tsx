"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-primary text-primary-foreground"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.3),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(200,230,201,0.2),transparent_60%)]" />
      </div>

      <div className="relative mx-auto flex max-w-content flex-col items-center gap-8 px-section-mobile py-20 text-center lg:flex-row lg:gap-16 lg:px-section-desktop lg:py-32 lg:text-left">
        <motion.div
          className="flex-1 space-y-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-pill bg-secondary/20 px-4 py-1.5 text-sm font-medium text-secondary">
            <BookOpen className="h-4 w-4" />
            Online Quran Classes
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Learn Quran with{" "}
            <span className="text-secondary">Alma E Deen</span>
          </h1>

          <p className="max-w-xl text-lg text-primary-foreground/80">
            Personalized one-on-one Quran lessons — Nazra, Hifz, Tajweed &
            Translation. Learn at your own pace with a dedicated teacher.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button
              size="lg"
              variant="secondary"
              className="min-h-[44px] text-base font-semibold"
              asChild
            >
              <Link href="/enroll">Enroll Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-h-[44px] border-primary-foreground/30 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <Link href="#pricing">
                <Calendar className="mr-2 h-4 w-4" />
                View Schedule
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
        >
          <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-secondary/30 bg-primary-foreground/10 sm:h-80 sm:w-80">
            <div className="flex h-full w-full items-center justify-center">
              <BookOpen className="h-24 w-24 text-secondary/50" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
