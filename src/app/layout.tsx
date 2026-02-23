import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ping — Never Let a Relationship Go Cold",
  description:
    "AI-powered relationship intelligence. Track, nurture, and strengthen every connection.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: "#2563EB",
          colorBackground: "#FFFFFF",
          colorText: "#0F172A",
          colorInputBackground: "#F8FAFC",
          borderRadius: "0.75rem",
        },
        elements: {
          formButtonPrimary:
            "bg-blue-600 hover:bg-blue-700 text-white font-medium",
          card: "shadow-xl border border-gray-100",
          headerTitle: "text-xl font-bold",
          headerSubtitle: "text-gray-500",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
