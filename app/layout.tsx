import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600"],
  variable: "--font-inter" 
});

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "600"],
  variable: "--font-cormorant" 
});

export const metadata: Metadata = {
  title: "Muhammad Zain-ul-Abedin | AI / ML Developer",
  description: "Portfolio of Muhammad Zain-ul-Abedin, a Computer Science student and AI/ML developer specializing in deep learning, full-stack systems, and smart data-driven applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} font-sans selection:bg-black selection:text-white`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

