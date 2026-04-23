import { Injectable } from "@nestjs/common";
import { RatesService } from "../rates/rates.service";

@Injectable()
export class AiService {
  constructor(private readonly rates: RatesService) {}

  async getRatesForAi() {
    const publicRates = await this.rates.getPublicRates();
    return {
      ...publicRates,
      business_context: this.getBusinessContext(),
    };
  }

  getBusinessContext() {
    return {
      business_name: "Gamaex Chile — Inversiones y Turismo Gamaex Chile S.A.",
      location: "Av. Pedro de Valdivia 020, Providencia, Santiago, Chile",
      metro: "Metro Pedro de Valdivia (Línea 1)",
      parking: "Estacionamiento subterráneo disponible para clientes",
      hours: {
        lunes_viernes: "9:00 - 17:30",
        sabado: "9:00 - 13:00",
        domingo: "Cerrado",
      },
      phone: "+56 2 2946 2670",
      email: "contacto@gamaex.cl",
      services: [
        "Cambio de divisas (más de 40 monedas disponibles)",
        "Transferencias internacionales (enviar y recibir)",
        "Pago a proveedores en moneda extranjera",
        "Cajas privadas para operaciones de mayor monto con discreción",
      ],
      note_large_amounts:
        "Para montos mayores a USD 5.000 se aplica tasa preferencial — consultar directamente.",
      established: "1988 — 38 años de trayectoria en Providencia",
      compliance:
        "Entidad regulada por la Unidad de Análisis Financiero (UAF) de Chile",
      instruction:
        "Los precios de compra y venta son definitivos. Nunca calcules ni inventes tasas: usa solo los valores del campo 'rates'. Si una moneda no aparece, indica que no está disponible actualmente.",
    };
  }
}
