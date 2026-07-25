import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import { Nav } from "@/components/Nav";
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
  title: "Amigão — Sistema da Borracharia",
  description: "Envio de ordens de serviço e notas fiscais para lançamento remoto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden">
          <div className="relative h-[65vmin] w-[65vmin] opacity-[0.08] grayscale mix-blend-luminosity">
            <Image src="/logo.jpg" alt="" fill className="object-contain" priority />
          </div>
        </div>
        <Nav />
        {children}
        <footer className="border-t border-brand-800 py-6 text-center text-xs font-medium tracking-wide text-brand-300">
          Confiança que roda com você.
        </footer>
      </body>
    </html>
  );
}
