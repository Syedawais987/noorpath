export const WHATSAPP_NUMBER = "923326000051";

export const DEFAULT_CONTACT_MESSAGE =
  "Assalamu Alaikum, I'm interested in learning Quran with NoorPath. Could you please share more details about the courses and timings?";

export function whatsappUrl(message: string = DEFAULT_CONTACT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
