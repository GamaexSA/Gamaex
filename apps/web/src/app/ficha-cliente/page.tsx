import type { Metadata } from "next";
import FichaClienteForm from "./ficha-cliente-form";

export const metadata: Metadata = {
  title: "Ficha de cliente — Regístrate y sube tus antecedentes",
  description:
    "Regístrate como cliente de Gamaex y sube tus antecedentes de forma segura para tu evaluación. Casa de cambio en Providencia con 38 años de trayectoria.",
  alternates: { canonical: "https://www.gamaex.cl/ficha-cliente" },
  // El formulario recoge datos personales/KYC: no debe indexarse.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <FichaClienteForm />;
}
