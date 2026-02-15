import type { Metadata } from "next";
import { Inter, Barlow_Condensed, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const barlow = Barlow_Condensed({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-barlow" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Titan University",
  description: "University Portal System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${barlow.variable} ${playfair.variable} font-display bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center p-4 relative overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
