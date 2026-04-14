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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Alma E Deen",
      jobTitle: "Quran Teacher",
      description:
        "Certified Quran teacher offering personalized online classes in Nazra, Hifz, Tajweed, and Translation.",
      knowsLanguage: ["English", "Urdu"],
    },
    {
      "@type": "EducationalOrganization",
      name: "NoorPath",
      description:
        "Online Quran teaching platform offering personalized one-on-one lessons in Nazra, Hifz, Tajweed, and Translation.",
      url: process.env.NEXT_PUBLIC_APP_URL || "https://noorpath.vercel.app",
    },
  ],
};

export default function Home() {
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
