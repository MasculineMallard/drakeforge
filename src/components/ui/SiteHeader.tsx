"use client";

import { motion } from "framer-motion";

export default function SiteHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-20 flex flex-col items-center pt-12 pointer-events-none"
    >
      <h1 className="title-glow text-6xl md:text-7xl lg:text-8xl font-serif tracking-wide">
        DrakeForge
      </h1>
      <p className="mt-4 text-lg md:text-xl text-cyan-200/60 italic tracking-wider font-serif">
        Projects forged in the deep
      </p>
    </motion.header>
  );
}
