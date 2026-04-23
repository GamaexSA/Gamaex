import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gamaex Admin",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
