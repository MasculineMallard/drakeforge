import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DrakeForge",
  description: "Projects forged by Drake",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
