import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enroll in Online Quran Classes",
  description:
    "Enroll for one-on-one online Quran classes with Alma E Deen — Nazra, Hifz, Tajweed or Translation. Flexible scheduling for students worldwide.",
  alternates: { canonical: "/enroll" },
  openGraph: {
    title: "Enroll in Online Quran Classes | NoorPath",
    description:
      "Start your Quran journey with personalized one-on-one classes. Choose Nazra, Hifz, Tajweed, or Translation.",
    url: "/enroll",
    type: "website",
  },
};

export default function EnrollLayout({ children }: { children: React.ReactNode }) {
  return children;
}
