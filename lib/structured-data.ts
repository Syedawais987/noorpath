import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  TEACHER_NAME,
  absoluteUrl,
} from "./seo";

const LOGO_URL = absoluteUrl("/icon.svg");

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "NoorPath Quran Academy",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: LOGO_URL,
    image: absoluteUrl("/icon.svg"),
    foundingDate: "2025",
    founder: { "@type": "Person", name: TEACHER_NAME },
    areaServed: { "@type": "Place", name: "Worldwide" },
    knowsLanguage: ["English", "Urdu", "Arabic"],
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+92-332-6000051",
      availableLanguage: ["en", "ur"],
      areaServed: "Worldwide",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
  };
}

export function teacherPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#teacher`,
    name: TEACHER_NAME,
    jobTitle: "Quran Teacher",
    description:
      "Certified Quran teacher offering personalized online classes in Nazra, Hifz, Tajweed, and Translation.",
    knowsLanguage: ["English", "Urdu", "Arabic"],
    worksFor: { "@id": `${SITE_URL}/#organization` },
  };
}

interface CourseInput {
  name: string;
  description: string;
  pricePKR: string;
  priceUSD: string;
  schedule: string;
  duration: string;
}

export function courseSchema(course: CourseInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${course.name} — Online Quran Course`,
    description: course.description,
    provider: { "@id": `${SITE_URL}/#organization` },
    educationalLevel: "All levels",
    inLanguage: ["en", "ur"],
    courseMode: "online",
    isAccessibleForFree: false,
    teaches: course.name,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseSchedule: {
        "@type": "Schedule",
        repeatFrequency: course.schedule,
        duration: course.duration,
      },
      instructor: { "@id": `${SITE_URL}/#teacher` },
    },
    offers: [
      {
        "@type": "Offer",
        price: course.pricePKR.replace(/,/g, ""),
        priceCurrency: "PKR",
        category: "Subscription",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/#pricing`,
      },
      {
        "@type": "Offer",
        price: course.priceUSD,
        priceCurrency: "USD",
        category: "Subscription",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/#pricing`,
      },
    ],
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
