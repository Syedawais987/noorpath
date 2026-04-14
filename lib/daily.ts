export async function createDailyRoom(sessionId: string): Promise<string> {
  // Using Jitsi Meet — free, no API key, no account needed
  const roomName = `noorpath-${sessionId.slice(-12)}`;
  return `https://meet.jit.si/${roomName}`;
}
