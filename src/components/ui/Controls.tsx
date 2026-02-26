"use client";

import { motion } from "framer-motion";

interface ControlsProps {
  rainActive: boolean;
  onToggleRain: () => void;
  audioPlaying: boolean;
  onToggleAudio: () => void;
}

export default function Controls({
  rainActive,
  onToggleRain,
  audioPlaying,
  onToggleAudio,
}: ControlsProps) {
  return (
    <div className="fixed bottom-8 right-8 z-20 flex flex-col gap-3">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleRain}
        className={`control-btn w-12 h-12 flex items-center justify-center rounded-full ${rainActive ? "!border-cyan-400/50 !bg-cyan-400/10" : ""}`}
        aria-label="Toggle rain"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {rainActive ? (
            <>
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path d="M8 19v1m0-6v1m4 4v1m0-6v1m4 4v1m0-6v1" />
            </>
          ) : (
            <>
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            </>
          )}
        </svg>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleAudio}
        className="control-btn w-12 h-12 flex items-center justify-center rounded-full"
        aria-label="Toggle audio"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {audioPlaying ? (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </>
          ) : (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="22" y1="9" x2="16" y2="15" />
              <line x1="16" y1="9" x2="22" y2="15" />
            </>
          )}
        </svg>
      </motion.button>
    </div>
  );
}
