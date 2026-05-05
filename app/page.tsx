import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { CoursesSection } from "@/components/sections/CoursesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import {
  organizationSchema,
  websiteSchema,
  teacherPersonSchema,
  courseSchema,
  faqSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Online Quran Classes — Nazra, Hifz, Tajweed & Translation",
  description:
    "Personalized one-on-one online Quran classes with Alma E Deen. Learn Nazra, Hifz, Tajweed and Translation from a certified female teacher. Flexible timings, students worldwide.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "NoorPath — Online Quran Classes with Alma E Deen",
    description:
      "Personalized one-on-one online Quran classes — Nazra, Hifz, Tajweed and Translation. Learn from a certified teacher with flexible scheduling.",
    url: "/",
    type: "website",
  },
};

const courses = [
  {
    name: "Nazra",
    description:
      "Daily one-on-one Quran reading classes — build fluency with consistent practice (Mon–Fri, 30 min sessions).",
    pricePKR: "10,000",
    priceUSD: "50",
    schedule: "P1W",
    duration: "PT30M",
  },
  {
    name: "Hifz",
    description:
      "Intensive memorization program with structured revision plans — Sabaq, Sabqi & Manzil system (Mon–Fri, 45 min sessions).",
    pricePKR: "20,000",
    priceUSD: "100",
    schedule: "P1W",
    duration: "PT45M",
  },
  {
    name: "Tajweed",
    description:
      "Master the rules of beautiful Quran recitation — Makhaarij, Sifaat and rule-by-rule progression (3x/week, 45 min sessions).",
    pricePKR: "15,000",
    priceUSD: "75",
    schedule: "P1W",
    duration: "PT45M",
  },
  {
    name: "Translation",
    description:
      "Word-by-word Quran translation with basic tafseer discussion and vocabulary building (2x/week, 45 min sessions).",
    pricePKR: "8,000",
    priceUSD: "40",
    schedule: "P1W",
    duration: "PT45M",
  },
];

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

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      websiteSchema(),
      teacherPersonSchema(),
      ...courses.map(courseSchema),
      faqSchema(faqs),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <AboutSection />
          <CoursesSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <PricingSection />
          <FAQSection />
          <CTASection />
        </main>
        <Footer />
        <WhatsAppButton />
        <ScrollToTop />
      </div>
    </>
  );
}
