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
  title: "Oceans English",
  description:
    "An immersive ocean-themed English learning experience for young people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jost.variable} ${k2d.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
