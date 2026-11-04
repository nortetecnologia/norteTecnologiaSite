import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from "@/contexts/CartContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Norte Tecnologia — Informática e Serviços",
    template: "%s | Norte Tecnologia",
  },
  description:
    "Computadores, notebooks, periféricos, impressoras e serviços técnicos de informática. Atendimento presencial e por WhatsApp.",
  keywords: [
    "informática",
    "computadores",
    "notebooks",
    "periféricos",
    "manutenção",
    "norte tecnologia",
  ],
  openGraph: {
    title: "Norte Tecnologia — Informática e Serviços",
    description:
      "Computadores, notebooks, periféricos, impressoras e serviços técnicos de informática.",
    type: "website",
    locale: "pt_BR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
