"use client";

import { motion } from "framer-motion";
import { EnrollIcon, ScheduleIcon, LearnIcon } from "@/components/ui/custom-icons";

const steps = [
  {
    icon: <EnrollIcon />,
    number: "1",
    title: "Enroll",
    description:
      "Fill out a quick enrollment form with your details, learning goals, and preferred schedule.",
  },
  {
    icon: <ScheduleIcon />,
    number: "2",
    title: "Schedule",
    description:
      "Once approved, book your class times from available slots that suit your timezone.",
  },
  {
    icon: <LearnIcon />,
    number: "3",
    title: "Learn",
    description:
      "Join live one-on-one sessions directly from your browser. No app download needed.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-surface py-16 lg:py-24">
      <div className="mx-auto max-w-content px-section-mobile lg:px-section-desktop">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <h2 className="font-display text-3xl font-bold text-primary lg:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Getting started is simple. Three easy steps to begin your Quran journey.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="relative text-center"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.08 }}
            >
              {index < steps.length - 1 && (
                <div className="absolute left-[calc(50%+40px)] top-8 hidden h-0.5 w-[calc(100%-80px)] bg-border sm:block" />
              )}

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {step.icon}
              </div>

              <div className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                {step.number}
              </div>

              <h3 className="mt-3 font-display text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
