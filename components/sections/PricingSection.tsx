"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Per Session",
    price: "1,500",
    currency: "PKR",
    period: "/ session",
    description: "Pay as you go — perfect for trying out or irregular schedules",
    features: [
      "One-on-one live session",
      "30-minute class",
      "Session notes & feedback",
      "Progress tracking",
      "Flexible scheduling",
    ],
    popular: false,
  },
  {
    name: "Monthly",
    price: "8,000",
    currency: "PKR",
    period: "/ month",
    description: "Best value — 8 sessions per month for consistent learning",
    features: [
      "8 live sessions / month",
      "45-minute classes",
      "Session notes & feedback",
      "Progress tracking",
      "Priority scheduling",
      "WhatsApp support",
      "Homework & assignments",
    ],
    popular: true,
  },
  {
    name: "International",
    price: "40",
    currency: "USD",
    period: "/ month",
    description: "For students outside Pakistan — same great learning experience",
    features: [
      "8 live sessions / month",
      "45-minute classes",
      "Session notes & feedback",
      "Progress tracking",
      "Priority scheduling",
      "WhatsApp support",
      "Homework & assignments",
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
            Simple, transparent pricing. No hidden fees. Choose the plan that works
            for you.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.05 }}
            >
              <Card
                className={`relative h-full ${plan.popular ? "border-2 border-secondary shadow-lg" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="secondary">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-sm text-muted">{plan.currency} </span>
                    <span className="font-display text-4xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
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
                    variant={plan.popular ? "secondary" : "default"}
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
