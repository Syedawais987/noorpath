export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://noorpath-seven.vercel.app";

export const SITE_NAME = "NoorPath";
export const SITE_TAGLINE = "Learn Quran Online with Alma E Deen";
export const TEACHER_NAME = "Alma E Deen";
export const SITE_DESCRIPTION =
  "Personalized one-on-one online Quran classes — Nazra, Hifz, Tajweed, and Translation with a certified teacher. Flexible timings for students worldwide.";

export const SITE_KEYWORDS = [
  "online Quran classes",
  "learn Quran online",
  "Quran teacher online",
  "online Nazra classes",
  "online Hifz classes",
  "Hifz online",
  "Tajweed classes online",
  "Quran translation classes",
  "Tafseer classes online",
  "Quran for kids",
  "Quran for beginners",
  "female Quran teacher",
  "Quran academy online",
  "one-on-one Quran classes",
  "Pakistani Quran teacher",
  "Alma E Deen",
  "NoorPath",
];

export const TWITTER_HANDLE = "@noorpath";

export function absoluteUrl(path = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;
}
