import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Campaña BNB x Tokenizados - Gana 0.002 BNB",
  description:
    "Publica en X sobre Tokenizados y gana 0.002 BNB. Solo para los primeros 5 usuarios. Participa ahora en nuestra campaña promocional.",
  keywords:
    "BNB, Tokenizados, blockchain, Web3, campaña, recompensas, Twitter, X",
  openGraph: {
    title: "Campaña BNB x Tokenizados",
    description: "Publica en X y gana 0.002 BNB - Solo 5 usuarios",
    url: "https://tokenizados.net",
    siteName: "Tokenizados",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Campaña BNB x Tokenizados",
    description: "Publica en X y gana 0.002 BNB - Solo 5 usuarios",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
