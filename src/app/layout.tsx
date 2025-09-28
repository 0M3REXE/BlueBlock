import type { Metadata } from "next";
import { Jost, K2D } from "next/font/google";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["400", "500", "600", "700", "800"],
});

const k2d = K2D({
  subsets: ["latin"],
  variable: "--font-k2d",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BlueBlock",
  description:
    "BlueBlock enables decentralized, verifiable MRV for blue carbon ecosystem restoration in India—transparent data, credible credits, real climate impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jost.variable} ${k2d.variable} antialiased scroll-smooth selection:bg-cyan-300/30 selection:text-white`}
      >
        <div className="relative flex min-h-dvh flex-col overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
