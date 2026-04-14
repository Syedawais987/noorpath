"use client";

import { useState, useEffect, useCallback } from "react";

interface Session {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  dailyRoomUrl: string | null;
  teacher: { name: string };
}

interface AvailSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export function useSchedule() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [slots, setSlots] = useState<AvailSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [sRes, aRes] = await Promise.all([
      fetch("/api/sessions"),
      fetch("/api/availability"),
    ]);
    if (sRes.ok) setSessions((await sRes.json()).sessions || []);
    if (aRes.ok) setSlots((await aRes.json()).slots || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { sessions, slots, loading, refetch: fetchData };
}
