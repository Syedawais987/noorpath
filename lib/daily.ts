const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_BASE_URL = "https://api.daily.co/v1";

export async function createDailyRoom(sessionId: string): Promise<string> {
  // If no API key, return a placeholder URL for development
  if (!DAILY_API_KEY) {
    console.log("[DEV] No DAILY_API_KEY set — using placeholder room URL");
    return `https://noorpath.daily.co/${sessionId}`;
  }

  const res = await fetch(`${DAILY_BASE_URL}/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      name: `session-${sessionId}`,
      properties: {
        enable_chat: true,
        enable_screenshare: true,
        max_participants: 2,
        exp: Math.floor(Date.now() / 1000) + 86400, // 24h expiry
      },
    }),
  });

  if (!res.ok) {
    console.error("Failed to create Daily.co room:", await res.text());
    return `https://noorpath.daily.co/${sessionId}`;
  }

  const data = await res.json();
  return data.url;
}
