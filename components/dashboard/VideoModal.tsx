"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoModalProps {
  url: string;
  onClose: () => void;
}

export function VideoModal({ url, onClose }: VideoModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
