"use client";

import { useMemo } from "react";

interface Star {
  top: string;
  left: string;
  duration: number;
  maxOpacity: number;
  delay: number;
}

export default function Starfield() {
  const stars = useMemo(() => {
    const starArray: Star[] = [];
    for (let i = 0; i < 100; i++) {
      starArray.push({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: 2 + Math.random() * 4,
        maxOpacity: 0.3 + Math.random() * 0.7,
        delay: Math.random() * 3,
      });
    }
    return starArray;
  }, []);

  return (
    <div className="starfield">
      {stars.map((star, index) => (
        <div
          key={index}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            ["--max-opacity" as string]: star.maxOpacity,
          }}
        />
      ))}
    </div>
  );
}
