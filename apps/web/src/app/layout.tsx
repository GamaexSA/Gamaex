import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gamaex Chile — Casa de Cambio",
  description:
    "Compra y venta de más de 40 divisas. Las mejores tasas en Providencia, Santiago. Sin comisiones ocultas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
