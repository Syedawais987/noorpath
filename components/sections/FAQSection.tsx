"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What do I need to get started?",
    answer:
      "All you need is a stable internet connection, a device with a camera and microphone (phone, tablet, or computer), and the desire to learn. No special software or app download is required — classes happen right in your browser.",
  },
  {
    question: "What age groups do you teach?",
    answer:
      "I teach students of all ages — from children as young as 5 to adults. Each lesson is tailored to the student's age, level, and learning pace.",
  },
  {
    question: "How long is each session?",
    answer:
      "Sessions are available in 30-minute, 45-minute, or 60-minute formats. The recommended duration depends on the student's age and course type. We'll decide what works best during enrollment.",
  },
  {
    question: "Can I reschedule or cancel a class?",
    answer:
      "Yes, you can reschedule or cancel a session up to 12 hours before the scheduled time. Last-minute cancellations may count as a completed session.",
  },
  {
    question: "How do I pay for classes?",
    answer:
      "Pakistani students can pay via JazzCash or EasyPaisa. International students can pay via Stripe (credit/debit card). Monthly invoices are generated and you can view your payment history in your dashboard.",
  },
  {
    question: "Do you offer group classes?",
    answer:
      "Currently, all classes are one-on-one for the best learning experience. Group classes may be introduced in the future based on demand.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="flex w-full min-h-[44px] items-center justify-between py-4 text-left font-medium text-foreground transition-colors hover:text-primary"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 flex-shrink-0 text-muted transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-muted">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-content px-section-mobile lg:px-section-desktop">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <h2 className="font-display text-3xl font-bold text-primary lg:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Got questions? Here are the most common ones. Feel free to reach out if
            you need more info.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-12 max-w-3xl"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.05 }}
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
