"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section id="cta" className="bg-primary py-16 text-primary-foreground lg:py-24">
      <div className="mx-auto max-w-content px-section-mobile lg:px-section-desktop">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <h2 className="font-display text-3xl font-bold lg:text-4xl">
            Start Your Quran Journey Today
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Take the first step towards learning the Quran. Enrollment is quick, and
            your first session can be scheduled within 24 hours.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              variant="secondary"
              className="min-h-[44px] text-base font-semibold"
              asChild
            >
              <Link href="/enroll">
                Enroll Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
