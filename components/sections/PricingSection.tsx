"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NazraIcon, HifzIcon, TajweedIcon, TranslationIcon } from "@/components/ui/custom-icons";

const courses = [
  {
    name: "Nazra",
    icon: <NazraIcon />,
    pricePKR: "10,000",
    priceUSD: "50",
    period: "/ month",
    schedule: "Mon – Fri",
    duration: "30 min / session",
    description: "Daily Quran reading classes — build fluency with consistent practice",
    features: [
      "5 classes per week (Mon–Fri)",
      "30-minute sessions",
      "One-on-one with teacher",
      "Pronunciation correction",
      "Session notes & feedback",
      "Progress tracking",
      "WhatsApp support",
    ],
    popular: true,
  },
  {
    name: "Hifz",
    icon: <HifzIcon />,
    pricePKR: "20,000",
    priceUSD: "100",
    period: "/ month",
    schedule: "Mon – Fri",
    duration: "45 min / session",
    description: "Intensive memorization program with structured revision plans",
    features: [
      "5 classes per week (Mon–Fri)",
      "45-minute sessions",
      "Memorization plan & milestones",
      "Daily revision tracking",
      "Sabaq, Sabqi & Manzil system",
      "Session notes & feedback",
      "WhatsApp support",
    ],
    popular: false,
  },
  {
    name: "Tajweed",
    icon: <TajweedIcon />,
    pricePKR: "15,000",
    priceUSD: "75",
    period: "/ month",
    schedule: "3x per week",
    duration: "45 min / session",
    description: "Master the rules of beautiful Quran recitation",
    features: [
      "3 classes per week",
      "45-minute sessions",
      "Makhaarij & Sifaat practice",
      "Rule-by-rule progression",
      "Audio feedback on recitation",
      "Session notes & feedback",
      "WhatsApp support",
    ],
    popular: false,
  },
  {
    name: "Translation",
    icon: <TranslationIcon />,
    pricePKR: "8,000",
    priceUSD: "40",
    period: "/ month",
    schedule: "2x per week",
    duration: "45 min / session",
    description: "Understand what you recite — word-by-word meaning & tafseer",
    features: [
      "2 classes per week",
      "45-minute sessions",
      "Word-by-word translation",
      "Basic tafseer discussion",
      "Vocabulary building",
      "Session notes & feedback",
      "WhatsApp support",
    ],
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="bg-surface py-16 lg:py-24">
      <div className="mx-auto max-w-content px-section-mobile lg:px-section-desktop">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <h2 className="font-display text-3xl font-bold text-primary lg:text-4xl">
            Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Choose the course that matches your learning goals. All classes are
            one-on-one with personalized attention.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {courses.map((course, index) => (
            <motion.div
              key={course.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.05 }}
            >
              <Card
                className={`relative h-full ${course.popular ? "border-2 border-secondary shadow-lg" : ""}`}
              >
                {course.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="secondary">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-card bg-accent">
                      {course.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <p className="text-xs text-muted">
                        {course.schedule} · {course.duration}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-3">
                    <div>
                      <span className="text-xs text-muted">PKR </span>
                      <span className="font-display text-3xl font-bold text-foreground">
                        {course.pricePKR}
                      </span>
                    </div>
                    <span className="text-muted">|</span>
                    <div>
                      <span className="text-xs text-muted">USD </span>
                      <span className="font-display text-xl font-bold text-foreground">
                        {course.priceUSD}
                      </span>
                    </div>
                    <span className="text-sm text-muted">{course.period}</span>
                  </div>
                  <CardDescription className="mt-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {course.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full min-h-[44px]"
                    variant={course.popular ? "secondary" : "default"}
                    asChild
                  >
                    <Link href="/enroll">Enroll Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
