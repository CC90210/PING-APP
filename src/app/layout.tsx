import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Ping — Never Let a Relationship Go Cold",
  description:
    "Ping monitors every connection and tells you exactly who needs your attention — and what to say. AI-powered relationship management for people who care.",
  openGraph: {
    title: "Ping — Never Let a Relationship Go Cold",
    description:
      "AI-powered relationship management for people who care.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
