import type { Metadata } from "next";
import { Amiri, Plus_Jakarta_Sans, Noto_Nastaliq_Urdu } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "./globals.css";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const urdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-urdu",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NoorPath — Learn Quran Online with Alma E Deen",
  description:
    "Personalized one-on-one Quran lessons online. Learn Nazra, Hifz, Tajweed, and Translation with a certified teacher. Enroll today.",
  keywords: [
    "Quran classes online",
    "learn Quran",
    "Nazra",
    "Hifz",
    "Tajweed",
    "Quran translation",
    "online Quran teacher",
    "Alma E Deen",
    "NoorPath",
  ],
  openGraph: {
    title: "NoorPath — Learn Quran Online with Alma E Deen",
    description:
      "Personalized one-on-one Quran lessons. Nazra, Hifz, Tajweed & Translation. Enroll today.",
    type: "website",
    locale: "en_US",
    siteName: "NoorPath",
  },
  twitter: {
    card: "summary_large_image",
    title: "NoorPath — Learn Quran Online",
    description:
      "Personalized one-on-one Quran lessons with a certified teacher. Enroll today.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${amiri.variable} ${jakarta.variable} ${urdu.variable} font-body antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
