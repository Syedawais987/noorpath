"use client";

import { useEffect, useMemo } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoModalProps {
  url: string;
  onClose: () => void;
}

function isValidDailyUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname.endsWith(".daily.co");
  } catch {
    return false;
  }
}

export function VideoModal({ url, onClose }: VideoModalProps) {
  const isValid = useMemo(() => isValidDailyUrl(url), [url]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isValid) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
        <div className="text-center text-white">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <p className="mt-4 text-lg font-medium">Invalid video link</p>
          <p className="mt-2 text-sm text-white/70">This class link is not valid. Please contact your teacher.</p>
          <Button variant="outline" className="mt-4" onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 z-50 text-white hover:bg-white/20"
        onClick={onClose}
        aria-label="Close video"
      >
        <X className="h-6 w-6" />
      </Button>
      <iframe
        src={url}
        className="h-full w-full"
        allow="camera; microphone; fullscreen; display-capture"
        style={{ border: "none" }}
        title="Live Class — NoorPath"
      />
    </div>
  );
}
