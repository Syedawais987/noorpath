export function generateICS({
  title,
  description,
  startTime,
  endTime,
  url,
}: {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  url?: string;
}): string {
  const formatDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const uid = `${Date.now()}@noorpath.com`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NoorPath//Quran Classes//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART:${formatDate(startTime)}`,
    `DTEND:${formatDate(endTime)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}${url ? `\\nJoin: ${url}` : ""}`,
    url ? `URL:${url}` : "",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}
