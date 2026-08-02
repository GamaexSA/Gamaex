import type { Metadata } from "next";
import HazteClienteForm from "./hazte-cliente-form";

export const metadata: Metadata = {
  title: "Hazte cliente | Gamaex — Casa de cambio en Providencia",
  description:
    "Regístrate como cliente de Gamaex y opera divisas, transferencias internacionales y pago de tarjetas de crédito. Déjanos tus datos y te contactamos para validar el registro.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/hazte-cliente" },
};

export default function Page() {
  return <HazteClienteForm />;
}
