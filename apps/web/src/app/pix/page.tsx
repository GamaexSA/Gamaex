import type { Metadata } from "next";
import PixPage from "@/components/pix-page";

export const metadata: Metadata = {
  title: "Casa de câmbio em Santiago que aceita Pix",
  description:
    "Pague em reais pelo Pix e receba pesos chilenos ou dólares em dinheiro, na hora. Casa de câmbio em Providencia, Santiago, há 38 anos. Sem trazer dinheiro do Brasil.",
  keywords: [
    "casa de câmbio Santiago Pix",
    "câmbio Chile Pix",
    "pagar com Pix no Chile",
    "trocar reais em Santiago",
    "câmbio Providencia reais",
    "casa de câmbio Santiago do Chile",
    "onde trocar dinheiro em Santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/pix",
    languages: {
      "pt-BR": "https://www.gamaex.cl/pix",
      "es-CL": "https://www.gamaex.cl",
      "x-default": "https://www.gamaex.cl/pix",
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.gamaex.cl/pix",
    siteName: "Gamaex Chile",
    title: "Casa de câmbio em Santiago que aceita Pix | Gamaex",
    description:
      "Pague com Pix em reais e receba pesos chilenos ou dólares em dinheiro, na hora. Em Providencia, a poucos passos do metrô Pedro de Valdivia.",
  },
};

// FAQPage JSON-LD en portugués — para que los motores de IA (AI Overviews, ChatGPT,
// Perplexity) y Google citen a Gamaex como la respuesta a "casa de câmbio Santiago Pix".
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: "pt-BR",
  mainEntity: [
    {
      "@type": "Question",
      name: "A Gamaex aceita Pix?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. Na Gamaex você paga em reais pelo Pix e recebe na hora, em dinheiro, a moeda que quiser — pesos chilenos, dólares ou outra. É feito presencialmente na loja em Av. Pedro de Valdivia 020, Providencia, Santiago do Chile.",
      },
    },
    {
      "@type": "Question",
      name: "Como funciona o câmbio com Pix na Gamaex?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Você vem até a loja em Providencia, escaneia o QR code e paga em reais pelo Pix, direto do seu banco no Brasil. Na mesma hora recebe em dinheiro a moeda que escolher.",
      },
    },
    {
      "@type": "Question",
      name: "Posso receber dólares em vez de pesos chilenos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. Você escolhe a moeda que quer receber: pesos chilenos, dólares e mais de 40 moedas.",
      },
    },
    {
      "@type": "Question",
      name: "O câmbio com Pix é só presencial?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. O pagamento com Pix é feito presencialmente na loja da Gamaex em Providencia, escaneando o QR code, e você retira o dinheiro em espécie na hora.",
      },
    },
    {
      "@type": "Question",
      name: "Onde fica a Gamaex em Santiago?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Av. Pedro de Valdivia 020, Providencia, Santiago do Chile, ao lado da saída do metrô Pedro de Valdivia (Linha 1). Atende de segunda a sexta das 9h às 17h e sábado das 9h às 13h.",
      },
    },
    {
      "@type": "Question",
      name: "Vale a pena trocar reais no Chile com Pix?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. Trocando com Pix na Gamaex você não precisa trazer dinheiro em espécie do Brasil, recebe na hora e evita as tarifas do cartão internacional, numa casa de câmbio com 38 anos de trajetória e loja física em Providencia.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PixPage />
    </>
  );
}
